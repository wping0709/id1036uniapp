<template>
  <view>
    <view
      @click="$emit('clickGoods', goods)"
      class="goods flex-x-sb"
      v-for="(goods, goodsIndex) in goodsList"
      :key="goodsIndex"
    >
      <view style="width: 160rpx; height: 160rpx">
        <image
          :src="goods.goods_pic"
          mode="aspectFill"
          style="width: 100%; height: 100%; border-radius: 10rpx"
        />
      </view>

      <view class="goods-content">
        <view class="u-line-2 goods-name">
          {{ goods.goods_name }}
        </view>
        <!-- 规格 -->
        <view class="flex attr-num">
          <view class="flex-w-1 attr u-line-1">
            <text v-for="(attr, attrIndex) in goods.attr_list" :key="attrIndex">
              {{ attr.attr_group_name }}:{{ attr.attr_name }}
              <text
                style="margin: 0 10rpx"
                v-show="attrIndex < goods.attr_list.length - 1"
              >
                |
              </text>
            </text>
          </view>

          <view class="goods-num">x{{ goods.num }}</view>
        </view>

        <!-- 数量价格 -->
        <view class="price flex-y-center flex-x-sb">
          <view v-if="goods.price">￥<text>{{ goods.price }}</text></view>
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
  padding: 26rpx 0;
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
    .goods-name {
      height: 72rpx;
      font-size: 28rpx;
      font-weight: bold;
      line-height: 34rpx;
      color: #262626;
    }
    .attr-num {
      margin-top: 10rpx;
      font-size: 24rpx;
      line-height: 34rpx;
      color: #8c8c8c;
    }
    .price {
      margin-top: 14rpx;
      
      font-size: 24rpx;
      font-weight: bold;
      line-height: 34rpx;
      color: #262626;
      text {
        font-size: 32rpx;
      }
    }
  }
}
</style>
