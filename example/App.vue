<template>
  <div class="app">
    <h3 class="text-center">mone-query</h3>
    <mone-query class="bd" border :config="Config.resultData" :data="Data.resultData.rows" />
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
      Data
    };
  },
  methods: {
    // 添加新行
    addNewRow(rowIndex) {
      let newRow = JSON.parse(JSON.stringify(this.rowModel));
      for (var key in newRow) {
        newRow[key] = "";
      }
      // 模拟主键
      newRow[this.config.primaryKey] = Date.now();
      this.rows.splice(rowIndex + 1, 0, newRow);
    },
    // 删除某行
    delRow(rowIndex) {
      this.rows.splice(rowIndex, 1);
    }
  }
};
</script>

<style lang="scss">
.bd {
  border: 1px solid palevioletred;
}
</style>

