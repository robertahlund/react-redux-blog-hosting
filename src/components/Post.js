import React, {Component} from 'react';
import 'firebase/firestore';
import Comments from "./Comments";
import PropTypes from "prop-types";
import {PostDetail} from "./PostDetail";

export default class Post extends Component {
  state = {
    commentsToLoad: ''
  };

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    post: PropTypes.object.isRequired,
    handleSearchByTag: PropTypes.func.isRequired
  };

  handleComments = event => {
    //TODO better solution maybe
    const target = event.currentTarget;
    const commentsCanBeCollapsed = target.firstElementChild.className === 'jam jam-angle-top';
    if (commentsCanBeCollapsed) {
      this.setState({
        commentsToLoad: ''
      })
    } else {
      const toggleCommentsWithThisId = target.getAttribute('data-post-id');
      console.log(toggleCommentsWithThisId);
      this.setState({
        commentsToLoad: toggleCommentsWithThisId
      })
    }
  };

  handleCommentCollapseFromChild = () => {
    this.setState({
      commentsToLoad: ''
    })
  };

  render() {
    const {post, auth, handleSearchByTag} = this.props;
    const {id} = post;
    const {commentsToLoad} = this.state;
    return (
      <div className="post" data-post-id={id}>
        <PostDetail
          handleComments={this.handleComments}
          handleSearchByTag={handleSearchByTag}
          post={post}
          commentsToLoad={commentsToLoad}
        />
        {commentsToLoad === id &&
          <Comments
            postId={id}
            handleCommentCollapseFromChild={this.handleCommentCollapseFromChild}
            auth={auth}
          />
        }
      </div>
    );
  }
}
