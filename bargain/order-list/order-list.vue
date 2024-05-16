<template>
  <view class="body flex-col">
    <scroll-view scroll-y @scrolltolower="getList()" class="flex-h-1">
      <div v-if="pageData.list.length" class="list">
        <view class="m-t-24 m-x-24 m-b-24 bdrd-20 bg-fff" v-for="(item, i) in pageData.list" :key="i">
          <Goods :goods="item"></Goods>
        </view>
        <u-loadmore :status="pageData.status"></u-loadmore>

				<view class="env-bottom"></view>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      >
      </u-empty>
    </scroll-view>
  </view>
</template>
<script>
import Goods from './components/goods.vue';
export default {
  components: { Goods },
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      status: 0,
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.getList(false);
  },
  onShow() {},
  methods: {
    onFinish(i) {
      this.pageData.list[i].status = 1;
      this.$set(this.pageData.list, i, this.pageData.list[i]);
    },
    async getList(isReset) {
      if (isReset) {
        this.pageData = this.$options.data().pageData;
      }
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.bargain.orderList({
        page: this.pageData.page,
        status: '-1',
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f2f2f2;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
 
}
</style>
