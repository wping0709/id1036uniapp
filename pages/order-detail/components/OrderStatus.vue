<template>
  <view :class="type != 'pt' && order.type == 6 ? 'order-status-6' : 'order-status'">
    <template v-if="type == 'pt'">
      <div class="status-bar">
        <!-- <image :src="wxapp_img.order.img_order_status_bar" /> -->
        <div class="d1">{{ order.status_name }}</div>
        <div
          class="d2"
          v-if="
            order.status == 3 && order.is_send == 0 && order.apply_delete == 0
          "
        >
          请等待发货
        </div>
        <div class="d2" v-if="order.apply_delete == 1 && order.status == 1">
          取消申请中
        </div>
        <div
          class="d2"
          v-if="
            order.status == 3 && order.is_send == 1 && order.is_confirm == 0
          "
        >
          订单已发货
        </div>
        <div
          class="d2"
          v-if="
            order.status == 3 && order.is_send == 1 && order.is_confirm == 1
          "
        >
          订单已完成
        </div>
        <div class="d2" v-if="order.apply_delete == 1 && order.status == 3">
          已申请售后
        </div>
        <div
          class="d2"
          v-if="
            order.apply_delete == 2 && order.status == 3 && order.is_send == 0
          "
        >
          取消申请中
        </div>
        <div class="d2 flex-y-center flex-x-center" v-if="order.status == 2 && countDown > 0">
          <u-count-down :time="countDown" format="HH:mm:ss"></u-count-down>
          <text>后自动取消订单</text>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="status-bar">
        <!-- <image :src="wxapp_img.order.img_order_status_bar" /> -->
        <view class="d1 flex-x-center flex-y-center" v-if="order.is_order_food==0">
          <text
            v-if="
              order.status == '订单未付款' ||
              order.status == '订单待发货' ||
              order.status == '订单已发货'
            "
            class="iconfont icon-clock"
          ></text>
          <text
            v-else-if="order.status == '订单已完成'"
            class="iconfont icon-success"
          ></text>

          <text class="">{{ order.status }}</text>
        </view>
		
		
		<view class="d1 flex-x-center flex-y-center" v-if="order.is_order_food==1">
		  <text
		    class="iconfont icon-clock"
		  ></text>
		  <text class="">取餐号: A{{order.running_number}}</text>
		</view>
	
		
      </div>
    </template>
  </view>
</template>

<script>
export default {
  name: 'OrderStatus',
  props: {
    order: Object,
    type: {
      type: String,
      default: '',
    },
  },
  computed: {
    countDown() {
      if (this.order.limit_time) {
        let ss = this.order.limit_time.days * 24 * 60 * 60 * 1000;
        ss += this.order.limit_time.hours * 60 * 60 * 1000;
        ss += this.order.limit_time.mins * 60 * 1000;
        ss += this.order.limit_time.secs * 1000;
        return ss;
      }
      return 0;
    },
  },
  data() {
    return {};
  },
  created() {},
};
</script>

<style lang="scss" scope>
.order-status {
  position: relative;
  background: #ff1b22;
  padding-bottom: 134rpx;
  text-align: center;
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 134rpx;
    background: linear-gradient(180deg, #ff1b22 0%, #f2f2f2 100%);
  }
}
.order-status-6 {
  position: relative;
  background: #ff1b22;
  text-align: center;
}
.status-bar {
  position: relative;
  overflow: hidden;

  .d1 {
    margin-bottom: 26rpx;
    font-size: 40rpx;
    font-weight: 700;
    color: #fff;
    .iconfont {
      width: 70rpx;
      text-align: center;
      font-weight: 400;
      font-size: 50rpx;
    }
  }
  .d2 {
    line-height: 40rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #ffffff;
    margin-bottom: 32rpx;
  }
}
</style>
