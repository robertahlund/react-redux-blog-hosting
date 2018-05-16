import React from "react";
import PropTypes from "prop-types";

export const SearchResultMessage = ({
  displayAllPosts,
  searchResultLength,
  searchValue
}) => {
  if (searchResultLength === 0) {
    return (
      <div className="search-result-container">
        <p>Your search for "{searchValue}" returned no matches.</p>
        <a onClick={displayAllPosts}>View all posts</a>
      </div>
    );
  } else return null;
};

SearchResultMessage.propTypes = {
  displayAllPosts: PropTypes.func.isRequired,
  searchResultLength: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
};
