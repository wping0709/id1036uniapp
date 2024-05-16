<template>
  <view>
    <view class="body flex-col">
      <template v-if="!isSearch">
        <view class="p-t-20 p-b-10 bg-fff">
          <div class="head-tab">
            <div
              @click="switchRefund(0)"
              :class="refund == 0 && 'check'"
              class="tab"
            >
              订单列表
            </div>
            <div
              @click="switchRefund(1)"
              :class="refund == 1 && 'check'"
              class="tab"
            >
              售后订单
            </div>
          </div>
        </view>

        <div class="search-box flex-y-center">
          <div @click="onShowSearch(true)" class="search">搜索</div>
          <div @click="showDate = true" class="checkbox flex-y-center">
            <text>{{ dateText }}</text>
            <text class="iconfont icon-arrow-bottom"></text>
          </div>
        </div>

        <div v-if="refund == 0" class="tabs">
          <div
            @click="switchTab(-1)"
            :class="status == -1 && 'check'"
            class="tab"
          >
            全部
          </div>
          <div
            @click="switchTab(0)"
            :class="status == 0 && 'check'"
            class="tab"
          >
            待付款
          </div>
          <div
            @click="switchTab(1)"
            :class="status == 1 && 'check'"
            class="tab"
          >
            待发货
          </div>
          <div
            @click="switchTab(2)"
            :class="status == 2 && 'check'"
            class="tab"
          >
            待收货
          </div>
          <div
            @click="switchTab(6)"
            :class="status == 6 && 'check'"
            class="tab"
          >
            已取消
          </div>
          <div
            @click="switchTab(3)"
            :class="status == 3 && 'check'"
            class="tab"
          >
            已完成
          </div>
        </div>
        <div v-else class="tabs">
          <div
            @click="switchTab(-1)"
            :class="status == -1 && 'check'"
            class="tab"
          >
            全部
          </div>
          <div
            @click="switchTab(0)"
            :class="status == 0 && 'check'"
            class="tab"
          >
            待审核
          </div>
          <div
            @click="switchTab(2)"
            :class="status == 2 && 'check'"
            class="tab"
          >
            待买家发货
          </div>
          <div
            @click="switchTab(3)"
            :class="status == 3 && 'check'"
            class="tab"
          >
            待卖家收货
          </div>
        </div>
      </template>

      <template v-else>
        <view class="p-y-10 p-x-20 bg-fff">
          <u-search
            :focus="isSearch"
            v-model="keyword"
            placeholder="请输入订单号/商品名称/收货人姓名搜索"
            actionText="取消"
            @search="onSearch"
            @custom="onShowSearch(false)"
          ></u-search>
        </view>
      </template>

      <scroll-view @scrolltolower="loadData" scroll-y class="flex-h-1">
        <div v-if="pageData.list.length" class="order-list">
          <view
            @click="navToDetail(item)"
            v-for="(item, index) in pageData.list"
            :key="index"
            class="order-item"
          >
            <view class="order-title p-x-20">
              <view>{{ item.mch && item.mch.name }}</view>
              <view class="flex-x-sb flex-y-center">
                <span class="u-line-1" style="width: 0; flex: 1"
                  >订单号：{{ item.order_no }}</span
                >
                <span>{{ $u.timeFormat(item.addtime, "yyyy-mm-dd") }}</span>
              </view>
            </view>

            <view class="p-x-20 p-t-20 flex-x-sb flex-y-center">
              <view>订单状态：</view>
              <view class="price-color">
                <template v-if="$utils.orderStatus(item) == 0">
                  待付款
                </template>
                <template v-else-if="$utils.orderStatus(item) == 1">
                  待发货
                </template>
                <template v-else-if="$utils.orderStatus(item) == 2">
                  待收货
                </template>
                <template v-else-if="$utils.orderStatus(item) == 3">
                  已完成
                </template>
                <template v-else-if="$utils.orderStatus(item) == 4">
                  已取消
                </template>
                <template v-else-if="item.new_refund_status === '0'">
                  售后(待审核)
                </template>
                <template v-else-if="item.new_refund_status === '1'">
                  售后(已结束)
                </template>
                <template v-else-if="item.new_refund_status === '3'">
                  售后(待买家发货)
                </template>
                <template v-else-if="item.new_refund_status === '4'">
                  售后(待卖家收货)
                </template>
              </view>
            </view>

            <!-- 地址信息 -->
            <view class="address-box" @click.stop>
              <OrderAddress :order="item"></OrderAddress>
            </view>

            <!-- 商品属性 -->
            <view style="margin-top: -20rpx" class="goods-box p-x-20">
              <view
                @click="$emit('clickGoods', goods)"
                class="goods flex-x-sb"
                v-for="(goods, goodsIndex) in item.goods_list"
                :key="goodsIndex"
              >
                <view style="width: 156rpx; height: 156rpx">
                  <image
                    :src="goods.goods_pic"
                    mode="aspectFill"
                    style="width: 100%; height: 100%"
                  />
                </view>

                <view class="goods-content">
                  <view class="u-line-2">
                    {{ goods.name }}
                  </view>
                  <!-- 规格 -->
                  <view class="attr u-line-2">
                    <span
                      v-for="(attr, attrIndex) in goods.attr_list"
                      :key="attrIndex"
                    >
                      {{ attr.attr_group_name }}:
                      {{ attr.attr_name }}
                      <span
                        style="margin: 0 10rpx"
                        v-show="attrIndex < goods.attr_list.length - 1"
                        >|</span
                      >
                    </span>
                  </view>

                  <!-- 数量价格 -->
                  <view class="price flex-y-center flex-x-sb">
                    <view>x{{ goods.num }}</view>
                    <view
                      >￥{{ !refund ? goods.total_price : goods.price }}</view
                    >
                  </view>
                </view>
              </view>
            </view>

            <!-- button -->
            <view @click.stop class="total-button flex-y-center p-x-20">
              <view class="total font-24">
                <text>合计 ￥{{ item.pay_price }}</text>
                <text v-if="!item.is_agree"
                  >(含运费 ￥{{ item.express_price }})</text
                >
              </view>

              <view class="button-box flex-y-center">
                <!-- 待处理 -->
                <template v-if="item.new_refund_status === '0'">
                  <view @click="onSuccess(item)">同意</view>
                  <view @click="onReject(item)">拒绝</view>
                </template>
                <!-- 退货退款，待退款 -->
                <template v-if="item.new_refund_status == 4">
                  <view @click="onTuikuan(item)">退款</view>
                </template>

                <view v-if="item.is_agree" @click="onClickSale(item)">
                  售后理由
                </view>

                <view
                  @click="onModifyPrice(item)"
                  v-if="$utils.orderStatus(item) == 0"
                  class="btn"
                >
                  修改价格
                </view>

                <view
                  v-if="$utils.orderStatus(item) == 1"
                  @click="onFahuo(item)"
                  class="btn"
                >
                  发货
                </view>

                <!-- 已发货，未取消 -->
                <view
                  v-if="$utils.orderStatus(item) == 2"
                  @click="
                    $utils.toUrl(
                      '/mch/m/order-send/order-send?pageType=admin&id=' +
                        item.id
                    )
                  "
                  class="btn"
                >
                  修改物流
                </view>
              </view>
            </view>
          </view>
          <u-loadmore :status="pageData.status"></u-loadmore>
        </div>
        <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
        <TabBar></TabBar>
      </scroll-view>
    </view>

    <u-popup
      :show="showDate"
      :safeAreaInsetBottom="false"
      mode="center"
      bgColor="transparent"
    >
      <div class="date-popup">
        <div class="title font-center font-32 p-y-20">筛选时间</div>
        <div class="date-tabs">
          <div
            @click="switchDate(0)"
            :class="dateIndex == 0 && 'check'"
            class="tab"
          >
            汇总
          </div>
          <div
            @click="switchDate(1)"
            :class="dateIndex == 1 && 'check'"
            class="tab"
          >
            今日
          </div>
          <div
            @click="switchDate(2)"
            :class="dateIndex == 2 && 'check'"
            class="tab"
          >
            昨日
          </div>
          <div
            @click="switchDate(3)"
            :class="dateIndex == 3 && 'check'"
            class="tab"
          >
            7日
          </div>
          <div
            @click="switchDate(4)"
            :class="dateIndex == 4 && 'check'"
            class="tab"
          >
            自定义
          </div>
        </div>
        <div v-if="dateIndex == 4" class="p-x-20 m-b-20">
          <view>
            <view>起始时间</view>
            <picker-view
              class="picker-view"
              @change="dateChange($event, 'change_start')"
              :value="prickerData.value"
            >
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in prickerData.years"
                  :key="index"
                  >{{ item }}年</view
                >
              </picker-view-column>
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in prickerData.months"
                  :key="index"
                  >{{ item }}月</view
                >
              </picker-view-column>
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in prickerData.days"
                  :key="index"
                  >{{ item }}日</view
                >
              </picker-view-column>
            </picker-view>
          </view>
          <view>
            <view>结束时间</view>
            <picker-view
              class="picker-view"
              @change="dateChange($event, 'change_end')"
              :value="prickerData.value"
            >
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in prickerData.years"
                  :key="index"
                  >{{ item }}年</view
                >
              </picker-view-column>
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in prickerData.months"
                  :key="index"
                  >{{ item }}月</view
                >
              </picker-view-column>
              <picker-view-column>
                <view
                  class="item"
                  v-for="(item, index) in prickerData.days"
                  :key="index"
                  >{{ item }}日</view
                >
              </picker-view-column>
            </picker-view>
          </view>
        </div>
        <div class="popup-bt flex-y-center">
          <div @click="showDate = false" class="cancel">取消</div>
          <div @click="dateConfirm" class="confirm">确定</div>
        </div>
      </div>
    </u-popup>

    <SalePopup :show.sync="showSale" :order="checkOrder"></SalePopup>
    <RejectRefund
      :show.sync="showRejectRefund"
      :order.sync="checkOrder"
      @success="updateOrder"
    ></RejectRefund>
    <ResolveRefund
      :address="addressList"
      :show.sync="showResolve"
      :order.sync="checkOrder"
      @success="updateOrder"
    ></ResolveRefund>

    <!-- 发货 -->
    <DeliverPopup
      :show.sync="showPopup"
      type="admin"
      :orderId="checkOrder.id"
      @success="modifySuccess('deliver')"
    ></DeliverPopup>
    <!-- 修改价格 -->
    <ModifyPrice
      :show.sync="showPrice"
      :order="checkOrder"
      @success="modifySuccess('price')"
    ></ModifyPrice>

    <!-- 退款 -->
    <u-popup
      :show="showTuikuan"
      :safeAreaInsetBottom="false"
      mode="center"
      bgColor="transparent"
    >
      <div class="tuikuan-popup">
        <view class="font-center p-y-20 font-600-30">退款</view>
        <view class="m-x-20 m-b-20">
          <view>
            <u-input v-model="refundPrice" placeholder="请输入" border="bottom">
              <view slot="suffix"> ￥ </view>
            </u-input>
          </view>
          <view class="font-center font-30 p-y-10">是否确认退款给买家</view>
        </view>
        <div class="bts flex-y-center flex-x-sa">
          <div @click="onShowTuikuan(false)">取消</div>
          <div @click="onTuikuanConfirm">确定</div>
        </div>
      </div>
    </u-popup>
  </view>
