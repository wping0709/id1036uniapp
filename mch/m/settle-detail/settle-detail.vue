<template>
  <view class="body">
    <div v-if="pageData.list.length" class="list">
      <div class="item" v-for="(item, i) in pageData.list" :key="i">
        <div class="title">
          <view>{{ item.order_status }}</view>
          <view class="font-center">
            <text class="font-600 font-50">{{ item.price }}</text>
            <text>元</text>
          </view>
        </div>

        <div class="content">
          <view>
            <div class="lable">订单号</div>
            <view class="lable-text u-line-1">{{ item.order_no }}</view>
          </view>
          <view>
            <div class="lable">商品名称</div>
            <view class="lable-text u-line-1">{{ item.goods_name }}</view>
          </view>
          <view>
            <div class="lable">用户名</div>
            <view class="lable-text u-line-1">{{ item.nickname }}</view>
          </view>
          <view>
            <div class="lable">时间</div>
            <view class="lable-text u-line-1">{{ item.addtime }}</view>
          </view>
        </div>
      </div>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </div>
    <u-empty v-else mode="data" :icon="wxapp_img.empty_data">
    </u-empty>
  </view>
</template>
<script>
export default {
  data() {
    return {
      settle_type: 0,
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
    this.settle_type = params.settle_type;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.mch.settleLog({
        page: this.pageData.page,
        settle_type: this.settle_type,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        this.pageData.list.length >= res.data.pagination.totalCount
          ? 'nomore'
          : 'loadmore';
    },
  },
  onReachBottom() {
    this.loadData();
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  border-top: 1px solid #f5f5f5;
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
  .item {
    padding: 20rpx;
    font-size: 34rpx;
    background: #fff;
    margin-top: 20rpx;
    .title {
      border-bottom: 1px solid #eee;
    }

    .content {
      > view {
        display: flex;
        line-height: 2;
        margin-top: 20rpx;
        .lable {
          width: 200rpx;
          margin-right: 20rpx;

          text-align: right;
        }
        .lable-text {
          flex: 1;
          width: 0;
          color: #999;
        }
      }
    }
  }
}
</style>
