<template>
  <div class="mone-query" v-loading="CONFIGLoading">
    <p class="tool-box">
      <el-button type="default" @click="resetParam(cols)">重置</el-button>
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
        :fields="cols"
        ref="showFieldRef"
        v-model="showProps"
        :placement="colbox.placement"
        :width="colbox.width"
        :trigger="colbox.trigger"
        :config="configShowFields"
      />
    </p>
    <el-table
      :data="stmt.rows"
      :border="border"
      :row-key="row => row[primaryKey]"
      :height="height"
      :show-header="showHeader"
      :max-height="maxHeight"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-if="showIndex"
        :index="index => index + 1"
        type="index"
        align="center"
      ></el-table-column>
      <el-table-column
        draggable
        v-if="showSelection"
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
        :label="item.label"
        :width="item.width"
      >
        <template slot="header">
          <component
            v-if="COMPONENT_NAME_MAP.hasOwnProperty(item.type)"
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
            :placeholder="item.placeholder"
            :value-format="item.valueFormat"
            :type="item.elType"
            :is="COMPONENT_NAME_MAP[item.type]"
            v-model="stmt.parameters.params[item.prop].value"
          >
          </component>
          <p>
            <!-- {{ JSON.stringify(scope.column) }} -->
            {{ item.label }}
          </p>
        </template>
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
import { ListView, Param } from "../class/ViewModel";
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
    maxHeight: {
      type: [String, Number]
    },
    border: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    showIndex: {
      type: Boolean,
      default: false
    },
    primaryKey: {
      type: String,
      default: "id"
    },
    colbox: {
      type: Object,
      default() {
        return {};
      }
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
        pageName: this.pageName || this.$MONE_QUERY.pageName,
        sizeName: this.sizeName || this.$MONE_QUERY.sizeName,
        rowsName: this.rowsName || this.$MONE_QUERY.rowsName,
        totalName: this.totalName || this.$MONE_QUERY.totalName
      }),
      showProps: [],
      configShowFields: [],
      multipleSelection: []
    };
  },
  computed: {
    cols() {
      if (this.CONFIG.cols) {
        return this.CONFIG.cols.map(col => {
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
  mounted() {},
  methods: {
    async loadConfig() {
      try {
        this.CONFIGLoading = true;
        if (typeof this.config === "string") {
          const { resultData } = await this.$request(this.config);
          if (resultData) this.CONFIG = resultData;
        } else {
          this.CONFIG = this.config;
        }
        // 查询参数
        this.resetParam(this.CONFIG.cols);
      } catch (error) {
        this.$notify.error("mone-query: load config data failed");
      } finally {
        this.CONFIGLoading = false;
      }
    },
    setup() {
      // 显示字段
      this.setShowFields();
    },
    // 设置显示字段
    setShowFields() {
      if (typeof this.visibleFields === "boolean") {
        this.$refs.showFieldRef.handleCheckAllChange(this.visibleFields);
      } else {
        this.showProps = this.visibleFields;
      }

      // 设置字段在工具栏的显示规则
      if (this.visibleFieldConfig) {
        this.configShowFields = this.visibleFieldConfig;
      } else {
        this.configShowFields.push(
          new FieldGroup({
            colProps: this.showProps
          })
        );
      }
    },
    requestUrl() {
      return this.$MONE_QUERY.baseURL + this.data;
    },
    resetParam(cols) {
      const _params = {};
      cols.forEach(col => {
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
      if (primary.loading) return;

      const _query = primary.parameters.params;
      const pars = [];
      Object.keys(_query)
        .filter(x => _query[x] != null)
        .forEach(x => {
          const field = this.cols.find(f => f.prop === x);
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
      if (this.showHeader && this.showSelection) {
        this.multipleSelection = val;
      }
    },
    handleChoose() {},
    async querySearchAsync(queryString, cb, field) {
      if (!queryString) return cb([]);
      const { resultData } = await this.$request(
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
            [this.pageName]: 1,
            [this.sizeName]: 20
          },
          orderBys: []
        },
        "POST"
      );
      cb(resultData);
    },
    handleSortChange({ prop, order }) {
      if (this.showHeader && this.showSelection) {
        if (prop && order) {
          this.stmt.parameters.sort.orderFiled = prop;
          this.stmt.parameters.sort.orderType = order.replace("ending", "");
        } else {
          this.stmt.parameters.sort.orderFiled = null;
          this.stmt.parameters.sort.orderType = null;
        }
        this.stmtLoad();
      }
    }
  }
};
</script>

<style lang="scss">
.m-l {
  margin-left: 16px;
}
.mone-query {
  box-sizing: border-box;
  .tool-box {
    padding: 16px;
    background-color: white;
  }
}
</style>
