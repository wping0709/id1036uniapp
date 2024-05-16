<template>
  <view v-if="order" class="box">
    <!-- 取消和完成不展示按钮 -->
    <!-- v-if="
		  !($utils.orderStatus(order) == 3 || $utils.orderStatus(order) == 4) ||
		  order.is_refund
		" -->
    <div class="fixed">
      <div @click="onShowPopup('showContent', true)" class="btn">备注</div>

      <div
        v-if="$utils.orderStatus(order) == 0"
        @click="onShowPopup('showPrice', true)"
        class="btn"
      >
        修改价格
      </div>

      <div
        v-if="$utils.orderStatus(order) == 1"
        @click="onShowPopup('showPopup', true)"
        class="btn"
      >
        发货
      </div>

      <div @click="onDayin" class="btn">打印小票</div>

      <!-- 已发货，未取消 -->
      <div
        v-if="$utils.orderStatus(order) == 2"
        @click="
          $utils.toUrl(
            '/mch/m/order-send/order-send?id=' +
              order.order_id +
              '&pageType=' +
              type
          )
        "
        class="btn"
      >
        修改物流
      </div>
      <!-- 未取消，未发货 -->
      <div
        @click="onCancel"
        class="btn"
        v-if="order.cancel_status == 0 && order.is_send == 0"
      >
        取消订单
      </div>

      <div
        v-if="order.is_refund"
        @click="onShowPopup('showSale', true)"
        class="btn"
      >
        售后理由
      </div>
    </div>
    <DeliverPopup
      :show.sync="showPopup"
      type="admin"
      :orderId="order.order_id"
      @success="$emit('success')"
    >
    </DeliverPopup>

    <ModifyPrice
      :show.sync="showPrice"
      :order="order"
      @success="$emit('success')"
    ></ModifyPrice>

    <SalePopup :show.sync="showSale" :order="order"></SalePopup>

    <u-modal
      @confirm="contentConfirm"
      @cancel="onShowPopup('showContent', false)"
      :show="showContent"
      showCancelButton
      width="80vw"
      title="备注"
    >
      <u-textarea
        maxlength="-1"
        v-model="textarea"
        placeholder="请输入备注内容~"
        border="none"
      />
    </u-modal>
  </view>
</template>

<script>
import DeliverPopup from './deliver-popup.vue';
import ModifyPrice from './modify-price.vue';
import SalePopup from './sale-popup.vue';
export default {
  components: {
    DeliverPopup,
    ModifyPrice,
    SalePopup,
  },
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default: 'admin',
    },
  },
  data() {
    return {
      showPopup: false,
      showPrice: false,
      showSale: false,
      showContent: false,
      textarea: '',
    };
  },
  watch: {
    order: {
      handler(val) {
        this.textarea = val.seller_comments;
      },
      immediate: true,
    },
  },
  methods: {
    // 取消订单
    async onCancel() {
      uni.showModal({
        title: '提示',
        content: '您确定取消该订单？',
        success: async res => {
          if (res.confirm) {
            var res = await this.$requestAll.admin.orderCancel({
              order_id: this.order.order_id,
              status: 1,
              remark: '',
            });
            this.$emit('success');
            uni.$u.toast(res.msg);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
      console.log('取消订单');
    },
    onShowPopup(key, b) {
      this[key] = b;
    },
    async contentConfirm() {
      await this.$requestAll.admin.sellerComments({
        order_id: this.order.order_id,
        seller_comments: this.textarea,
      });
      this.showContent = false;
      this.$emit('success');
    },
    onDayin() {
      uni.showModal({
        title: '提示',
        content: '是否立即打印小票？',
        success: async ({ confirm }) => {
          if (confirm) {
            const res = await this.$requestAll.order.printOrder({
              order_id: this.order.order_id,
							order_type:0
            });
            uni.$u.toast(res.msg);
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
  },
  options: {
    styleIsolation: 'shared',
  },
};
</script>

<style lang="scss" scoped>
/deep/.u-modal__content {
  padding: 20rpx !important;
}

/deep/.u-modal__title {
  padding-top: 20rpx;
}

.box {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));

  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;

    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));

    background: #fff;

    padding: 0 20rpx;
    padding: 0 20rpx env(safe-area-inset-bottom);

    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn {
      margin-left: 20rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      padding: 0 20rpx;
      border: 2rpx solid #999;
      color: #333;
      border-radius: 10rpx;
    }
  }
}
</style>
