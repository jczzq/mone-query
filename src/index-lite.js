import moneQuery from './components/main';
import moneOptions from './components/options';
import Bus from './bus';
import request from './api/request';

/* istanbul ignore next */
moneQuery.install = function(Vue, options = {}) {
  if (moneQuery.installed) return;
  moneQuery.installed = true;
  Vue.prototype.$ELEMENT = { size: options.size || 'small' };
  Vue.prototype.$notify = Notification;

  options.baseUrl = options.baseUrl || '';
  Vue.prototype.$MONE_QUERY = options;

  Vue.component(moneOptions.name, moneOptions);
  Vue.component(moneQuery.name, moneQuery);
  Vue.prototype.$request = request;
  Vue.prototype.$bus = new Vue(Bus);
};

if (typeof window !== 'undefined' && window.Vue) {
  moneQuery.install(window.Vue);
}

export default moneQuery;
