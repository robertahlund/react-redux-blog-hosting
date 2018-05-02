import * as type from './actionTypes';
import firebase from "../firebaseConfig";
import "firebase/firestore";
const db = firebase.firestore();

export function displayAllPosts() {
  return {
    type: type.DISPLAY_ALL_POSTS
  }
}

export function allPostsRetrieved(allPosts, allPostsClone) {
  console.log('ALL POSTS RETRIEVED');
  return {
    type: type.FETCH_ALL_POSTS,
    allPosts,
    allPostsClone
  }
}

export function fetchAllPosts(uid) {
  return async function(dispatch, getState) {
    let allPosts = [];
    const databaseRef = db.collection("posts").where("authorUid", "==", uid);
    try {
      const querySnapshot = await databaseRef.get();
      allPosts = [];
      querySnapshot.forEach(doc => {
        const postData = doc.data();
        postData.id = doc.id;
        allPosts.push(postData);
        //console.log(doc.id, " => ", doc.data());
      });
      const sortByTime = allPosts.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
      console.log(sortByTime, 'FIREBASE I REDUCER');
      const allPostsClone = JSON.parse(JSON.stringify(sortByTime));
      dispatch(allPostsRetrieved(allPosts, allPostsClone))
    } catch (error) {
      console.log(error);
    }
  }
}

export function filterPosts(allPosts, searchValue) {
  return {
    type: type.FILTER_POSTS,
    allPosts,
    searchValue
  }
}