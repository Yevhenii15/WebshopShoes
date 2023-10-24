<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import FooterSection from './components/FooterSection.vue';
import router from './router';

const isLoggedIn = ref(false);
const isAdmin = ref(false);
const sections = ref([]);

const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log('logged out', auth.currentUser);
      router.push('/login');
    })
    .catch((error) => {
      console.error(error);
    });
};

// Create a separate function to check admin status
const checkAdminStatus = (user) => {
  if (user) {
    isLoggedIn.value = true;
    console.log('logged in', auth.currentUser);

    // Check if the user has admin claims
    user.getIdTokenResult()
      .then((idTokenResult) => {
        const claims = idTokenResult.claims;
        if (claims && claims.admin) {
          // User is an admin, set isAdmin to true
          isAdmin.value = true;
          console.log('User is an admin of course');
        } else {
          // User is not an admin, set isAdmin to false
          isAdmin.value = false;
          console.log('User is not an admin of course');
        }
      })
      .catch((error) => {
        console.error('Error getting ID token:', error);
      });
  } else {
    isLoggedIn.value = false;
    isAdmin.value = false;
    console.log('logged out', auth.currentUser);
  }
};

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    checkAdminStatus(user);
  });
});
</script>


<template>
  <header>
    <div class="wrapper bg-bg-header bg-aut bg-top w-[100%] ">
      <div class=" px-[30px] py-[15px] flex justify-between font-lato text-h1 text-brownText relative z-10">
        <RouterLink to="/">
        <img src="./images/logo.png" class="w-[100px] h-auto" alt="">
      </RouterLink>

      <nav :class="isAdmin ? 'logged-in-navbar-as-admin' : (isLoggedIn ? 'logged-in' : 'logged-out')" class="flex items-center justify-between">
        <div :class="isAdmin ? 'logged-in-div-as-admin' : (isLoggedIn ? 'logged-in-div' : 'logged-out-div')" class="flex items-center justify-between ">
          <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>

          <div class="relative flex justify-center">
            <RouterLink class="z-10" to="/shoes">Shoes</RouterLink>
            <div class="absolute w-[70px] h-[13px] bg-beige top-[18px] z-0"></div>
          </div>

          <RouterLink to="/sales">Sales</RouterLink>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/signup">Sign Up</RouterLink>
          <button @click="logOut" v-if="isLoggedIn">Log Out</button>

          <div class="border-solid border-2 border-brownText rounded-full py-2 px-6">
            <RouterLink to="/about">About us</RouterLink>
          </div>
        </div>
        <RouterLink to="/cart/:id"><img src="./images/icons/cart.png" class="w-[40px] h-[40px]" alt=""></RouterLink>
        
        </nav>
      </div>
      

    </div>
  </header>

  <RouterView />
  <FooterSection :sections="sections" />
</template>


<style scoped>
.logged-in-navbar-as-admin {
  width: 47%; /* Adjust this width as needed */
}
.logged-in-div-as-admin{
width: 83%;
}
.logged-in {
  width: 40%;
}
.logged-out{
  width: 35%;
}
.logged-in-div {
  width: 78%;
}
.logged-out-div{
  width: 75%;
}
</style>