import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: "AIzaSyBiwHjB0-V0ZdxoykRq-U3188bS3KWo3uM",
  authDomain: "react-sample-bf33c.firebaseapp.com",
  projectId: "react-sample-bf33c",
  storageBucket: "react-sample-bf33c.appspot.com",
  messagingSenderId: "424213479397",
  appId: "1:424213479397:web:cc3cc794f7cdba8765b90c",
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };
