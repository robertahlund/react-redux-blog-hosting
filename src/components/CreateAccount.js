import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: '',
        name: '',
        photoURL: ''
      }
    }
  }

  handleFormChange = (event) => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  createAccount = () => {
    const userName = this.state.form.username;
    const userPassword = this.state.form.password;
    const userRealName = this.state.form.name;
    const userProfilePicture = this.state.form.photoURL;
    firebase.auth().createUserWithEmailAndPassword(userName, userPassword)
      .then(() => {
        const user = firebase.auth().currentUser;
        user.updateProfile({
          displayName: userRealName,
          photoURL: userProfilePicture
        }).then(() => {
          console.log('User successfully created.')
        }).catch(error => {
          console.log(error)
        });
      })
      .catch(error => {
        console.log(error);
      });
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
            <label htmlFor="name">Name</label>
            <input id="name" type="text" data-change="name" value={this.state.form.name}
                   onChange={this.handleFormChange} className="new-post-input" placeholder="John Doe"/>
            <label htmlFor="photoURL">Profile</label>
            <input id="photoURL" type="text" data-change="photoURL" value={this.state.form.photoURL}
                   onChange={this.handleFormChange} className="new-post-input" placeholder="https://image.com/image.png"/>
            <label htmlFor="username">Username</label>
            <input id="username" type="text" data-change="username" value={this.state.form.username}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" data-change="password" value={this.state.form.password}
                   onChange={this.handleFormChange}
                   className="new-post-input"/>
            <button type="button" onClick={this.createAccount} className="button button-align-right">Log in</button>
          </form>
        </div>
      </section>
    );
  }
}

export default CreateAccount;
