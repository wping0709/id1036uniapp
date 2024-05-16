<template>
  <view v-if="pageData" class="body">
    <view class="header">
      <div class="header_1">
        <div class="header_1_1">
          <image
            :src="pageData.user.avatar_url"
            style="width: 100rpx; height: 100rpx; border-radius: 50%"
            mode="scaleToFill"
          />

          <view>{{ pageData.user.nickname }}</view>
          <view>发起了代付请求！</view>
        </div>
      </div>
      <view class="font-w-600 font-center font-32" style="line-height: 100rpx"
        >代付金额：￥
        <text class="font-40">{{ pageData.pay_price }}</text>
      </view>

      <view @click="submitPay" class="pay-button">为好友买单</view>
    </view>

    <div class="order-info m-20 bg-fff p-30 font-32">
      <view class="font-38 font-w-600">订单信息</view>
      <view class="m-y-10">订单编号：{{ pageData.order_no }}</view>
      <view class="">下单时间：{{ pageData.addtime }}</view>
    </div>

    <div class="goods-info m-20 bg-fff p-30 font-32">
      <view class="font-38 font-w-600">商品信息</view>
      <GoodsList :goodsList="goodsList"></GoodsList>
    </div>

    <Share></Share>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import GoodsList from '@/pages/order/components/GoodsList.vue';
import Share from '@/components/share/share';
import share from '@/mixins/share.js'
export default {
  components: {
    GoodsList,
    Share,
  },
  mixins: [share],
  data() {
    return {
      _platform: '',
      params: {},
      pageData: '',
    };
  },
  onLoad(params) {
    this.params = {
      order_id: params.id,
      user_id: params.user_id,
    };


    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.order.getOrderDetail(
        this.params,
        true
      );
      this.pageData = res.data;
    },
    submitPay() {
      // 支付
      this.$utils.toUrl(
        '/pages/pay/pay' +
          uni.$u.queryParams({
            order_id: this.params.order_id,
            order_type: 0,
          })
      );
    },
  },
  computed: {
    shareData() {
      return {
        title: '有一笔订单请你帮我付！',
        imageUrl: '',
        path:
          '/pages/order-share/order-share' +
          uni.$u.queryParams({
            id: this.params.order_id,
            user_id: this.params.user_id,
            store_id: this.$store.getters['currentStore'].id,
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
    goodsList() {
      if (this.pageData && this.pageData.goods_list) {
        return this.pageData.goods_list.map(goods => {
          return {
            goods_pic: goods.goods_pic,
            goods_name: goods.name,
            attr_list: goods.attr,
            num: goods.num,
            price: goods.total_price,
          };
        });
      }
      return [];
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  .header {
    width: 95%;
    margin: 100rpx auto 0;
    background: #fff;
    border-radius: 10 * 2rpx 10 * 2rpx 5 * 2rpx 5 * 2rpx;
    .header_1 {
      height: 100 * 2rpx;
      background: red;
      border-radius: 10 * 2rpx 10 * 2rpx 0 0;
      position: relative;
      .header_1_1 {
        text-align: center;
        position: relative;
        top: -25 * 2rpx;
        color: #fff;
        line-height: 28 * 2rpx;
        font-size: 32rpx;
      }
    }
    .pay-button {
      width: 90%;
      margin: auto;
      height: 40 * 2rpx;
      text-align: center;
      background: red;
      line-height: 40 * 2rpx;
      color: #fff;
      border-radius: 8 * 2rpx;
    }
  }

  .order-info {
    border-radius: 20rpx;
  }
}
</style>
