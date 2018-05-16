import React, { Fragment } from "react";
import PropTypes from "prop-types";
import "../css/PostActionMenu.css";
import { PostActionMenuContent } from "./PostActionMenuContent";
import { connect } from "react-redux";
import * as postActions from "../actions/postActions";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";

class PostActionMenu extends React.Component {
  state = {
    menuToRender: ""
  };

  static propTypes = {
    auth: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    id: PropTypes.string.isRequired,
    post: PropTypes.object.isRequired
  };

  handleActionMenu = (event, id) => {
    console.log(this.state.menuToRender);
    console.log(event.target);
    if (event.target === event.currentTarget && this.state.menuToRender) {
      console.log(false);
      this.setState({
        menuToRender: ""
      });
    } else {
      this.setState({
        menuToRender: id
      });
    }
  };

  deletePost = async () => {
    const { id, deleteBlogPost } = this.props;
    await deleteBlogPost(id);
    this.setState({
      menuToRender: ""
    });
  };

  editPost = () => {
    const { history, editPost, post } = this.props;
    editPost(post);
    history.push("/edit-post/");
  };

  render() {
    const { id, auth, post } = this.props;
    const { menuToRender } = this.state;
    return (
      <Fragment>
        <span
          className="post-menu jam jam-more-vertical-f"
          onClick={event => this.handleActionMenu(event, id)}
        />
        {menuToRender === id && (
          <PostActionMenuContent
            auth={auth}
            post={post}
            deletePost={this.deletePost}
            editPost={this.editPost}
          />
        )}
      </Fragment>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(postActions, dispatch);
}

export default withRouter(connect(null, mapDispatchToProps)(PostActionMenu));
