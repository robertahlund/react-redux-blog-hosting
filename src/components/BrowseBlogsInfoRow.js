import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const BrowseBlogsInfoRow = ({ blog }) => {
  return (
    <div className="blog-info-row">
      <Link to={`/blog/${blog.uid}/${blog.blogName}`}>
        {blog.blogName.replace(/[-]/g, " ") || "Ett namn"}
      </Link>
      <Link to={`/user/${blog.uid}`}>{blog.name || "Ett namn"}</Link>
      <span>{new Date().toLocaleString().substring(0, 10)}</span>
    </div>
  );
};

BrowseBlogsInfoRow.propTypes = {
  blog: PropTypes.object.isRequired
};
