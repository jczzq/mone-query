/**
 * Col 列
 */
export default class Col {
  constructor(data) {
    this.label = data.label;
    this.prop = data.prop;
    this.width = data.width;
    this.type = data.type;
    this.order = data.order;
  }
  static TYPES = [
    "varchar",
    "option",
    "date",
    "datetime"
    /* "bit", "int", "time", */
  ];
  hasType() {
    return Col.TYPES.includes(this.type);
  }
}
