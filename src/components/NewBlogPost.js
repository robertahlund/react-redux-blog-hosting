import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import * as postActions from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { NewBlogPostForm } from "./NewBlogPostForm";
import "../css/NewBlogPost.css";

class NewBlogPost extends Component {
  state = {
    form: {
      title: "",
      tags: "",
      content: [],
      comments: [],
      author: "",
      authorUid: ""
    },
    author: "",
    authorUid: "",
    message: {
      type: "",
      text: ""
    },
    loading: false
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  componentDidMount = () => {
    const { postToEdit } = this.props;
    if (postToEdit) {
      document.title = "Edit post";
      this.setFormValues(postToEdit);
    } else {
      document.title = "Create a new post";
    }
    const { displayName, uid } = this.props.auth;
    this.setState({
      author: displayName,
      authorUid: uid
    });
  };

  setFormValues = post => {
    this.setState({
      form: {
        title: post.title,
        tags: post.tags.map(tag => `#${tag} `).join(""),
        content: post.content.join("\n"),
        comments: post.comments,
        author: post.author,
        authorUid: post.authorUid
      }
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

  validateInputs = () => {
    const { title, content } = this.state.form;
    if (title.length === 0) {
      throw new Error("Title cannot be empty.");
    } else if (content.length === 0) {
      throw new Error("Content cannot be empty.");
    }
  };

  formatFormValues = () => {
    const formValues = this.state.form;
    console.log(formValues.tags);
    formValues.tags = formValues.tags
      .trim()
      .split(/\s*#[#\s]*/)
      .join("#")
      .toLowerCase()
      .split("#");
    formValues.tags.splice(0, 1);
    console.log(formValues.tags);
    formValues.content.indexOf("\n") > -1
      ? (formValues.content = formValues.content.split("\n"))
      : (formValues.content = [formValues.content]);
    formValues.time = new Date().toLocaleString();
    formValues.author = this.state.author;
    formValues.authorUid = this.state.authorUid;
    return formValues;
  };

  submitPost = async () => {
    try {
      this.validateInputs();
    } catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        }
      });
      return;
    }
    this.setState({
      loading: true
    });
    const formValues = this.formatFormValues();
    const { createNewBlogPost } = this.props;
    try {
      await createNewBlogPost(formValues);
      this.setState({
        loading: false,
        message: {
          type: "success",
          text: "Successfully created post!"
        },
        form: {
          title: "",
          tags: "",
          content: [],
          comments: [],
          author: "",
          authorUid: ""
        }
      });
    } catch (error) {
      this.setState({
        loading: false,
        message: {
          type: "error",
          text: error.message
        }
      });
    }
  };

  updatePost = async () => {
    const { id } = this.props.postToEdit;
    try {
      this.validateInputs();
    } catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        }
      });
      return;
    }
    this.setState({
      loading: true
    });
    const formValues = this.formatFormValues();
    const { editPostSubmit } = this.props;
    try {
      await editPostSubmit(formValues, id);
      this.setState({
        loading: false,
        message: {
          type: "success",
          text: "Successfully updated post!"
        },
        form: {
          title: "",
          tags: "",
          content: [],
          comments: [],
          author: "",
          authorUid: ""
        }
      });
    } catch (error) {
      this.setState({
        loading: false,
        message: {
          type: "error",
          text: error.message
        }
      });
    }
  };

  render() {
    const { message, loading, form } = this.state;
    const { postToEdit } = this.props;
    console.log(this.props);
    return (
      <NewBlogPostForm
        handleFormChange={this.handleFormChange}
        submitPost={this.submitPost}
        loading={loading}
        message={message}
        form={form}
        postToEdit={postToEdit}
        updatePost={this.updatePost}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    postToEdit: state.posts.postToEdit
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(NewBlogPost)
);
