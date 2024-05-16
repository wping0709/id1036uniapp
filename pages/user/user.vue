<template>
  <div>
    <view v-if="pageData" class="user-box">
      <!-- 用户头部信息 -->
      <DiyHeader :pageData="pageData"></DiyHeader>

      <!-- 钱包信息 -->
      <DiyWallet
        v-if="pageData.wallet.is_wallet == 1 && pageData.user_info.access_token"
        :pageData="pageData"
      >
      </DiyWallet>

      <!-- 我的订单 -->
      <DiyOrder
        v-if="pageData.setting.is_order == 1 && pageData.user_info.access_token"
        :pageData="pageData"
      >
      </DiyOrder>

      <!-- 公告组件 -->
      <DiyNotice
        v-if="pageData.is_notice == 1"
        :param="ftParam(pageData.notices)"
      ></DiyNotice>

      <!-- meun信息 -->
      <template v-if="pageData.wallet.is_menu == 1">
        <template v-for="(meun, index) in pageData.meun_setting">
          <DiyMeun :pageData="meun" :data="pageData" :key="index"></DiyMeun>
        </template>
        <!-- meun信息 -->
        <DiyMeun
          :pageData="{ title: '更多功能', list: pageData.menus }"
          :isLine="pageData.style.menu == 0"
          :data="pageData"
        ></DiyMeun>
      </template>

      <!-- 版权 -->
      <Copyright :copyright="pageData.copyright"></Copyright>

      <TabBar></TabBar>

      <InfoLoginPopup
        :show.sync="showInfoLoginPopup"
        @success="loadData"
      ></InfoLoginPopup>
    </view>
    <u-loading-page
      v-else
      loading
      loading-mode="spinner"
      iconSize="60px"
    ></u-loading-page>

    <!-- 授权引导提示弹框 -->
    <u-popup
      :show="popupData.btText ? true: false"
      mode="center"
      :safe-area-inset-bottom="false"
      round="20rpx"
    >
      <div class="authorization-popup">
        <image
          mode="widthFix"
          :src="wxapp_img.user_authorization_icon"
          style="width: 600rpx"
        ></image>

        <div class="font-600-32 font-center m-b-20">需要您的授权</div>
        <div class="p-x-50 m-x-50 font-center m-b-28">
          {{ popupData.content }}
        </div>

        <div @click="$utils.toUrl(popupData.path)" class="bt">
          {{ popupData.btText }}
        </div>
      </div>
    </u-popup>
  </div>
</template>

<script>
import DiyMeun from "./components/meun.vue";
import DiyHeader from "./components/header.vue";
import DiyWallet from "./components/wallet.vue";
import DiyOrder from "./components/order.vue";
import DiyNotice from "@/pages/index/diy/DiyNotice.vue";
import TabBar from "@/components/TabBar";
import InfoLoginPopup from "./components/InfoLoginPopup.vue";
import Copyright from "./components/copyright.vue";
import indexPop from "@/components/indexPop/indexPop.vue";
import WNavbar from "@/components/w-navbar";
export default {
  components: {
    DiyMeun,
    DiyHeader,
    DiyWallet,
    DiyOrder,
    TabBar,
    DiyNotice,
    InfoLoginPopup,
    Copyright,
    indexPop,
    WNavbar,
  },
  data() {
    return {
      pageData: "",
      showInfoLoginPopup: false,
      popupData: {
        btText: "",
        path: "",
        content: "为了提供更好的服务，请在稍后 的提示框中点击“允许”",
      },
    };
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.user.getList({});

      if (res.data.user_info.nickname) {
        // 实名认证
        if (res.data.is_real_name == 1) {
          this.popupData = {
            btText: "去实名认证",
            path: "/lives/real/index",
            content: "为了提供更好的服务，需要您进行实名认证。",
          };
          return;
        }
        // 手机号认证
        else if (
          this.store.login_forcibly_bind_mobile &&
          !res.data.user_info.binding
        ) {
          this.popupData = {
            btText: "去授权手机号",
            path: "/account-settings/bangding/bangding",
            content: "为了提供更好的服务，需要您进行手机绑定。",
          };
          return;
        }
        this.popupData = this.$options.data().popupData;
      }
        console.log(this.popupData.btText,123);

      this.pageData = res.data;

      let userInfo = res.data.user_info;
      if (userInfo.id) {
        this.$store.commit("user/setUserInfo", userInfo);

        /* #ifdef H5 */
        userInfo.is_show_get_user &&
          this.$utils.is_webpage() &&
          (this.showInfoLoginPopup = true);
        /* #endif */
        /* #ifdef MP-WEIXIN */
        userInfo.is_show_get_user && (this.showInfoLoginPopup = true);
        /* #endif */
      }

      let SHOP_CONFIG = this.$store.getters["SHOP_CONFIG"];
      console.log(SHOP_CONFIG, 111111);
      this.$store.commit(
        "setShopConfig",
        Object.assign(SHOP_CONFIG, { share_setting: res.data.share_setting })
      );
    },
  },
  onLoad() {},
  computed: {
    ftParam() {
      return function (notice) {
        if (notice) {
          return {
            bg_color: notice.notice_bg_color,
            color: notice.notice_color,
            content: notice.notice_content,
            icon: notice.notice_icon,
            name: notice.notice_name,
          };
        }
        return {};
      };
    },
  },
  onShow() {
    this.loadData();
  },
};
</script>

<style lang="scss">
.user-box {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */

  padding-bottom: env(safe-area-inset-bottom);
}

.authorization-popup {
  width: 600rpx;
  padding-bottom: 48rpx;
  .bt {
    margin: 0 auto;
    width: 444rpx;
    height: 76rpx;
    line-height: 76rpx;
    background: #ff1b22;
    border-radius: 120rpx 120rpx 120rpx 120rpx;

    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
  }
}
</style>
