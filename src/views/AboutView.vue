<template>
  <div class="about">
    <h1>This is an about page</h1>

    <button class="btn-add" @click="firebaseAddSingleItem()">Add Item</button>

    <div>
      <input v-model="addProductData.productName" type="text" placeholder="Product Name">
      <input v-model="addProductData.productPrice" type="text" placeholder="Product Price">
      <input v-model="addProductData.productInStock" type="text" placeholder="Product In Stock">
      
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
      <button class="btn-delete" @click="firebaseDeleteSingleItem(product.id)">Delete item</button>
      <p>
        <input v-model="product.productName" type="text" placeholder="New Product Name" >
        <input v-model="product.productPrice" type="text" placeholder="New Product Price">
        <input v-model="product.productInStock" type="text" placeholder="New Product In Stock">

      </p>

      <button class="btn-edit" @click="product.isEditing = true">Edit Item</button>
      <button class="btn-update" @click="firebaseUpdateSingleItem(product)" v-if="product.isEditing">Update</button>
      <hr>
    </div>

  </div>
</template>


<script setup>
import { ref } from 'vue';
import useProducts from '../modules/useProducts';
import { onMounted } from 'vue';

const { products, getProductsData, firebaseDeleteSingleItem, firebaseAddSingleItem, addProductData, firebaseUpdateSingleItem } = useProducts();

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
