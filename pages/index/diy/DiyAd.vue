<template>
  <view class="page-body">
    <ad class="" :unit-id="param.id" @load="adLoad" @error="adError"></ad>
  </view>
</template>
<script>
export default {
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    adLoad(e) {
      console.log(e);
    },
    adError(e) {
      console.log(e);
    },
  },
  computed: {},
  watch: {},
};
</script>
<style lang="scss" scoped>
.page-body {
}
</style>
