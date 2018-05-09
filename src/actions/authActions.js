import * as type from "./actionTypes";
import firebase from "../firebaseConfig";
import "firebase/firestore";
const db = firebase.firestore();

export function userLogin(user) {
  return {
    type: type.USER_LOG_IN,
    user
  };
}

export function userLogout() {
  return {
    type: type.USER_LOG_OUT
  };
}

export function createAccount(email, password, name, blogName) {
  return async function(dispatch, getState) {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = firebase.auth().currentUser;
    await user.updateProfile({
      displayName: name
    });
    const userInformation = {
      name: user.displayName,
      uid: user.uid,
      email: user.email,
      blogName: blogName
    };
    const databaseRef = db.collection("users").doc(user.uid);
    await databaseRef.set(userInformation);
    dispatch(accountCreated());
  };
}

function accountCreated() {
  return {
    type: type.CREATE_NEW_ACCOUNT
  };
}

export function updateAccountInformation(form, profileUid) {
  return async function(dispatch, getState) {
    const blogName = form.blogName.split(/\s/).join("-");
    const { email, name, password } = form;
    const user = firebase.auth().currentUser;
    const databaseRef = db.collection("users").doc(profileUid);
    try {
      if (password.length > 0) {
        await user.updatePassword(password);
      }
      await user.updateProfile({
        displayName: name,
        email: email
      });
      await user.updateEmail(email);
      await databaseRef.update({
        blogName: blogName,
        email: email,
        name: name,
        uid: profileUid
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
    dispatch(accountInformationUpdated(blogName, email, name));
  };
}

function accountInformationUpdated(blogName, email, name) {
  return {
    type: type.UPDATE_ACCOUNT_INFORMATION,
    blogName,
    email,
    name
  };
}
