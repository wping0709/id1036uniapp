<template>
  <view class="list">
    <view
      class="item flex-x-sb"
      @click="$utils.toUrl('/mch/shop/shop?mch_id=' + item.id)"
      v-for="(item, index) in list"
      :key="index"
    >
      <image :src="item.logo" mode="" />
      <view class="right flex-w-1 flex-col flex-x-sb">
        <view>{{ item.name }}</view>
        <view class="flex-y-center flex-x-sb">
          <view class="font-26 color-666">
            <text class="iconfont icon-dianhua color-666"></text>
            <text class="m-x-10">电话</text>
            {{ item.tel }}
          </view>
          <view @click.stop="$emit('onDel',item)" class="iconfont icon-ashbin1 font-50"> </view>
        </view>
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
  .item {
    background: #fff;
    padding: 20rpx 25rpx;
    > image {
      width: 140rpx;
      height: 140rpx;
    }
    .right {
      margin-left: 20rpx;
      > view {
        margin-bottom: 10rpx;
        &:nth-last-child(1) {
          margin-bottom: 0;
        }
      }
    }
  }
}
</style>
