<template>
  <div class="mone-query" v-loading="CONFIGLoading">
    <div class="mone-query-body" v-if="CONFIG">
      <el-row class="tool-box">
        <el-col :span="12">
          <el-button
            icon="el-icon-refresh"
            :loading="CONFIGLoading"
            @click="loadConfig()"
          ></el-button>
        </el-col>
        <el-col :span="12" class="text-right">
          <el-button type="default" @click="resetParam()">重置</el-button>
          <el-button
            type="primary"
            icon="el-icon-search"
            :loading="stmt.loading"
            @click="stmtLoad()"
            >查询</el-button
          >
          <el-button
            v-if="CONFIG.showDelete"
            type="danger"
            icon="el-icon-remove"
            @click="handleBatchDelete()"
            >删除</el-button
          >
          <!-- <el-button
            type="primary"
            :loading="stmt.exporting"
            @click="handleExport()"
            >导出</el-button
          > -->
          <show-field
            v-if="CONFIG.colbox"
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
        :data="stmt.rows"
        :border="border"
        :row-key="row => row[CONFIG.primaryKey]"
        :height="height"
        :max-height="maxHeight"
        :show-header="CONFIG.showHeader"
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
          :fixed="FIXED[item.prop]"
          sortable="custom"
          v-for="item in cols"
          :key="item.prop"
          :column-key="item.prop"
          :prop="item.prop"
          :width="item.width"
          :formatter="formatters[item.prop]"
        >
          <span slot="header" slot-scope="scope">
            <span>
              {{ item.label }}
            </span>
            <el-popover v-if="item.hasType()">
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
                size="large"
                icon="el-icon-search"
                @click.stop=""
              ></el-button>
            </el-popover>
            <el-button
              type="text"
              size="large"
              :icon="`el-icon-star-${FIXED[item.prop] ? 'on' : 'off'}`"
              @click.stop="FIXED[item.prop] = !FIXED[item.prop]"
            ></el-button>
          </span>
        </el-table-column>
        <el-table-column label="操作" fixed="right" v-if="showAction">
          <template slot-scope="{ row }">
            <slot :row="row"></slot>
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
  </div>
</template>

<script>
import Col from "../class/Col";
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
    maxHeight: {
      type: [String, Number]
    },
    border: {
      type: Boolean,
      default: false
    },
    primaryKey: String,
    pageName: String,
    sizeName: String,
    rowsName: String,
    totalName: String,
    colbox: Object,
    visibleFields: Boolean,
    visibleFieldConfig: Array,
    formatters: {
      type: Object,
      default() {
        return {};
      }
    },
    showAction: Boolean,
    showDelete: Boolean,
    showHeader: Boolean,
    showSelection: Boolean,
    showIndex: Boolean
  },
  components: {
    showField
  },
  data() {
    return {
      CONFIG: {},
      CONFIGLoading: false,
      COMPONENT_NAME_MAP: Col.TYPES,
      stmt: new ListView({
        pageName: this.pageName,
        sizeName: this.sizeName,
        rowsName: this.rowsName,
        totalName: this.totalName
      }),
      showProps: [],
      configShowFields: [],
      multipleSelection: [],
      FIXED: {}
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
            return new Col(col);
          })
          .sort((a, b) => {
            const aa = a.order || Infinity;
            const bb = b.order || Infinity;
            if (aa > bb) {
              return 1;
            } else if (aa < bb) {
              return -1;
            } else {
              return 0;
            }
          });
      }
      return [];
    }
  },
  created() {
    // 加载配置
    this.loadConfig();
  },
  mounted() {},
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
        // 初始化外部设置
        this.initConfig();
        // 初始化查询参数
        this.resetParam();
        // 设置显示字段
        this.setShowFields();
        // 查询数据
        this.stmtLoad();
      } catch (error) {
        this.$notify.error("mone-query: load config data failed");
      } finally {
        this.CONFIGLoading = false;
      }
    },
    initConfig() {
      if (this.primaryKey) this.CONFIG.primaryKey = this.primaryKey;
      if (this.pageName) this.CONFIG.pageName = this.pageName;
      if (this.sizeName) this.CONFIG.sizeName = this.sizeName;
      if (this.rowsName) this.CONFIG.rowsName = this.rowsName;
      if (this.totalName) this.CONFIG.totalName = this.totalName;
      if (this.colbox) this.CONFIG.colbox = this.colbox;
      if (this.visibleFields) this.CONFIG.visibleFields = this.visibleFields;
      // visibleFieldConfig 无全局配置
      if (this.visibleFieldConfig) {
        this.CONFIG.visibleFieldConfig = this.visibleFieldConfig;
      }

      if (this.showAction) this.CONFIG.showAction = this.showAction;
      if (this.showDelete) this.CONFIG.showDelete = this.showDelete;
      if (this.showHeader) this.CONFIG.showHeader = this.showHeader;
      if (this.showSelection) this.CONFIG.showSelection = this.showSelection;
      if (this.showIndex) this.CONFIG.showIndex = this.showIndex;

      if (!this.CONFIG.primaryKey) {
        this.CONFIG.primaryKey = this.$MONE_QUERY.primaryKey || "id";
      }
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
        this.CONFIG.visibleFields = this.$MONE_QUERY.visibleFields || true;
      }
      if (this.CONFIG.showAction == null) {
        this.CONFIG.showAction = this.$MONE_QUERY.showAction || false;
      }
      if (this.CONFIG.showDelete == null) {
        this.CONFIG.showDelete = this.$MONE_QUERY.showDelete || false;
      }
      if (this.CONFIG.showHeader == null) {
        this.CONFIG.showHeader = this.$MONE_QUERY.showHeader || true;
      }
      if (this.CONFIG.showSelection == null) {
        this.CONFIG.showSelection = this.$MONE_QUERY.showSelection || true;
      }
      if (this.CONFIG.showIndex == null) {
        this.CONFIG.showIndex = this.$MONE_QUERY.showIndex || false;
      }
    },
    // 设置显示字段
    setShowFields() {
      this.$nextTick(() => {
        this.$refs.showFieldRef.handleCheckAllChange(this.CONFIG.visibleFields);
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
      });
    },
    requestUrl() {
      return this.$MONE_QUERY.baseUrl + this.data;
    },
    resetParam() {
      const _params = {};
      const _fixed = {};
      this.CONFIG.cols.forEach(col => {
        _params[col.prop] = new Param({
          field: col.prop,
          filedType: col.type,
          action: "eq",
          value: this.getParamVal(col)
        });
        _fixed[col.prop] = col.fixed;
      });
      this.FIXED = _fixed;
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
        case "option":
        case "date":
        case "datetime":
          return [];
        default:
          return void 0;
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
    },
    handleBatchDelete() {
      this.$emit("delete", this.multipleSelection);
    }
  }
};
</script>

<style lang="scss">
.mone-query {
  min-height: 150px;
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
