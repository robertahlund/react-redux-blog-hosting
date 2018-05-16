import React from "react";
import PropTypes from "prop-types";

export const CommentFooter = ({
  commentsToDisplay,
  comments,
  loading,
  handleCommentCollapseFromChild,
  handleCommentPaginationIncrease,
  handleCommentPaginationDecrease
}) => {
  const { startIndex, endIndex, currentPage, totalPages } = commentsToDisplay;
  if (loading) {
    return null;
  } else {
    return (
      <div className="comment-footer">
        {totalPages > 0 && (
          <p>
            Currently showing page: {currentPage} of {totalPages}
          </p>
        )}
        {startIndex >= comments.length ? (
          <p>
            There is nothing here :({" "}
            <a onClick={handleCommentCollapseFromChild}>Close comments</a>
          </p>
        ) : totalPages > 1 ? (
          <div className="button-container">
            <button
              type="button"
              className="button"
              onClick={handleCommentPaginationDecrease}
              style={{ visibility: startIndex >= 3 ? "visible" : "hidden" }}
            >
              Show fewer commments
            </button>
            {endIndex < comments.length && (
              <button
                type="button"
                className="button"
                onClick={handleCommentPaginationIncrease}
              >
                Show more commments
              </button>
            )}
          </div>
        ) : null}
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
