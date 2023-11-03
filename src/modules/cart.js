// cart.js
import { ref, } from 'vue';
import { login } from './login'; // Import the login function from the appropriate location
import { getDoc, updateDoc, getFirestore, runTransaction } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { doc, onSnapshot} from 'firebase/firestore';
export function useCart() {
  const { isLoggedIn } = login(); // Use isLoggedIn from the login module
  const showCart = ref(false);
  const cart = ref([]);

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
  const totalItems = ref(0);
  const totalPrice = ref(0);
  
  const calculateCartSummary = () => {
    totalItems.value = cart.value.reduce((total, item) => total + item.quantity, 0);
    totalPrice.value = cart.value.reduce((total, item) => total + item.quantity * item.price, 0);
  }
  const updateQuantityInFirestore = async (productName, size, color, newQuantity) => {
    // Find the item in the local cart
    console.log('Updating quantity:', productName, size, color, newQuantity);
    const updatedItemIndex = cart.value.findIndex((item) =>
      item.name === productName &&
      item.size === size &&
      item.color === color
    );
  
    if (updatedItemIndex !== -1) {
      // Update the local cart
      cart.value[updatedItemIndex].quantity = newQuantity;
      calculateCartSummary();
  
      // Update the Firestore cart
      const user = auth.currentUser;
  
      if (user) {
        const userCartRef = doc(db, 'userCarts', user.uid);
  
        // Fetch the current cart data from Firestore
        const userCartSnapshot = await getDoc(userCartRef);
        if (userCartSnapshot.exists()) {
          const userCartData = userCartSnapshot.data();
  
          if (userCartData.cart && Array.isArray(userCartData.cart)) {
            // Find the item in the Firestore cart and update its quantity
            const itemToUpdate = userCartData.cart.find((item) =>
              item.name === productName &&
              item.size === size &&
              item.color === color
            );
  
            if (itemToUpdate) {
              itemToUpdate.quantity = newQuantity;
            }
  
            // Update the Firestore document with the modified cart
            await updateDoc(userCartRef, {
              cart: userCartData.cart,
            });
          }
        }
      }
    }
  }
  const removeFromCart = async (productName, size, color, quantity) => {
    const db = getFirestore();
  
    // Find the item in the local cart and remove it
    const removedIndex = cart.value.findIndex((item) =>
      item.name === productName &&
      item.size === size &&
      item.color === color &&
      item.quantity === quantity
    );
  
    if (removedIndex !== -1) {
      cart.value.splice(removedIndex, 1);
      calculateCartSummary();
    }
  
    // Now, update the cart in Firestore within a transaction
    const user = auth.currentUser;
  
    if (user) {
      const userCartRef = doc(db, 'userCarts', user.uid);
  
      try {
        await runTransaction(db, async (transaction) => {
          const userCartSnapshot = await transaction.get(userCartRef);
  
          if (userCartSnapshot.exists()) {
            const userCartData = userCartSnapshot.data();
  
            if (userCartData.cart && Array.isArray(userCartData.cart)) {
              // Filter out the removed item by its name, size, color, and quantity
              userCartData.cart = userCartData.cart.filter((item) =>
                item.name !== productName ||
                item.size !== size ||
                item.color !== color ||
                item.quantity !== quantity
              );
  
              // Update the Firestore document with the modified cart
              transaction.update(userCartRef, { cart: userCartData.cart });
            }
          }
        });
      } catch (error) {
        console.error('Error removing item from cart in Firestore:', error);
      }
    }
  };
  const fetchCart = async () => {
    const user = auth.currentUser;
  
    if (!user) {
      console.log('User is not authenticated.');
      return;
    }
  
    const userCartRef = doc(db, 'userCarts', user.uid);
  
    try {
      // Use onSnapshot to listen for changes in the cart data
      const unsubscribe = onSnapshot(userCartRef, (doc) => {
        if (doc.exists()) {
          const userCartData = doc.data();
          if (userCartData.cart && Array.isArray(userCartData.cart)) {
            cart.value = userCartData.cart;
            calculateCartSummary();
            console.log('Cart data updated:', cart.value);
          } else {
            console.log('User cart is empty.');
          }
        } else {
          console.log('User cart document does not exist.');
        }
      });
  
      // Store the unsubscribe function to stop listening when needed
      // You can store it in a variable accessible from other parts of your component if necessary.
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }
  return {
    showCart,
    cart,
    toggleCart,
    handleCloseCart,
    totalItems,
    totalPrice,
    calculateCartSummary,
    updateQuantityInFirestore,
    removeFromCart,
    fetchCart
  };
}
