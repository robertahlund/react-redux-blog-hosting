import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

const db = firebase.firestore();

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: ''
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
    console.log(userName, userPassword)
    firebase.auth().createUserWithEmailAndPassword(userName, userPassword)
      .catch(error => {
        console.log(error);
      });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user, '----')
      } else {
        console.log('ingen inloggad')
      }
    });
  };

  render() {
    console.log(this.props)
    return (
      <section className="new-post">
        <header className="header">
          <span className="jam jam-user"></span>
          <h1>Create an account</h1>
        </header>
        <div className="new-post-form">
          <form>
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
