import React, { Component } from "react";
import { Header } from "./Header";
import { CreateAccountForm } from "./CreateAccountForm";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as authActions from "../actions/authActions";
import { bindActionCreators } from "redux";

class CreateAccount extends Component {
  state = {
    form: {
      email: "",
      password: "",
      name: "",
      blogName: ""
    },
    message: {
      type: "",
      text: ""
    },
    loading: false
  };

  componentDidMount = () => {
    document.title = "Create an account";
    //TODO implement
    // const getUser = await db.collection('users').where('blogName', '==', 'asyncc mastery').get();
    // console.log(getUser.empty)
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
    const { name, blogName } = this.state.form;
    if (name.length === 0) {
      throw new Error("Name cannot be empty.");
    } else if (blogName.length === 0) {
      throw new Error("Your blog has to have a name.");
    }
  };

  createAccount = async () => {
    const { createAccount } = this.props;
    this.setState({
      loading: true
    });
    try {
      await this.validateInputs();
    } catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        },
        loading: false
      });
      return;
    }
    const { email, password, name } = this.state.form;
    const blogName = this.state.form.blogName.split(/\s/).join("-");
    try {
      await createAccount(email, password, name, blogName);
    } catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        },
        loading: false
      });
    }
  };

  render() {
    const { name, blogName, email, password } = this.state.form;
    const { message, loading } = this.state;
    return (
      <section className="new-post">
        <Header iconName="jam jam-user" headerText="Create an account" />
        <CreateAccountForm
          name={name}
          handleFormChange={this.handleFormChange}
          blogName={blogName}
          email={email}
          password={password}
          message={message}
          createAccount={this.createAccount}
          loading={loading}
        />
      </section>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(authActions, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(CreateAccount));
