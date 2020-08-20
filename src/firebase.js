import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCqOQGl6pkKkvd-t8MSgC9yhYjRLK6mQzU",
    authDomain: "cp-instagram-clone.firebaseapp.com",
    databaseURL: "https://cp-instagram-clone.firebaseio.com",
    projectId: "cp-instagram-clone",
    storageBucket: "cp-instagram-clone.appspot.com",
    messagingSenderId: "71914223024",
    appId: "1:71914223024:web:fb924816b918632f8c1275",
    measurementId: "G-687KYZ859N",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
