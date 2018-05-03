import React from "react";
import PropTypes from "prop-types";

export const UserProfilePresentational = ({ form, loading }) => {
  const { blogName, email, name } = form;
  console.log(loading);
  if (!loading) {
    return (
      <ul>
        <li>Name: {name}</li>
        <li>Email: {email}</li>
        <li>Blog name: {blogName}</li>
      </ul>
    );
  } else return null;
};

UserProfilePresentational.propTypes = {
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};
