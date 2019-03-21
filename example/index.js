import Vue from 'vue';
import App from './App';

// 全局引入
import "./mock";
// import "mone-query/lib/style.css";
import MoneQuery from '@';
Vue.use(MoneQuery, {
  baseUrl: '/api'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
});
