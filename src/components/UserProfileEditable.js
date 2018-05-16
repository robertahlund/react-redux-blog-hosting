import React from "react";
import PropTypes from "prop-types";
import { FeedbackMessage } from "./FeedbackMessage";

export const UserProfileEditable = ({
  form,
  handleFormChange,
  updateAccountInfo,
  message,
  loading
}) => {
  const { name, blogName, email, password } = form;
  return (
    <div className="edit-profile-form">
      <form autoComplete="off">
        <label htmlFor="name">Full name</label>
        <div className="input-container">
          <input
            id="name"
            type="text"
            data-change="name"
            value={name}
            onChange={handleFormChange}
            className="new-post-input"
          />
        </div>
        <label htmlFor="name">Blog name</label>
        <div className="input-container">
          <input
            id="blogname"
            type="text"
            data-change="blogName"
            value={blogName}
            onChange={handleFormChange}
            className="new-post-input"
          />
        </div>
        <label htmlFor="username">Email</label>
        <div className="input-container">
          <input
            id="username"
            type="text"
            data-change="email"
            value={email}
            onChange={handleFormChange}
            className="new-post-input"
          />
        </div>
        <label htmlFor="password">New password</label>
        <div className="input-container">
          <input
            id="password"
            type="password"
            data-change="password"
            value={password}
            onChange={handleFormChange}
            className="new-post-input"
            autoComplete="new-password"
          />
        </div>
        <FeedbackMessage message={message} />
        <button
          type="button"
          onClick={updateAccountInfo}
          className="button button-align-right update-profile"
        >
          {loading && <span className="loader-button-update" />}
          Update account information
        </button>
      </form>
    </div>
  );
};

UserProfileEditable.propTypes = {
  form: PropTypes.object.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  updateAccountInfo: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};
