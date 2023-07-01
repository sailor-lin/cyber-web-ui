import { createApp } from 'vue'
import App from './App.vue'
import 'ant-design-vue/dist/antd.less';
import CyberWebUi from '../components/index.js';
import '../components/index.less';

createApp(App).use(CyberWebUi).mount('#app');
