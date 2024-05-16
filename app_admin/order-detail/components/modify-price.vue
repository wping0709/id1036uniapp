<template>
  <u-popup
    :show="show"
    round="30rpx"
    mode="center"
    :safeAreaInsetBottom="false"
    @close="$emit('update:show', false)"
  >
    <div class="popup-box">
      <div class="popup-title">修改价格</div>
      <view>
        <u-form v-model="form" labelWidth="240rpx">
          <u-form-item label="金额(不含运费)">
            <u-input
              v-model="form.total_price"
              border="bottom"
              placeholder="请输入"
            ></u-input>
          </u-form-item>
          <u-form-item label="运费">
            <u-input
              v-model="form.express_price"
              border="bottom"
              placeholder="请输入"
            ></u-input>
          </u-form-item>
        </u-form>
      </view>
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
      default: false,
    },
    order: {
      default: '',
    },
  },
  data() {
    return {
      form: {
        total_price: '',
        express_price: '',
      },
    };
  },
  watch: {
    order: {
      handler(val) {
        if (val) {
          this.form = {
            total_price: val.pay_price - val.express_price,
            express_price: val.express_price,
          };
        }
      },
      immediate: true,
    },
  },
  methods: {
    async deliverConfirm() {
      const { msg } = await this.$requestAll.admin.updatePrice(
        { ...this.form, order_id: this.order.order_id || this.order.id },
        true
      );
      uni.$u.toast(msg);
      this.$emit('update:show', false);
      this.$emit('success');
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
