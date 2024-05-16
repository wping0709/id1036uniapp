<template>
  <view v-if="pageData" class="body">
    <view class="address m-b-20 flex-y-center flex-x-sb p-x-20 bg-fff">
      <view>收货人：{{ pageData.name }}</view>
      <view>{{ pageData.mobile }}</view>
    </view>

    <view
      class="shop p-x-20 p-y-10 m-y-20 bg-fff"
      v-if="pageData.is_offline == 2"
    >
      <view class="flex-y-center flex-x-sb">
        <view>门店名称：{{ pageData.shop.name }}</view>
        <view @click="toLoaction" class="shop-daohang">导航</view>
      </view>
      <view>联系电话：{{ pageData.shop.mobile }}</view>
      <view class="u-line-2">门店地址：{{ pageData.shop.address }}</view>
    </view>

    <view class="shop p-x-20 p-y-10 m-y-20 bg-fff">
      <view class="flex-y-center flex-x-sb">
        <view>订单编号：{{ pageData.order_no }}</view>
        <view class="shop-daohang" @click="$utils.copy(pageData.order_no)"
          >复制</view
        >
      </view>
      <view>下单时间：{{ pageData.addtime }}</view>
    </view>

    <view class="total p-x-20 p-y-10 m-y-20 bg-fff">
      <view class="flex-y-center flex-x-sb">
        <view>商品总额：</view>
        <view>
          {{ pageData.integral }}积分
          <span v-if="pageData.total_price > 0">
            + ¥ {{ pageData.total_price }}</span
          >
        </view>
      </view>
      <view class="flex-y-center flex-x-sb">
        <view>商品数量：</view>
        <view>{{ pageData.detail.num }}</view>
      </view>
      <view class="flex-y-center flex-x-sb">
        <view>运费：</view>
        <view>{{ pageData.express_price }}</view>
      </view>
      <view class="total-text flex-x-end">
        <view>合计：</view>
        <view class="price-color">
          {{ pageData.integral }}积分
          <span v-if="pageData.total_price > 0"
            >+ ¥ {{ pageData.total_price }}</span
          >
        </view>
      </view>
    </view>

    <view class="goods-item p-x-20 p-y-10 m-y-20 bg-fff flex-x-sb">
      <view style="width: 160rpx; height: 160rpx">
        <u-image
          :src="pageData.detail.pic"
          width="160rpx"
          height="160rpx"
          mode="aspectFill"
        ></u-image>
      </view>
      <view class="content flex-col flex-x-sb flex-w-1 m-l-20">
        <view class="u-line-2 goods-name">{{pageData.detail.goods_name}}</view>
        <view>
          <view class="color-999 u-line-1">
            <text
              class="attr-item m-r-10"
              v-for="(attrItem, attrIndex) in pageData.detail.attr"
              :key="attrIndex"
            >
              {{ attrItem.attr_group_name }}：{{ attrItem.attr_name }}
            </text>
          </view>
          <view class="flex-x-sb flex-y-center">
            <view class="color-999">X{{ pageData.detail.num }}</view>

            <view class="price-color flex-w-1 font-right">
              {{ pageData.integral }}积分
              <span v-if="pageData.total_price > 0"
                >+ ¥ {{ pageData.total_price }}</span
              >
            </view>
          </view>
        </view>
      </view>
    </view>

    <div v-if="isSaoma" class="bottom">
      <div class="fixed">
        <div @click="onClerk" class="bt">核销订单</div>
      </div>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      params: {},
      isSaoma:false
    };
  },
  onLoad(params) {
    console.log(params);
    if (params.scene) {
      this.params.id = params.scene;
      this.isSaoma = true
    } else {
      this.params = params;
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.integralmall.clerkOrderDetail(
        this.params,
        true
      );
      this.pageData = res.data;
    },
    toLoaction() {
      uni.openLocation({
        latitude: this.pageData.shop.latitude - 0,
        longitude: this.pageData.shop.longitude - 0,
        complete(res) {
          console.log(res);
        },
      });
    },
    // 核销订单
    onClerk() {
      uni.showModal({
        title: '提示',
        content: '是否确认核销',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: async(result) => {
          if(result.confirm){
            const res = await this.$requestAll.integralmall.integralmallClerk({order_id: this.params.id},true)
            uni.showModal({
              title: '提示',
              content: res.msg,
              showCancel: false,
              success: (result) => {
                if(result.confirm){
                  this.$utils.backTo()
                }
              },
              fail: ()=>{},
              complete: ()=>{}
            });
          }
        },
        fail: ()=>{},
        complete: ()=>{}
      });
    }
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  font-size: 28rpx;
  .address {
    line-height: 100rpx;
  }
  .shop {
    > view {
      line-height: 60rpx;
    }
    .shop-daohang {
      padding: 5rpx 10rpx;
      border-radius: 8rpx;
      border: 2rpx solid #e5e5e5;
      color: #999;
      font-size: 22rpx;
      height: 40rpx;
      line-height: 30rpx;
    }
  }
  .total {
    > view {
      line-height: 60rpx;
    }
    .total-text {
      border-top: 2rpx solid #f5f5f5;
      line-height: 80rpx;
    }
  }
  .goods-item {
    font-size: 26rpx;
    .goods-name {
      font-size: 28rpx;
      line-height: 40rpx;
      height: 80rpx;
    }
  }

  .bottom {
    box-sizing: content-box;
    height: 100rpx;
    padding-bottom: env(safe-area-inset-bottom);
    .fixed {
      position: fixed;
      bottom: 0;
      left: 0;
      padding: 0 30rpx;
      width: 100vw;
      height: calc(100rpx + env(safe-area-inset-bottom));
      background: #fff;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .bt {
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        width: 140rpx;
        font-size: 26rpx;
        border: 1px solid #ff5c5c;
        border-radius: 6rpx;
        color: #ff5c5c;
      }
    }
  }
}
</style>
