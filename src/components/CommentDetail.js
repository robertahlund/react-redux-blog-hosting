import React from "react";
import PropTypes from "prop-types";
import CommentActionMenu from "./CommentActionMenu";

export const CommentDetail = ({ comment, auth, index, postId }) => {
  const { content, title, author, time } = comment;
  return (
    <div className="comment">
      {comment.authorUid === auth.uid && (
        <CommentActionMenu
          auth={auth}
          comment={comment}
          index={index}
          postId={postId}
        />
      )}
      <h4 className="comment-title">{title}</h4>
      {content.map((commentContent, index) => {
        return (
          <span className="content" key={index}>
            {commentContent}
          </span>
        );
      })}
      <span className="time">
        Posted by <span className="author">{author}</span> @{" "}
        {time.substring(0, time.length - 3)}
      </span>
    </div>
  );
};

CommentDetail.propTypes = {
  comment: PropTypes.object.isRequired,
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  index: PropTypes.number.isRequired,
  postId: PropTypes.string.isRequired
};
