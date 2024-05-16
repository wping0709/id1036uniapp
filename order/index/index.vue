<template>
  <view class="page-body">
    <div class="page-content bdrd-20 bg-fff p-24">
      <div class="font-600-30 m-b-24">我的订单</div>
      <div class="list">
        <div :style="{backgroundColor: item.bgColor}" v-for="(item,index) in listData" :key="index" @click="$utils.toUrl(item.path)" class="item p-y-18 p-x-40 flex-y-center">
          <image :src="item.iconUrl" mode="aspectFit"></image>
          <div class="item-content flex-w-1 flex-y-center m-l-40">
            <div class="flex-w-1">
              <div class="font-w-600 m-b-6">{{item.name}}</div>
              <div class="color-999 font-24">{{item.content}}</div>
            </div>
            <div class="iconfont icon-arrow-right"></div>
          </div>
        </div>
      </div>
    </div>
  </view>
</template>
<script>
const listData = [
  {
    bgColor: '#EEFAFE',
    iconUrl: require('@/order/static/images/putong.png'),
    path: '/pages/order/order',
    name: '普通订单',
    content: '前往查看全部普通订单',
  },
  {
    bgColor: '#FFF2D8',
    iconUrl: require('@/order/static/images/integral.png'),
    path: '/pages/order/order?type=2',
    name: '扫码订单',
    content: '前往查看全部扫码订单',
  },
  {
    bgColor: '#F2F6FF',
    iconUrl: require('@/order/static/images/miaosha.png'),
    path: '/miaosha/order/order',
    name: '秒杀订单',
    content: '前往查看全部秒杀订单',
  },
  {
    bgColor: '#EFF9F8',
    iconUrl: require('@/order/static/images/pt.png'),
    path: '/pt/order/order',
    name: '拼团订单',
    content: '前往查看全部拼团订单',
  },
  {
    bgColor: '#FFEFEB',
    iconUrl: require('@/order/static/images/kj.png'),
    path: '/bargain/order-list/order-list',
    name: '砍价订单',
    content: '前往查看全部砍价订单',
  },
  {
    bgColor: '#FFF2D8',
    iconUrl: require('@/order/static/images/integral.png'),
    path: '/integral-mall/order/order',
    name: '积分订单',
    content: '前往查看全部积分订单',
  },
]
export default {
  data() {
    return {
     pageData:'',
     listData,
    };
  },
  onLoad() {
    // this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll;
      this.pageData = res.data;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {}
}
</script>
<style lang='scss' scoped>
.page-body {
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #F2F2F2;
  padding: 24rpx 24rpx 0;
  .list {
    .item {
      border-radius: 24rpx;
      margin-bottom: 24rpx;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
      
      >image {
        width: 92rpx;
        height: 92rpx;
      }
    }
  }
}
</style>
