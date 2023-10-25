<template>
    <div>
      <div class="bg-bg bg-aut bg-top h-[654px] flex justify-center py-[15%] font-montresant text-h1 text-brownText">
        <div class="w-[15%] flex flex-wrap justify-center">
          <h1 class="text-[2rem] text-brownText font-lato uppercase text-center">Login page</h1>
          <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText my-3" placeholder="Username" v-model="email" />
          <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText" placeholder="Password" type="password" v-model="password" />
          <p v-if="errMSG">{{ errMSG }}</p>
          <button class="border-solid border-2 border-brownText font-lato w-auto rounded-full bg-transparent py-1 px-6 my-3" @click="logIn">Login</button>
        </div>
      </div>
    </div>
  </template>
 <script setup>
 import { ref } from 'vue';
 import { auth } from '../firebase.js';
 import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
 import router from '../router';
 
 const email = ref('');
 const password = ref('');
 const errMSG = ref('');
 const adminclaimed = ref(null);
 
 const logIn = () => {
   signInWithEmailAndPassword(auth, email.value, password.value)
     .then(() => {
       onAuthStateChanged(auth, (user) => {
         if (user) {
           user.getIdTokenResult()
             .then((idTokenResult) => {
               const claims = idTokenResult.claims;
 
               if (claims) {
                 adminclaimed.value = claims.admin;
                 if (adminclaimed.value) {
                   console.log('User is an admin.', claims);
                   router.push({ name: 'admin' });
                 } else {
                   console.log('User is not an admin.');

                   console.log('Previous route:', router.previousRoute);
                   if (router.previousRoute.name !== 'signup') {
                     router.push(router.previousRoute.fullPath);
                   } else {
                     // If no previous route, go to the default route
                     router.push({ name: 'home' });
                   }
                 }
               } else {
                 // Handle the case where 'admin' property is not in claims
                 console.log('User does not have admin claims.');
               }
             })
             .catch((error) => {
               console.error('Error getting ID token:', error);
             });
         }
       });
     })
     .catch((error) => {
       console.error('Authentication error:', error);
     });
 };
 
 const beforeRouteEnter = (to, from, next) => {
   router.previousRoute = from; // Capture the previous route
   next();
 };
 </script>
 