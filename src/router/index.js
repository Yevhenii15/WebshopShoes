import { createRouter, createWebHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';
import HomeView from '../views/HomeView.vue';
import ShoesView from '../views/ShoesView.vue';
import ProductDetail from '../components/ProductDetail.vue';
import CheckoutView from '../views/CheckoutView.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../components/LoginView.vue'; 
import SignUpView from '../components/SignUpView.vue'; 

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/shoes',
      name: 'shoes',
      component: ShoesView,
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetail,
    },
    {
      path: '/cart/:id',
      name: 'cart',
      component: () => import('../components/ShoppingCart.vue'), 
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  try {
    //Get the current user using Firebase Authentication
    const currentUser = getAuth().currentUser; // Get the current user directly

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (currentUser) {
        // Check if the user has admin claims
        const tokenResult = await currentUser.getIdTokenResult();
        if (tokenResult.claims && tokenResult.claims.admin) {
          // User is logged in as an admin now
          next(); // Allow the navigation to proceed
        } else {
          // User is not an admin. Redirecting to the login page.
          next({ name: 'login' }); // Redirect to login
        }
      } else {
        // User is not logged in. 
        next({ name: 'login' }); // Redirecting to the login page.
      }
    } else {
      next(); // Allow the navigation to proceed
    }
  } catch (error) {
    console.error('Error in navigation guard:', error);
    next(); // Handle the error and call next() to proceed if needed
  }
});



export default router;
