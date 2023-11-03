// Import necessary modules and dependencies
import { ref, onMounted } from 'vue';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; // Import functions for logging in and out
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js'; // Import both auth and db
import { createUserWithEmailAndPassword } from 'firebase/auth';
import router from '../router'; // Import the router for redirection

// Define the login function
export function login() {

  // Define reactive variables
  const isLoggedIn = ref(false); // Indicates if the user is logged in
  const isAdmin = ref(false); // Indicates if the user has admin privileges
  // Define reactive variables for user input
  const email = ref(''); 
  const password = ref('');
  const errMSG = ref('');
  // Define reactive variables for user claims
  const adminClaimed = ref(null); 

  // Function to sign up the user
  let signUp = async () => {
    try {
      // Create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
      const user = userCredential.user;
      // Success
      // Create a user's cart collection in Firestore
      const userCartsCollection = collection(db, 'userCarts');
      const userCartDoc = doc(userCartsCollection, user.uid);
      await setDoc(userCartDoc, { cart: [] }); // Initialize the cart with an empty array
  
      router.push({ path: '/' }); // Redirect to the login page after signing up
    } catch (error) {
      console.error('Sign-up error:', error.message);
      errMSG.value = error.message;
    }
  };

  // Function to log in the user
  const logIn = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .then(() => {
        // Check if the user has admin claims
        onAuthStateChanged(auth, (user) => {
          if (user) {
            // User is logged in, check if the user has admin claims
            user.getIdTokenResult()
              .then((idTokenResult) => {
                // Get the custom claims from the ID token
                const claims = idTokenResult.claims;
                
                if (claims) {
                  // Check if the user has admin claims which I set in server.js
                  adminClaimed.value = claims.admin;
                  if (adminClaimed.value) {
                    // User is an admin, redirect to the admin page
                    router.push({ name: 'admin' });
                  } else {
                    // User is not an admin, redirect to the previous route
                    // Check if the previous route exists and sent to that, if not sent user to homepage and also if they came from the signup page, sent them to the homepage
                    if (router.previousRoute && router.previousRoute.name !== 'signup') {
                      // Redirect to the previous route
                      router.push(router.previousRoute.fullPath);
                    } else {
                      // If no previous route or from signup page, go to the default route
                      router.push({ name: 'home' });
                    }
                  }
                } else {
                  // User does not have admin claims.');
                }
              })
              .catch((error) => {
                console.error('Error getting ID token:', error);
              });
          }
        });
      })
      .catch((error) => {
        console.error('Authentication error:', error);
      });
  };

  // Function to log out the user
  const logOut = async () => {
    try {
      if (auth.currentUser) {
        // Attempt to sign out the user
        await signOut(auth);
        router.push('/login');
      } else {
        console.error('No user is authenticated. Unable to log out.');
      }
    } catch (error) {
      console.error('Firestore operation error:', error);
      // Handle the error or log additional information as needed
    }
  };

  // The checkAdminStatus function is used to determine whether a user has admin privileges
  // based on their claims and update the corresponding reactive variables (isLoggedIn and isAdmin).
  const checkAdminStatus = (user) => {
    if (user) {
      // User is logged in, set isLoggedIn to true
      isLoggedIn.value = true;

      // Check if the user has admin claims
      user.getIdTokenResult()
        .then((idTokenResult) => {
          // Get the custom claims from the ID token
          const claims = idTokenResult.claims;
          if (claims && claims.admin) {
            // User is an admin, set isAdmin to true
            isAdmin.value = true;
          } else {
            // User is not an admin, set isAdmin to false
            isAdmin.value = false;
          }
        })
        .catch((error) => {
          console.error('Error getting ID token:', error);
        });
    } else {
      // User is logged out, set isLoggedIn and isAdmin to false
      isLoggedIn.value = false;
      isAdmin.value = false;
    }
  };

  // onMounted hook to check user authentication state and admin status
  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      checkAdminStatus(user);
    });
  });

  // Return the reactive variables and functions for use in the Vue component
  return {
    isLoggedIn,
    isAdmin,
    logOut,
    logIn,
    email,
    password,
    errMSG,
    signUp
  };
}
