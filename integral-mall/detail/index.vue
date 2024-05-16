<template>
  <view v-if="pageData" class="body flex-col">
    <view class="bg-fff">
      <u-tabs
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @click="clickTab"
      ></u-tabs>
    </view>
    <scroll-view
      scroll-y
      @scrolltolower="reachBottom"
      class="content-box flex-h-1 bg-fff"
    >
      <view
        v-for="(item, index) in pageData.list"
        :key="index"
        class="scroll-item"
      >
        <view class="u-line-1">{{ item.content }}</view>
        <view class="price flex-x-sb flex-y-center">
          <view style="color: #ff6f28; font-size: 32rpx; margin-top: 10rpx"
            >{{ status == 0 ? "+" : "" }}{{ item.integral }}积分</view
          >
          <view class="font-22 color-999">
            {{ item.content_1 }} 时间 {{ item.addtime }}
          </view>
        </view>
      </view>
      <u-loadmore
        @loadmore="reachBottom"
        :status="(pageData.isBottom && 'nomore') || 'loadmore'"
      ></u-loadmore>
    </scroll-view>
  </view>
</template>
<script>
export default {
  
  data() {
    return {
      pageData: {
        page: 1,
        list: [],
        isBottom: false,
      },
      status: 0,
      list1: [
        {
          name: "收入",
        },
        {
          name: "支出",
        },
      ],
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    clickTab({ index }) {
      this.pageData = this.$options.data().pageData;
      this.status = index;
      this.loadData()
    },

    async loadData() {
      if (this.pageData.isBottom) return;
      const res = await this.$requestAll.integralmall.integralDetail({
        page: this.pageData.page,
        status: this.status + 1,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.isBottom = !res.data.list.length;
    },
    reachBottom() {
      this.pageData.page++;
      this.loadData();
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  font-size: 28rpx;
  .scroll-item {
    padding: 20rpx;
    border-bottom: 2rpx solid #f5f5f5;
  }
}
</style>
