<template>
  <view class="list">
    <view @click="$utils.toUrl('/other/topic/topic?id=' + item.id)" v-for="(item, index) in list" :key="index" class="flex-x-sb beiou">
      <view class="left m-r-20 flex-w-1 flex-col flex-x-sb">
        <view class="u-line-2">
          {{ item.title }}
        </view>
        <view class="font-24 color-999"> {{ item.read_count }}人浏览 </view>
      </view>
      <view class="right">
        <image :src="item.cover_pic" mode="aspcetFit" />
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
.beiou {
  margin-top: 20rpx;
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  .right {
    > image {
      width: 290rpx;
      height: 220rpx;
      border-radius: 10rpx;
    }
  }
}
</style>
