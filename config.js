import firebase from 'firebase'

require('@firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBSkwUzi04uq3oWwWAorzVJxUAa0fiS3HA",
  authDomain: "book-santa123.firebaseapp.com",
  databaseURL: "https://book-santa123-default-rtdb.firebaseio.com",
  projectId: "book-santa123",
  storageBucket: "book-santa123.appspot.com",
  messagingSenderId: "1061122479524",
  appId: "1:1061122479524:web:70d94bcbecaaa2bf8f9d31"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig);
}

export default firebase.firestore();