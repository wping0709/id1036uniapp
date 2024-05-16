<template>
  <view @click="$utils.toUrl('/pages/index/index')" class="fixed-home">
    <text class="iconfont icon-home font-50"></text>
  </view>
</template>

<script>
export default {};
</script>

<style scoped>
.fixed-home {
  position: fixed;
  right: 30rpx;
  bottom: 150rpx;
  bottom: calc(env(safe-area-inset-bottom) + 150rpx);
  background: #fe8496;
  border-radius: 50%;
  width: 80rpx;
  height: 80rpx;

  line-height: 80rpx;
  text-align: center;
  color: #fff;
}
</style>
