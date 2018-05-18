import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import "../css/PostActionMenu.css";
import { CommentActionMenuContent } from "./CommentActionMenuContent";
import { connect } from "react-redux";
import * as postActions from "../actions/postActions";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

class CommentActionMenu extends Component {
  state = {
    menuToRender: false
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    comment: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    postId: PropTypes.string.isRequired,
    allPosts: PropTypes.array.isRequired,
    deleteComment: PropTypes.func.isRequired,
    commentToBeEdited: PropTypes.func.isRequired
  };

  handleActionMenu = event => {
    if (event.target === event.currentTarget && this.state.menuToRender) {
      console.log(false);
      this.setState({
        menuToRender: false
      });
    } else {
      this.setState({
        menuToRender: true
      });
    }
  };

  deleteComment = async () => {
    const { postId, allPosts, index, deleteComment } = this.props;
    const post = allPosts.filter(post => post.id === postId)[0];
    const { comments } = JSON.parse(JSON.stringify(post));
    const sortByTime = comments.sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );
    sortByTime.map((comment, i) => {
      if (i === index) {
        return sortByTime.splice(i, 1);
      }
    });
    const updatedComments = sortByTime;
    console.log(sortByTime);
    try {
      await deleteComment(postId, updatedComments);
    } catch (error) {
      console.log(error);
    }
    this.setState({
      menuToRender: ""
    });
  };

  editComment = () => {
    // const { history, editPost, post } = this.props;
    // editPost(post);
    // history.push("/edit-post/");
    const { commentToBeEdited, comment, index } = this.props;
    commentToBeEdited(comment, index);

    this.setState({
      menuToRender: ""
    });
  };

  render() {
    const { auth } = this.props;
    const { menuToRender } = this.state;
    return (
      <Fragment>
        <span
          className="comment-menu jam jam-more-vertical-f"
          onClick={event => this.handleActionMenu(event)}
        />
        {menuToRender && (
          <CommentActionMenuContent
            auth={auth}
            deleteComment={this.deleteComment}
            editComment={this.editComment}
          />
        )}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    allPosts: state.posts.allPosts
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CommentActionMenu)
);
