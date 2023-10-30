import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue';
import SalesView from '../views/SalesView.vue';
import ShoesView from '../views/ShoesView.vue';
import ProductDetail from '../components/ProductDetail.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../components/LoginView.vue'; // Import LoginView
import SignUpView from '../components/SignUpView.vue'; // Import SignUpView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/sales',
      name: 'sales',
      component: SalesView,
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
      component: () => import('../components/ShoppingCart.vue'), // Import and use ShoppingCart when needed
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
    // Here, you should obtain the current user using Firebase Authentication
    const currentUser = getAuth().currentUser; // Get the current user directly

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (currentUser) {
        // Check if the user has admin claims
        const tokenResult = await currentUser.getIdTokenResult();
        if (tokenResult.claims && tokenResult.claims.admin) {
          console.log('User is logged in as an admin now');
          next(); // You should call next() to allow the navigation to proceed
        } else {
          console.log('User is not an admin. Redirecting to the login page.');
          next({ name: 'login' }); // You should call next with an object to redirect
        }
      } else {
        console.log('User is not logged in. Redirecting to the login page.');
        next({ name: 'login' }); // You should call next with an object to redirect
      }
    } else {
      next(); // You should call next() for routes that do not require authentication
    }
  } catch (error) {
    console.error('Error in navigation guard:', error);
    next(); // Handle the error and call next() to proceed if needed
  }
});



const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export default router;
