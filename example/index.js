import Vue from 'vue';
import App from './App';

require('./mock');

// 全局引入
// import 'mone-query/style.css';
// import MoneQuery from 'mone-query';
import MoneQuery from '@';
Vue.use(MoneQuery, {
  baseUrl: '/api'
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: function(h) {
    return h(App);
  }
});