</template>
<script>
import TabBar from "../index/components/TabBar.vue";
import GoodsList from "@/pages/order/components/GoodsList";
import OrderAddress from "../order-detail/components/OrderAddress";
import SalePopup from "../order-detail/components/sale-popup.vue";
import RejectRefund from "../order-detail/components/reject-refund.vue";
import ResolveRefund from "../order-detail/components/resolve-refund.vue";
import ModifyPrice from "../order-detail/components/modify-price.vue";
import DeliverPopup from "../order-detail/components/deliver-popup.vue";
export default {
  components: {
    TabBar,
    GoodsList,
    OrderAddress,
    SalePopup,
    RejectRefund,
    ResolveRefund,
    ModifyPrice,
    DeliverPopup,
  },
  data() {
    const date = new Date();
    const years = [];
    const year = date.getFullYear();
    const months = [];
    const month = date.getMonth() + 1;
    const days = [];
    const day = date.getDate();
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    return {
      // 时间选择框数据
      prickerData: {
        change_end: [years.length - 1, month - 1, day - 1],
        change_start: [years.length - 1, month - 1, day - 1],
        years,
        months,
        days,
        value: [years.length - 1, month - 1, day - 1],
      },
      pageData: {
        list: [],
        status: "loadmore",
        page: 1,
      },
      refund: 0,
      status: -1,
      dateIndex: 0,
      isSearch: false,
      showDate: false, //时间选择弹框
      dateText: "汇总", //时间文本
      keyword: "",
      date_start: "",
      date_end: "",
      orderList: [],
      showSale: false, //留言弹框
      showRejectRefund: false, //拒绝退货弹框开关
      showResolve: false, //同意申请售后弹框开关
      checkOrder: "", //当前选中订单数据
      addressList: [], //退货地址列表
      showPrice: false,
      showPopup: false,
      showTuikuan: false,
      refundPrice: "", //退款金额
    };
  },
  onLoad(params) {
    this.refund = params.refund || 0;
    this.status = params.status || -1;

    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == "nomore") return;

      if (Number(this.refund)) {
        var res = await this.$requestAll.admin.orderGetRefund(
          {
            status: this.isSearch ? -1 : this.status,
            date_start: this.date_start,
            date_end: this.date_end,
            keyword: this.isSearch ? this.keyword : "",
            page: this.pageData.page,
          },
          true
        );
        res.data.list = res.data.list.map((item) => {
          item.goods_list = [
            {
              name: item.goods_name,
              goods_pic: item.goods_pic,
              attr_list: JSON.parse(item.attr),
              num: item.num,
              price: item.total_price,
              page: this.pageData.page,
            },
          ];
          item.pay_price = item.refund_price;
          return item;
        });

        !this.addressList.length && (this.addressList = res.data.address);
      } else {
        var res = await this.$requestAll.admin.orderGetList(
          {
            status: this.isSearch ? -1 : this.status,
            date_start: this.date_start,
            date_end: this.date_end,
            keyword: this.isSearch ? this.keyword : "",
            page: this.pageData.page,
          },
          true
        );
      }

      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        this.pageData.list.length >= res.data.page_count
          ? "nomore"
          : "loadmore";
    },
    switchRefund(i) {
      this.refund = i;
      let { pageData, prickerData, dateText, status } = this.$options.data();
      this.pageData = pageData;
      this.prickerData = prickerData;
      this.dateText = dateText;
      this.status = status;

      this.loadData();
    },
    switchTab(i) {
      this.status = i;
      let { pageData } = this.$options.data();
      this.pageData = pageData;

      this.loadData();
    },
    switchDate(i) {
      this.dateIndex = i;
    },
    dateConfirm() {
      var cTime = new Date().getTime();
      switch (this.dateIndex) {
        case 0:
          this.date_start = "";
          this.date_end = "";
          this.dateText = "汇总";

          break;
        case 1:
          this.date_start = this.$u.timeFormat(cTime, "yyyy-mm-dd");
          this.date_end = this.$u.timeFormat(cTime, "yyyy-mm-dd");
          this.dateText = "今日";

          break;
        case 2:
          this.date_start = this.$u.timeFormat(
            cTime - 24 * 60 * 60 * 1000,
            "yyyy-mm-dd"
          );
          this.date_end = this.$u.timeFormat(
            cTime - 24 * 60 * 60 * 1000,
            "yyyy-mm-dd"
          );
          this.dateText = "昨日";

          break;
        case 3:
          this.date_start = this.$u.timeFormat(
            cTime - 7 * 24 * 60 * 60 * 1000,
            "yyyy-mm-dd"
          );
          this.date_end = this.$u.timeFormat(cTime, "yyyy-mm-dd");
          this.dateText = "7日";

          break;

        default:
          let indexs = this.prickerData.change_end;
          let indexs1 = this.prickerData.change_start;
          this.date_end = `${this.prickerData.years[indexs[0]]}-${
            this.prickerData.months[indexs[1]]
          }-${this.prickerData.days[indexs[2]]}`;
          this.date_start = `${this.prickerData.years[indexs1[0]]}-${
            this.prickerData.months[indexs1[1]]
          }-${this.prickerData.days[indexs1[2]]}`;
          this.dateText = "自定义";
          break;
      }
      this.showDate = false;
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
    dateChange(e, type) {
      let {
        detail: { value },
      } = e;
      this.prickerData[type] = value;
    },
    onShowSearch(b) {
      this.isSearch = b;
      this.pageData = this.$options.data().pageData;
      if (!b) {
        this.loadData();
      }
    },
    onSearch() {
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
    navToDetail(item) {
      this.$utils.toUrl(
        "/app_admin/order-detail/order-detail" +
          uni.$u.queryParams({ id: item.order_id || item.id, status: 1 })
      );
    },
    onClickSale(item) {
      this.checkOrder = item;
      this.showSale = true;
    },
    onReject(item) {
      this.checkOrder = item;
      this.showRejectRefund = true;
    },
    // 编辑订单更新状态
    updateOrder() {
      let i = this.pageData.list.findIndex(
        (item) => (item.order_id = this.checkOrder.order_id)
      );
      this.$set(this.pageData.list, i, this.checkOrder);
    },
    onSuccess(item) {
      this.checkOrder = item;
      this.showResolve = true;
    },
    onFahuo(item) {
      this.showPopup = true;
      this.checkOrder = item;
    },
    onModifyPrice(item) {
      this.showPrice = true;
      this.checkOrder = item;
    },
    async onTuikuan(item) {
      console.log(item);
      this.checkOrder = item;
      // this.refundPrice = item.refund_price;
      // this.showTuikuan = true;
      const { confirm } = await this.$utils.showModalAsync({
        title: "提示！",
        content: "您确定退款给买家吗？",
      });
      confirm && this.onTuikuanConfirm();
    },
    onShowTuikuan(b) {
      this.showTuikuan = b;
    },
    modifySuccess(type) {
      console.log(type);
      this.onSearch();
    },

    // 确定退款
    async onTuikuanConfirm() {
      console.log("确定退款");
      var formData = {
        order_refund_id: this.checkOrder.order_refund_id,
        type: 1,
        is_agree: 1,
        orderType: "STORE",
        refund: 1,
        // refund_price: this.refundPrice,
        action: 1,
      };
      await this.$requestAll.admin.refundHandle(formData, true);
      this.loadData();
    },
  },
  computed: {},
  watch: {},
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
  .address-box {
    /deep/.block {
      padding: 0 24rpx;
    }
    /deep/.block-row {
      margin-bottom: 0;
    }
  }
}

