<template>
    <div class="admin bg-bg bg-auto bg-top px-[8%] pb-[5rem] flex w-[100%] flex-wrap">
      <!-- Looping to display products -->
      <div class="w-[50%] relative z-[100]" v-for="product in products" :key="product.id">
        <router-link :to="'/product/' + product.id">
          <div class="relative flex justify-center items-center">
            <img class=" relative object-cover" src="../images/product-bg.png" alt="">
            <img class="absolute w-[41%] h-[35vh] object-cover object-center " :src="product.productImages[0]" :alt="product.productName" />
          </div>
          <div class="absolute top-[88%] left-[26.5%]">
            <h2 class="text-h1 text-brownText font-lato">{{ product.productName }}</h2>
            <p class="text-h1 text-brownText font-montserrat">{{ product.productPrice }} kr</p>
          </div>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted } from 'vue';
  // Importing the fetchProducts function from the showProduct module
  import { fetchProducts } from '../modules/showProduct.js';
  
  export default {
    setup() {
      const { products, fetchData } = fetchProducts();
  
      onMounted(fetchData);
  
      return {
        products,
      };
    },
  };
  </script>
  