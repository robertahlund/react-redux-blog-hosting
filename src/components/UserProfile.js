import React, { Component, Fragment } from "react";
import firebase from "../firebaseConfig";
import "firebase/firestore";
import PropTypes from "prop-types";
import { Header } from "./Header";
import { UserProfileEditable } from "./UserProfileEditable";
import { UserProfilePresentational } from "./UserProfilePresentational";
import { Loading } from "./Loading";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as authActions from "../actions/authActions";
import { bindActionCreators } from "redux";

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
    loading: true,
    saveLoading: false
  };

  static propTypes = {
    authentication: PropTypes.oneOfType([PropTypes.object, PropTypes.bool])
      .isRequired
  };

  componentDidMount = async () => {
    document.title = "Profile";
    const profileUid = this.props.match.params.uid;
    const databaseRef = db.collection("users").where("uid", "==", profileUid);
    try {
      const userData = await databaseRef.get();
      userData.forEach(user => {
        const { email, name, blogName, uid } = user.data();
        this.setState(
          {
            form: {
              email,
              name,
              blogName: blogName.split(/[-]/).join(" "),
              password: "",
              uid
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
    const { updateAccountInformation } = this.props;
    const { form } = this.state;
    const profileUid = this.props.match.params.uid;
    this.setState({
      saveLoading: true
    });
    try {
      await updateAccountInformation(form, profileUid);
      this.setState({
        message: {
          type: "success",
          text: "Your information was successfully updated."
        },
        saveLoading: false
      });
    } catch (error) {
      this.setState({
        message: {
          type: "error",
          text: error.message
        },
        saveLoading: false
      });
    }
  };

  userIsProfileOwner = () => {
    const { auth } = this.props.authentication;
    const { uid } = this.props.match.params;
    if (auth && auth.info.uid === uid) {
      return "Edit your profile";
    } else {
      return this.state.form.name;
    }
  };

  render() {
    console.log(this.props, "PROPS USERPROFILE");
    const { message, loading, form, saveLoading } = this.state;
    const { auth } = this.props.authentication;
    const { uid } = this.props.match.params;

    return (
      <Fragment>
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
            loading={saveLoading}
          />
        ) : (
          <UserProfilePresentational form={form} loading={loading} />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "STATE");
  return {
    authentication: state.authentication
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(authActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(UserProfile)
);
