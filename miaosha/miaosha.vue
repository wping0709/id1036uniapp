<template>
  <view v-if="miaoshaData" class="body flex-col">
    <view
      class="page-title"
      :style="{
        background:
          'url(' +
          wxapp_img.miaosha.miaosha_index_bg +
          ') 0% 0% / 100% no-repeat',
      }"
    >

      <!-- 秒杀时间 -->
      <scroll-view
        :scroll-left="scrollLeft"
        id="scroll-view"
        scroll-x
        class="scroll-view"
      >
        <div class="tabs">
          <view
            @click="clickTab(-1)"
            id="tab"
            class="tab"
            :class="[tabIndex == -1 && 'select-tab']"
            :style="{
              background: cpBgUrl(-1),
            }"
          >
            <view class="font-36 font-w-600"> 下一场 </view>
            <view class="font-26"> 预告 </view>
          </view>

          <view
            @click="clickTab(index)"
            :class="['tab', tabIndex == index && 'select-tab']"
            :style="{
              background: cpBgUrl(index),
            }"
            v-for="(item, index) in miaoshaData.list"
            :key="index"
          >
            <view class="font-36 font-w-600">
              {{ $u.timeFormat(item.begin_time, 'hh:MM') }}
            </view>
            <view class="font-26">
              <text v-if="item.status == 0">已结束</text>
              <text v-else-if="item.status == 1">进行中</text>
              <text v-else>即将开始</text>
            </view>
          </view>
        </div>
      </scroll-view>

      <view v-if="tabIndex != -1" class="time-msg flex-y-center p-x-20">
        <!-- <text class="price-color">限时限量，先到先得</text> -->
        <view>
          <text class="color-999" v-if="miaoshaData.list[tabIndex].status == 0">
            本场秒杀已结束
          </text>

          <view
            class="flex-y-center"
            v-else-if="miaoshaData.list[tabIndex].status == 1"
          >
            <text class="m-r-10 color-999">本场仅剩</text>
            <u-count-down
              :time="downTime(miaoshaData.list[tabIndex].end_time)"
              format="HH:mm:ss"
              @change="onChange"
            >
              <view class="time">
                <view class="time__custom">
                  <text class="time__custom__item">{{
                    timeData.hours >= 10 ? timeData.hours : '0' + timeData.hours
                  }}</text>
                </view>
                <text class="time__doc">:</text>
                <view class="time__custom">
                  <text class="time__custom__item">{{
                    timeData.minutes >= 10
                      ? timeData.minutes
                      : '0' + timeData.minutes
                  }}</text>
                </view>
                <text class="time__doc">:</text>
                <view class="time__custom">
                  <text class="time__custom__item">{{
                    timeData.seconds >= 10
                      ? timeData.seconds
                      : '0' + timeData.seconds
                  }}</text>
                </view>
              </view>
            </u-count-down>
          </view>

          <view
            class="flex-y-center price-color"
            v-if="miaoshaData.list[tabIndex].status == 2"
          >
            <text class="m-r-10 color-999">距离开始</text>
            <u-count-down
              :time="downTime(miaoshaData.list[tabIndex].begin_time)"
              format="HH:mm:ss"
              @change="onChange"
            >
              <view class="time">
                <view class="time__custom">
                  <text class="time__custom__item">{{
                    timeData.hours >= 10 ? timeData.hours : '0' + timeData.hours
                  }}</text>
                </view>
                <text class="time__doc">:</text>
                <view class="time__custom">
                  <text class="time__custom__item">{{
                    timeData.minutes >= 10
                      ? timeData.minutes
                      : '0' + timeData.minutes
                  }}</text>
                </view>
                <text class="time__doc">:</text>
                <view class="time__custom">
                  <text class="time__custom__item">{{
                    timeData.seconds >= 10
                      ? timeData.seconds
                      : '0' + timeData.seconds
                  }}</text>
                </view>
              </view>
            </u-count-down>
          </view>
        </view>
      </view>

      <view class="head-time flex-y-center" v-else>
        <!-- <view class="iconfont icon-miaosha"></view> -->
        <view class="right">
          <view>
            <text>当前无秒杀商品</text>
          </view>
          <view v-if="miaoshaData.next_list.time" class="">
            下一场于
            <text class="price-color m-x-10">
              {{ miaoshaData.next_list.time }}
            </text>
            开始
          </view>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="flex-h-1">
      <div class="p-x-24" v-for="(goods, i) in list" :key="i">
        <Goods :goods="goods"></Goods>
        <view v-if="i < list.length - 1" class="line"></view>
      </div>
      <u-loadmore status="nomore"></u-loadmore>

      <view class="env-bottom"></view>
    </scroll-view>

  </view>

  <view class="body" v-else>
    <u-empty mode="data" :icon="wxapp_img.empty_data">
    </u-empty>
  </view>
