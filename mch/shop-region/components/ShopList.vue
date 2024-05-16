<template>
  <view class="list">
    <div class="item" v-for="(item, index) in list" :key="index">
      <view @click="$emit('onCheck', item)" class="content">
        <view class="flex-y-center">
          <image :src="item.pic_url" mode="" />

          <view class="name flex-w-1 u-line-1">
            {{ item.name }}
          </view>

          <view class="xuanze">选择</view>
        </view>

        <view class="flex">
          <view>到店自提</view>
        </view>

        <view class="flex-y-center color-666 font-24">
          <text class="iconfont icon-dingwei m-r-10"></text>
          <text>距离您{{item.juli}}km</text>
          <text class="m-x-10">|</text>
          <text class="flex-w-1 u-line-1">{{item.address}}</text>
        </view>

        <view v-if="item.shop_time" class="flex color-666 font-24">
          <text class="iconfont icon-dingwei m-r-10"></text>
          <view>
            <view>营业时间{{ item.shop_time }}</view>
            <view class="price-color">温馨提示: 到店前请先联系门店</view>
          </view>
        </view>
      </view>

      <div class="tbs">
        <view @click="onDaohang(item)" class="flex-x-center flex-y-center">
          <text class="iconfont icon-daohang"></text>
          导航到店
        </view>
        <view @click="makeMobile(item)" class="flex-x-center flex-y-center">
          <text class="iconfont icon-dianhua"></text>
          致电咨询
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
  methods: {
    onDaohang(item) {
      uni.openLocation({
        latitude: item.latitude - 0,
        longitude: item.longitude - 0,
        name: item.name,
        address: item.address,
      });
    },
    makeMobile(item) {
      uni.makePhoneCall({
        phoneNumber: item.mobile,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 20rpx 0;
  > view {
    padding: 0 20rpx;
  }
  .content {
    padding: 10rpx 20rpx 30rpx;
    > view {
      margin-bottom: 10rpx;
    }
    > view:nth-child(1) {
      > image {
        border-radius: 50%;
        width: 60rpx;
        height: 60rpx;
        margin-right: 20rpx;
      }
      .name {
        height: 34rpx;
        line-height: 34rpx;
        border-left: 8rpx solid red;
        padding-left: 10rpx;
      }
      .xuanze {
        font-size: 28rpx;
        width: 130rpx;
        line-height: 56rpx;
        background: #fde9e7;
        color: red;
        border-radius: 30rpx;
        text-align: center;
      }
    }

    > view:nth-child(2) {
      > view {
        line-height: 44rpx;
        padding: 0 10rpx;
        border-radius: 6rpx;
        border: 2rpx solid red;
        color: red;
      }
    }
  }

  .tbs {
    border-top: 2rpx solid #eee;
    display: flex;
    height: 100rpx;
    > view {
      position: relative;
      flex: 1;
      font-size: 30rpx;
      color: #666;
      .iconfont {
        font-size: 40rpx;
        margin-right: 10rpx;
      }
      &:nth-child(2)::after {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        height: 60rpx;
        border: 2rpx solid #eee;
      }
    }
  }
}
</style>
