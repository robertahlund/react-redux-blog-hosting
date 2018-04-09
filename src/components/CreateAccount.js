import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import {Header} from "./Header";
import {FeedbackMessage} from "./FeedbackMessage";

const db = firebase.firestore();

export default class CreateAccount extends Component {
  state = {
    form: {
      email: '',
      password: '',
      name: '',
      blogName: ''
    },
    message: {
      type: '',
      text: ''
    },
    loading: false
  };

  handleFormChange = event => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  validateInputs = async () => {
    const {name, blogName} = this.state.form;
    if (name.length === 0) {
      throw new Error('Name cannot be empty.');
    } else if (blogName.length === 0) {
      throw new Error('Your blog has to have a name.');
    }
  };

  createAccount = async () => {
    this.setState({
      loading: true
    });
    try {
      await this.validateInputs();
    }
    catch (error) {
      this.setState({
        message: {
          type: 'error',
          text: error.message
        },
        loading: false
      });
      return;
    }
    const {email, password, name} = this.state.form;
    const blogName = this.state.form.blogName.split(/\s/).join("-");
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = firebase.auth().currentUser;
      await user.updateProfile({
        displayName: name
      });
      const userInformation = {
        name: user.displayName,
        uid: user.uid,
        email: user.email,
        blogName: blogName
      };
      const databaseRef = db.collection('users').doc(user.uid);
      await databaseRef.set(userInformation);
      console.log('User successfully created.');
      this.setState({
        message: {
          type: "success",
          text: "Your account was successfully created."
        },
        loading: false
      })
    }
    catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        },
        loading: false
      })
    }
  };

  render() {
    const {name, blogName, email, password} = this.state.form;
    const {message, loading} = this.state;
    return (
      <section className="new-post">
        <Header iconName="jam jam-user" headerText="Create an account"/>
        <div className="new-post-form">
          <form>
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" data-change="name" value={name}
                   onChange={this.handleFormChange} className="new-post-input" placeholder="Name Lastname"/>
            <label htmlFor="name">Name your blog</label>
            <input id="blogname" type="text" data-change="blogName" value={blogName}
                   onChange={this.handleFormChange} className="new-post-input" placeholder="En kass blogg"/>
            <label htmlFor="username">Email</label>
            <input id="username" type="text" data-change="email" value={email}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" data-change="password" value={password}
                   onChange={this.handleFormChange}
                   className="new-post-input"/>
            <FeedbackMessage message={message}/>
            <button type="button" onClick={this.createAccount} className="button button-align-right">
              {loading && <span className="loader-button-comment"/>}
              Create account
            </button>
          </form>
        </div>
      </section>
    );
  }
}
