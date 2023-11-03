<template>
    <div class="admin bg-bg bg-auto bg-top px-[8%] py-[5rem]">
      <div class="relative z-[51]">
      <!-- Title for section -->
      <h1 class="text-[2rem] text-brownText font-lato uppercase text-center mb-5">Add new product</h1>
      <!-- Form for adding new product -->
      <div class="flex flex-wrap justify-between px-[15%]">
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productName" type="text" placeholder="Product Name">
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productPrice" type="text" placeholder="Product Price">
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productInStock" type="text" placeholder="Product In Stock">
        <div class="flex flex-col">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6  placeholder:text-brownText" v-model="addProductData.productSize" type="text" placeholder="Product Size">
            <!-- To add size you need to click button, to add several sizes you can type it separate with comma. -->
            <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText w-[60%] rounded-full bg-transparent py-1 px-6 my-3" @click="addItemToArray(addProductData.productSize)">Add Size</button>
        </div>
        <div class="flex flex-col">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 placeholder:text-brownText" v-model="addProductData.productColor" type="text" placeholder="Product Color">
            <!-- To add color you need to click button, to add several colors you can type it separate with comma. -->

            <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText w-[60%] rounded-full bg-transparent py-1 px-6 my-3" @click="addItemToArray(addProductData.productColor)">Add Color</button>
        </div>
        <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-5 placeholder:text-brownText" v-model="addProductData.productDescription" type="text" placeholder="Product Description">
        <input type="file" @change="handleImageUpload($event, null)" multiple data-product="null" class="text-brownText font-lato rounded-full bg-transparent 
          file:py-2 file:px-4
          file:rounded-full file:border-2 file:border-brownText
          file:bg-transparent file:text-brownText 
          file:w-[43%] file:mr-3
          hover:file:bg-beige"
>
        <button class="btn-add hover:bg-beige bg-[rgba(255,255,255,0.5)]border-solid border-2 border-brownText font-lato text-brownText w-[20%] rounded-full bg-[rgba(255,255,255,0.75)] py-1 px-6" @click="firebaseAddSingleItem">Add Item</button>
      </div>
      <!-- Displaying and editing products -->
      <div class="products flex flex-wrap w-[100%] justify-between">
        <!-- Looping through all products -->
        <div class="w-[32%] my-10 p-5 rounded-[1.25rem] bg-[rgba(255,255,255,0.75)] z-20" v-for="product in products" :key="product.id">
            <div v-for="(image, index) in product.productImages" :key="index">
                <img class="w-[100%] h-[370px] object-cover object-center" :src="image" alt="Product Image" />
                <!-- To delete img you need to click delete button and after edit update -->
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
                <!-- To delete size you need to click delete button and after edit update -->
                <button class="hover:bg-beige border-solid border-2 border-brownText text-p font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-1" @click="deleteItemFromArray(product, index, 'size');">Delete</button>
            </div>
            <div class="flex justify-between items-center" v-for="(color, index) in product.productColor" :key="index">
                <p class="text-h1 text-brownText  font-lato">
                    Color: <span class="font-montserrat">{{ color }}</span>
                </p>
                <!-- To delete color you need to click delete button and after edit update -->
                <button class="hover:bg-beige border-solid border-2 border-brownText text-p font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-1" @click="deleteColor(product, index)">Delete</button>
            </div>
            <p class="text-h1 text-brownText  font-lato">
                Description: <span class="font-montserrat">{{ product.productDescription }}</span>
            </p>
            
            <!-- Delete item -->
            <button class="btn-delete hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText  rounded-full bg-transparent py-1 px-6 my-3" @click="firebaseDeleteSingleItem(product.id)">Delete item</button>
            <!-- Update item -->
            <p>
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productName" type="text" placeholder="New Product Name">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productPrice" type="text" placeholder="New Product Price">
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productInStock" type="text" placeholder="New Product In Stock">
            <div class="flex justify-between">
                <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText" v-model="product.newSize" type="text" placeholder="New Product Size">
                <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mb-2" @click="addItemToArray(product.productSize, product.newSize)">Add Size</button>
            </div>
            <div class="flex justify-between">
                <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText" v-model="product.newColor" type="text" placeholder="New Product Color">
                <button class="hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mb-2" @click="addItemToArray(product.productColor, product.newColor)">Add Color</button>
            </div>
            <input class="border-solid border-2 border-brownText rounded-full bg-[rgba(255,255,255,0.5)] w-auto py-1 px-6 mb-2 placeholder:text-brownText"  v-model="product.productDescription" type="text" placeholder="New Product Description">
            <!-- After you upload img you should click edit update -->
            <input type="file" @change="handleImageUpload($event, product)" multiple :data-product="product.id" class="text-brownText font-lato rounded-full bg-transparent 
              file:py-2 file:px-4
              file:rounded-full file:border-2 file:border-brownText
              file:bg-transparent file:text-brownText 
              file:w-[43%] file:mr-3
              hover:file:bg-beige"
