import * as type from "../actions/actionTypes";

const initialState = {
  allPosts: [],
  allPostsClone: [],
  searchValue: "",
  postToEdit: null,
  commentToEdit: null
};

export default function postReducer(state = initialState, action) {
  //console.log(state, "state i post reducer");
  switch (action.type) {
    case type.FETCH_ALL_POSTS:
      return {
        ...state,
        allPosts: [...action.allPosts],
        allPostsClone: [...action.allPostsClone]
      };
    case type.FILTER_POSTS:
      return {
        ...state,
        allPosts: [...action.allPosts],
        searchValue: action.searchValue
      };
    case type.DISPLAY_ALL_POSTS:
      return {
        ...state,
        allPosts: [...state.allPostsClone]
      };
    case type.CREATE_NEW_COMMENT:
      return {
        ...state,
        allPosts: state.allPosts.map(post => {
          if (post.id !== action.postId) {
            return post;
          }
          return {
            ...post,
            comments: [...action.allComments]
          };
        }),
        allPostsClone: state.allPostsClone.map(post => {
          if (post.id !== action.postId) {
            return post;
          }
          return {
            ...post,
            comments: [...action.allComments]
          };
        })
      };
    case type.DELETE_POST:
      return {
        ...state,
        allPosts: state.allPosts.filter(post => post.id !== action.id),
        allPostsClone: state.allPostsClone.filter(post => post.id !== action.id)
      };
    case type.EDIT_POST:
      return {
        ...state,
        postToEdit: action.post
      };
    case type.SUBMIT_EDIT_POST:
      return {
        ...state,
        postToEdit: null
      };
    case type.DELETE_COMMENT:
      return {
        ...state,
        allPosts: state.allPosts.map(post => {
          if (post.id !== action.postId) {
            return post;
          }
          return {
            ...post,
            comments: [...action.updatedComments]
          };
        }),
        allPostsClone: state.allPostsClone.map(post => {
          if (post.id !== action.postId) {
            return post;
          }
          return {
            ...post,
            comments: [...action.updatedComments]
          };
        })
      };
    case type.COMMENT_TO_BE_EDITED:
      return {
        ...state,
        commentToEdit: { ...action.comment, index: action.index }
      };
    case type.EDIT_COMMENT:
      return {
        ...state,
        commentToEdit: null,
        allPosts: state.allPosts.map(post => {
          if (post.id !== action.postId) {
            return post;
          }
          return {
            ...post,
            comments: [...action.updatedComments]
          };
        }),
        allPostsClone: state.allPosts.map(post => {
          if (post.id !== action.postId) {
            return post;
          }
          return {
            ...post,
            comments: [...action.updatedComments]
          };
        })
      };
    default:
      return state;
  }
}
