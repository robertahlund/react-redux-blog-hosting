import React from "react";
import PropTypes from "prop-types";

export const PostDetail = ({
  handleComments,
  post,
  handleSearchByTag,
  commentsToLoad
}) => {
  const { id, title, content, tags, comments, time } = post;
  return (
    <React.Fragment>
      <h3>{title}</h3>
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
        <a data-post-id={id} onClick={handleComments}>
          {comments ? comments.length + " comments" : "0 comments"}
          <span
            className={
              commentsToLoad === id
                ? "jam jam-angle-top"
                : "jam jam-angle-top rotate"
            }
          />
        </a>
        <span className="time">
          {/*Posted by <a>{post.author}</a>*/}
          {time}
        </span>
      </div>
    </React.Fragment>
  );
};

PostDetail.propTypes = {
  handleComments: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired,
  handleSearchByTag: PropTypes.func.isRequired,
  commentsToLoad: PropTypes.string.isRequired
};
