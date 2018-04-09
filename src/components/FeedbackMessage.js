import React from 'react';
import PropTypes from "prop-types";
import '../css/FeedbackMessage.css';

export const FeedbackMessage = ({message}) => {
  const {type, text} = message;
  if (type === "success") {
    return (
      <div className="feedback-success-message-container">
        {text}
      </div>
    );
  } else if (type === "error") {
    return (
      <div className="feedback-error-message-container">
        {text}
      </div>
    );
  } else {
    return null;
  }
};

FeedbackMessage.propTypes = {
  message: PropTypes.object.isRequired
};