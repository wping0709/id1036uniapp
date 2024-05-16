<template>
  <!-- 商品 -->
  <view class="flex-x-sb">
    <u-image
      :src="goodsItem.goods_pic"
      mode="aspectFill"
      width="170rpx"
      height="170rpx"
      radius="5rpx"
    />
    <view class="m-l-20 flex-w-1">
      <view class="goods-title u-line-2">
        {{ goodsItem.goods_name }}
      </view>

      <!-- 规格 -->
      <view class="font-24 color-999 u-line-1">
        <text v-for="(attr, index) in goodsItem.attr" :key="index">
          {{ attr.attr_group_name || '规格'}}：{{ attr.attr_name }}
        </text>
      </view>

      <!-- 数量及价格 -->
      <view class="flex-x-sb flex-y-center">
        <view class="color-999 font-24">x{{ goodsItem.num }}</view>
        <view class="font-right price-color">
          <view>￥{{ goodsItem.price }}</view>
          <view v-if="goodsItem.level_price" class=""
            >会员价格: ￥{{ goodsItem.level_price }}</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style></style>
