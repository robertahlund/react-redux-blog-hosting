import React, { Component } from "react";
import PropTypes from "prop-types";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { bindActionCreators } from "redux";
import * as browseActions from "../actions/browseActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "../css/BrowseBlogs.css";
import { BrowseBlogsInfoRow } from "./BrowseBlogsInfoRow";
import { BrowseBlogsInfoHeader } from "./BrowseBlogsInfoHeader";

class BrowseBlogs extends Component {
  state = {
    loading: true
  };

  componentDidMount = async () => {
    const { fetchAllBlogs } = this.props;
    await fetchAllBlogs();
    this.setState({
      loading: false
    });
  };

  render() {
    const { blogs } = this.props;
    const { loading } = this.state;
    console.log(blogs);
    return (
      <section className="all-blogs">
        <Header iconName="jam jam-book" headerText="Browse blogs" />
        {loading ? (
          <Loading display={loading} />
        ) : (
          <div className="blog-info-row-wrapper">
            <BrowseBlogsInfoHeader />
            {blogs.map((blog, index) => {
              return <BrowseBlogsInfoRow blog={blog} key={index} />;
            })}
          </div>
        )}
      </section>
    );
  }
}

BrowseBlogs.propTypes = {
  fetchAllBlogs: PropTypes.func.isRequired,
  blogs: PropTypes.array.isRequired
};

function mapStateToProps(state) {
  return {
    blogs: state.blogs.blogs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(browseActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BrowseBlogs)
);
