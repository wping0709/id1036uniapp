<template>
  <view class="page-body flex-col">
    <div class="bg-fff">
      <u-tabs lineColor="#FF1B22" @change="tabsChange" :current="current" :list="tabsList" :scrollable="false"></u-tabs>
    </div >
    <scroll-view scroll-y class="flex-h-1" @scrolltolower="scrolltolower">
      <div v-if="pageData.list.length" class="list">
        <div v-for="(item,index) in pageData.list" :key="index" class="item">
          <image src="../static/images/commission-icon.png" mode="aspectFill"></image>
          <div class="flex-w-1 m-x-20">
            <div class="p-t-14">{{item.type_text}}</div>
            <div class="color-999 font-24">
              <div class="m-t-14">{{item.order.order_no}}</div>
              <div class="m-t-14">生成时间：{{item.create_time}}</div>
              <div class="m-t-14">到账时间：{{item.settlement_time}}</div>
            </div>
          </div>
          <div class="right-price font-right">
            <div class="font-600-36">+{{item.price}}</div>
            <div class="color-999 font-26">{{item.status_text}}</div>
          </div>
        </div>
        <u-loadmore :status="pageData.loadmoreStatus"></u-loadmore>
      </div>
      <u-empty v-else mode="data"></u-empty>
    </scroll-view>
  </view>
</template>
<script>

export default {
  data() {
    return {
      tabsList:[
        {
          name: '全部'
        },
        {
          name: '未到账'
        },
        {
          name: '已到账'
        }
      ],
      pageData: {
        page: 1,
        pageSize: 10,
        list:[],
        loadmoreStatus: 'loadmore',
      },
      current: 0,
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
      if(this.pageData.loadmoreStatus == 'nomore') return 
      const res = await this.$requestAll.recommend.priceList({
        page: this.pageData.page,
        pageSize: this.pageData.pageSize,
        status: this.current
      },true);
      this.pageData.list.push(...res.data.list)
      this.pageData.loadmoreStatus = res.data.list.length < this.pageData.pageSize ? 'nomore' : 'loadmore';
      this.pageData.page++
      fn && fn()
    },
    tabsChange(e) {
      this.current = e.index
      this.loadData(true)
    },
	scrolltolower(){
		this.loadData(false, () => uni.stopPullDownRefresh());
	}
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {}
}
</script>
<style lang='scss' scoped>
/deep/.u-tabs {
  .u-tabs__wrapper__nav__line {
    bottom: 14rpx!important;
  }
}
.page-body {
  height: 100vh;
  background: #f2f2f2;
  .list {
    padding: 24rpx 0;
    padding-bottom: env(safe-area-inset-bottom);
    .item {
      display: flex;
      background: #fff;
      padding: 30rpx 24rpx;
      >image {
        width: 70rpx;
        height: 70rpx;
      }
    }
  }
}
</style>
