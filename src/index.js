import moneQuery from './components/main';
import Bus from './bus';
import request from './api/request';

// import './style.scss';
import 'element-theme-nio';
import Header from 'element-ui/lib/header';
import Button from 'element-ui/lib/button';
import Row from 'element-ui/lib/row';
import Col from 'element-ui/lib/col';
import Table from 'element-ui/lib/table';
import TableColumn from 'element-ui/lib/table-column';
import Pagination from 'element-ui/lib/pagination';
import Popover from 'element-ui/lib/popover';
import Autocomplete from 'element-ui/lib/autocomplete';
import Select from 'element-ui/lib/select';
import Option from 'element-ui/lib/option';
import DatePicker from 'element-ui/lib/date-picker';
import Loading from 'element-ui/lib/loading';
import Notification from 'element-ui/lib/notification';
import Checkbox from 'element-ui/lib/checkbox';
import CheckboxGroup from 'element-ui/lib/checkbox-group';
// import InputNumber from "element-ui/lib/input-number";
// import TimePicker from "element-ui/lib/time-picker";

/* istanbul ignore next */
moneQuery.install = function(Vue, options = {}) {
  Vue.prototype.$ELEMENT = { size: options.size || 'small' };
  Vue.use(Header);
  Vue.use(Button);
  Vue.use(Row);
  Vue.use(Col);
  Vue.use(Table);
  Vue.use(TableColumn);
  Vue.use(Pagination);
  Vue.use(Popover);
  Vue.use(Autocomplete);
  Vue.use(Select);
  Vue.use(Option);
  Vue.use(DatePicker);
  Vue.use(Loading.directive);
  Vue.use(Checkbox);
  Vue.use(CheckboxGroup);
  // Vue.use(InputNumber);
  // Vue.use(TimePicker);
  Vue.prototype.$notify = Notification;

  options.baseUrl = options.baseUrl || '';
  Vue.prototype.$MONE_QUERY = options;

  Vue.component(moneQuery.name, moneQuery);
  Vue.prototype.$request = request;
  Vue.prototype.$bus = new Vue(Bus);
};

if (typeof window !== 'undefined' && window.Vue) {
  moneQuery.install(window.Vue);
}

export default moneQuery;
