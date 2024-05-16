<template>
  <view class="page-body">
    <div class="page-content flex-col flex-x-center flex-y-center bg-fff bdrd-20">
      <image src="" class="user-img" mode="aspectFill"></image>
      <div class="font-600-40 border-b p-b-50 m-t-24 font-center" style="width:100%;margin-bottom:90rpx">某某某</div>

      <image class="code" src="" mode="aspectFill"></image>

      <div class="color-999">打开手机扫一扫打开商城</div>
    </div>
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
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll;
      this.pageData = res.data;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  padding: 144rpx 30rpx 0;
  padding-bottom: env(safe-are-inset-bottom);
  background: #f2f2f2;
  min-height: 100vh;
  // #ifdef H5
  min-height: calc(100vh - 44px);
  // #endif
  .page-content {
    padding: 0 30rpx 66rpx;
    
    .user-img {
      width: 136rpx;
      height: 136rpx;
      border-radius: 50%;
      margin-top: -68rpx;
      background: #f2f2f2;
    }
    .code {
      width: 358rpx;
      height: 360rpx;
      background: #f2f2f2;
      margin-bottom: 60rpx;
    }
  }
}
</style>
