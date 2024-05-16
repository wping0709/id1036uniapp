<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <view class="money-box">
      <view class="title p-l-20">我的账户</view>
      <view
        :style="{
          background:
            'url(' + wxapp_img.icon_balance_recharge_bg + ') center no-repeat',
          backgroundSize: '100% 100%',
        }"
        class="money-content flex-y-center flex-x-sb"
      >
        <view class="flex-y-center">
          <image
            :src="wxapp_img.icon_balance_recharge"
            mode="aspectFill"
            class="m-r-20"
            style="width: 80rpx; height: 80rpx"
          />
          <view>余额</view>
        </view>
        <view>￥{{ money }}</view>
      </view>
    </view>

    <view class="recharge-list">
      <view class="title p-l-20">充值金额</view>
      <view class="recharge-box">
        <view
          v-for="(item, index) in pageData.list"
          :key="index"
          :class="[checkIndex == index && 'check']"
          @click="checkIndex = index"
          class="recharge-item flex-col flex-y-center flex-x-center"
        >
          <view class="font-30 u-line-1">{{ item.pay_price }}</view>
          <view class="m-t-10 u-line-1 font-24 color-999"
            >送{{ item.send_price }}</view
          >
        </view>
      </view>
      <view class="input-box">
        <u-input
          @focus="checkIndex = -1"
          v-model="value"
          placeholder="手动输入充值金额"
        ></u-input>
      </view>
      <view @click="submitPay" class="submit-bt">立即充值</view>
    </view>

    <view style="margin-top: 100rpx">
      <view class="title p-l-20">充值说明</view>
      <view class="m-y-30">{{ pageData.balance.help || '暂无说明' }}</view>
    </view>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import OrderPay from '@/mixins/OrderPay.js';
export default {
  mixins: [OrderPay],
  data() {
    return {
      pageData: '',
      money: 0,
      checkIndex: 0,
      value: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      uni.showLoading({
        title: '加载中',
      });
      const { data } = await this.$requestAll.recharge.index({});
      this.money = data.money;
      const res = await this.$requestAll.recharge.list({});
      this.pageData = res.data;
      uni.hideLoading();
    },
    submitPay() {
      const list = this.pageData.list;
      const checkIndex = this.checkIndex;
      if (checkIndex != -1) {
        const formData = {
          pay_price: list[checkIndex].pay_price,
          send_price: list[checkIndex].send_price,
          pay_type: 'WECHAT_PAY',
        };
        this.orderSubmit(formData, 'recharge');
      } else {
        const formData = {
          pay_price: this.value,
          send_price: 0,
          pay_type: 'WECHAT_PAY',
        };
        this.orderSubmit(formData, 'recharge');
      }
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
  padding: 30rpx 20rpx;
}
.title {
  font-size: 30rpx;
  line-height: 30rpx;
  color: #666;
  border-left: 6rpx solid red;
}

.money-content {
  margin: 30rpx 0;

  height: 160rpx;
  padding: 0 40rpx;
  font-size: 44rpx;
  color: #666;
}
.recharge-list {
  .recharge-box {
    display: flex;
    flex-wrap: wrap;
    .recharge-item {
      margin: 30rpx 0;
      border-radius: 10rpx;
      border: 1px solid #eee;
      width: 30%;
      height: 120rpx;
      text-align: center;
      &:nth-child(3n + 2) {
        margin-left: 32rpx;
        margin-right: 32rpx;
      }
    }
    .check {
      color: red;
      border-color: red;
      background: #fff6f6;
      > view {
        color: red;
      }
    }
  }

  .submit-bt {
    height: 96rpx;
    margin: 56rpx 12rpx 0 12rpx;
    border-radius: 48rpx;
    background-color: #ff4544;
    color: #fff;
    font-size: 32rpx;
    line-height: 96rpx;
    text-align: center;
  }
}
</style>
