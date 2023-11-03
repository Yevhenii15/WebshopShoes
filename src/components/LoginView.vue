<template>
    <div class="bg-bg bg-aut bg-top h-[654px] flex justify-center py-[15%] font-montresant text-h1 text-brownText">
      <div class="w-[15%] z-20 relative flex flex-wrap justify-center">
        <h1 class="text-[2rem] text-brownText font-lato uppercase text-center">Login page</h1>
        <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText my-3" placeholder="Username" v-model="email" />
        <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText" placeholder="Password" type="password" v-model="password" />
        <p v-if="errMSG">{{ errMSG }}</p>
        <button class="border-solid border-2 border-brownText font-lato w-auto rounded-full bg-transparent py-1 px-6 my-3" @click="logIn">Login</button>
      </div>
    </div>
  </template>

<script setup>
// Importing the login function from the login module
import { login } from "../modules/login.js";
// Define the login function which is used in the template
const { logIn, email, password, errMSG,} = login();
</script>

 