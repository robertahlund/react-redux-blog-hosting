import { combineReducers } from "redux";
import authentication from "./authReducer";
import posts from "./postReducer";
import blogs from "./browseReducer";

const rootReducer = combineReducers({
  authentication,
  posts,
  blogs
});

export default rootReducer;
