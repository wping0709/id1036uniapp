<template>
  <view v-if="pageData" class="body env-bottom">
    <OrderAddress :order="pageData.order_info"></OrderAddress>

    <!-- 订单信息 -->
    <OrderInfo :order="pageData.order_info"></OrderInfo>

    <view class="m-y-20 p-x-20 bg-fff font-30 m-x-24 bdrd-20">
      <view class="p-y-20">{{ payStatus }}</view>
      <view class="flex-x-sb p-b-20">
        <text>剩余开盒次数</text>
        <text>{{ pageData.surplus_num }}次</text>
      </view>
      <view class="p-b-20 flex-x-end flex-y-center">
        <text>合计：</text>
        <text class="price-color">￥{{ pageData.order_info.pay_price }}</text>
        <text
          v-if="pageData.surplus_num > 0"
          @click="
            $utils.toUrl(
              '/blind/open-blind/open-blind?order_id=' + pageData.order_info.id
            )
          "
          class="kaihe-btn m-l-20"
          >去开盒</text
        >
      </view>
    </view>

    <view v-if="pageData.order_goods_list.length" class="goods-list">
      <view v-for="(goods, i) in pageData.order_goods_list" :key="i">
        <view class="p-y-10">开盒时间：{{ goods.addtime }}</view>
        <div class="goods flex">
          <image :src="goods.cover_pic" mode="aspectFill" />

          <view class="goods-content flex-w-1">
            <div class="goods-name u-line-2 m-b-10">
              {{ goods.goods_name }}
            </div>
            <view class="goods-attr color-999 font-20 m-b-10">
              <text v-for="(item, i) in goods.attr" :key="i" class="m-r-20">
                <text>{{ item.attr_group_name }}： </text>
                <text>{{ item.attr_name }}</text>
              </text>
            </view>
            <view class="goods-price price-color m-b-10">
              ￥{{ goods.pay_price }}
            </view>

            <view class="goods-bts flex-x-end">
              <view
                v-if="goods.is_send == 1 && goods.is_confirm == 1"
                class="btn border0"
              >
                已收货
              </view>
              <view v-if="goods.is_send == 0" class="btn border0">待发货</view>
              <view
                @click="showAttrPopup(goods)"
                v-if="goods.use_attr == 1 && goods.is_send == 0"
                class="btn"
              >
                选规格
              </view>
              <view
              @click="onOrderConfirm(goods)"
                v-if="goods.is_send == 1 && goods.is_confirm == 0"
                class="btn"
              >
                确认收货
              </view>
            </view>
          </view>
        </div>

        <div v-if="goods.words" class="flex m-t-10">
          <div>留言：</div>
          <div class="flex-w-1 m-l-10 color-666">{{goods.words}}</div>
        </div>
      </view>

    </view>

    <AttrPopup
      ref="AttrPopup"
      :goodsId="checkGoods.goods_id"
      @confirm="attrConfirm"
      type="blind"
    ></AttrPopup>
  </view>
</template>
<script>
import OrderAddress from '@/pages/order-detail/components/OrderAddress';
import OrderInfo from '@/pages/order-detail/components/OrderInfo';
import AttrPopup from '@/components/goods/AttrPopup.vue';
export default {
  components: {
    OrderAddress,
    OrderInfo,
    AttrPopup,
  },
  data() {
    return {
      pageData: '',
      order_id: '',
      checkGoods: '',
    };
  },
  onLoad(params) {
    this.order_id = params.order_id;
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.blind.orderDetail(
        { order_id: this.order_id },
        true
      );
      this.pageData = res.data;
      this.pageData.order_info = Object.assign(
        res.data.order_info,
        res.data.order_info.address
      );
    },
    showAttrPopup(item) {
      console.log(item);
      this.checkGoods = item;
      this.$refs['AttrPopup'].showPopup('');
    },
    async attrConfirm(checkData) {
      console.log(checkData);
      var formData = {
        order_id: this.checkGoods.id,
        goods_id: this.checkGoods.goods_id,
        attr_list: JSON.stringify(checkData.attr_list),
      };
      await this.$requestAll.blind.checkAttr(formData);
      this.loadData();
    },
    async onOrderConfirm(item) {
      await this.$requestAll.blind.orderConfirm({order_id: item.id},true)
      this.loadData()
    }
  },
  computed: {
    payStatus() {
      if (!this.pageData.order_info) return;
      if (this.pageData.order_info.pay_type == 3) {
        return '余额支付';
      } else if (this.pageData.order_info.pay_type == 1) {
        return '微信支付';
      }
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding-top: 20rpx;
  padding-bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
}

.goods-list {
  background: #fff;
  padding: 20rpx;
  margin: 20rpx 24rpx;
  border-radius: 20rpx;
  > view {
    margin-bottom: 20rpx;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
  .goods {
    > image {
      width: 200rpx;
      height: 200rpx;
      margin-right: 20rpx;
    }
    .goods-name {
      line-height: 45rpx;
      font-size: 30rpx;
      height: 90rpx;
    }
    .goods-bts {
      align-items: center;
      .btn {
        margin-left: 20rpx;
        min-width: 120rpx;
        text-align: center;
        line-height: 50rpx;
        border-radius: 25rpx;
        border: 1px solid red;
        color: red;
      }
      .border0 {
        border: 0 solid #000;
      }
    }
  }
}
.kaihe-btn {
  min-width: 120rpx;
  text-align: center;
  line-height: 50rpx;
  border-radius: 25rpx;
  border: 1px solid red;
  color: red;
}
</style>
