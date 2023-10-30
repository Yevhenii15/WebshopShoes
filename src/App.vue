<script setup>
import { ref  } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import FooterSection from './components/FooterSection.vue';
import ShoppingCart from './components/ShoppingCart.vue';
import { useCart } from './modules/cart.js';
import { login } from './modules/login.js';

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

      <nav :class="isAdmin ? 'logged-in-navbar-as-admin' : (isLoggedIn ? 'logged-in' : 'logged-out')" class="flex items-center justify-between">
        <div :class="isAdmin ? 'logged-in-div-as-admin' : (isLoggedIn ? 'logged-in-div' : 'logged-out-div')" class="flex items-center justify-between ">
          <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>

          <div class="relative flex justify-center">
            <RouterLink class="z-10" to="/shoes">Shoes</RouterLink>
            <div class="absolute w-[70px] h-[13px] bg-beige top-[18px] z-0"></div>
          </div>

          <RouterLink to="/sales">Sales</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/login">Login</RouterLink>
          <RouterLink v-if="!isLoggedIn" to="/signup">Sign Up</RouterLink>
          <button @click="logOut" v-if="isLoggedIn">Log Out</button>

          <div class="border-solid border-2 border-brownText rounded-full py-2 px-6">
            <RouterLink to="/about">About us</RouterLink>
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
.logged-in-navbar-as-admin {
  width: 42%; /* Adjust this width as needed */
}
.logged-in-div-as-admin{
width: 82%;
}
.logged-in {
  width: 35%;
}
.logged-out{
  width: 40%;
}
.logged-in-div {
  width: 78%;
}
.logged-out-div{
  width: 80%;
}

</style>