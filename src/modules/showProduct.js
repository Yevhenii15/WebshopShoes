import { ref } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase'; // Import your Firebase configuration

export function fetchProducts() {
  const products = ref([]);

  const fetchData = async () => {
    try {
      // console.log('Fetching products...');
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = [];

      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() });
      });

      products.value = productsData;

      // console.log('Fetched products:', products.value); // Add this line to check the fetched data
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return {
    products,
    fetchData,
  };
}
