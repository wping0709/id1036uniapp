<template>
  <view class="order-box">
    <view class="flex-x-sb title p-x-24">
      <div class="font-30">我的订单</div>
      <div
        class="font-26 color-999 flex-y-center"
        @click="$utils.toUrl('/order/index/index')"
      >
        <div>全部</div>
        <div class="iconfont icon-arrow-right font-30"></div>
      </div>
    </view>
    <view class="content flex-y-center">
      <!-- 待付款 -->
      <view
        @click="$utils.toUrl('/pages/order/order?status=0')"
        class="item flex-col flex-y-center flex-x-center"
      >
        <image :src="pageData.orders.status_0.icon" mode="aspectFit" />
        <view>{{ pageData.orders.status_0.text }}</view>
        <!-- 订单数量 -->
        <view
          class="order-num"
          v-show="
            pageData.order_count.status_0 && pageData.order_count.status_0 > 0
          "
          >{{ pageData.order_count.status_0 }}</view
        >
      </view>

      <!-- 待发货 -->
      <view
        @click="$utils.toUrl('/pages/order/order?status=1')"
        class="item flex-col flex-y-center flex-x-center"
      >
        <image :src="pageData.orders.status_1.icon" mode="aspectFit" />
        <view>{{ pageData.orders.status_1.text }}</view>
        <!-- 订单数量 -->
        <view
          class="order-num"
          v-show="
            pageData.order_count.status_1 && pageData.order_count.status_1 > 0
          "
          >{{ pageData.order_count.status_1 }}</view
        >
      </view>

      <!-- 待收货 -->
      <view
        @click="$utils.toUrl('/pages/order/order?status=2')"
        class="item flex-col flex-y-center flex-x-center"
      >
        <image :src="pageData.orders.status_2.icon" mode="aspectFit" />
        <view>{{ pageData.orders.status_2.text }}</view>
        <!-- 订单数量 -->
        <view
          class="order-num"
          v-show="
            pageData.order_count.status_2 && pageData.order_count.status_2 > 0
          "
          >{{ pageData.order_count.status_2 }}</view
        >
      </view>

      <!-- 已完成 -->
      <view
        @click="$utils.toUrl('/pages/order/order?status=3')"
        class="item flex-col flex-y-center flex-x-center"
      >
        <image :src="pageData.orders.status_3.icon" mode="aspectFit" />
        <view>{{ pageData.orders.status_3.text }}</view>
        <!-- 订单数量 -->
        <!-- 	<view class="order-num" v-show="
            pageData.order_count.status_3 && pageData.order_count.status_3 > 0
          ">{{ pageData.order_count.status_3 }}</view> -->
      </view>

      <!-- 售后 -->
      <view
        @click="$utils.toUrl('/pages/order/order?status=4')"
        class="item flex-col flex-y-center flex-x-center"
      >
        <image :src="pageData.orders.status_4.icon" mode="aspectFit" />
        <view>{{ pageData.orders.status_4.text }}</view>
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
.order-box {
  margin: 20rpx 0;
  font-size: 26rpx;
  background: #fff;

  .title {
    line-height: 88rpx;
    padding: 0 24rpx;
    border-bottom: 2rpx solid #f5f5f5;
  }

  .content {
    padding: 15rpx 0;
    justify-content: space-around;
  }

  .item {
    width: 20%;
    position: relative;

    > image {
      width: 50rpx;
      height: 50rpx;
    }

    > view:nth-child(2) {
      margin-top: 15rpx;
    }

    .order-num {
      position: absolute;
      right: 20rpx;
      top: -10rpx;
      font-size: 20rpx;
      color: #fff;
      width: 30rpx;
      height: 30rpx;
      line-height: 30rpx;
      text-align: center;
      border-radius: 50%;
      background: #ff0000;
    }
  }
}
</style>
