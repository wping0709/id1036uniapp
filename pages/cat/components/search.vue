<template>
  <view @click="$utils.toUrl('/pages/search/search')" class="search-box flex-y-center">
    <view class="input-box">
      <text class="iconfont icon-search"></text>
      搜索
    </view>
  </view>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.search-box {
  background: #f5f5f5;
  height: 90rpx;
  .input-box {
    margin: auto;
    width: 650rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: #fff;
    border-radius: 10rpx;
    color: #999;
    text-align: center;
  }
}
</style>
