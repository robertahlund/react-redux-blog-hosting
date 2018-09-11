import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/CommentForm.css";
import { bindActionCreators } from "redux";
import * as postActions from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FeedbackMessage } from "./FeedbackMessage";

class CommentForm extends Component {
  state = {
    form: {
      title: "",
      content: ""
    },
    postId: "",
    loading: false
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    postId: PropTypes.string.isRequired,
    message: PropTypes.object.isRequired,
    commentToEdit: PropTypes.object,
    handleFeedbackMessage: PropTypes.func.isRequired,
    comments: PropTypes.array.isRequired
  };

  componentDidMount = () => {
    const { postId } = this.props;
    this.setState({
      postId: postId
    });
  };

  //TODO om du kollar på någon annans profil, och sedan trycker för att redigera din egen profil så kommmer den
  // föregåendes profilinfoermation vara ifylld

  componentDidUpdate = prevProps => {
    const { commentToEdit } = this.props;
    if (commentToEdit && prevProps.commentToEdit !== commentToEdit) {
      this.setState({
        form: {
          title: commentToEdit.title,
          content: commentToEdit.content.join("\n")
        }
      });
    }
  };

  handleFormChange = event => {
    const target = event.target.getAttribute("data-change");
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  validateInputs = async () => {
    const { title, content } = this.state.form;
    if (title.length === 0) {
      throw new Error("Title cannot be empty.");
    } else if (content.length === 0) {
      throw new Error("Comment cannot be empty.");
    }
  };

  submitPost = async () => {
    this.setState({
      loading: true
    });
    const { handleFeedbackMessage, commentToEdit } = this.props;
    try {
      await this.validateInputs();
    } catch (error) {
      handleFeedbackMessage({
        message: {
          type: "error",
          text: error.message
        }
      });
      this.setState({
        loading: false
      });
      return;
    }
    const postId = this.state.postId;
    const { name, uid } = this.props.auth.info;
    const newComment = {
      title: this.state.form.title,
      content: this.state.form.content,
      author: name,
      authorUid: uid,
      time: new Date().toLocaleString()
    };
    if (commentToEdit) {
      const { comments } = this.props;
      const commentsCopy = JSON.parse(JSON.stringify(comments));
      const { editComment, postId } = this.props;
      const { form } = this.state;
      const updatedComments = commentsCopy.map((comment, index) => {
        if (index !== commentToEdit.index) {
          return comment;
        }
        return {
          ...comment,
          title: form.title,
          content: form.content.split("\n")
        };
      });
      try {
        await editComment(postId, updatedComments);
      } catch (error) {
        console.log(error);
      }
    } else {
      const { createNewComment } = this.props;
      await createNewComment(postId, newComment);
    }

    this.setState({
      loading: false,
      form: {
        title: "",
        content: ""
      }
    });
    handleFeedbackMessage({
      message: {
        type: "success",
        text: `${
          commentToEdit
            ? "Your comment was successfully updated."
            : "Your comment was successfully posted."
        }`
      }
    });
  };

  render() {
    const { auth, message, commentToEdit } = this.props;
    const { loading } = this.state;
    if (auth) {
      return (
        <form>
          {commentToEdit ? <h3>Edit a comment</h3> : <h3>Post a comment</h3>}
          <label htmlFor="title">Title</label>
          <div className="input-container">
            <input
              id="title"
              type="text"
              data-change="title"
              placeholder="Title"
              value={this.state.form.title}
              onChange={this.handleFormChange}
              className="new-post-input"
            />
          </div>
          <label htmlFor="content">Comment</label>
          <div className="input-container">
            <textarea
              name="content"
              data-change="content"
              id="content"
              rows="3"
              placeholder="This is content."
              value={this.state.form.content}
              onChange={this.handleFormChange}
              className="new-post-textarea"
            />
          </div>
          <FeedbackMessage message={message} />
          <button
            type="button"
            onClick={this.submitPost}
            className="button new-post-button"
          >
            {loading && <span className="loader-button-comment" />}
            {commentToEdit ? "Edit comment" : "Submit comment"}{" "}
          </button>
        </form>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  return {
    allPosts: state.posts.allPosts,
    allPostsClone: state.posts.allPostsClone
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommentForm)
);
