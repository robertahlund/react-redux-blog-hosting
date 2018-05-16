import React from "react";
import PropTypes from "prop-types";
import "../css/Header.css";

export const Header = ({ headerText }) => {
  return (
    <header className="header">
      <h1>{headerText}</h1>
    </header>
  );
};

Header.propTypes = {
  headerText: PropTypes.string.isRequired
};
