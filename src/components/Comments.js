import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import PropTypes from "prop-types";
import {Loading} from "./Loading";
import CommentForm from "./CommentForm";
import {CommentDetail} from "./CommentDetail";
import {CommentFooter} from "./CommentFooter";
import {FeedbackMessage} from "./FeedbackMessage";

const db = firebase.firestore();

export default class Comments extends Component {
  state = {
    comments: [],
    loading: true,
    commentsToDisplay: {
      startIndex: 0,
      endIndex: 3,
      currentPage: 1,
      totalPages: 0
    },
    message: {
      type: '',
      text: ''
    },
    timeoutId: null
  };

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    postId: PropTypes.string.isRequired,
    handleCommentCollapseFromChild: PropTypes.func.isRequired
  };

  componentDidMount = async () => {
    await this.getComments()
  };

  getComments = async () => {
    const {postId} = this.props;
    const databaseRef = db.collection('posts').doc(postId);
    const querySnapshot = await databaseRef.get();
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
      loading: false,
      commentsToDisplay: {
        startIndex: 0,
        endIndex: 3,
        currentPage: 1,
        totalPages: Math.ceil(sortByTime.length / 3)
      }
    })
  };

  handleCommentPaginationIncrease = () => {
    this.setState(prevState => ({
      commentsToDisplay: {
        startIndex: prevState.commentsToDisplay.startIndex + 3,
        endIndex: prevState.commentsToDisplay.endIndex + 3,
        currentPage: prevState.commentsToDisplay.currentPage + 1,
        totalPages: prevState.commentsToDisplay.totalPages
      }
    }))
  };

  handleCommentPaginationDecrease = () => {
    this.setState(prevState => ({
      commentsToDisplay: {
        startIndex: prevState.commentsToDisplay.startIndex - 3,
        endIndex: prevState.commentsToDisplay.endIndex - 3,
        currentPage: prevState.commentsToDisplay.currentPage - 1,
        totalPages: prevState.commentsToDisplay.totalPages
      }
    }))
  };

  handleFeedbackMessage = message => {
    const {timeoutId} = this.state;
    this.setState(message, () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      const messageTimeout = setTimeout(() => {
        this.setState({
          message: {
            type: '',
            text: ''
          }
        });
      }, 3000);
      this.setState({
        timeoutId: messageTimeout
      });
    });
  };

  render() {
    const {loading, comments, commentsToDisplay, message} = this.state;
    const {auth, postId, handleCommentCollapseFromChild} = this.props;
    return (
      <div className="comment-section">
        <CommentForm
          postId={postId}
          auth={auth}
          getComments={this.getComments}
          handleFeedbackMessage={this.handleFeedbackMessage}
        />
        <FeedbackMessage message={message}/>
        <div className="comments">
          <Loading display={loading}/>
          {comments.map((comment, index) => {
            if (index >= commentsToDisplay.startIndex && index <= commentsToDisplay.endIndex - 1) {
              return (
                <CommentDetail
                  comment={comment}
                  key={index}
                />
              );
            } else {
              return null;
            }
          })}
          <CommentFooter
            commentsToDisplay={commentsToDisplay}
            comments={comments}
            loading={loading}
            handleCommentCollapseFromChild={handleCommentCollapseFromChild}
            handleCommentPaginationIncrease={this.handleCommentPaginationIncrease}
            handleCommentPaginationDecrease={this.handleCommentPaginationDecrease}
          />
        </div>
      </div>
    );
  }
}
