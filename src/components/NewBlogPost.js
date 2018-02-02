import React, {Component} from 'react';
import firebase from '../firebaseConfig';
import 'firebase/firestore';

const db = firebase.firestore();

class NewBlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: '',
        tags: '',
        content: '',
        comments: [],
        author: '',
        authorUid: ''
      },
      author: '',
      authorUid: ''
    }
  }

  componentDidMount = () => {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      const author = firebase.auth().currentUser.displayName;
      const authorUid = firebase.auth().currentUser.uid;
      this.setState({
        author: author,
        authorUid: authorUid
      })
    }
  };

  handleFormChange = (event) => {
    const target = event.target.getAttribute('data-change');
    const formValues = this.state.form;
    formValues[target] = event.target.value;
    this.setState({
      form: formValues
    });
  };

  submitPost = async () => {
    const formValues = this.state.form;
    formValues.tags = formValues.tags.split(/\s*#[#\s]*/).join('#').toLowerCase().split('#');
    formValues.tags.splice(0, 1);
    formValues.content.indexOf('\n') > -1 ? formValues.content = formValues.content.split('\n') : formValues.content = [formValues.content];
    formValues.time = new Date().toLocaleString();
    formValues.author = this.state.author;
    formValues.authorUid = this.state.authorUid;

    this.setState({
      post: formValues,
      form: {
        title: '',
        tags: '',
        content: '',
        comments: [],
        author: '',
        authorUid: ''
      }
    });

    const databaseRef = db.collection('posts');
    try {
      const result = await databaseRef.add(formValues);
      console.log("Document written with ID: ", result.id, result);
    }
    catch (error) {
      console.log(error)
    }
  };

  render() {
    return (
      <section className="new-post">
        <header className="header">
          <span className="jam jam-pencil"></span>
          <h1>Create a new post</h1>
        </header>
        <div className="new-post-form">
          <form>
            <label htmlFor="title">Title</label>
            <input id="title" type="text" data-change="title" placeholder="Title" value={this.state.form.title}
                   onChange={this.handleFormChange} className="new-post-input"/>
            <label htmlFor="content">Content</label>
            <textarea name="content" data-change="content" id="content" cols="30" rows="10"
                      placeholder="This is content."
                      value={this.state.form.content} onChange={this.handleFormChange}
                      className="new-post-textarea"/>
            <label htmlFor="tags">Tags</label>
            <input id="tags" type="text" data-change="tags" placeholder="#tags #go #like #this #or this"
                   value={this.state.form.tags}
                   onChange={this.handleFormChange}
                   className="new-post-input"/>
            <button type="button" onClick={this.submitPost} className="button new-post-button">Post</button>
          </form>
        </div>
      </section>
    );
  }
}

export default NewBlogPost;
