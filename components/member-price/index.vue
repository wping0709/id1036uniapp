<template>
  <div
    v-if="memberPrice && store.is_member_price"
    class="member-price"
  >
    <text>￥{{ memberPrice }}</text>
    <image :src="wxapp_img.goods.icon_vip" mode="aspectFill" />
  </div>
</template>

<script>
export default {
  props: {
    memberPrice: {
      type: [String, Number],
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.member-price {

  height: 32rpx;
  line-height: 32rpx;
  display: inline-block;
  padding-left: 10rpx;
  border-radius: 6rpx;
  background: #ffe7cd;

  font-weight: 600;
  color: #3a2724;
  font-size: 22rpx;
  text {
    display: inline-block;
    transform: translateY(2rpx);
  }
  > image {
    width: 82rpx;
    height: 32rpx;
  }
}
</style>
