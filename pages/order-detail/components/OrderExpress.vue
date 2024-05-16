<template>
  <view
    class="block flex-y-center"
    @click="
      $utils.toUrl('/pages/express-detail/express-detail?id=' + order.order_id)
    "
    v-if="order.express_no && order.is_send == 1"
  >
    <div class="flex-w-1">
      <div style="margin-bottom: 20rpx">快递公司：{{ order.express }}</div>
      <div>快递单号：{{ order.express_no }}</div>
    </div>
    <div class="iconfont icon-arrow-right"></div>
  </view>
</template>

<script>
export default {
  name: 'OrderExpress',
  props: {
    order: Object,
  },
  data() {
    return {};
  },
  methods: {},
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
.block-row {
  margin-bottom: 6 * 2rpx;
}

.block-row .row-fr button {
  line-height: 20 * 2rpx;
  height: 22 * 2rpx;
  font-size: 12 * 2rpx;
  color: #888;
  border: 1 * 2rpx solid #ddd;
  border-radius: 3 * 2rpx;
  padding: 0 6 * 2rpx;
  background-color: #fff !important;
  box-shadow: none;
  outline: none;
}
</style>
