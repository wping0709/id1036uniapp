<template>
  <view class="list">
    <view v-for="(item, index) in list" :key="index" class="item">
      <view v-if="status != 1" class="status-title flex-y-center">
        <view v-if="status == 0" class="font-24 color-666"
          >预计结束时间：{{ item.end_time }}</view
        >
        <view v-if="status == 3" class="font-24 color-666"
          >开拍时间：{{ item.start_time }}</view
        >
      </view>
      <view v-else class="status-title flex-y-center flex-x-sb">
        <view class="flex-y-center">
          <image
            :src="item.mch_pic"
            style="width: 50rpx; height: 50rpx"
            mode="aspectFit"
          ></image>
          <view class="m-l-10">{{ item.mch_name }}</view>
        </view>
        <view style="color: red"> 等待支付 </view>
      </view>

      <view class="goods flex-x-sb">
        <view class="left">
          <image :src="item.goods_list.goods_pic" mode="" />
          <view v-if="status == 0" class="left_num flex-y-center">
            <view class="icon-bg m-r-10">
              <text class="iconfont icon-V font-22"></text>
            </view>
            <text>{{ item.bidCount }}人出价</text>
          </view>
        </view>
        <view class="right flex-col flex-x-sb flex-w-1">
          <view>{{ item.goods_list.goods_name }}</view>
          <view v-if="status == 0 || status == 2">
            <view class="price-color font-26">
              <text class="current-price-text m-r-10 p-x-10">当前出价</text>
              ￥{{ item.current_bid }}
            </view>
            <view class="font-26">
              <text class="m-r-10 p-x-10">我的出价</text>
              ￥{{ item.my_bid }}
            </view>
          </view>
          <view v-else-if="status == 3">
            <view class="price-color font-26">
              <text class="current-price-text m-r-10 p-x-10">底价</text>
              ￥{{ item.auction_price }}
            </view>
            <view class="font-26">
              <text class="m-r-10 p-x-10">匠人：</text>
              {{ item.mch_name }}
            </view>
          </view>
          <view v-else class="font-600-32 price-color">
            ￥{{item.pay_price}}
          </view>
        </view>
      </view>

      <div v-if="status != 1" class="flex-y-center bottom-price-bt">
        <div class="flex-grow-0 pay-date flex-y-center color-666 font-24">
          保证金：
          <text class="color-333">
            ￥{{ item.support == '' ? '0' : item.support }}/{{
              item.support_status
            }}
          </text>
        </div>

        <div class="flex-grow-1 flex-x-end">
          <div @click="clickWarn(item)" class="btn" v-if="item.is_warn">
            取消提醒
          </div>
        </div>
      </div>

      <div v-else class="flex-y-center flex-x-end bottom-price-bt">
        共1件作品，实付款：￥{{ item.pay_price }}
      </div>

      <div v-if="status == 1" class="flex-y-center flex-x-end bottom-price-bt">
        <div class="flex-grow-1 flex-x-end">
          <!-- <div @click="cancelOrder(item)" class="btn">取消订单</div> -->
          <div
            @click="$utils.toUrl('/auction/order/order?id=' + item.order_id)"
            class="btn btn1"
          >
            去支付
          </div>
        </div>
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
    status: [Number],
  },
  data() {
    return {};
  },
  methods: {
    async clickWarn(item) {
      const res = await this.$requestAll.auction.warn(
        {
          auction_id: item.auction_id,
          status: Number(!item.is_warn),
        },
        true
      );
      uni.showModal({
        title: res.msg,
        content: '',
        showCancel: false,
        success: () => {
          this.$emit('success');
        },
      });
    },
    // async cancelOrder(item) {
    //   var that = this;
    //   uni.showModal({
    //     title: '提示',
    //     content: '确定取消吗？取消后不可恢复！',
    //     success: async function (res) {
    //       if (res.confirm) {
    //         const { msg } = await this.$requestAll.auction.cancel({
    //           auction_id: item.auction_id,
    //           bidid: item.order_id,
    //         });
    //         uni.$u.toast(msg || '服务器出错');
    //         setTimeout(() => {
    //           this.$emit('success');
    //         }, 1000);
    //       }
    //     },
    //   });
    // },
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
        .left_num {
          position: absolute;
          top: 10rpx;
          left: 10rpx;
          padding: 4rpx;
          color: red;
          background: #ffecec;
          font-size: 22rpx;
          border-radius: 20rpx;
          .icon-bg {
            width: 30rpx;
            height: 30rpx;
            background: red;
            color: #fff;
            border-radius: 50%;
          }
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

        .current-price-text {
          background: #f71c30;
          border-radius: 10rpx;
          color: #fff;
        }
      }
    }

    .bottom-price-bt {
      min-height: $height;
      .pay-date {
        height: $height;
      }
      .btn {
        margin-left: 20rpx;
        padding: 10rpx 20rpx;
        border-radius: 40rpx;
        border: 1px solid #999;
      }
      .btn1 {
        color: #f71c30;
        border-color: #f71c30;
      }
    }
  }
}
</style>
