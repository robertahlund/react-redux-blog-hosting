import React, { Fragment } from "react";
import PropTypes from "prop-types";

export const PostActionMenuContent = ({ auth, post, deletePost, editPost }) => {
  const { uid } = auth;
  const { authorUid } = post;
  return (
    <div className="post-menu-container">
      <ul>
        {uid === authorUid && (
          <Fragment>
            <li onClick={editPost}>Edit post</li>
            <li onClick={deletePost}>Delete post</li>
          </Fragment>
        )}
        <li>Share on Twitter</li>
      </ul>
    </div>
  );
};

PostActionMenuContent.propTypes = {
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  post: PropTypes.object.isRequired,
  deletePost: PropTypes.func.isRequired,
  editPost: PropTypes.func.isRequired
};
