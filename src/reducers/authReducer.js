import * as type from "../actions/actionTypes";

const initialState = {
  auth: false
};

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case type.USER_LOG_IN:
      return {
        ...state,
        auth: { ...state.auth, ...action.user }
      };
    case type.USER_LOG_OUT:
      return {
        ...state,
        auth: false
      };
    case type.UPDATE_ACCOUNT_INFORMATION:
      return {
        ...state,
        auth: {
          ...state.auth,
          displayName: action.name,
          email: action.email,
          info: {
            ...state.auth.info,
            blogName: action.blogName,
            email: action.email,
            name: action.name
          }
        }
      };
    default:
      return state;
  }
}
