<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { onMounted, ref } from 'vue';
import { auth } from './firebase.js'
import { signOut, onAuthStateChanged } from 'firebase/auth'

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
    <div class="wrapper px-[30px] py-[15px] bg-bg-header bg-aut bg-top w-[100%] flex justify-between font-lato text-h1 text-brownText">
      <RouterLink to="/">
        <img src="./images/logo.png" class="w-[100px] h-auto" alt="">
      </RouterLink>
      <nav class="flex items-center w-[40%] justify-between">
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/admin">Admin</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <button @click="logOut" v-if="isLoggedIn">Log Out</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>


<style scoped>

</style>
