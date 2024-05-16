<template>
  <view v-if="list" class="body">
    <view class="info-one" v-for="(item, index) of list" :key="index">
      <template v-if="item.discount_type == 2">
        <image
          v-if="item.is_receive == 0"
          :src="wxapp_img.icon_coupon_enabled"
        />
        <image
          v-if="item.is_receive == 1"
          :src="wxapp_img.icon_coupon_disabled"
        />
        <view class="info-content flex-row flex-x-center flex-y-center">
          <view
            @click="
              $utils.toUrl(
                '/other/coupon-detail/coupon-detail?coupon_id=' + item.id
              )
            "
            class="info-content flex-row flex-x-center flex-y-center"
          >
            <view class="flex-grow-0">
              <view class="flex-row flex-y-end">
                <view class="flex-grow-0">￥</view>
                <view class="flex-grow-1" style="font-size: 23pt">
                  {{ item.sub_price }}
                </view>
              </view>
            </view>
            <view class="flex-grow-1">
              <view style="margin-left: 5px">
                <view style="margin-bottom: 2px">优惠券</view>
                <view>满{{ item.min_price }}可用</view>
              </view>
            </view>
          </view>
          <view class="flex-grow-0">
            <view
              v-if="item.is_receive == 0"
              @click="onReceive(item.id)"
              class="flex-x-center flex-y-center info-btn"
              style="color: #ff4544"
            >
              立即领取
            </view>
            <view
              v-if="item.is_receive == 1"
              class="flex-x-center flex-y-center info-btn"
              style="color: #999"
            >
              已领取
            </view>
          </view>
        </view>
        <view class="info-footer">
          <view class="info-day" v-if="item.expire_type == 2">
            有效日期：{{ item.begintime }}-{{ item.endtime }}
          </view>
          <view class="info-day" v-if="item.expire_type == 1">
            有效日期：领取{{ item.expire_day }}天内有效
          </view>
          <view>
            <template v-if="item.appoint_type == 2 && item.goods.length > 0">
              <view @click="onGoodsList(item.goods)">
                指定商品使用 点进去查看指定商品
              </view>
            </template>
            <template v-else>
              <view>{{ item.content }}</view>
            </template>
          </view>
        </view>
      </template>
    </view>

    <u-popup
      :show="successShow"
      overlayStyle="{background: 'rgba(0, 0, 0, 1)'}"
      bgColor="transparent"
      :safeAreaInsetBottom="false"
      mode="center"
    >
      <view class="popup-box">
        <image
          class="popup-bg-img"
          :src="wxapp_img.img_get_coupon_bg"
          mode="widthFix"
        />
        <image
          class="img-title"
          :src="wxapp_img.coupon_success_title"
          mode="heightFix"
        />
        <image
          class="img-content-bg"
          :src="wxapp_img.img_get_coupon_item_bg"
          mode="heightFix"
        />

        <view class="popup-content">
          <view class="price-box flex-y-center flex-x-sb">
            <view class="price">￥{{ activeData.sub_price }}</view>
            <view class="min-price">{{ activeData.min_price }}</view>
          </view>
          <view class="bt" @click="$utils.toUrl('/pages/list/list')"
            >立即使用</view
          >
        </view>
        <view @click="successShow = false" class="iconfont icon-reeor"></view>
      </view>
    </u-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      mch_id: '',
      list: '',
      successShow: false,
      activeData: '',
    };
  },
  onLoad(params) {
    if (params.mch_id) {
      this.mch_id = params.mch_id;
    }
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.default.couponList({
        mch_id: this.mch_id,
      });
      this.list = res.data.list;
    },
    async onReceive(id) {
      const res = await this.$requestAll.coupon.receiveCoupon({ id }, true);
      this.activeData = res.data.list[0];
      this.loadData();
      this.successShow = true;
    },
  },
  onShow() {
    this.loadData();
  },
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.flex-grow-0 {
  flex-grow: 0;
}
.flex-grow-1 {
  flex-grow: 1;
}

.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding: 20rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
}
.popup-box {
  position: relative;
  width: 100vw;
  .popup-bg-img {
    display: block;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 60rpx;
  }
  .img-title {
    position: absolute;
    top: 120rpx;
    left: 50%;
    height: 50rpx;
    transform: translate(-50%, 0);
  }
  .img-content-bg {
    position: absolute;
    top: 200rpx;
    left: 50%;
    height: 250rpx;
    transform: translate(-50%, 0);
  }
  .icon-reeor {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    color: #f5f5f5;
    font-size: 100rpx;
  }
  .popup-content {
    position: absolute;
    top: 260rpx;
    left: 50%;
    transform: translate(-50%, 0);
    .price-box {
      color: #fff;
      opacity: 0.9;
      margin-bottom: 20rpx;
      .price {
        font-size: 40rpx;
      }
      .min-price {
        font-size: 24rpx;
      }
    }
    .bt {
      width: 420rpx;
      line-height: 60rpx;
      background: #fff;
      border-radius: 10rpx;
      color: red;
      text-align: center;
    }
  }
}
.info-one {
  position: relative;
  width: 100%;
  margin-bottom: 20rpx;
  z-index: 10;
}
.info-one image {
  width: 100%;
  height: 160rpx;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 0;
}
.info-content {
  height: 160rpx;
  width: 100%;
  color: #fff;
  padding: 0 20rpx;
  line-height: 1;
  position: relative;
}
.info-btn {
  background-color: #fff;
  width: 140rpx;
  height: 56rpx;
  border-radius: 40rpx;
  font-size: 24rpx;
}
.info-footer {
  font-size: 24rpx;
  background-color: #fff;
  padding: 10 * 2rpx 10 * 2rpx 12 * 2rpx 10 * 2rpx;
  border-radius: 0 0 5 * 2rpx 5 * 2rpx;
  border: 1 * 2rpx solid #eee;
  border-top: none;
  color: #666;
}
</style>
