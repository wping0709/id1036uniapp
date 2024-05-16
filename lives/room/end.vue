<template>
  <view v-if="pageData" class="body">
    <view class="head">
      <view class="font-34">直播结束</view>
      <view>{{ (pageData.room_info.end_time - pageData.room_info.start_time) | timeF }}</view>
    </view>

    <div class="content">
      <div class="title">每天进步一点点，直播收货多一点！</div>
      <div class="content-total">
        <view class="item">
          <text class="font-32">{{ pageData.room_info.look_num }}</text>
          <text class="color-666 font-22">观看人数</text>
        </view>
        <view class="item">
          <text class="font-32">{{ pageData.room_info.good_num }}</text>
          <text class="color-666 font-22">点赞人数</text>
        </view>
      </div>
    </div>

    <div class="back-bt" @click="$utils.toUrl('/pages/index/index')">
      返回首页
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.lives.liveEnd({});
      this.pageData = res.data;
    },
  },
  computed: {},
  watch: {
    
  },
  filters: {
    timeF(val) {
      let h = parseInt(val / 60 / 60);
      h = h < 10 ? (h > 0 ? '0' + h : '00') : h;
      let d = parseInt(val / 60 % 60);
      d = d < 10 ? '0' + d : d;
      let s = val % 60;
      s = s < 10 ? '0' + s : s;
      return `${h}:${d}:${s}`;
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding: 30rpx;
  padding-bottom: 30rpx;
  padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
  background: #161823;
  min-height: 100vh;
  color: #fff;
  .content {
    margin-top: 70rpx;
    height: 336rpx;
    background-color: #242630;
    border-radius: 4rpx;
    .title {
      padding: 0 30rpx;
      line-height: 80rpx;
      border-bottom: 2rpx solid #333;
    }
    .content-total {
      display: flex;
      .item {
        width: 180rpx;
        height: 70rpx;
        margin-top: 30rpx;
        margin-left: 30rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        // align-items: center;
      }
    }
  }
  .back-bt {
    margin-top: 60rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    background: #fb2020;
    text-align: center;
    font-size: 30rpx;
  }
}
</style>
