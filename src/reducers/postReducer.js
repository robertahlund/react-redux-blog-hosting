import * as type from "../actions/actionTypes";

const initialState = {
  allPosts: [],
  allPostsClone: [],
  searchValue: ''
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
    default:
      return state;
  }
}
