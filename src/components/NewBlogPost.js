import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import * as postActions from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { NewBlogPostForm } from "./NewBlogPostForm";

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
    document.title = "Create a new post";
    const { displayName, uid } = this.props.auth;
    this.setState({
      author: displayName,
      authorUid: uid
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
    formValues.tags = formValues.tags
      .split(/\s*#[#\s]*/)
      .join("#")
      .toLowerCase()
      .split("#");
    formValues.tags.splice(0, 1);
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

  render() {
    const { message, loading, form } = this.state;
    return (
      <NewBlogPostForm
        handleFormChange={this.handleFormChange}
        submitPost={this.submitPost}
        loading={loading}
        message={message}
        form={form}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(NewBlogPost));
