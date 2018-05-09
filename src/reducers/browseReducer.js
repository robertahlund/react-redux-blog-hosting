import * as type from "../actions/actionTypes";

const initialState = {
  blogs: []
};

export default function browseReducer(state = initialState, action) {
  switch (action.type) {
    case type.FETCH_ALL_BLOGS:
      return {
        ...state,
        blogs: [...action.blogs]
      };
    case type.SORT_BLOGS_BY_NAME:
      return {
        ...state,
        blogs: [...action.blogs]
      };
    case type.SORT_BLOGS_BY_AUTHOR:
      return {
        ...state,
        blogs: [...action.blogs]
      };
    case type.SORT_BLOGS_BY_CREATION_DATE:
      return {
        ...state,
        blogs: [...action.blogs]
      };
    default:
      return state;
  }
}
