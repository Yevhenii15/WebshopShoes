<template>
      <body class="bg-bg bg-aut bg-top h-[654px] flex justify-center py-[15%] font-montresant text-h1 text-brownText" >
        <div class="w-[15%] flex flex-wrap justify-center">
        <h1 class="text-[2rem] text-brownText font-lato uppercase text-center">Login page</h1>
        <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText my-3" placeholder="Username" type="text" v-model="email"/>
        <input class="border-solid border-2 border-brownText rounded-full bg-transparent w-[100%] py-1 px-6 placeholder:text-brownText" placeholder="Password" type="password" v-model="password"/>
        <p v-if="errMSG">{{ errMSG }}</p>
        <button class="border-solid border-2 border-brownText font-lato w-auto rounded-full bg-transparent py-1 px-6 my-3" @click="logIn">Login</button>
    </div>
      </body>
</template>

<script setup>
import { ref } from 'vue'
import { auth } from '../firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth';
import router from '../router'

let email = ref('')
let password = ref('')

const errMSG = ref('')

let logIn = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((data) => {
        console.log("test date", data)
        router.push('/admin')
    })
    .catch((error) => {
        switch(error.code){
            case 'auth/invalid-email':
                errMSG.value = 'Invalid email'
                break;
            case 'auth/user-disabled':
                errMSG.value = 'User disabled'
                break;
            case 'auth/user-not-found':
                errMSG.value = 'User not found'
                break;
            case 'auth/wrong-password':
                errMSG.value = 'Wrong password'
                break;
            default:
                errMSG.value = 'Unknown error'
        }
    })
}

</script>

<style lang="scss" scoped>

</style>