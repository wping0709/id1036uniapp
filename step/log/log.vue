<template>
  <view v-if="pageData" class="page-body">
    <div
      :style="{
        background: `url(${wxapp_img.step.log_bg}) 0% 0% / 100% 100% no-repeat`,
      }"
      class="header"
    >
      <view class="font-center">
        <view class="p-t-50">
          <view class="font-600-60">{{ pageData.info.currency }}</view>
          <view class="font-26">总获得奖励</view>
        </view>
        <view class="flex-y-center flex-x-sa font-40 m-t-30">
          <view>
            <view>{{ pageData.info.total_bout }}</view>
            <view class="font-26">参赛次数</view>
          </view>
          <view>
            <view>{{ pageData.info.bout }}</view>
            <view class="font-26">达标次数</view>
          </view>
          <view>
            <view>{{ pageData.info.bout_ratio }}%</view>
            <view class="font-26">达标率</view>
          </view>
        </view>
      </view>
    </div>

    <div class="list">
      <view class="p-y-20 font-30 color-666"> 参赛记录 </view>
      <div class="item" v-for="(item, i) in pageData.list" :key="i">
        <view class="flex-y-center flex-x-sb">
          <view>{{ item.name }} {{ item.step_num }}步挑战赛</view>
          <view class="title-status">
            <template v-if="item.open_date <= time && item.log_status == 2"
              >待结算</template
            >
            <template v-if="item.open_date <= time && item.log_status == 3"
              >未达标</template
            >
            <template v-if="item.open_date <= time && item.log_status == 1"
              >已结算</template
            >
            <template v-if="item.open_date > time">未开始</template>
          </view>
        </view>
        <view class="flex-y-center flex-x-sa m-t-20">
          <view class="font-center">
            <view class="font-60" style="color: #ff9d1e">{{
              item.user_num
            }}</view>
            <view class="color-666">完成步数</view>
          </view>
          <view class="font-center">
            <view class="font-60" style="color: #ff9d1e">{{
              item.user_currency
            }}</view>
            <view class="color-666">奖励金额</view>
          </view>
        </view>
      </div>
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
      const res = await this.$requestAll.step.defaultActivityLog({}, true);
      this.pageData = res.data;
    },
  },
  computed: {
    time() {
      return uni.$u.date(new Date(), 'yyyy-mm-dd');
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;
  background: #f5f5f5;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */

  .header {
    height: 408rpx;
    color: #fff;
  }
  .list {
    padding: 0 20rpx;
    .item {
      margin-bottom: 20rpx;
      padding: 30rpx;
      border-radius: 20rpx;
      background: #fff;
      .title-status {
        padding: 4rpx 10rpx;
        font-size: 26rpx;
        background: #eee;
        color: #666;
      }
    }
  }
}
</style>
