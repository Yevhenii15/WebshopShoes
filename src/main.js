
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'
import 'vue-transition'; // Import the 'vue-transition' library itself

const app = createApp(App)

app.use(router)

app.mount('#app')