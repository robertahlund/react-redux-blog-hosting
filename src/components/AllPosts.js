import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import PropTypes from 'prop-types';
import {Header} from "./Header";
import {Loading} from "./Loading";
import {SearchBox} from "./SearchBox";
import {NoPostsMessage} from "./NoPostsMessage";
import {SearchResultMessage} from "./SearchResultMessage";
import Post from "./Post";

const db = firebase.firestore();

export default class AllPosts extends Component {
  state = {
    allPosts: [],
    allPostsClone: [],
    loading: true,
    searchOpen: false,
    searchValue: '',
    searchResultLength: null,
    currentBlogData: {
      blogName: '',
      blogUid: ''
    }
  };

  searchInput = React.createRef();

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired
  };

  componentDidMount = async () => {
    this.setState({
      currentBlogData: {
        blogName: this.props.match.params.blogName.split(/[-]/).join(" "),
        blogUid: this.props.match.params.uid
      }
    });
    let allPosts = [];
    const authorToGetPostsFrom = this.props.match.params.uid;
    const databaseRef = db.collection('posts').where('authorUid', '==', authorToGetPostsFrom);
    try {
      const querySnapshot = await databaseRef.get();
      allPosts = [];
      querySnapshot.forEach(doc => {
        const postData = doc.data();
        postData.id = doc.id;
        allPosts.push(postData);
        console.log(doc.id, " => ", doc.data());
      });
      const sortByTime = allPosts.sort((a, b) => new Date(b.time) - new Date(a.time));
      console.log(sortByTime);
      this.setState({
        allPosts: sortByTime,
        loading: false,
        allPostsClone: JSON.parse(JSON.stringify(sortByTime))
      })
    }
    catch (error) {
      console.log(error);
    }
  };

  toggleSearch = () => {
    this.setState(prevState => ({
      searchOpen: !prevState.searchOpen
    }), () => {
      this.searchInput.current.focus();
    });
  };

  handleSearchInput = event => {
    const {value} = event.target;
    this.setState({
      searchValue: value
    });
  };

  handleSearch = event => {
    if (event.key === 'Enter') {
      const {searchValue} = this.state;
      const searchValueLower = searchValue.toLowerCase();
      const allPosts = this.state.allPostsClone;
      const findPosts = allPosts.filter(post => {
        const {title, tags} = post;
        return (
          title.toLowerCase().includes(searchValueLower) ||
          tags.includes(searchValueLower)
        )
      });
      this.setState({
        allPosts: findPosts,
        searchResultLength: findPosts.length
      });
      this.closeSearch();
      event.preventDefault();
    }
  };

  handleSearchByTag = event => {
    const {target} = event;
    const searchForThisTag = target.innerText.split('#')[1];
    const allPosts = this.state.allPostsClone;
    const findPosts = allPosts.filter(post => {
      const {tags} = post;
      return (
        tags.includes(searchForThisTag)
      )
    });
    this.setState({
      allPosts: findPosts,
      searchResultLength: findPosts.length
    });
  };

  closeSearch = () => {
    this.setState({
      searchOpen: false
    })
  };

  displayAllPosts = () => {
    this.setState({
      allPosts: this.state.allPostsClone,
      searchResultLength: null
    });
  };

  render() {
    const {blogName} = this.state.currentBlogData;
    const {
      searchResultLength, allPostsClone, searchValue,
      searchOpen, loading, allPosts
    } = this.state;
    const auth = this.props.auth;
    return (
      <section className="all-posts">
        <Header iconName="jam jam-document" headerText={blogName}/>
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
        />
        <Loading display={loading}/>
        <NoPostsMessage
          allPostsClone={allPostsClone}
          loading={loading}
          searchResultLength={searchResultLength}
        />
        <SearchResultMessage
          displayAllPosts={this.displayAllPosts}
          searchResultLength={searchResultLength}
        />
        {allPosts.map((post, index) =>
            <Post
              auth={auth}
              post={post}
              handleSearchByTag={this.handleSearchByTag}
              key={index}
            />
         )}
      </section>
    );
  }
}
