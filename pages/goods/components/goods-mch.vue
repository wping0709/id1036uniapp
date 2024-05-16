<template>
  <view v-if="mchData" class="mch-box bg-fff flex-y-center">
    <image :src="mchData.logo" mode="aspectFill" />

    <view class="flex-w-1 m-l-20">
      <view class="mch-name">{{ mchData.name }}</view>
      <view class="font-24 color-999">
        商品数量：<text class="color-333 m-r-20">{{ mchData.goods_num }}</text>
        已售：<text class="color-333">{{ mchData.sale_num }}</text>
      </view>
    </view>

    <view
      @click="$utils.toUrl('/mch/shop/shop?mch_id=' + mchData.id)"
      class="to-shophome flex-y-center flex-x-center"
    >
      <text class="iconfont icon-store font-34"></text>
      <text>进店逛逛</text>
    </view>
  </view>
</template>
<script>
export default {
  props: ['mchData'],
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
.mch-box {
  margin: 20rpx;
  border-radius: 30rpx;
  background: #fff;
  overflow: hidden;
  
  padding: 30rpx 24rpx;
  .mch-name {
    line-height: 36rpx;
    font-size: 26rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  > image {
    width: 100rpx;
    height: 100rpx;
    background: #ffffff;
    border: 2rpx solid #f6f6f6;
    opacity: 1;
    border-radius: 8rpx;
  }

  .to-shophome {
    width: 168rpx;
    line-height: 60rpx;
    text-align: center;
    background: #ffffff;
    border: 2rpx solid #9b9b9b;
    opacity: 1;
    border-radius: 120rpx;
    font-size: 24rpx;
  }
}
</style>
