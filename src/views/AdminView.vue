<template>
    <div class="admin bg-bg bg-auto bg-top px-[8%] py-[5rem]">
      <h1 class="text-[2rem] text-brownText font-lato uppercase text-center mb-5">Add new product</h1>

      <div class="flex flex-wrap justify-between px-[15%]">
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productName" type="text" placeholder="Product Name">
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productPrice" type="text" placeholder="Product Price">
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productInStock" type="text" placeholder="Product In Stock">
        <div class="flex flex-col">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6  placeholder:text-brownText" v-model="addProductData.productSize" type="text" placeholder="Product Size">
            <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText w-[60%] rounded-full bg-transparent py-1 px-6 my-3" @click="addSize">Add Size</button>
        </div>
        <div class="flex flex-col">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 placeholder:text-brownText" v-model="addProductData.productColor" type="text" placeholder="Product Color">
            <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText w-[60%] rounded-full bg-transparent py-1 px-6 my-3" @click="addColor">Add Color</button>
        </div>
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productDescription" type="text" placeholder="Product Description">
        <input type="file" @change="uploadImage" multiple class=" text-brownText font-lato rounded-full bg-transparent 
      file:py-2 file:px-4
      file:rounded-full file:border-2 file:border-brownText
      file:bg-transparent file:text-brownText 
      file:w-[43%] file:mr-3
      hover:file:bg-beige
    ">
        <button class="btn-add hover:bg-beige bg-[rgba(255,255,255,0.5)]border-solid border-2 border-brownText font-lato text-brownText w-[20%] rounded-full bg-[rgba(255,255,255,0.75)] py-1 px-6" @click="firebaseAddSingleItem">Add Item</button>
      </div>

      <div class="products flex justify-between">
        <div class="w-[32%] my-10 p-5 bg-[rgba(255,255,255,0.75)] z-20" v-for="product in products" :key="product.id">
            <div v-for="(image, index) in product.productImages" :key="index">
                <img class="w-[100%] h-[370px] object-cover object-center" :src="image" alt="Product Image" />
                <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-3" @click="deleteImage(product, index)">Delete Image</button>
            </div>
            <p class="text-h1 text-brownText  font-lato my-1">
                Title: <span class="font-montserrat">{{ product.productName }}</span>
            </p>
            <p class="text-h1 text-brownText  font-lato my-1">
                Price: <span class="font-montserrat">{{ product.productPrice }}</span>
            </p>
            <p class="text-h1 text-brownText  font-lato my-1">
                In Stock: <span class="font-montserrat">{{ product.productInStock }}</span>
            </p>
            <div class="flex justify-between items-center " v-for="(size, index) in product.productSize" :key="index">
                <p class="text-h1 text-brownText  font-lato">
                    Size: <span class="font-montserrat"> {{ size }}</span>
                </p>
                <button class="hover:bg-beige border-solid border-2 border-brownText text-p font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-1" @click="deleteSize(product, index)">Delete</button>
            </div>
            <div class="flex justify-between items-center" v-for="(color, index) in product.productColor" :key="index">
                <p class="text-h1 text-brownText  font-lato">
                    Color: <span class="font-montserrat">{{ color }}</span>
                </p>
                <button class="hover:bg-beige border-solid border-2 border-brownText text-p font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-1" @click="deleteColor(product, index)">Delete</button>
            </div>
            <p class="text-h1 text-brownText  font-lato">
                Description: <span class="font-montserrat">{{ product.productDescription }}</span>
            </p>
            
    
            <button class="btn-delete hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-3" @click="firebaseDeleteSingleItem(product.id)">Delete item</button>

            <p>
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productName" type="text" placeholder="New Product Name">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productPrice" type="text" placeholder="New Product Price">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productInStock" type="text" placeholder="New Product In Stock">
            <div class="flex justify-between">
                <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.newSize" type="text" placeholder="New Product Size">
                <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mb-2" @click="addProductSize(product)">Add Size</button>
            </div>
            <div class="flex justify-between">
                <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText" v-model="product.newColor" type="text" placeholder="New Product Color">
            <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mb-2" @click="addProductColor(product)">Add Color</button>
            </div>
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productDescription" type="text" placeholder="New Product Description">
            <input type="file" @change="addImagesToProduct(product, $event)" multiple class=" text-brownText font-lato rounded-full bg-transparent 
      file:py-2 file:px-4
      file:rounded-full file:border-2 file:border-brownText
      file:bg-transparent file:text-brownText 
      file:w-[43%] file:mr-3
      hover:file:bg-beige
    ">

            </p>
            
            <button class="btn-edit hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mt-5" @click="product.isEditing = true">Edit Item</button>
            <button class="btn-update hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mt-5" @click="firebaseUpdateSingleItem(product)" v-if="product.isEditing">Update</button>

            <hr>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import useProducts from '../modules/useProducts';

  
  const { products, getProductsData, firebaseDeleteSingleItem, firebaseAddSingleItem, addProductData, firebaseUpdateSingleItem, uploadImage, uploadedImageUrl, deleteImage, addImagesToProduct} = useProducts();
  
  
  
  const addSize = () => {
    if (typeof addProductData.productSize !== 'string' || !addProductData.productSize) {
      addProductData.productSize = '';
    }
    addProductData.productSize = addProductData.productSize.split(',').map(size => size.trim());
  };
  
  const addProductSize = (product) => {
    if (!product.newSize) return;
    if (!product.productSize) {
      product.productSize = [];
    }
    product.productSize.push(product.newSize);
    product.newSize = '';
  };
  
  const deleteSize = (product, index) => {
    if (index >= 0) {
      product.productSize.splice(index, 1);
    }
  };
  
  const addColor = () => {
    if (typeof addProductData.productColor !== 'string' || !addProductData.productColor) {
      addProductData.productColor = '';
    }
    addProductData.productColor = addProductData.productColor.split(',').map(color => color.trim());
  };
  
  const addProductColor = (product) => {
    if (!product.newColor) return;
    if (!product.productColor) {
      product.productColor = [];
    }
    product.productColor.push(product.newColor);
    product.newColor = '';
  };
  
  const deleteColor = (product, index) => {
    if (index >= 0) {
      product.productColor.splice(index, 1);
    }
  };
  
  const productInputData = ref({});
  
  onMounted(getProductsData);
  </script>
