import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCEO1Y_AMZxJBmoP34cUqJSLYDqok3sDy0",
  authDomain: "simple-blog-page.firebaseapp.com",
  databaseURL: "https://simple-blog-page.firebaseio.com",
  projectId: "simple-blog-page",
  storageBucket: "",
  messagingSenderId: "786294716778"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();