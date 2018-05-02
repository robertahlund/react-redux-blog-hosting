import {combineReducers} from 'redux';
import authentication from './authReducer';
import posts from './postReducer';

const rootReducer = combineReducers({
  authentication,
  posts
});

export default rootReducer;