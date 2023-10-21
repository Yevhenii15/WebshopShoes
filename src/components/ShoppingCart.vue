<template>
  <div>
    <h2>Shopping Cart</h2>
    <ul>
      <li v-for="(item, index) in shoppingCart" :key="index">
        {{ item.product.productName }} - Size: {{ item.size }}, Color: {{ item.color }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { onMounted } from 'vue';
import { doc, getDoc } from 'firebase/firestore';
import { useRoute } from 'vue-router';
import { db } from '../firebase'; // Import your Firebase configuration
import { shoppingCart } from '../modules/ShoppingCart.js'; // Import the shopping cart data

const product = ref(null);

const route = useRoute();

const fetchProduct = async () => {
  const productId = route.params.id; // Use route.params.id to access the 'id' parameter

  if (productId) {
    try {
      const productDoc = doc(db, 'products', productId);
      const productSnapshot = await getDoc(productDoc);

      if (productSnapshot.exists()) {
        product.value = {
          id: productSnapshot.id,
          ...productSnapshot.data(),
        };
      } else {
        console.log('Document does not exist');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  } else {
    console.error('Invalid or missing "id" parameter in the route.');
  }
};


onMounted(fetchProduct);
</script>
