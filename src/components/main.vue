<template>
  <div class="mone-query" v-loading="CONFIGLoading">
    <el-row class="tool-box">
      <el-col :span="24" class="text-right">
        <el-button type="default" @click="resetParam()">重置</el-button>
        <el-button type="primary" :loading="stmt.loading" @click="stmtLoad()"
          >搜索</el-button
        >
        <!-- <el-button
          type="primary"
          :loading="stmt.exporting"
          @click="handleExport()"
          >导出</el-button
        > -->
        <show-field
          v-if="CONFIG && CONFIG.colbox"
          :fields="CONFIG.cols"
          ref="showFieldRef"
          v-model="showProps"
          :placement="CONFIG.colbox.placement"
          :width="CONFIG.colbox.width"
          :trigger="CONFIG.colbox.trigger"
          :config="configShowFields"
        />
      </el-col>
    </el-row>
    <el-table
      v-if="CONFIG"
      :data="stmt.rows"
      :border="border || CONFIG.border"
      :row-key="row => row[primaryKey || CONFIG.primaryKey]"
      :height="CONFIG.height"
      :show-header="CONFIG.showHeader"
      :max-height="CONFIG.maxHeight"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-if="CONFIG.showIndex"
        :index="index => index + 1"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column
        v-if="CONFIG.showSelection && showProps && showProps.length"
        reserve-selection
        type="selection"
        align="center"
      ></el-table-column>
      <el-table-column
        sortable="custom"
        v-for="item in cols"
        :key="item.prop"
        :column-key="item.prop"
        :prop="item.prop"
        :width="item.width"
      >
        <span slot="header" slot-scope="scope">
          <span>
            {{ item.label }}
          </span>
          <el-popover v-if="COMPONENT_NAME_MAP.hasOwnProperty(item.type)">
            <component
              clearable
              class="inline-block"
              size="mini"
              @click.native.stop=""
              @select="handleChoose"
              :fetch-suggestions="
                (queryString, cb) => {
                  querySearchAsync(queryString, cb, item);
                }
              "
              :value-key="item.prop"
              :trigger-on-focus="false"
              :placeholder="item.placeholder"
              :value-format="item.valueFormat"
              :type="item.elType"
              :is="COMPONENT_NAME_MAP[item.type]"
              v-model="stmt.parameters.params[item.prop].value"
            >
            </component>
            <el-button
              slot="reference"
              type="text"
              icon="el-icon-search"
              @click.stop=""
            ></el-button>
          </el-popover>
        </span>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page.sync="stmt.parameters.page[stmt.pageName]"
      :page-size.sync="stmt.parameters.page[stmt.sizeName]"
      layout="total, prev, pager, next, sizes, ->, jumper"
      :total="stmt.total"
      @size-change="stmtLoad()"
      @current-change="stmtLoad()"
    >
    </el-pagination>
  </div>
</template>

<script>
import { ListView, Param, getDeepProp } from "../class/ViewModel";
import FieldGroup from "../class/FieldGroup";
import showField from "./show-field";

