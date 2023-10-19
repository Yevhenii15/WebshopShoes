// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Make sure this import is correct

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvU_BLm-jlXR4mnBR2PmH2OH35Vj4IbQQ",
  authDomain: "webshopshoes.firebaseapp.com",
  projectId: "webshopshoes",
  storageBucket: "webshopshoes.appspot.com",
  messagingSenderId: "328195760586",
  appId: "1:328195760586:web:31a98c562c56e193ccef33"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, db, storage };
