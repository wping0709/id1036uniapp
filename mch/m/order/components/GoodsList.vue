<template>
  <view>
    <view
      @click="$emit('clickGoods', goods)"
      class="goods flex-x-sb"
      v-for="(goods, goodsIndex) in goodsList"
      :key="goodsIndex"
    >
      <view style="width: 156rpx; height: 156rpx">
        <image
          :src="goods.cover_pic"
          mode="aspectFill"
          style="width: 100%; height: 100%"
        />
      </view>

      <view class="goods-content">
        <view class="u-line-2">
          {{ goods.name }}
        </view>
        <!-- 规格 -->
        <view class="attr u-line-2">
          <span v-for="(attr, attrIndex) in goods.attr" :key="attrIndex">
            {{ attr.attr_group_name }}:
            {{ attr.attr_name }}
            <span
              style="margin: 0 10rpx"
              v-show="goods.attr_list && attrIndex < goods.attr_list.length - 1"
              >|</span
            >
          </span>
        </view>

        <!-- 数量价格 -->
        <view class="price flex-y-center flex-x-sb">
          <view>x{{ goods.num || '1'}}</view>
          <view class="price-color">￥{{goods.total_price}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    goodsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="less" scoped>
.goods {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e5e5e5;
  &:nth-last-child(1) {
    padding-bottom: 0;
    border: 0;
  }
  .goods-content {
    font-size: 28rpx;
    margin-left: 20rpx;
    width: 0;
    flex: 1;
    > view:nth-child(1) {
      line-height: 34rpx;
      height: 68rpx;
    }
    .attr {
      line-height: 28rpx;
      height: 56rpx;
      font-size: 24rpx;
      color: #999;
      margin: 6rpx 0;
    }
    .price {
      font-size: 24rpx;
      line-height: 34rpx;
      > view:nth-child(2) {
        color: #f00;
        font-size: 30rpx;
      }
    }
  }
}
</style>
