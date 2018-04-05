import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import Comments from "./Comments";
import CommentForm from "./CommentForm";
import PropTypes from "prop-types";

const db = firebase.firestore();

export default class Post extends Component {
  state = {};

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.bool
    ]).isRequired,
    post: PropTypes.object.isRequired,
    handleSearchByTag: PropTypes.func.isRequired,
    handleComments: PropTypes.func.isRequired,
    handleCommentCollapseFromChild: PropTypes.func.isRequired
  };

  render() {
    const {
      post, commentsToLoad, auth, handleSearchByTag, handleComments,
      handleCommentCollapseFromChild
    } = this.props;
    const {id, title, content, tags, comments, time} = post;
    return (
      <div className="post" data-post-id={id}>
        <h3>{title}</h3>
        {content.map((paragraph, index) => {
          return (
            <p key={index}>{paragraph}</p>
          );
        })}
        {tags.length > 0 &&
        <span className="tags">Tags:
          {tags.map((tag, index) => <a key={index} onClick={handleSearchByTag}>{' #' + tag}</a>)}
        </span>
        }
        <div className="post-footer">
          <a data-post-id={id}
             onClick={handleComments}>{comments ? comments.length + ' comments' : '0 comments'}
            <span className={commentsToLoad === id ? 'jam jam-angle-top' : 'jam jam-angle-top' +
              ' rotate'}/>
          </a>
          <span className="time">{/*Posted by <a>{post.author}</a>*/} {time}</span>
        </div>
        {commentsToLoad === id &&
        <div className="comment-section">
          <Comments
            postId={id}
            handleCommentCollapseFromChild={handleCommentCollapseFromChild}
            auth={auth}
          />
        </div>
        }
      </div>
    );
  }
}
