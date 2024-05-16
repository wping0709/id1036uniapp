<template>
  <view>
    <u-popup
      :show="show"
      :safeAreaInsetBottom="true"
      mode="bottom"
      round="20rpx"
    >
      <view>
        <view class="title p-y-20 font-center font-w-700 font-30"
          >同步微信信息</view
        >
        <view class="content flex-y-center flex-x-center p-y-20">
          <button
            open-type="login"
            @click="getuserinfo"
            class="button-initial flex-col flex-x-center flex-y-center"
          >
            <text
              style="background: #07c160"
              class="iconfont icon-wechat"
            ></text>
            <text class="m-t-10 font-24 color-999">微信授权</text>
          </button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import siteinfo from '@/siteinfo.js';
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    async getuserinfo() {
      /* #ifdef MP-WEIXIN */
      wx.getUserProfile({
        desc: '用户完善会员资料',
        success: async userInfo => {
          const loginData = await wx.login();
          if (loginData.errMsg !== 'login:ok')
            return this.$utils.toast(loginData.errMsg);
          // 服务发起登录
          const param = {
            code: loginData.code,
            user_info: userInfo.rawData,
            encrypted_data: userInfo.encryptedData,
            iv: userInfo.iv,
            signature: userInfo.signature,
          };
          const result = await this.$requestAll.login.wxLogin(param, true);
          // 设置缓存
          this.$store.commit('login/login', result.data);
          this.$emit('update:show', false);
          this.$emit('success');
        },
      });

      /* #endif */

      /* #ifdef H5 */
      if (this.$utils.is_webpage()) {
        // siteinfo.apiroot
        let store_id =
          (this.$store.getters['currentStore'].id || '') ||
          1;
        window.location.href = `${siteinfo.apiroot}${uni.$u.queryParams({
          _platform: 'h5',
          store_id: store_id,
          user_id:
            this.$store.getters['user/userInfo'] &&
            this.$store.getters['user/userInfo'].id,
          r: 'mobile/passport/wx-login',
        })}`;
      }

      /* #endif */
    },
  },
};
</script>

<style lang="scss">
button {
  > .iconfont {
    width: 96rpx;
    line-height: 96rpx;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    font-size: 44rpx;
  }
}
</style>
