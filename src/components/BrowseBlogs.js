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
import { BrowseBlogsPagination } from "./BrowseBlogsPagination";

class BrowseBlogs extends Component {
  state = {
    loading: true,
    blogsToDisplay: {
      startIndex: 0,
      endIndex: 20,
      currentPage: 1,
      totalPages: 0
    }
  };

  componentDidMount = async () => {
    document.title = "Browse blogs";
    const { fetchAllBlogs } = this.props;
    await fetchAllBlogs();
    const { blogs } = this.props;
    this.setState({
      loading: false,
      blogsToDisplay: {
        startIndex: 0,
        endIndex: 20,
        currentPage: 1,
        totalPages: Math.ceil(blogs.length / 20)
      }
    });
  };

  handleBlogPaginationIncrease = () => {
    this.setState(prevState => ({
      blogsToDisplay: {
        startIndex: prevState.blogsToDisplay.startIndex + 20,
        endIndex: prevState.blogsToDisplay.endIndex + 20,
        currentPage: prevState.blogsToDisplay.currentPage + 1,
        totalPages: prevState.blogsToDisplay.totalPages
      }
    }));
  };

  handleBlogPaginationDecrease = () => {
    this.setState(prevState => ({
      blogsToDisplay: {
        startIndex: prevState.blogsToDisplay.startIndex - 20,
        endIndex: prevState.blogsToDisplay.endIndex - 20,
        currentPage: prevState.blogsToDisplay.currentPage - 1,
        totalPages: prevState.blogsToDisplay.totalPages
      }
    }));
  };

  render() {
    const { blogs } = this.props;
    const { loading, blogsToDisplay } = this.state;
    const { startIndex, endIndex, currentPage, totalPages } = blogsToDisplay;
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
              if (
                index >= blogsToDisplay.startIndex &&
                index <= blogsToDisplay.endIndex - 1
              ) {
                return <BrowseBlogsInfoRow blog={blog} key={index} />;
              } else {
                return null;
              }
            })}
            <BrowseBlogsPagination
              startIndex={startIndex}
              endIndex={endIndex}
              blogs={blogs}
              currentPage={currentPage}
              totalPages={totalPages}
              handleBlogPaginationDecrease={this.handleBlogPaginationDecrease}
              handleBlogPaginationIncrease={this.handleBlogPaginationIncrease}
            />
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
