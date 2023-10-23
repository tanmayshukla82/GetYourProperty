// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "getyourproperty-b9a38.firebaseapp.com",
  projectId: "getyourproperty-b9a38",
  storageBucket: "getyourproperty-b9a38.appspot.com",
  messagingSenderId: "969529112399",
  appId: "1:969529112399:web:eb0c12b7e42c9dc1f1b73a",
};

// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);
