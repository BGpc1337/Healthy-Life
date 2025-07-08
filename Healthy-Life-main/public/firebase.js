import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWCZSN1Eo-B7RxZgPQ0qkG_T6V2e75PZo",
  authDomain: "healthy-life-64ca0.firebaseapp.com",
  projectId: "healthy-life-64ca0",
  storageBucket: "healthy-life-64ca0.appspot.com",  
  messagingSenderId: "968139723167",
  appId: "1:968139723167:web:0d7b0ca207be172ce12daa",
  measurementId: "G-3QEHS0MYD1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