>
            </p>
            <!-- Edit and update, you should it for all changes! -->
            <button class="btn-edit hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mt-5" @click="product.isEditing = true">Edit Item</button>
            <button class="btn-update hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 mt-5" @click="firebaseUpdateSingleItem(product)" v-if="product.isEditing">Update</button>

            <hr>
        </div>
      </div>
      <!-- Second section orders -->
      <h2 class="text-[2rem] text-brownText font-lato uppercase text-center my-5">Orders</h2>
      <div class="orders text-brownText font-lato">

            <!-- Displaying orders --> 
            <ul>
              <!-- Shipping address and useremail -->
              <li  class="bg-[rgba(255,255,255,0.75)] my-[2%] p-[3%] rounded-[1.25rem]" v-for="order in orders" :key="order.id">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="mt-3 text-sm text-brownText">User email: <span class="font-montserrat">{{ order.username }}</span></p>
                    <p class="mt-2 text-sm text-brownText">Shipping Address: <span class="font-montserrat">{{ order.shipping.street }}, {{ order.shipping.town }} {{ order.shipping.zip }}, {{ order.shipping.country }}.</span></p>
                    <h4 class="mt-2 text-sm text-brownText">Ordered Products:</h4>
                  </div>
                  <button class="btn-delete hover:bg-beige border-solid border-2 border-brownText font-lato text-brownText rounded-full bg-transparent py-1 px-6 my-3" @click="removeOrder(order.id)">Remove Order</button>
                </div>
                  

                  <ul class=" divide-y divide-brownText mb-[1%]">
                    <!-- Products -->
                    <li v-for="product in order.products" :key="product.id" class="flex py-3">
                      <div class="ml-4 flex w-[100%] justify-between">
                          <div class="flex flex-col justify-between text-base font-p text-brownText">
                              <h3 class="font-bold">
                                  {{ product.name }}
                              </h3>
                          <p class="mt-1 text-sm text-brownText">Size: <span class="font-montserrat">{{ product.size }}</span></p>
                          <p class="mt-1 text-sm text-brownText">Color: <span class="font-montserrat">{{ product.color }}</span></p>
                          <p class="mt-1 text-sm text-brownText">Quantity: <span class="font-montserrat">{{ product.quantity }}</span></p>
                          </div>
                          <div class="flex justify-between flex-col">
                          <p class="ml-4 flex justify-end font-bold text-base font-p text-brownText">{{ product.price * product.quantity }} kr</p>
                          </div>
                      </div>
                    </li>
                  </ul>

              </li>
            </ul>
        </div>
      </div>
    </div>   
  </template>
  
<script setup>
  import { onMounted } from 'vue';
  import useProducts from '../modules/useProducts';
  import useOrders from '../modules/orders.js';
  const { products, getProductsData, firebaseDeleteSingleItem, firebaseAddSingleItem, addProductData, firebaseUpdateSingleItem, deleteImage, handleImageUpload, addItemToArray, deleteItemFromArray} = useProducts();
  const { orders, fetchOrders, removeOrder } = useOrders();
 

  onMounted(async () => {
    await fetchOrders();
  });
  
  onMounted(getProductsData);
</script>
