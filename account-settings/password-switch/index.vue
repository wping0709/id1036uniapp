<template>
  <view class="body">
    <view class="item flex-y-center flex-x-sb">
      <view>免密设置</view>

      <view class="flex-y-center color-999">
        <u-switch
          :value="userInfo.is_free_payment"
          asyncChange
          activeColor="#ff1c24"
          :activeValue="1"
          :inactiveValue="0"
          size="25"
          @change="asyncChange"
        ></u-switch>
      </view>
    </view>

    <Password :show.sync="showPasswordPopup" @success="passwordSuccess" type="pass"></Password>
  </view>
</template>
<script>
import Password from '@/components/pay-password'
export default {
  components: {
    Password
  },
  data() {
    return {
      isPasswordSuccess:false,
      showPasswordPopup: false,
    };
  },
  onLoad(params) {},
  onShow() {},
  methods: {
    async asyncChange(e) {
      let status = Number(!this.userInfo.is_free_payment);
      if(!this.isPasswordSuccess && e) {
        this.showPasswordPopup = true
        return
      }
      const res = await this.$requestAll.pay.changeFreePayment(
        {
          status,
        },
        true
      );
      let userInfo = Object.assign(this.userInfo, { is_free_payment: status });
      this.$store.commit('user/setUserInfo', userInfo);
      console.log(res);
    },
    passwordSuccess() {
      this.isPasswordSuccess = true
      this.asyncChange(!this.userInfo.is_free_payment)
    }
  },
  computed: {
    userInfo() {
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
}
</style>
