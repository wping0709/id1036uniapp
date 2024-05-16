<template>
  <u-popup
    :show="show"
    round="30rpx"
    mode="center"
    :safeAreaInsetBottom="false"
    @close="$emit('update:show', false)"
  >
    <div class="popup-box">
      <div class="popup-title">拒绝售后</div>

      <view class="m-b-20">
        <u-textarea v-model="remark" placeholder="请输入拒绝理由"></u-textarea>
      </view>

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
      default: '',
    },
  },
  data() {
    return {
      remark: '',
    };
  },
  methods: {
    async onConfirm() {
      const { msg } = await this.$requestAll.admin.refundHandle(
        {
          order_refund_id: this.order.order_refund_id,
          type: this.order.type,
          action: 2,
          address_id: 0,
          orderType: 'STORE',
          remark: this.remark,
        },
        true
      );
      uni.$u.toast(msg);
      this.$emit('update:show', false);

      let order = JSON.parse(JSON.stringify(this.order));
      order.is_agree = 2;
      this.$emit('update:order', order);
      this.$emit('success', true);
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
      line-height: 2.4;
      border-radius: 10rpx;
      border: 1px solid #eee;
      width: 200rpx;
      text-align: center;
    }
    .check {
      background: #ff4544;
      color: #fff;
      border-color: #ff4544;
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
