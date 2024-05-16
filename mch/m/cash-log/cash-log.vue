<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <template v-if="pageData.list.length">
      <view
        class="tixian-item flex-y-center flex-x-sb"
        v-for="(item, index) in pageData.list"
        :key="index"
      >
        <view>
          <view class="font-30 m-b-10">
            <text v-if="item.status == 0">待审核</text>
            <text style="color:#3fc24c" v-else-if="item.status == 1">已转账</text>
            <text style="color: red;" v-else>已拒绝</text>
          </view>
          <view class="font-24">{{ item.addtime }}</view>
        </view>
        <view class="price-color font-w-600 font-34">
          {{ item.money }}
        </view>
      </view>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </template>
    <template v-else>
      <u-empty mode="data" :icon="wxapp_img.empty_data">
      </u-empty>
    </template>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        status: 'loadmore',
        page: 1,
      },
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.mch.cashLog(
        {
          page: this.pageData.page,
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
  },
  computed: {},
  watch: {},
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

  .tixian-item {
    margin-top: 20rpx;
    padding: 30rpx;
    background: #fff;
  }
}
</style>
