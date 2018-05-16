import React from "react";
import PropTypes from "prop-types";
import { FeedbackMessage } from "./FeedbackMessage";

export const CreateAccountForm = ({
  name,
  handleFormChange,
  blogName,
  email,
  password,
  message,
  createAccount,
  loading
}) => {
  return (
    <div className="new-post-form">
      <form>
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
        <label htmlFor="name">Name your blog</label>
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
            autoComplete="new-password"
          />
        </div>
        <label htmlFor="password">Password</label>
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
          onClick={createAccount}
          className="button button-align-right"
          disabled={loading}
        >
          {loading && <span className="loader-button-comment" />}
          Create account
        </button>
      </form>
    </div>
  );
};

CreateAccountForm.propTypes = {
  name: PropTypes.string.isRequired,
  handleFormChange: PropTypes.func.isRequired,
  blogName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired,
  createAccount: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};
