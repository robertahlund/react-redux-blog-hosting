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
      searchValue: ''
    }
  }

  componentDidMount = () => {
    console.log(this.props.match.params.uid, 'uid param');
    let allPosts = [];
    const authorToGetPostsFrom = this.props.match.params.uid;
    const databaseRef = db.collection('posts').where('authorUid', '==', authorToGetPostsFrom);
    databaseRef
      .get()
      .then(querySnapshot => {
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
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
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
    })
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
        const {title, tags, content} = post;
        return (
          title.toLowerCase().includes(searchValueLower) ||
          tags.includes(searchValueLower)
        )
      });
      this.setState({
        allPosts: findPosts,
        searchResultLength: findPosts.length
      });
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

  render() {
    return (
      <section className="all-posts">
        <header className="header">
          <span className="jam jam-document"></span>
          <h1>All posts</h1>
        </header>
        <div className="search-container">
          {this.state.searchResultLength > 0 && this.state.searchResultLength !== this.state.allPostsClone.length ?
            (<p>{"Found " + this.state.searchResultLength + " results."}</p>)
            :
            (null)}
          <input type="text" onChange={this.handleSearchInput} onKeyDown={this.handleSearch}
                 value={this.state.searchValue}
                 className={this.state.searchOpen ? 'search-input' : 'hidden-input'}
                 placeholder="Search for tags and titles."/>
          <span className="jam jam-search" onClick={this.toggleSearch}></span>
        </div>
        {this.state.loading ? (<div className="loader"></div>) : null}
        {this.state.allPosts.map((post, index) => {
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
                  <span className={this.state.commentsToLoad === post.id ? 'jam jam-angle-top' : 'jam jam-angle-top' +
                    ' rotate'}></span>
                </a>
                <span className="time">{/*Posted by <a>{post.author}</a>*/} {post.time}</span>
              </div>
              {this.state.commentsToLoad === post.id &&
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
                  handleCommentCollapsFromChild={this.handleCommentCollapseFromChild}
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
