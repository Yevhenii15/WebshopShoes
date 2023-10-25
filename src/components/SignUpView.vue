<template>
    <div>
      <div class="bg-bg bg-aut bg-top h-[654px] flex justify-center py-[15%] font-montresant text-h1 text-brownText">
        <div class="w-[15%] flex flex-wrap justify-center">
          <h1 class="text-[2rem] text-brownText font-lato uppercase text-center">Sign Up</h1>
          <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText my-3" placeholder="Email" v-model="email" />
          <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText" placeholder="Password" type="password" v-model="password" />
          <p v-if="errMSG">{{ errMSG }}</p>
          <button class="border-solid border-2 border-brownText font-lato w-auto rounded-full bg-transparent py-1 px-6 my-3" @click="signUp">Sign Up</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
import { ref } from 'vue';
import { auth, db } from '../firebase.js'; // Import both auth and db
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import router from '../router';

const email = ref('');
const password = ref('');
const errMSG = ref('');

let signUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log('Sign-up successful:', user);

    // Create a user's cart collection in Firestore
    const userCartsCollection = collection(db, 'userCarts');
    const userCartDoc = doc(userCartsCollection, user.uid);
    await setDoc(userCartDoc, { products: [] }); // Initialize the cart with an empty array

    router.push({ name: 'login' }); // Redirect to the login page after signing up
  } catch (error) {
    console.error('Sign-up error:', error.message);
    errMSG.value = error.message;
  }
};
</script>

  
  