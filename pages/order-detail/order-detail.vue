<template>
  <view class="detail-box env-bottom font-28" v-if="order.order_id">
    <!-- 订单状态 -->
    <OrderStatus :order="order"></OrderStatus>

    <view style="margin-top: -134rpx; position: relative" v-if="order.type != 6">
      <!-- 地址信息 -->
      <OrderAddress :order="order"></OrderAddress>

      <!-- 物流信息 -->
      <OrderExpress :order="order" v-if="order.express"></OrderExpress>
    </view>

    <!-- 商品 -->
    <OrderGoods
      :order="order"
      @changeOrderDetail="onChangeOrderDetail"
    ></OrderGoods>

    <!-- 满减赠品 -->
    <GiveGoods
      v-if="order.full_give_goods"
      :showTitle="true"
      :list="[order.full_give_goods]"
    ></GiveGoods>

    <!-- 订单信息 -->
    <!-- <OrderInfo :order="order"></OrderInfo> -->

    <!-- 金额明细 -->
    <OrderPrice :order="order"></OrderPrice>

    <!-- 底部操作按钮 -->
    <BottomButton
      v-if="!user_id"
      :order="order"
      @success="getOrderDetail"
    ></BottomButton>
  </view>
</template>

<script>
import OrderStatus from './components/OrderStatus';
import OrderAddress from './components/OrderAddress';
import OrderExpress from './components/OrderExpress';
import OrderInfo from './components/OrderInfo';
import OrderPrice from './components/OrderPrice';
import OrderGoods from './components/OrderGoods';
import GiveGoods from './components/GiveGoods';
import BottomButton from './components/BottomButton';

export default {
  name: 'OrderDetail',
  components: {
    OrderStatus,
    OrderAddress,
    OrderExpress,
    OrderInfo,
    OrderPrice,
    OrderGoods,
    GiveGoods,
    BottomButton,
  },
  data() {
    return {
      user_id: '',
      order_id: '',
      order: {},
    };
  },
  methods: {
    async getOrderDetail() {
      const res = await this.$requestAll.order.getOrderDetail({
        order_id: this.order_id,
        user_id: this.user_id,
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
    params.user_id && (this.user_id = params.user_id);
  },
  onShow() {
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
