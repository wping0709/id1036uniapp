<template>
  <view v-if="pageData" class="body">
    <view class="card-info radius flex-x-sb flex-y-center">
      <view class="flex-y-center">
        <image :src="pageData.list.pic_url" style="" mode="aspectFill"></image>
        <view>{{ pageData.list.verify_card_name }}</view>
      </view>
      <view
        @click="
          $utils.toUrl('/mch/verify-log/verify-log?sale_id=' + pageData.list.id)
        "
        class="color-999 flex-x-sb flex-y-center"
      >
        <text>使用记录</text>
        <text class="iconfont icon-arrow-right font-24"></text>
      </view>
    </view>

    <view @click="$utils.toUrl('/shop/shop/shop')" class="nav-to radius"> 跳转可用门店 </view>

    <view class="code-box radius flex-col flex-y-center">
      <view>核销码</view>
      <image :src="codeUrl" mode="aspectFit"></image>
      <view class="font-26">使用时向核销人员出示核销码</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      sale_id: "",
      codeUrl: "",
    };
  },
  onLoad(params) {
    this.sale_id = params.sale_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      await this.getCodeUrl();

      const res = await this.$requestAll.verify.verifyDetail(
        {
          sale_id: this.sale_id,
        },
        true
      );
      this.pageData = res.data;
    },
    async getCodeUrl() {
      const res = await this.$requestAll.order.getQrcode({
        order_type: "verify",
        order_no: this.sale_id,
      });
      this.codeUrl = res.data.url;
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
  padding-top: 20rpx;
  background: #424447;
  min-height: 100vh;
}
.radius {
  border-radius: 20rpx;
}
.card-info {
  padding: 20rpx;
  background: #fff;
  margin: 0 20rpx 20rpx;
  > view:nth-child(1) {
    > image {
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
  }
}

.nav-to {
  padding: 20rpx;
  margin: 20rpx;
  text-align: center;
  background: #fff;
  font-size: 30rpx;
}

.code-box {
  margin: 0 20rpx 20rpx;
  background: #fff;
  padding: 60rpx 0 20rpx;
  font-size: 30rpx;
  color: #666;
  > image {
    margin: 20rpx 0 40rpx;
  }
}
</style>