.date-popup {
  width: 80vw;
  border-radius: 20rpx;
  background: #fff;
  .popup-bt {
    border-top: 1px solid #eee;
    padding: 10rpx 0;
    display: flex;

    > div {
      flex: 1;
      width: 0;
      height: 70rpx;
      line-height: 80rpx;
      text-align: center;
      font-size: 32rpx;
    }
    .confirm {
      border-left: 1px solid #eee;
      color: #446dfd;
    }
  }
  .picker-view {
    width: 100%;
    height: 220rpx;
    .item {
      height: 80rpx;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
  }

  .date-tabs {
    padding-left: 20rpx;
    display: flex;
    flex-wrap: wrap;
    .tab {
      min-width: 170rpx;
      max-width: 60vw;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      padding: 0 20rpx;
      border-radius: 30rpx;
      border: 1px solid #999;
      line-height: 60rpx;
      text-align: center;
    }
    .check {
      border-color: #446dfd;
      color: #446dfd;
    }
  }
}

.tuikuan-popup {
  width: 80vw;
  border-radius: 20rpx;
  background: #fff;
  .bts {
    border-top: 1px solid #eee;
    line-height: 80rpx;
    padding: 10rpx 0;
    box-sizing: content-box;
    > div {
      flex: 1;
      text-align: center;
      &:nth-last-child(1) {
        color: #ff4544;
        border-left: 1px solid #eee;
      }
    }
  }
}

.head-tab {
  margin: auto;
  width: 300rpx;
  display: flex;
  align-items: center;
  border-radius: 30rpx;
  border: 1px solid #446dfd;
  overflow: hidden;
  .tab {
    flex: 1;
    width: 0;
    line-height: 50rpx;
    text-align: center;
  }

  .check {
    color: #fff;
    background: #446dfd;
  }
}

.search-box {
  margin: 10rpx 0;
  padding: 0 20rpx;
  display: flex;
  align-items: center;
  .search {
    flex: 1;
    width: 0;
    border-radius: 30rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: #fff;
    text-align: center;
  }
  .checkbox {
    padding-left: 20rpx;
    color: #446dfd;
  }
}

.tabs {
  display: flex;
  align-items: center;
  justify-content: space-around;
  font-size: 30rpx;
  background: #fff;
  .tab {
    line-height: 90rpx;
  }
  .check {
    position: relative;
    color: red;
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: 10rpx;
      transform: translateX(-50%);
      width: 30rpx;
      height: 4rpx;
      background: red;
    }
  }
}