</template>
<script>
import Goods from './components/goods.vue';
export default {
  components: {
    Goods,
  },
  data() {
    return {
      timeData: {},
      miaoshaData: '',
      goodsList: '',
      tabIndex: -2,
      scrollLeft: 0, //tab滚动条位置
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    SETTITLE() {
      console.log('不设置顶部标题样式');
    },
    onChange(e) {
      uni.$u.throttle(() => {
        this.timeData = e;
      }, 500);
    },
    async loadData() {
      const res = await this.$requestAll.miaosha.list({}, true);
      if (res.data.next_list.list && !res.data.next_list.list.length) {
        return uni.showModal({
          title: '提示',
          content: '暂无秒杀活动返回首页?',
          success: res => {
            if (res.confirm) {
              // console.log('用户点击确定');
              this.$utils.backTo();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      }
      // 查找正在进行中索引
      let index = res.data.list.findIndex(date => date.status == 1);
      // 查找即将开始索引
      if(index == -1) index = res.data.list.findIndex(data => data.status == 2)
      this.tabIndex = index
      this.miaoshaData = res.data;

      if (!res.data.list.length) return;
      this.getGoodsList();
    },
    async getGoodsList() {
      const res = await this.$requestAll.miaosha.goodsList(
        {
          time:
            this.tabIndex == -1
              ? new Date().getHours()
              : this.miaoshaData.list[this.tabIndex].start_time,
          page: 1,
        },
        true
      );

      this.goodsList = res.data.list;
    },
    clickTab(i) {
      this.tabIndex = i;
      this.getGoodsList();
    },
  },
  onShow() {},
  computed: {
    downTime() {
      return function (data) {
        if (data) {
          let time = new Date().getTime();
          return data * 1000 - time;
        }
        return 0;
      };
    },
    list() {
      if (this.tabIndex == -1) {
        if (this.miaoshaData) {
          return this.miaoshaData.next_list.list;
        }
      } else {
        if (this.goodsList) {
          return this.goodsList;
        }
      }

      return [];
    },
    // 计算背景图片在选中时赋值
    cpBgUrl() {
      return function (i) {
        if (this.tabIndex == i) {
          return `url(${this.wxapp_img.miaosha.miaosha_index_tab}) 0% 0% / 100% 100% no-repeat`;
        }
        return '';
      };
    },
  },
  watch: {
    tabIndex: {
      handler(v) {
        this.$nextTick(() => {
          this.$uGetRect('#tab').then(res => {
            let tabW = res.width;
            this.$uGetRect('#scroll-view').then(res => {
              // 全部tab宽度卷入  -  总宽度的一半  = 当前元素最右侧是居中 - tab单个宽度的一半  = 当前元素中间居中
              this.scrollLeft = (v + 2) * tabW - res.width / 2 - tabW / 2;
            });
          });
        });
      },
      immediate: true,
    },
  },
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #fff;
  height: 100vh;
  /deep/.u-line-progress__line {
    min-width: 28rpx;
  }

  .head {
    font-size: 30rpx;

    .top {
      height: 100rpx;
      line-height: 100rpx;

      .left {
        position: relative;
        width: 150rpx;
        height: 100%;
        background: #ff4544;

        text-align: center;
        color: #fff;
        font-size: 32rpx;

        &::before {
          content: '';
          position: absolute;
          left: 50%;
          top: 100%;
          transform: translate(-50%);
          border: 16rpx solid transparent;
          border-top-color: #ff4544;
        }
      }

      .right-333 {
        height: 100%;
        background: #30353c;
      }
    }
  }

  .head-time {
    padding: 0 24rpx;

    > .iconfont {
      margin: 0 70rpx 0 40rpx;
      font-size: 60rpx;
    }

    height: 180rpx;

    background: #fff;

    .right {
      > view:nth-child(2) {
        margin-top: 10rpx;
        color: #999;
      }
    }
  }

  .scroll-view {
    width: calc(100vw - 48rpx);
    margin: 28rpx auto 0;
    .tabs {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;

      .tab {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        min-width: calc(25vw - 12rpx);
        height: 96rpx;
        color: #fff;
      }

      .select-tab {
        color: #ff1b22;
        background-size: contain;
      }
    }
  }

  .time-msg {
    background: #fff;
    padding: 30rpx 24rpx;
    font-size: 24rpx;
    .price-color {
      color: #ff4544;
    }
  }

  .line {
    height: 1px;
    width: 490rpx;
    background: #f8f8f8;
    // background: red;
    margin: 24rpx 0;
    margin-left: auto;
  }
}

.time {
  display: flex;
  align-items: center;
  .time__custom {
    width: 36rpx;
    height: 36rpx;
    background: #ff1b22;
    border-radius: 8rpx;

    display: flex;
    justify-content: center;
    align-items: center;

    &__item {
      color: #fff;
      font-size: 22rpx;
      font-weight: 600;
    }
  }

  .time__doc {
    padding: 0px 8rpx;
    font-weight: 700;
    color: #ff1b22;
  }
}
</style>
