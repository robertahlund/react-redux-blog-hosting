import React, { Component } from "react";
import PropTypes from "prop-types";
import "../css/CommentForm.css";
import { bindActionCreators } from "redux";
import * as postActions from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

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
    postId: PropTypes.string.isRequired
  };

  componentDidMount = () => {
    this.setState({
      postId: this.props.postId
    });
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
    const { handleFeedbackMessage } = this.props;
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
    const { createNewComment } = this.props;
    await createNewComment(postId, newComment);
    this.setState({
      loading: false,
      form: {
        title: "",
        content: ""
      }
    });
  };

  render() {
    console.log(this.props);
    const { auth } = this.props;
    const { loading } = this.state;
    if (auth) {
      return (
        <form>
          <h3>Post a comment</h3>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            data-change="title"
            placeholder="Title"
            value={this.state.form.title}
            onChange={this.handleFormChange}
            className="new-post-input"
          />
          <label htmlFor="content">Comment</label>
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
          <button
            type="button"
            onClick={this.submitPost}
            className="button new-post-button"
          >
            {loading && <span className="loader-button-comment" />}
            Submit comment
          </button>
        </form>
      );
    } else return null;
  }
}

function mapStateToProps(state) {
  console.log(state, "STATE");
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
