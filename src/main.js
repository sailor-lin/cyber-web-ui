import { createApp } from 'vue'
import App from './App.vue'
import axios from './api';
import CyberWebUi from '../components/index.js';
import './assets/style/main.less';

const app = createApp(App);
app.config.globalProperties.$axios = axios;
app.use(CyberWebUi).mount('#app');
