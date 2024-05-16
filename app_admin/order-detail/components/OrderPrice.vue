<template>
  <div>
    <div class="block">
      <div class="flex-x-sb">
        <div>商品总额</div>
        <div class="flex-w-1 m-l-30 font-right">
          ￥{{ order ? order.goods_total_price : 0.0 }}
        </div>
      </div>
      <div class="flex-x-sb" v-if="order.type != 6">
        <div>商品数量</div>
        <div class="flex-w-1 m-l-30 font-right">{{ order.num }}件</div>
      </div>
      <div class="flex-x-sb" v-if="order.user_coupon_id">
        <div>优惠券优惠</div>
        <div class="flex-w-1 m-l-30 font-right">-{{ order.coupon_sub_price }}</div>
      </div>
      <div
        class="flex-x-sb"
        v-if="order.integral && order.integral.forehead > 0"
      >
        <div>积分抵扣</div>
        <div class="flex-w-1 m-l-30 font-right">-￥{{ order.integral.forehead }}</div>
      </div>
      <div
        class="flex-x-sb"
        v-if="order.reduction_price && order.reduction_price > 0"
      >
        <div>首单优惠</div>
        <div class="flex-w-1 m-l-30 font-right">-￥{{ order.reduction_price }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.minus_price && order.minus_price > 0">
        <div>满减优惠</div>
        <div class="flex-w-1 m-l-30 font-right">-￥{{ order.minus_price }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.discount < 10 && order.discount">
        <div>会员折扣</div>
        <div class="flex-w-1 m-l-30 font-right">{{ order.discount }}折</div>
      </div>
      <div class="flex-x-sb" v-if="order.before_update">
        <div>{{ order.before_update }}</div>
        <div class="flex-w-1 m-l-30 font-right">￥{{ order.money }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.colonel">
        <div>团长优惠</div>
        <div class="flex-w-1 m-l-30 font-right">￥{{ order.colonel }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.type != 6">
        <div>运费</div>
        <div class="flex-w-1 m-l-30 font-right">￥{{ order.express_price }}</div>
      </div>

      <div class="flex-x-sb" v-if="order.dabao_price > 0">
        <div>打包费</div>
        <div class="flex-w-1 m-l-30 font-right">￥{{ order.dabao_price }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.content">
        <div>买家留言</div>
        <div class="flex-w-1 m-l-30 font-left">{{ order.content }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.words">
        <div>商家留言</div>
        <div class="flex-w-1 m-l-30 font-left">{{ order.words }}</div>
      </div>

      <div class="block-footer">
        <div class="kefu flex-y-center" >
          <!-- <text class="iconfont icon-service font-50"></text>
          <text>客服</text> -->
        </div>
        合计：<span>￥{{ order.pay_price }}</span>
      </div>
    </div>
  </div>
</template>

<script>
// import Utils from '@/utils'

export default {
  name: 'OrderPrice',
  props: {
    order: Object,
  },
  data() {
    return {};
  },
  computed: {
    // toUserID: function () {
    //   let mch_id = this.order.mch ? this.order.mch.id : 0
    //   if (mch_id > 0) {
    //     return this.order.mch.service_tel
    //   } else {
    //     return this.$store.state.baseData.store.kefu_setting.mobile
    //   }
    //   let store_id = this.$store.state.store_id
    //   return Utils.getKefuId(mch_id, store_id)
    // },
    // toUserNickname: function () {
    //   if (this.order.mch) {
    //     return this.order.mch.name
    //   }
    //   return '平台自营'
    // },
    // toUserImg: function () {
    //   if (this.order.mch) {
    //     return this.order.mch.logo
    //   }
    //   return this.$store.state.baseData.store.copyright_pic_url
    // }
  },
  methods: {
    //   onClickKefu: function () {
    //       this.$router.replace({
    //           name: 'Kefu',
    //           query: {
    //               to_user_id: this.toUserID,
    //               to_user_nickname: this.toUserNickname,
    //               to_user_img: this.toUserImg,
    //               back: this.$route.fullPath,
    // 	  to_mch_id: this.order.mch ? this.order.mch.id : 0
    //           }
    //       })
    //   }
  },
};
</script>

<style lang="less" scoped>
.block {
  background: #fff;
  padding: 16 * 2rpx 12 * 2rpx;
  margin-bottom: 10 * 2rpx;
  line-height: 18 * 2rpx;
  > div {
    min-height: 60rpx;
  }
  .block-footer {
    line-height: initial;
    border-top: 1px solid #eee;
    margin-left: -24rpx;
    margin-right: -24rpx;
    padding: 24rpx;
    padding-bottom: 0;
    text-align: right;
    font-weight: bold;
    position: relative;
    > span {
      color: #ff4544;
    }
    .kefu {
      position: absolute;
      font-weight: normal;
      > img {
        display: inline-block;
        width: 40rpx;
        height: 40rpx;
        vertical-align: middle;
        margin-right: 10rpx;
      }
    }
  }
}
.block-row {
  margin-bottom: 6 * 2rpx;
}

.block-row .row-fr button {
  line-height: 20 * 2rpx;
  height: 22 * 2rpx;
  font-size: 12 * 2rpx;
  color: #888;
  border: 1 * 2rpx solid #ddd;
  border-radius: 3 * 2rpx;
  padding: 0 6 * 2rpx;
  background-color: #fff !important;
  box-shadow: none;
  outline: none;
}
.pay-type {
  width: 100%;
  padding: 16 * 2rpx 0 4 * 2rpx 0;
  border-top: 1 * 2rpx solid #eee;
  margin-top: 16 * 2rpx;
}
</style>
