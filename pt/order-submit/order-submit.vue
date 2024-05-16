<template>
  <view v-if="orderDetail" class="order-submit">
    <!-- 收货地址 -->
    <Address :address="address" :shopDisplay="shopDisplay"> </Address>

    <!-- 是否开启积分 -->

    <!-- 商品 -->
    <view
      style="
        border-radius: 20rpx;
        margin: 24rpx;
        background: #fff;
        padding-top: 24rpx;
      "
    >
      <Goods
        :goodsList="[
          {
            ...orderDetail.list[0],
            attr: orderDetail.goods_info.attr,
          },
        ]"
        type="pt"
      ></Goods>

      <!-- 买家留言 -->
      <view class="p-x-20 flex-x-sb leave p-t-10">
        <view>留言</view>
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
          >
          </u-textarea>
        </view>
      </view>

      <!-- 配送方式 -->
      <view v-if="!pond_id" class="OrderDelivery">
        <OrderDelivery
          :send_type="orderDetail.send_type"
          :current_type="orderDetail.default_send"
          @deliveryChange="deliveryChange"
          :location="address"
          @confirm="deliveryConfirm"
        ></OrderDelivery>
      </view>
    </view>

    <!-- 配送方式 -->
    <view class="bg-fff price-exprees-box">
      <view
        v-if="orderDetail.integral && orderDetail.integral.forehead_integral"
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

      <view v-if="orderDetail.colonel" class="flex-x-sb flex-y-center freight">
        <view>团长优惠</view>
        <view class="price-color">-￥{{ orderDetail.colonel }}</view>
      </view>
      <view class="flex-x-sb flex-y-center freight">
        <view>运费</view>
        <view>￥{{ totalPrice.expressPrice }}</view>
      </view>
    </view>

    <BottomBar
      :totalPrice="totalPrice"
      @submit="onOrderSubmit"
      :shopDisplay="shopDisplay"
      :waimaiDisplay="waimaiDisplay"
    ></BottomBar>

    <WxOpenSubscribe :template="orderDetail.send_tpl"></WxOpenSubscribe>
  </view>
</template>

<script>
import Address from '@/pages/order-submit/components/Address';
import BottomBar from '@/pages/order-submit/components/bottom-bar';
import OrderPay from '@/mixins/OrderPay.js';
import OrderDelivery from '@/components/OrderDelivery/OrderDelivery';
import Goods from '@/pages/order-submit/components/Goods';
import WxOpenSubscribe from '@/components/wx-open-subscribe';
export default {
  mixins: [OrderPay],
  components: {
    Address,
    BottomBar,
    OrderDelivery,
    Goods,
    WxOpenSubscribe,
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
        address_name: '',
        address_mobile: '',
        shop_id: '',
        content: '', //备注
        user_integral: 2, //积分开启状态 1开启2关闭
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
    deliveryConfirm(v) {
      this.submitData.shop_id = v.shop.id;
    },
    deliveryChange(v) {
      this.orderDetail.default_send = v;
    },

    // 获取订单详情
    async getOrderDetail() {
      const res = await this.$requestAll.group.submitPreview(
        {
          address_id: this.address && this.address.id,
          goods_info: this.goods_info,
          type: JSON.parse(this.goods_info).type,
        },
        true
      );
      this.orderDetail = res.data;
      this.address = res.data.address;
    },
    // 订单提交
    async onOrderSubmit() {
      if (!this.orderDetail.default_send) return uni.$u.toast('请选择配送方式');
      if (!this.address) return uni.$u.toast('收货地址不能为空');

      if (this.orderDetail.default_send == 'shop' && !this.submitData.shop_id)
        return uni.$u.toast('请选择自提门店');

      var submitData = Object.assign(this.submitData, {
        goods_info: this.goods_info,
        type: JSON.parse(this.goods_info).type || '',
        address_id: this.address.id,
        parent_id: JSON.parse(this.goods_info).parent_id || '',
      });

      if (submitData.offline == 2) {
        submitData = Object.assign(submitData, {
          address_name: this.address.name,
          address_mobile: this.address.mobile,
        });
      }

      await this.$utils.bindMessage(this.orderDetail.send_tpl);

      this.orderSubmit(submitData, 'pintuan');
    },

    // 计算合计金额
    totalPriceChange() {
      let goods = this.orderDetail.list[0];
      var orderDetail = this.orderDetail;

      // 商品价格加会员加个=总价
      let totalPrice = {
        totalPrice: Number(goods.is_level ? goods.level_price : goods.price) + Number(this.totalPrice.expressPrice),
        expressPrice: this.totalPrice.expressPrice,
      };
      
      // 团长优惠
      if (orderDetail.colonel) {
        totalPrice.totalPrice -= orderDetail.colonel;
      }

      totalPrice.totalPrice < 0 && (totalPrice.totalPrice = 0.01);

      this.totalPrice = totalPrice;
    },
  },
  watch: {
    // 配送方式变化重新计算合计金额
    'orderDetail': {
      handler(val) {
        console.log(val,'valval');
        const submitData = this.submitData;
        if (val == 'shop') {
          this.totalPrice.expressPrice = 0;
          submitData.offline = 2;
          submitData.waimai = 0;
        } else if (val == 'express') {
          this.totalPrice.expressPrice = this.orderDetail.express_price;
          submitData.offline = 1;
          submitData.waimai = 0;
          submitData.express_price = this.orderDetail.express_price;
        } else if (val == 'waimai') {
          this.totalPrice.expressPrice =
            this.orderDetail.waimai_delivery_cost * 1;
          submitData.offline = 1;
          submitData.waimai = 1;
          submitData.waimai_delivery_cost =
            this.orderDetail.waimai_delivery_cost;
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
      if (
        this.orderDetail.default_send == 'waimai' &&
        this.orderDetail.total_price < this.orderDetail.initial_delivery_amount
      )
        return true;
      return false;
    },
  },
};
</script>

<style lang="less" scoped>
.order-submit {
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding: 1px 0;

  background: #f5f5f5;
}

.price-exprees-box {
  margin: 24rpx;
  border-radius: 20rpx;
  background: #fff;
  padding: 0 24rpx;

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
}

// 留言
.leave {
  padding-bottom: 30rpx;
  box-sizing: content-box;
  // min-height: 80rpx;
  display: flex;

  /deep/.u-textarea {
    padding: 0;

    textarea {
      font-size: 26rpx;
      text-align: right;
    }
  }
}

// 配送方式样式
.OrderDelivery {
  /deep/.delivery-view {
    padding: 0 20rpx 30rpx;
  }

  /deep/.u-textarea {
    textarea {
      font-size: 26rpx !important;
    }
  }
}
</style>
