import { ref, onMounted  } from 'vue';
import  router  from '../router/index.js';
import { auth } from '../firebase.js';
import { signOut, onAuthStateChanged } from 'firebase/auth';
export function login() {

const isLoggedIn = ref(false);
const isAdmin = ref(false);


const logOut = () => {
  signOut(auth)
    .then(() => {
      console.log('logged out', auth.currentUser);
      router.push('/login');
    })
    .catch((error) => {
      console.error(error);
    });
};

// Create a separate function to check admin status
const checkAdminStatus = (user) => {
  if (user) {
    isLoggedIn.value = true;
    console.log('logged in', auth.currentUser);

    // Check if the user has admin claims
    user.getIdTokenResult()
      .then((idTokenResult) => {
        const claims = idTokenResult.claims;
        if (claims && claims.admin) {
          // User is an admin, set isAdmin to true
          isAdmin.value = true;
          console.log('User is an admin of course');
        } else {
          // User is not an admin, set isAdmin to false
          isAdmin.value = false;
          console.log('User is not an admin of course');
        }
      })
      .catch((error) => {
        console.error('Error getting ID token:', error);
      });
  } else {
    isLoggedIn.value = false;
    isAdmin.value = false;
    console.log('logged out', auth.currentUser);
  }
};


onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    checkAdminStatus(user);
  });
});
return {
  isLoggedIn,
  isAdmin,
  logOut,
};
}