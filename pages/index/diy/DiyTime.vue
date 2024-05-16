<template>
  <view @click="$utils.toUrl(item.param.url)" class="diy-time">
    <view :class="'time-img time-img-' + (item.param.pic_url ? 1 : 0)">
      <image :src="item.param.pic_url" mode="widthFix" />
    </view>
    <view class="time-block">
      <view>
        <view v-if="diffTime(item.param.date_start) > 0">距离活动开始还有</view>
        <view v-else-if="diffTime(item.param.date_end) > 0"
          >距离活动结束还有</view
        >
        <view v-else>活动已结束</view>
        <view style="padding: 0">
          <u-count-down
            :time="dowTime"
            format="DD:HH:mm:ss"
            autoStart
            millisecond
            @change="onChange"
          >
            <view class="time">
              <text class="time__item">{{ timeData.days }}&nbsp;天</text>
              <text class="time__item"
                >{{
                  timeData.hours > 10 ? timeData.hours : '0' + timeData.hours
                }}&nbsp;时</text
              >
              <text class="time__item">{{ timeData.minutes }}&nbsp;分</text>
              <text class="time__item">{{ timeData.seconds }}&nbsp;秒</text>
            </view>
          </u-count-down>
        </view>
      </view>
      <view></view>
      <image :src="item.param.pic_url_1" alt="" />
    </view>
  </view>
</template>

<script>
export default {
  name: 'DiyTime',
  props: {
    item: Object,
  },
  data() {
    return {
      timeData: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
    };
  },
  computed: {
    // 时间转戳
    diffTime() {
      return function (date) {
        const time = new Date(date).getTime();
        const cTime = new Date().getTime();
        let result = time - cTime;
        return result > 0 ? result : 0;
      };
    },
    dowTime() {
      const startTime = new Date(this.item.param.date_start).getTime();
      const endTime = new Date(this.item.param.date_end).getTime();
      const currentTime = new Date().getTime();
      if (startTime > currentTime) {
        return startTime - currentTime;
      } else if (endTime > currentTime) {
        return endTime - currentTime;
      } else {
        return 0;
      }
    },
  },
  methods: {
    onChange(e) {
      this.timeData = e;
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;
.diy-time {
  width: 100%;
}
.time-img {
  width: 100%;
  background-color: #fff;
}

.block-default .time-img-0 {
  height: 0;
}

.time-img-1 {
  height: auto;
  padding-top: 0;
}

.time-img > image {
  width: 100%;
  height: auto;
}
.time-block {
  position: relative;
  color: #fff;
  width: 100%;
  height: 70 * $rpx;
  display: flex;
  align-items: center;
}
.time-block view {
  position: relative;
  z-index: 99;
  padding: 0 12 * $rpx;
}
.time-block image {
  width: 100%;
  height: 70 * $rpx;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
