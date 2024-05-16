<template>
  <div class="page-list">
    <div
      @click="$utils.toUrl('/auction/details/index?id=' + item.id)"
      class="page-item"
      v-for="(item, index) in catList"
      :key="index"
    >
      <div class="top">
        <image :src="item.auction_pic" mode="aspectFill" />
        <div class="time">
          <template v-if="item.status == 1">
            <view>
              {{ item.end_time | date('yyyy-mm-dd/hh:MM') }}
              <text>结束</text>
            </view>
            <view class="icon-bg">
              <div class="iconfont icon-V font-22 color-fff"></div>
            </view>
          </template>
          <template v-else-if="item.status == 0">
            <view :class="['color0']">
              {{ item.start_time | date('yyyy-mm-dd/hh:MM') }}
              <text>开始</text>
            </view>
            <view :class="['icon-bg',item.status == 0 && 'bgcolor0']">
              <div class="iconfont icon-V font-22 color-fff"></div>
            </view>
          </template>
        </div>

        <div
          class="status"
          :style="{
            background: item.status == 0 ? '#eafbfb' : '#ffecec',
          }"
        >
          <view :class="['icon-bg', item.status == 0 && 'bgcolor0']">
            <div class="iconfont icon-V font-22 color-fff"></div>
          </view>

          <view :class="['p-x-20', item.status == 0 && 'color0']">
            {{ item.status_text }}
          </view>
        </div>
      </div>
      <div class="bottom font-24">
        <view class="font-600-26 u-line-1 m-b-10">{{ item.gname }}</view>
        <view class="m-b-10 color-666"
          >底价/<text class="font-600-26 price-color"
            >￥{{ item.auction_price }}</text
          ></view
        >
        <view
          v-if="item.name && item.avatar_url"
          class="flex-y-center color-666"
        >
          <image
            class="user-pic"
            :src="item.avatar_url"
            mode="aspectFill"
          ></image>
          <text>{{ item.name }}</text>
        </view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['catList'],
};
</script>

<style lang="scss" scoped>
.color0 {
  color: #07bdbf !important;
}
.bgcolor0 {
  background: #07bdbf !important;
}
.page-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .page-item {
    background: #fff;
    margin-bottom: 20rpx;
    width: 344rpx;
    border-radius: 20rpx;
    overflow: hidden;
    &:nth-child(2n) {
      margin-left: 20rpx;
    }

    .top {
      position: relative;
      background: #f5f5f5;
      border-radius: 10rpx;

      > image {
        margin: auto;
        width: 340rpx;
        height: 340rpx;
      }
      .icon-bg {
        width: 30rpx;
        height: 30rpx;
        line-height: 30rpx;
        border-radius: 50%;
        background: red;
        text-align: center;
      }

      .time {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 70rpx;
        padding: 0 10rpx;

        font-size: 24rpx;

        background: #fff;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .status {
        position: absolute;
        top: 20rpx;
        left: 20rpx;
        background: #ffecec;
        border-radius: 10rpx;

        display: flex;
        align-items: center;
        font-size: 22rpx;
        color: red;
      }
    }
    .bottom {
      padding: 20rpx;
      background: #fff;

      .user-pic {
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }
    }
  }
}
</style>
