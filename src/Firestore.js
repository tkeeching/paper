import firebase from 'firebase';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqLPBeBbaM4nuQGCM6uQvrKfu0XX3tGt8",
  authDomain: "paper-1fe4c.firebaseapp.com",
  databaseURL: "https://paper-1fe4c.firebaseio.com",
  projectId: "paper-1fe4c",
  storageBucket: "paper-1fe4c.appspot.com",
  messagingSenderId: "260129460986",
  appId: "1:260129460986:web:8bb29d2eb6b129f3cfef43",
  measurementId: "G-JCJXGQWS3D"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase.firestore();