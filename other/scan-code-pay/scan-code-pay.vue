<template>
  <view class="body">
    <div class="content">
      <div class="shop-name u-line-1 font-32">
        {{ (shopData.shop && shopData.shop.name) || "当面付" }}
      </div>
      <div class="input-box">
        <view class="color-666">订单金额</view>
        <view class="flex-y-center p-y-20 font-36">
          <text class="font-w-600 m-r-10">￥</text>
          <u-input
            :disabled="disabledPrice"
            v-model="priceValue"
            @change="priceChange"
            type="digit"
            placeholder="请输入金额"
            border="none"
            fontSize="36rpx"
          ></u-input>
        </view>
      </div>

      <div class="input-box">
        <view
          v-if="selectCoupon"
          class="coupon-price color-666 flex-y-center flex-x-sb"
        >
          <text>订单优惠</text>
          <text class="u-line-1 font-right m-l-20 color-999 flex-w-1"
            >优惠{{ selectCoupon.sub_price }}元</text
          >
        </view>

        <view
          @click="showCouponPopup"
          class="color-666 flex-y-center flex-x-sb"
        >
          <text>优惠券</text>
          <view class="flex-y-center flex-w-1 p-l-10 font-right">
            <text class="flex-w-1 u-line-1 color-999">{{
              selectCoupon
                ? "满" +
                  selectCoupon.min_price +
                  "减" +
                  selectCoupon.sub_price +
                  "元"
                : "暂无优惠券"
            }}</text>
            <text class="iconfont icon-arrow-right font-32"></text>
          </view>
        </view>
        <view class="flex-y-center p-y-20 font-36">
          <u-input
            v-model="remark"
            placeholder="添加备注"
            border="none"
            fontSize="32rpx"
          ></u-input>
        </view>
      </div>

      <div class="total-price">
        <text>应付金额</text>
        <text class="price-color">￥{{ payPrice || 0 }}</text>
      </div>
    </div>

    <div @click="submit" :class="[priceValue.length && 'confirm', 'submit-bt']">
      已于店员确认, 立即买单
    </div>

    <GoodsCoupon
      ref="GoodsCoupon"
      @checkCoupon="checkCoupon"
      :goodsData="couponData"
      :currenCoupon="selectCoupon"
      type="dangmianfu"
      :showText="false"
    ></GoodsCoupon>
  </view>
</template>
<script>
import OrderPay from "@/mixins/OrderPay";
import share from "@/mixins/share";
import GoodsCoupon from "@/pages/goods/components/goods-coupon";
export default {
  components: {
    GoodsCoupon,
  },
  mixins: [OrderPay, share],
  data() {
    return {
      shopData: "",
      mch_id: "",
      priceValue: "", //输入金额
      disabledPrice: false,
      remark: "", //采集备注
      selectCoupon: "", //选中优惠军
      couponData: "", //优惠券数据
      goodsId: 0,
      disableSubmit:false
    };
  },
  onLoad(params) {
    if (params.scene) {
      let urlData = decodeURIComponent(params.scene);
      let urlArr = urlData.split(",");
      let newParams = {};
      urlArr.forEach((item) => {
        let itemArr = item.split(":");
        newParams[itemArr[0]] = itemArr[1];
      });
      this.mch_id = newParams.m;
      if (newParams.p > 0) {
        this.priceValue = newParams.p;
        this.disabledPrice = true;
        this.priceChange();
      } else {
        this.disabledPrice = false;
      }
      this.loadData();
    } else {
      if (params.mch_id) {
        this.mch_id = params.mch_id;
        this.loadData();
      }
    }
    if (this.mch_id == 0) {
      // 获取平台当面付商品ID
      this.getGoodsId();
    }
  },
  methods: {
    async getGoodsId() {
      const res = await this.$requestAll.default.scanCodeGoods({});
      this.goodsId = res.data.goods_id;
    },
    async loadData() {
      const res = await this.$requestAll.mch.indexShop({
        mch_id: this.mch_id,
        tab: 0,
        cat_id: 0,
      });
      this.shopData = res.data;
    },
    async priceChange() {
      if (!uni.$u.test.amount(this.priceValue)) return;

      const res = await this.$requestAll.scancodepay.getCoupon({
        mch_id: this.mch_id || 0,
        price: this.priceValue,
      });
      this.couponData = res.data;
      if (res.data.coupon_list.length) {
        this.selectCoupon = res.data.coupon_list[0];
      }
    },
    async submit() {
      if(this.disableSubmit){
        return uni.$u.toast("已禁用当面付功能");
      }
      if (!uni.$u.test.amount(this.priceValue))
        return uni.$u.toast("输入金额不正确");
      console.log("验证通过");
      const formData = [
        {
          mch_id: this.mch_id || 0,
          goods_list: [
            {
              goods_id: this.mch_id > 0 ? this.shopData.goods_id : this.goodsId,
              num: 1,
              attr: [
                {
                  attr_group_id: 1,
                  attr_id: 1,
                },
              ],
            },
          ],
        },
      ];

      // 创建预订单
      const res = await this.$requestAll.order.getOrderSubmit(
        { mch_list: JSON.stringify(formData) },
        true
      );
      var mch_list = res.data.mch_list;
      mch_list[0] = Object.assign(mch_list[0], {
        total_price: this.priceValue,
        level_price: this.priceValue,
        content: this.remark,
        show: false,
        show_length: 0,
        shop: {},
        picker_coupon: {},
        offline: 0,
        coupon_list: this.couponData.coupon_list,
        picker_coupon: this.selectCoupon,
      });
      var submitData = {
        address_id: 0,
        use_integral: 1,
        formIds: "[]",
        formId: "",
        mch_list: JSON.stringify(mch_list),
      };
      this.orderSubmit(submitData, "s");
    },
    showCouponPopup() {
      console.log(this.$refs);
      this.$refs["GoodsCoupon"].showPopup();
    },
    checkCoupon(item) {
      this.selectCoupon = item;
    },
  },
  async onShow() {
    // 验证当面付是否开启
    let setting = await this.$requestAll.scancodepay.getScanCodePaySetting({})
    if(setting.data.is_scan_code_pay == 0){
      this.disableSubmit = true
      return uni.$u.toast(setting.msg);
    }
  },
  computed: {
    payPrice() {
      if (uni.$u.test.amount(this.priceValue)) {
        let sub_price = this.selectCoupon.sub_price
          ? this.selectCoupon.sub_price
          : 0;
        let money = this.priceValue - sub_price;
        money = money <= 0 ? 0 : money;
        return money.toFixed(2);
      }
      return 0;
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding: 20rpx;

  background: #f5f5f5;
  min-height: 100vh;

  .content {
    border-radius: 10rpx;
    background: #fff;
    padding: 0 20rpx;
    .shop-name {
      line-height: 100rpx;
      text-align: center;
    }
    .input-box {
      padding-top: 20rpx;
      border-bottom: 2rpx solid #eee;
      .coupon-price {
        margin-bottom: 20rpx;
      }
      &:nth-child(1) {
        padding: 0;
      }
      /deep/.u-input {
        padding-left: 0 !important;
      }
    }

    .total-price {
      text-align: right;
      line-height: 120rpx;
      > text:nth-child(2) {
        margin-left: 10rpx;
      }
    }
  }

  .submit-bt {
    margin: 20rpx auto;
    border-radius: 35rpx;
    background: #dddddd;
    color: #fff;
    text-align: center;
    line-height: 70rpx;
    width: 710rpx;
  }

  .confirm {
    background: red;
  }
}
</style>
