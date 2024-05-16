<template>
  <view class="body m-y-20">
    <view class="flex-x-sb flex-y-center">
      <view class="flex-y-center">
        <text class="iconfont icon-hot" style="color: #f00"></text>
        <text class="m-l-10 font-w-26">整点秒杀</text>
      </view>
      <view @click="$utils.toUrl('/miaosha/miaosha')" class="flex-y-center">
        <view>更多好货限时抢购</view>
        <text
          class="iconfont icon-arrow-right font-20 color-666"
          style="padding-top: 8rpx"
        ></text>
      </view>
    </view>

    <view class="flex-y-center m-y-20">
      <text class="font-24 color-999 m-r-10">{{ currentH }}点场 </text>
      <template v-if="downTime > 0">
        <text>距离下场</text>
        <u-count-down
          :time="downTime"
          format="HH:mm:ss"
          autoStart
          millisecond
          @change="onChange"
        >
          <view class="time">
            <view class="time__custom">
              <text class="time__custom__item">{{
                timeData.hours > 10 ? timeData.hours : "0" + timeData.hours
              }}</text>
            </view>
            <text class="time__doc">:</text>
            <view class="time__custom">
              <text class="time__custom__item">{{
                timeData.minutes > 10
                  ? timeData.minutes
                  : "0" + timeData.minutes
              }}</text>
            </view>
            <text class="time__doc">:</text>
            <view class="time__custom">
              <text class="time__custom__item">{{
                timeData.seconds > 10
                  ? timeData.seconds
                  : "0" + timeData.seconds
              }}</text>
            </view>
          </view>
        </u-count-down>
      </template>
    </view>
    <u-scroll-list :indicator="false">
      <template v-if="list.length">
        <view
          @click="$utils.toUrl(item.page_url)"
          class="scroll-item m-r-10"
          v-for="(item, index) in list"
          :key="index"
        >
          <view>
            <u-image
              :src="item.pic_url"
              width="150rpx"
              height="150rpx"
              radius="10rpx"
            ></u-image>
          </view>
          <view class="p-t-10 font-22 font-center">
            <view class="price-color">￥{{ item.price }}</view>
            <view class="font-del font-20">￥{{ item.original_price }}</view>
          </view>
        </view>
        <view
          @click="$utils.toUrl('/miaosha/miaosha')"
          class="scroll-item m-r-10 more"
        >
          <text class="font-24 color-999">查看更多</text>
          <view class="iconfont icon-arrow-right font-24 color-999"></view>
        </view>
      </template>
      <template v-else>
        <view class="font-center color-999 font-30 flex-w-1">暂无秒杀商品</view>
      </template>
    </u-scroll-list>
  </view>
</template>

<script>
export default {
  name: "DiyMiaosha",
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  data() {
    return {
      list: [],
      timeData: {
        hours: 0,
        minutes: 0,
        seconds: 0,
      },
      downTime: 0,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      console.log("loadData");
      const formData = {
        num: this.param.show_num,
      };
      const res = await this.$requestAll.default.getDefatuleH(formData);
      this.list = res.data.goods_list;
      this.downTime = res.data.next * 1000 - new Date().getTime();
    },
    onChange(e) {
      this.timeData = e;
    },
  },
  computed: {
    currentH() {
      const date = new Date();
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      return h;
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  margin: 0 24rpx;
  padding: 20rpx;
  padding-bottom: 10rpx;
  border-radius: 20rpx;
  background: #fff;

  .scroll-item {
    display: inline-block;
    text-align: center;
  }
  .more {
    width: 66rpx;
    background: #eee;
    padding: 20rpx;
    border-radius: 10rpx;
    .icon-arrow-right {
      margin-top: 10rpx;
      margin-left: -6rpx;
    }
  }
}

.time {
  @include flex;
  align-items: center;

  &__custom {
    width: 30rpx;
    height: 30rpx;
    background-color: #fc3e2d;
    border-radius: 4rpx;
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    justify-content: center;
    align-items: center;

    &__item {
      color: #fff;
      font-size: 20rpx;
      text-align: center;
    }
  }

  &__doc {
    color: #333;
    padding: 0px 4rpx;
  }

  &__item {
    color: #606266;
    font-size: 15px;
    margin-right: 4px;
  }
}
</style>
