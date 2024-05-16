<template>
  <view class="goods-box">
    <view v-for="(item, index) in order.goods_list" :key="index">
      <view
        @click="
          type == 'goods' &&
            $utils.toUrl('/pages/goods/goods?id=' + item.goods_id)
        "
        class="flex-x-sb goods-item"
      >
        <image
          :src="item.goods_pic"
          style="width: 144rpx; height: 144rpx; border-radius: 10rpx"
          mode="aspectFill"
        />
        <view class="item-right">
          <view class="goods-title flex-y-center">
            <view class="u-line-1 flex-w-1">{{ item.name }}</view>
            <view class="m-l-30">
              <PriceText
                :price="item.total_price"
                color="#333"
                ySize="32rpx"
                fSize="24rpx"
              ></PriceText>
            </view>
          </view>
          <view class="attr-price flex-x-sb">
            <view class="attr">
              <text v-for="(attr, index) in item.attr" :key="index">
                <text>{{ attr.attr_group_name }}：{{ attr.attr_name }}</text>
                <text v-if="index < item.attr.length - 1">，</text>
              </text>
            </view>
            <view>
              <view class="font-24">x{{ item.num }}</view>
            </view>
          </view>

          <!-- 申请售后按钮 -->
          <view
            v-if="
              item.order_refund_enable == 1 &&
              order.type != 6 &&
              type == 'goods'
            "
            class="flex-y-center flex-x-end"
          >
            <view
              v-if="item.supplier_send == 1"
              @click.stop="
                $utils.toUrl(
                  '/pages/express-detail/express-detail?id' +
                    item.supplier_order_id
                )
              "
              class="goods-bt"
            >
              快递物流
            </view>

            <view
              class="goods-bt"
              v-if="item.is_order_refund == 0"
              @click.stop="
                $utils.toUrl(
                  '/pages/order-refund/order-refund?id=' + item.order_detail_id
                )
              "
            >
              申请售后
            </view>
            <span class="goods-bt-text" v-if="item.is_order_refund == 1">
              已申请售后
            </span>
          </view>
        </view>
      </view>

      <!-- 商品赠品 -->
      <GiveGoods
        v-if="item.give_goods"
        :list="[item.give_goods]"
        title="商品赠送"
      ></GiveGoods>
    </view>
  </view>
</template>

<script>
import GiveGoods from './GiveGoods';
import PriceText from '@/components/price-text/index';
export default {
  components: {
    GiveGoods,
    PriceText,
  },
  props: {
    order: Object,
    type: {
      type: String,
      default: 'goods',
    },
  },
  options: {
    styleIsolation: 'shared',
  },
};
</script>

<style lang="scss" scoped>
.goods-box {
  background: #fff;
  border-radius: 20rpx;
  margin: 20rpx 24rpx;
  padding: 24rpx;
  .goods-item {
    margin-bottom: 24rpx;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
    .item-right {
      flex: 1;
      margin-left: 20rpx;
      .goods-title {
        font-size: 26rpx;
      }
      .attr-price {
        .attr {
          flex: 1;
          line-height: 34rpx;
          font-size: 24rpx;
          > text {
            color: #8c8c8c;
            margin-right: 10rpx;
          }
        }
        > view:nth-child(2) {
          text-align: right;
          color: #666;
          .price {
            color: red;
          }
        }
      }

      .goods-bt {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56rpx;
        border-radius: 10rpx;
        border: 1px solid #999;

        margin-left: 10rpx;
        margin-top: 10rpx;
        padding: 0 20rpx;
      }

      .goods-bt-text {
        margin-top: 10rpx;
        color: red;
        line-height: 56rpx;
      }
    }
  }
  /deep/.goods-list {
    margin: 0;
    padding: 0;
  }
}
</style>
