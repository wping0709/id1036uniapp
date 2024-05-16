<template>
  <view v-if="!store.is_shenhe" class="body flex-col">
    <div class="search p-y-20 p-x-20">
      <u-input
        class="u-input"
        v-model="keyword"
        placeholder="搜索"
        border="none"
        shape="circle"
        @confirm="loadData(true)"
      ></u-input>
    </div>
    <scroll-view @scrolltolower="loadData(false)" scroll-y class="flex-h-1">
      <div v-if="pageData.list.length" class="list">
        <div
          class="item flex-y-center"
          v-for="(item, i) in pageData.list"
          :key="i"
          @click="
            $utils.toUrl('/app_admin/mch-detail/mch-detail?id=' + item.id)
          "
        >
          <image :src="item.logo" mode="aspectFill"></image>
          <div class="flex-w-1 item-content p-x-20">
            <view class="font-32 u-line-1">{{ item.nickname }}</view>
            <view class="color-999 u-line-1">{{ item.name }}</view>
          </div>
          <text class="iconfont icon-arrow-right color-999"></text>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      ></u-empty>
    </scroll-view>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      keyword: '',
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {},
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData(reset) {
      reset && (this.pageData = this.$options.data().pageData);

      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.admin.mchReview({
        page: this.pageData.page,
        type: 1,
        keyword: this.keyword,
      },true);
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  /deep/.u-input {
    background: #fff;
    padding: 8rpx 20rpx!important;
  }
  .list {
    padding: 0 20rpx;
    .item {
      padding: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      background: #fff;
      > image {
        width: 90rpx;
        height: 90rpx;
      }
    }
  }
}
</style>
