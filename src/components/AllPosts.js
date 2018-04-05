import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import CommentForm from "./CommentForm";
import Comments from "./Comments";

const db = firebase.firestore();

class AllPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: [],
      allPostsClone: [],
      loading: true,
      commentsToLoad: '',
      searchOpen: false,
      searchValue: '',
      currentBlogData: {
        blogName: '',
        blogUid: ''
      }
    }
  }

  componentDidMount = async () => {
    this.setState({
      currentBlogData: {
        blogName: this.props.match.params.blogName.split(/[-]/).join(" "),
        blogUid: this.props.match.params.uid
      }
    });
    let allPosts = [];
    const authorToGetPostsFrom = this.props.match.params.uid;
    const databaseRef = db.collection('posts').where('authorUid', '==', authorToGetPostsFrom);
    try {
      const querySnapshot = await databaseRef.get();
      allPosts = [];
      querySnapshot.forEach(doc => {
        const postData = doc.data();
        postData.id = doc.id;
        allPosts.push(postData);
        console.log(doc.id, " => ", doc.data());
      });
      const sortByTime = allPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
      console.log(sortByTime);
      this.setState({
        allPosts: sortByTime,
        loading: false,
        allPostsClone: JSON.parse(JSON.stringify(sortByTime))
      })
    }
    catch (error) {
      console.log("Error getting documents: ", error);
    }
  };

  handleComments = event => {
    //TODO better solution maybe
    const target = event.currentTarget;
    const commentsCanBeCollapsed = target.firstElementChild.className === 'jam jam-angle-top';
    if (commentsCanBeCollapsed) {
      this.setState({
        commentsToLoad: ''
      })
    } else {
      const toggleCommentsWithThisId = target.getAttribute('data-post-id');
      console.log(toggleCommentsWithThisId);
      this.setState({
        commentsToLoad: toggleCommentsWithThisId
      })
    }
  };

  handleCommentCollapseFromChild = () => {
    this.setState({
      commentsToLoad: ''
    })
  };

  toggleSearch = () => {
    this.setState({
      searchOpen: !this.state.searchOpen
    }, () => {
      this.searchInput.focus();
    });
  };

  handleSearchInput = event => {
    const {value} = event.target;
    this.setState({
      searchValue: value
    });
  };

  handleSearch = event => {
    if (event.key === 'Enter') {
      const {searchValue} = this.state;
      const searchValueLower = searchValue.toLowerCase();
      const allPosts = this.state.allPostsClone;
      const findPosts = allPosts.filter(post => {
        const {title, tags} = post;
        return (
          title.toLowerCase().includes(searchValueLower) ||
          tags.includes(searchValueLower)
        )
      });
      this.setState({
        allPosts: findPosts,
        searchResultLength: findPosts.length
      });
      this.closeSearch();
      event.preventDefault();
    }
  };

  handleSearchByTag = event => {
    const {target} = event;
    const searchForThisTag = target.innerText.split('#')[1];
    const allPosts = this.state.allPostsClone;
    const findPosts = allPosts.filter(post => {
      const {tags} = post;
      return (
        tags.includes(searchForThisTag)
      )
    });
    this.setState({
      allPosts: findPosts,
      searchResultLength: findPosts.length
    });
    console.log(findPosts)
  };

  closeSearch = () => {
    this.setState({
      searchOpen: false
    })
  };

  displayAllPosts = () => {
    this.setState({
      allPosts: this.state.allPostsClone,
      searchResultLength: null
    });
  };

  render() {
    const {blogName} = this.state.currentBlogData;
    const {
      searchResultLength, allPostsClone, searchValue,
      searchOpen, loading, allPosts, commentsToLoad
    } = this.state;
    return (
      <section className="all-posts">
        <header className="header">
          <span className="jam jam-document"></span>
          <h1>{blogName}</h1>
        </header>
        <div className="search-container">
          {searchResultLength > 0 && searchResultLength !== allPostsClone.length ?
            (
              <div>
                <p>{"Found " + searchResultLength + " results."}</p>
                <a onClick={this.displayAllPosts}>View all posts</a>
              </div>
            )
            :
            (null)}
          <input type="text" onChange={this.handleSearchInput} onKeyDown={this.handleSearch} onBlur={this.closeSearch}
                 ref={input => this.searchInput = input}
                 value={searchValue}
                 className={searchOpen ? 'search-input' : 'hidden-input'}
                 placeholder="Search for tags and titles."/>
          <span className="jam jam-search" onClick={this.toggleSearch}></span>
        </div>
        {loading ? (<div className="loader"></div>) : null}
        {allPosts.length === 0 && !loading && searchResultLength !== 0 &&
        <p className="center">This user has not posted anything :(</p>}
        {searchResultLength === 0 &&
          <div>
          <p className="center">Your search returned no matches.</p>
            <a className="center" onClick={this.displayAllPosts}>View all posts</a>
          </div>}
        }
        {allPosts.map((post, index) => {
          return (
            <div className="post" key={index} data-post-id={post.id}>
              <h3>{post.title}</h3>
              {post.content.map((paragraph, index) => {
                return (
                  <p key={index}>{paragraph}</p>
                );
              })}
              {post.tags.length > 0 ? (
                <span className="tags">Tags:
                  {post.tags.map((tag, index) => {
                    return (
                      <a key={index} onClick={this.handleSearchByTag}>{' #' + tag}</a>
                    );
                  })}
               </span>
              ) : (null)}
              <div className="post-footer">
                <a data-post-id={post.id}
                   onClick={this.handleComments}>{post.comments ? post.comments.length + ' comments' : '0 comments'}
                  <span className={commentsToLoad === post.id ? 'jam jam-angle-top' : 'jam jam-angle-top' +
                    ' rotate'}></span>
                </a>
                <span className="time">{/*Posted by <a>{post.author}</a>*/} {post.time}</span>
              </div>
              {commentsToLoad === post.id &&
              <div className="comment-section">
                {this.props.auth ?
                  (
                    <CommentForm
                      postId={post.id}
                      auth={this.props.auth}
                    />
                  )
                  :
                  (null)
                }
                <Comments
                  postId={post.id}
                  handleCommentCollapseFromChild={this.handleCommentCollapseFromChild}
                />
              </div>
              }
            </div>
          );
        })}
      </section>
    );
  }
}

export default AllPosts;
