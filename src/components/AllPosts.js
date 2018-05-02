import React, { Component } from "react";
import PropTypes from "prop-types";
import { Header } from "./Header";
import { Loading } from "./Loading";
import { SearchBox } from "./SearchBox";
import { NoPostsMessage } from "./NoPostsMessage";
import { SearchResultMessage } from "./SearchResultMessage";
import Post from "./Post";
import { bindActionCreators } from "redux";
import * as postActions from "../actions/postActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class AllPosts extends Component {
  state = {
    loading: true,
    searchOpen: false,
    searchString: "",
    searchResultLength: null,
    currentBlogData: {
      blogName: "",
      blogUid: ""
    }
  };

  searchInput = React.createRef();

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired
  };

  componentDidMount = async () => {
    const { blogName, uid, search, searchWord } = this.props.match.params;
    document.title = `${blogName.split(/[-]/).join(" ")}`;
    if (search && searchWord) {
      this.setState({
        searchString: searchWord
      });
      await this.getAndFilterAllPosts(searchWord);
    }
    this.setState({
      currentBlogData: {
        blogName: blogName.split(/[-]/).join(" "),
        blogUid: uid
      }
    });
    if (!search && !searchWord) {
      const { fetchAllPosts } = this.props;
      await fetchAllPosts(uid);
    }
    this.setState({
      loading: false
    });
  };

  componentDidUpdate = async prevProps => {
    //URL has changed
    if (this.props.location.pathname !== prevProps.location.pathname) {
      const { search, searchWord } = this.props.match.params;
      if (!search && !searchWord) {
        this.displayAllPosts();
        this.setState({
          searchResultLength: null
        });
      } else {
        this.setState({
          searchString: searchWord
        });
        await this.getAndFilterAllPosts(searchWord, false);
      }
    }
  };

  getAndFilterAllPosts = async (searchWord, shouldUpdateUrl = true) => {
    const { uid } = this.props.match.params;
    const { fetchAllPosts, allPostsClone } = this.props;
    if (allPostsClone.length === 0) {
      await fetchAllPosts(uid);
    }
    this.handleSearch(null, searchWord, shouldUpdateUrl);
  };

  toggleSearch = () => {
    this.setState(
      prevState => ({
        searchOpen: !prevState.searchOpen
      }),
      () => {
        this.searchInput.current.focus();
      }
    );
  };

  handleSearchInput = event => {
    const { value } = event.target;
    this.setState({
      searchString: value
    });
  };

  replaceSearchTerm = (path, searchWord) => {
    let newUrl = path.split("/");
    newUrl.splice(newUrl.length - 1, 1, searchWord);
    newUrl = newUrl.join("/");
    return newUrl;
  };

  handleSearch = (event, searchValue, shouldUpdateUrl = true) => {
    const { search, searchWord } = this.props.match.params;
    const { history } = this.props;
    if (!searchValue) {
      searchValue = this.state.searchString;
    }
    if (event) {
      event.preventDefault();
    }

    if (shouldUpdateUrl) {
      if (search && searchWord) {
        history.push(
          this.replaceSearchTerm(history.location.pathname, searchValue)
        );
      } else {
        history.push(`${history.location.pathname}/search/${searchValue}`);
      }
    }

    const { filterPosts } = this.props;
    const { allPostsClone } = this.props;
    const searchValueLower = searchValue.toLowerCase();
    const findPosts = allPostsClone.filter(post => {
      const { title, tags } = post;
      return (
        title.toLowerCase().includes(searchValueLower) ||
        tags.includes(searchValueLower)
      );
    });
    filterPosts(findPosts, searchValue);
    this.closeSearch();
    this.setState({
      searchResultLength: findPosts.length
    });
  };

  handleSearchByTag = async event => {
    const { target } = event;
    const searchForThisTag = target.innerText.split("#")[1];
    await this.getAndFilterAllPosts(searchForThisTag);
  };

  closeSearch = () => {
    this.setState({
      searchOpen: false
    });
  };

  displayAllPosts = () => {
    const { history, displayAllPosts } = this.props;
    const { currentBlogData } = this.state;
    const { blogName, blogUid } = currentBlogData;
    displayAllPosts();
    this.setState({
      searchResultLength: null
    });
    history.push(`/blog/${blogUid}/${blogName.replace(" ", "-")}`);
  };

  render() {
    //console.log(this.props, "PROPS ALLPOSTS");
    const { blogName } = this.state.currentBlogData;
    const {
      searchResultLength,
      searchOpen,
      loading,
      searchString
    } = this.state;
    const { allPostsClone, allPosts, searchValue } = this.props;
    const auth = this.props.auth;
    return (
      <section className="all-posts">
        <Header iconName="jam jam-document" headerText={blogName} />
        <SearchBox
          searchResultLength={searchResultLength}
          allPostsClone={allPostsClone}
          displayAllPosts={this.displayAllPosts}
          handleSearchInput={this.handleSearchInput}
          handleSearch={this.handleSearch}
          closeSearch={this.closeSearch}
          searchValue={searchValue}
          searchOpen={searchOpen}
          toggleSearch={this.toggleSearch}
          searchRef={this.searchInput}
          searchString={searchString}
        />
        <Loading display={loading} />
        <NoPostsMessage
          allPostsClone={allPostsClone}
          loading={loading}
          searchResultLength={searchResultLength}
        />
        <SearchResultMessage
          displayAllPosts={this.displayAllPosts}
          searchResultLength={searchResultLength}
          searchValue={searchValue}
        />
        {allPosts.map((post, index) => (
          <Post
            auth={auth}
            post={post}
            handleSearchByTag={this.handleSearchByTag}
            key={index}
          />
        ))}
      </section>
    );
  }
}

function mapStateToProps(state) {
  console.log(state, "STATE");
  return {
    allPosts: state.posts.allPosts,
    allPostsClone: state.posts.allPostsClone,
    searchValue: state.posts.searchValue
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllPosts)
);
