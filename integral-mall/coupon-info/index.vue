<template>
  <view v-if="pageData" class="body">
    <div class="head-box">
      <image style="width: 100%; height: 480rpx" :src="wxapp_img.BG" />
      <view class="head-content flex-x-sb color-666 flex-y-center">
        <view class="price-box font-30">
          ￥<text style="font-size: 60rpx">{{
            pageData.coupon.sub_price
          }}</text>
        </view>
        <view class="font-30 m-l-20">
          <div class="m-b-20">优惠券</div>
          <div>满{{ pageData.coupon.min_price }}元可用</div>
        </view>
      </view>
    </div>

    <div class="coupon-price">
      <span>{{ pageData.coupon.integral }}</span
      >积分
      <span v-if="pageData.coupon.price > 0"
        >+ ￥{{ pageData.coupon.price }}</span
      >
    </div>

    <div class="coupon-msg">
      <div class="title font-30">优惠券说明</div>
      <div class="u-line-2">
        <text>优惠券有效期：</text>
        <span v-if="pageData.coupon.expire_type == 1"
          >兑换后{{ pageData.coupon.expire_day }}天
        </span>
        <span v-else>
          {{ pageData.coupon.begin_time }} - {{ pageData.coupon.end_time }}
        </span>
      </div>

      <div class="msg">
        适用范围：
        <template v-if="pageData.coupon.appoint_type == null">
          全场通用
        </template>
        <!-- 指定分类 -->
        <template v-else-if="pageData.coupon.appoint_type == 1">
          <template v-if="!pageData.info">全场通用</template>
          <view v-else>
            仅限
            <text v-for="(cat, index) in pageData.info" :key="index"
              >{{ cat.name }}、</text
            >
            产品使用
          </view>
        </template>
        <!-- 指定商品 -->
        <template v-else-if="pageData.coupon.appoint_type == 2">
          <template v-if="!pageData.info || !pageData.info">
            全场通用
          </template>
          <view
            v-else
            @click="$utils.toUrl('/other/list/list?goods_id=' + goods_ids)"
          >
            指定商品（点击查看）
          </view>
        </template>
        <template v-else-if="pageData.coupon.appoint_type == 3">
          当面付
        </template>
      </div>
      <div>
        使用说明：本优惠券总剩余{{ pageData.coupon.total_num }}张，每人限领{{
          pageData.coupon.user_num
        }}张。兑换成功后，优惠券将直接放入“我的优惠券”中。优惠券一经兑换，一律不退还积分。
      </div>
    </div>

    <view class="bottom-box">
      <div class="bottom-fixed flex-y-center flex-x-center">
        <view @click="submit">立即兑换</view>
      </div>
    </view>
  </view>
</template>
<script>
import OrderPay from "@/mixins/OrderPay";
export default {
  mixins: [OrderPay],
  data() {
    return {
      pageData: "",
    };
  },
  onLoad(params) {
    this.coupon_id = params.coupon_id;
    this.loadData();
  },

  methods: {
    async loadData() {
      const res = await this.$requestAll.integralmall.couponInfo(
        {
          coupon_id: this.coupon_id,
        },
        true
      );
      this.pageData = res.data;
    },
    submit() {
      var coupon = this.pageData.coupon;
      var content = "";
      if (coupon.price > 0) {
        content =
          "需要" + coupon.integral + "积分" + "+￥" + parseFloat(coupon.price);
      } else {
        content = "需要" + coupon.integral + "积分";
      }
      if (coupon.total_num <= 0) {
        content = "已领完,来晚一步";
        return this.$utils.toast(content);
      }
      if (coupon.user_num > coupon.num) {
        console.log(123);
        content = "兑换次数已达上限";
        this.$utils.toast(content);
        return;
      }
      uni.showModal({
        title: "提示",
        content: content,
        success: async (res) => {
          if (res.confirm) {
            const res = await this.$requestAll.integralmall.excahngeCoupon(
              {
                id: this.coupon_id,
                type: coupon.price > 0 ? 2 : 1,
              },
              true
            );
            if (res.data) {
              await this.wxPay(res);
            }
            uni.showModal({
              title: "恭喜您，兑换成功。",
              content: "",
              showCancel: true,
              confirmText: "立即查看",
              cancelText: "取消",
              success: ({ confirm, cancel }) => {
                if (confirm) {
                  this.$utils.toUrl("/other/coupon/coupon");
                } else {
                  this.loadData();
                }
              },
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        },
      });
    },
    async pay() {},
  },
  onShow() {},
  computed: {
    goods_ids() {
      let s = "";
      if (this.pageData.info) {
        this.pageData.info.forEach((item) => {
          s += `${item.id},`;
        });
      }
      return s;
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}
.head-box {
  position: relative;
  .head-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    white-space: nowrap;
  }
}
.coupon-price {
  box-sizing: content-box;
  font-size: 32rpx;
  height: 30 * 2rpx;
  line-height: 30 * 2rpx;
  color: #353535;
  padding-left: 12 * 2rpx;
  border-bottom: 1 * 2rpx solid #eee;
  padding: 20 * 2rpx 12 * 2rpx;
}

.coupon-msg {
  font-size: 28rpx;
  .title {
    margin: 20 * 2rpx 12 * 2rpx;
    color: #353535;
    font-size: 14 * 2rpx;
    border-left: 3 * 2rpx solid #ff4544;
    padding-left: 4 * 2rpx;
  }
  > view {
    margin: 0 24rpx 20rpx;
  }
}

.bottom-box {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  .bottom-fixed {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    > view {
      width: 650rpx;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      text-align: center;
      color: #fff;
      font-size: 30rpx;
      background: red;
    }
  }
}
</style>
