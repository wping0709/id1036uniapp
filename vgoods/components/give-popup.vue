<template>
  <u-popup
    :show="showPopup"
    mode="center"
    :safeAreaInsetBottom="false"
    @close="$emit('update:close', false)"
    bgColor="transparent"
  >
    <div class="dashang-popup bg-fff">
      <template v-if="!isinput">
        <view class="font-600-32 font-center">作者加油</view>

        <div class="price-list flex flex-wrap">
          <div
            @click="onConfirm(item.gift_price)"
            class="price-item"
            v-for="(item, i) in dashangList"
            :key="i"
          >
            ￥{{ item.gift_price }}
          </div>
          <div @click="isinput = true" class="price-item flex-y-center flex-x-center">
            其他金额
          </div>
        </div>
      </template>

      <template v-else>
        <view class="font-600-32 font-center">请输入打赏金额</view>

        <view class="p-y-20">
          <u-input
            @confirm="onConfirm"
            :placeholder="`打赏金额范围￥0.01 - ￥${max_gift_price}`"
            v-model.number="priceValue"
            border="none"
          ></u-input>
        </view>

        <view class="btns m-t-10">
          <div @click="isinput = false" class="cancel flex-w-1">取消</div>
          <div @click="onConfirm(priceValue)" class="confirm flex-w-1" style="color:#007acc">确定</div>
        </view>
      </template>
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
    vgoods_id: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      priceValue: '',
      dashangList: '',
      max_gift_price:0,
      showPopup: false,
      isinput: false,
    };
  },
  watch: {
    show(v) {
      if (v && !this.dashangList) {
        this.getDashangList().then(() => {
          this.showPopup = v;
        });
      } else {
        this.showPopup = v;
      }
    },
  },
  methods: {
    async getDashangList() {
      const res = await this.$requestAll.vgoods.giftSetting({}, true);
      this.max_gift_price = Number(res.data.max_gift_price);
      this.dashangList = res.data.list;
    },
    async onConfirm(e) {
      if (e < 0.01 || e > this.max_gift_price)
        return uni.$u.toast(`打赏金额范围￥0.01 - ￥${this.max_gift_price}`);
      const res = await this.$requestAll.vgoods.giveGift({
        gift_price: e,
        vgoods_id: this.vgoods_id,
      });
      this.priceValue = '';
      this.$utils.toUrl(
        '/pages/pay/pay' +
          uni.$u.queryParams({ order_id: res.data.order_id, order_type: '20' })
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.dashang-popup {
  width: 80vw;
  border-radius: 20rpx;
  padding: 20rpx;
  .price-list {
    .price-item {
      margin-right: 10rpx;
      margin-top: 10rpx;
      width: 180rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      border-radius: 10rpx;
      border: 1px solid #fc4c1e;
      color: #fc4c1e;
      &:nth-child(3n) {
        margin-right: 0;
      }
    }
  }

  .btns {
    border-top: 1px solid #f5f5f5;
    line-height: 80rpx;
    text-align: center;
    display: flex;
    .cancel {
      border-right: 1px solid #f5f5f5;
    }
  }
}
</style>
