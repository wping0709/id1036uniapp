<template>
  <view class="body env-bottom flex-col">
    <div class="list">
      <div
        v-for="(item, i) in pageData.list"
        :key="i"
        class="flex p-20 m-20 bg-fff item"
      >
        <view class="left flex-w-1">
          <view>核销卡类型： {{ order_type_all[item.order_type] }}</view>
          <view>门店名称： {{ item.sm_name }}</view>
          <view>核销卡名称： {{ item.verify_card_name }}</view>
          <view>核销人员： {{ item.nickname }}</view>
          <view>核销人员： {{ item.use_time }}</view>
        </view>
        <div class="right font-24 color-999">
          {{ item.use_time }}
        </div>
      </div>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </div>
  </view>
</template>
<script>
var order_type_all = ['商城', '秒杀', '拼团'];
export default {
  data() {
    return {
      order_type_all,
      shop_id: '',
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.shop_id = params.shop_id || '';
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.commander.verifyCardLog({
        page: this.pageData.page,
        shop_id: this.shop_id,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        res.data.page_count <= this.pageData.list.length
          ? 'nomore'
          : 'loadmore';
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  .item {
    line-height: 2;
    border-radius: 20rpx;

    view,
    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }
}
</style>
