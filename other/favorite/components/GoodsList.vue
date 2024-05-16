<template>
  <view class="list">
    <view @click="$utils.toUrl('/pages/goods/goods?id='+item.goods_id)" class="item" v-for="(item, index) in list" :key="index">
      <view>
        <image :src="item.goods_pic" mode="" />
      </view>
      <view class="m-x-10">
        <view class="u-line-1 font-30 m-y-10">
          {{ item.name }}
        </view>
        <view class="font-center price-color"> ￥ {{ item.price }} </view>
      </view>
    </view>
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
  padding: 0 10rpx;
  display: flex;
  flex-wrap: wrap;
  .item {
    border-radius: 10rpx;
    background: #fff;
    overflow: hidden;
    width: 360rpx;
    margin-bottom: 10rpx;
    image {
      width: 100%;
      height: 360rpx;
    }

    &:nth-child(2n + 1) {
      margin-right: 10rpx;
    }
  }
}
</style>