.order-list {
  padding: 20rpx 0;
  .order-item {
    border-radius: 20rpx;
    padding: 20rpx 0;
    box-shadow: 4rpx 6rpx 2rpx #eee;
    margin: 0 20rpx 20rpx;
    background: #fff;

    .order-title {
      font-size: 26rpx;
      border-bottom: 2rpx solid #e5e5e5;

      > view:nth-child(1) {
        font-weight: 600;
        padding-bottom: 20rpx;
      }

      > view:nth-child(2) {
        color: #666;
        padding-bottom: 20rpx;
      }
    }

    .goods-box {
      .goods {
        padding: 20rpx 0;
        border-bottom: 2rpx solid #e5e5e5;
        &:nth-last-child(1) {
          padding-bottom: 0;
          border: 0;
        }
        .goods-content {
          font-size: 28rpx;
          margin-left: 20rpx;
          width: 0;
          flex: 1;
          > view:nth-child(1) {
            line-height: 34rpx;
            height: 68rpx;
          }
          .attr {
            line-height: 28rpx;
            height: 56rpx;
            font-size: 24rpx;
            color: #999;
            margin: 6rpx 0;
          }
          .price {
            font-size: 24rpx;
            line-height: 34rpx;
            > view:nth-child(2) {
              color: #f00;
              font-size: 30rpx;
            }
          }
        }
      }
    }

    .total-button {
      margin-top: 10rpx;
      padding-top: 20rpx;
      border-top: 2rpx solid #eee;
      height: 60rpx;
      color: #555;

      .button-box {
        width: 0;
        flex: 1;
        justify-content: flex-end;

        > view {
          padding: 0 20rpx;
          line-height: 50rpx;
          border: 2rpx solid #ddd;
          border-radius: 10rpx;
          margin-left: 20rpx;
          font-size: 30rpx;
        }
      }
    }
  }
}
</style>
