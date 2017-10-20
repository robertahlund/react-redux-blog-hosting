import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

const db = firebase.firestore();

//TODO handle comments

class AllPosts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allPosts: [],
      allPostsClone: [],
      loading: true
    }
  }

  componentDidMount = () => {
    console.log(this.props.match.params.user, 'param')
    let allPosts = [];
    const authorToGetPostsFrom = this.props.match.params.user;
    const databaseRef = db.collection('posts').where('author', '==', authorToGetPostsFrom);
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
          loading: false
        })
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
      });
  };

  render() {
    return (
      <section className="all-posts">
        <header className="header">
          <span className="jam jam-document"></span>
          <h1>All posts</h1>
        </header>
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
              <div className="post-footer">
                <a className="comments">{post.comments ? post.comments.length + ' comments' : '0 comments'}</a>
                <span className="time">{/*Posted by <a>{post.author}</a>*/} {post.time}</span>
              </div>
            </div>
          );
        })}
      </section>
    );
  }
}

export default AllPosts;
