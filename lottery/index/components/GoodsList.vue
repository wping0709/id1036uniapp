<template>
  <div class="list">
    <div
      @click="$utils.toUrl('/lottery/goods/goods?id=' + item.id)"
      class="item flex"
      v-for="(item, i) in goodsList"
      :key="i"
    >
      <div class="left">
        <image :src="item.goods.cover_pic" mode="aspectFill"></image>
        <div class="num">{{ item.num }}人参与</div>
      </div>
      <div class="right flex-w-1">
        <view class="u-line-2 m-b-10 goods-name">{{ item.goods.name }}</view>
        <view class="m-b-10 color-999">
          <div v-if="!isStart(item.start_time_text)">
            开始时间: {{ item.start_time_text }}
          </div>
          <div v-else>结束时间: {{ item.end_time_text }}</div>
          <!-- <u-count-down
            :time="cpDown(item.end_time)"
            format="距离结束: DD日 HH时 mm分"
            autoStart
            millisecond
          >
          </u-count-down> -->
        </view>
        <view class="">共{{ item.stock }}份</view>
        <view class="flex-x-sb flex-y-center">
          <view class="flex-w-1">
            <text class="price-color m-r-10">￥0</text>
            <text class="font-del">原价￥{{ item.original_price }}</text>
          </view>
          <!-- 是否已开始 -->
          <template v-if="item.is_ing">
            <view
              v-if="item.status"
              class="goods-bt"
              @click.stop="$emit('onLottery', item)"
            >
              {{ "立即抽奖" }}
            </view>
            <view v-else :style="{ background: '#666' }" class="goods-bt">
              {{ "已参与" }}
            </view>
          </template>
          
          <view v-else :style="{ background: '#666' }" class="goods-bt">
            {{ "暂未开始" }}
          </view>
        </view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    goodsList: {
      type: Array,
      default() {
        return {};
      },
    },
  },
  computed: {
    cpDown() {
      return function (endtime) {
        if (endtime) {
          let cTime = Math.round(new Date() / 1000);
          return (endtime - cTime) * 1000;
        }
        return 0;
      };
    },
    isStart() {
      return function (startDate) {
        let cTime = Number(new Date());
        let time = Number(new Date(startDate));
        return cTime > time;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  .item {
    padding: 20rpx;
    background: #fff;
    margin-bottom: 20rpx;

    .left {
      margin-right: 20rpx;
      position: relative;

      > image {
        width: 220rpx;
        height: 220rpx;
        border-radius: 10rpx;
      }

      .num {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 0 20rpx 20rpx 0;
        background: #ffe4e7;
        padding: 0 10rpx;
        color: red;
      }
    }

    .right {
      .goods-name {
        line-height: 38rpx;
        height: 76rpx;
      }

      .goods-bt {
        line-height: 1.8;
        border-radius: 25rpx;
        background: #ff4544;
        color: #ffffff;
        padding: 0 20rpx;
      }
    }
  }
}
</style>
