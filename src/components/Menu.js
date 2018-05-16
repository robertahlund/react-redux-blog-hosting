import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import firebase from "../firebaseConfig";
import PropTypes from "prop-types";
import "../css/Menu.css";

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
            <span>
              <NavLink to="/">Blog</NavLink>
            </span>
          </div>
          <ul>
            {auth ? (
              <li>
                <NavLink to="/new-post/" activeStyle={{ fontWeight: 800 }}>
                  Create new post
                </NavLink>
              </li>
            ) : null}
            {auth ? (
              <li>
                <NavLink
                  to={`/blog/${uid}/${info.blogName}`}
                  activeStyle={{ fontWeight: 800 }}
                >
                  Show all posts
                </NavLink>
              </li>
            ) : null}
            <li>
              <NavLink to={"/browse/"} activeStyle={{ fontWeight: 800 }}>
                Browse blogs
              </NavLink>
            </li>
            {auth ? (
              <li>
                <NavLink to={`/user/${uid}`} activeStyle={{ fontWeight: 800 }}>
                  Profile
                </NavLink>
              </li>
            ) : null}
            {!auth ? (
              <li>
                <NavLink to="/login/" activeStyle={{ fontWeight: 800 }}>
                  Log in
                </NavLink>
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
