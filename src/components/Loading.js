import React from 'react';
import PropTypes from "prop-types";

export const Loading = ({display}) => {
  if (display) {
    return (
      <div className="loader"/>
    );
  }
   else return null;
};

Loading.propTypes = {
  display: PropTypes.bool.isRequired
};