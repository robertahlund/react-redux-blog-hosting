import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';
import PropTypes from "prop-types";

const db = firebase.firestore();

export default class CommentForm extends Component {
  state = {
    form: {
      title: '',
      content: '',
    },
    postId: ''
  };

  static propTypes = {
    auth: PropTypes.oneOfType([
      PropTypes.object.isRequired,
      PropTypes.bool.isRequired
    ]),
    postId: PropTypes.string.isRequired
  };

  componentDidMount = () => {
    this.setState({
      postId: this.props.postId
    })
  };

  handleFormChange = event => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  submitPost = async () => {
    const {getComments} = this.props;
    const postId = this.state.postId;
    const databaseRef = db.collection('posts').doc(postId);
    console.log(this.props.auth.userData, 'datatatata');
    const {name, uid} = this.props.auth.userData;
    console.log(postId, databaseRef);
    const newComment = {
      title: this.state.form.title,
      content: this.state.form.content,
      author: name,
      authorUid: uid,
      time: new Date().toLocaleString()
    };
    try {
      let existingComments;
      const querySnapshot = await databaseRef.get();
      existingComments = [...querySnapshot.data().comments, newComment];
      console.log(existingComments);
      await databaseRef.update({
        comments: existingComments
      });
      this.setState({
        form: {
          title: '',
          content: '',
        }
      });
      await getComments();
    }
    catch (error) {
      console.log(error);
    }
  };

  render() {
    console.log(this.props.postId)
    const {auth} = this.props;
    if (auth) {
      return (
        <form>
          <h3>Post a comment</h3>
          <label htmlFor="title">Title</label>
          <input id="title" type="text" data-change="title" placeholder="Title" value={this.state.form.title}
                 onChange={this.handleFormChange} className="new-post-input"/>
          <label htmlFor="content">Comment</label>
          <textarea name="content" data-change="content" id="content" rows="3"
                    placeholder="This is content."
                    value={this.state.form.content} onChange={this.handleFormChange}
                    className="new-post-textarea"/>
          <button type="button" onClick={this.submitPost} className="button new-post-button">Submit comment</button>
        </form>
      );
    } else return null;
  }
}
