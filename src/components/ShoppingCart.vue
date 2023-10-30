<template>
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
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10" ref="cartElement">
            <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
              <DialogPanel ref="cartPanel" class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                  <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="text-lg font-medium text-gray-900">Shopping Cart</DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <!-- Close button in ShoppingCart.vue -->
                        <button type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500" @click="$emit('close')">
                          <span class="absolute -inset-0.5" />
                          <span class="sr-only">Close panel</span>Close
                        </button>
                      </div>
                    </div>

                    <div class="mt-8">
                      <div class="flow-root">
                        <ul role="list" class="-my-6 divide-y divide-gray-200">
                          <li v-for="item in cart" :key="item.id" class="flex py-6">
                            <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img :src="item.image" :alt="item.name" class="h-full w-full object-cover object-center" />
                            </div>

                            <div class="ml-4 flex flex-1 flex-col">
                              <div>
                                <div class="flex justify-between text-base font-medium text-gray-900">
                                  <h3>
                                    {{ item.name }}
                                  </h3>
                                  <p class="ml-4">{{ item.price * item.quantity }} kr</p>
                                </div>
                                <p class="mt-1 text-sm text-gray-500">Size: {{ item.size }}</p>
                                <p class="mt-1 text-sm text-gray-500">Color: {{ item.color }}</p>
                                <p class="mt-1 text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                              </div>
                              <div class="flex flex-1 items-end justify-between text-sm">
                                <p class="text-gray-500">Qty {{ item.quantity }}</p>

                                <div class="flex">
                                  <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" @click="removeFromCart(item.id)">Remove</button>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <p>Total Items</p>
                      <p>{{ totalItems }}</p>
                    </div>
                    <div class="flex justify-between text-base font-medium text-gray-900">
                      <p>Total Price</p>
                      <p>{{ totalPrice }} kr</p>
                    </div>
                    <div class="mt-6">
                      <a href="#" class="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700">Checkout</a>
                    </div>
                    <div class="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        or
                        <button type="button" class="font-medium text-indigo-600 hover:text-indigo-500" @click="cart = []">
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

<script setup>
import { ref, onMounted } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useCart } from '../modules/cart.js';
const { cart, showCart, handleCloseCart } = useCart();

const totalItems = ref(0);
const totalPrice = ref(0);

const calculateCartSummary = () => {
  totalItems.value = cart.value.reduce((total, item) => total + item.quantity, 0);
  totalPrice.value = cart.value.reduce((total, item) => total + item.quantity * item.price, 0);
}

const fetchCart = async () => {
  const user = auth.currentUser;

  if (!user) {
    console.log('User is not authenticated.');
    return; // Exit the function early if the user is not authenticated.
  }

  const userCartRef = doc(db, 'userCarts', user.uid);
  try {
    const userCartSnapshot = await getDoc(userCartRef);

    if (userCartSnapshot.exists()) {
      const userCartData = userCartSnapshot.data();

      if (userCartData.cart && Array.isArray(userCartData.cart)) {
        cart.value = userCartData.cart;
        calculateCartSummary();
        console.log('Cart data fetched successfully:', cart.value);
      } else {
        console.log('User cart is empty.');
      }
    } else {
      console.log('User cart document does not exist.');
    }
  } catch (error) {
    console.error('Error fetching cart data:', error);
  }
}




const removeFromCart = async (productId) => {
  // Find the item in the local cart and remove it
  const removedIndex = cart.value.findIndex((item) => item.id === productId);
  if (removedIndex !== -1) {
    cart.value.splice(removedIndex, 1);
    calculateCartSummary();
  }

  // Now, update the cart in Firestore
  const user = auth.currentUser;

  if (user) {
    const userCartRef = doc(db, 'userCarts', user.uid);

    // Fetch the current cart data from Firestore
    const userCartSnapshot = await getDoc(userCartRef);
    if (userCartSnapshot.exists()) {
      const userCartData = userCartSnapshot.data();

      if (userCartData.cart && Array.isArray(userCartData.cart)) {
        // Filter out the removed item by its ID
        userCartData.cart = userCartData.cart.filter((item) => item.id !== productId);

        // Update the Firestore document with the modified cart
        await updateDoc(userCartRef, {
          cart: userCartData.cart,
        });
      }
    }
  }
}


onMounted(fetchCart);


</script>