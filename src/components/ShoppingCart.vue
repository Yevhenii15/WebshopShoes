<template>
<!-- Show only if its trigered -->
<TransitionRoot as="template" :show="showCart">
      <Dialog as="div" class="relative z-[1000]"  @click="handleCloseCart">
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0 transform translate-y-4"
        enter-to="opacity-100 transform translate-y-0"
        leave="ease-in-out duration-500"
        leave-from="opacity-100 transform translate-y-0"
        leave-to="opacity-0 transform translate-y-4"
      >
        <div class="fixed inset-0 bg-white bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-hidden">
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full xl:pl-10" ref="cartElement">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel ref="cartPanel" class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-bg-cart shadow-xl">
                  <div class="flex-1 overflow-y-auto  px-4 py-6 sm:px-6">
                    <div class="flex items-start justify-between">
                      <h1 class="text-h1 text-brownText font-lato">Shopping Cart</h1>
                      <div class="ml-3 flex h-7 items-center">
                        <!-- Close button -->
                        <button type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500" @click="close">
                          <span class="absolute -inset-0.5" />
                          <span class="sr-only">Close panel</span><img src="../images/icons/xmark.png" class="w-[2.5vh] h-[2.5vh]" alt="">
                        </button>
                      </div>
                    </div>

                    <div class="mt-8">
                      <div class="flow-root">
                        <ul role="list" class="-my-6 divide-y divide-gray-200">
                         <!-- Loop through the cart and display each item -->
                          <li v-for="item in cart" :key="item.id" class="flex py-6">
                            <div class="flex-shrink-0 relative">
                              <img :src="item.image" :alt="item.name" class="w-[15vh] h-[15vh] object-cover object-center" />
                            </div>
                            <div class="ml-4 flex w-[100%] justify-between">
                                <div class="flex flex-col justify-between text-base font-p text-brownText">
                                  <h3 class="font-bold">
                                    {{ item.name }}
                                  </h3>
                                <p class="mt-1 text-sm text-brownText">Size: {{ item.size }}</p>
                                <p class="mt-1 text-sm text-brownText">Color: {{ item.color }}</p>
                                <div><label class="mt-1 text-sm text-brownText">Quantity:</label>
                                <input
                                  type="number"
                                  class="w-16 text-sm border rounded text-center text-brownText"
                                  v-model="item.quantity"
                                  :min="1"
                                  :max="item.inStock" 
                                  @input="updateQuantityInFirestore(item.name, item.size, item.color, item.quantity)"
                                /></div>
                                </div>
                              <div class="flex justify-between flex-col">
                                <p class="ml-4 flex justify-end font-bold text-base font-p text-brownText">{{ item.price * item.quantity }} kr</p>
                                <button type="button" class="border-solid border-2 border-brownText font-lato rounded-full bg-[rgba(255,255,255,0.5)] text-p py-2 px-6 text-brownText hover:bg-gray-100"
                                @click="removeFromCart(item.name, item.size, item.color, item.quantity)">Remove</button>
                              </div>
                           </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <!-- Total items and price -->
                  <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div class="flex justify-between text-base text-h1 font-medium	 text-brownText">
                      <p>Total Items:</p>
                      <p class="font-bold">{{ totalItems }}</p>
                    </div>
                    <div class="flex justify-between text-base text-h1 font-medium text-brownText">
                      <p>Total Price:</p>
                      <p class="font-bold">{{ totalPrice }} kr</p>
                    </div>
                    <div class="mt-8 flex justify-center">
                      <!-- Checkout button -->
                      <button
                        class="border-solid border-2 w-[100%] border-brownText font-lato rounded-full bg-[rgba(255,255,255,0.5)] text-h1 py-2 text-brownText hover:bg-gray-100"
                        @click="checkout">
                        Checkout
                      </button>                    
                    </div>
                    <!-- Continue shopping button -->
                    <div class="mt-4 flex justify-center text-center text-sm text-brownText">
                      <p>
                        or
                        <button type="button" class="font-semibold text-brownText" @click="continueShopping">
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script  setup>
import { watch } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import {  auth } from '../firebase';
import { useCart } from '../modules/cart.js';
import router from '../router';
// Import the defineEmits function
const { cart, showCart, handleCloseCart, totalItems,  totalPrice, updateQuantityInFirestore, removeFromCart, fetchCart } = useCart();
//
const emit = defineEmits();

const close = () => {
  emit('close');
}
const checkout = () => {
  close();
  if (cart.value.length > 0) {
    router.push({ name: 'checkout' });
  }
  else{
    alert ("Your cart is empty!")
  }
}
const continueShopping = () => {
    close();
    router.push({ name: 'shoes' });
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