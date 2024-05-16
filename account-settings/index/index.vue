<template>
  <view v-if="pageData" class="body">
    <view class="userInfo-box bg-fff">
      <view
        @click="$utils.toUrl('/account-settings/user/index')"
        class="item info flex-y-center flex-x-sb"
      >
        <view class="flex-y-center flex-w-1">
          <image
            :src="pageData.user_info.avatar_url"
            style="width: 100rpx; height: 100rpx; border-radius: 50%"
            mode="aspectFill"
          />
          <text class="m-l-20">{{ pageData.user_info.nickname }}</text>
        </view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
      <view
        @click="$utils.toUrl('/account-settings/address/address')"
        class="item border-0 flex-x-sb flex-y-center"
      >
        <view> 地址管理 </view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </view>
    <view class="settings-box bg-fff">
      <div
        @click="$utils.toUrl('/account-settings/accounts-security/index')"
        class="item flex-y-center flex-x-sb"
      >
        <view>账户与安全</view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </div>
      <div
        @click="$utils.toUrl('/account-settings/pay-setting/pay-setting')"
        class="item flex-y-center flex-x-sb"
      >
        <view>支付设置</view>
        <view class="flex-y-center color-999">
          <text>支付密码/免密支付等</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </div>
      <div
        @click="$utils.toUrl('/account-settings/feedback-list/index')"
        class="item flex-y-center flex-x-sb"
      >
        <view>功能反馈</view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </div>
      <div @click="clearCache" class="item flex-y-center flex-x-sb">
        <view>清理缓存</view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </div>
      <div
        @click="$utils.toUrl('/account-settings/about-us/index')"
        class="item flex-y-center flex-x-sb"
      >
        <view>关于我们</view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </div>
    </view>
    <div @click="writeOff" class="logout-1">注销账号</div>
    <div @click="logout" class="logout">退出登录</div>

    <u-popup
      :show="showZhuxiao"
      closeable
      @close="showZhuxiao = false"
      :safe-area-inset-bottom="false"
      mode="center"
      round="20px"
    >
      <div class="zhuxiao-popup">
        <view class="font-600-32 p-y-10 font-center"
          >请确认是否满足以下注销条件</view
        >
        <view class="zhuxiao-popup-item p-l-40 font-26 color-666">
          账号处于安全状态，无被盗风险
        </view>
        <view class="zhuxiao-popup-item p-l-40 font-26 color-666">
          账号个人财产已清空，包括您所有的佣金，积分，及余额。
        </view>
        <view class="zhuxiao-popup-item p-l-40 font-26 color-666">
          账号处无任何纠纷，包含投诉举报
        </view>
        <view class="m-t-50 m-b-30 font-26 color-999 font-center">
          十五个工作日内处理注销
        </view>

        <div
          @click="zhuxiaoSubmit"
          class="zhuxiao-popup-bt"
          :class="ss <= 0 && 'zhuxiao-popup-bt-1'"
        >
          确定<text v-if="ss > 0">(倒计时{{ ss }}秒)</text>
        </div>
      </div>
    </u-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      showZhuxiao: false,
      ss: 10,
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.accountSettings.indexIndex({});
      this.pageData = res.data;
    },
    async clearCache() {
      uni.showLoading({
        title: "清除中...",
      });
      await this.$requestAll.default.store({});
      uni.hideLoading();
      this.$utils.toast("清除完成");
    },
    logout() {
      uni.showModal({
        title: "提示",
        content: "是否退出登录？",
        showCancel: true,
        success: async ({ confirm, cancel }) => {
          console.log(confirm);
          if (confirm) {
            this.$store.dispatch("login/logout", {
              success: () => {
                uni.showModal({
                  title: "提示",
                  content: "退出登录成功。",
                  showCancel: true,
                  confirmText: "去登录",
                  cancelText: "去首页",
                  success: ({ confirm, cancel }) => {
                    if (confirm) {
                      this.$store.commit("setCacheData", "");
                      this.$utils.toUrl("/login/login/login_page", "reLaunch");
                    }
                    if (cancel) {
                      this.$utils.toUrl("/pages/index/index", "reLaunch");
                    }
                  },
                });
              },
            });
          }
        },
      });
    },
    writeOff() {
      this.showZhuxiao = true;
    },
    zhuxiaoSubmit() {
      if (this.ss > 0) return;
      uni.showLoading({});
      setTimeout(async () => {
        uni.hideLoading();
        this.showZhuxiao = false;
        this.$store.dispatch("login/logout", {
          success: () => {
            this.$store.commit("setCacheData", "");
            this.$utils.toUrl("/pages/index/index", "reLaunch");
          },
        });
      }, 1000);
    },
  },
  onUpload() {
    clearInterval(this.dTime);
  },
  onHide() {
    clearInterval(this.dTime);
  },
  computed: {},
  watch: {
    showZhuxiao(val) {
      if (val) {
        this.ss = 10;
        if (this.dTime) clearInterval(this.dTime);
        this.dTime = setInterval(() => {
          if (this.ss <= 0) clearInterval(this.dTime);
          this.ss--;
          console.log(this.ss);
        }, 1000);
      }
    },
  },
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  color: #666;
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5*/
  min-height: calc(100vh - 44px);
  /* #endif */
  font-size: 30rpx;
  .userInfo-box {
    border-radius: 0 0 30rpx 30rpx;

    .info {
      line-height: 140rpx;
    }
  }
  .item {
    line-height: 100rpx;
    border-bottom: 2rpx solid #eee;
    padding: 0 30rpx;
  }
  .settings-box {
    border-radius: 30rpx;
    margin-top: 30rpx;
  }
  .border-0 {
    border: 0;
  }

  .logout {
    cursor: pointer;
    margin: auto;
    margin-top: 40rpx;
    background: linear-gradient(90deg, #f22300, #ff4c17);
    width: 620rpx;
    height: 90rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 600;
    color: #ffffff;
  }
  .logout-1 {
    cursor: pointer;
    margin: auto;
    margin-top: 40rpx;
    // background: linear-gradient(90deg, #f22300, #ff4c17);
    color: #f22300;
    border: 1px solid #f22300;
    width: 620rpx;
    height: 90rpx;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 600;
  }
  .zhuxiao-popup {
    width: 700rpx;
    padding: 20rpx 30rpx;
    &-item {
      margin-top: 40rpx;
      position: relative;
      &::after {
        content: "";
        position: absolute;
        left: 16rpx;
        top: 50%;
        transform: translateY(-50%);
        width: 8rpx;
        height: 8rpx;
        background: #6c7df2;
        border-radius: 50%;
      }
    }
    &-bt {
      line-height: 88rpx;
      text-align: center;
      font-size: 30rpx;
      font-weight: 600;
      color: #fff;
      background: #cbcbcb;
      border-radius: 20rpx;
      margin: 40rpx 30rpx 0;
    }
    &-bt-1 {
      background: #f22300;
    }
  }
}
</style>
