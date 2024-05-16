<template>
  <view class="body flex-col">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <view class="bg-fff" style="border-bottom: 2rpx solid #eee">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
				:scrollable="true"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view @scrolltolower="loadData" scroll-y class="content flex-h-1">
      <view class="scroll-box" v-if="list.length">
        <OrderList1 :list="list" :status="status" type="pt"></OrderList1>
        <!-- <OrderList :list="list" :status="status" type="pt"></OrderList> -->
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
// import OrderList from './components/OrderList.vue';
import OrderList1 from '@/components/OrderList/OrderList.vue';
export default {
  components: {
    // OrderList,
    OrderList1,
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
          name: '拼团中',
        },
        {
          name: '拼团成功',
        },
        {
          name: '拼团失败',
        },
        {
          name: '售后',
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
      const res = await this.$requestAll.group.orderList(
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
      this.loadData();
    },
    resetPageData() {
      this.list = this.$options.data().list;
      this.page = this.$options.data().page;
      this.more = this.$options.data().more;
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
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
  .diy_header{
	padding: 25rpx;
	background-color: #ffffff;
}
}
</style>
