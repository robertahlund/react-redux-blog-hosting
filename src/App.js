import React, {Component} from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import firebase from './firebaseConfig';
import 'firebase/firestore';
import Menu from "./components/Menu";
import NewBlogPost from "./components/NewBlogPost";
import AllPosts from "./components/AllPosts";
import Login from "./components/LogIn";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";

// const db = firebase.firestore();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        username: '',
        password: ''
      },
      auth: false
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

  handleLogin = () => {
    const userName = this.state.form.username;
    const userPassword = this.state.form.password;
    firebase.auth().signInWithEmailAndPassword(userName, userPassword)
      .then(() => {
        console.log('success????')
      })
      .catch(error => {
        console.log(error)
      })
  };

  handleLogout = () => {
    firebase.auth().signOut().then(() => {
      console.log('you are logged out.')
    }).catch(error => {
      console.log(error)
    });
  };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user, '----')
        this.setState({
          auth: user
        })
      } else {
        console.log('ingen inloggad')
        this.setState({
          auth: false
        })
      }
    });
    // console.log(window.location.pathname)
    // const getUserFromUrl = window.location.pathname.split('/')[2];
    // console.log(getUserFromUrl)
    // window.setTimeout(() => {
    // })


    // const usersRef = db.collection('users');
    // usersRef.add({
    //   first: "Alan",
    //   middle: "Mathison",
    //   last: "Turing",
    //   born: 1912,
    //   categories: {
    //     tech: true,
    //     politics: true
    //   }
    // })
    //   .then(function (result) {
    //     console.log("Document written with ID: ", result.id);
    //   })
    //   .catch(function (error) {
    //     console.error("Error adding document: ", error);
    //   });
    //
    // usersRef.where('categories.tech', '==', true).get()
    //   .then((querySnapshot) => {
    //     console.log(querySnapshot.docs)
    //     querySnapshot.forEach((doc) => {
    //       console.log(doc.data())
    //       console.log(`${doc.id} => ${doc.data()}`);
    //     });
    //   });

  }

  render() {
    return (
      <div className="App">
        <Menu
          auth={this.state.auth}
          handleLogout={this.handleLogout}
        />
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route path="/login" render={props => (
            !this.state.auth ? (
            <Login
              {...props}
              handleLogin={this.handleLogin}
              handleFormChange={this.handleFormChange}
              form={this.state.form}
            />
            ) : (
              <Redirect to="/"/>
            )
          )}/>
          <Route exact path="/create-account" component={CreateAccount}/>
          <Route path="/new-post" component={NewBlogPost}/>
          <Route path="/blog/:user" component={AllPosts}/>
        </Switch>
      </div>
    );
  }
}

export default App;
