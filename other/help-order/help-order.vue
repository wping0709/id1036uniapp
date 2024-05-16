<template>
  <view v-if="pageData" class="body">
    <view v-if="pageData.list.length" class="conent-box">
      <view
        @click="clickOrder(item)"
        v-for="(item, index) in pageData.list"
        :key="index"
        class="order-item"
      >
        <view @click.stop class="order-title">
          <view v-if="tabsIndex != 4" class="flex-y-center flex-x-sb">
            <view class="flex-w-1">{{ item.mch.name }}</view>
            <view>{{ item.status_text }}</view>
          </view>
          <view class="flex-x-sb flex-y-center">
            <span class="u-line-1" style="width: 0; flex: 1"
              >订单号：{{ item.order_no }}</span
            >
            <span>{{ item.addtime }}</span>
          </view>
        </view>

        <!-- 商品属性 -->
        <view>
          <GoodsList :goodsList="item.goods_list"></GoodsList>
        </view>

        <!-- button -->
        <view class="total-button flex-y-center">
          <view class="total font-28"> 合计：￥{{ item.pay_price }} </view>
          <view @click.stop class="button-box flex-y-center">
            下单人：
            <image
              :src="item.user_info.avatar_url"
              mode="aspectFill"
              style="width: 40rpx; height: 40rpx; border-radius: 50%"
            />
            <text class="m-l-20">{{ item.user_info.nickname }}</text>
          </view>
        </view>
      </view>
      <u-loadmore :status="status"></u-loadmore>
    </view>
    <u-empty
      v-else
      mode="data"
      :icon="wxapp_img.empty_data"
    >
    </u-empty>
  </view>
</template>
<script>
import GoodsList from '@/pages/order/components/GoodsList';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.order.getOrderList({
        help_order: 1,
      });
      this.pageData = res.data;
    },
    // 点击订单
    clickOrder(item) {
      this.$utils.toUrl(
        '/pages/order-detail/order-detail' +
          uni.$u.queryParams({ id: item.order_id, user_id: item.user_info.id })
      );
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
  min-height: 100vh;
}

.conent-box {
  padding-top: 20rpx;

  .order-item {
    border-radius: 20rpx;
    padding: 20rpx 0;
    box-shadow: 4rpx 6rpx 2rpx #eee;
    margin: 0 20rpx 20rpx;
    background: #fff;

    > view {
      padding: 0 20rpx;
    }

    .order-title {
      font-size: 26rpx;
      border-bottom: 2rpx solid #e5e5e5;

      > view:nth-child(1) {
        font-weight: 600;
        padding-bottom: 20rpx;
      }

      > view:nth-child(2) {
        color: #666;
        padding-bottom: 20rpx;
      }
    }

    .total-button {
      margin-top: 10rpx;
      padding-top: 20rpx;
      border-top: 2rpx solid #eee;
      height: 60rpx;
      color: #555;

      .button-box {
        width: 0;
        flex: 1;
        justify-content: flex-end;

        > view {
          padding: 0 20rpx;
          line-height: 50rpx;
          border: 2rpx solid #ddd;
          border-radius: 10rpx;
          margin-left: 20rpx;
          font-size: 30rpx;
        }
      }
    }
  }
}
</style>
