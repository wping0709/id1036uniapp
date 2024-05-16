<template>
  <u-popup
    mode="center"
    :show="showPopup"
    :safe-area-inset-bottom="false"
    round="20rpx"
  >
    <div style="width: 80vw; padding: 24rpx">
      <div class="font-600-30 font-center p-b-24">用户隐私保护提示</div>
      <div class="color-999">
        感谢您使用本小程序，您使用本小程序前应当阅读并同意
        <div @click="toPrivacy" style="color: blue">《用户隐私保护指引》</div>
        当您点击同意并开始使用产品服务时，即表示您已理解并同息该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法使用部分功能。
      </div>
      <div class="flex-y-center flex-x-center m-t-30">
        <button class="u-reset-button" @click="handleDisagree">不同意</button>
        <button
          @agreeprivacyauthorization="handleAgree"
          open-type="agreePrivacyAuthorization"
          class="m-l-30 u-reset-button"
        >
          同意
        </button>
      </div>
    </div>
  </u-popup>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      showPopup: false,
    };
  },
  computed: {
    show: {
      set(val) {
        if (val) {
          // #ifdef MP-WEIXIN
          wx.getPrivacySetting({
            success: (res) => {
              if (res.needAuthorization) {
                this.showPopup = val;
              }
            },
          });
          // #endif
        } else {
          this.showPopup = false;
        }
      },
      get(val) {
        return this.showPopup;
      },
    },
  },
  methods: {
    switchShow(e) {
      if (this.systemInfo.SDKVersion.replace(/\./g, "") <= 301) {
        if (typeof e == "boolean") return (this.show = e);
        this.show = !this.show;
      }
    },
    handleAgree(e) {
      console.log(e);
      if (e.detail.errMsg == "agreePrivacyAuthorization:ok") {
        this.show = false;
      } else {
        uni.$u.toast("隐私协议授权失败");
      }
    },
    handleDisagree(e) {
      this.show = false;
    },
    // 跳转隐私协议
    toPrivacy() {
      wx.openPrivacyContract({
        fail: (e) => {
          uni.$u.toast("跳转隐私协议失败");
        },
      });
    },
  },
};
</script>

<style></style>
