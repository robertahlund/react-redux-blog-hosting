import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import firebase from '../firebaseConfig';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    }
  }

  componentWillReceiveProps = () => {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      const userNameForUrl = firebase.auth().currentUser.email.split('@')[0];
      this.setState({
        username: userNameForUrl
      })
    }
  };

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('you are logged out.')
    }).catch(error => {
      console.log(error)
    });
  };

  render() {
    return (
      <nav className="menu">
        <div className="inner">
          <div className="logo">
            <span className="jam jam-book"></span>
            <span><Link to="/">Placeholder</Link></span>
          </div>
          <ul>
            {this.props.auth ? (
              <li><Link to="/new-post">Create new
                post</Link></li>
            ) : (
              null
            )}
            {this.props.auth ? (
              <li><Link to={`/blog/${this.state.username}`}>Show all
                posts</Link></li>
            ) : (
              null
            )}
            <li>Browse users?</li>
            <li>User profile?</li>
            {!this.props.auth ? (
              <li><Link to="/login">Log in</Link></li>
            ) : (
              <li onClick={this.handleLogout}><a>Log out</a></li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default Menu;
