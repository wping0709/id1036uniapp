<template>
  <view class="list">
    <view v-for="(item, index) in list" :key="index" class="item">
      <view class="status-title flex-y-center flex-x-sb">
        <view class="font-24 color-666">订单号：{{ item.order_no }}</view>
        <view class="price-color">{{ item.status_name }}</view>
      </view>

      <view
        class="goods flex-x-sb"
        v-for="(good, i) in item.goods_list"
        :key="i"
      >
        <view class="left">
          <image :src="good.goods_pic" mode="" />
        </view>
        <view class="right flex-w-1">
          <view>{{ good.goods_name }}</view>
          <view class="font-24 color-999">
            <text v-for="(attr, i2) in good.attr_list" :key="i2">
              <text>{{ attr.attr_group_name }}：</text>
              <text>{{ attr.attr_name }}</text>
              <text v-if="i2 < good.attr_list.length - 1" class="p-x-10"
                >|</text
              >
            </text>
          </view>
          <view class="flex-y-center flex-x-sb">
            <text class="">￥{{ good.price }}</text>
            <text class="color-999 font-24">￥{{ good.num }}</text>
          </view>
          <view class="flex-x-end font-22">
            共
            <text class="price-color">{{item.goods_list.length}}</text>
            件商品，实付款
            <text class="price-color">{{item.pay_price}}</text>
          </view>
        </view>
      </view>

      <div class="pay-date flex-y-center flex-x-sb color-666 font-24">
        <view class="">
          <text
            v-if="item.pay_type == pay.payment"
            v-for="pay in item.pay_type_list"
            :key="pay.payment"
          >
            {{ pay.name }}
          </text>
        </view>
        <view>{{ item.addtime }}</view>
      </div>
    </view>

  </view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.list {
  $height: 90rpx;
  .item {
    margin-bottom: 20rpx;
    background: #fff;
    > view {
      padding: 0 20rpx;
      border-bottom: 2rpx solid #eee;
      &:nth-last-child(1) {
        border: 0;
      }
    }

    .status-title {
      height: $height;
    }

    .goods {
      padding: 20rpx;
      .left {
        position: relative;
        margin-right: 20rpx;
        image {
          width: 200rpx;
          height: 200rpx;
        }
      }
      .right {
        > view {
          margin-bottom: 30rpx;
          &:nth-last-child(1) {
            margin-bottom: 0;
          }
        }
        > view:nth-child(1) {
          line-height: 40rpx;
          height: 80rpx;
        }
      }
    }

    .pay-date {
      height: $height;
    }

  }
}

</style>
