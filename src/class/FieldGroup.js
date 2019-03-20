/**
 * FieldGroup 字段选择
 */
export default class FieldGroup {
  constructor(data) {
    this.title;
    this.order;
    this.selection = [];
    this.checkAll = true;
    this.isIndeterminate = false;
    this.colProps = [];
    if (data) {
      Object.assign(this, data);
    }
  }
}
