<template>
  <div class="app">
    <h2 class="title">mone-query</h2>
    <section>
      <h3>
        前端直接传入参数方式
      </h3>
      <pre v-text="codeBlock_1">
        
      </pre>
    </section>
    <mone-query
      ref="moneQuery"
      class="bd"
      border
      show-action
      show-index
      :config="config"
      :data="data"
      :formatters="formatters"
      @delete="handleDelete"
      @search="handleSearch"
    >
      <template slot-scope="{ row }">
        <el-button type="default"
          >编辑
          <!-- {{ JSON.stringify(row) }} -->
        </el-button>
      </template>
    </mone-query>

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
      data: Data.resultData.rows,
      data2: "/data",
      formatters: {
        grade: (row, column, cellValue, index) => {
          // console.log(row, column, cellValue, index);
          const col = Config.resultData.cols.find(
            x => x.prop === column.columnKey
          );
          const item = col.list.find(x => x.value === cellValue) || {};
          return item.label || cellValue;
        },
        isMarried: (row, column, cellValue, index) => {
          return cellValue ? "是" : "否";
        }
      },
      codeBlock_1: ''
    };
  },
  methods: {
    handleDelete(selection) {
      console.log(selection);
    },
    handleSearch(parameters) {
      const _row = JSON.parse(JSON.stringify(this.data[0]));
      setTimeout(() => {
        _row.id = Date.now();
        this.data.push(_row);
      }, 1500);
    },
    handleCleanSelection() {
      this.$refs.moneQuery.$refs[this.$refs.moneQuery.tableId].clearSelection();
    }
  }
};
</script>

<style lang="scss">
.title {
  text-align: center;
}
.bd {
  border: 1px dotted skyblue;
}
</style>

