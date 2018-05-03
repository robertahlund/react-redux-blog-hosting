import React, { Component } from "react";
import firebase from "../firebaseConfig";
import "firebase/firestore";
import PropTypes from "prop-types";
import { Header } from "./Header";
import { UserProfileEditable } from "./UserProfileEditable";
import { UserProfilePresentational } from "./UserProfilePresentational";
import { Loading } from "./Loading";

const db = firebase.firestore();

class UserProfile extends Component {
  state = {
    form: {
      email: "",
      password: "",
      name: "",
      blogName: ""
    },
    message: {
      type: "",
      text: ""
    },
    loading: true
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  componentDidMount = async () => {
    document.title = "Profile";
    const profileUid = this.props.match.params.uid;
    const databaseRef = db.collection("users").where("uid", "==", profileUid);
    try {
      const userData = await databaseRef.get();
      userData.forEach(user => {
        const { email, name, blogName } = user.data();
        this.setState(
          {
            form: {
              email: email,
              name: name,
              blogName: blogName.split(/[-]/).join(" "),
              password: ""
            }
          },
          () => {
            document.title = `Profile: ${name}`;
          }
        );
        console.log(user.id, " => ", user.data());
        this.setState(prevState => ({ loading: !prevState.loading }));
      });
    } catch (error) {
      console.log(error);
    }
  };

  handleFormChange = event => {
    const target = event.target.getAttribute("data-change");
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  updateAccountInfo = async () => {
    this.setState({
      loading: true
    });
    const blogName = this.state.form.blogName.split(/\s/).join("-");
    const { email, name, password } = this.state.form;
    const profileUid = this.props.match.params.uid;
    const user = firebase.auth().currentUser;
    const databaseRef = db.collection("users").doc(profileUid);
    try {
      await databaseRef.update({
        blogName: blogName,
        email: email,
        name: name,
        uid: profileUid
      });
      await user.updateProfile({
        displayName: name,
        email: email
      });
      await user.updateEmail(email);
      if (password.length > 0) {
        await user.updatePassword(password);
      }
      this.setState({
        message: {
          type: "success",
          text: "Your information was successfully updated."
        },
        loading: false
      });
    } catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        },
        loading: false
      });
    }
  };

  userIsProfileOwner = () => {
    const { auth } = this.props;
    const { uid } = this.props.match.params;
    if (auth && auth.info.uid === uid) {
      return "Edit your profile";
    } else {
      return this.state.form.name;
    }
  };

  render() {
    console.log(this.props, "PROPS USERPROFILE");
    const { message, loading, form } = this.state;
    const { auth } = this.props;
    const { uid } = this.props.match.params;

    return (
      <section className="new-post">
        <Header
          iconName="jam jam-user"
          headerText={this.userIsProfileOwner()}
        />
        <Loading display={loading} />
        {auth && auth.info.uid === uid ? (
          <UserProfileEditable
            form={form}
            handleFormChange={this.handleFormChange}
            updateAccountInfo={this.updateAccountInfo}
            message={message}
            loading={loading}
          />
        ) : (
          <UserProfilePresentational form={form} loading={loading} />
        )}
      </section>
    );
  }
}

export default UserProfile;
