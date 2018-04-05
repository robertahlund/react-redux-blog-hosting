import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import PropTypes from "prop-types";
import {Header} from "./Header";

const db = firebase.firestore();

class UserProfile extends Component {
  state = {
    form: {
      email: '',
      password: '',
      name: '',
      blogName: ''
    }
  };

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired
  };

  componentDidMount = async () => {
    const profileUid = this.props.match.params.uid;
    const databaseRef = db.collection('users').where('uid', '==', profileUid);
    try {
      const userData = await databaseRef.get();
      userData.forEach(user => {
        const {email, name, blogName} = user.data();
        this.setState({
          form: {
            email: email,
            name: name,
            blogName: blogName.split(/[-]/).join(" "),
            password: ''
          }
        });
        console.log(user.id, " => ", user.data());
      });
    }
    catch (error) {
      console.log(error)
    }
  };

  handleFormChange = (event) => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  updateAccountInfo = () => {

  };

  userIsProfileOwner = () => {
    if (this.props.auth && this.props.auth.userData.uid === this.props.match.params.uid) {
      return "Edit your profile"
    } else {
      return this.state.form.name;
    }
  };

  render() {
    return (
      <section className="new-post">
        <Header iconName="jam jam-user" headerText={this.userIsProfileOwner()}/>
        <div className="new-post-form">
          <form autoComplete="off">
            <label htmlFor="name">Full name</label>
            <input id="name" type="text" data-change="name" value={this.state.form.name}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="name">Blog name</label>
            <input id="blogname" type="text" data-change="blogName" value={this.state.form.blogName}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="username">Email</label>
            <input id="username" type="text" data-change="email" value={this.state.form.email}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" data-change="password" value={this.state.form.password}
                   onChange={this.handleFormChange}
                   className="new-post-input"/>
            <button type="button" onClick={this.updateAccountInfo}
                    className="button button-align-right update-profile">Update account information
            </button>
          </form>
        </div>
      </section>
    );
  }
}

export default UserProfile;
