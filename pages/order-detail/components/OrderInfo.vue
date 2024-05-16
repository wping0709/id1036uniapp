<template>
  <div>
    <div class="block">
      <div v-if="order.order_sort">编号: #{{ order.order_sort }}</div>
      <div class="flex-x-sb flex-y-center" style="margin-bottom: 20rpx">
        <div class="row-fl">订单编号：{{ order.order_no }}</div>
        <div @click="$utils.copy(order.order_no)" class="copy">复制</div>
      </div>
      <div style="margin-bottom: 20rpx" v-if="order.peisong_text">
        配送状态：{{ order.peisong_text }}
      </div>
      <div>下单时间：{{ order.addtime }}</div>
      <div v-if="order.pay_type_text" class="pay-type">
        {{ order.pay_type_text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderInfo',
  props: {
    order: Object,
  },
  data() {
    return {
      message: '',
    };
  },
};
</script>

<style lang="scss" scoped>
.block {
  background: #fff;
  padding: 24rpx;
  margin: 20rpx 24rpx;
  line-height: 36rpx;
  border-radius: 20rpx;
}

.pay-type {
  width: 100%;
  padding: 16 * 2rpx 0 4 * 2rpx 0;
  border-top: 1 * 2rpx solid #eee;
  margin-top: 16 * 2rpx;
}
.block-footer {
  border-top: 1 * 2rpx solid #eee;
  margin-left: -12 * 2rpx;
  margin-right: -12 * 2rpx;
  padding: 12 * 2rpx;
  padding-bottom: 0;
  margin-top: 16 * 2rpx;
  text-align: right;
  font-weight: bold;
}
.block-footer span {
  color: #ff4544;
}

.copy {
  padding: 2rpx 20rpx;
  border: 2rpx solid #999;
  border-radius: 10rpx;
  font-size: 24rpx;
}
</style>
