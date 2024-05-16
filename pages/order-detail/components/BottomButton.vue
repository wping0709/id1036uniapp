<template>
  <view class="box">
    <!-- 拼团 -->
    <template v-if="type == 'pt'">
      <div class="fixed" v-if="order.status == 2">
        <div class="btn" @click="navToKaituan">邀请开团</div>
      </div>
      <div
        class="fixed"
        v-if="order.status == 3 && !order.is_confirm && order.is_send == 1"
      >
        <div class="btn" @click="confirmReceipt">确认收货</div>
      </div>
    </template>

    <!-- 普通 -->
    <template v-else>
      <div class="fixed" v-if="order.is_send == 0 && order.is_pay == 1">
        <div @click="onTuikuan" class="btn" v-if="order.apply_delete == 0">
          申请退款
        </div>

        <span v-if="order.apply_delete == 1">
          <template v-if="order.cancel_status == 0">退款申请中</template>
          <template v-if="order.cancel_status == 1">退款成功</template>
        </span>
      </div>
    </template>
  </view>
</template>

<script>
export default {
  props: {
    order: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default: '',
    },
  },
  methods: {
    onTuikuan() {
      const item = this.order;
      uni.showModal({
        title: '提示',
        // content: `您确定退款当前订单${item.order_id}`,
        content: '是否取消该订单？',
        success: async res => {
          if (res.confirm) {
            var res = {};
            if (this.type == 'miaosha') {
              res = await this.$requestAll.miaosha.revoke(
                {
                  order_id: item.order_id,
                  mch_id: item.mch_id,
                },
                true
              );
            } else {
              res = await this.$requestAll.order.orderRevoke(
                {
                  order_id: item.order_id,
                },
                true
              );
            }
            uni.showModal({
              title: '提示',
              content: res.msg,
              showCancel: false,
              success: res => {
                if (res.confirm) {
                  this.$emit('success');
                }
              },
            });
          } else if (res.cancel) {
            // this.$utils.toast('用户点击取消');
          }
        },
      });
    },
    navToKaituan() {
      console.log('111');
      this.$utils.toUrl(
        '/pt/group/details' +
          uni.$u.queryParams({
            oid: this.order.order_id,
            user_id: this.$store.getters['user/userInfo'].id,
          })
      );
    },
    async confirmReceipt() {
      console.log('确认收货');
      const res = await this.$requestAll.group.orderConfirm({
        order_id: this.order.order_id,
      });
      uni.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: () => {
          this.$emit('success');
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));

  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    background: #fff;

    padding: 0 20rpx;
    padding: 0 20rpx env(safe-area-inset-bottom);

    display: flex;
    align-items: center;
    justify-content: flex-end;

    .btn {
      margin-left: 24rpx;
      height: 60rpx;
      line-height: 60rpx;
      padding: 0 28rpx;
      border: 2rpx solid #999;
      border-radius: 30rpx;

      text-align: center;
      color: #333;
      font-size: 24rpx;
    }
  }
}
</style>
