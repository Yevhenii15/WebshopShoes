import { ref } from 'vue';
// For the orders module, we need to import the following functions from Firebase:
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../firebase';

// Define the useOrders function
const useOrders = () => {
    // Define a reactive variable for the orders
    const orders = ref([]);

    // Function to fetch the orders from Firestore
    const fetchOrders = async () => {
    try {
        // Assuming you have an 'orders' collection in Firestore
        const ordersCollection = collection(db, 'orders');
        const snapshot = await getDocs(ordersCollection);
        orders.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
    };

    // Function to remove an order from Firestore
    const removeOrder = async (orderId) => {
    try {
        // 'orders' collection in Firestore
        const ordersCollection = collection(db, 'orders');
        const orderDoc = doc(ordersCollection, orderId);
        // Delete the order document from Firestore
        await deleteDoc(orderDoc);
        // Remove the order from the local orders array
        orders.value = orders.value.filter(order => order.id !== orderId);
    } catch (error) {
        console.error('Error removing order:', error);
    }
    };
    return{
        orders,
        fetchOrders,
        removeOrder
    }
}
export default useOrders;