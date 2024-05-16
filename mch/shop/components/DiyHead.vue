<template>
  <view>
    <view class="head">
      <image :src="shopData.shop.header_bg" mode="aspectFill" />
      <view class="head-content">
        <view
          @click="
            $utils.toUrl('/mch/shop-summary/shop-summary?mch_id=' + shopData.shop.id)
          "
          class="left flex-w-1 flex"
        >
          <image :src="shopData.shop.logo" mode="aspectFill" />
          <view class="flex-w-1 flex-col flex-x-sb">
            <view class="font-32">{{ shopData.shop.name }}</view>
            <view class="flex">
              <text>店铺</text>
              <text>商品 {{ shopData.shop.goods_num }}</text>
              <text>已售 {{ shopData.shop.sale_num }}</text>
            </view>
          </view>
        </view>
        <view @click="show = true" class="right flex-y-center">
          <text class="iconfont icon-service font-40"></text>
          <text>客服</text>
        </view>
      </view>
    </view>
    <u-popup
      :show="show"
      round="20rpx"
      @close="show = false"
      mode="center"
      closeable
      :safeAreaInsetBottom="false"
    >
      <div class="popup-box">
        <div class="popup-title font-center">联系客服</div>
        <div >店家微信：{{ shopData.shop.wechat_name }}</div>
        <div >店家电话：{{ shopData.shop.tel }}</div>
        <div class="bts flex-y-center flex-x-sb">
          <div
            class="bt"
            @click="$utils.copy(shopData.shop.wechat_name, '微信复制成功')"
          >
            复制微信
          </div>
          <div class="bt" @click="makePhoneCall">拨打电话</div>
        </div>
      </div>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    shopData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.shopData.shop.tel
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.head {
  position: relative;
  height: 170rpx;
  color: #fff;
  > image {
    width: 100%;
    height: 100%;
  }
  .head-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    height: 90%;
    transform: translate(-50%, -50%);
    .left {
      > image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      > .flex-w-1 {
        > view:nth-child(2) {
          > text {
            padding: 0 10rpx;
            margin-right: 10rpx;
            font-size: 20rpx;
            &:nth-child(1) {
              background: red;
              border-radius: 20rpx;
            }
          }
        }
      }
    }
    .right {
      padding: 0 16rpx;
      // height: 50rpx;
      line-height: 50rpx;
      border-radius: 25rpx;
      border: 2rpx solid #eee;
    }
  }
}

.popup-box {
  font-size: 36rpx;
  color: #434343;
  line-height: 62rpx;
  padding: 0 50rpx 30rpx;
  width: 600rpx;
  .popup-title {
    line-height: 100rpx;
  }
  .bts {
    margin-top: 30rpx;
    text-align: center;
    .bt {
      width: 220rpx;
      line-height: 60rpx;
      border-radius: 30rpx;
      color: #ff5c5c;
      border: 2rpx solid #ff5c5c;
      font-size: 32rpx;
    }
  }
}
</style>
