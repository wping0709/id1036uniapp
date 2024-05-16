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
          <template v-if="status != 4">
            <view class="border-b p-b-20">
              <GoodsList :goodsList="[order]"></GoodsList>
            </view>
            <view @click.stop class="total-box">
              <view @click.stop class="m-t-10 flex-x-sb">
                <text>合计：￥{{ order.total_price }}</text>
                <view
                  v-if="order.is_pay == 1 && order.is_send == 0"
                  class="order-option-btn"
                  @click="showSendModal(order)"
                >
                  发货
                </view>
              </view>
              <view v-if="order.content" @click.stop class="m-t-10 u-line-2">
                <text>备注：{{ order.content }}</text>
              </view>
            </view>
          </template>
          <!-- 售后订单 -->
          <template v-else>
            <view class="p-b-20 border-b">
              <GoodsList :goodsList="[order]"></GoodsList>
            </view>
            <!-- 售后状态 -->
            <view @click.stop class="m-t-20 flex-y-center">
              <image
                :src="wxapp_img.mch.icon_shouhou"
                style="width: 30rpx; height: 30rpx; margin-right: 10rpx"
              />
              <span style="margin-right: 20rpx">{{ order.refund_type }}</span>
              <span style="margin-right: 20rpx" v-if="order.status == 0"
                >待处理</span
              >
              <span style="margin-right: 20rpx" v-if="order.status == 1"
                >退款完成</span
              >
              <span style="margin-right: 20rpx" v-if="order.status == 2"
                >换货完成</span
              >
              <span style="margin-right: 20rpx" v-if="order.status == 3"
                >已拒绝</span
              >
            </view>
            <!-- 退款金额 -->
            <view @click.stop class="flex-x-sb m-t-20">
              <div class="total">退款金额：￥{{ order.refund_price }}</div>
              <div class="flex-y-center">
                <template v-if="order.status == 0">
                  <view
                    class="m-l-20 order-option-btn"
                    @click="refundSet(i, 0)"
                  >
                    拒绝
                  </view>
                  <view
                    class="m-l-20 order-option-btn"
                    @click="refundSet(i, 1)"
                  >
                    同意
                  </view>
                </template>
                <span class="m-l-20" v-if="order.status == 1"
                  >已同意退货退款</span
                >
                <span class="m-l-20" v-if="order.status == 2">已同意换货</span>
                <span class="m-l-20" v-if="order.status == 3">已拒绝</span>
              </div>
            </view>
          </template>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <DeliverPopup
        :orderId="orderId"
        :show.sync="showPopup"
        @success="searchConfirm"
        type="ms"
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
    name: '待付款',
  },
  {
    name: '待发货',
  },
  {
    name: '待收货',
  },
  {
    name: '已完成',
  },
  {
    name: '售后',
  },
  {
    name: '已取消',
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
      const res = await this.$requestAll.mch.msList(
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
    clickTab(e) {
      var {index} = e
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
    // 同意拒绝退换货
    refundSet(i, b) {
      var order = this.pageData.list[i];
      uni.showModal({
        title: '提示',
        content: `确认${b ? '同意' : '拒绝'} ${order.refund_type}？`,
        success: async res => {
          if (res.confirm) {
            if (b) {
              var res = await this.$requestAll.mch.msRefund({
                id: order.id,
                action: 'agree',
              });
            } else {
              var res = await this.$requestAll.mch.msRefund({
                id: order.id,
                action: 'deny',
              });
            }
            uni.showModal({
              title: '提示',
              content: res.msg,
              showCancel: false,
              success: res => {
                this.searchConfirm();
              },
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 跳转详情
    navDetail(order) {
      if (this.status != 4) {
        this.$utils.toUrl('/mch/m/msorder-detail/order-detail?id=' + order.id);
      } else {
        this.$utils.toUrl(
          '/mch/m/order-refund/order-refund?pageType=ms&id=' + order.id
        );
      }
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
