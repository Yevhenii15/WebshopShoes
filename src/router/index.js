import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import ShoppingCart from '../components/ShoppingCart.vue';

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
        requiresAuth: true, // Add a meta field to indicate that authentication is required
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
  ]
})
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if the user is authenticated
    if (await getCurrentUser()) {
      next();
    } else {
      // If not authenticated, redirect to the login page
      next({ path: '/login' });
    }
  } else {
    next();
  }
});

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      getAuth(),
      user => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
};

export default router;
