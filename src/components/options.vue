<template functional>
  <el-select v-bind="$attrs" v-on="$listeners" v-model="valueProxy" collapse-tags>
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "mone-options",
  props: {
    value: {
      required: true,
      default() {
        return this.$attrs.multiple ? [] : null;
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
  }
};
</script>
