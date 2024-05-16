<template>
  <view class="list">
    <view class="item" @click="$utils.toUrl('/mch/shop/shop?mch_id=' + item.id)" v-for="(item, index) in list" :key="index">
      <image :src="item.logo" mode="" />
      <view class="font-30 font-center u-line-1 m-y-10 p-x-10">
        {{ item.name }}
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
  display: flex;
  flex-wrap: wrap;
  padding: 0 10rpx;
  .item {
    width: 360rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background: #fff;
    margin-bottom: 10rpx;
    &:nth-child(2n + 1) {
      margin-right: 10rpx;
    }
    > image {
      display: block;
      width: 360rpx;
      height: 360rpx;
    }
  }
}
</style>
