<template>
  <u-popup
    :show="show"
    round="30rpx"
    mode="center"
    :safeAreaInsetBottom="false"
    @close="$emit('update:show', false)"
  >
    <div class="popup-box">
      <div class="popup-title">同意售后</div>
      <div class="flex-y-center">
        <div>退款金额：</div>
        <div class="flex-w-1">
          <u-input v-model="valuePrice" placeholder="退款金额"></u-input>
        </div>
      </div>
      <scroll-view scroll-y class="m-b-20" style="max-height: 500rpx">
        <div class="list">
          <div
            @click="onSwitchIndex(i)"
            class="item flex"
            v-for="(item, i) in address"
            :key="i"
          >
            <view>
              <text
                v-if="checkIndex != i"
                class="iconfont icon-xuanzekuangmoren font-50"
              ></text>
              <text
                v-else
                class="iconfont icon-success-fill price-color font-50"
              ></text>
            </view>

            <view class="flex-w-1 m-l-20">
              <view class="u-line-3 font-30">{{ item.name }}</view>
              <view class="u-line-3 font-30">{{ item.mobile }}</view>
              <view class="u-line-3 font-30">{{ item.address }}</view>
            </view>
          </div>
        </div>
      </scroll-view>

      <div class="bts flex-y-center flex-x-sa">
        <div @click="$emit('update:show', false)">取消</div>
        <div @click="onConfirm">确定</div>
      </div>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      default: false,
    },
    order: {
      default: "",
    },
    address: {
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      remark: "",
      checkIndex: -1,
      valuePrice: "",
    };
  },
  watch: {
    order: {
      handler(val, ovl) {
        if (val) {
          this.valuePrice = val.total_price;
        }
      },
      immediate: true,
    },
  },
  created() {},
  methods: {
    async onConfirm() {
      if (this.checkIndex == -1) return uni.$u.toast("请选择收货地址");
      if(Number(this.valuePrice) <= 0) return uni.$u.toast('退款金额错误') 
      const { msg } = await this.$requestAll.admin.refundHandle(
        {
          order_refund_id: this.order.order_refund_id,
          type: this.order.type,
          action: 1,
          address_id: this.address[this.checkIndex].id,
          orderType: "STORE",
          remark: "",
          refund_price: this.valuePrice
        },
        true
      );
      uni.$u.toast(msg);
      this.$emit("update:show", false);

      let order = JSON.parse(JSON.stringify(this.order));
      order.is_agree = 1;
      this.$emit("update:order", order);
      this.$emit("success", true);
    },
    onSwitchIndex(i) {
      this.checkIndex = i;
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-box {
  padding: 0 20rpx;
  width: 80vw;
  font-size: 30rpx;
  .popup-title {
    line-height: 100rpx;
    text-align: center;
    font-weight: 600;
    font-size: 34rpx;
  }
  .list {
    margin: 20rpx 0 50rpx;
    .item {
      padding: 20rpx 0;
      border-bottom: 1px solid #eee;
    }
  }
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
</style>
