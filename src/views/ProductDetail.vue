<template>
    <div class="product-detail bg-bg bg-auto bg-top pb-[5rem] w-[100%]">
      <div class=" flex " v-if="product">
        <div class="relative w-[50%] flex justify-center items-center">
          <img class="relative object-cover" src="../images/product-bg.png" alt="">
          <img class="absolute w-[41%] h-[42vh] object-cover object-center" :src="product.productImages[0]" :alt="product.productName" />
        </div>
        <div class="w-[50%] py-[5%]">
          <h1 class="text-h1-lg text-brownText font-lato mb-1">{{ product.productName }}</h1>
          <p class="font-montserrat text-h1 text-brownText mb-1">Price: <br> <span class="font-lato">{{ product.productPrice }} kr</span></p>
          <div class="flex">
            <div class="flex flex-col mr-[5%]">
              <label for="size" class="text-brownText text-h1 font-montserrat mb-1">Size:</label>
              <div class="relative">
                <button
                  id="size-dropdown"
                  class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-3 text-brownText placeholder-text-brownText"
                  @click="toggleSizeDropdown"
                >
                  {{ selectedSize || 'Select Size' }}
                </button>
                <ul
                  id="size-options"
                  class="hidden absolute z-10 py-2 w-[100%] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                >
                  <li
                    v-for="size in product.productSize"
                    :key="size"
                    class="px-4 py-2 text-sm text-brownText hover:bg-gray-100 cursor-pointer"
                    @click="selectSize(size)"
                  >
                    {{ size }}
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex flex-col">
              <label for="color" class="text-brownText text-h1 font-montserrat mb-1">Color:</label>
              <div class="relative">
                <button
                  id="color-dropdown"
                  class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-3 text-brownText placeholder-text-brownText"
                  @click="toggleColorDropdown"
                >
                  {{ selectedColor || 'Select Color' }}
                </button>
                <ul
                  id="color-options"
                  class="hidden absolute z-10 py-2 w-[100%] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                >
                  <li
                    v-for="color in product.productColor"
                    :key="color"
                    class="px-4 py-2 text-sm text-brownText hover-bg-gray-100 cursor-pointer"
                    @click="selectColor(color)"
                  >
                    {{ color }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <p class="w-[40%] text-brownText font-montserrat text-h1 mb-1">Description: </p>
          <p class="w-[40%] text-brownText font-montserrat text-p mb-3">{{ product.productDescription }}</p>
          <button
            class="border-solid border-2 border-brownText font-lato rounded-full bg-[rgba(255,255,255,0.5)] text-[1.6rem] py-2 px-6 text-brownText hover:bg-gray-100"
            @click="addToCart">
            Add to Cart
          </button>
        </div>
      </div>
      <div v-else>
        <p>Loading...</p>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';  // Import the useRoute function
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';  // Import your Firebase configuration
  
  export default {
    setup() {
      const route = useRoute();  // Use useRoute to access route parameters
      const product = ref(null);
      const selectedSize = ref(''); // Initialize selectedSize
      const selectedColor = ref(''); // Initialize selectedColor
      
  
      const toggleSizeDropdown = () => {
        const sizeOptions = document.getElementById('size-options');
        sizeOptions.classList.toggle('hidden');
      };
  
      const selectSize = (size) => {
        selectedSize.value = size;
        toggleSizeDropdown(); // Close the size dropdown after selection
      };
  
      const toggleColorDropdown = () => {
        const colorOptions = document.getElementById('color-options');
        colorOptions.classList.toggle('hidden');
      };
  
      const selectColor = (color) => {
        selectedColor.value = color;
        toggleColorDropdown(); // Close the color dropdown after selection
      };
  
      const addToCart = () => {
        // Add the selected product, size, and color to the cart
        console.log('Added to Cart:', product.value, selectedSize, selectedColor);
      };
  
      const fetchProduct = async () => {
        const productId = route.params.id;  // Access the 'id' parameter from the route
  
        try {
          const productDoc = doc(db, 'products', productId);
          const productSnapshot = await getDoc(productDoc);
  
          if (productSnapshot.exists()) {
            product.value = {
              id: productSnapshot.id,
              ...productSnapshot.data(),
            };
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
  
      onMounted(fetchProduct);
  
      return {
        product,
        selectedSize,
        selectedColor,
        toggleSizeDropdown,
        selectSize,
        toggleColorDropdown,
        selectColor,
        addToCart,
      };
    },
  };
  </script>
  