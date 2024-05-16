<template>
  <u-popup
    :show="show"
    round="30rpx"
    mode="center"
    :safeAreaInsetBottom="false"
    @close="$emit('update:show', false)"
  >
    <div class="popup-box">
      <div class="popup-title">售后理由</div>

      <view class="color-999" style="min-height:100rpx">
        申请原因：{{ order.refund_desc }}
      </view>

      <div class="bts flex-y-center flex-x-sa">
        <div @click="$emit('update:show', false)">取消</div>
        <div @click="$emit('update:show', false)">确定</div>
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
      sIndex: 1,
    };
  },
  methods: {
    deliverConfirm() {
      this.$emit('update:show', false);
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
