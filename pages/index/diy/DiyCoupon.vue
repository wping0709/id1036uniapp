<template>
  <view
    v-if="param.coupon_list && param.coupon_list.length"
    class="contentbox1"
    style="margin-top: 0; padding-top: 20rpx"
  >
    <view class="couponbox1">
      <view
        class="coupon1"
        v-for="(item, index) of param.coupon_list"
        :key="index"
        @click="receive(item.id)"
      >
        <image
          :src="item.is_receive == 0 ? param.bg : param.bg_1"
          mode="widthFix"
        />
        <view class="v11" :style="{ color: param.color }">
          <template v-if="item.discount_type == 2">
            ￥<text>{{ item.sub_price }}</text>
          </template>
          <template v-if="item.discount_type == 1">
            <text style="font-size: 40rpx">{{ item.discount }}</text
            ><text>折</text>
          </template>
        </view>
        <view class="v21" :style="{ color: param.color }">
          满<text>{{ item.min_price }}</text
          >元可用
        </view>
        <view class="v31" :style="{ color: param.color }">
          {{ item.receive_content }}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DiyCoupon',
  props: ['page_id', '_templateKey', 'item'],
  data() {
    return {
      param: '',
    };
  },
  created() {
    this.loadData();
    console.log(this.$root);
  },
  methods: {
    async loadData() {
      if (!this.page_id) {
        this.param = this.item.param;
      } else {
        const formData = {
          page_id: this.page_id,
          _templateKey: this._templateKey,
          _templateItem: JSON.stringify(this.item),
          _template: this.item.type,
        };
        const res = await this.$requestAll.home.getTemplateData(formData);
        this.param = res.data.param;
      }
    },
    // 领取优惠券
    async receive(id) {
      await this.$requestAll.coupon.receiveCoupon({ id }, true);
      if (this.page_id) {
        this.loadData();
      } else {
        let index = this.param.coupon_list.findIndex(item => item.id == id);
        this.param.coupon_list[index].is_receive = 1
        this.$set(this,'param',this.param)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;

.couponbox1 {
  width: 100%;
  box-sizing: border-box;
  padding: 0 6 * $rpx 8 * $rpx;
  white-space: nowrap;
  overflow-x: scroll;
}
.coupon1 {
  display: inline-block;
  position: relative;
  margin: 0 4 * $rpx;
}
.coupon1 image {
  width: 120 * $rpx;
  height: auto;
}
.coupon1 .v11 {
  position: absolute;
  top: 5 * $rpx;
  left: 13 * $rpx;
  color: #fff;
}

.coupon1 .v11 text {
  font-size: 20 * $rpx;
}

.coupon1 .v21 {
  position: absolute;
  bottom: 5 * $rpx;
  font-size: 12 * $rpx;
  left: 13 * $rpx;
  color: #fff;
}

.coupon1 .v31 {
  font-size: 12 * $rpx;
  width: 12 * $rpx;
  padding: 3 * $rpx;
  position: absolute;
  top: 50%;
  right: 18rpx;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  white-space: pre-wrap;
  line-height: 14 * $rpx;
  text-align: center;
  border-radius: 18 * $rpx;
  color: #fff;
}
</style>
