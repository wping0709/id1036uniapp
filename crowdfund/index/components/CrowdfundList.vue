<template>
  <div class="list" v-if="list">
    <view class="m-b-20" v-for="(item, index) in list" :key="index">
      <div @click="$utils.toUrl('/crowdfund/details/index?id=' + item.id)" v-if="index == 0" class="item">
        <view class="item-top">
          <image :src="item.cover_pic" mode="aspectFill" />
          <div class="top-content">
            <view class="crowdfund-info_box">
              <view class="flex-y-center">
                <text class="iconfont icon-yonghu font-24"></text>
                <text class="m-l-10 font-24">支持{{ item.people_num }}</text>
              </view>
              <view class="flex-y-center">
                <text class="iconfont icon-dashang font-24"></text>
                <text class="m-l-10 font-24"
                  >指出{{ item.had_crowdfund_price }}</text
                >
              </view>
              <view class="flex-y-center">
                <text class="iconfont icon-shijian font-24"></text>
                <text class="m-l-10 font-24">指出{{ item.percentage }}%</text>
              </view>
            </view>
            <view class="p-x-30 m-t-20">
              <u-line-progress
                :percentage="item.percentage"
                :showText="false"
                activeColor="#ffdb02"
                inactiveColor="#f2f2f2"
                height="6rpx"
              ></u-line-progress>
            </view>
          </div>
        </view>

        <div class="item-content flex p-20">
          <view
            class="u-line-2 flex-group-1 font-600-36"
            style="height: 80rpx; line-height: 40rpx"
          >
            {{ item.name }}
          </view>
          <view style="line-height: 40rpx;" class="font-600-40 price-color flex-group-0 m-l-20"
            >￥{{ item.price }}</view
          >
        </div>
      </div>
      <div @click="$utils.toUrl('/crowdfund/details/index?id=' + item.id)" v-if="index > 0" class="item">
        <view class="item-top">
          <image :src="item.cover_pic" mode="aspectFill" />
        </view>
        <view class="item-content p-x-10">
          <div class="item-name u-line-1 m-y-10">{{ item.name }}</div>
          <div class="item-price font-600-34 m-b-10 price-color">
            ￥{{ item.price }}
          </div>
          <div class="item-num flex-y-center p-b-20">
            <view class="flex-y-center font-24">
              <text class="iconfont icon-yonghu font-24"></text>
              <text>{{ item.people_num }}</text>
            </view>
            <view class="m-l-20 font-24 flex-y-center">
              <text class="iconfont icon-dashang font-24"></text>
              <text>{{ item.had_crowdfund_price }}</text>
            </view>
          </div>
        </view>
      </div>
    </view>
  </div>
</template>

<script>
export default {
  props: ['list'],
};
</script>

<style lang="scss" scoped>
.list {
  padding: 0 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  > view {
    .item {
      background: #fff;
      border-radius: 10rpx;
      width: 345rpx;

      .item-top {
        width: 100%;
        height: 345rpx;
        > image {
          width: 100%;
          height: 100%;
        }
      }
    }
    &:nth-child(1) {
      margin-top: 20rpx;
      width: 100%;
      .item {
        width: 100%;
        .item-top {
          position: relative;
          width: 100%;
          height: 480rpx;
          .top-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 140rpx;
            background: linear-gradient(0deg, #000000, rgba(0, 0, 0, 0));
            .crowdfund-info_box {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 60rpx 30rpx 0;
              color: #fff;
              font-size: 24rpx;
            }
          }
        }
      }
    }
  }
}
</style>
