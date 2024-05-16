<template>
  <view
    v-if="item.title"
    @click="$utils.toUrl('/other/topic/topic?id=' + item.id)"
    class="zhongshi"
  >
    <view class="u-line-2 m-b-10">
      {{ item.title }}
    </view>
    <view class="zhongshi-img">
      <image :src="item.cover_pic" mode="widthFix" />
    </view>
    <view class="m-t-10 font-24 color-999"> {{ item.read_count }} </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.zhongshi {
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  .zhongshi-img {
    text-align: center;
    > image {
      width: 100%;
      min-height: 300rpx;
      max-height: 400rpx;
    }
  }
}
</style>
