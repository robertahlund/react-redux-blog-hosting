import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

const db = firebase.firestore();

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      loading: true,
      commentsToDisplay: 3
    }
  }

  componentDidMount = async () => {
    const {postId} = this.props;
    const databaseRef = db.collection('posts').doc(postId);
    await databaseRef.onSnapshot(querySnapshot => this.getCommentUpdates(querySnapshot));
  };

  getCommentUpdates = querySnapshot => {
    let allComments = [];
    this.setState({
      loading: true
    });
    allComments = [];
    const postComments = querySnapshot.data().comments;
    postComments.forEach(comment => {
      const comments = comment;
      comments.content = comment.content.split('\n');
      allComments.push(comments);
    });
    const sortByTime = allComments.sort((a, b) => new Date(b.time) - new Date(a.time));
    this.setState({
      comments: sortByTime,
      loading: false
    })

  };

  handleCommentPaginationIncrease = () => {
    this.setState({
      commentsToDisplay: this.state.commentsToDisplay + 3
    })
  };

  handleCommentPaginationDecrease = () => {
    this.setState({
      commentsToDisplay: this.state.commentsToDisplay - 3
    })
  };

  render() {
    // console.log(this.props.postId)
    return (
      <div className="comments">
        {this.state.loading ? (<div className="loader"></div>) : null}
        {this.state.comments.map((comment, index) => {
          if (index > this.state.commentsToDisplay - 1) {
            return null;
          } else {
            return (
              <div className="comment" key={index}>
                <h4 className="comment-title">{comment.title}</h4>
                {comment.content.map((commentContent, index) => {
                  return (
                    <span className="content" key={index}>{commentContent}</span>
                  );
                })}
                <span className="time">Posted by <span
                  className="author">{comment.author}</span> @ {comment.time}</span>
              </div>
            );
          }
        })}
        {this.state.commentsToDisplay >= this.state.comments.length && !this.state.loading ? (
          <p>You've reached the end :( <a onClick={this.props.handleCommentCollapseFromChild}>Close comments</a></p>
        ) : (
          <button type="button" className="button button-align-right"
                  onClick={this.handleCommentPaginationIncrease}>Show more commments
          </button>
        )}
      </div>
    );
  }
}

export default Comments;
