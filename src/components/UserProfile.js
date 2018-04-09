import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import PropTypes from "prop-types";
import {Header} from "./Header";
import {UserProfileEditable} from "./UserProfileEditable";

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

  handleFormChange = event => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  updateAccountInfo = async () => {
    const blogName = this.state.form.blogName.split(/\s/).join("-");
    const {email, name} = this.state.form;
    const profileUid = this.props.match.params.uid;
    const databaseRef = db.collection('users').doc(profileUid);
    try {
      await databaseRef.update({
        blogName: blogName,
        email: email,
        name: name,
        uid: profileUid
      });
      console.log("updated")
    }
    catch (error) {
      console.log(error)
    }
  };

  userIsProfileOwner = () => {
    if (this.props.auth && this.props.auth.userData.uid === this.props.match.params.uid) {
      return "Edit your profile";
    } else {
      return this.state.form.name;
    }
  };

  render() {
    const {form} = this.state;
    return (
      <section className="new-post">
        <Header
          iconName="jam jam-user"
          headerText={this.userIsProfileOwner()}
        />
        {this.props.auth && this.props.auth.userData.uid === this.props.match.params.uid ?
          (
            <UserProfileEditable
              form={form}
              handleFormChange={this.handleFormChange}
              updateAccountInfo={this.updateAccountInfo}
            />
          ) :
          (
            null
          )
        }

      </section>
    );
  }
}

export default UserProfile;
