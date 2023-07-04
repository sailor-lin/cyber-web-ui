import { createApp } from 'vue'
import App from './App.vue'
import CyberWebUi from '../components/index.js';
import './assets/style/main.less';

createApp(App).use(CyberWebUi).mount('#app');
