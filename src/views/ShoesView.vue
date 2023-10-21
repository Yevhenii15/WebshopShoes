<template>
    <div class="admin bg-bg bg-auto bg-top px-[8%] pb-[5rem] flex w-[100%] flex-wrap">
      <div class="w-[50%] relative z-20" v-for="product in products" :key="product.id">
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
  import { ref, onMounted } from 'vue';
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../firebase'; // Import your Firebase configuration
  
  export default {
    setup() {
      const products = ref([]);
  
      const fetchProducts = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, 'products'));
          const productsData = [];
  
          querySnapshot.forEach((doc) => {
            productsData.push({ id: doc.id, ...doc.data() });
          });
  
          products.value = productsData;
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      };
  
      onMounted(fetchProducts);
  
      return {
        products,
      };
    },
  };
  </script>
  