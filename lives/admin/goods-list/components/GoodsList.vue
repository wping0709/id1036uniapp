<template>
  <view class="list">
    <div class="item flex" v-for="(item, index) in list" :key="index">
      <div class="left">
        <image :src="item.cover_pic" mode="" />
        <div class="index">{{ index + 1 }}</div>
      </div>
      <div class="right flex-w-1 flex-col">
        <view class="goods-title u-line-2">{{ item.name }}</view>
        <view class="flex-col flex-h-1 flex-x-sb">
          <view class="price-num flex-y-center">
            <text class="price-color">
              ￥ <text class="font-32">{{ item.price }}</text>
            </text>
            <text class="color-999 m-l-20"
              >剩余{{ item.goods_num }}{{ item.unit }}</text
            >
          </view>
          <view class="flex-y-center flex-x-sb">
            <text class="font-24" style="color: #ff7e00"
              >佣金￥{{ item.reward }}</text
            >
            <view  @click="$emit('switchAdd', item, index)" :class="!item.is_add && 'add-bt'" class="goods-bt">{{
              item.is_add ? '移出' : '添加'
            }}</view>
          </view>
        </view>
      </div>
    </div>
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
    padding: 30rpx 20rpx;
    background: #fff;
    border-bottom: 2rpx solid #eee;
    .left {
      position: relative;
      width: 220rpx;
      height: 220rpx;
      > image {
        border-radius: 20rpx;
        width: 100%;
        height: 100%;
      }
      .index {
        position: absolute;
        left: 0;
        top: 0;
        background: #444;
        border-radius: 20rpx 0 20rpx 0;
        padding: 0 20rpx;
        line-height: 40rpx;
        font-size: 22rpx;
        color: #fff;
      }
    }
    .right {
      margin-left: 20rpx;
      .goods-bt {
        line-height: 44rpx;
        padding: 0 30rpx;
        border: 2rpx solid #999;
        border-radius: 25rpx;
        font-size: 26rpx;
        color: #999;
      }
      .add-bt {
        border-color: #FB2020;
        color: #FB2020;
      }

      .goods-title {
        margin-bottom: 10rpx;
        font-size: 30rpx;
        line-height: 44rpx;
        height: 88rpx;
      }
    }
  }
}
</style>
