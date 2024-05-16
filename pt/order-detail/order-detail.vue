<template>
  <view v-if="order" class="body">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <OrderStatus :order="order" type="pt"></OrderStatus>
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
      type="pt"
    ></OrderGoods>

    <!-- 满减赠品 -->
    <GiveGoods
      :showTitle="true"
      v-if="order.full_give_goods"
      :list="[order.full_give_goods]"
    ></GiveGoods>

    <!-- 金额明细 -->
    <OrderPrice :order="order"></OrderPrice>

    <!-- 底部操作按钮 -->
    <BottomButton type="pt" :order="order" @success="loadData"></BottomButton>
  </view>
</template>
<script>
import OrderStatus from '@/pages/order-detail/components/OrderStatus.vue';
import OrderExpress from '@/pages/order-detail/components/OrderExpress.vue';
import OrderAddress from '@/pages/order-detail/components/OrderAddress.vue';
import OrderPrice from '@/pages/order-detail/components/OrderPrice';
import OrderGoods from '@/pages/order-detail/components/OrderGoods';
import GiveGoods from '@/pages/order-detail/components/GiveGoods';
import BottomButton from '@/pages/order-detail/components/BottomButton';
export default {
  components: {
    OrderStatus,
    OrderExpress,
    OrderAddress,
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
      const res = await this.$requestAll.group.orderDetail({
        order_id: this.order_id,
      });
      this.order = res.data;
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .diy_header{
  	padding: 25rpx;
  	background-color: #ffffff;
  }
}
</style>
