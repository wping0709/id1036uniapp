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
          <div class="label">订单时间：</div>
          <div class="label-text flex-w-1">{{ order.order_time }}</div>
        </view>
        <GoodsList :goodsList="[order]"></GoodsList>
      </div>
    </view>

    <view class="content-box">
      <div class="order-title flex-x-sb border-b">
        <div class="left">售后信息</div>
        <div></div>
      </div>
      <div class="tabel">
        <view class="flex-y-center m-y-20">
          <div class="label">退款编号：</div>
          <div class="label-text flex-w-1">{{ order.order_refund_no }}</div>
        </view>
        <view class="flex-y-center m-y-20">
          <div class="label">申请时间：</div>
          <div class="label-text flex-w-1">{{ order.order_refund_time }}</div>
        </view>
        <view class="flex-y-center m-y-20">
          <div class="label">售后类型：</div>
          <div class="label-text flex-w-1">{{ order.refund_type }}</div>
        </view>
        <view class="flex-y-center m-y-20">
          <div class="label">退款金额：</div>
          <div class="label-text flex-w-1">{{ order.refund_price }}</div>
        </view>
        <view class="flex-y-center m-y-20">
          <div class="label">申请理由：</div>
          <div class="label-text flex-w-1">{{ order.desc }}</div>
        </view>
      </div>
    </view>


    <view v-if="pageType != 'yy'" class="content-box">
      <div class="order-title flex-x-sb border-b">
        <div class="left">收货信息</div>
        <div></div>
      </div>
      <div class="tabel">
        <view class="flex-y-center m-y-20">
          <div class="label">收货人：</div>
          <div class="label-text flex-w-1">{{ order.username }}</div>
        </view>
        <view class="flex-y-center m-y-20">
          <div class="label">申请时间：</div>
          <div class="label-text flex-w-1">{{ order.order_refund_time }}</div>
        </view>
        <view class="flex-y-center m-y-20">
          <div class="label">售后类型：</div>
          <div class="label-text flex-w-1">{{ order.refund_type }}</div>
        </view>
      </div>
    </view>

    <div class="bottom-bt" v-if="order.status == 0">
      <div class="fixed">
        <div class="bt" @click="refundSet(i, 0)">拒绝</div>
        <div class="bt" @click="refundSet(i, 1)">同意</div>
      </div>
    </div>
  </view>
</template>
<script>
import GoodsList from '../order/components/GoodsList.vue';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      order: '',
      pageType: '',
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
        var res = await this.$requestAll.mch.msRefundDetail({
          id: this.id,
        });
      } else if (this.pageType == 'yy') {
        var res = await this.$requestAll.mch.yyRefundDetail({
          id: this.id,
        });
      } else {
        var res = await this.$requestAll.mch.refundDetail({
          id: this.id,
        });
      }
      this.order = res.data;
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
                this.loadData();
              },
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
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

.bottom-bt {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  .fixed {
    padding: 0 30rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);

    display: flex;
    justify-content: flex-end;
    align-items: center;
    background: #fff;
    .bt {
      margin-left: 20rpx;
      width: 100rpx;
      text-align: center;
      line-height: 2;
      border: 1px solid #999;
      border-radius: 10rpx;
    }
  }
}
</style>
