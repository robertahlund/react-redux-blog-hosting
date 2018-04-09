import React from 'react';
import PropTypes from "prop-types";

export const UserProfileEditable = ({form, handleFormChange, updateAccountInfo}) => {
  const {name, blogName, email, password} = form;
    return (
      <div className="new-post-form">
        <form autoComplete="off">
          <label htmlFor="name">Full name</label>
          <input id="name" type="text" data-change="name" value={name}
                 onChange={handleFormChange} className="new-post-input"/>
          <label htmlFor="name">Blog name</label>
          <input id="blogname" type="text" data-change="blogName" value={blogName}
                 onChange={handleFormChange} className="new-post-input"/>
          <label htmlFor="username">Email</label>
          <input id="username" type="text" data-change="email" value={email}
                 onChange={handleFormChange} className="new-post-input"/>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" data-change="password" value={password}
                 onChange={handleFormChange}
                 className="new-post-input"/>
          <button type="button" onClick={updateAccountInfo}
                  className="button button-align-right update-profile">Update account information
          </button>
        </form>
      </div>
    );
};

UserProfileEditable.propTypes = {
  form: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  updateAccountInfo: PropTypes.func.isRequired
};