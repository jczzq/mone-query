import moneQuery from "./components/main";
import Bus from "./bus";
import request from "./api/request";

import Table from "element-ui/lib/table";
import Popover from "element-ui/lib/popover";
import Autocomplete from "element-ui/lib/autocomplete.js";
import DatePicker from "element-ui/lib/date-picker";
import Loading from "element-ui/lib/loading";
import Notification from "element-ui/lib/notification";
// import InputNumber from "element-ui/lib/input-number";
// import Checkbox from "element-ui/lib/checkbox";
// import TimePicker from "element-ui/lib/time-picker";

/* istanbul ignore next */
moneQuery.install = function(Vue, options = {}) {
  Vue.prototype.$MONE_QUERY = {
    baseURL: options.baseURL || "/",
    pageName: options.pageName,
    sizeName: options.sizeName,
    rowsName: options.rowsName,
    totalName: options.totalName,
    instanceName: options.instanceName
  };

  Vue.component(moneQuery.name, moneQuery);
  Vue.prototype.$request = request;
  Vue.prototype.$bus = new Vue(Bus);

  Vue.use(Table);
  Vue.use(Popover);
  Vue.use(Autocomplete);
  Vue.use(DatePicker);
  Vue.use(Loading.directive);
  Vue.prototype.$notify = Notification;
  // Vue.use(InputNumber);
  // Vue.use(Checkbox);
  // Vue.use(TimePicker);
};

if (typeof window !== "undefined" && window.Vue) {
  moneQuery.install(window.Vue);
}

export default moneQuery;
