import React from 'react';
import PropTypes from "prop-types";

export const CommentFooter = (
  {
    commentsToDisplay, comments, loading, handleCommentCollapseFromChild,
    handleCommentPaginationIncrease, handleCommentPaginationDecrease
  }) => {
  return (
    <div className="comment-footer">
      {commentsToDisplay >= comments.length && !loading ? (
        <p>You've reached the end :( <a onClick={handleCommentCollapseFromChild}>Close comments</a></p>
      ) : (
        <React.Fragment>
          {commentsToDisplay > 3 && !loading &&
          <button type="button" className="button"
                  onClick={handleCommentPaginationDecrease}>Show fewer commments
          </button>
          }
          <React.Fragment>
            <a onClick={handleCommentCollapseFromChild}>Close comments</a>
            <button type="button" className="button"
                    onClick={handleCommentPaginationIncrease}>Show more commments
            </button>
          </React.Fragment>
        </React.Fragment>
      )}
    </div>
  );
};

CommentFooter.propTypes = {
  commentsToDisplay: PropTypes.number.isRequired,
  comments: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  handleCommentCollapseFromChild: PropTypes.func.isRequired,
  handleCommentPaginationIncrease: PropTypes.func.isRequired,
  handleCommentPaginationDecrease: PropTypes.func.isRequired
};