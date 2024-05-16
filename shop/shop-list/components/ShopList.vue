<template>
  <view class="list">
    <div
      @click="$utils.toUrl('/mch/shop/shop?mch_id=' + shop.id)"
      class="item flex"
      v-for="(shop, index) in list"
      :key="index"
    >
      <div class="left">
        <image :src="shop.logo" style="width: 100%; height: 100%" mode="" />
        <!-- <text>品牌</text> -->
      </div>
      <div class="right flex-w-1 m-l-20">
        <view class="font-34 u-line-2 name">{{ shop.name }}</view>

        <view class="m-b-10 flex-x-sb flex-y-center">
          <view>
            <text class="shop-time" v-if="shop.business_hours">{{
              shop.business_hours
            }}</text>
          </view>

          <view class="shop-distance">
            <text v-if="shop.is_waimai == 1">{{ shop.delivery_time }}分钟</text>
            <text class="m-l-30">{{ shop.distance }}</text>
          </view>
        </view>

        <view class="coupon-list flex">
          <text v-for="(item, i) in shop.coupon_list" :key="i">{{ item }}</text>
        </view>

        <scroll-view scroll-x class="">
          <view class="scroll-box">
            <div
              class="scroll-item"
              v-for="(good, i2) in shop.goods_list"
              :key="i2"
            >
              <image :src="good.cover_pic" class="good-img" mode="aspectFill" />
              <div class="good-name u-line-1 font-26 color-666">
                {{ good.name }}
              </div>
              <div class="price font-26 price-color">
                ￥<text class="font-w-600">{{ good.price }}</text>
              </div>
            </div>
          </view>
        </scroll-view>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  .item {
    padding: 20rpx;
    background: #fff;
    .left {
      position: relative;
      width: 146rpx;
      height: 146rpx;
      border: 2rpx solid #f5f5f5;
      > text {
        position: absolute;
        right: 0;
        top: 0;
        padding: 0 10rpx;
        line-height: 40rpx;
        font-size: 22rpx;
        background: #ffd161;
      }
    }
    .right {
      .name {
        line-height: 50rpx;
      }
      .shop-time {
        display: inline-block;
        color: #fff;
        background: #25c88b;
        height: 40rpx;
        line-height: 40rpx;
        font-size: 24rpx;
        padding: 0 10rpx;
      }

      .shop-distance {
        color: #999;
        font-size: 24rpx;
      }

      .coupon-list {
        flex-wrap: wrap;
        > text {
          background: #fff8e1;
          line-height: 36rpx;
          color: #fd8023;
          font-size: 22rpx;
          padding: 0 10rpx;
          margin-right: 10rpx;
          margin-bottom: 10rpx;
        }
      }

      .scroll-box {
        white-space: nowrap;
        .scroll-item {
          display: inline-block;
          width: 180rpx;
          padding-right: 20rpx;
          .good-img {
            margin-bottom: 10rpx;
            width: 154rpx;
            height: 154rpx;
            border-radius: 10rpx;
          }
        }
      }
    }
  }
}
</style>
