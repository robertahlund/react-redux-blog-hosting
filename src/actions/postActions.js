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
      });
      const sortByTime = allPosts.sort(
        (a, b) => new Date(b.time) - new Date(a.time)
      );
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
      await databaseRef.add(formValues);
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
  return async function(dispatch, getState) {
    const databaseRef = db.collection("posts").doc(postId);
    try {
      const querySnapshot = await databaseRef.get();
      const allComments = [...querySnapshot.data().comments, newComment];
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

export function deleteBlogPost(id) {
  return async function(dispatch, getState) {
    const databaseRef = db.collection("posts").doc(id);
    try {
      await databaseRef.delete();
      dispatch(blogPostDeleted(id));
    } catch (error) {
      console.log(error);
    }
  };
}

function blogPostDeleted(id) {
  return {
    type: type.DELETE_POST,
    id
  };
}

export function editPost(post) {
  return {
    type: type.EDIT_POST,
    post
  };
}

export function editPostSubmit(post, id) {
  return async function(dispatch, getState) {
    const databaseRef = db.collection("posts").doc(id);
    try {
      await databaseRef.update({
        title: post.title,
        content: post.content,
        tags: post.tags,
        edited: new Date().toLocaleString()
      });
      dispatch(postUpdated());
    } catch (error) {
      console.log(error);
    }
  };
}

export function postUpdated() {
  return {
    type: type.SUBMIT_EDIT_POST
  };
}

export function deleteComment(postId, updatedComments) {
  return async function(dispatch, getState) {
    const databaseRef = db.collection("posts").doc(postId);
    try {
      await databaseRef.update({
        comments: updatedComments
      });
    } catch (error) {
      console.log(error);
    }
    dispatch(commentDeleted(postId, updatedComments));
  };
}

function commentDeleted(postId, updatedComments) {
  return {
    type: type.DELETE_COMMENT,
    postId,
    updatedComments
  };
}

export function commentToBeEdited(comment, index) {
  return {
    type: type.COMMENT_TO_BE_EDITED,
    comment,
    index
  };
}

export function editComment(postId, updatedComments) {
  return async function(dispatch, getState) {
    const databaseRef = db.collection("posts").doc(postId);
    try {
      await databaseRef.update({
        comments: updatedComments
      });
      dispatch(commentEdited(postId, updatedComments));
    } catch (error) {
      console.log(error);
    }
  };
}

function commentEdited(postId, updatedComments) {
  return {
    type: type.EDIT_COMMENT,
    postId,
    updatedComments
  };
}
