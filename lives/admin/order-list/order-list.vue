<template>
  <view class="body flex-col">
    <view class="bg-fff">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view
      @scrolltolower="scrolltolower"
      scroll-y
      class="content flex-h-1"
    >
      <view class="scroll-box" v-if="list.length">
        <div class="order-box">
          <div class="order-item" v-for="order in list" :key="order.id">
            <div class="mch-title">
              <div>
                {{ order.mch.name }}
              </div>
              <div class="flex-x-sb flex-y-center color-999">
                <text>订单号：{{ order.order_no }}</text>
                <text>{{ order.addtime }}</text>
              </div>
            </div>

            <GoodsList :goodsList="order.goods_list"></GoodsList>

            <div class="order-total flex-y-center flex-x-sb">
              <text>合计：￥{{ order.pay_price }}</text>
              <text>未结算佣金：￥{{ order.price }}</text>
            </div>
          </div>
        </div>
        <u-loadmore :status="more"></u-loadmore>
      </view>
      <view class="scroll-box" v-else>
        <u-empty
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import GoodsList from '@/pages/order/components/GoodsList'
export default {
  components: {
    GoodsList
  },
  data() {
    return {
      list1: [
        {
          name: '待付款',
        },
        {
          name: '待发货',
        },
        {
          name: '待收货',
        },
        {
          name: '已完成',
        },
      ],
      list: [],
      status: 0,
      page: 1,
      more: 'loadmore',
      anchor_id: 0,
    };
  },
  onLoad(params) {
    this.anchor_id = params.anchor_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.more == 'nomore') return;
      const res = await this.$requestAll.lives.getOrderList(
        {
          status: this.status,
          page: this.page,
          anchor_id: this.anchor_id,
        },
        true
      );
      this.list.push(...res.data.list);
      this.more = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.page++;
    },
    clickTab({ index }) {
      this.status = index;
      this.resetPageData();
      this.loadData();
    },
    scrolltolower() {
      this.page++;
      this.loadData();
    },
    resetPageData() {
      this.list = this.$options.data().list;
      this.page = this.$options.data().page;
      this.more = this.$options.data().more;
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
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
.order-box {
  .order-item {
    margin: 20rpx;
    border-radius: 20rpx;
    background: #fff;
    padding: 0 20rpx;
    .mch-title {
      font-size: 24rpx;
      padding:  20rpx 0;
      line-height: 1.8;
      border-bottom: 1px solid #f5f5f5;
    }

    .order-total {
      font-size: 30rpx;
      padding: 20rpx 0;
      line-height: 1.8;
    }
  }
}
</style>
