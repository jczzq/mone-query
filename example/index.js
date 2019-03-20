import Vue from 'vue';
import App from './App';

// 全局引入
import me from '@';
Vue.use(me);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
