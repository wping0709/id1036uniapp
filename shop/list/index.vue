<template>
  <view class="page-body">
    <div v-if="pageData.list.length" class="list">
      <div v-for="(item,i) in pageData.list" :key="i" class="item">
        <image mode="aspectFill" :src="item.logo"></image>
        <div class="flex-w-1 m-x-22">
          <div class="font-600-34">{{item.name}}</div>
          <div class="color-999 m-t-4">电话：{{item.mobile}}</div>
        </div>
        <div style="color: #f85809">订单 {{item.order_number}}</div>
      </div>
      <u-loadmore :status="pageData.loadmoreStatus"></u-loadmore>
    </div>
    <u-empty mode="data" v-else></u-empty>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        page: 1,
        pageSize: 10,
        count: 0,
        list: [],
        loadmoreStatus: "loadmore",
      },
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(reset, fn) {
      if (reset) {
        let { pageData } = this.$options.data();
        this.pageData = pageData;
      }
      if (this.pageData.loadmoreStatus == "nomore") return;
      const res = await this.$requestAll.recommend.mchList({page:this.pageData.page,pageSize: this.pageData.pageSize},true);
      this.pageData.list.push(...res.data.list);
      this.pageData.loadmoreStatus =
        res.data.list.length < this.pageData.pageSize ? "nomore" : "loadmore";
      this.pageData.page++;
      fn && fn();
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {
    this.loadData(false, () => uni.stopPullDownRefresh());
  },
  onPullDownRefresh() {
    this.loadData(true, () => uni.stopPullDownRefresh());
  },
};
</script>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;
  background: #f2f2f2;
  padding: 24rpx;
  padding-bottom: env(safe-area-inset-bottom);
}

.list {
  .item {
    display: flex;
    align-items: flex-end;
    padding: 24rpx;
    margin-bottom: 24rpx;
    background: #ffffff;
    border-radius: 20rpx 20rpx 20rpx 20rpx;

    image {
      width: 92rpx;
      height: 92rpx;
      border-radius: 50%;
      background: #f2f2f2;
    }
  }
}
</style>
