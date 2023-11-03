<template>
      <div class="product-detail bg-bg bg-auto bg-top pb-[5rem] w-[100%]">
        <!-- Looping product -->
        <div class="flex flex-wrap flex-col md:flex-wrap md:flex-row" v-if="product">
          <div class="relative md:w-[50%] w-[100%] flex justify-center items-center bg-bg-product  bg-no-repeat	bg-contain		">
            <div class="w-full h-[55vh] flex justify-center items-center ">
              <!-- Slider -->
              <swiper class=" w-[41%] relative md:top-[-7.5%] sm:top-[0] top-[-16.5%] flex justify-center" :modules="modules" :pagination="{ clickable: true }" :autoplay="{ delay: 2500, disableOnInteraction: false }">
                <swiper-slide class="flex justify-center" v-for="(image, index) in product.productImages" :key="index">
                  <img class="w-[100%] md:h-[42vh] sm:h-[32vh] h-[21.5vh] object-cover object-center" :src="image" :alt="product.productName" />
                </swiper-slide>
              </swiper>
            </div>
          </div>
        
          <div class="md:w-[50%] top-[-190px] md:top-0 relative w-[100%] px-[10%] md:px-0 py-[5%]">
            <h1 class="text-h1-lg text-brownText font-lato mb-1">{{ product.productName }}</h1>
            <p class="font-montserrat text-h1 text-brownText mb-1">Price: <br> <span class="font-lato">{{ product.productPrice }} kr</span></p>
            <div class="flex flex-wrap ">
              <!-- Choose size -->
              <div class="flex flex-col mr-[5%] relative z-[103]">
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
              <!-- Choose color -->
              <div class="flex flex-col mr-[5%] relative z-[102]">
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
              <!-- Choose quantity -->
              <div class="flex flex-col relative z-[100]">
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
            <p class="md:w-[40%] w-[100%]  text-brownText font-montserrat text-p mb-3">{{ product.productDescription }}</p>
            <button
              class="relative z-[51] border-solid border-2 border-brownText font-lato rounded-full bg-[rgba(255,255,255,0.5)] text-[1.6rem] py-2 px-6 text-brownText hover:bg-gray-100"
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { doc, getDoc,  updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { login } from '../modules/login.js';
import { fetchProducts } from '../modules/showProduct.js'; // Import fetchData from showProduct.js
// Import necessary libraries and components for Swiper
import SwiperClass, { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

// Import CSS styles for Swiper and its Pagination component
import 'swiper/css';
import 'swiper/css/pagination';

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  setup() {
    // Configure and use Swiper plugins
    SwiperClass.use([Pagination, Autoplay]);
    // Use the useRoute() function to get the current route
    const route = useRoute();
    // Create a reference to the product object
    const product = ref(null);
    const { isLoggedIn } = login();
    const { fetchData } = fetchProducts();
    // Use the useAddToCart() function to get the selected size and color
    // Create a reference to the selected quantity
    const selectedProductInStock = ref(null);
    const selectedSize = ref('');
    const selectedColor = ref('');

    // Create a computed property to get the variants
    const variants = computed(() => {
      const productInStock = product.value ? product.value.productInStock : 0;
      if (productInStock > 0) {
        return Array.from({ length: productInStock }, (_, index) => index + 1);
      } else {
        return [];
      }
    });
    // Create a function to toggle the option
    const toggleDropdown = (dropdownId) => {
      const dropdown = document.getElementById(dropdownId);
      dropdown.classList.toggle('hidden');
    };
    // Create a function to select the option
    const selectOption = (option, selectedValue, dropdownId, toggleDropdownFn) => {
      selectedValue.value = option;
      toggleDropdownFn(dropdownId);
    };
    // Define functions to toggle and select the size, color, and quantity
    const toggleSizeDropdown = () => {
      toggleDropdown('size-options');
    };

    const selectSize = (size) => {
      selectOption(size, selectedSize, 'size-options', toggleSizeDropdown);
    };

    const toggleColorDropdown = () => {
      toggleDropdown('color-options');
    };

    const selectColor = (color) => {
      selectOption(color, selectedColor, 'color-options', toggleColorDropdown);
    };

    const toggleProductInStockDropdown = () => {
      toggleDropdown('productInStock-options');
    };

    const selectProductInStock = (variant) => {
      selectOption(variant, selectedProductInStock, 'productInStock-options', toggleProductInStockDropdown);
    };
    // Create a function to add the item to the cart
    const addToCart = async () => {
    // Check if the required fields are set
    if (
      product.value &&
      selectedSize.value &&
      selectedColor.value &&
      selectedProductInStock.value !== null
    ) {
      // The quantity is not null, and it's been selected.
      // Proceed with adding the item to the cart.
      // Check if the user is logged in
      if (isLoggedIn.value) {
        const user = auth.currentUser;
        if (user) {
          // The user is logged in.
          // Proceed with adding the item to the cart.
          const itemToAdd = {
            id: product.value.id,
            name: product.value.productName,
            price: product.value.productPrice,
            size: selectedSize.value,
            color: selectedColor.value,
            quantity: selectedProductInStock.value,
            image: product.value.productImages[0],
          };
          // Create a reference to the user cart document
          const userCartRef = doc(db, 'userCarts', user.uid);
          const userCartSnapshot = await getDoc(userCartRef);
          // Check if the user cart document exists
          if (userCartSnapshot.exists()) {
            const userCartData = userCartSnapshot.data();
            // Check if the cart property exists and is an array
            if (!userCartData.cart || !Array.isArray(userCartData.cart)) {
              userCartData.cart = [];
            }
            // Add the item to the cart
            userCartData.cart.push(itemToAdd);
            // Update the user cart document
            await updateDoc(userCartRef, { cart: userCartData.cart });

            alert('Item added to cart!');
          } else {
            // console.log('User cart document does not exist.');
          }
        } else {
          // console.log('User is not authenticated.');
        }
      } else {
        alert('Please log in to add items to your cart.');
      }
    } else {
      alert('One or more of the required fields is not set.');
    }
  };
  // Create a function to fetch the product
  const fetchProduct = async () => {
    // Get the product ID from the route
    const productId = route.params.id;

    try {
      // Call fetchData to load products
      fetchData();
      // Create a reference to the product document
      const productDoc = doc(db, 'products', productId);
      const productSnapshot = await getDoc(productDoc);
      // Check if the product document exists
      if (productSnapshot.exists()) {
        product.value = {
          id: productSnapshot.id,
          ...productSnapshot.data(),
        };
      } else {
        // console.log('No such document!');
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
      toggleProductInStockDropdown,
      selectProductInStock,
      selectedProductInStock,
      variants,
      modules: [Pagination, Autoplay],
    };
  },
};

</script>
