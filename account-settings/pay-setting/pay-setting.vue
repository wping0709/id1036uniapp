<template>
  <view class="body">
    <view
      @click="$utils.toUrl('/account-settings/password-switch/index')"
      class="item flex-y-center flex-x-sb m-b-20"
    >
      <view>免密设置</view>

      <view class="flex-y-center color-999">
        <text>{{ userInfo.is_free_payment ? '已开通' : '未开通' }}</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <view
      @click="switchBoolean('showPasswordPopup')"
      class="item bottom-b flex-y-center flex-x-sb"
    >
      <view>修改支付密码</view>

      <view class="flex-y-center color-999">
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <view
      @click="
        $utils.toUrl('/account-settings/verify-mobile/index?pageType=code')
      "
      class="item flex-y-center flex-x-sb"
    >
      <view>忘记支付密码</view>

      <view class="flex-y-center color-999">
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <Password
      :show.sync="showPasswordPopup"
      @success="passwordSuccess"
      :type="passwordType"
    ></Password>
  </view>
</template>
<script>
import Password from '@/components/pay-password';
export default {
  components: {
    Password,
  },
  data() {
    return {
      showPasswordPopup: false,
      passwordType: 'passReset',
    };
  },
  onLoad(params) {},
  onShow() {
    if (!this.userInfo.is_set_balance_password) {
      this.showPasswordPopup = true;
      this.passwordType = 'reset';
    }
    // setTimeout(() => {
    //   let newUserInfo = JSON.parse(JSON.stringify(this.userInfo));
    //   newUserInfo.is_set_balance_password = 0;
    //   this.$store.commit('user/setUserInfo', newUserInfo);
    //   console.log('成功');
    // }, 1000);
  },
  methods: {
    switchBoolean(key) {
      this[key] = !this[key];
    },
    passwordSuccess() {
      this.$store.dispatch('user/getUserInfo');
      if (this.passwordType == 'reset') {
        this.passwordType = 'passReset';
      }
    },
  },
  computed: {
    userInfo() {
      console.log(this.$store.getters['user/userInfo'],'userInfo');
      return this.$store.getters['user/userInfo'];
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  padding-top: 20rpx;

  .item {
    line-height: 102rpx;
    padding: 0 24rpx;
    background: #fff;
  }
  .bottom-b {
    border-bottom: 1px solid #f8f8f8;
  }
}
</style>
