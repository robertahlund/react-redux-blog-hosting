import * as type from "./actionTypes";
import firebase from "../firebaseConfig";
import "firebase/firestore";
const db = firebase.firestore();

export function fetchAllBlogs() {
  return async function(dispatch, getState) {
    let allBlogs = [];
    const databaseRef = db.collection("users");
    try {
      const querySnapshot = await databaseRef.get();
      allBlogs = [];
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        userData.id = doc.id;
        allBlogs.push(userData);
        //console.log(doc.id, " => ", doc.data());
      });
      console.log(allBlogs);
      dispatch(allBlogsFetched(allBlogs));
    } catch (error) {
      console.log(error);
      throw error;
    }
    dispatch(allBlogsFetched(allBlogs));
  };
}

function allBlogsFetched(blogs) {
  return {
    type: type.FETCH_ALL_BLOGS,
    blogs
  };
}

export function sortByName(blogs) {
  return {
    type: type.SORT_BLOGS_BY_NAME,
    blogs
  };
}

export function sortByAuthor(blogs) {
  return {
    type: type.SORT_BLOGS_BY_AUTHOR,
    blogs
  };
}
