<template>
  <view v-if="storeData" class="body">
    <view class="hd-content">
      <view class="user-info flex-y-center">
        <image
          :src="userInfo.avatar_url"
          mode=""
          style="width: 80rpx; height: 80rpx; border-radius: 50%"
        />
        <view class="m-l-20 font-30">{{ userInfo.nickname }}</view>
      </view>

      <view class="address-box">
        <view class="flex-y-center font-30">
          <text class="iconfont icon-dingwei m-r-10"></text>
          <view>{{ storeData.shop_info.name }}</view>
        </view>
        <view class="u-line-2 font-24 m-t-10">{{
          storeData.shop_info.address
        }}</view>
      </view>
    </view>

    <view class="total-box bg-fff">
      <view class="flex-col flex-y-center flex-x-center">
        <view class="">可提现金额(元)</view>
        <view class="price-color font-w-600 font-50 m-t-20"
          >￥ {{ storeData.price.price }}</view
        >
      </view>
      <view class="flex-x-sa flex-y-center m-t-30">
        <view class="flex-col flex-y-center flex-x-center">
          <view class="color-999 font-24">今日收入</view>
          <view class="price-color font-w-600 font-34 m-t-20">{{
            storeData.price.terday_price
          }}</view>
        </view>
        <view class="flex-col flex-y-center flex-x-center">
          <view class="color-999 font-24">未结算佣金</view>
          <view class="price-color font-w-600 font-34 m-t-20">{{
            storeData.order_money_un
          }}</view>
        </view>
        <view class="flex-col flex-y-center flex-x-center">
          <view class="color-999 font-24">累计收入</view>
          <view class="price-color font-w-600 font-34 m-t-20">{{
            storeData.price.total_price
          }}</view>
        </view>
      </view>
    </view>

    <view class="menu-box">
      <view class="menu" @click="saoyisao">
        <image :src="wxapp_img.modify_a" mode="aspectFit" />
        <view>扫一扫</view>
      </view>
      <view
        @click="$utils.toUrl('/pages/cash/cash?type=tuanzhang')"
        class="menu"
      >
        <image :src="wxapp_img.modify_b" mode="aspectFit" />
        <view>提现</view>
      </view>
      <view
        @click="$utils.toUrl('/pages/cash-detail/cash-detail?is_shop=1')"
        class="menu"
      >
        <image :src="wxapp_img.modify_c" mode="aspectFit" />
        <view>提现明细</view>
      </view>
      <view
        @click="$utils.toUrl('/offline/share-order-team/share-order?status=0')"
        class="menu"
      >
        <image :src="wxapp_img.modify_d" mode="aspectFit" />
        <view>全部订单</view>
      </view>
      <view
        @click="$utils.toUrl('/offline/share-order-team/share-order?status=1')"
        class="menu"
      >
        <image :src="wxapp_img.modify_e" mode="aspectFit" />
        <view>待发货</view>

        <view class="num-tip">{{ storeData.no_send }}</view>
      </view>
      <view
        @click="$utils.toUrl('/offline/share-order-team/share-order?status=3')"
        class="menu"
      >
        <image :src="wxapp_img.modify_g" mode="aspectFit" />
        <view>待自提</view>
        <view class="num-tip">{{ storeData.no_offline }}</view>
      </view>
      <view
        @click="$utils.toUrl('/offline/share-order-team/share-order?status=4')"
        class="menu"
      >
        <image :src="wxapp_img.modify_h" mode="aspectFit" />
        <view>已完成</view>
      </view>
      <view
        @click="$utils.toUrl('/offline/waimai-order/index?status=0')"
        class="menu"
      >
        <image :src="wxapp_img.modify_h" mode="aspectFit" />
        <view>同城配送单</view>
      </view>
      <view
        @click="
          $utils.toUrl(
            '/offline/verify-card-log/verify-card-log?shop_id=' +
              storeData.shop_id
          )
        "
        class="menu"
      >
        <image :src="wxapp_img.commander.menu_log_icon" mode="aspectFill" />
        <view>核销卡记录</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      userInfo: {},
      storeData: '',
      pageData: '',
    };
  },
  onLoad() {
  },
  methods: {
    async loadData() {
      uni.showLoading({
        title: '加载中',
      });

      this.userInfo = uni.getStorageSync('userInfo');
      // 获取店铺信息
      const res = await this.$requestAll.commander.getInfo({});
      // 判断是否为团长，跳转申请页面
      if (!res.data.shop_id) {
        this.$utils.toUrl('/offline/tz-apply/tz-apply', 'redirectTo');
        return;
      }
      this.storeData = res.data;

      const res1 = await this.$requestAll.share.getInfo({});
      this.pageData = res1.data;
      uni.hideLoading();
    },
    async saoyisao() {
      let res = await this.$utils.scanCode();
      console.log(res, '扫码成功');
      this.$utils.toUrl(res.path);

      // uni.scanCode({
      // 	success: res => {
      // 		console.log(res, '扫码成功');
      // 		this.$utils.toUrl('/' + res.path)
      // 	},
      // });
    },
  },
  onShow() {
    this.loadData();
  },
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}

.hd-content {
  background: #ff4a40;
  color: #fff;
  padding: 24rpx;
  padding-bottom: 0;

  .address-box {
    position: relative;
    background-color: #e53939;
    margin-top: 40rpx;
    padding: 10rpx 20rpx;
    border-radius: 10rpx 10rpx 0rpx 0rpx;

    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      width: 0;
      height: 0;
      border: 20rpx solid transparent;
      border-top: 20rpx solid #e53939;
      transform: translate(-50%, 0);
    }
  }
}

.total-box {
  padding: 60rpx 0 40rpx;

  > view:nth-child(1) {
    margin-bottom: 60rpx;
  }
}

.menu-box {
  margin-top: 40rpx;
  display: flex;
  flex-wrap: wrap;

  > .menu {
    position: relative;
    margin-top: 20rpx;
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 26rpx;

    > image {
      margin-bottom: 10rpx;
      width: 84rpx;
      height: 84rpx;
    }

    .num-tip {
      position: absolute;
      right: 40rpx;
      top: 0;
      transform: translate(50%, -50%);
      background: #fca43c;
      padding: 0 20rpx;
      border-radius: 20rpx 0 20rpx 0;
      font-size: 22rpx;
      color: #fff;
    }
  }
}
</style>
