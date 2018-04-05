import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

const db = firebase.firestore();

export default class CreateAccount extends Component {
  state = {
    form: {
      email: '',
      password: '',
      name: '',
      blogName: ''
    }
  };

  handleFormChange = event => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  createAccount = async () => {
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
    }
    catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <section className="new-post">
        <header className="header">
          <span className="jam jam-user"></span>
          <h1>Create an account</h1>
        </header>
        <div className="new-post-form">
          <form>
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" data-change="name" value={this.state.form.name}
                   onChange={this.handleFormChange} className="new-post-input" placeholder="Name Lastname"/>
            <label htmlFor="name">Name your blog</label>
            <input id="blogname" type="text" data-change="blogName" value={this.state.form.blogName}
                   onChange={this.handleFormChange} className="new-post-input" placeholder="En kass blogg"/>
            <label htmlFor="username">Email</label>
            <input id="username" type="text" data-change="email" value={this.state.form.email}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" data-change="password" value={this.state.form.password}
                   onChange={this.handleFormChange}
                   className="new-post-input"/>
            <button type="button" onClick={this.createAccount} className="button button-align-right">Create account
            </button>
          </form>
        </div>
      </section>
    );
  }
}
