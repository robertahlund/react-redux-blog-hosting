import * as type from "./actionTypes";
import firebase from "../firebaseConfig";
import "firebase/firestore";
const db = firebase.firestore();

export function displayAllPosts() {
  return {
    type: type.DISPLAY_ALL_POSTS
  };
}

function allPostsRetrieved(allPosts, allPostsClone) {
  console.log("ALL POSTS RETRIEVED");
  return {
    type: type.FETCH_ALL_POSTS,
    allPosts,
    allPostsClone
  };
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
      console.log(sortByTime, "FIREBASE I REDUCER");
      const allPostsClone = JSON.parse(JSON.stringify(sortByTime));
      dispatch(allPostsRetrieved(allPosts, allPostsClone));
    } catch (error) {
      console.log(error);
    }
  };
}

export function filterPosts(allPosts, searchValue) {
  return {
    type: type.FILTER_POSTS,
    allPosts,
    searchValue
  };
}

export function createNewBlogPost(formValues) {
  return async function(dispatch, getState) {
    const databaseRef = db.collection("posts");
    try {
      const result = await databaseRef.add(formValues);
      console.log("Document written with ID: ", result.id, result);
      dispatch(newBlogPostCreated(formValues));
    } catch (error) {
      console.log(error);
    }
  };
}

function newBlogPostCreated(formValues) {
  return {
    type: type.CREATE_NEW_BLOG_POST,
    formValues
  };
}

export function createNewComment(postId, newComment) {
  console.log(postId, newComment, "action");
  return async function(dispatch, getState) {
    console.log(postId, newComment, "action");
    const databaseRef = db.collection("posts").doc(postId);
    try {
      const querySnapshot = await databaseRef.get();
      const allComments = [...querySnapshot.data().comments, newComment];
      console.log(allComments);
      await databaseRef.update({
        comments: allComments
      });
      dispatch(newCommentCreated(postId, allComments));
    } catch (error) {
      console.log(error);
    }
  };
}

function newCommentCreated(postId, allComments) {
  return {
    type: type.CREATE_NEW_COMMENT,
    postId,
    allComments
  };
}
