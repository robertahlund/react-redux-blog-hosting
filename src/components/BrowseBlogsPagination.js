import React from "react";
import PropTypes from "prop-types";

export const BrowseBlogsPagination = ({
  startIndex,
  endIndex,
  blogs,
  currentPage,
  totalPages,
  handleBlogPaginationDecrease,
  handleBlogPaginationIncrease
}) => {
  return (
    <div className="browse-pagination">
      <React.Fragment>
        {startIndex >= 20 && (
          <button
            type="button"
            className="button"
            onClick={handleBlogPaginationDecrease}
          >
            Previous page
          </button>
        )}
        <React.Fragment>
          <p>
            Currently showing page: {currentPage} of {totalPages}
          </p>
          {endIndex < blogs.length && (
            <button
              type="button"
              className="button"
              onClick={handleBlogPaginationIncrease}
            >
              Next page
            </button>
          )}
        </React.Fragment>
      </React.Fragment>
    </div>
  );
};

BrowseBlogsPagination.propTypes = {
  startIndex: PropTypes.number.isRequired,
  endIndex: PropTypes.number.isRequired,
  blogs: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handleBlogPaginationDecrease: PropTypes.func.isRequired,
  handleBlogPaginationIncrease: PropTypes.func.isRequired
};
