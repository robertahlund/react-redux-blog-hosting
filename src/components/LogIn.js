import React, {Component} from 'react';
import {Link} from 'react-router-dom'
import firebase from '../firebaseConfig';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: ''
      }
    };
  }

  handleFormChange = (event) => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  handleLogin = () => {
    const userName = this.state.form.username;
    const userPassword = this.state.form.password;
    firebase.auth().signInWithEmailAndPassword(userName, userPassword)
      .catch(error => {
        console.log(error)
      })
  };

  render() {
    console.log(this.props)
    return (
      <section className="new-post">
        <header className="header">
          <span className="jam jam-padlock"></span>
          <h1>Log in</h1>
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
            <div className="log-in-form-bottom">
              <Link to="/create-account">Create an account</Link>
              <button type="button" onClick={this.handleLogin} className="button log-in-button">Log in</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
