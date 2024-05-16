<template>
  <view class="body flex-col">
    <view class="bg-fff" style="border-bottom: 2rpx solid #eee">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view
      @scrolltolower="scrolltolower"
      scroll-y
      class="content flex-h-1"
    >
      <view class="scroll-box" v-if="list.length">
        <OrderList @getList="resetPageData" :list="list"></OrderList>
        <u-loadmore :status="more"></u-loadmore>
      </view>
      <view class="scroll-box" v-else>
        <u-empty
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import OrderList from './components/OrderList.vue';
export default {
  components: {
    OrderList,
  },
  data() {
    return {
      list1: [
        {
          name: '全部',
        },
        {
          name: '待付款',
        },
        {
          name: '众筹中',
        },
        {
          name: '众筹成功',
        },
        {
          name: '众筹失败',
        },
      ],
      pageData: '',
      status: 0,
      list: [],
      page: 1,
      more: 'loadmore',
    };
  },
  onLoad(params) {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.more == 'nomore') return;
      const res = await this.$requestAll.crowdfund.orderList(
        {
          status: this.status - 1,
          page: this.page,
        },
        true
      );
      this.list.push(...res.data.list);
      this.more =
        this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
      this.page++;
    },
    clickTab({ index }) {
      this.status = index;
      this.resetPageData();
    },
    scrolltolower() {
      this.page++;
      this.loadData();
    },
    resetPageData() {
      this.list = this.$options.data().list;
      this.page = this.$options.data().page;
      this.more = this.$options.data().more;
      this.loadData()
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
}
</style>
