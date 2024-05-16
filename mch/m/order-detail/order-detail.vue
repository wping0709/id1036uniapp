<template>
  <view v-if="order" class="body">
    <view class="content-box">
      <div class="order-title flex-x-sb border-b">
        <div class="left">订单详情</div>
        <div>状态：{{ order.status_text }}</div>
      </div>
      <div class="tabel">
        <view class="flex-y-center m-y-20">
          <div class="label">订单编号：</div>
          <div class="label-text flex-w-1">{{ order.order_no }}</div>
        </view>
        <view class="flex-y-center">
          <div class="label">下单时间：</div>
          <div class="label-text flex-w-1">{{ order.addtime }}</div>
        </view>
        <GoodsList :goodsList="order.goods_list"></GoodsList>

        <view
          v-if="pageType != 'yy'"
          class="flex-y-center flex-x-sb color-999 p-y-20"
        >
          <view>运费</view>
          <view>+￥{{ order.express_price }}</view>
        </view>

        <view class="flex-y-center flex-x-sb p-t-20 border-t">
          <view>实际支付</view>
          <view>￥{{ order.pay_price }}</view>
        </view>
        <view
          v-if="order.is_pay == 0 && !pageType"
          class="flex-y-center flex-x-end p-t-20"
        >
          <view @click="modifyShow = true" class="copy-bt">改价</view>
        </view>
      </div>
    </view>

    <view v-if="pageType != 'yy'" class="content-box">
      <div class="order-title flex-x-sb border-b">
        <div class="left">收货信息</div>
        <div>{{ order.express_type }}</div>
      </div>
      <div class="tabel">
        <template v-if="order.is_offline != 1">
          <view class="flex-y-center m-y-20">
            <div class="label">收货人：</div>
            <div class="label-text flex-w-1">{{ order.name }}</div>
          </view>
          <view class="flex-y-center">
            <div class="label">联系电话：</div>
            <div class="label-text flex-w-1">{{ order.mobile }}</div>
          </view>
          <view class="flex-y-center">
            <div class="label">收货地址：</div>
            <div class="label-text flex-x-sb flex-w-1">
              <text class="flex-w-1 u-line-2">{{ order.address }}</text>
              <text class="copy-bt" @click="onCopy(order)">复制</text>
            </div>
          </view>
        </template>
        <template v-else>
          <view class="flex-y-center m-y-20">
            <div class="label">店铺名称：</div>
            <div class="label-text flex-w-1">{{ order.shop.name }}</div>
          </view>
          <view class="flex-y-center">
            <div class="label">联系电话：</div>
            <div class="label-text flex-w-1">{{ order.shop.mobile }}</div>
          </view>
          <view class="flex-y-center">
            <div class="label">店铺地址：</div>
            <div class="label-text flex-x-sb flex-w-1">
              <text class="flex-w-1 u-line-2">{{ order.shop.address }}</text>
              <text class="copy-bt" @click="onCopy(order)">复制</text>
            </div>
          </view>
        </template>
        <template
          v-if="
            order.is_pay == 1 &&
            order.is_delete == 0 &&
            order.is_cancel == 0 &&
            order.is_send == 0 
          "
        >
          <view class="flex-y-center flex-x-sb m-t-20 p-y-20 border-b border-t">
            <div class="label flex-w-1">买家已付款：请及时发货</div>
            <div
              v-if="order.is_send == 0"
              class="copy-bt"
              @click="showPopup = true"
            >
              发货
            </div>
          </view>
          <view
            v-if="order.is_confirm == 0"
            class="flex-y-center flex-x-sb p-y-20"
          >
            <div class="label"></div>
            <div
              @click="showPopup = true"
              class="copy-bt"
              style="width: initial; padding: 0 20rpx"
            >
              修改物流信息
            </div>
          </view>
          <view class="flex-y-center m-b-20">
            <div class="label">快递单号：</div>
            <div class="label-text flex-w-1">{{ order.express_no }}</div>
          </view>
          <view class="flex-y-center m-b-20">
            <div class="label">快递公司：</div>
            <div class="label-text flex-w-1">{{ order.express }}</div>
          </view>
          <view class="flex-y-center m-b-20">
            <div class="label">物流信息：</div>
            <div class="label-text flex-w-1 color-999">
              <template v-if="order.express_data.code == 0">
                <div
                  class="item flex-y-center"
                  v-for="(item, index) of order.express_data.data.list"
                  :key="index"
                >
                  <text class="flex-w-1">{{ item.detail }}</text>
                  <text class="m-l-10">{{ item.datetime }}</text>
                </div>
              </template>
              <template v-else>暂无物流信息</template>
            </div>
          </view>
        </template>
      </div>
    </view>

    <view class="bottom-bts">
      <div class="fixed">
        <div class="bt" @click="onDayin">打印小票</div>
      </div>
    </view>

    <DeliverPopup
      :show.sync="showPopup"
      :type="pageType"
      :orderId="id"
      @success="loadData"
    ></DeliverPopup>

    <ModifyPrice
      :show="modifyShow"
      :order="order"
      :showChange.sync="modifyShow"
      @confirm="loadData"
    ></ModifyPrice>
  </view>
