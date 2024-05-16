<template>
  <div v-if="shop">
    <div class="header">
      <image class="header-bg" :src="shop.header_bg" />
      <image class="shop-logo" :src="shop.shop_logo" />
      <p>{{ shop.shop_name }}</p>
    </div>
    <div class="qrcode">
      <image class="code" :src="shop.qrcode_pic" />
      <p>扫一扫，进入店铺</p>
      <view class="bt" @click="$utils.addImg(shop.qrcode_pic)">保存二维码</view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      shop: '',
      page: 1,
      status: 'loadmore',
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.mch.shopQrcode({}, true);
      this.shop = res.data;
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
.header {
  position: relative;
  text-align: center;
  padding-top: 70 * 2rpx;
  margin-bottom: 40 * 2rpx;
  z-index: 10;
}
.header-bg {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 120 * 2rpx;
}
.shop-logo {
  width: 100 * 2rpx;
  height: 100 * 2rpx;
  margin-bottom: 20 * 2rpx;
  border-radius: 8 * 2rpx;
  box-shadow: 0 0 8 * 2rpx rgba(0, 0, 0, 0.2);
  position: relative;
  display: inline-block;
}
.qrcode {
  text-align: center;
}
.qrcode .code {
  width: 200 * 2rpx;
  height: 200 * 2rpx;
  margin-bottom: 20 * 2rpx;
  box-shadow: 0 0 2 * 2rpx rgba(0, 0, 0, 0.05);
  display: inline-block;
}
.bt {
  margin: 30rpx auto;
  width: 200rpx;
  line-height: 2.0;
  border-radius: 30rpx;
  background: #ff4544;
  text-align: center;
  color: #fff;
  font-size: 30rpx;
}
</style>
