import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export const UserProfilePresentational = ({ form, loading }) => {
  const { blogName, email, name, uid } = form;
  if (!loading) {
    return (
      <section className="profile-container">
        <ul>
          <li>
            <span className="label">Name:</span> {name}
          </li>
          <li>
            <span className="label">Email:</span> {email}
          </li>
          <li>
            <span className="label">Blog name:</span>
            <Link to={`/blog/${uid}/${blogName.replace(/ /g, "-")}`}>
              {" " + blogName}
            </Link>
          </li>
        </ul>
      </section>
    );
  } else return null;
};

UserProfilePresentational.propTypes = {
  form: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};
