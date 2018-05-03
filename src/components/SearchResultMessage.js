import React from "react";
import PropTypes from "prop-types";

export const SearchResultMessage = ({
  displayAllPosts,
  searchResultLength,
  searchValue
}) => {
  if (searchResultLength === 0) {
    return (
      <React.Fragment>
        <p className="center">
          Your search for "{searchValue}" returned no matches.
        </p>
        <a className="center" onClick={displayAllPosts}>
          View all posts
        </a>
      </React.Fragment>
    );
  } else return null;
};

SearchResultMessage.propTypes = {
  displayAllPosts: PropTypes.func.isRequired,
  searchResultLength: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};
