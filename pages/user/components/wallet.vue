<template>
  <view class="wallet-box">
    <view @click="$utils.toUrl('')" class="wallet-item">
      <view>
        <image :src="pageData.wallets.status_2.icon" mode="aspectFit" />
      </view>
      <view>{{ pageData.wallets.status_2.text }}</view>
    </view>

    <!-- <view class="wallet-item">
      <view class="font-600-30"> {{ pageData.user_info.save_money }} </view>
      <view class="flex-y-center flex-x-center">
        <image :src="pageData.wallets.status_1.icon" mode="aspectFit" />
        省钱
      </view>
    </view> -->
    <view
      v-if="pageData.wallet.integral == 1"
      @click="$utils.toUrl('/integral-mall/index/index')"
      class="wallet-item"
    >
      <view class="font-600-30"> {{ pageData.user_info.integral }} </view>
      <view class="flex-y-center flex-x-center">
        <image :src="pageData.wallets.status_0.icon" mode="aspectFit" />
        {{ pageData.wallets.status_0.text }}
      </view>
    </view>
    <!-- 余额 -->
    <view
      v-if="pageData.wallet.re == 1"
      @click="$utils.toUrl('/account-settings/balance/balance')"
      class="wallet-item"
    >
      <view class="font-600-30"> {{ pageData.user_info.money }} </view>
      <view class="flex-y-center flex-x-center">
        <image :src="pageData.wallets.status_1.icon" mode="aspectFit" />
        {{ pageData.wallets.status_1.text }}
      </view>
    </view>
    <view
      v-if="pageData.wallet.is_redSubsidy == 1"
      @click="$utils.toUrl('/pages/subsidy/index')"
      class="wallet-item"
    >
      <view class="font-600-30"> {{ pageData.user_info.redSubsidy }} </view>
      <view class="flex-y-center flex-x-center">
        <image :src="pageData.wallets.status_3.icon" mode="aspectFit" />
        {{ pageData.wallets.status_3.text }}
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    pageData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.wallet-box {
  background: #fff;
  display: flex;
  justify-content: space-around;
  padding: 15rpx 0;
  .wallet-item {
    width: 25%;
    text-align: center;
    > view:nth-child(1) {
      height: 48rpx;
      line-height: 48rpx;
      color: #ffc143;
      > image {
        width: 48rpx;
        height: 48rpx;
      }
    }
    > view:nth-child(2) {
      margin-top: 15rpx;
      font-size: 26rpx;
      > image {
        width: 26rpx;
        height: 26rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
