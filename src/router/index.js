import { createRouter, createWebHistory } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SalesView from '../views/SalesView.vue'
import ShoesView from '../views/ShoesView.vue'
import ProductDetail from '../components/ProductDetail.vue'
import ShoppingCart from '../components/ShoppingCart.vue';
import AdminView from '../views/AdminView.vue';
import LoginView from '../components/LoginView.vue'; // Import LoginView
import SignUpView from '../components/SignUpView.vue'; // Import SignUpView

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: AboutView
    },
    {
      path: '/sales',
      name: 'sales',
      component: SalesView
    },
    {
      path: '/shoes',
      name: 'shoes',
      component: ShoesView
    },
    {
      path: '/product/:id', // Define a route parameter named 'id'
      name: 'product-detail',
      component: ProductDetail
    },
    {
      path: '/cart/:id',
      name: 'cart',
      component: ShoppingCart,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true, // Indicates that authentication is required
        requiresAdmin: true, // Indicates that admin access is required
      },
    },
    
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
  ]
})

router.beforeEach(async (to, from, next) => {
  const currentUser = await getCurrentUser();

  // Capture the previous route
  if (from) {
    router.previousRoute = from;
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (currentUser) {
      const tokenResult = await currentUser.getIdTokenResult();
      if (tokenResult && tokenResult.claims && tokenResult.claims.admin) {
        console.log('User is logged in as an admin now');
        next();
      } else {
        next();
      }
    } else {
      console.log('User is not logged in. Redirecting to the login page.');
      next({ name: 'login' }); // Redirect to the login page
    }
  } else {
    next();
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
