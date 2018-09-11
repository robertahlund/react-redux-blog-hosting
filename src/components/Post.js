import React, { Component } from "react";
import "firebase/firestore";
import Comments from "./Comments";
import PropTypes from "prop-types";
import { PostDetail } from "./PostDetail";
import "../css/Post.css";

export default class Post extends Component {
  state = {
    commentsToLoad: ""
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    post: PropTypes.object.isRequired,
    handleSearchByTag: PropTypes.func.isRequired
  };

  handleComments = event => {
    const target = event.currentTarget;
    const commentsCanBeCollapsed = this.state.commentsToLoad;
    if (commentsCanBeCollapsed) {
      this.setState({
        commentsToLoad: ""
      });
    } else {
      const toggleCommentsWithThisId = target.getAttribute("data-post-id");
      this.setState({
        commentsToLoad: toggleCommentsWithThisId
      });
    }
  };

  handleCommentCollapseFromChild = () => {
    this.setState({
      commentsToLoad: ""
    });
  };

  render() {
    const { post, auth, handleSearchByTag } = this.props;
    const { id } = post;
    const { commentsToLoad } = this.state;
    return (
      <div className="post" data-post-id={id}>
        <PostDetail
          handleComments={this.handleComments}
          handleSearchByTag={handleSearchByTag}
          post={post}
          commentsToLoad={commentsToLoad}
          auth={auth}
        />
        {commentsToLoad === id && (
          <Comments
            postId={id}
            handleCommentCollapseFromChild={this.handleCommentCollapseFromChild}
            auth={auth}
          />
        )}
      </div>
    );
  }
}
