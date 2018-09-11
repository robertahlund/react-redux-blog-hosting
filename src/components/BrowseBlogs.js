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
    },
    sort: {
      name: {
        sortOrder: "DESC"
      },
      author: {
        sortOrder: "DESC"
      },
      date: {
        sortOrder: "DESC"
      }
    }
  };

  static propTypes = {
    fetchAllBlogs: PropTypes.func.isRequired,
    blogs: PropTypes.array.isRequired,
    sortByName: PropTypes.func.isRequired,
    sortByAuthor: PropTypes.func.isRequired
  };

  componentDidMount = async () => {
    document.title = "Browse blogs";
    const { fetchAllBlogs } = this.props;
    await fetchAllBlogs();
    this.sortByName();
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

  sortByName = (order = "DESC") => {
    const { blogs, sortByName } = this.props;
    const blogSort = JSON.parse(JSON.stringify(blogs));
    blogSort.sort((a, b) => {
      const blogNameA = a.blogName.toLowerCase();
      const blogNameB = b.blogName.toLowerCase();
      if (blogNameA < blogNameB) {
        return order !== "DESC" ? 1 : -1;
      }
      if (blogNameA > blogNameB) {
        return order !== "DESC" ? -1 : 1;
      }
      return 0;
    });
    sortByName(blogSort);
    this.setState({
      ...this.state,
      sort: {
        ...this.state.sort,
        name: {
          sortOrder: order !== "DESC" ? "DESC" : "ASC"
        }
      }
    });
  };

  sortByAuthor = (order = "DESC") => {
    const { blogs, sortByAuthor } = this.props;
    const blogSort = JSON.parse(JSON.stringify(blogs));
    blogSort.sort((a, b) => {
      const blogNameA = a.name.toLowerCase();
      const blogNameB = b.name.toLowerCase();
      if (blogNameA < blogNameB) {
        return order !== "DESC" ? 1 : -1;
      }
      if (blogNameA > blogNameB) {
        return order !== "DESC" ? -1 : 1;
      }
      return 0;
    });
    sortByAuthor(blogSort);
    this.setState({
      ...this.state,
      sort: {
        ...this.state.sort,
        author: {
          sortOrder: order !== "DESC" ? "DESC" : "ASC"
        }
      }
    });
  };

  sortByDate = (order = "DESC") => {
    //const { blogs } = this.props;
    this.setState({
      ...this.state,
      sort: {
        ...this.state.sort,
        date: {
          sortOrder: order !== "DESC" ? "DESC" : "ASC"
        }
      }
    });
  };

  sortPosts = (sortBy, order = "DESC") => {
    switch (sortBy) {
      case "name":
        order !== "DESC" ? this.sortByName("ASC") : this.sortByName();
        break;
      case "author":
        order !== "DESC" ? this.sortByAuthor("ASC") : this.sortByAuthor();
        break;
      case "date":
        order !== "DESC" ? this.sortByDate("ASC") : this.sortByDate();
        break;
      default:
        break;
    }
  };

  render() {
    const { blogs } = this.props;
    const { loading, blogsToDisplay, sort } = this.state;
    const { startIndex, endIndex, currentPage, totalPages } = blogsToDisplay;
    return (
      <section className="all-blogs">
        <Header iconName="jam jam-book" headerText="Browse blogs" />
        {loading ? (
          <Loading display={loading} />
        ) : (
          <div className="blog-info-row-wrapper">
            <BrowseBlogsInfoHeader sortPosts={this.sortPosts} sort={sort} />
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
