import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import "./css/App.css";
import firebase from "./firebaseConfig";
import "firebase/firestore";
import Menu from "./components/Menu";
import NewBlogPost from "./components/NewBlogPost";
import AllPosts from "./components/AllPosts";
import Login from "./components/LogIn";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import UserProfile from "./components/UserProfile";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as authActions from "./actions/authActions";
import BrowseBlogs from "./components/BrowseBlogs";

const db = firebase.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

class App extends Component {
  componentDidMount = async () => {
    console.log(this.props, "props");
    await this.setAuthObserver();
  };

  static propTypes = {
    authentication: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
      .isRequired
  };

  setAuthObserver = async () => {
    const { userLogin, userLogout } = this.props;
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          const databaseRef = db.collection("users").doc(user.uid);
          const userData = await databaseRef.get();
          if (userData.exists) {
            const userInformation = user;
            userInformation.userData = userData.data();
            const { uid, displayName, email } = userInformation;
            const info = userInformation.userData;
            userLogin({ uid, info, displayName, email });
          } else {
            userLogout();
          }
        } catch (error) {
          userLogout();
        }
      } else {
        userLogout();
      }
    });
  };

  render() {
    const { auth } = this.props.authentication;
    return (
      <div className="App">
        <Menu auth={auth} />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route
            path="/login/"
            render={props => (!auth ? <Login /> : <Redirect to="/" />)}
          />
          <Route
            path="/create-account/"
            render={props => (!auth ? <CreateAccount /> : <Redirect to="/" />)}
          />
          <Route
            path="/new-post/"
            render={props =>
              auth ? (
                <NewBlogPost {...props} auth={auth} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            exact
            path="/blog/:uid/:blogName/:search?/:searchWord?"
            render={props => <AllPosts {...props} auth={auth} />}
          />
          <Route
            exact
            path="/user/:uid"
            render={props => <UserProfile {...props} auth={auth} />}
          />
          <Route
            exact
            path="/browse/"
            render={props => <BrowseBlogs {...props} auth={auth} />}
          />
        </Switch>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.authentication
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(authActions, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
