<template>
  <view class="body flex-col">
    <view class="p-y-10">
      <u-input
        v-model="keyword"
        placeholder="搜索"
        @confirm="searchConfirm"
        border="none"
        inputAlign="center"
        shape="circle"
      ></u-input>
    </view>
    <view class="bg-fff">
      <u-tabs
        :current="status"
        :list="tabList"
        :activeStyle="{
          color: 'red',
        }"
        :itemStyle="{
          height: '44px',
          padding: '0 8rpx',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>
    <scroll-view @scrolltolower="loadData" v-if="pageData.list.length" scroll-y class="flex-h-1">
      <div class="conent-box">
        <div
          @click="navDetail(order)"
          v-for="(order, i) in pageData.list"
          :key="i"
          class="order-item"
        >
          <view class="flex-x-sb p-b-20 border-b color-999 font-26">
            <text class="flex-w-1 u-line-1">{{ order.order_no }}</text>
            <text>{{ order.addtime }}</text>
          </view>
          <view class="border-b p-b-20">
            <GoodsList :goodsList="[order]"></GoodsList>
          </view>
          <view @click.stop class="total-box">
            <view class="m-t-20 flex">
              <view>收货人：</view>
              <view class="flex-w-1 u-line-1">
                {{ order.name + ' | ' + order.mobile }}
              </view>
            </view>
            <view class="m-t-20 p-b-20 flex border-b">
              <view>收货地址：</view>
              <view class="flex-w-1 u-line-2">
                {{ order.address }}
              </view>
            </view>
            <view class="m-t-20 flex-x-sb">
              <view>合计：￥{{ order.total_price }}</view>
              <view
                v-if="status == 0"
                @click="showSendModal(order)"
                class="order-option-btn"
              >
                发货
              </view>
            </view>
          </view>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <DeliverPopup
        :orderId="orderId"
        :show.sync="showPopup"
        @success="searchConfirm"
        type="mh"
      ></DeliverPopup>
    </scroll-view>
    <u-empty
      v-else
      mode="data"
      :icon="wxapp_img.empty_data"
    >
    </u-empty>
  </view>
</template>
<script>
import GoodsList from '../order/components/GoodsList';
import DeliverPopup from '../order/components/deliver-popup.vue';
const tabList = [
  {
    name: '待发货',
  },
  {
    name: '待收货',
  },
  {
    name: '已完成',
  },
];
export default {
  components: {
    GoodsList,
    DeliverPopup,
  },
  data() {
    return {
      status: 0,
      orderId: '',
      showPopup: false,
      tabList,
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
    this.searchConfirm();
  },
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.mch.orderMhList(
        {
          keyword: this.keyword,
          page: this.pageData.page,
          status: this.status + 1,
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
    },
    clickTab({ index }) {
      
      this.status = index;
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
    searchConfirm() {
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
    showSendModal(order) {
      this.orderId = order.id;
      this.showPopup = true;
    },
    // 跳转详情
    navDetail(order) {
      console.log('');
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
  .border-b {
    border-bottom: 1px solid #eee;
  }
  /deep/.u-input {
    margin: 0 30rpx;
    background: #fff;
  }

  .conent-box {
    padding-bottom: env(safe-area-inset-bottom);
    .order-item {
      margin: 20rpx 20rpx 0;
      padding: 20rpx;
      background: #fff;
      border-radius: 20rpx;
      .order-option-btn {
        line-height: 1.8;
        width: 100rpx;
        text-align: center;
        border-radius: 10rpx;
        border: 1px solid #999;
        margin-left: 20rpx;
      }
    }
  }
}
</style>
