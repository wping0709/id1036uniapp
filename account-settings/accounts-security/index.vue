<template>
  <view v-if="pageData" class="body">
    <view
      @click="$utils.toUrl('/lives/real/index')"
      class="item bg-fff flex-x-sb flex-y-center p-y-20 p-x-30"
    >
      <view class="">
        <view class="font-30">实名认证</view>
        <view class="color-999 m-t-10">完成实名认证，尊享更多服务</view>
      </view>
      <view class="color-999 flex-y-center">
        <text></text>
        <text class="iconfont icon-arrow-right m-l-10"></text>
      </view>
    </view>
    <u-line color="#eee"></u-line>
    <view @click="$utils.toUrl('/account-settings/bangding/bangding')" class="item bg-fff flex-x-sb flex-y-center p-y-20 p-x-30">
      <view class="">
        <view class="font-30">修改手机号</view>
        <view class="color-999 m-t-10">若手机更换请尽快修改</view>
      </view>
      <view class="color-999 flex-y-center">
        <text>{{ pageData.mobile }}</text>
        <text class="iconfont icon-arrow-right m-l-10"></text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.accountSettings.userIndex({});
      this.pageData = res.data;
    },
  },
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
  min-height: calc(100vh - 44px);
  /* #endif */
  .item {
    &:nth-last-child(1) {
      border-radius: 0 0 30rpx 30rpx;
    }
  }
}
</style>
