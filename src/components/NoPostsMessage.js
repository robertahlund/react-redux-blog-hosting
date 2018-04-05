import React from 'react';
import PropTypes from "prop-types";

export const NoPostsMessage = ({allPostsClone, loading, searchResultLength}) => {
  if (allPostsClone.length === 0 && !loading && searchResultLength !== 0) {
    return (
      <p className="center">This user has not posted anything :(</p>
    );
  }
  else return null;
};

NoPostsMessage.propTypes = {
  allPostsClone: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  searchResultLength: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number
  ])
};