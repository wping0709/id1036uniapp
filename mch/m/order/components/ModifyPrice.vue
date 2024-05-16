<template>
  <u-popup :show="show" :safeAreaInsetBottom="false" mode="center" round="10px">
    <div class="popup-box">
      <div class="tabs">
        <div
          @click="type = 'sub'"
          :class="type == 'sub' && 'check'"
          class="tab"
        >
          优惠
        </div>
        <div
          @click="type = 'add'"
          :class="type == 'add' && 'check'"
          class="tab"
        >
          加价
        </div>
      </div>

      <div class="content">
        <template v-if="type == 'sub'">
          <view class="m-t-20">
            <u-input
              v-model="price"
              placeholder="请输入优惠金额（元）"
              border="none"
              type="number"
            ></u-input>
          </view>
          <view class="font-24 color-666 p-20"
            >最多还可优惠{{ order.max_sub_price }}元</view
          >
        </template>
        <template v-else>
          <view class="m-t-20">
            <u-input
              v-model="price"
              placeholder="请输入加价金额（元）"
              border="none"
              type="number"
            ></u-input>
          </view>
          <view class="font-24 color-666 p-20">加价金额无限制</view>
        </template>
      </div>

      <div class="bts">
        <div @click="$emit('update:showChange', false)" class="cancel">
          取消
        </div>
        <div @click="confirm" class="confirm">确定</div>
      </div>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    order: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      type: 'sub',
      price: '',
    };
  },
  methods: {
    async confirm() {
      console.log('confirm');
      const res = await this.$requestAll.mch.editPrice({
        price: this.price,
        order_id: this.order.id,
        type: this.type,
      });
      uni.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: res => {
          if (res.confirm) {
            this.$emit('update:showChange', false);
            this.$emit('confirm');
          }
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.popup-box {
  border-radius: 10px;
  overflow: hidden;
  width: 80vw;
  .tabs {
    display: flex;
    align-items: center;
    line-height: 100rpx;
    .tab {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
    }
    .check {
      background: #ff4544;
      color: #fff;
    }
  }

  .bts {
    display: flex;
    align-items: center;
    height: 100rpx;
    border-top: 1px solid #eee;
    > view {
      flex: 1;
      text-align: center;
      font-size: 32rpx;
      line-height: 60rpx;
      &:nth-last-child(1) {
        border-left: 1px solid #eee;
      }
    }
  }
}
</style>
