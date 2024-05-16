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
        @change="e => $u.debounce(clickTab(e))"
        :scrollable="false"
      ></u-tabs>
    </view>
    <scroll-view v-if="pageData.list.length" scroll-y class="flex-h-1">
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
              <GoodsList
                :goodsList="order.goods_list ? order.goods_list : [order]"
              ></GoodsList>
            </view>
            <view @click.stop class="total-box">
              <view class="m-t-20">
                配送方式：{{
                  order.is_dada > 0
                    ? "同城配送"
                    : order.is_offline == 1
                    ? "到店自提"
                    : "快递配送"
                }}
              </view>
              <view @click.stop class="m-t-10 flex-x-sb">
                <text>合计：￥{{ order.total_price }}</text>

                <!-- v-if="order.is_pay == 1 && order.is_send == 0" -->
                <view
                  v-if="$utils.orderStatus(order) === 1"
                  class="order-option-btn"
                  @click="showSendModal(order)"
                >
                  发货
                </view>
              </view>

              <view
                v-if="order.is_send == 0 && order.apply_delete == 1"
                @click.stop
                class="m-t-10 flex-x-sb"
              >
                <!-- 已取消，退款申请中 -->
                <text> 用户申请退款 </text>

                <view class="flex">
                  <view class="order-option-btn" @click="onTuikuan(i, 1)">
                    同意
                  </view>
                  <view class="order-option-btn" @click="onTuikuan(i, 0)">
                    拒绝
                  </view>
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
              <span
                style="margin-right: 20rpx"
                v-if="order.new_refund_status === '0'"
              >
                待商家处理
              </span>
              <span
                style="margin-right: 20rpx"
                v-if="order.new_refund_status === '1'"
              >
                售后已完成
              </span>
              <span
                style="margin-right: 20rpx"
                v-if="order.new_refund_status === '2'"
              >
                已拒绝售后
              </span>
              <span
                style="margin-right: 20rpx"
                v-if="order.new_refund_status === '3'"
              >
                待用户发货
              </span>
              <span
                style="margin-right: 20rpx"
                v-if="order.new_refund_status === '4'"
              >
                用户已发货
              </span>
            </view>
            <!-- 退款金额 -->
            <view @click.stop class="flex-x-sb m-t-20">
              <div class="total">退款金额：￥{{ order.refund_price }}</div>
              <div class="flex-y-center">
                <template v-if="order.new_refund_status === '0'">
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
                <template v-else-if="order.new_refund_status == 4">
                  <view
                    class="m-l-20 order-option-btn"
                    @click="onRefund(order)"
                  >
                    退款
                  </view>
                </template>
                <!-- <span class="m-l-20" v-if="order.status == 1">
                  已同意退货退款
                </span>
                <span class="m-l-20" v-if="order.status == 2">已同意换货</span>
                <span class="m-l-20" v-if="order.status == 3">已拒绝</span> -->
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
        :type="pageType"
      ></DeliverPopup>

      <!-- <RejectRefund
        :show.sync="showRejectRefund"
        :order.sync="checkOrder"
        @success="updateOrder"
      ></RejectRefund> -->
      <ResolveRefund
        :address="addressList"
        :show.sync="showResolve"
        :order.sync="checkOrder"
        @success="updateOrder"
      ></ResolveRefund>
    </scroll-view>
    <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
  </view>
