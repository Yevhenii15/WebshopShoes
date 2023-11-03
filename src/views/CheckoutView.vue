<template>
    <div class="checkout bg-bg bg-auto bg-top px-[20%] py-[3rem] w-[100%]">
      <div class="bg-[#daad8994] py-[3%] px-[5%] text-brownText relative z-[70] font-lato rounded-[1.25rem]">
        <!-- Checkout -->
        <h1 class="text-h1-lg text-center mb-5">Checkout</h1>
        <h2 class="text-h1 ">Products:</h2>
        <!-- Products -->
        <ul role="list" class=" divide-y divide-gray-200 mb-[3%]">
          <li v-for="item in cart" :key="item.id" class="flex py-6">
            <div class="flex-shrink-0 relative">
                <img :src="item.image" :alt="item.name" class="w-[15vh] h-[15vh] object-cover object-center" />
            </div>
            <div class="ml-4 flex w-[100%] justify-between">
                <div class="flex flex-col justify-between text-base font-p text-brownText">
                    <h3 class="font-bold">
                        {{ item.name }}
                    </h3>
                <p class="mt-1 text-sm text-brownText">Size: <span class="font-montserrat">{{ item.size }}</span></p>
                <p class="mt-1 text-sm text-brownText">Color: <span class="font-montserrat">{{ item.color }}</span></p>
                <p class="mt-1 text-sm text-brownText">Quantity: <span class="font-montserrat">{{ item.quantity }}</span></p>
                </div>
                <div class="flex justify-between flex-col">
                <p class="ml-4 flex justify-end font-bold text-base font-p text-brownText">{{ item.price * item.quantity }} kr</p>
                </div>
            </div>
          </li>
        </ul>

        <h2 class="text-h1 mb-[1%]">Shipping address:</h2>
        <h3 class=" font-montserrat mb-[1%]">(Shipping is free)</h3>

        <!-- Input for adress -->
        <div>
            <input v-model="shippingAddress.street" class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-[100%] py-1 px-6 mb-5 placeholder:text-brownText" type="text" placeholder="Street and number of house or appartment">
            <input v-model="shippingAddress.town" class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-[50%] py-1 px-6 mb-5 placeholder:text-brownText" type="text" placeholder="Town">
            <input v-model="shippingAddress.zip" class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-[50%] py-1 px-6 mb-5 placeholder:text-brownText" type="text" placeholder="Zip">
            <input v-model="shippingAddress.country" class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-[100%] py-1 px-6 mb-5 placeholder:text-brownText" type="text" placeholder="Country">
        </div>

        <div>
            <div class="flex justify-between text-base text-h1 font-medium	 text-brownText mb-[1%]">
                <p>Total Items:</p>
                <p class="font-bold">{{ totalItems }}</p>
            </div>
            <div class="flex justify-between text-base text-h1 font-medium text-brownText">
                <p>Total Price:</p>
                <p class="font-bold">{{ totalPrice }} kr</p>
            </div>
        </div>

        <h2 class="text-h1 mt-[2%]">Payment:</h2>
        <!-- Payment -->
        <p class="font-montserrat">
            You can pay with credit card. You should receive an email with the confirmation of your order.
            And in it you will find the details of the payment. Delivery time is 3-5 working days.
        </p>
        <!-- Order -->
        <div class="flex justify-center mt-[3%]">
            <button
                class="border-solid border-2 border-brownText font-lato rounded-full bg-[rgba(255,255,255,0.5)] text-[1.6rem] py-2 px-[10%] text-brownText hover:bg-gray-100"
                @click="placeOrder">
                Order
            </button>
        </div>
        
      </div>    
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import {  auth, db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore functions
import { useCart } from '../modules/cart.js';
import router from '../router';
const { cart, showCart, totalItems,  totalPrice, removeFromCart, fetchCart } = useCart();

// Create a shippingAddress ref
const shippingAddress = ref({
  street: '',
  town: '',
  zip: '',
  country: '',
});
// Create a placeOrder function
const placeOrder = async () => {
  if (auth.currentUser) {
    const username = auth.currentUser.email;

    // Filter out items in the cart that have a quantity of 0 or less
    const validCartItems = cart.value.filter(item => item.quantity > 0);
    if (shippingAddress.value.street === '' || shippingAddress.value.town === '' || shippingAddress.value.zip === '' || shippingAddress.value.country === '') {
      alert('Please fill in your shipping address.');
      return; // Exit the function
    }
    if (validCartItems.length === 0) {
      alert('Your cart is empty. Please add items to your cart before placing an order.');
      return; // Exit the function
    }

    for (const item of validCartItems) {
      await removeFromCart(item.name, item.size, item.color, item.quantity);
    }

    const orderData = {
      username,
      shipping: shippingAddress.value,
      products: validCartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
      })),
    };

    // Assuming you have an 'orders' collection in Firestore
    const ordersRef = collection(db, 'orders');
    await addDoc(ordersRef, orderData);

    alert('Your order has been placed.');
    router.push({ name: 'home' });
  } else {
    alert('Please log in to place an order.');
    // You can also redirect the user to the login page or show a login modal.
  }
};

// Function to handle changes in the user's authentication state
const handleAuthStateChanged = (user) => {
  if (user) {
    fetchCart();
  }
}
// Watch for changes in showCart and fetch the cart when it becomes true
watch(showCart, (newVal) => {
  if (newVal) {
    fetchCart();
  }
});

// Listen for changes in the user's authentication state
auth.onAuthStateChanged(handleAuthStateChanged);

</script>
