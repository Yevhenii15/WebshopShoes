import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef } from 'firebase/storage';


const uploadedImageUrl = ref('');

const useProducts = () => {
  const uploadImage = async (event, product) => {
    const storage = getStorage();
    const files = event.target.files;
  
    if (!files.length) return;
  
    try {
      const imagePromises = Array.from(files).map(async (file) => {
        const imageRef = storageRef(storage, `products/${Date.now()}_${file.name}`);
        await uploadBytes(imageRef, file);
        return getDownloadURL(imageRef);
      });
  
      const imageUrls = await Promise.all(imagePromises);
  
      // Initialize productImages as an empty array if it's not already
      if (!Array.isArray(product.productImages)) {
        product.productImages = [];
      }
  
      // Append the array of image URLs to the existing productImages array
      product.productImages.push(...imageUrls);
    } catch (error) {
      console.error('Error uploading the images:', error);
    }
  };
  const deleteImage = (product, index) => {
    if (index >= 0 && product.productImages && product.productImages.length > index) {
      product.productImages.splice(index, 1);
    }
  };
  
  const products = ref([]);
  const productDataRef = collection(db, 'products');

  const addProductData = ref({
    productName: '',
    productPrice: '',
    productInStock: '',
    productSize: [],
    productColor: [],
    productDescription: '',
    productImage: [], // Add a field for product image URL
  });

  const getProductsData = () => {
    onSnapshot(productDataRef, (snapshot) => {
      products.value = snapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
          isEditing: false,
        };
      });
    });
  };

  const firebaseDeleteSingleItem = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    console.log('Item deleted!', id);
  };

  const firebaseAddSingleItem = async () => {
    const productSize = typeof addProductData.value.productSize === 'string' ? addProductData.value.productSize.split(',').map(size => size.trim()) : [];
    const productColor = typeof addProductData.value.productColor === 'string' ? addProductData.value.productColor.split(',').map(color => color.trim()) : [];
  
    await addDoc(collection(db, 'products'), {
      productName: addProductData.value.productName,
      productPrice: addProductData.value.productPrice,
      productInStock: addProductData.value.productInStock,
      productSize: productSize,
      productColor: productColor,
      productDescription: addProductData.value.productDescription,
      productImages: addProductData.value.productImages, // Use the array of image URLs
    }).then(() => {
      // Reset other fields and the image URLs
      addProductData.value.productName = '';
      addProductData.value.productPrice = '';
      addProductData.value.productInStock = '';
      addProductData.value.productSize = [];
      addProductData.value.productColor = [];
      addProductData.value.productDescription = '';
      addProductData.value.productImages = []; // Reset the image URLs
    });
    console.log('Item added!');
  };
  
  const firebaseUpdateSingleItem = async (product) => {
    await updateDoc(doc(productDataRef, product.id), {
      productName: product.productName,
      productPrice: product.productPrice,
      productInStock: product.productInStock,
      productSize: product.productSize,
      productColor: product.productColor,
      productDescription: product.productDescription,
      productImages: product.productImages, // Updated images
    }).then(() => {
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
    uploadImage,
    deleteImage,
  };
};

export default useProducts;