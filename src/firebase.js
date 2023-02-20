// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqKVBrUNrJt2bjT5ytSN8jOLlLC7oJnyg",
  authDomain: "furniture-e83a7.firebaseapp.com",
  projectId: "furniture-e83a7",
  storageBucket: "furniture-e83a7.appspot.com",
  messagingSenderId: "712429455549",
  appId: "1:712429455549:web:373128f54fbed7d955cfd4",
  measurementId: "G-66198V2LEX",
  databaseURL:"https://furniture-e83a7-default-rtdb.firebaseio.com/"
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);
 const analytics = getAnalytics(app);
