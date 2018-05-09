import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../firebaseConfig";
import PropTypes from "prop-types";

export default class Menu extends Component {
  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  handleLogout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { uid, info } = this.props.auth;
    const { auth } = this.props;
    return (
      <nav className="menu">
        <div className="inner">
          <div className="logo">
            <span className="jam jam-book" />
            <span>
              <Link to="/">Placeholder</Link>
            </span>
          </div>
          <ul>
            {auth ? (
              <li>
                <Link to="/new-post/">Create new post</Link>
              </li>
            ) : null}
            {auth ? (
              <li>
                <Link to={`/blog/${uid}/${info.blogName}`}>Show all posts</Link>
              </li>
            ) : null}
            <li>
              <Link to={"/browse/"}>Browse blogs</Link>
            </li>
            {auth ? (
              <li>
                <Link to={`/user/${uid}`}>Profile</Link>
              </li>
            ) : null}
            {!auth ? (
              <li>
                <Link to="/login/">Log in</Link>
              </li>
            ) : (
              <li onClick={this.handleLogout}>
                <a>Log out</a>
              </li>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}
