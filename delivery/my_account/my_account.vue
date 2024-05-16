<template>
  <view v-if="pageData" class="body">
    <header>
      <view>账户余额（元）</view>
      <view class="m-t-10 font-600-60">{{ pageData.account }}</view>
    </header>

    <div @click="$utils.toUrl('/delivery/order_history/order_history')" class="menu-item flex-y-center flex-x-sb p-20">
      <view class="flex-y-center">
        <u-icon name="rmb-circle" color="#fcd867" size="40rpx"></u-icon>
        <text class="m-l-20 font-600-30">收入明细</text>
      </view>
      <u-icon name="arrow-right"></u-icon>
    </div>
    <div @click="$utils.toUrl('/pages/cash/cash?type=peisong')" class="menu-item flex-y-center flex-x-sb p-20">
      <view class="flex-y-center">
        <text
          class="iconfont icon-qianbao font-40"
          style="color: #fcd867"
        ></text>
        <text class="m-l-20 font-600-30">提现</text>
      </view>
      <u-icon name="arrow-right"></u-icon>
    </div>
    <div
      @click="$utils.toUrl('/pages/cash-detail/cash-detail?type=peisong')"
      class="menu-item flex-y-center flex-x-sb p-20"
    >
      <view class="flex-y-center">
        <text
          class="iconfont icon-qianbao font-40"
          style="color: #fcd867"
        ></text>
        <text class="m-l-20 font-600-30">提现明细</text>
      </view>
      <u-icon name="arrow-right"></u-icon>
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
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.user.getDeliveryAccount({}, true);
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
.body {
  background: #f5f5f5;
  min-height: 100vh;
}

header {
  background: #262a36;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 50rpx;
}

.menu-item {
  border-bottom: 1px solid #eee;
  background: #fff;
}
</style>
