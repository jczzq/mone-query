<template>
  <div class="app">
    <h3 class="text-center">mone-query</h3>
    <mone-query
      class="bd"
      border
      show-action
      base-url="/api"
      :config="'/config'"
      :data="'/data'"
      :formatters="formatters"
    >
      <template slot-scope="{ row }">
        <el-button type="default"
          >重置
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
      Config,
      Data,
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
  methods: {}
};
</script>

<style lang="scss">
.bd {
  border: 1px solid palevioletred;
}
</style>

