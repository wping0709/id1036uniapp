<template>
  <view v-if="order_info" class="body">
    <view class="delivery-box border-b">
      <view>
        还剩
        <span style="color: #fecb2e">{{ order_info.binding_time }}分钟内</span
        >送货
      </view>

      <view class="flex-y-center m-t-20">
        <view class="status-tip">取</view>
        <view class="flex-w-1 m-x-20">
          <view class="font-600-30">{{ order_info.shop.name }}</view>
          <view>{{ order_info.shop.address }}</view>
        </view>
        <view
          @click="toNavigation('qu')"
          class="iconfont icon-daohang font-50"
        ></view>
      </view>

      <view class="flex-y-center m-t-20">
        <view class="status-tip status-tip-2">送</view>
        <view class="flex-w-1 m-x-20">
          <view class="font-600-30">{{ order_info.address }}</view>
          <view>
            <text>{{ order_info.name }}</text>
            <text class="m-l-20">{{ order_info.mobile }}</text>
          </view>
        </view>
        <view
          @click="toNavigation"
          class="iconfont icon-daohang font-50"
        ></view>
      </view>
    </view>

    <!-- 商品信息 -->
    <div class="goods-box border-b">
      <view class="font-600-36">商品清单</view>

      <OrderGoods :order="{ goods_list: order_info.goods_list }"></OrderGoods>

      <view class="m-t-20 flex-x-sb">
        <text>实付：</text>
        <text>￥{{ order_info.pay_price }}</text>
      </view>
    </div>

    <!-- 订单信息 -->
    <div class="info-item border-b">
      <view class="font-600-36">订单信息</view>
      <div class="flex-x-sb">
        <div>订单号码</div>
        <div>{{ order_info.order_no }}</div>
      </div>
      <div class="flex-x-sb">
        <div>期望送达</div>
        <div>{{ order_info.user_send_time }}</div>
      </div>
      <div class="flex-x-sb">
        <div>发票抬头</div>
        <div>无（不需要发票）</div>
      </div>
      <div v-if="order_info.content" class="flex-x-sb">
        <div>备注</div>
        <div class="flex-w-1 m-l-20">
          {{ order_info.content }}
        </div>
      </div>
    </div>

    <!-- 收入详情 -->
    <div class="info-item border-b">
      <view class="font-600-36">订单信息</view>
      <div class="flex-x-sb">
        <div>配送费</div>
        <div>￥{{ order_info.express_price }}</div>
      </div>
      <div class="flex-x-sb">
        <div>本单收入</div>
        <div class="price-color">￥{{ order_info.peisong_price }}</div>
      </div>
    </div>

    <div class="bottom-btns">
      <div class="fixed">
        <view @click="onMobile(order_info.mobile)" class="flex-col flex-y-center flex-x-center">
          <u-icon name="phone-fill" size="40rpx"></u-icon>
          <view>联系</view>
        </view>

        <view @click="onMobile(order_info.shop.mobile)" class="flex-col flex-y-center flex-x-center">
          <u-icon name="info" size="40rpx"></u-icon>

          <view>遇到问题</view>
        </view>
      </div>
    </div>
  </view>
</template>
<script>
import OrderGoods from '@/pages/order-detail/components/OrderGoods';
export default {
  components: {
    OrderGoods,
  },
  data() {
    return {
      order_info: '',
      order_id: '',
      order_type: '',
    };
  },
  onLoad(params) {
    this.order_type = params.order_type;
    this.order_id = params.order_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.order.deDetail({
        order_id: this.order_id,
        delivery_type: this.order_type,
      });
      this.order_info = res.data;
    },
    toNavigation(type) {
      if (type == 'qu') {
        var data = {
          latitude: this.order_info.shop.latitude - 0,
          longitude: this.order_info.shop.longitude - 0,
          name: this.order_info.shop.name,
          address: this.order_info.shop.address,
        };
      } else {
        var data = {
          latitude: this.order_info.user_latitude - 0,
          longitude: this.order_info.user_longitude - 0,
          address: this.order_info.address,
        };
      }
      uni.openLocation({
        ...data,
        success: e => {
          console.log(e);
        },
      });
    },
    onMobile(mobile) {
      uni.makePhoneCall({
        phoneNumber: mobile,
      });
    }
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
/deep/.goods-item {
  padding: 0 !important;
}
.body {
  background: #f5f5f5;
  min-height: 100vh;
  > view {
    padding: 20rpx;
    background: #fff;
  }
}

.border-b {
  border-bottom: 1px solid #eee;
}

.delivery-box {
  .status-tip {
    width: 40rpx;
    height: 40rpx;
    line-height: 40rpx;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    font-size: 26rpx;
    background: #fecb2e;
  }
  .status-tip-2 {
    background: #4baa0b;
  }
}
.info-item {
  > .flex-x-sb {
    line-height: 70rpx;
  }
}

.bottom-btns {
  background: initial !important;
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;

    display: flex;
    justify-content: space-around;
    > view {
      flex: 1;
      font-size: 24rpx;
    }
  }
}
</style>
