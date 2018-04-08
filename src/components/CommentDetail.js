import React from 'react';
import PropTypes from "prop-types";

export const CommentDetail = ({comment}) => {
  const {content, title, author, time} = comment;
  return (
    <div className="comment">
      <h4 className="comment-title">{title}</h4>
      {content.map((commentContent, index) => {
        return (
          <span className="content" key={index}>{commentContent}</span>
        );
      })}
      <span className="time">Posted by <span
        className="author">{author}</span> @ {time}</span>
    </div>
  );
};

CommentDetail.propTypes = {
  comment: PropTypes.object.isRequired
};