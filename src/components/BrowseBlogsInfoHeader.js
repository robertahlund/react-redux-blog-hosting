import React from "react";
import PropTypes from "prop-types";

export const BrowseBlogsInfoHeader = ({ sortPosts, sort }) => {
  console.log(sort.name.sortOrder);
  return (
    <div className="blog-info-row-header">
      <span onClick={() => sortPosts("name", sort.name.sortOrder)}>
        Blog
        <span
          className={
            sort.name.sortOrder === "DESC"
              ? "jam jam-chevron-down"
              : "jam jam-chevron-up"
          }
        />
      </span>
      <span onClick={() => sortPosts("author", sort.author.sortOrder)}>
        Author
        <span
          className={
            sort.author.sortOrder === "DESC"
              ? "jam jam-chevron-down"
              : "jam jam-chevron-up"
          }
        />
      </span>
      <span onClick={() => sortPosts("date", sort.date.sortOrder)}>
        Created
        <span
          className={
            sort.date.sortOrder === "DESC"
              ? "jam jam-chevron-down"
              : "jam jam-chevron-up"
          }
        />
      </span>
    </div>
  );
};

BrowseBlogsInfoHeader.propTypes = {
  sortPosts: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired
};
