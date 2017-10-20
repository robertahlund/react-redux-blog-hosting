import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import firebase from '../firebaseConfig';

class Menu extends Component {
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
            <li><Link to="/new-post">Create new
              post</Link></li>
            <li><Link to="/blog/Robert">Show all
              posts</Link></li>
            <li>Item 3</li>
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
