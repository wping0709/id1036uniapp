<template>
  <view v-if="orderDetail" class="order-submit" style="">
    <!-- 收货地址 -->
    <Address :address="address" :shopDisplay="shopDisplay"></Address>

    <template v-for="(item, index) in orderDetail.mch_list">
      <!-- 表单 -->
      <SubmitForm
        class="SubmitFrom"
        v-if="item.form && item.form.is_form == 1"
        :form.sync="item.form"
        :key="index"
      ></SubmitForm>
      <!-- 商家商品及赠品 -->
      <view
        :key="index"
        class="mch-item bg-fff"
        style="margin-bottom: 10px; border-bottom: 1px solid #fff"
      >
        <view class="m-y-20">
          <div class="p-y-20 p-x-20">{{ item.name }}</div>
          <!-- 商品 -->

          <Goods
            @goodsChange="goodsChange($event, item)"
            :goodsList="item.goods_list"
          ></Goods>

          <!-- 订单赠送 -->

          <GiveGoods
            :goodsData="item.give_list"
            width="40px"
            height="40px"
            :title="['订单满额赠送', ' (请任选其一)']"
            :isClick="true"
            @clickGive="clickGive($event, item)"
          ></GiveGoods>
        </view>

        <!-- 配送方式 -->
        <view class="p-x-20 borderbottom2">
          <OrderDelivery
            :send_type="item.send_type"
            :current_type="item.default_send_type"
            :delivery_method="item.delivery_method"
            @deliveryChange="deliveryChange($event, item, index)"
            :location="address"
            @confirm="shopConfirm($event, item, index)"
          ></OrderDelivery>
        </view>

        <!-- 买家留言 -->
        <view class="p-x-20 flex-x-sb leave">
          <view style="line-height: 96rpx">留言</view>
          <view class="flex-w-1 flex-y-center m-l-20">
            <u-textarea
              :placeholderStyle="{ fontSize: '26rpx', lineHeight: '30rpx' }"
              v-model="item.content"
              class="textarea"
              placeholder="请填写备注"
              autoHeight
              border="none"
            >
            </u-textarea>
          </view>
        </view>
      </view>

      <div :key="index" class="youhui-box">
        <!-- 满减 -->
        <view
          v-if="item.minus_num > 0"
          class="p-x-20 flex-x-sb flex-y-center height100 borderbottom2"
        >
          <view class=""> 满减 </view>
          <view class="price-color"> {{ item.minus_num }}折 </view>
        </view>

        <!-- 选择优惠券 -->
        <view class="borderbottom2 p-x-20">
          <GoodsCoupon
            v-if="item.coupon_list.length"
            @checkCoupon="couponChange($event, item, index)"
            type="select"
            showText
            :goodsData="{ couponList: item.coupon_list }"
            :currenCoupon="item.picker_coupon || item.coupon_list[0]"
          ></GoodsCoupon>
        </view>

        <!-- 积分 -->
        <view
          v-if="item.integral.forehead > 0"
          class="p-x-20 flex-x-sb flex-y-center height100 borderbottom2"
        >
          <view class="">
            {{ item.integral.forehead_integral }}积分抵扣{{
              item.integral.forehead
            }}元
          </view>
          <view class="">
            <u-switch
              v-model="submitData.use_integral"
              :activeValue="1"
              :inactiveValue="2"
              size="20"
            ></u-switch>
          </view>
        </view>

        <!-- 满减 -->
        <view
          v-if="item.minus_price > 0"
          class="p-x-20 flex-x-sb flex-y-center height100 borderbottom2"
        >
          <view>满减</view>
          <view class="price-color">-{{ item.minus_price }}</view>
        </view>

        <!-- 运费 -->
        <view class="p-x-20 flex-x-sb flex-y-center height100 borderbottom2">
          <view>运费</view>
          <view>￥{{ freight(item) }}</view>
        </view>

        <!-- 打包费 -->
        <view
          v-if="item.dabao_price > 0"
          class="p-x-20 flex-x-sb flex-y-center height100 borderbottom2"
        >
          <view>打包费</view>
          <view>￥{{ item.dabao_price }}</view>
        </view>
      </div>
    </template>

    <BottomBar
      :totalPrice="totalPrice"
      @submit="onOrderSubmit"
      :shopDisplay="shopDisplay"
    ></BottomBar>
  </view>
</template>

