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
