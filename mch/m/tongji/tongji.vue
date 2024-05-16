<template>
  <view v-if="pageData" class="body">
    <view @click="show = true">
      <u-datetime-picker
        :show="show"
        :value="year + '-' + month"
        :maxDate="maxDate"
        mode="year-month"
        @cancel="show = false"
        @confirm="dateConfirm"
      ></u-datetime-picker>
      <view class="flex-y-center p-x-30 bg-fff">
        <view class="date-value flex-w-1">
          当前时间：{{ year + '年' + month + '月' }}
        </view>
        <view class="iconfont icon-arrow-right font-40"></view>
      </view>
    </view>

    <view class="total-box flex-y-center  p-x-30 p-y-20 bg-fff">
      <view class="flex-w-1 flex-col flex-x-center flex-y-center">
        <text>日均成交额</text>
        <text>{{pageData.daily_avg}}</text>
      </view>
      <view class="flex-w-1 flex-col flex-x-center flex-y-center">
        <text>当月成交额</text>
        <text>{{pageData.month_count}}</text>
      </view>
      <view class="flex-w-1 flex-col flex-x-center flex-y-center">
        <text>对比上月</text>
        <text>{{pageData.up_rate}}</text>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      year: '',
      month: '',
      maxDate: '',
      show: false,
    };
  },
  onLoad() {
    const date = new Date();
    this.year = date.getFullYear();
    var m = date.getMonth() + 1;
    this.month = m < 10 ? '0' + m : m;
    this.maxDate = date.getTime();
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.mch.tongjiMonthData({
        year: this.year,
        month: this.month,
      });
      this.pageData = res.data;
    },
    dateConfirm(e) {
      let { value } = e;
      console.log(e);
      console.log();
      var y = new Date(value).getFullYear();
      this.year = y;
      var m = new Date(value).getMonth() + 1;
      this.month = m < 10 ? '0' + m : m;
      this.show = false;
      this.loadData();
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  .date-value {
    line-height: 100rpx;
    font-size: 30rpx;
    font-weight: 700;
  }
  .total-box {
    margin-top: 2px;
    >view >text:nth-child(1) {
      margin-bottom: 4rpx;
      font-size: 30rpx;
      font-weight: 700;
    }
  }
}
</style>
