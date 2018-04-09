import React from 'react';
import PropTypes from "prop-types";

export const CommentFooter = (
  {
    commentsToDisplay, comments, loading, handleCommentCollapseFromChild,
    handleCommentPaginationIncrease, handleCommentPaginationDecrease
  }) => {
  const {startIndex, endIndex, currentPage, totalPages} = commentsToDisplay;
  if (loading) {
    return null;
  } else {
    return (
      <div className="comment-footer">
        {startIndex >= comments.length ? (
          <p>You've reached the end :( <a onClick={handleCommentCollapseFromChild}>Close comments</a></p>
        ) : (
          <React.Fragment>
            {startIndex >= 3 &&
            <button type="button" className="button"
                    onClick={handleCommentPaginationDecrease}>Show fewer commments
            </button>
            }
            <React.Fragment>
              <p>Currently showing page: {currentPage} of {totalPages}</p>
              {endIndex <= comments.length &&
              <button type="button" className="button"
                      onClick={handleCommentPaginationIncrease}>Show more commments
              </button>
              }
            </React.Fragment>
          </React.Fragment>
        )}
      </div>
    );
  }
};

CommentFooter.propTypes = {
  commentsToDisplay: PropTypes.object.isRequired,
  comments: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  handleCommentCollapseFromChild: PropTypes.func.isRequired,
  handleCommentPaginationIncrease: PropTypes.func.isRequired,
  handleCommentPaginationDecrease: PropTypes.func.isRequired
};