</template>
<script>
import GoodsList from "./components/GoodsList";
import DeliverPopup from "../order/components/deliver-popup.vue";
import ResolveRefund from "./components/resolve-refund.vue";
import RejectRefund from "./components/reject-refund.vue";
const tabList = [
  {
    name: "待付款",
  },
  {
    name: "待发货",
  },
  {
    name: "待收货",
  },
  {
    name: "已完成",
  },
  {
    name: "售后",
  },
  {
    name: "已取消",
  },
];
const yyTabList = [
  {
    name: "待付款",
  },
  {
    name: "待使用",
  },
  {
    name: "已使用",
  },
  {
    name: "已完成",
  },
  {
    name: "售后",
  },
];
export default {
  components: {
    GoodsList,
    DeliverPopup,
    ResolveRefund,
    RejectRefund,
  },
  data() {
    return {
      pageType: "",
      status: 0,
      orderId: "",
      showPopup: false,
      tabList,
      pageData: {
        list: [],
        page: 1,
        status: "loadmore",
      },
      keyword: "",
      showRejectRefund: false,
      showResolve: false,
      addressList: [],
      checkOrder: "",
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.pageType = params.pageType;
    if (this.pageType == "yy") {
      this.tabList = yyTabList;
    }
  },
  onShow() {
    this.searchConfirm();
  },
  methods: {
    async onRefund(order) {
      this.checkOrder = order;
      const { confirm } = await this.$utils.showModalAsync({
        title: "退款！",
        content: "您确定退款给买家吗？",
      });
      if (!confirm) return false;
      const res1 = await this.requestApi(true, { refund: 1 });
      this.searchConfirm();
    },
    async updateOrder(e) {
      console.log(e, 123123);
      const res = await this.requestApi(true, e);
      uni.showModal({
        title: "提示",
        content: res.msg,
        showCancel: false,
        success: (res) => {
          this.searchConfirm();
        },
      });
    },
    async requestApi(isAgree, e = {}) {
      if (this.pageType == "yy") {
        var res = await this.$requestAll.mch.yyRefund({
          id: this.checkOrder.id,
          type: this.checkOrder.type,
          action: isAgree ? "pass" : "deny",
          ...e,
        });
      } else if (this.pageType == "ms") {
        var res = await this.$requestAll.mch.msRefund({
          id: this.checkOrder.id,
          type: this.checkOrder.type,
          action: isAgree ? "pass" : "deny",
          ...e,
        });
      } else {
        var res = await this.$requestAll.mch.orderRefund({
          id: this.checkOrder.id,
          type: this.checkOrder.type,
          action: isAgree ? "pass" : "deny",
          ...e,
        });
      }
      return res;
    },
    async loadData() {
      if (this.pageData.status == "nomore") return;
      if (this.pageType == "pt") {
        var res = await this.$requestAll.mch.orderPtList(
          {
            keyword: this.keyword,
            page: this.pageData.page,
            status: this.status + 1,
          },
          true
        );
      } else if (this.pageType == "ms") {
        var res = await this.$requestAll.mch.msList(
          {
            keyword: this.keyword,
            page: this.pageData.page,
            status: this.status + 1,
          },
          true
        );
      } else if (this.pageType == "yy") {
        var res = await this.$requestAll.mch.yyList(
          {
            keyword: this.keyword,
            page: this.pageData.page,
            status: this.status + 1,
          },
          true
        );
      } else {
        var res = await this.$requestAll.mch.orderList(
          {
            keyword: this.keyword,
            page: this.pageData.page,
            status: this.status + 1,
          },
          true
        );
      }
      this.addressList = res.data.refund_address || [];
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 10 ? "nomore" : "loadmore";
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
      console.log(order);
      // 当前为达达配送
      if (order.is_data > 0) {
        console.log(">0");
      }
      // 当前为正常配送
      else {
        this.orderId = order.id;
        this.showPopup = true;
      }
    },
    // 同意拒绝退换货
    refundSet(i, b) {
      var order = this.pageData.list[i];
      this.checkOrder = order;
      switch (b) {
        case 0:
          uni.showModal({
            title: "提示",
            content: `确认${b ? "同意" : "拒绝"} ${order.refund_type}？`,
            success: async (res) => {
              if (res.confirm) {
                const res = await this.requestApi(b);
                uni.showModal({
                  title: "提示",
                  content: res.msg,
                  showCancel: false,
                  success: (res) => {
                    this.searchConfirm();
                  },
                });
              } else if (res.cancel) {
                console.log("用户点击取消");
              }
            },
          });
          break;

        default:
          if (!this.addressList.length)
            return this.$utils.showModalAsync({
              title: "提示",
              content: "查询到您未设置售后收获地址，请前往pc后台设置。",
              showCancel: false,
            });
          this.showResolve = true;
          break;
      }
    },
    // 同意拒绝退款
    onTuikuan(i, b) {
      var order = this.pageData.list[i];
      uni.showModal({
        title: "提示",
        content: `确定${b ? "同意" : "拒绝"}退款？`,
        success: async ({ confirm }) => {
          if (confirm) {
            if (b) {
              await this.$requestAll.mch.orderAgree({
                id: order.id,
                type: "order",
              });
            } else {
              await this.$requestAll.mch.orderJujue({
                id: order.id,
                type: "order",
              });
            }
            this.pageData = this.$options.data().pageData;
            this.loadData();
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    // 跳转详情
    navDetail(order) {
      if (this.status != 4) {
        this.$utils.toUrl(
          "/mch/m/order-detail/order-detail" +
            uni.$u.queryParams({ id: order.id, pageType: this.pageType })
        );
      } else {
        this.$utils.toUrl(
          "/mch/m/order-refund/order-refund" +
            uni.$u.queryParams({ id: order.id, pageType: this.pageType })
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
