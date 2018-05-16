import React from "react";
import PropTypes from "prop-types";
import "../css/SearchBox.css";

export const SearchBox = ({
  searchResultLength,
  allPostsClone,
  displayAllPosts,
  handleSearchInput,
  handleSearch,
  closeSearch,
  searchValue,
  searchOpen,
  toggleSearch,
  searchRef,
  searchString
}) => {
  return (
    <div className="search-container">
      <div className="search-field-container">
        <form onSubmit={handleSearch}>
          <div className="input-container">
            <input
              type="text"
              onChange={handleSearchInput}
              onBlur={closeSearch}
              ref={searchRef}
              value={searchString}
              className={searchOpen ? "search-input" : "hidden-input"}
              placeholder="Search for tags and titles."
            />
          </div>
        </form>
        <span className="jam jam-search" onClick={toggleSearch} />
        <span data-jam="search" />
      </div>
      {searchResultLength > 0 &&
        searchResultLength !== allPostsClone.length && (
          <div className="search-result-container">
            <p
            >{`Your search for "${searchValue}" returned ${searchResultLength} ${
              searchResultLength > 1 ? "matches." : "match."
            }`}</p>
            <a onClick={displayAllPosts}>View all posts</a>
          </div>
        )}
    </div>
  );
};

SearchBox.propTypes = {
  searchResultLength: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  allPostsClone: PropTypes.array.isRequired,
  displayAllPosts: PropTypes.func.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  searchString: PropTypes.string.isRequired,
  searchOpen: PropTypes.bool.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  searchRef: PropTypes.object.isRequired
};
