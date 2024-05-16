<template>
  <view v-if="storeData.custom" class="body">
    <template>
      <view class="head">
        <view class="user-info flex-y-center">
          <image :src="userInfo.avatar_url" mode="" />
          <div class="flex-w-1 flex">
            <view class="user-right flex-w-1">
              <view class="font-30">{{ userInfo.nickname }}</view>
              <view class="font-24 opacity-8">
                等级：{{ storeData.share_cat_name }}
              </view>
              <view class="font-24 opacity-8"
                >{{
                  storeData.custom.words.parent_name.name ||
                  storeData.custom.words.parent_name.default
                }}：{{ userInfo.parent }}</view
              >
              <view class="font-24 opacity-8">邀请码：{{ userInfo.id }}</view>
            </view>

            <div
              @click="showXuzhi = true"
              class="iconfont icon-ziyuan1 m-l-20 font-40"
            ></div>
          </div>
        </view>

        <view class="price flex-x-sb flex-y-center">
          <view>
            <view>{{
              storeData.custom.words.can_be_presented.name ||
              storeData.custom.words.can_be_presented.default
            }}</view>
            <view class="m-t-10">{{ storeData.price.price }}元</view>
          </view>
          <view class="price-bt" @click="$utils.toUrl('/pages/cash/cash')">
            {{
              storeData.custom.words.cash.name ||
              storeData.custom.words.cash.default
            }}
          </view>
        </view>
      </view>

      <view class="menu-1">
        <view class="font-center">
          <view style="color: #23af1a">{{
            storeData.custom.words.already_presented.name ||
            storeData.custom.words.already_presented.default
          }}</view>
          <view class="m-t-10">{{ storeData.price.cash_price }}元</view>
        </view>
        <view class="font-center">
          <view style="color: #ff8f17">{{
            storeData.custom.words.order_money_un.name ||
            storeData.custom.words.order_money_un.default
          }}</view>
          <view class="m-t-10">{{ storeData.order_money_un }}元</view>
        </view>
      </view>

      <view class="menu-2" v-if="storeData.custom && storeData.custom.menus">
        <template v-for="(item, i) in storeData.custom.menus">
          <!-- 分销佣金 -->
          <view
            v-if="i == 'money'"
            :key="i"
            @click="$utils.toUrl('/sales/share-money/share-money')"
            class="flex-col flex-y-center flex-x-center font-center"
          >
            <image :src="item.icon" mode="aspectFit" />
            <view class="m-y-10">{{ item.name }}</view>
            <view>
              <text class="price-color">{{ storeData.price.total_price }}</text>
              元
            </view>
          </view>
          <!-- 分销订单 -->
          <view
            v-if="i == 'order'"
            :key="i"
            @click="$utils.toUrl('/sales/share-order/share-order')"
            class="flex-col flex-y-center flex-x-center font-center"
          >
            <image :src="item.icon" mode="aspectFit" />
            <view class="m-y-10">{{ item.name }}</view>
            <view>
              <text class="price-color">{{ storeData.order_money }}</text>
              元
            </view>
          </view>

          <!-- 提现明细 -->
          <view
            v-if="i == 'cash'"
            :key="i"
            @click="
              $utils.toUrl(
                '/pages/cash-detail/cash-detail?is_shop=0&title=' + item.name
              )
            "
            class="flex-col flex-y-center flex-x-center font-center"
          >
            <image :src="item.icon" mode="aspectFit" />
            <view class="m-y-10">{{ item.name }}</view>
            <view>
              <text class="price-color">{{ storeData.price.total_cash }}</text>
              元
            </view>
          </view>

          <!-- 我的团队 -->
          <view
            v-if="i == 'team'"
            :key="i"
            @click="$utils.toUrl('/sales/share-team/share-team')"
            class="flex-col flex-y-center flex-x-center font-center"
          >
            <image :src="item.icon" mode="aspectFit" />
            <view class="m-y-10">{{ item.name }}</view>
            <view>
              <text class="price-color">{{ storeData.team_count }}</text>
              人
            </view>
          </view>

          <!-- 推广二维码 -->
          <view
            v-if="i == 'qrcode'"
            :key="i"
            @click="$utils.toUrl('/sales/share-qrcode/share-qrcode')"
            class="flex-col flex-y-center flex-x-center font-center"
          >
            <image :src="item.icon" mode="aspectFit" />
            <view class="m-y-10">{{ item.name }}</view>
            <view> </view>
          </view>
        </template>
      </view>
    </template>

    <u-popup
      round="20rpx"
      closeable
      :show="showXuzhi"
      :safe-area-inset-bottom="false"
      @close="showXuzhi = false"
      mode="center"
    >
      <div class="font-center font-600-32 p-y-26">用户须知</div>
      <scroll-view scroll-y class="xuzhi-popup">
        <u-parse :content="share_setting.content"></u-parse>
      </scroll-view>
    </u-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      share_setting: "",
      storeData: "",
      showXuzhi: false,
    };
  },
  onLoad() {
    // if (!this.userInfo.is_distributor) return this.$utils.toUrl('/pages/add-share/index')
    this.loadData();
  },
  methods: {
    async loadData() {
      const res1 = await this.$requestAll.share.getInfo({}, true);
      // 用来获取分销设置
      let share_setting = this.$store.getters["SHOP_CONFIG"].share_setting;
      this.share_setting = share_setting;
      // 用来获取用户分销状态及是否登录
      await this.$store.dispatch("user/getUserInfo");
      let userInfo = this.$store.getters["user/userInfo"];
      if (!userInfo) return uni.$utils.toUrl("/login/login/login_page");
      if (userInfo.is_distributor == 0) {
        switch (share_setting.share_condition) {
          // 表单申请
          case "1":
            this.$utils.toUrl("/pages/add-share/index", "redirectTo");
            break;
          // 无需表单，需后台审核
          case "0":
            uni.showModal({
              title: "申请成为分销商",
              content: "是否申请?",
              success: async (res) => {
                if (res.confirm) {
                  await this.$requestAll.share.join({}, true);
                  this.$utils.toUrl("/pages/add-share/index", "redirectTo");
                }
              },
            });
            break;

          // 无需审核，无需表单
          default:
            uni.showModal({
              title: "申请成为分销商",
              content: "是否申请?",
              success: async (res) => {
                if (res.confirm) {
                  await this.$requestAll.share.join({}, true);
                  this.$utils.toUrl("/sales/share/index", "redirectTo");
                }
              },
            });
            break;
        }
      } else if (userInfo.is_distributor == 2) {
        this.$utils.toUrl("/pages/add-share/index", "redirectTo");
      } else {
        this.storeData = res1.data;
      }
    },
  },
  onShow() {},
  computed: {
    userInfo() {
      return uni.getStorageSync("userInfo");
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

  .head {
    padding: 30rpx 0;
    background: #ff4544;
    color: #efefef;

    .user-info {
      padding: 0 30rpx 30rpx;
      border-bottom: 2rpx solid #f5f5f5;

      > image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
      }
    }

    .user-right {
      margin-left: 30rpx;
    }
  }

  .price {
    padding: 30rpx 30rpx 0;

    .price-bt {
      width: 100rpx;
      line-height: 50rpx;
      text-align: center;
      border: 2rpx solid #f5f5f5;
      border-radius: 6rpx;
    }
  }

  .menu-1 {
    color: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0;
    background: #fff;

    > view {
      flex: 1;

      &:nth-child(1) {
        border-right: 2rpx solid #eee;
      }
    }
  }

  .menu-2 {
    margin-top: 20rpx;
    background: #fff;
    display: flex;
    flex-wrap: wrap;

    > view {
      padding: 30rpx;
      width: 33.33%;
      border-bottom: 2rpx solid #eee;

      > image {
        display: block;
        margin: 0 auto;
        width: 60rpx;
        height: 60rpx;
      }

      &:nth-child(3n + 2) {
        border-left: 2rpx solid #eee;
        border-right: 2rpx solid #eee;
      }
    }
  }

  .xuzhi-popup {
    width: 80vw;
    min-height: 500rpx;
    max-height: 70vh;
    padding: 0 20rpx 20rpx;
  }
}
</style>
