import Vue from 'vue';
import App from './App';

// 全局引入
import "mone-query/lib/style.css";
import MoneQuery from 'mone-query';
Vue.use(MoneQuery);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
