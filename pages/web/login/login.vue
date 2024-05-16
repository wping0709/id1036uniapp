<template>
  <view class="body flex-col flex-y-center">
    <image
      :src="wxapp_img.img_pc_login"
      style="width: 400rpx"
      mode="widthFix"
    />

    <view class="m-t-50">即将登录网页端，是否允许登录？</view>

    <view class="submit-bt" @click="submitLogin">允许登录</view>

    <view class="color-666" @click="$utils.backTo()">取消</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      token: '',
    };
  },
  onLoad(params) {
    this.token = params.scene;
  },
  methods: {
    async submitLogin() {
      const res = await this.$requestAll.user.webLogin(
        { token: this.token },
        true
      );
      uni.showModal({
        content: res.msg,
        showCancel: false,
        success: ({confirm}) => {
         confirm && this.$utils.backTo();
        }
      });
    },
  },
};
</script>

<style lang="scss">
.body {
  padding-top: 100rpx;
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  // height: calc(100vh - 44px);
  min-height: calc(100vh - 44px);
  /* #endif */

  .submit-bt {
    margin-top: 50rpx;
    margin-bottom: 30rpx;
    width: 600rpx;
    border-radius: 20rpx;
    background: #ec554e;
    font-size: 30rpx;
    text-align: center;
    line-height: 80rpx;
    color: #fff;
  }
}
</style>
