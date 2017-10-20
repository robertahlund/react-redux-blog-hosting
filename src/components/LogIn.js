import React, {Component} from 'react';
import {Link} from 'react-router-dom'

class Login extends Component {
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
            <input id="username" type="text" data-change="username" value={this.props.form.username}
                   onChange={this.props.handleFormChange} className="new-post-input"/>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" data-change="password" value={this.props.form.password}
                   onChange={this.props.handleFormChange}
                   className="new-post-input"/>
            <div className="log-in-form-bottom">
              <Link to="/create-account">Create an account</Link>
              <button type="button" onClick={this.props.handleLogin} className="button log-in-button">Log in</button>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default Login;
