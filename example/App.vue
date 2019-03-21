<template>
  <div class="app">
    <h3 class="text-center">mone-query</h3>
    <mone-query
      class="bd"
      border
      base-url="/api"
      :config="'/config'"
      :data="'/data'"
    />
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
  methods: {}
};
</script>

<style lang="scss">
.bd {
  border: 1px solid palevioletred;
}
</style>

