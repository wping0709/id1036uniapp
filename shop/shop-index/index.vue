<template>
  <view class="page-body">
    <WNavbar fixed bgColor="#ff0928" color="#fff" title="推广中心"></WNavbar>
    <div class="head">
      <div class="shop-info flex-x-sb flex-y-center">
        <div class="left flex-y-center">
          <image :src="pageData.user.avatar_url" mode="aspectFill"></image>
          <text class="m-l-20">{{pageData.user.nickname}}</text>
        </div>
        <div @click="$utils.toUrl(`/sales/share-qrcode/share-qrcode?pageType=shop`)" class="right flex-y-center">
          <text class="iconfont icon-QRcode font-36"></text>
          <text key="">二维码</text>
          <text class="iconfont icon-arrow-right font-24"></text>
        </div>
      </div>
      <div class="tongji">
        <div class="item_1 flex-x-sb">
          <div @click="$utils.toUrl('/shop/commission-log/index')" class="left">
            <div class="color-999 font-24">累计佣金(元)</div>
            <div class="font-48 font-w-600">{{pageData.total_price}}</div>
          </div>
          <div class="color-999">
            <div @click="$utils.toUrl('/shop/commission-log/index')" class="flex-y-center">
              <text class="font-24">佣金明细</text>
              <div class="iconfont icon-arrow-right font-24"></div>
            </div>
          </div>
        </div>
        <div class="flex-x-sb m-t-30">
          <div>
            <div class="font-24">可提现佣金(元)</div>
            <div class="m-t-4 font-36 font-w-600">{{pageData.price}}</div>
          </div>
          <div>
            <div class="font-24">已提现佣金(元)</div>
            <div class="m-t-4 font-36 font-w-600">{{pageData.cash_price}}</div>
          </div>
          <div >
            <div class="font-24">未结算佣金(元)</div>
            <div class="m-t-4 font-36 font-w-600">{{pageData.not_settlement}}</div>
          </div>
        </div>

        <div class="flex shop-total m-t-60">
          <div @click="$utils.toUrl('/shop/list/index')" class="flex-y-center flex-w-1 font-24">
            <image
              mode="aspectFill"
              src="../static/images/shop-icon.png"
            ></image>
            <div class="m-x-10">推广店铺</div>
            <div class="fonw-w-600">{{pageData.mch_number}}</div>
          </div>
          <div @click="$utils.toUrl('/shop/order-list/index')" class="flex-y-center flex-w-1 font-24">
            <image
              mode="aspectFill"
              src="../static/images/tongji-icon.png"
            ></image>
            <div class="m-x-10">店铺订单</div>
            <div class="fonw-w-600">{{pageData.order_number}}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="menus">
      <div @click="$utils.toUrl('/other/cash/cash?type=shop')" class="menu flex-col flex-x-center flex-y-center">
        <image mode="aspectFill" src="../static/images/tixian.png"></image>
        <div>账户提现</div>
      </div>
      <div @click="$utils.toUrl('/other/cash-detail/cash-detail?type=shop')" class="menu flex-col flex-x-center flex-y-center">
        <image
          mode="aspectFill"
          src="../static/images/tixianmingxi.png"
        ></image>
        <div>提现明细</div>
      </div>
      <div @click="$utils.toUrl('/shop/list/index')" class="menu flex-col flex-x-center flex-y-center">
        <image
          mode="aspectFill"
          src="../static/images/tuijiandianpu.png"
        ></image>
        <div>推荐店铺</div>
      </div>
      <div @click="$utils.toUrl('/shop/order-list/index')" class="menu flex-col flex-x-center flex-y-center">
        <image
          mode="aspectFill"
          src="../static/images/dianpudingdan.png"
        ></image>
        <div>店铺订单</div>
      </div>
      <div @click="$utils.toUrl('/shop/commission-log/index')" class="menu flex-col flex-x-center flex-y-center">
        <image
          mode="aspectFill"
          src="../static/images/yongjinmingxi.png"
        ></image>
        <div>佣金明细</div>
      </div>
    </div>
  </view>
</template>
<script>
import WNavbar from "@/components/w-navbar";
export default {
  components: {
    WNavbar,
  },
  data() {
    return {
      pageData: "",
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(fn) {
      const res = await this.$requestAll.recommend.index();
      this.pageData = res.data;
      fn && fn()
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {
    this.loadData(() => uni.stopPullDownRefresh())
  },
};
</script>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;

  .head {
    padding: 24rpx;
    height: 382rpx;
    background: #ff0928 url("../static/images/store-index-head.jpeg") 0 302rpx /
      100% auto no-repeat;

    .shop-info {
      color: #fff;
      padding: 0 24rpx;
      margin-bottom: 38rpx;
      .left {
        font-size: 32rpx;
        image {
          width: 74rpx;
          height: 74rpx;
          background: #fff;
          border-radius: 50%;
        }
      }
      .right {
        font-size: 24rpx;
      }
    }
    .tongji {
      border-radius: 20rpx;
      background: #fff;
      padding: 40rpx 40rpx 28rpx;
      box-shadow: 0px 10rpx 24rpx 2rpx rgba(0, 0, 0, 0.05);
      .shop-total {
        image {
          width: 30rpx;
          height: 30rpx;
          border-radius: 50%;
        }
      }
    }
  }

  .menus {
    margin-top: 178rpx;
    display: flex;
    flex-wrap: wrap;
    .menu {
      width: 20%;
      margin-bottom: 20rpx;
      image {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 4rpx;
      }
      font-size: 22rpx;
    }
  }
}
</style>
