import { createApp } from 'vue'
import App from './App.vue'
import CyberWebUi from '../components/index.js';
import '../components/cyber.jsx';
// import CyberWebUi from 'sailor-ui-test';
// import 'sailor-ui-test/lib/style.css';
console.log("??", CyberWebUi)

createApp(App).use(CyberWebUi).mount('#app');
