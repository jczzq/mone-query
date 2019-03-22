/**
 * Col 列
 */
export default class Col {
  constructor(data = {}) {
    this.label = data.label;
    this.prop = data.prop;
    this.width = data.width;
    this.type = data.type;
    this.elType = data.elType;
    this.valueFormat = data.valueFormat;
    this.order = data.order;
    this.action = data.action;
    this.placeholder = data.placeholder;
    this.fixed = data.fixed;
  }
  static TYPES = {
    varchar: "el-autocomplete",
    option: "mone-options",
    date: "el-date-picker",
    datetime: "el-date-picker"
    // bit: "el-checkbox",
    // int: "el-input-number",
    // time: "el-time-picker",
  };
  hasType() {
    return Col.TYPES.hasOwnProperty(this.type);
  }
}
