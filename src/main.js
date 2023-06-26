import { createApp } from 'vue';
import App from './App.vue';
import 'ant-design-vue/dist/antd.less';
import '@/assets/style/main.less';
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont/iconfont.js';
import 'virtual:windi.css';
import directive from './directive/index.js';
import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persist';
import router from '@/router/index.js';
import './permission.js';
// 创建store实例
const store = createPinia();
store.use(piniaPersist);

createApp(App)
.use(directive)
.use(store)
.use(router)
.mount('#app');
