<template>
  <div class="list">
    <view
      class="zhibo-item flex"
      v-for="(item, index) in liveList"
      :key="index"
      @click="$utils.toUrl('/lives/live/live?room_id=' + item.id)"
    >
      <view class="left-img-box">
        <image :src="item.pic_url" mode="aspectFill" />
        <view class="top flex-y-center">
          <view v-if="item.end_time"> 回放 </view>
          <view style="background: #7a94fe" v-else-if="item.pre_play_time">
            预约
          </view>
          <view style="background: #ff5174" v-else>直播中</view>

          <view>{{ item.look_num }}</view>
        </view>

        <div class="zan flex-col flex-x-center flex-y-center">
          <text class="iconfont icon-dianzan color-fff m-b-10"></text>
          <text>{{ item.good_num }}</text>
        </div>
      </view>
      <view class="right-content m-l-20 flex-w-1">
        <view class="title font-30 m-b-20 u-line-1">{{ item.desc }}</view>
        <view class="flex-y-center">
          <image :src="item.avatar_url" mode="" />
          <text class="u-line-1 flex-w-1 color-999 font-24">{{
            item.user_nickname
          }}</text>
        </view>

        <view v-if="item.goods.length" class="m-t-30">
          <view>
            <image :src="item.goods[0].cover_pic" mode="" />
            <view>￥{{ item.goods[0].price }}</view>
          </view>
          <view v-if="item.goods.length > 1">
            <image :src="item.goods[1].cover_pic" mode="" />
            <view>+{{ item.goods.length }}</view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
export default {
  props: {
    liveList: {
      type: Array,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.zhibo-item {
  border-radius: 20rpx;
  background-color: #fff;
  padding: 20rpx;

  margin-bottom: 20rpx;
  height: 100%;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
  .left-img-box {
    position: relative;
    > image {
      width: 300rpx;
      height: 300rpx;
      border-radius: 10rpx;
    }
    > .top {
      position: absolute;
      top: 20rpx;
      left: 20rpx;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 20rpx;
      font-size: 22rpx;
      color: #fff;
      > view:nth-child(1) {
        border-radius: 20rpx;
        background: #41cbdd;
        padding: 0 10rpx;
        left: 40rpx;
      }
      > view:nth-child(2) {
        padding: 0 20rpx;
      }
    }
    > .zan {
      position: absolute;
      bottom: 20rpx;
      right: 20rpx;
      font-size: 20rpx;
      color: #fff;
    }
  }

  .right-content {
    > view:nth-child(2) {
      > image {
        margin-right: 20rpx;
        width: 50rpx;
        height: 50rpx;
        border-radius: 50%;
      }
    }
    > view:nth-child(3) {
      > view {
        margin-right: 20rpx;
        display: inline-block;

        position: relative;
        width: 140rpx;
        height: 140rpx;
        border-radius: 10rpx;
        overflow: hidden;
        &:nth-child(2) {
          margin-right: 0;
          > view {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 28rpx;
          }
        }

        > image {
          width: 100%;
          height: 100%;
        }
        > view {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(0, 0, 0, 0.5);
          line-height: 40rpx;
          font-size: 20rpx;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
}
</style>
