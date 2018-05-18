import React, { Fragment } from "react";
import PropTypes from "prop-types";

export const CommentActionMenuContent = ({
  auth,
  deleteComment,
  editComment
}) => {
  const { uid } = auth;
  return (
    <div className="comment-menu-container">
      <ul>
        <Fragment>
          <li onClick={editComment}>Edit comment</li>
          <li onClick={deleteComment}>Delete comment</li>
        </Fragment>
      </ul>
    </div>
  );
};

CommentActionMenuContent.propTypes = {
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  deleteComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired
};
