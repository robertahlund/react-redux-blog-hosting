import * as type from './actionTypes';

export function userLogin(user) {
  return {
    type: type.USER_LOG_IN,
    user
  }
}

export function userLogout() {
  return {
    type: type.USER_LOG_OUT
  }
}