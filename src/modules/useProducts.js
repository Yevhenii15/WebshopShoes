import { db } from '../firebase.js';
import { ref } from 'vue';
import { collection, onSnapshot, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { uploadBytes, getDownloadURL, getStorage, ref as storageRef , deleteObject} from 'firebase/storage';


const uploadedImageUrl = ref('');

const useProducts = () => {
  const uploadImage = async (event) => {
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
      if (!Array.isArray(addProductData.value.productImages)) {
        addProductData.value.productImages = [];
      }

      // Append the array of image URLs to the existing productImages array
      addProductData.value.productImages.push(...imageUrls);
    } catch (error) {
      console.error('Error uploading the images:', error);
    }
  };
  const deleteImage = async (product, index) => {
    if (index >= 0 && product.productImages && product.productImages.length > index) {
      // Get the URL of the image to be deleted
      const imageUrl = product.productImages[index];
  
      try {
        // Delete the image from Firestore
        product.productImages.splice(index, 1);
  
        // Get the reference to the storage file based on the URL
        const storage = getStorage();
        const imageRef = storageRef(storage, imageUrl);
  
        // Delete the image from storage
        await deleteObject(imageRef);
  
        console.log('Image deleted from Firestore and Storage');
      } catch (error) {
        console.error('Error deleting the image:', error);
      }
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
    try {
      const product = products.value.find((item) => item.id === id);
      if (!product) {
        console.error('Product not found.');
        return;
      }

      // Delete the product images from Firebase Storage
      const storage = getStorage();
      for (const imageUrl of product.productImages) {
        const imageRef = storageRef(storage, imageUrl);
        await deleteObject(imageRef);
      }

      // Delete the product document from Firestore
      await deleteDoc(doc(db, 'products', id));
      console.log('Product and images deleted:', id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
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
      productImages: product.productImages, // Use the array of image URLs
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
    deleteImage
  };
};

export default useProducts;