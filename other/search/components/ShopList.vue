<template>
  <view class="diy-mch-shop">
    <view
      class="diy-mch-goods"
      @click="$utils.toUrl('/mch/shop/shop?mch_id=' + item.id)"
      v-for="(item, index) of shopList"
      :key="index"
    >
      <view class="flex">
        <view class="img">
          <image :src="item.logo" mode="aspectFill" />
        </view>
        <view class="particulars">
          <view class="name u-line-1" style="white-space: normal">
            {{ item.name }}
          </view>
          <view class="flex meta">
            <view class="meta-left" v-if="item.business_hours">
              营业时间：{{ item.business_hours }}
            </view>
            <view class="meta-right">
              <text>{{ item.delivery_time }}分钟</text>
              <text class="m-l-20">{{ item.juli }}km</text>
            </view>
          </view>
          <view
            class="flex"
            style="margin-top: 20rpx"
            v-if="item.waimai_delivery == '1'"
          >
            <view class="waimai-qisong flex-w-1">
              起送￥{{ item.initial_delivery_amount }}
            </view>
            <view class="waimai-wrap">
              <view>同城配送</view>
            </view>
          </view>
          <view
            class="flex"
            style="margin-top: 20rpx"
            v-if="item.coupon && item.coupon.length > 0"
          >
            <view class="waimai-wrap">
              <view
                style="
                  border: 4rpx solid #ff1f1a;
                  color: #ff1f1a;
                  margin-right: 6rpx;
                "
                v-for="(coupon_item, coupon_index) of item.coupon"
                :key="coupon_index"
              >
                <text v-if="coupon_item.min_price > 0"
                  >每{{ coupon_item.min_price }}优惠{{
                    coupon_item.sub_price
                  }}元</text
                >
                <text v-else>无门槛红包</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="goods-wrap clearfix" v-if="item.goods_list.length > 0">
        <view
          class="goods-item"
          v-for="(goods_item, i) of item.goods_list"
          :key="i"
          @click="$utils.toUrl('/pages/goods/goods?id='+ goods_item.id)"
        >
          <image :src="goods_item.cover_pic" mode="aspectFill" />
          <view class="goods-item-name">{{ goods_item.name }}</view>
          <view class="goods-item-price">
            <text>￥</text>{{ goods_item.price }}
          </view>
          <view v-if="goods_item.original_price" class="goods-item-old-price">
            ￥{{ goods_item.original_price }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    shopList: {
      typs: Array,
      defaul() {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;
.diy-mch-shop {
  .diy-mch-goods {
    background: #fff;
    padding: 20rpx 24rpx;
    border-bottom: 2rpx solid #f5f5f5;
  }
}
.diy-mch-shop .diy-mch-goods:last-child {
  margin-bottom: 0;
}

.diy-mch-shop .diy-mch-goods .img {
  margin-right: 10 * $rpx;
}

.diy-mch-shop .diy-mch-goods .img image {
  width: 61 * $rpx;
  height: 61 * $rpx;
  border-radius: 4 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars {
  flex: 1;
}

.diy-mch-shop .diy-mch-goods .particulars .name {
  font-size: 16 * $rpx;
  font-weight: bold;
}
.diy-mch-shop .diy-mch-goods .particulars .score {
  padding-top: 5 * $rpx;
  justify-content: justify-content-between;
}
.diy-mch-shop .diy-mch-goods .particulars .score .star image {
  width: 9 * $rpx;
  height: 9 * $rpx;
  vertical-align: top;
  padding-top: 2 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .score .scorea {
  font-size: 9 * $rpx;
  color: #ffa24e;
  vertical-align: top;
  padding: 0 5 * $rpx 0 3 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .score .sale {
  font-size: 11 * $rpx;
  color: #666666;
  vertical-align: top;
}
.diy-mch-shop .diy-mch-goods .particulars .score .item {
  font-size: 11 * $rpx;
  color: #666;
}

.diy-mch-shop .diy-mch-goods .particulars .distribution .stipulate {
  font-size: 10 * $rpx;
  color: #666666;
}
.diy-mch-shop .diy-mch-goods .particulars .distribution .stipulate span {
  padding-right: 10 * $rpx;
}
.diy-mch-shop .diy-mch-goods .particulars .distribution .dada {
  font-size: 10 * $rpx;
  color: #0078ee;
  border: 1 * $rpx solid #0078ee;
  padding: 0 5 * $rpx 2 * $rpx;
}
.diy-mch-shop .diy-mch-goods .particulars .coupon view {
  font-size: 10 * $rpx;
  line-height: 16 * $rpx;
  padding: 0 6 * $rpx;
  border: 1 * $rpx solid #ffd89a;
  color: #ffae2a;
  /* margin-right: 10*$rpx; */
  /* position: relative; */
  margin: 5 * $rpx 10 * $rpx 5 * $rpx 0;
}
.diy-mch-shop .diy-mch-goods .particulars .give {
  font-size: 11 * $rpx;
}
.diy-mch-shop .diy-mch-goods .particulars .give text {
  font-size: 10 * $rpx;
  color: #fff;
  line-height: 16 * $rpx;
  padding: 0 4 * $rpx;
  background: linear-gradient(90deg, #ff524e, #ff2c26);
  border-radius: 2 * $rpx;
}
.diy-mch-shop .meta {
  font-size: 11 * $rpx;
  color: #666;
  margin-top: 10 * $rpx;
}
.meta-left {
  display: flex;
  flex: 1;
}
.waimai-qisong {
  font-size: 10 * $rpx;
  color: #666;
}
.waimai-wrap view {
  display: inline-block;
  border: 1 * $rpx solid #7fbbf6;
  color: #0077ee;
  font-size: 10 * $rpx;
  padding: 1 * $rpx 2.5 * $rpx;
  border-radius: 2.5 * $rpx;
}
.goods-wrap {
  margin-top: 10 * $rpx;
  width: 100%;
  display: flex;
  // height: 135 * $rpx;
  overflow-y: hidden;
  overflow-x: scroll;
  /* justify-content: flex-end; */
}
.goods-item {
  width: 160rpx;
  min-width: 160rpx;
  margin-right: 10 * $rpx;
}
.goods-item:last-child {
  margin-right: 0;
}
.goods-item image {
  width: 100%;
  height: 80 * $rpx;
  border-radius: 8 * $rpx;
}
.goods-item-name {
  font-size: 12 * $rpx;
  color: #343434;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 5 * $rpx;
}
.goods-item-price {
  font-size: 14 * $rpx;
  color: #ff1f1a;
}
.goods-item-price text {
  font-size: 11 * $rpx;
}
.goods-item-old-price {
  font-size: 11 * $rpx;
  color: #9a9a9a;
  text-decoration: line-through;
}
</style>
