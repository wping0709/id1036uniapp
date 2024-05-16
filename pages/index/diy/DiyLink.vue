<template>
  <view @click="$utils.toUrl(param.url)" class="diy-link" :style="{backgroundColor: param.backgroundColor}">
    <view class="diy-link-img" v-if="param.is_icon" :style="{left: param.position / 2 + 'px'}">
      <image :src="param.icon" mode="heightFix" alt="">
    </view>
    <view class="diy-link-title" :style="{left: param.left / 2 + 'px', color: param.color}">
      {{param.name}}
    </view>
    <view class="diy-link-right" v-if="param.is_jiantou">
      <text class="iconfont icon-arrow-right color-999"></text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DiyLink',
  props: {
    param: Object
  }
}
</script>

<style lang="scss" scoped>
$rpx: 2rpx;
.diy-link {
  height: 40 * $rpx;
  position: relative;
}
.diy-link-img {
  position: absolute;
  top: 50%;
  height: 100%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
}
.diy-link-img image {
  height: 50%;
  width: auto;
  display: block;
}
.diy-link-title {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  height: 100%;
  font-size: 15 * $rpx !important;
  font-weight: bold !important;
}
.diy-link-right {
  position: absolute;
  right: 10 * $rpx;
  top: 50%;
  transform: translateY(-50%);
}
.diy-link-right image {
  width: 5 * $rpx;
  height: auto;
}
</style>

