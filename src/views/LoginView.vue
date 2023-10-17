<template>
    <div>
        <h1>This is a login page</h1>
        Username: <input type="text" v-model="email"/>
        Password: <input type="password" v-model="password"/>
        <p v-if="errMSG">{{ errMSG }}</p>
        <button @click="logIn">Login</button>
    </div>
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
        router.push('/navguard')
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