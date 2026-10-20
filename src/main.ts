import { createApp } from 'vue';
import TDesign from 'tdesign-mobile-vue';
import 'tdesign-mobile-vue/es/style/index.css';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(TDesign);
app.mount('#app');
