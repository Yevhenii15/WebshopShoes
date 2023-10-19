<template>
  <div class="about">
    <h1>This is an about page</h1>

    <button class="btn-add" @click="firebaseAddSingleItem">Add Item</button>

    <div>
      <input v-model="addProductData.productName" type="text" placeholder="Product Name">
      <input v-model="addProductData.productPrice" type="text" placeholder="Product Price">
      <input v-model="addProductData.productInStock" type="text" placeholder="Product In Stock">
      <input v-model="addProductData.productSize" type="text" placeholder="Product Size">
      <button @click="addSize">Add Size</button>
      <input v-model="addProductData.productColor" type="text" placeholder="Product Color">
      <button @click="addColor">Add Color</button>
      <input v-model="addProductData.productDescription" type="text" placeholder="Product Description">
      <input type="file" @change="uploadImage" multiple>

    </div>

    <div v-for="product in products" :key="product.id">
      <p>
        Title: {{ product.productName }}
      </p>
      <p>
        Price: {{ product.productPrice }}
      </p>
      <p>
        In Stock: {{ product.productInStock }}
      </p>
      <div v-for="(size, index) in product.productSize" :key="index">
        <p>
          Size: {{ size }}
          <button @click="deleteSize(product, index)">Delete</button>
        </p>
      </div>
      <div v-for="(color, index) in product.productColor" :key="index">
        <p>
          Color: {{ color }}
          <button @click="deleteColor(product, index)">Delete</button>
        </p>
      </div>
      <p>
        Description: {{ product.productDescription }}
      </p>
      <div v-for="(image, index) in product.productImages" :key="index">
  <img :src="image" alt="Product Image" />
  <button @click="deleteImage(product, index)">Delete Image</button>
</div>
      <button class="btn-delete" @click="firebaseDeleteSingleItem(product.id)">Delete item</button>
      <p>
        <input v-model="product.productName" type="text" placeholder="New Product Name">
        <input v-model="product.productPrice" type="text" placeholder="New Product Price">
        <input v-model="product.productInStock" type="text" placeholder="New Product In Stock">
        <input v-model="product.newSize" type="text" placeholder="New Product Size">
        <button @click="addProductSize(product)">Add Size</button>
        <input v-model="product.newColor" type="text" placeholder="New Product Color">
        <button @click="addProductColor(product)">Add Color</button>
        <input v-model="product.productDescription" type="text" placeholder="New Product Description">
      </p>
      <button class="btn-edit" @click="product.isEditing = true">Edit Item</button>
      <button class="btn-update" @click="firebaseUpdateSingleItem(product)" v-if="product.isEditing">Update</button>
      <hr>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useProducts from '../modules/useProducts';

const { products, getProductsData, firebaseDeleteSingleItem, firebaseAddSingleItem, addProductData, firebaseUpdateSingleItem, uploadImage, uploadedImageUrl, deleteImage } = useProducts();



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

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>