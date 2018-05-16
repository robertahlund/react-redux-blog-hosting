import React, { Component } from "react";
import PropTypes from "prop-types";
import { Loading } from "./Loading";
import CommentForm from "./CommentForm";
import { CommentDetail } from "./CommentDetail";
import { CommentFooter } from "./CommentFooter";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as postActions from "../actions/postActions";
import { bindActionCreators } from "redux";

class Comments extends Component {
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
      type: "",
      text: ""
    },
    timeoutId: null
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    postId: PropTypes.string.isRequired,
    handleCommentCollapseFromChild: PropTypes.func.isRequired
  };

  componentDidMount = () => {
    this.getComments();
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      this.getComments();
    }
  };

  getComments = () => {
    const allComments = [];
    this.setState({
      loading: true
    });
    const { allPosts, postId } = this.props;
    const { comments } = JSON.parse(
      JSON.stringify(allPosts.filter(post => post.id === postId)[0])
    );
    comments.forEach(comment => {
      if (typeof comment.content === "string") {
        comment.content = comment.content.split("\n");
      }
      allComments.push(comment);
    });
    const sortByTime = allComments.sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
    this.setState({
      comments: sortByTime,
      loading: false,
      commentsToDisplay: {
        startIndex: 0,
        endIndex: 3,
        currentPage: 1,
        totalPages: Math.ceil(sortByTime.length / 3)
      }
    });
  };

  handleCommentPaginationIncrease = () => {
    this.setState(prevState => ({
      commentsToDisplay: {
        startIndex: prevState.commentsToDisplay.startIndex + 3,
        endIndex: prevState.commentsToDisplay.endIndex + 3,
        currentPage: prevState.commentsToDisplay.currentPage + 1,
        totalPages: prevState.commentsToDisplay.totalPages
      }
    }));
  };

  handleCommentPaginationDecrease = () => {
    this.setState(prevState => ({
      commentsToDisplay: {
        startIndex: prevState.commentsToDisplay.startIndex - 3,
        endIndex: prevState.commentsToDisplay.endIndex - 3,
        currentPage: prevState.commentsToDisplay.currentPage - 1,
        totalPages: prevState.commentsToDisplay.totalPages
      }
    }));
  };

  handleFeedbackMessage = message => {
    const { timeoutId } = this.state;
    this.setState(message, () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const messageTimeout = setTimeout(() => {
        this.setState({
          message: {
            type: "",
            text: ""
          }
        });
      }, 3000);
      this.setState({
        timeoutId: messageTimeout
      });
    });
  };

  render() {
    const { loading, comments, commentsToDisplay, message } = this.state;
    const { auth, postId, handleCommentCollapseFromChild } = this.props;
    return (
      <div className="comment-section">
        <CommentForm
          postId={postId}
          auth={auth}
          getComments={this.getComments}
          handleFeedbackMessage={this.handleFeedbackMessage}
          message={message}
        />
        <div className="comments">
          <Loading display={loading} />
          {comments.map((comment, index) => {
            if (
              index >= commentsToDisplay.startIndex &&
              index <= commentsToDisplay.endIndex - 1
            ) {
              return <CommentDetail comment={comment} key={index} />;
            } else {
              return null;
            }
          })}
          <CommentFooter
            commentsToDisplay={commentsToDisplay}
            comments={comments}
            loading={loading}
            handleCommentCollapseFromChild={handleCommentCollapseFromChild}
            handleCommentPaginationIncrease={
              this.handleCommentPaginationIncrease
            }
            handleCommentPaginationDecrease={
              this.handleCommentPaginationDecrease
            }
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "COMMENTS.js");
  return {
    allPosts: state.posts.allPosts,
    allPostsClone: state.posts.allPostsClone
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Comments)
);
