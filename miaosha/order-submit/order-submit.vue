<template>
  <view v-if="orderDetail" class="order-submit">
    <!-- 收货地址 -->
    <Address :address="address" :shopDisplay="shopDisplay"></Address>

    <!-- 是否开启积分 -->

    <!-- 商品 -->
    <view class="m-y-20 p-20 bg-fff">
      <OrderGoodsItem
        :goodsItem="{
          ...orderDetail.list[0],
          attr: orderDetail.goods_info.attr,
        }"
      ></OrderGoodsItem>
    </view>

    <!-- 配送方式 -->
    <view class="p-x-20 p-t-30 bg-fff price-exprees-box">
      <!-- 配送方式 -->

      <view style="border-bottom: 2rpx solid #eee">
        <OrderDelivery
          :send_type="orderDetail.send_type"
          :current_type="orderDetail.default_send"
          @deliveryChange="deliveryChange"
          :location="address"
          @confirm="shopConfirm"
        ></OrderDelivery>
      </view>

      <view
        v-if="orderDetail.integral.forehead_integral"
        class="flex-x-sb flex-y-center freight"
      >
        <view> 积分支付 </view>
        <view class="flex-y-center">
          <text>抵扣： {{ orderDetail.integral.forehead }}</text>
          <view class="m-l-10">
            <u-switch
              size="20"
              v-model="submitData.user_integral"
              @change="totalPriceChange"
              :activeValue="1"
              :inactiveValue="2"
            ></u-switch>
          </view>
        </view>
      </view>

      <view class="flex-x-sb flex-y-center freight">
        <view>运费</view>
        <view>￥{{ totalPrice.expressPrice }}</view>
      </view>
      <view class="flex-x-sb leave">
        <view>买家留言</view>
        <view class="flex-w-1 flex-y-center m-l-20">
          <u-textarea
            :placeholderStyle="{
              fontSize: '26rpx',
              lineHeight: '30rpx',
              textAlign: 'right',
            }"
            v-model="submitData.content"
            class="textarea"
            placeholder="请填写备注"
            autoHeight
            border="none"
          ></u-textarea>
        </view>
      </view>
    </view>

    <BottomBar
      :totalPrice="totalPrice"
      @submit="onOrderSubmit"
      :waimaiDisplay="waimaiDisplay"
      :shopDisplay="shopDisplay"
    ></BottomBar>
  </view>
</template>

