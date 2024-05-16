<template>
  <view class="body">
    <image :src="wxapp_img.open_browser" mode="widthFix" class="mask" />
  </view>
</template>

<script>
export default {
  data() {
    return {
      params: {},
    };
  },
  onLoad(pay) {
    this.params = pay;
  },
  onShow() {
    this.$requestAll.pay.sendPay(this.params, true).then(res => {
      // 非app进入此页面，非公众号环境 跳转支付宝支付地址
      if (!this.$utils.is_webpage()) {
        window.location.href = res.data;
      }
    });
  },
};
</script>

<style lang="scss">
.body {
  width: 100vw;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */

  .mask {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100vw;
    height: 100vh;
    background: #fff;
  }
}
</style>
