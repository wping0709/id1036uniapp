<template>
  <view class="body">
    <template v-if="type == 1">
      <view v-html="pageData.software_licensing"></view>
    </template>
    <template v-else>
      <view v-html="pageData.privacy_protect"></view>
    </template>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      type: 0,
    };
  },
  onLoad(params) {
    this.type = params.type;
    this.loadData();
  },
  methods: {
    async loadData() {
      console.log("123");
      const res = await this.$requestAll.accountSettings.indexIndex({}, true);
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
  min-height: 100vh;
  /* #ifdef H5 */
  min-height:calc(100vh - 44px);
  /* #endif */
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  color: #666;
}
</style>
