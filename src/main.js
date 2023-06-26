import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import CyberWebUi from '../components/index.js';
import './assets/style/main.less';
import './permission.js';

const app = createApp(App);
app.use(router).use(CyberWebUi).mount('#app');
