<template>
  <view class="list">
    <div
      @click="$utils.toUrl('/pages/goods/goods?id=' + good.id)"
      class="item"
      v-for="(good, i) in list"
      :key="i"
    >
      <image :src="good.cover_pic" mode="aspectFill" />
      <view class="name u-line-1 m-b-10 font-30">{{ good.name }}</view>
      <div v-if="good.is_level == 1">
        <MemberPrice :memberPrice="good.goods_member_price"></MemberPrice>
      </div>
      <view class="price-color p-b-20">
        <text>￥</text>
        <text class="font-600-36">{{ good.price }}</text>
      </view>
    </div>
  </view>
</template>

<script>
import MemberPrice from "@/components/member-price";
export default {
  components: {
    MemberPrice,
  },
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
  .item {
    width: 350rpx;
    margin-bottom: 16rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background: #fff;
    &:nth-child(2n + 1) {
      margin-right: 10rpx;
    }
    > view {
      padding-left: 10rpx;
      padding-right: 10rpx;
    }
    > image {
      display: block;
      width: 350rpx;
      height: 350rpx;
    }
  }
}
</style>
