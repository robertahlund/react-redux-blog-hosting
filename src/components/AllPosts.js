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
    console.log(this.props)
    const postsRef = db.collection('posts');
    let allPosts = [];
    postsRef.onSnapshot(querySnapshot => {
      allPosts = [];
      //console.log(querySnapshot.docs);
      querySnapshot.forEach((doc) => {
        const postData = doc.data();
        postData.id = doc.id;
        allPosts.push(postData);
      });
      const sortByTime = allPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
      console.log(sortByTime);
      this.setState({
        allPosts: sortByTime,
        loading: false
      })
    }, error => {
      console.log(error)
    })
  };

  render() {
    return (
      <section className="all-posts">
        <header className="header">
          <span className="jam jam-document"></span>
          <h1>All posts</h1>
        </header>
        {/*//TODO skapa fin animation*/}
        {this.state.loading ? (<p>Loading</p>) : null}
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
                <span className="time">{post.time}</span>
              </div>
            </div>
          );
        })}
      </section>
    );
  }
}

export default AllPosts;
