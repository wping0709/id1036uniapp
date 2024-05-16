<template>
  <view class="item flex-x-sb">
    <image :src="goods.cover_pic" class="goods-img" mode="aspectFill" />
    <view class="right flex-w-1">
      <view class="goods-title u-line-1">
        {{ goods.name }}
      </view>
      <view class="num flex-y-center m-t-10 font-26">
        <!-- <image
          :src="goods.user_list[0].avatar_url"
          style="
            border-radius: 50%;
            width: 50rpx;
            height: 50rpx;
            margin-right: 10rpx;
          "
          mode="aspectFill"
        /> -->
        {{ goods.sale }}人正在砍价
      </view>

      <view class="flex-y-end flex-x-sb">
        <view class="flex-w-1">
          <view class="price-color font-w-700 font-24">
            最低
            <PriceText
              :price="goods.min_price"
              ySize="44rpx"
              fSize="28rpx"
            ></PriceText>
          </view>
          <view class="color-999 font-24 font-w-600">
            价值 ￥{{ goods.price }}
          </view>
        </view>

        <view class="bt" v-if="goods.num > 0">立即参与</view>
        <view class="bt" v-else>下次再来</view>
      </view>
    </view>
  </view>
</template>

<script>
import PriceText from '@/components/price-text';
export default {
  props: {
    goods: {
      type: [Object, String],
    },
  },
  components: {
    PriceText,
  },
};
</script>

<style lang="scss" scoped>
.item {
  padding: 24rpx;
  background: #fff;
  border-radius: 20rpx;
  .goods-img {
    width: 192rpx;
    height: 192rpx;
    margin-right: 20rpx;
  }
  .goods-title {
    font-size: 30rpx;
    font-weight: 600;
    color: rgba(51, 51, 51, 0.94);
    margin-bottom: 12rpx;
  }
  .num {
    color: #ff1b22;
    height: 34rpx;
    line-height: 34rpx;
    margin-bottom: 20rpx;
  }

  .bt {
    line-height: 60rpx;
    padding: 0 22rpx;
    border-radius: 30rpx;
    background: linear-gradient(90deg, #ff1b22 0%, #ff7333 100%);

    text-align: center;
    color: #fff;
    font-weight: 600;
  }
}
</style>
