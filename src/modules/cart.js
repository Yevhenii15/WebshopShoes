// cart.js
import { ref } from 'vue';
import { login } from './login'; // Import the login function from the appropriate location

export function useCart() {
  const showCart = ref(false);
  const cart = ref([]);

  const { isLoggedIn } = login(); // Use isLoggedIn from the login module

  const handleCloseCart = () => {
    // Toggle the showCart value to false to trigger the transition
    showCart.value = false;
    console.log('Cart closed', showCart.value);
  };

  const toggleCart = () => {
    if (isLoggedIn.value) {
      showCart.value = !showCart.value;
    } else {
      // User is not authenticated, display a message or take action
      alert('Please log in to add items to your cart.');
      // You can also redirect the user to the login page or show a login modal.
    }
  };

  return {
    showCart,
    cart,
    toggleCart,
    handleCloseCart,
  };
}
