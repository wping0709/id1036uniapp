<template>
  <view v-if="order" class="detail-box">
    <OrderStatus :order="order"></OrderStatus>
    <view style="margin-top: -134rpx; position: relative">
      <!-- 地址信息 -->
      <OrderAddress :order="order"></OrderAddress>
      <!-- 物流信息 -->
      <OrderExpress :order="order" v-if="order.express"></OrderExpress>
    </view>

    <!-- 商品 -->
    <OrderGoods
      :order="order"
      @changeOrderDetail="onChangeOrderDetail"
      type="miaosha"
    ></OrderGoods>

    <!-- 满减赠品 -->
    <GiveGoods
      v-if="order.full_give_goods"
      :list="[order.full_give_goods]"
    ></GiveGoods>

    <!-- 订单信息 -->
    <!-- <OrderInfo :order="order"></OrderInfo> -->

    <!-- 金额明细 -->
    <OrderPrice :order="order"></OrderPrice>


    <!-- 底部操作按钮 -->
    <BottomButton
      type="miaosha"
      :order="order"
      @success="loadData"
    ></BottomButton>
  </view>
</template>
<script>
import OrderStatus from '@/pages/order-detail/components/OrderStatus.vue';
import OrderExpress from '@/pages/order-detail/components/OrderExpress.vue';
import OrderAddress from '@/pages/order-detail/components/OrderAddress.vue';
import OrderInfo from '@/pages/order-detail/components/OrderInfo.vue';
import OrderPrice from '@/pages/order-detail/components/OrderPrice';
import OrderGoods from '@/pages/order-detail/components/OrderGoods';
import GiveGoods from '@/pages/order-detail/components/GiveGoods';
import BottomButton from '@/pages/order-detail/components/BottomButton';
export default {
  components: {
    OrderStatus,
    OrderExpress,
    OrderAddress,
    OrderInfo,
    OrderPrice,
    OrderGoods,
    GiveGoods,
    BottomButton,
  },
  data() {
    return {
      order: '',
      order_id: '',
    };
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
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.miaosha.orderDetail({
        order_id: this.order_id,
      });
      this.order = res.data;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.detail-box {
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
}
</style>
