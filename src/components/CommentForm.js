import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

const db = firebase.firestore();

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: '',
        content: '',
      },
      postId: ''
    }
  }

  componentDidMount = () => {
    this.setState({
      postId: this.props.postId
    })
  };

  handleFormChange = (event) => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  submitPost = () => {
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
    let existingComments;
    databaseRef.get()
      .then(querySnapshot => {
        existingComments = [...querySnapshot.data().comments, newComment];
        console.log(existingComments);
        databaseRef.update({
          comments: existingComments
        })
          .then(() => {
            console.log('update is success')
            this.setState({
              form: {
                title: '',
                content: '',
              }
            })
          })
          .catch(error => {
            console.log(error);
          });
        console.log("Current data: ", querySnapshot && querySnapshot.data());
      })
      .catch(error => {
        console.log("Error getting document:", error);
      });
  };

  render() {
    console.log(this.props.postId)
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
  }
}

export default CommentForm;
