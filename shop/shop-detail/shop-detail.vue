<template>
  <view v-if="shopData" class="body">
    <swiper class="swiper" indicator-dots>
      <swiper-item v-for="item in shopData.pic_list" :key="item">
        <image
          :src="item"
          mode="aspectFill"
          style="width: 100%; height: 100%"
        />
      </swiper-item>
    </swiper>

    <view class="shop-info">
      <view class="font-32 m-b-10 color-333">{{ shopData.name }}</view>
      <view class="m-b-10 color-999 flex-y-center">
        <text>评分：</text>
        <u-rate
          :count="5"
          :value="shopData.score"
          :size="14"
          :gutter="1"
          disabled
        ></u-rate>
      </view>
      <view class="m-b-10 color-999"> 营业时间：{{ shopData.shop_time }} </view>
    </view>
    <u-line color="#eee"></u-line>
    <view class="shop-info flex-x-sb flex-y-center mobile">
      <view class="flex-w-1"> 电话：{{ shopData.mobile }} </view>
      <view @click="clickMobile(shopData.mobile)">
        <text class="iconfont icon-dianhua font-50"></text>
      </view>
    </view>
    <u-line color="#eee"></u-line>
    <view class="shop-info flex-x-sb flex-y-center mobile">
      <view class="flex-w-1 u-line-2"> {{ shopData.address }} </view>
      <view @click="clickLocation(shopData)">
        <text class="iconfont icon-daohang font-50"></text>
      </view>
    </view>

    <view class="qita-item m-t-20"> 店铺介绍 </view>
    <u-line color="#eee"></u-line>
    <view class="qita-item" style="line-height:initial;">
      <u-parse :content="shopData.content"></u-parse>
    </view>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  data() {
    return {
      shopData: '',
      shop_id: '',
    };
  },
  onLoad(params) {
    this.shop_id = params.shop_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.default.shopDetail(
        {
          shop_id: this.shop_id,
        },
        true
      );
      this.shopData = res.data.shop;
    },
    clickMobile(value) {
      uni.makePhoneCall({
        phoneNumber: value,
      });
    },
    clickLocation(value) {
      uni.openLocation({
        latitude: value.latitude - 0, //要去的纬度-地址
        longitude: value.longitude - 0, //要去的经度-地址
        name: value.name, //地址名称
        address: value.address, //详细地址名称
        success: function () {
          console.log('导航成功');
        },
        fail: function (error) {
          console.log(error);
        },
      });
    },
  },
  onShow() {},
  computed: {
    shareData() {
      return {
        title: this.shopData && this.shopData.name,
        imageUrl: this.shopData && this.shopData.pic_url,
        path:
          '/shop/shop-detail/shop-detail' +
          uni.$u.queryParams({
            shop_id: this.shop_id,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id:
              this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /deep/ .u-icon__icon {
    color: red !important;
  }
}
.shop-info {
  background: #fff;
  padding: 25rpx 20rpx;
  font-size: 28rpx;
}
.mobile {
  > view:nth-child(1) {
    border-right: 1px solid #eee;
  }
  > view:nth-child(2) {
    padding: 0 20rpx;
  }
}
.qita-item {
  padding: 0 20rpx;
  background: #fff;
  font-size: 28rpx;
  line-height: 100rpx;
}
</style>
