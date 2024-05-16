<template>
  <view v-if="pageData" class="body flex-col">
    <view>
      <u-navbar placeholder leftText="返回" bgColor="#252935">
        <view
          @click="showMenu = true"
          class="u-nav-left"
          slot="left"
          :placeholder="true"
        >
          <text class="iconfont icon-category color-fff font-50"></text>
        </view>
        <view class="u-nav-center color-fff font-32" slot="center">
          任务大厅
        </view>
      </u-navbar>
    </view>
    <view class="tabs flex-x-sa flex-y-center">
      <div
        @click="switchStatus(1)"
        class="tab"
        :class="status == 1 && 'active'"
      >
        新任务
      </div>
      <div
        @click="switchStatus(2)"
        class="tab"
        :class="status == 2 && 'active'"
      >
        待取货
        <text v-if="pageData.count.count_2 > 0" class="num-tip">{{
          pageData.count.count_2
        }}</text>
      </div>
      <div
        @click="switchStatus(3)"
        class="tab"
        :class="status == 3 && 'active'"
      >
        配送中
        <text v-if="pageData.count.count_3 > 0" class="num-tip">{{
          pageData.count.count_3
        }}</text>
      </div>
    </view>

    <view class="flex-h-1 flex-col page-content">
      <scroll-view scroll-y class="list flex-h-1" v-if="pageData.list.length">
        <div
          class="item"
          @click="navTo(item)"
          v-for="(item, i) in pageData.list"
          :key="i"
        >
          <div class="item-title">
            <!-- 订单信息 -->
            <view class="flex-y-center flex">
              <view class="flex-w-1 font-24">
                <text v-if="item.status != 1">还剩</text>
                <text style="color: #fe7800">{{ item.binding_time }}</text>
                分钟内{{ item.status == 1 ? '送达' : '送货' }}
              </view>

              <view v-if="item.status == 1" class="price-color m-l-30">
                ￥{{ item.peisong_price }}
              </view>

              <view  class="font-26 price-color">
                {{item.new_pay_type == 2 ? '货到付款': '线上支付'}}
              </view>

              <view
                v-if="item.order_sort && item.order_sort > 0"
                class="m-l-30"
              >
                编号：#{{ item.order_sort }}
              </view>

              <view
                v-if="status == 2"
                @click.stop="onZhuandan(item)"
                class="zhuandan"
                >转单</view
              >
            </view>

            <!-- 商品信息 -->
            <view
              v-for="(goods, i2) in item.goods_list"
              :key="i2"
              class="flex-y-center flex m-y-20"
            >
              <view class="flex-w-1 u-line-2">
                {{ goods.name }}
              </view>
              <view class="price-color m-x-30"
                >{{ goods.num }}{{ goods.unit }}</view
              >
              <view>￥{{ goods.price }}</view>
            </view>
          </div>

          <!-- 订单配送信息 -->
          <div class="p-y-20 delivery-box flex-y-center">
            <view class="m-r-20"> </view>
            <view
              v-if="item.status == 1"
              class="delivery-juli flex-col flex-x-sb font-center m-r-20 font-24"
            >
              <view>
                <view class="font-600">{{ item.shop_juli }}km</view>
                <view>取货</view>
              </view>
              <view>
                <view class="font-600">{{ item.user_juli }}km</view>
                <view>送货</view>
              </view>
            </view>
            <view class="delivery-address flex-w-1 flex-col flex-x-sb">
              <view>
                <view class="font-600-34">{{ item.mch_info.name }}</view>
                <view class="font-24 m-t-10">{{ item.mch_info.address }}</view>
              </view>

              <view class="m-t-20">
                <div class="font-600-34">{{ item.user_info.name }}</div>
                <div class="font-24 m-t-10">{{ item.user_info.address }}</div>
                <view
                  @click.stop="onMobile(item.user_info.service_tel)"
                  v-if="item.status == 4"
                  class="font-24 flex-y-center"
                >
                  <text class="price-color">{{
                    item.user_info.service_tel
                  }}</text>
                  <text class="m-l-20 iconfont icon-dianhua font-40"></text>
                </view>
              </view>
            </view>
          </div>
          <view class="item-btns m-t-20">
            <div
              v-if="item.status == 1"
              @click.stop="onQiangdan(item)"
              class="bt"
            >
              抢单
            </div>
            <template v-else-if="item.status == 2">
              <div
                @click.stop="onMobile(item.mch_info.service_tel)"
                class="bt"
                style="background: #f5f5f5"
              >
                联系商家
              </div>
              <div @click.stop="onPeisong(item)" class="bt m-l-20">
                上报到店
              </div>
            </template>
            <template v-else>
              <div
                @click.stop="onMobile(item.user_info.service_tel)"
                class="bt"
                style="background: #f5f5f5"
              >
                联系客户
              </div>
              <div
                @click.stop="onSongda(item)"
                style="background: #02b46a; color: #fff"
                class="bt m-l-20"
              >
                确认送达
              </div>
            </template>
          </view>
        </div>
      </scroll-view>
      <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>

      <!-- 弹框 -->
      <div v-if="showMenu" @click="showMenu = false" class="w-popup flex-h-1">
        <!-- 弹框内容 -->
        <view @click.stop class="menus bg-fff show-menus">
          <view class="menu-title">您好</view>
          <view
            @click="$utils.toUrl('/delivery/my_account/my_account')"
            class="menu-item"
            >我的账户</view
          >
          <view
            @click="$utils.toUrl('/delivery/order_history/order_history')"
            class="menu-item"
            >历史订单</view
          >
          <view @click="onXiaxian" class="menu-item">下线休息</view>
        </view>
      </div>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      status: 1,
      showMenu: false,
      location_time: '',
      list_time: '',
    };
  },
  onLoad(params) {},
  onShow() {
    this.getList();
  },
  onHide() {
    clearInterval(this.list_time);
    clearInterval(this.location_time);
  },
  onUnload() {
    clearInterval(this.list_time);
    clearInterval(this.location_time);
  },
  methods: {
    async getList() {
      const locationData = await this.$store.dispatch('GETLOCATION');
      let res = await this.$requestAll.user.getDeliveryList({
        nowlatitude: locationData.latitude,
        nowlongitude: locationData.longitude,
        status: this.status,
      });
      this.pageData = res.data;

      this.list_time && clearInterval(this.list_time);

      this.list_time = setInterval(async () => {
        let res = await this.$requestAll.user.getDeliveryList({
          nowlatitude: locationData.latitude,
          nowlongitude: locationData.longitude,
          status: this.status,
        });
        this.pageData = res.data;
      }, 3000);
    },

    switchStatus(status) {
      this.status = status;
      this.getList();
    },
    // 下线
    onXiaxian() {
      var that = this;

      uni.showModal({
        title: '退出大厅',
        content: '是否退出配送员任务大厅',
        success: function (res) {
          if (res.confirm) {
            clearInterval(that.list_time);
            clearInterval(that.location_time);
            that.$utils.toUrl('/pages/user/user');
          }
        },
      });
    },
    // 抢单
    async onQiangdan(item) {
      const res = await this.$requestAll.user.deliveryGrabOrder({
        id: item.id,
        order_type: item.order_type,
        delivery_type: item.order_type,
        time: parseInt(new Date().getTime() / 1000),
      });
      uni.showModal({
        title: '抢单成功',
        content: '恭喜，快去配送吧~',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            this.switchStatus(2);
          }
        },
      });
    },
    // 拨打电话
    onMobile(mobile) {
      uni.makePhoneCall({
        phoneNumber: mobile,
      });
    },
    // 配送
    async onPeisong(item) {
      const res = await this.$requestAll.order.peisong({
        oid: item.id,
        status: 4,
        delivery_type: item.order_type,
      });
      uni.showModal({
        title: '取货成功',
        content: '恭喜，快去配送吧~',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            console.log('用户点击确定');
            this.getList();
          }
        },
      });
    },
    // 送达
    async onSongda(item) {
      uni.showModal({
        title: '提示',
        content: '是否确认收货？',
        confirmText: '确认到家',
        success: async res => {
          if (res.confirm) {
            const res = await this.$requestAll.order.deliveryOrderConfirm({
              order_id: item.order_id,
              delivery_type: item.order_type,
              type: 1,
            });
            this.getList();
          }
        },
      });
    },
    // 转单
    async onZhuandan(item) {
      uni.showModal({
        title: '提示',
        content: '是否确认转单',
        success: async res => {
          if (res.confirm) {
            await this.$requestAll.user.orderPush({
              id: item.id,
            });
            this.switchStatus(1);
          }
        },
      });
      const res = await this.$requestAll;
    },
    navTo(item) {
      if (this.status == 1) return;

      clearInterval(this.location_time), clearInterval(this.list_time);
      this.$utils.toUrl(
        '/delivery/delivery_info/delivery_info?order_id=' +
          item.order_id +
          '&order_type' +
          item.order_type
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
.u-nav-left {
  color: #fff;
}

.body {
  font-size: 30rpx;
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}

.tabs {
  color: rgba(255, 255, 255, 0.4);
  font-size: 30rpx;
  font-weight: 700;
  // position: sticky;
  // top: 100rpx;
  line-height: 100rpx;
  background: #252935;

  .tab {
    display: flex;
    align-items: center;
  }

  .active {
    position: relative;
    color: #fff;

    &::after {
      content: '';
      position: absolute;
      bottom: 10rpx;
      left: 50%;
      transform: translate(-50%, 0);
      height: 6rpx;
      width: 50rpx;
      background: #fff;
    }
  }

  .num-tip {
    margin-left: 10rpx;
    border-radius: 15rpx;
    line-height: 30rpx;
    min-width: 30rpx;
    background: red;
    text-align: center;
    color: #fff;
    font-size: 22rpx;
  }
}

.page-content {
  position: relative;
  padding-bottom: env(safe-area-inset-bottom);

  .list {
    .item {
      margin: 20rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 10rpx;

      .zhuandan {
        background: red;
        color: #fff;
        padding: 0 20rpx;
        border-radius: 10rpx;
        margin-left: 30rpx;
      }

      .delivery-box {
        > view:nth-child(1) {
          position: relative;
          height: 200rpx;
          border-left: 4rpx dotted #666;

          &::before {
            content: '';
            position: absolute;
            left: -6rpx;
            top: 0%;
            transform: translate(-0%, -200%);
            width: 8rpx;
            height: 8rpx;
            background: #43bea8;
          }

          &::after {
            content: '';
            position: absolute;
            left: -6rpx;
            bottom: 0;
            transform: translate(-0%, 200%);
            width: 8rpx;
            height: 8rpx;
            background: #fa823c;
          }
        }

        .delivery-juli {
          height: 210rpx;
        }

        .delivery-address {
          min-height: 210rpx;
        }
      }

      .item-btns {
        display: flex;

        .bt {
          flex: 1;
          background: #fecb2e;
          color: #000;
          border-radius: 20rpx;
          line-height: 100rpx;
          font-size: 36rpx;
          text-align: center;
          font-weight: 700;
        }
      }
    }
  }

  .w-popup {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);

    .menus {
      display: inline-block;
      height: 100%;
      width: 140rpx;
      animation: widthSwitch 0.2s forwards ease-out;

      > view {
        font-size: 32rpx;
        text-align: center;
        font-weight: 700;
        color: rgba(0, 0, 0, 0.5);
        line-height: 100rpx;
      }

      .menu-title {
        line-height: 140rpx;
      }
    }

    @keyframes widthSwitch {
      0% {
        width: 140rpx;
      }

      100% {
        width: 320rpx;
      }
    }
  }
}
</style>