export default {
  name: "mone-query",
  props: {
    config: {
      type: [Object, String],
      required: true
    },
    data: {
      type: [Array, String],
      required: true
    },
    height: {
      type: [String, Number]
    },
    border: {
      type: Boolean,
      default: false
    },
    primaryKey: {
      type: String,
      default: "id"
    },
    pageName: {
      type: String
    },
    sizeName: {
      type: String
    },
    rowsName: {
      type: String
    },
    totalName: {
      type: String
    },
    colbox: {
      type: Object
    },
    visibleFields: {
      type: Boolean,
      default: true
    },
    visibleFieldConfig: Array
  },
  components: {
    showField
  },
  data() {
    return {
      CONFIG: {},
      CONFIGLoading: false,
      COMPONENT_NAME_MAP: {
        varchar: "el-autocomplete",
        date: "el-date-picker",
        datetime: "el-date-picker"
        // bit: "el-checkbox",
        // int: "el-input-number",
        // time: "el-time-picker",
      },
      stmt: new ListView({
        pageName: this.pageName,
        sizeName: this.sizeName,
        rowsName: this.rowsName,
        totalName: this.totalName
      }),
      showProps: [],
      configShowFields: [],
      multipleSelection: []
    };
  },
  computed: {
    cols() {
      if (this.CONFIG.cols) {
        return this.CONFIG.cols
          .filter(x => this.showProps.includes(x.prop))
          .map(col => {
            col.valueFormat = this.getValueFormat(col);
            col.elType = this.getElType(col);
            return col;
          });
      }
      return [];
    }
  },
  async created() {
    // 1. 加载配置
    await this.loadConfig();
    // 1. 初始化外部设置
    this.setup();
    this.stmtLoad();
  },
  methods: {
    async loadConfig() {
      try {
        this.CONFIGLoading = true;
        if (typeof this.config === "string") {
          const { resultData } = await this.$request(this.config, null, "GET", {
            baseURL: this.$MONE_QUERY.baseUrl
          });
          if (resultData) this.CONFIG = resultData;
        } else {
          this.CONFIG = this.config;
        }
        this.initConfig();
        // 查询参数
        this.resetParam();
      } catch (error) {
        this.$notify.error("mone-query: load config data failed");
      } finally {
        this.CONFIGLoading = false;
      }
    },
    initConfig() {
      this.CONFIG.pageName = this.pageName;
      this.CONFIG.sizeName = this.sizeName;
      this.CONFIG.rowsName = this.rowsName;
      this.CONFIG.totalName = this.totalName;
      this.CONFIG.visibleFields = this.visibleFields;
      this.CONFIG.visibleFieldConfig = this.visibleFieldConfig;
      this.CONFIG.colbox = this.colbox;

      if (!this.CONFIG.pageName) {
        this.CONFIG.pageName = this.$MONE_QUERY.pageName;
      }
      if (!this.CONFIG.sizeName) {
        this.CONFIG.sizeName = this.$MONE_QUERY.sizeName;
      }
      if (!this.CONFIG.rowsName) {
        this.CONFIG.rowsName = this.$MONE_QUERY.rowsName;
      }
      if (!this.CONFIG.totalName) {
        this.CONFIG.totalName = this.$MONE_QUERY.totalName;
      }
      if (!this.CONFIG.colbox) {
        this.CONFIG.colbox = this.$MONE_QUERY.colbox || {};
      }
      if (this.CONFIG.visibleFields == null) {
        this.CONFIG.visibleFields = this.$MONE_QUERY.visibleFields;
      }
    },
    setup() {
      // 显示字段
      this.setShowFields();
    },
    // 设置显示字段
    setShowFields() {
      // 设置字段在工具栏的显示规则
      if (this.CONFIG.visibleFieldConfig) {
        this.configShowFields = this.CONFIG.visibleFieldConfig;
      } else {
        this.configShowFields.push(
          new FieldGroup({
            colProps: this.showProps
          })
        );
      }
      this.$nextTick(() => {
        this.$refs.showFieldRef.handleCheckAllChange(this.CONFIG.visibleFields);
      });
    },
    requestUrl() {
      return this.$MONE_QUERY.baseUrl + this.data;
    },
    resetParam() {
      const _params = {};
      this.CONFIG.cols.forEach(col => {
        _params[col.prop] = new Param({
          field: col.prop,
          filedType: col.type,
          action: "eq",
          value: this.getParamVal(col)
        });
      });
      this.stmt.parameters.params = _params;
    },
    getValueFormat(col) {
      if (col.valueFormat) return col.valueFormat;
      switch (col.type) {
        case "date":
          return "yyyy-MM-dd";
        case "datetime":
          return "yyyy-MM-dd HH:mm:ss";
        default:
          return void 0;
      }
    },
    getParamVal(col) {
      switch (col.type) {
        case "date":
        case "datetime":
          return [];
        default:
          return null;
      }
    },
    getElType(col) {
      switch (col.type) {
        case "date":
          return "daterange";
        case "datetime":
          return "datetimerange";
        default:
          return void 0;
      }
    },
    stmtLoad() {
      const primary = this.stmt;
      if (typeof this.data !== "string") {
        primary.rows = this.data;
        primary.total = this.data.length;
        return;
      }
      if (primary.loading) return;

      const _query = primary.parameters.params;
      const pars = [];
      Object.keys(_query)
        .filter(x => _query[x].value != null)
        .forEach(x => {
          const field = this.CONFIG.cols.find(f => f.prop === x);
          if (!field) return;
          switch (field.type) {
            case "datetime":
            case "date":
              if (_query[x] && _query[x].length === 2) {
                pars.push({
                  field: x,
                  action: "gt",
                  filedType: field.type,
                  value: _query[x][0]
                });
                pars.push({
                  field: x,
                  action: "lt",
                  filedType: field.type,
                  value: _query[x][1]
                });
              }
              break;
            default:
              pars.push({
                field: x,
                action: "eq",
                filedType: field.type,
                value: primary.parameters.params[x]
              });
              break;
          }
        });

      primary
        .load(this.$request, this.requestUrl(), primary.parameters, "POST")
        .catch(e => {
          e.message && this.$notify.error(e.message);
        });
    },
    handleSelectionChange(val) {
      if (this.CONFIG.showHeader && this.CONFIG.showSelection) {
        this.multipleSelection = val;
      }
    },
    handleChoose() {},
    async querySearchAsync(queryString, cb, field) {
      if (!queryString) return cb([]);
      if (typeof this.data !== "string") {
        return cb([]);
      }
      const res = await this.$request(
        this.requestUrl(),
        {
          header: [field.prop],
          pars: [
            {
              field: field.prop,
              action: "eq",
              filedType: field.type,
              value: queryString
            }
          ],
          page: {
            [this.CONFIG.pageName]: 1,
            [this.CONFIG.sizeName]: 20
          },
          orderBys: []
        },
        "POST"
      );
      cb(getDeepProp(res, this.stmt.rowsName.split(".")));
    },
    handleSortChange({ prop, order }) {
      if (this.CONFIG.showHeader && this.CONFIG.showSelection) {
        if (prop && order) {
          this.stmt.parameters.sort.orderFiled = prop;
          this.stmt.parameters.sort.orderType = order.replace("ending", "");
        } else {
          this.stmt.parameters.sort.orderFiled = null;
          this.stmt.parameters.sort.orderType = null;
        }
        this.stmtLoad();
      }
    },
    // 自定义表头
    customFieldColumn(h, { column, $index }) {
      return h();
    }
  }
};
</script>

<style lang="scss">
.mone-query {
  .m-l {
    margin-left: 12px;
  }
  .m-r {
    margin-left: 12px;
  }
  .text-right {
    text-align: right;
  }
  box-sizing: border-box;
  .tool-box {
    padding: 16px 0;
    background-color: white;
  }
}
</style>
