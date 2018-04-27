import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import './css/App.css';
import firebase from './firebaseConfig';
import 'firebase/firestore';
import Menu from "./components/Menu";
import NewBlogPost from "./components/NewBlogPost";
import AllPosts from "./components/AllPosts";
import Login from "./components/LogIn";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import UserProfile from "./components/UserProfile";

const db = firebase.firestore();

export default class App extends Component {
  state = {
    auth: false
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        try {
          const databaseRef = db.collection('users').doc(user.uid);
          const userData = await databaseRef.get();
          if (userData.exists) {
            console.log("Document data:", userData.data());
            const userInformation = user;
            userInformation.userData = userData.data();
            this.setState({
              auth: userInformation
            })
          } else {
            console.log("No such document!");
          }
        }
        catch (error) {
          console.log("Error getting document:", error);
        }
      }
      else {
        console.log('ingen inloggad');
        this.setState({
          auth: false
        })
      }
    });
  };

  render() {
    return (
      <div className="App">
        <Menu
          auth={this.state.auth}
        />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/login" render={props => (
            !this.state.auth ? (
              <Login/>
            ) : (
              <Redirect to="/"/>
            )
          )}/>
          <Route path="/create-account" render={props => (
            !this.state.auth ? (
              <CreateAccount/>
            ) : (
              <Redirect to="/"/>
            )
          )}/>
          <Route path="/new-post" render={props => (
            this.state.auth ? (
              <NewBlogPost
                {...props}
                auth={this.state.auth}
              />
            ) : (
              <Redirect to="/"/>
            )
          )}/>
          <Route exact path="/blog/:uid/:blogName" render={props => (
            <AllPosts
              {...props}
              auth={this.state.auth}/>
          )}/>
          <Route exact path="/user/:uid" render={props => (
            <UserProfile
              {...props}
              auth={this.state.auth}/>
          )}/>
        </Switch>
      </div>
    );
  }
}
