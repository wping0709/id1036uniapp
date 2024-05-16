<template>
  <u-popup
    :show="show"
    round="30rpx"
    mode="center"
    :safeAreaInsetBottom="false"
    @close="$emit('update:show', false)"
  >
    <div class="popup-box">
      <div class="popup-title">选择发货方式</div>
      <div class="list flex-y-center flex-x-sa">
        <div @click="sIndex = 1" :class="sIndex == 1 && 'check'" class="item">
          快递配送
        </div>
        <div @click="sIndex = 0" :class="sIndex == 0 && 'check'" class="item">
          无需物流
        </div>
      </div>
      <div class="bts flex-y-center flex-x-sa">
        <div @click="$emit('update:show', false)">取消</div>
        <div @click="deliverConfirm">确定</div>
      </div>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    orderId: {
      type: [String, Number],
      default: '',
    },
    type: {
      type: String,
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
      if (this.sIndex) {
        this.$utils.toUrl(
          '/mch/m/order-send/order-send' +
            uni.$u.queryParams({ id: this.orderId, pageType: this.type })
        );
        this.$emit('update:show', false);
      }
      // 无需物流发货
      else {
        this.$emit('update:show', false);
        uni.showModal({
          title: '提示',
          content: '无需物流方式，订单将直接标记成已发货，确认操作？',
          success: async res => {
            if (res.confirm) {
              if (this.type == 'mh') {
                var res = await this.$requestAll.mch.mhSend({
                  order_id: this.orderId,
                  send_type: 'none',
                });
              } else if (this.type == 'ms') {
                var res = await this.$requestAll.mch.msSend({
                  order_id: this.orderId,
                  send_type: 'none',
                });
              } else if (this.type == 'pt') {
                var res = await this.$requestAll.mch.ptSend({
                  order_id: this.orderId,
                  send_type: 'none',
                });
              } else if (this.type == 'yy') {
                var res = await this.$requestAll.mch.yySend({
                  order_id: this.orderId,
                  send_type: 'none',
                });
              } else {
                var res = await this.$requestAll.mch.orderSend({
                  order_id: this.orderId,
                  send_type: 'none',
                });
              }
              uni.showModal({
                title: '提示',
                content: res.msg,
                showCancel: false,
                success: res => {
                  if (res.confirm) {
                    this.$emit('update:show', false);
                    this.$emit('success');
                  }
                },
              });
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-box {
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
    margin: 0 20rpx;
    border-top: 1px solid #eee;
    line-height: 100rpx;
    > div {
      flex: 1;
      text-align: center;
      &:nth-last-child(1) {
        color: #ff4544;
      }
    }
  }
}
</style>
