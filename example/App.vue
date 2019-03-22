<template>
  <div class="app">
    <h3 class="text-center">mone-query</h3>
    <mone-query
      border
      show-action
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
      }
    };
  },
  methods: {
    handleDelete(selection) {
      console.log(selection);
    },
    handleSearch(parameters) {
      setTimeout(() => {
        this.data = this.data.concat(
          this.data.map(x => {
            x.id++;
            return x;
          })
        );
      }, 1500);
    }
  }
};
</script>

<style lang="scss">
.bd {
  border: 1px solid palevioletred;
}
</style>

