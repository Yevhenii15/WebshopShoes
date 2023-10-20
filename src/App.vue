<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { onMounted, ref } from 'vue';
import { auth } from './firebase.js'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import FooterSection from './components/FooterSection.vue'

import router from './router'

let isLoggedIn = ref(false)

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isLoggedIn.value = true
      console.log('logged in', auth.currentUser)

    } else {
      isLoggedIn.value = false
      console.log('logged out', auth.currentUser)

    }
  })
})

let logOut = () => {
  signOut(auth)
  .then(() => {
    console.log('logged out', auth.currentUser)
    router.push('/login')
  })
  .catch((error) => {
    console.log(error)
  })
}
</script>

<template>
  <header>
    <div class="wrapper bg-bg-header bg-aut bg-top w-[100%] ">
      <div class=" px-[30px] py-[15px] flex justify-between font-lato text-h1 text-brownText relative z-10">
        <RouterLink to="/">
        <img src="./images/logo.png" class="w-[100px] h-auto" alt="">
      </RouterLink>

      <nav class="flex items-center w-[28%] justify-between">
        <div class="flex items-center justify-between w-[75%]">
          <div class="relative flex justify-center">
            <RouterLink class="z-10" to="/shoes">Shoes</RouterLink>
            <div class="absolute w-[70px] h-[13px] bg-beige top-[18px] z-0"></div>
          </div>

          <RouterLink to="/sales">Sales</RouterLink>

          <div class="border-solid border-2 border-brownText rounded-full py-2 px-6">
            <RouterLink to="/about">About us</RouterLink>
          </div>
        </div>
        
        <img src="./images/icons/cart.png" class="w-[40px] h-[40px]" alt="">

        <RouterLink class="hidden" to="/admin">Admin</RouterLink>
        <RouterLink class="hidden" to="/login">Login</RouterLink>
        <button class="hidden" @click="logOut" v-if="isLoggedIn">Log Out</button>
      </nav>
      </div>
      

    </div>
  </header>

  <RouterView />
<!--   <FooterSection :sections="sections" />
 --></template>


<style scoped>

</style>
