<template>
  <view class="detail-box env-bottom font-28" v-if="order.order_id">
    <!-- 订单状态 -->
    <OrderStatus :order="order"></OrderStatus>

    <view style="margin-top: -134rpx; position: relative">
      <!-- 地址信息 -->
      <OrderAddress :order="order"></OrderAddress>
      <!-- 物流信息 -->
      <OrderExpress :order="order" v-if="order.express"></OrderExpress>
    </view>

    <!-- 商品 -->
    <OrderGoods
      type="admin"
      :order="order"
      @changeOrderDetail="onChangeOrderDetail"
    ></OrderGoods>

    <!-- 满减赠品 -->
    <GiveGoods
      :showTitle="true"
      v-if="order.full_give_goods"
      :list="[order.full_give_goods]"
    ></GiveGoods>

    <!-- 订单信息 -->
    <!-- <OrderInfo :order="order"></OrderInfo> -->

    <!-- 金额明细 -->
    <OrderPrice :order="order"></OrderPrice>

    <!-- 底部操作按钮 -->
    <BottomButton :order="order" @success="getOrderDetail"></BottomButton>
  </view>
</template>

<script>
import OrderStatus from '@/pages/order-detail/components/OrderStatus';
import OrderAddress from '@/pages/order-detail/components/OrderAddress';
import OrderExpress from '@/pages/order-detail/components/OrderExpress';
import OrderPrice from '@/pages/order-detail/components/OrderPrice';
import OrderGoods from '@/pages/order-detail/components/OrderGoods';
import GiveGoods from '@/pages/order-detail/components/GiveGoods';
import BottomButton from './components/BottomButton';

export default {
  name: 'OrderDetail',
  components: {
    OrderStatus,
    OrderAddress,
    OrderExpress,
    OrderPrice,
    OrderGoods,
    GiveGoods,
    BottomButton,
  },
  data() {
    return {
      order_id: '',
      status: 1,
      order: {},
    };
  },
  methods: {
    async getOrderDetail() {
      const res = await this.$requestAll.admin.orderDetail({
        order_id: this.order_id,
      });
      this.order = res.data;
    },
  },
  onLoad(params) {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff1b22',
      animation: {
        duration: 400,
        timingFunc: 'easeIn',
      },
    });
    this.order_id = params.id;
    this.status = params.status;
    this.getOrderDetail();
  },
};
</script>

<style lang="less" scoped>
.detail-box {
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
}
</style>
