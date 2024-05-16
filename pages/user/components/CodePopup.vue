<template>
  <view>
    <u-popup
      :show="show"
      mode="center"
      round="10px"
      :safeAreaInsetBottom="false"
      @close="$emit('update:show', false)"
    >
      <div class="popup-box">
        <div class="title">{{ title }}</div>
        <div>
          <image class="code-img" :src="imgUrl" mode="aspectFit" />
        </div>
      </div>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '取件码',
    },
    imgUrl: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-box {
  width: 80vw;
  .title {
    line-height: 100rpx;
    font-size: 32rpx;
    text-align: center;
    font-weight: 600;
  }
  .code-img {
    display: block;
    margin: 0 auto;
    width: 80vw;
    height: 80vw;
  }
}
</style>
