import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7q5KdlcmHS3kuBZYMfyU6BnUsm7U0FQw",
  authDomain: "fir-giphyapp.firebaseapp.com",
  projectId: "fir-giphyapp",
  storageBucket: "fir-giphyapp.appspot.com",
  messagingSenderId: "3742234522",
  appId: "1:3742234522:web:fcd2d4f8c9c240f2f9ec23",
  measurementId: "G-XGFHDQE3XX"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth();

export { app, db, auth };
