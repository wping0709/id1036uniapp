<template>
  <view class="body">
    <!-- 收货地址 -->
    <Address :address="address"></Address>

    <view class="goods flex-x-sb bg-fff m-t-20">
      <view class="left">
        <image :src="pageData.info.auction_pic" mode="aspectFill" />
      </view>
      <view class="right flex-col flex-x-sb flex-w-1">
        <view>{{ pageData.info.name }}</view>

        <view class="font-600-32 price-color">
          ￥{{ pageData.info.pay_price }}
        </view>
      </view>
    </view>

    <div class="bottom">
      <div class="fixed flex-y-center flex-x-sb p-x-30">
        <view class="font-600-36 price-color">
          ￥{{ pageData.info.pay_price }}
        </view>
        <div @click="submit" class="submit">提交订单</div>
      </div>
    </div>
  </view>
</template>
<script>
import Address from '@/pages/order-submit/components/Address';

export default {
  components: {
    Address,
  },
  data() {
    return {
      bidid: '',
      address: '',
      pageData: '',
    };
  },
  onLoad(params) {
    this.bidid = params.id || '';
    this.loadData();
  },
  onShow() {
    let address = uni.getStorageSync('address') || '';
    if (address) {
      this.address = address;
      uni.removeStorageSync('address');
    }
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.auction
        .submitPreview({
          bidid: this.bidid,
        })
        .catch(error => error);
      this.pageData = res.data;
      this.address = res.data.address.length && res.data.address[0];
    },
    async submit() {
      if (!this.address) return uni.$u.toast('请选择收货地址');

      var form = {
        address_id: this.address.id,
        order_id: this.bidid,
      };
      const res = await this.$requestAll.auction.submit(form, true);
      this.$utils.toUrl(
        '/pages/pay/pay' +
          uni.$u.queryParams({
            order_id: res.data.order_id,
            order_type: 11,
          })
      );
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
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

.bottom {
  box-sizing: content-box;

  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);
  .fixed {
    background: #fff;
    box-sizing: content-box;

    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100rpx;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .submit {
    line-height: 80rpx;
    border-radius: 40rpx;
    background: #f71c30;
    text-align: center;
    width: 180rpx;
    font-weight: 700;
    color: #fff;
  }
}
</style>
