import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import ShoppingCart from '../components/ShoppingCart.vue';
import SignUpView from '../views/SignUpView.vue'; // Import SignUpView

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
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/shoes',
      name: 'shoes',
      component: () => import('../views/ShoesView.vue')
    },
    {
      path: '/product/:id', // Define a route parameter named 'id'
      name: 'product-detail',
      component: () => import('../views/ProductDetail.vue')
    },
    { path: '/cart/:id',
      name: 'cart',
      component: ShoppingCart },
    {
      path: '/sales',
      name: 'sales',
      component: () => import('../views/SalesView.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: {
        requiresAuth: true, // Indicates that authentication is required
        requiresAdmin: true, // Indicates that admin access is required
      },
    },
    
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView,
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