<script>
import Address from '@/pages/order-submit/components/Address';
import GiveGoods from '@/components/goods/GiveGoods';
import GoodsCoupon from '@/pages/goods/components/goods-coupon';
import OrderDelivery from '@/components/OrderDelivery/OrderDelivery';
import BottomBar from '@/pages/order-submit/components/bottom-bar';
import Goods from '@/pages/order-submit/components/Goods';
import OrderPay from '@/mixins/OrderPay.js';
import SubmitForm from '@/pages/order-submit/components/SubmitForm';
export default {
  mixins: [OrderPay],
  components: {
    Address,
    GiveGoods,
    BottomBar,
    Goods,
    GoodsCoupon,
    OrderDelivery,
    SubmitForm,
  },
  data() {
    return {
      params: {},

      address: '', //地址
      orderDetail: '', //订单信息
      totalPrice: {
        totalPrice: 0,
      },
      submitData: {
        use_integral: 2,
        address_id: '',
      },
    };
  },
  onLoad(params) {
    console.log(params);
    if (params.goodsData) {
      this.params = params.goodsData;
    } else if (params.cartData) {
      this.params = params.cartData;
    } else if (params.mch_list) {
      this.params = params.mch_list;
    }
  },
  onShow() {
    const address = uni.getStorageSync('address');
    console.log(address, '缓存获取');
    if (address) this.address = address;
    uni.removeStorageSync('address');
    this.getOrderDetail();
  },
  methods: {
    // 计算合计金额
    countPrice() {
      console.log('重新计算金额');
      const mch_list = this.orderDetail.mch_list;
      console.log(mch_list);
      let totalPrice = {
        expressPrice: 0,
        totalPrice: 0,
      };
      mch_list.forEach(mch => {
        // 运费
        if (mch.default_send_type == 'express') {
          totalPrice.totalPrice += mch.express_price * 1;
        } else if (mch.default_send_type == 'waimai') {
          totalPrice.totalPrice += mch.waimai_delivery_cost * 1;
        }

        // 满减
        if (mch.minus_num > 0) {
          totalPrice.totalPrice -= mch.total_price * (mch.minus_num / 10);
        }

        // 满减金额
        if (mch.minus_price > 0) {
          totalPrice.totalPrice -= mch.minus_price * 1;
        }

        // 积分
        if (this.submitData.use_integral == 1) {
          totalPrice.totalPrice -= mch.integral.forehead;
        }

        // 优惠券
        if (mch.picker_coupon) {
          totalPrice.totalPrice -= mch.picker_coupon.sub_price;
        }

        // 打包费
        if (mch.dabao_price > 0) {
          totalPrice.totalPrice += mch.dabao_price;
        }

        totalPrice.totalPrice += mch.total_price * 1;
      });

      if (totalPrice.totalPrice < 0) totalPrice.totalPrice = 0;
      // 处理计算出现多小数
      for (const key in totalPrice) {
        totalPrice[key] = totalPrice[key].toFixed(2);
      }
      this.totalPrice = totalPrice;
    },
    // 商家赠品选择
    clickGive(id, item) {
      const list = item.give_list;
      for (let it in list) {
        if (list[it].id == id) {
          list[it].check = true;
        } else {
          list[it].check = false;
        }
      }
      item.give_id = id;
      this.$forceUpdate();
    },
    // 商品赠品选择
    goodsChange(e, item) {
      item.goods_list = e;
      this.$forceUpdate();
    },
    // 获取订单详情
    async getOrderDetail() {
      let locationData = await this.$store.dispatch('GETLOCATION');
      const params = {
        address_id: this.address && this.address.id,

        longitude: locationData.longitude,
        latitude: locationData.latitude,
        mch_list: this.params,
        is_open_offline: 1,
      };
      const res = await this.$requestAll.order.orderNewSubmitPreview(
        params,
        true
      );
      this.orderDetail = res.data;
      this.address = res.data.address;
      // 计算合计金额
      this.countPrice();
    },

    // 配送方式改变
    deliveryChange(val, mch, index) {
      console.log('配送方式更改');

      mch.default_send_type = val;
      // this.$set(this.orderDetail.mch_list[index], 'default_send_type', val);
      this.$set(this.orderDetail.mch_list, index, mch);
      this.countPrice();
    },
    // 门店改变
    shopConfirm(shop, mch, index) {
      mch.shop = shop.shop;

      this.$set(this.orderDetail.mch_list, index, mch);
      console.log(this.orderDetail.mch_list);
    },
    // 选择优惠券改变
    couponChange(coupon, item, index) {
      console.log(item, '選擇優惠卷');

      item.picker_coupon = coupon;
      this.$set(this.orderDetail.mch_list, index, item);
      this.countPrice();
    },

    // 订单提交
    async onOrderSubmit() {
      try {
        uni.showLoading({
          title: '提交中...',
        });

        if (!this.address) throw '请选择收货地址';
        var mch_list = this.orderDetail.mch_list;
        mch_list.forEach(mch => {
          if (!mch.default_send_type) throw '请选择配送方式';

          if (mch.default_send_type == 'shop') {
            mch.offline = 1;
            mch.waimai = 0;
            mch.offline_name = this.address.name;
            mch.offline_mobile = this.address.mobile;
          } else if (mch.default_send_type == 'express') {
            mch.offline = 0;
            mch.waimai = 0;
          } else if (mch.default_send_type == 'waimai') {
            mch.offline = 0;
            mch.waimai = 1;
          }

          mch.form?.is_form &&
            mch.form.list.forEach(item => {
              let defaultType = [
                'text',
                'textarea',
                'date',
                'time',
                'uploadImg',
              ];
              if (item.required == 1) {
                // 当前为default判断
                if (
                  defaultType.indexOf(item.type) != -1 &&
                  !item.default.trim().length
                )
                  throw `${item.name}不能为空`;

                // 当前为选择判断
                if (
                  defaultType.indexOf(item.type) == -1 &&
                  !item.default_list.some(
                    defaultItem => defaultItem.is_selected
                  )
                )
                  throw `${item.name}未选择`;
              }
            });
        });

        const submitData = {
          ...this.submitData,
          live_room: 0,
          mch_list: JSON.stringify(mch_list),
          order_origin: 3,
          verify_card_id: 0,
          is_open_offline: 1,
        };

        await this.orderSubmit(submitData, 's');
        uni.hideLoading();
      } catch (error) {
        uni.hideLoading();

        this.$utils.toast(error.message || error);
      }
    },
  },
  computed: {
    freight(mch) {
      return function (mch) {
        if (mch.default_send_type == 'shop') {
          return 0;
        } else if (mch.default_send_type == 'express') {
          return mch.express_price;
        } else if (mch.default_send_type == 'waimai') {
          return mch.waimai_delivery_cost;
        }
      };
    },
    // 当前是否选择门店自提
    shopDisplay() {
      if (this.orderDetail && this.address) {
        if (!this.address.longitude || !this.address.latitude) {
          return this.orderDetail.mch_list &&
            this.orderDetail.mch_list.some(
              item => item.default_send_type == 'waimai'
            )
            ? '地址需要添加经纬度'
            : false;
        } else {
          return this.orderDetail.mch_list &&
            this.orderDetail.mch_list.some(
              item =>
                item.default_send_type == 'waimai' && !item.waimai_delivery
            )
            ? '当前地址不在配送范围'
            : false;
        }
      }
      return false;
    },
  },
  watch: {
    address(val) {
      this.submitData.address_id = this.address.id;
    },
    'submitData.use_integral': {
      handler(val) {
        this.countPrice();
      },
    },
  },
};
</script>

<style lang="less" scoped>
.OrderDelivery {
  /deep/.delivery-view {
    padding: 0 20rpx;
  }

  /deep/.u-textarea {
    textarea {
      font-size: 26rpx !important;
    }
  }
}

.order-submit {
  padding: 1px 0;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
  font-size: 26rpx;

  /deep/.give-box {
    padding: 0 28rpx;
    margin: 20rpx 0;
  }

  .height100 {
    height: 100rpx;
  }

  .borderbottom2 {
    border-bottom: 2rpx solid #f2f2f2;
  }

  .youhui-box {
    margin: 24rpx;
    border-radius: 20rpx;
    background: #fff;
    padding: 0 4rpx;
  }

  .mch-item {
    margin: 24rpx;
    border-radius: 20rpx;
    background: #fff;
  }

  .leave {
    box-sizing: content-box;
    min-height: 96rpx;
    display: flex;

    /deep/.u-textarea {
      padding: 0;

      textarea {
        font-size: 26rpx;
      }
    }
  }
}
</style>
