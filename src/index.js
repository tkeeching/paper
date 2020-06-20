import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase';
import {
  BrowserRouter as Router
} from 'react-router-dom';
require('firebase/firestore');

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

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
