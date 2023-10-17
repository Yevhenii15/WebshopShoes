// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // <- needed for auth

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


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
const auth = getAuth(app); // <- needed for auth 
export { auth }; // <- needed for auth
export const db = getFirestore(app);
