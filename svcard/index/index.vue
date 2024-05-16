<template>
  <view class="body">
    <view class="flex price-integral">
      <view class="usm">
        <view class="name">账户余额(元)</view>
        <view class="font-w-600 u-line-1">{{ userInfo.money }}</view>
      </view>
      <view class="usm">
        <view class="name">积分</view>
        <view class="font-w-600 u-line-1">{{ userInfo.integral }}</view>
      </view>
    </view>

    <view class="card-info">
      <view class="card-item">
        <view class="label">账号</view>
        <view class="flex-w-1">{{ userInfo.nickname }}</view>
      </view>
      <view class="card-item">
        <view class="label">卡号</view>
        <view class="flex-w-1">
          <u-input
            v-model="account"
            border="none"
            placeholder="请输入储值卡卡号"
          ></u-input>
        </view>
      </view>
      <view class="card-item">
        <view class="label">密码</view>
        <view class="flex-w-1">
          <u-input
            v-model="password"
            border="none"
            placeholder="请输入密码"
          ></u-input>
        </view>
      </view>
    </view>

    <view class="tip"> 默认为登录用户, 不可编辑 </view>

    <view class="bt" @click="submit">立即充值</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userInfo: "",
      account: "",
      password: "",
    };
  },

  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      let userInfo = uni.getStorageSync("userInfo");
      if (typeof userInfo == "string") {
        this.userInfo = JSON.parse(userInfo);
        return;
      }
      this.userInfo = userInfo;
    },
    async submit() {
      if (!this.account.trim().length || !this.password.trim().length) {
        return this.$utils.toast("请补全内容");
      }
      const formData = {
        code: this.account,
        pwd: this.password,
      };
      const res = await this.$requestAll.svcard.submit(formData, true);
      uni.showModal({
        title: "提示",
        content: `成功兑换${res.type == 1 ? "余额" : "积分"}${res.num}`,
        success: function (res) {
          if (res.confirm) {
            console.log("用户点击确定");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
      // 兑换余额
      if (res.type == 1) {
        this.userInfo.money = (this.userInfo.money - 0 + res.num).toFixed(2);
      } else if (res.type == 2) {
        this.userInfo.integral = this.userInfo.integral - 0 + res.num;
      }
      uni.setStorageSync("userInfo", JSON.stringify(this.userInfo));
    },
  },
  onShow() {},

  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .price-integral {
    padding: 30rpx;
    background: #fb2020;
    color: #fff;
    .usm {
      flex: 1;
      font-size: 60rpx;
      .name {
        margin-bottom: 20rpx;
        opacity: 0.8;
        font-size: 30rpx;
      }
    }
  }
  .card-info {
    padding: 0 30rpx;
    background: #fff;
    .card-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 100rpx;
      border-bottom: 2rpx solid #eee;
      &:nth-last-child(1) {
        border: 0;
      }
      .label {
        width: 120rpx;
        text-align: center;
      }
    }
  }

  .tip {
    line-height: 100rpx;
    padding: 0 30rpx;
    font-size: 24rpx;
    color: #999;
  }
  .bt {
    margin: 0 auto;
    width: 686rpx;
    height: 88rpx;
    color: #fff;
    background-color: #fb2020;
    border-radius: 44rpx;
    margin-top: 52rpx;
    line-height: 88rpx;
    text-align: center;
  }
}
</style>
