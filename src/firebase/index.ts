// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "chessy-mate.firebaseapp.com",
  databaseURL: "https://chessy-mate-default-rtdb.firebaseio.com",
  projectId: "chessy-mate",
  storageBucket: "chessy-mate.appspot.com",
  messagingSenderId: "183597407593",
  appId: "1:183597407593:web:9cecef304c03356c87f1f8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase();
