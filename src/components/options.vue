<template>
  <div class="mone-options">
    <el-select multiple v-model="valueProxy">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: "mone-options",
  props: {
    value: {
      type: [Array],
      default() {
        return [];
      }
    },
    options: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  computed: {
    valueProxy: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  },
  mounted() {},
  watch: {},
  methods: {},
  filters: {}
};
</script>

<style>
.mone-options {
  box-sizing: border-box;
}
</style>
