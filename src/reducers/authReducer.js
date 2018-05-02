import * as type from "../actions/actionTypes";

const initialState = {
  auth: false
};

export default function authReducer(state = initialState, action) {
  //console.log(state, "state i auth reducer");
  switch (action.type) {
    case type.USER_LOG_IN:
      return {
        ...state,
        auth: {...state.auth, ...action.user}
      };
    case type.USER_LOG_OUT:
      return {
        ...state,
        auth: false
      };
    default:
      return state;
  }
}
