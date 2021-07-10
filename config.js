import firebase from 'firebase'

require('@firebase/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSkwUzi04uq3oWwWAorzVJxUAa0fiS3HA",
  authDomain: "book-santa123.firebaseapp.com",
  projectId: "book-santa123",
  storageBucket: "book-santa123.appspot.com",
  messagingSenderId: "1061122479524",
  appId: "1:1061122479524:web:a0618bbffe578c698f9d31"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();