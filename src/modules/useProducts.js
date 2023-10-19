import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';

const useProducts = () => {
  const products = ref([]); // to store data from Firebase
  const productDataRef = collection(db, 'products');

  const addProductData = ref({
    productName: '',
    productPrice: '',
    productInStock: '',
    productSize: [],
  });
  
  const getProductsData = () => {
    onSnapshot(productDataRef, (snapshot) => {
      products.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          isEditing: false, // Add an isEditing property to track editing state
        };
      });
    });
  };

  const firebaseDeleteSingleItem = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    console.log('Item deleted!', id);
  };

  const firebaseAddSingleItem = async () => {
    await addDoc(collection(db, 'products'), {
      productName: addProductData.value.productName,
      productPrice: addProductData.value.productPrice,
      productInStock: addProductData.value.productInStock,
      productSize: addProductData.value.productSize.split(',').map(size => size.trim()), // Split the sizes input into an array
    }).then(() => {
      addProductData.value.productName = '';
      addProductData.value.productPrice = '';
      addProductData.value.productInStock = '';
      addProductData.value.productSize = '';
    });
    console.log('Item added!');
  };

  const firebaseUpdateSingleItem = async (product) => {
    await updateDoc(doc(productDataRef, product.id), {
      productName: product.productName,
      productPrice: product.productPrice,
      productInStock: product.productInStock,
      productSize: product.productSize,
    }).then(() => {
      // Toggle editing state to false
      product.isEditing = false;
      console.log('Item updated!');
    });
  };

  return {
    getProductsData,
    products,
    firebaseDeleteSingleItem,
    firebaseAddSingleItem,
    addProductData,
    firebaseUpdateSingleItem,
  };
};

export default useProducts;
