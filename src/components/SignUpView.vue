<template>
      <div  class="bg-bg bg-aut bg-top h-[654px] flex justify-center py-[15%] font-montresant text-h1 text-brownText">
        <div class="xs:w-[60%] md:w-[40%] lg:w-[20%] xl:w-[15%] z-20 relative flex flex-col items-center justify-center">
          <h1 class="text-[2rem] text-brownText font-lato uppercase text-center">Sign Up</h1>
          <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] h-[10%] lg:h-auto py-1 px-6 placeholder:text-brownText my-3" placeholder="Email" v-model="email" />
          <input  class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] h-[10%] lg:h-auto py-1 px-6 placeholder:text-brownText" placeholder="Password" type="password" v-model="password" />
          <p v-if="errMSG">{{ errMSG }}</p>
          <button class="border-solid border-2 border-brownText font-lato w-[70%] rounded-full bg-transparent h-[10%] lg:h-auto py-1 px-6 my-3" @click="signUp">Sign Up</button>
        </div>
      </div>
  </template>
  
  <script setup>
import { login } from '../modules/login.js';
const { email, password, errMSG, signUp } = login();

</script>

  
  