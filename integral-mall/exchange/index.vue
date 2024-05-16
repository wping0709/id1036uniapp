<template>
  <view class="body">

    <view v-if="pageData.coupon.length">
      <view
        @click="$utils.toUrl('/pages/coupon/coupon')"
        v-for="(item, i1) in pageData.coupon"
        :key="i1"
      >
        <view class="item flex-x-sb flex-y-center">
          <view class="flex-w-1 flex-col flex-x-sb" style="height: 100%">
            <view class="m-b-20 u-line-1"
              >{{ item.coupon.name }} 满{{ item.coupon.min_price }}元可用</view
            >
            <view class="price-color">
              {{ item.integral }}积分
              <span v-if="item.price > 0"> +{{ item.price }} </span>
            </view>
          </view>
          <view class="bt">我的优惠券</view>
        </view>
      </view>
    </view>
    <view v-if="pageData.list.length">
      <view
        @click="
          $utils.toUrl(
            '/integral-mall/clerk/clerk?id=' +
              item.order.order_no +
              '&type=exchange'
          )
        "
        v-for="(item, i2) in pageData.list"
        :key="i2"
      >
        <view class="item flex-x-sb flex-y-center">
          <view style="width: 100rpx; height: 100rpx">
            <u-image
              width="100rpx"
              height="100rpx"
              :src="item.pic"
              mode="aspectFill"
            />
          </view>
          <view
            class="flex-w-1 m-x-20 p-x-20 flex-col flex-x-sb"
            style="height: 100%"
          >
            <view class="m-b-20 u-line-1">{{ item.goods_name }}</view>
            <view class="price-color">
              {{ item.pay_integral }}积分
              <span v-if="item.total_price > 0"> +{{ item.total_price }} </span>
            </view>
          </view>
          <view class="bt">订单详情</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        page: 1,
        list: [],
        coupon: [],
        isBottom: false,
      },
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageData.isBottom) return;
      const res = await this.$requestAll.integralmall.exchange(
        {
          page: this.pageData.page,
        },
        true
      );
      this.pageData.list = res.data.list[0].goodsDetail;

      var coupon = res.data.list[0].userCoupon;
      var ts = Math.round(new Date().getTime() / 1000).toString();
      console.log(coupon, 'coupon');
      coupon = coupon.filter(item => {
        if (item.end_time < ts) {
          item.status = 2;
        } else {
          item.status = 1;
        }
        if (item.is_use == 1) {
          item.status = 1;
        }
        return item;
      });
      this.pageData.coupon = coupon;
    },
    // 触底
    scrolltolower() {
      console.log('触底了');
      this.pageData.page++;
      this.loadData();
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
$price-color: red;
.body {
  background: #f5f5f5;
  .item {
    padding: 20rpx 30rpx;
    border-bottom: 2rpx solid #e2e2e2;
    .bt {
      border-radius: 30rpx;
      color: $price-color;
      border: 2rpx solid $price-color;
      padding: 10rpx 20rpx;
    }
  }
}
</style>