<script>
import Address from '@/pages/order-submit/components/Address';
import BottomBar from '@/pages/order-submit/components/bottom-bar';
import OrderPay from '@/mixins/OrderPay.js';
import OrderDelivery from '@/components/OrderDelivery/OrderDelivery';
import OrderGoodsItem from '@/components/OrderGoodsItem/OrderGoodsItem';
export default {
  mixins: [OrderPay],
  components: {
    Address,
    BottomBar,
    OrderDelivery,
    OrderGoodsItem,
  },
  data() {
    return {
      address: '', //地址
      orderDetail: '', //订单信息
      address: '', //收货地址
      totalPrice: {
        totalPrice: 0, //合计金额
        expressPrice: 0, //运费
      },
      goods_info: '',
      submitData: {
        content: '', //备注
        user_integral: false,
        is_mch_shop: 0,
      },
    };
  },
  onLoad(params) {
    this.goods_info = params.goods_info;
  },
  onShow() {
    const address = uni.getStorageSync('address');
    if (address) this.address = address;
    uni.removeStorageSync('address');
    this.getOrderDetail();
  },
  methods: {
    shopConfirm(v) {
      console.log(v, 'shopConfirm');
      this.orderDetail.checkShop = v.shop;
    },
    deliveryChange(v) {
      this.orderDetail.default_send = v;
    },
    shopAddressChange(v) {
      this.submitData.address_name = v.name;
      this.submitData.address_mobile = v.mobile;
    },
    // 获取订单详情
    async getOrderDetail() {
      const res = await this.$requestAll.miaosha.submitPreview(
        {
          address_id: this.address && this.address.id,
          goods_info: this.goods_info,
        },
        true
      );
      this.address = res.data.address;
      this.orderDetail = res.data;
      // 设置运费金额
      this.totalPrice.expressPrice = res.data.express_price;

      // 计算合计金额
      // this.countPrice();
    },
    // 订单提交
    async onOrderSubmit() {
      if (!this.orderDetail.default_send) return uni.$u.toast('请选择配送方式');
      if (!this.address) return uni.$u.toast('收货地址不能为空');
      if (
        this.orderDetail.default_send == 'shop' &&
        !this.orderDetail.checkShop
      )
        return uni.$u.toast('请选择自提门店');
      var submitData = {
        ...this.submitData,
        address_name: this.address.name,
        address_mobile: this.address.mobile,
        goods_info: JSON.stringify(this.orderDetail.goods_info),
        address_id: this.address.id,
        waimai_delivery_cost: this.orderDetail.waimai_delivery_cost,
        waimai_delivery_cost: this.orderDetail.waimai_delivery_cost,
        waimai_shop_id: this.orderDetail.waimai_shop_id,
      };
      if (this.orderDetail.default_send == 'shop') {
        Object.assign(submitData, {
          shop_id: this.orderDetail.checkShop.id,
          submitData: this.orderDetail.checkShop?.is_mch_shop != 1 ? 0 : 1,
        });
      }

      this.orderSubmit(submitData, 'miaosha');
    },

    // 计算合计金额
    totalPriceChange() {
      this.totalPrice.totalPrice = Number(this.orderDetail.total_price) + Number(this.totalPrice.expressPrice)

      if (this.submitData.user_integral) {
        this.totalPrice.totalPrice += Number(this.orderDetail.integral.forehead);
      }
    },
  },
  watch: {
    'orderDetail.default_send': {
      handler(val) {
        var submitData = this.submitData;
        if (val == 'shop') {
          this.totalPrice.expressPrice = 0;
          submitData.offline = 1;
          submitData.waimai = 0;
        } else if (val == 'express') {
          this.totalPrice.expressPrice = this.orderDetail.express_price;
          submitData.offline = 0;
          submitData.waimai = 0;
        } else if (val == 'waimai') {
          this.totalPrice.expressPrice = this.orderDetail.waimai_delivery_cost;
          submitData.offline = 0;
          submitData.waimai = 1;
        }
        this.totalPriceChange();
      },
    },
  },
  computed: {
    // 当前是否选择门店自提
    shopDisplay() {
      if (this.orderDetail && this.address) {
        if (!this.address.longitude || !this.address.latitude) {
          return this.orderDetail.default_send == 'waimai'
            ? '地址需要添加经纬度'
            : false;
        } else {
          return this.orderDetail.default_send == 'waimai' &&
            !this.orderDetail.waimai_delivery
            ? '当前地址不在配送范围'
            : false;
        }
      }
      return false;
    },
    waimaiDisplay() {
      return (
        this.orderDetail &&
        this.orderDetail.default_send == 'waimai' &&
        this.orderDetail.total_price < this.orderDetail.initial_delivery_amount
      );
    },
  },
};
</script>

<style lang="less" scoped>
.order-submit {
  min-height: 100vh;
  background: #f5f5f5;
}

.price-exprees-box {
  > .express {
    min-height: 100rpx;
    border-bottom: 1px solid #eee;

    > view:nth-child(2) {
      display: flex;
      flex-wrap: wrap;

      > view {
        margin: 0 20rpx 0;
      }

      text {
        margin-left: 10rpx;
      }
    }
  }

  > .freight {
    height: 100rpx;
    border-bottom: 1px solid #eee;
  }

  > .leave {
    box-sizing: content-box;
    min-height: 100rpx;
    line-height: 100rpx;

    /deep/.u-textarea {
      font-size: 26rpx;
      line-height: 36rpx;
      padding: 0;
    }
  }
}
</style>
