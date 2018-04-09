import React from 'react';
import PropTypes from "prop-types";

export const SearchBox = (
  {
    searchResultLength, allPostsClone, displayAllPosts,
    handleSearchInput, handleSearch, closeSearch, searchValue,
    searchOpen, toggleSearch, searchRef
  }) => {
  return (
    <div className="search-container">
      {searchResultLength > 0 && searchResultLength !== allPostsClone.length &&
        <div>
          <p>{"Found " + searchResultLength + " results."}</p>
          <a onClick={displayAllPosts}>View all posts</a>
        </div>
      }
      <input type="text" onChange={handleSearchInput} onKeyDown={handleSearch} onBlur={closeSearch}
             ref={searchRef}
             value={searchValue}
             className={searchOpen ? 'search-input' : 'hidden-input'}
             placeholder="Search for tags and titles."
      />
      <span className="jam jam-search" onClick={toggleSearch}/>
    </div>
  );

};

SearchBox.propTypes = {
  searchResultLength: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.object
  ]),
  allPostsClone: PropTypes.array.isRequired,
  displayAllPosts: PropTypes.func.isRequired,
  handleSearchInput: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.string.isRequired,
  searchOpen: PropTypes.bool.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  searchRef: PropTypes.object.isRequired
};