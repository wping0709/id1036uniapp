<template>
  <view class="bottom-box">
    <view v-if="store.is_member_price == 1 && userInfo && userInfo.level == -1 && (memberPrice && memberPrice.unitPrice > 0 && memberPrice.memberPrice > 0) && !pack" @click="$utils.toUrl('/other/member/member')" class="huiyuan">
      <view class="flex-y-center" style="font-size: 24rpx">
        <view>会员价</view>
        <view class="m-x-10 font-w-700 price-color"
          >¥{{ memberPrice.memberPrice }}</view
        >
        <view>立即省</view>
        <view class="m-x-10 font-w-700 price-color"
          >¥{{ memberPrice.unitPrice }}</view
        >
        <view class="m-x-10 font-w-700 price-color">开通会员></view>
      </view>
    </view>
    <view v-if="totalPrice">
      <view
        v-if="!isArea"
        class="flex-x-sb flex-y-center bottom-bar bg-fff p-l-24"
      >
        <view v-if="totalPrice.pageType == 'step'" class="price-color">
          {{
            store.option.step.currency_name
              ? store.option.step.currency_name
              : '活力币'
          }}{{ totalPrice.totalPrice }} +￥{{ totalPrice.expressPrice }}
        </view>

        <view v-else>
          合计：
          <PriceText
            :price="totalPrice.totalPrice"
            ySize="56rpx"
            fSize="34rpx"
          ></PriceText>
        </view>
        <view v-if="shopDisplay" class="bt bt_1 flex-y-center flex-x-center">
          不在配送范围
        </view>
        <view
          v-else-if="waimaiDisplay"
          class="bt bt_1 flex-y-center flex-x-center"
        >
          起送金额未达到
        </view>
        <view
          v-else
          @click="$emit('submit')"
          class="bt flex-y-center flex-x-center"
        >
          提交订单
        </view>
      </view>
      <view
        v-else
        class="flex-y-center flex-x-center font-30 bottom-bar wuhuo-bg"
        >所选地区商品暂时无货</view
      >
    </view>
  </view>
</template>

<script>
import PriceText from '@/components/price-text/index';
export default {
  components: {
    PriceText,
  },
  props: {
	pack:String,
    memberPrice: Object,
    totalPrice: Object,
    isArea: Boolean,
    shopDisplay: {
      type: [String, Boolean],
      default: false,
    },
    waimaiDisplay: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo']
    }
  },
};
</script>

<style lang="scss" scoped>
.bottom-box {
  height: 172rpx;
  height: calc(172rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
}
.bottom-bar {
  position: fixed;
  z-index: 9999;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  .bt {
    margin-right: 24rpx;
    height: 76rpx;
    border-radius: 38rpx;
    background: red;
    min-width: 200rpx;
    padding: 0 20rpx;

    font-weight: 600;
    color: #fff;
  }
  .bt_1 {
    background: #8c8c8c;
  }
}
.huiyuan {
  height: 72rpx;
  > view {
    position: fixed;
    z-index: 999;

    bottom: 100rpx;
    bottom: calc(100rpx + env(safe-area-inset-bottom));

    left: 0;
    width: 100%;
    height: 72rpx;
    padding: 0 20rpx;

    background: #fdf2f2;
    font-size: 30rpx;
    // border-bottom: 2rpx solid #eee;
  }

  .bt-box {
    > view {
      margin-left: 20rpx;
      line-height: 70rpx;
      text-align: center;
      border-radius: 40rpx;
      padding: 0 40rpx;
      color: #fff;
    }
  }
}
.wuhuo-bg {
  color: #fff;
  background: #febd14;
}
</style>
