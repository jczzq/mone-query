<template>
  <div class="app">
    <h2 class="title">
      mone-query
    </h2>
    <p class="sub-title">
      Vue标准查询组件， 基于<a
        href="http://element-cn.eleme.io/#/zh-CN/component/installation"
        target="_blank"
        >element-ui</a
      >， 数据驱动，配置简洁灵活。
    </p>
    <section>
      <h3>
        前端直接传入参数方式
      </h3>
      <mone-query
        ref="moneQuery"
        class="bd"
        :config="config"
        :data="data"
        :formatters="formatters"
        @delete="handleDelete"
        @search="handleSearch"
      >
        <button slot="header-left">自定义按钮 slot: header-left</button>
      </mone-query>
    </section>

    <section>
      <h3>
        Ajax方式
      </h3>
      <mone-query
        ref="moneQuery2"
        class="bd"
        border
        show-action
        show-index
        :config="config2"
        :data="data2"
        :formatters="formatters"
        @delete="handleDelete2"
        @search="handleSearch2"
        @data-success="handleSearch2Success"
        @data-error="handleSearch2Error"
        @data-complete="handleSearch2Complete"
      >
        <template slot-scope="{ row }">
          <el-button type="default" @click="handleEdit(row)"
            >编辑
            <!-- {{ JSON.stringify(row) }} -->
          </el-button>
        </template>
      </mone-query>
    </section>

    <section>
      <h3>
        Ajax请求配置失败
      </h3>
      <mone-query
        ref="moneQuery3"
        class="bd"
        border
        :config="config3"
        :data="data2"
        :formatters="formatters"
        @config-success="handleConfigSuccess"
        @config-error="handleConfigError"
        @config-complete="handleConfigComplete"
      >
      </mone-query>
    </section>

    <section>
      <h3>
        Ajax请求结果集失败
      </h3>
      <mone-query
        ref="moneQuery3"
        class="bd"
        border
        :config="config2"
        :data="data3"
        :formatters="formatters"
        @data-success="handleDataSuccess"
        @data-error="handleDataError"
        @data-complete="handleDataComplete"
      >
        <button slot="header">自定义按钮 slot: header</button>
      </mone-query>
    </section>

    <p>
      <button @click="handleCleanSelection()">清除选择</button>
    </p>
  </div>
</template>

<script>
import Config from "@/Config.json";
import Data from "@/Data.json";
export default {
  name: "app",
  data() {
    return {
      config: Config.resultData,
      config2: "/config",
      config3: "/config-error",
      data: Data.resultData.rows,
      data2: "/data",
      data3: "/data-error",
      formatters: {
        grade: (row, column, cellValue, index) => {
          // console.log(row, column, cellValue, index);
          const col = Config.resultData.cols.find(
            x => x.prop === column.columnKey
          );
          const item = col.options.find(x => x.value === cellValue) || {};
          return item.label || cellValue;
        },
        isMarried: (row, column, cellValue, index) => {
          return cellValue ? "是" : "否";
        }
      }
    };
  },
  methods: {
    handleDelete(selection) {
      console.log("delete event: ", selection);
    },
    handleSearch(parameters) {
      console.log("search event: ", parameters);
    },
    handleDelete2(selection) {
      console.log("delete event: ", selection);
    },
    handleSearch2(parameters) {
      console.log("search event: ", parameters);
    },
    handleSearch2Error(e) {
      console.log("data-error event: ", e);
    },
    handleSearch2Success(res) {
      console.log("data-success event: ", res);
    },
    handleSearch2Complete() {
      console.log("data-complete event");
    },
    handleCleanSelection() {
      this.$refs.moneQuery.$refs[this.$refs.moneQuery.tableId].clearSelection();
    },
    handleEdit(row) {
      console.log("row: ", row);
    },
    handleConfigSuccess(res) {
      console.log("config-success event: ", res);
    },
    handleConfigError(error) {
      console.log("config-error event: ", error);
    },
    handleConfigComplete() {
      console.log("config-complete event");
    },
    handleDataSuccess(res) {
      console.log("data-success event: ", res);
    },
    handleDataError(error) {
      console.log("data-error event: ", error);
    },
    handleDataComplete() {
      console.log("data-complete event");
    }
  }
};
</script>

<style lang="scss">
.app {
  section {
    margin-bottom: 50px;
  }
  .title {
    text-align: center;
  }
  .sub-title {
    text-align: center;
  }
  .bd {
    border: 1px dotted skyblue;
  }
}
</style>