</template>
<script>
// 商品组件
import GoodsList from '../order/components/GoodsList.vue';
// 选择快递方式
import DeliverPopup from '../order/components/deliver-popup.vue';
// 修改价格组件
import ModifyPrice from '../order/components/ModifyPrice';
export default {
  components: {
    GoodsList,
    DeliverPopup,
    ModifyPrice,
  },
  data() {
    return {
      pageType: '',
      id: '',
      order: '',
      showPopup: false,
      modifyShow: false,
    };
  },
  onLoad(params) {
    this.id = params.id;
    this.pageType = params.pageType;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageType == 'ms') {
        var res = await this.$requestAll.mch.msDetail({ id: this.id }, true);
      } else if (this.pageType == 'pt') {
        var res = await this.$requestAll.mch.ptDetail({ id: this.id }, true);
      } else if (this.pageType == 'yy') {
        var res = await this.$requestAll.mch.yyDetail({ id: this.id }, true);
      } else {
        var res = await this.$requestAll.mch.orderDetail({ id: this.id }, true);
      }
      this.order = res.data.order;
    },
    onCopy(order) {
      let text = `
      收货人：${order.name}\n
      联系电话：${order.mobile}\n
      收货地址：${order.address}
      `;
      this.$utils.copy(text);
    },
    onDayin() {
      uni.showModal({
        title: '提示',
        content: '是否立即打印小票？',
        success: async ({ confirm }) => {
          if (confirm) {
            const res = await this.$requestAll.order.printOrder({
              order_id: this.id,
              order_type: (() => {
                switch (this.pageType) {
                  case 'yy':
                    return 3;
                    break;
                  default:
                    return 0;
                    break;
                }
              })(),
              mch_id: uni.getStorageSync('mch').id || '',
            });
            uni.$u.toast(res.msg);
          }
        },
        fail: () => {},
        complete: () => {},
      });
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
  padding-bottom: env(safe-area-inset-bottom);
  background: #f5f5f5;
  min-height: 100vh;
}
.border-b {
  border-bottom: 1px solid #eee;
}
.border-t {
  border-top: 1px solid #eee;
}
.content-box {
  box-shadow: 4rpx 4rpx 4rpx #eee;
  margin-bottom: 20rpx;
  padding: 20rpx;
  background: #fff;
  font-size: 30rpx;
  .order-title {
    padding-bottom: 20rpx;
    .left {
      color: skyblue;
    }
  }
  .tabel {
    > view {
      .label {
        // text-align: right;
        width: 180rpx;
      }
    }

    .copy-bt {
      color: #666;
      height: 50rpx;
      line-height: 50rpx;
      width: 100rpx;
      text-align: center;
      border-radius: 10rpx;
      border: 1px solid #999;
    }
  }
}

.bottom-bts {
  height: calc(100rpx + env(safe-area-inset-bottom));
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: calc(100rpx + env(safe-area-inset-bottom));
    background: #fff;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    .bt {
      margin-right: 20rpx;
      padding: 0 20rpx;
      height: 60rpx;
      line-height: 60rpx;
      border-radius: 10rpx;
      border: 1px solid #333;
      text-align: center;
    }
  }
}
</style>
