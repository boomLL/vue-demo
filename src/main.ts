import { createApp } from 'vue';
import TDesign from 'tdesign-mobile-vue';
import 'tdesign-mobile-vue/es/style/index.css';
import './style.css';
import App from './App.vue';

// 手机端调试：访问地址带 ?debug=1 时启用 vConsole，可在页面内查看 [PDR ...] 日志
if (new URLSearchParams(window.location.search).get('debug') === '1') {
  import('vconsole').then(({ default: VConsole }) => {
    new VConsole();
  });
}

const app = createApp(App);
app.use(TDesign);
app.mount('#app');
