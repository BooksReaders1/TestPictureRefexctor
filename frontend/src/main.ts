import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import pinia from './stores';

// Import CSS separately to avoid TypeScript errors
import './assets/css/theme.css';

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount('#app');
