<template>
  <view class="list">
    <view v-for="(item, index) in list" :key="index" class="item">
      <view class="status-title flex-y-center">
        <view class="font-24 color-666">订单号：{{ item.order_no }}</view>
      </view>

      <view class="goods flex-x-sb">
        <view class="left">
          <image :src="item.cover_pic" mode="" />
        </view>
        <view class="right flex-col flex-x-sb flex-w-1">
          <view>{{ item.name }}</view>

          <view>
            <view class="flex-y-center flex-x-sb">
              <view style="width: 200rpx" class="font-30 font-w-600 color-999">
                <text>价值</text>
                ￥{{ item.pay_price }}
              </view>
              <view class="bts flex-y-center">
                <template v-if="item.is_pay == 0">
                  <div class="bt bt-0" @click="cancel(item)">取消</div>
                  <div
                    class="bt"
                    @click="
                      $utils.toUrl(
                        '/pages/pay/pay?order_type=13&order_id=' + item.id
                      )
                    "
                  >
                    支付
                  </div>
                </template>
                <template v-else>
                  <div
                    class="bt bt-0"
                    @click="
                      $utils.toUrl('/blind/order/order?order_id=' + item.id)
                    "
                  >
                    订单详情
                  </div>
                </template>
              </view>
            </view>
          </view>
        </view>
      </view>
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
    return {};
  },
  methods: {
    async cancel(item) {
      uni.showModal({
        title: '提示',
        content: '您确定取消该订单吗?',
        success: async res => {
          if (res.confirm) {
            this.$requestAll.blind.orderCancel({
              order_id: item.id,
            });
            this.$emit('getList');
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
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
        .bts {
          .bt {
            margin-left: 20rpx;
            border-radius: 30rpx;
            line-height: 50rpx;
            padding: 0 30rpx;
            border: 2rpx solid #f83133;
            color: #fff;
            background: #f83133;
          }
          .bt-0 {
            background: #fff;
            color: #f83133;
            border: 2rpx solid #f83133;
          }
        }
      }
    }

    .pay-date {
      height: $height;
    }
  }
}
</style>
