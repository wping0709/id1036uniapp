<template>
  <div>
    <div class="block">
      <div class="flex" v-if="order.order_sort">
        编号: <text class="font-w-700">#{{ order.order_sort }}</text>
      </div>

      <div class="flex-y-center">
        <div class="row-fl">订单编号：<text class="font-w-700">{{ order.order_no }}</text></div>
        <div @click="$utils.copy(order.order_no)" class="copy">复制</div>
      </div>

      <div class="flex">下单时间：<text class="font-w-700">{{ order.addtime }}</text></div>


      <div class="flex" v-if="order.peisong_text">
        配送状态：<text class="font-w-700">{{ order.peisong_text }}</text>
      </div>


      <div v-if="order.pay_type_text" class="pay-type">
        {{ order.pay_type_text }}
      </div>

      <div class="flex-x-sb">
        <div>商品总额</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">
          ￥{{ order ? order.goods_total_price : 0.0 }}
        </div>
      </div>
      <div class="flex-x-sb" v-if="order.type != 6">
        <div>商品数量</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">{{ order.num }}件</div>
      </div>
      <div class="flex-x-sb" v-if="order.user_coupon_id">
        <div>优惠券优惠</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">
          -{{ order.coupon_sub_price }}件
        </div>
      </div>
      <div
        class="flex-x-sb"
        v-if="order.integral && order.integral.forehead > 0"
      >
        <div>积分抵扣</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">
          -￥{{ order.integral.forehead }}
        </div>
      </div>
      <div
        class="flex-x-sb"
        v-if="order.reduction_price && order.reduction_price > 0"
      >
        <div>首单优惠</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">
          -￥{{ order.reduction_price }}
        </div>
      </div>
      <div class="flex-x-sb" v-if="order.minus_price && order.minus_price > 0">
        <div>满减优惠</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">-￥{{ order.minus_price }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.discount < 10 && order.discount">
        <div>会员折扣</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">{{ order.discount }}折</div>
      </div>
      <div class="flex-x-sb" v-if="order.before_update">
        <div>{{ order.before_update }}</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">￥{{ order.money }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.colonel">
        <div>团长优惠</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">￥{{ order.colonel }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.type != 6">
        <div>运费</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">
          ￥{{ order.express_price }}
        </div>
      </div>


      <div class="flex-x-sb" v-if="order.is_order_food && order.table_price - 0 > 0">
          <div>餐位费</div>
          <div class="flex-w-1 m-l-30 font-right font-w-700">￥{{ order.table_price }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.is_order_food && order.box_price - 0 > 0">
          <div>包厢使用费</div>
          <div class="flex-w-1 m-l-30 font-right font-w-700">￥{{ order.box_price }}</div>
      </div>
	
      <div class="flex-x-sb" v-if="order.dabao_price > 0">
        <div>打包费</div>
        <div class="flex-w-1 m-l-30 font-right font-w-700">￥{{ order.dabao_price }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.content">
        <div>买家留言</div>
        <div class="flex-w-1 m-l-30 font-left">{{ order.content }}</div>
      </div>
      <div class="flex-x-sb" v-if="order.words">
        <div>商家留言</div>
        <div class="flex-w-1 m-l-30 font-left">{{ order.words }}</div>
      </div>

      <div class="block-footer flex-x-end">
        <div class="kefu flex-y-center">
          <!-- <text class="iconfont icon-service font-50"></text>
          <text>客服</text> -->
        </div>
        合计：
        <PriceText
          :price="order.pay_price"
          ySize="36rpx"
          fSize="24rpx"
        ></PriceText>
      </div>
    </div>
  </div>
</template>

<script>
import PriceText from '@/components/price-text/index';
// import Utils from '@/utils'

export default {
  name: 'OrderPrice',
  components: {
    PriceText,
  },
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
  padding: 14rpx 24rpx;
  margin: 20rpx 24rpx;
  line-height: 36rpx;
  border-radius: 20rpx;
  font-size: 36rpx;
  > div {
    min-height: 80rpx;
    font-size: 26rpx;
    align-items: center;
    border-bottom: 1px solid #f8f8f8;
    &:nth-last-child(1) {
      border: 0 solid #000;
    }
  }
  .block-footer {
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
.copy {
  margin-left: 56rpx;
  width: 68rpx;
  line-height: 34rpx;
  background: #f2f2f2;
  border-radius: 120rpx;

  text-align: center;
  font-size: 22rpx;
  line-height: 34rpx;
  color: rgba(51, 51, 51, 0.94);
}

.pay-type {
  width: 100%;
  padding: 16 * 2rpx 0 4 * 2rpx 0;
  border-top: 1 * 2rpx solid #eee;
  margin-top: 16 * 2rpx;
}
</style>
