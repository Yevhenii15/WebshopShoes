<script setup>
import { ref  } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
// For displaying footer sections
import FooterSection from './components/FooterSection.vue';
// For displaying the shopping cart
import ShoppingCart from './components/ShoppingCart.vue';
// Import all functions from the cart module
import { useCart } from './modules/cart.js';
// Import all functions from the login module
import { login } from './modules/login.js';
// Define only functions which are used in the template
const { showCart, cart, toggleCart, handleCloseCart } = useCart();
const { isLoggedIn, isAdmin, logOut } = login();

const sections = ref([]);

</script>

<template>
  <header>
    <div class="wrapper bg-bg-header bg-aut bg-top w-[100%] ">
      <div class=" px-[30px] py-[15px] flex justify-between font-lato text-h1 text-brownText relative z-10">
        <RouterLink to="/">
          <img src="./images/logo.png" class="w-[100px] h-auto" alt="">
        </RouterLink>
        <!-- For custom style of navbar (width) when user is logged in or not and also if logged in as admin -->
        <nav :class="isAdmin ? 'logged-in-navbar-as-admin' : (isLoggedIn ? 'logged-in' : 'logged-out')" class="flex items-center justify-between">
          <div :class="isAdmin ? 'logged-in-div-as-admin' : (isLoggedIn ? 'logged-in-div' : 'logged-out-div')" class="flex items-center justify-between ">

            <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>

            <div class="relative flex justify-center">
              <RouterLink class="z-10" to="/shoes">Shoes</RouterLink>
              <div class="absolute w-[70px] h-[13px] bg-beige top-[18px] z-0"></div>
            </div>

            <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
            <div v-if="isLoggedIn" class="border-solid border-2 border-brownText rounded-full py-2 px-6">
              <button @click="logOut" v-if="isLoggedIn">Log Out</button>
            </div>
            <div v-if="!isLoggedIn" class="border-solid border-2 border-brownText rounded-full py-2 px-6">
              <RouterLink v-if="!isLoggedIn" to="/signup">Sign Up</RouterLink>
            </div>
          
          </div>

          <button @click="toggleCart"><img src="./images/icons/cart.png" class="w-[40px] h-[40px]" alt=""></button>

        </nav>

      </div>
    </div>
  </header>

  <RouterView />
  <FooterSection :sections="sections" />
  <ShoppingCart :show="showCart" :cart="cart" @close="handleCloseCart" />

</template>


<style scoped>
/* Just style for different logged in users */
.logged-in-navbar-as-admin {
  width: 30%; 
}
.logged-in-div-as-admin{
width: 70%;
}
.logged-in {
  width: 21%;
}
.logged-out{
  width: 28%;
}
.logged-in-div {
  width: 68%;
}
.logged-out-div{
  width: 70%;
}

</style>