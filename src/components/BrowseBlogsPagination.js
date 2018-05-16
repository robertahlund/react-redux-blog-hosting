import React, { Fragment } from "react";
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
    <Fragment>
      <p className="center">
        Currently showing page: {currentPage} of {totalPages}
      </p>
      <div className="browse-pagination">
        <Fragment>
          {startIndex >= 20 && (
            <button
              type="button"
              className="button"
              onClick={handleBlogPaginationDecrease}
            >
              Previous page
            </button>
          )}
          <Fragment>
            {endIndex < blogs.length && (
              <button
                type="button"
                className="button"
                onClick={handleBlogPaginationIncrease}
              >
                Next page
              </button>
            )}
          </Fragment>
        </Fragment>
      </div>
    </Fragment>
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
