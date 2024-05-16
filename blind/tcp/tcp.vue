<template>
  <view v-if="pageData" class="body">
    <rich-text v-html="pageData"></rich-text>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.blind.getRule({}, true);
      this.pageData = res.data;
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  padding: 35rpx 24rpx 0;
  padding: 35rpx 24rpx env(safe-area-inset-bottom);
}
</style>
