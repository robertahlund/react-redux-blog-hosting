import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebaseConfig";
import { Header } from "./Header";
import { FeedbackMessage } from "./FeedbackMessage";
import "../css/LogIn.css";

export default class Login extends Component {
  state = {
    form: {
      username: "",
      password: ""
    },
    message: {
      type: "",
      text: ""
    },
    loading: false
  };

  componentDidMount = () => {
    document.title = "Log in";
  };

  handleFormChange = event => {
    const target = event.target.getAttribute("data-change");
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  handleLogin = async () => {
    const userName = this.state.form.username;
    const userPassword = this.state.form.password;
    this.setState({
      message: {
        type: "",
        text: ""
      },
      loading: true
    });
    try {
      await firebase.auth().signInWithEmailAndPassword(userName, userPassword);
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

  componentWillUnmount = () => {
    this.setState({
      message: {
        type: "",
        text: ""
      }
    });
  };

  render() {
    const { username, password } = this.state.form;
    const { message } = this.state;
    const { loading } = this.state;
    return (
      <section className="new-post">
        <Header iconName="jam jam-padlock" headerText="Log in" />
        <div className="new-post-form">
          <form>
            <label htmlFor="username">Email</label>
            <div className="input-container">
              <input
                id="username"
                type="text"
                data-change="username"
                value={username}
                onChange={this.handleFormChange}
                className="new-post-input"
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className="input-container">
              <input
                id="password"
                type="password"
                data-change="password"
                value={password}
                onChange={this.handleFormChange}
                className="new-post-input"
              />
            </div>
            <div className="log-in-form-bottom">
              <FeedbackMessage message={message} />
              <div className="log-in-action-container">
                <Link to="/create-account">Create an account</Link>
                <button
                  type="button"
                  onClick={this.handleLogin}
                  className="button log-in-button"
                >
                  {loading && <span className="loader-button" />}
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    );
  }
}
