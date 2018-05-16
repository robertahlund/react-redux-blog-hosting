import React from "react";
import PropTypes from "prop-types";
import PostActionMenu from "./PostActionMenu";

export const PostDetail = ({
  handleComments,
  post,
  handleSearchByTag,
  auth
}) => {
  const { id, title, content, tags, comments, time, edited } = post;
  return (
    <React.Fragment>
      <h1>{title}</h1>
      {content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {tags.length > 0 && (
        <span className="tags">
          Tags:
          {tags.map((tag, index) => (
            <a key={index} onClick={handleSearchByTag}>
              {" #" + tag}
            </a>
          ))}
        </span>
      )}
      <div className="post-footer">
        <span className="time">
          {/*Posted by <a>{post.author}</a>*/}
          {edited ? (
            <span>
              {"Edited @ "}
              {edited.substring(0, edited.length - 3)}
            </span>
          ) : (
            <span>
              {"Posted @ "}
              {time.substring(0, time.length - 3)}
            </span>
          )}
        </span>
        <div className="post-footer-row">
          <a data-post-id={id} onClick={handleComments}>
            <span className="comments-icon jam jam-message-writing" />
            {comments ? comments.length + " comments" : "0 comments"}
          </a>
          <PostActionMenu id={id} auth={auth} post={post} />
        </div>
      </div>
    </React.Fragment>
  );
};

PostDetail.propTypes = {
  handleComments: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  handleSearchByTag: PropTypes.func.isRequired,
  auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
};
