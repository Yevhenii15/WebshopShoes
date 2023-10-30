<template>
    <div class="product-detail bg-bg bg-auto bg-top pb-[5rem] w-[100%]">
      <div class=" flex relative z-20 " v-if="product">
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
            <div class="flex flex-col">
              <label for="productInStock" class="text-brownText text-h1 font-montserrat mb-1">Product In Stock:</label>
              <div class="relative">
                <button
                  id="productInStock-dropdown"
                  class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-3 text-brownText placeholder-text-brownText"
                  @click="toggleProductInStockDropdown"
                >
                  {{ selectedProductInStock || 'Select Quantity' }}
                </button>
                <ul
                  id="productInStock-options"
                  class="hidden absolute z-10 py-2 w-[100%] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                >
                  <li
                    v-for="variant in variants"
                    :key="variant"
                    class="px-4 py-2 text-sm text-brownText hover-bg-gray-100 cursor-pointer"
                    @click="selectProductInStock(variant)"
                  >
                    {{ variant }}
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
  import { useRoute } from 'vue-router';
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { db, auth } from '../firebase'; // Import your Firebase configuration, including auth
  import { login } from '../modules/login.js';
  
  export default {
    setup() {
      const route = useRoute();
      const product = ref(null);
      const selectedSize = ref('');
      const selectedColor = ref('');
      const selectedProductInStock = ref(null);
      const variants = ref([]);

    const toggleProductInStockDropdown = () => {
      const productInStockOptions = document.getElementById('productInStock-options');
      productInStockOptions.classList.toggle('hidden');
    };

    const selectProductInStock = (variant) => {
      selectedProductInStock.value = variant;
      toggleProductInStockDropdown();
    };

    // Generate variants from 1 to 9
    for (let i = 1; i <= 9; i++) {
      variants.value.push(i);
    }  
      const toggleSizeDropdown = () => {
        const sizeOptions = document.getElementById('size-options');
        sizeOptions.classList.toggle('hidden');
      };
      
      const selectSize = (size) => {
        selectedSize.value = size;
        toggleSizeDropdown();
      };
  
      const toggleColorDropdown = () => {
        const colorOptions = document.getElementById('color-options');
        colorOptions.classList.toggle('hidden');
      };
  
      const selectColor = (color) => {
        selectedColor.value = color;
        toggleColorDropdown();
      };
      const { isLoggedIn } = login();

      const addToCart = async () => {
  if (product.value && selectedSize.value && selectedColor.value && selectedProductInStock.value) {
    // Check if the user is logged in using the `isLoggedIn` variable
    if (isLoggedIn.value) {
      // User is authenticated
      const user = auth.currentUser;


    if (user) {
      // Create a simplified item to add to the cart
      const itemToAdd = {
        id: product.value.id,             // Product ID
        name: product.value.productName,  // Product name
        price: product.value.productPrice, // Product price
        size: selectedSize.value,         // Selected size
        color: selectedColor.value,       // Selected color
        quantity: selectedProductInStock.value, // Selected productInStock
      };

      // Get the user's cart document from Firestore
      const userCartRef = doc(db, 'userCarts', user.uid); // Use the UID from the authenticated user
      const userCartSnapshot = await getDoc(userCartRef);

      if (userCartSnapshot.exists()) {
        // If the user has a cart, update it with the new item
        const userCartData = userCartSnapshot.data();
        if (!userCartData.cart || !Array.isArray(userCartData.cart)) {
          // Initialize the cart field as an empty array if it's not already
          userCartData.cart = [];
        }
        userCartData.cart.push(itemToAdd);

        // Update the user's cart in Firestore
        await updateDoc(userCartRef, { cart: userCartData.cart });

        console.log('Item added to the cart:', itemToAdd);
      } else {
        // Handle the case where the user doesn't have a cart yet
        console.log('User cart document does not exist.');
      }
    } else {
      console.log('User is not authenticated.');
    }
  } else {
      // User is not authenticated, display a message or take action
      alert('Please log in to add items to your cart.');
      // You can also redirect the user to the login page or show a login modal.
    }
  } else {
    console.log("One or more of the required fields is not set.");
  }
};


  
  
      const fetchProduct = async () => {
        const productId = route.params.id;
  
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
        selectedProductInStock,
        toggleProductInStockDropdown,
        selectProductInStock,
        variants,
      };
    },
  };
  </script>