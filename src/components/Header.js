import React from 'react';
import PropTypes from "prop-types";

export const Header = ({iconName, headerText}) => {
  return (
    <header className="header">
      <span className={iconName}></span>
      <h1>{headerText}</h1>
    </header>
  );
};

Header.propTypes = {
  iconName: PropTypes.string.isRequired,
  headerText: PropTypes.string.isRequired
};