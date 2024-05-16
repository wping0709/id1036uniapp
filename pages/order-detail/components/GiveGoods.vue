<template>
  <div>
    <div class="goods-list">
      <view v-if="showTitle" class="font-w-700" style="padding-bottom: 24rpx"
        >订单赠送</view
      >
      <div>
        <div
          class="goods-item border-bottom"
          v-for="(item, index) in list"
          :key="index"
        >
          <img :src="item.cover_pic" />
          <div class="goods-mes">
            <div class="goods-name">{{ item.name }}</div>
            <div class="" style="color: red">{{ title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OrderGoods',
  props: {
    list: [Array],
    title: {
      type: String,
      default: '满减赠品',
    },
    showTitle: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.goods-list {
  border-radius: 20rpx;
  margin: 20rpx 24rpx;
  margin-bottom: 10px;
  background-color: #fff;
  padding: 24rpx 24rpx 0;
 
  .goods-item {
    font-size: 26rpx;
    padding-bottom: 12 * 2rpx;
    display: flex;
    justify-content: space-between;
    > img {
      width: 144rpx;
      height: 144rpx;
      border-radius: 10rpx;
    }
    .goods-mes {
      flex: 1;
      margin-left: 10 * 2rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-name {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        line-height: 20 * 2rpx;
        margin-bottom: 2 * 2rpx;
        height: 40 * 2rpx;
      }
    }
  }
}
</style>
