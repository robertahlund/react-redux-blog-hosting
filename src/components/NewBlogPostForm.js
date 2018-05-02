import React from "react";
import PropTypes from "prop-types";
import { Header } from "./Header";
import { FeedbackMessage } from "./FeedbackMessage";

export const NewBlogPostForm = ({
  handleFormChange,
  submitPost,
  loading,
  message,
  form
}) => {
  const { title, content, tags } = form;
  return (
    <section className="new-post">
      <Header iconName="jam jam-pencil" headerText="Create a new post" />
      <div className="new-post-form">
        <form>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            data-change="title"
            placeholder="Title"
            value={title}
            onChange={handleFormChange}
            className="new-post-input"
          />
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            data-change="content"
            id="content"
            cols="30"
            rows="10"
            placeholder="This is content."
            value={content}
            onChange={handleFormChange}
            className="new-post-textarea"
          />
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            data-change="tags"
            placeholder="#this #is #a #tag #this is also a tag"
            value={tags}
            onChange={handleFormChange}
            className="new-post-input"
          />
          <FeedbackMessage message={message} />
          <button
            type="button"
            onClick={submitPost}
            className="button new-post-button"
          >
            {loading && <span className="loader-button" />}
            Post
          </button>
        </form>
      </div>
    </section>
  );
};

NewBlogPostForm.propTypes = {
  handleFormChange: PropTypes.func.isRequired,
  submitPost: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  message: PropTypes.object.isRequired,
  form: PropTypes.object.isRequired
};
