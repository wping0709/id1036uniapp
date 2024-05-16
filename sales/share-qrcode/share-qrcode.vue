<template>
  <view v-if="pageData" class="body">
    <image :src="pageData" mode="widthFix"></image>
    <view class="bt" @click="dowLoad">下载</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      custom: {},
    };
  },
  onLoad(params) {
    this.pageType = params.pageType || "";
    this.getShareData();
    this.loadData();
  },
  methods: {
    async loadData() {
      let res;
      if (this.pageType == "shop") {
        res = await this.$requestAll.recommend.getQrcode({}, true);
      } else {
        res = await this.$requestAll.share.getQrcode({}, true);
      }
      this.pageData = res.data;
    },
    async getShareData() {
      const res1 = await this.$requestAll.share.getInfo({}, true);
      this.custom = res1.data.custom;
      if (this.custom.menus.order) {
        uni.setNavigationBarTitle({
          title: this.custom.menus.qrcode.name,
        });
      }
    },
    dowLoad() {
      this.$utils.addImg(this.pageData);
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
  padding-bottom: 30rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 30rpx);
  background: #f5f5f5;
  > image {
    display: block;
    width: 100%;
  }
  .bt {
    margin: 60rpx auto 0;
    color: #fff;
    width: 95%;
    background-color: #ff4544;
    border-radius: 10rpx;
    line-height: 90rpx;
    text-align: center;
  }
}
</style>
