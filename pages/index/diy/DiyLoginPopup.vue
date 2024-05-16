<template>
  <div class="login-popup">
    <u-popup
      :show="show"
      round="20rpx"
      mode="center"
      @close="onClose"
      :closeable="true"
      :safeAreaInsetBottom="false"
    >
      <div class="login-popup-box">
        <image
          style="width: 100%"
          :src="wxapp_img.diy.login_bg"
          mode="widthFix"
        />
        <view class="font-center p-b-20 font-30">需要您的授权</view>
        <view class="font-center font-24 color-999"
          >为了提供更好的服务，请在前往个人中心登录</view
        >
        <view @click="$utils.toUrl('/pages/user/user')" class="bt"
          >授权登录</view
        >
      </div>
    </u-popup>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClose() {
      this.$emit('update:show', false)
      uni.setStorageSync('isHideLoginPopup', true);
    }
  }
};
</script>

<style lang="scss">
.login-popup-box {
  width: 640rpx;

  .bt {
    width: 300rpx;
    height: 80rpx;
    background-color: #ff4a41;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6rpx;
    margin: 50rpx auto 30rpx;
  }
}
</style>
