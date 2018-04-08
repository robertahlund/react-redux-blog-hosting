import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import PropTypes from "prop-types";
import {Loading} from "./Loading";
import CommentForm from "./CommentForm";
import {CommentDetail} from "./CommentDetail";
import {CommentFooter} from "./CommentFooter";

const db = firebase.firestore();

export default class Comments extends Component {
  state = {
    comments: [],
    loading: true,
    commentsToDisplay: 3
  };

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]),
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
    const {loading, comments, commentsToDisplay} = this.state;
    const {auth, postId, handleCommentCollapseFromChild} = this.props;
    return (
      <div className="comment-section">
        <CommentForm
          postId={postId}
          auth={auth}
          getComments={this.getComments}
        />
        <div className="comments">
          <Loading display={loading}/>
          {comments.map((comment, index) => {
            if (index > commentsToDisplay - 1) {
              return null;
            } else {
              return (
                <CommentDetail
                  comment={comment}
                  key={index}
                />
              );
            }
          })}
          <CommentFooter
            commentsToDisplay={commentsToDisplay}
            comments={comments}
            loading={loading}
            handleCommentCollapseFromChild={handleCommentCollapseFromChild}
            handleCommentPaginationIncrease={this.handleCommentPaginationIncrease}
            handleCommentPaginationDecrease={this.handleCommentPaginationDecrease}/>
        </div>
      </div>
    );
  }
}
