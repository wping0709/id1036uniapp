<script>
import app from "@/utils/app";

export default {
  methods: {},
  onLaunch: function () {
    uni.hideTabBar();
    this.$store.dispatch("visitLog");

    app.setSystemInfo();
    app.getUpdateManager();
  },
  onLoad() {
    console.log("App onLoad", 123123);
  },
  onShow: async function () {
    console.log("App onShow");

    // #ifdef H5
    let params = this.$utils.urlToJson(window.location.href);
    if (params.store_id) {
      this.$store.commit("setCurrentStore", { id: params.store_id });
    }
    // #endif

    // #ifdef MP-WEIXIN || MP-ALIPAY
    const updateManager = uni.getUpdateManager(); // 小程序版本更新管理器
    updateManager.onCheckForUpdate((res) => {
      // 检测新版本后的回调
      if (res.hasUpdate) {
        // 如果有新版本提醒并进行强制升级
        uni.showModal({
          content: "新版本已经准备好，是否重启应用？",
          showCancel: false,
          confirmText: "确定",
          success: (res) => {
            if (res.confirm) {
              updateManager.onUpdateReady((res) => {
                // 新版本下载完成的回调
                updateManager.applyUpdate(); // 强制当前小程序应用上新版本并重启
              });

              updateManager.onUpdateFailed((res) => {
                // 新版本下载失败的回调
                // 新版本下载失败，提示用户删除后通过冷启动重新打开
                uni.showModal({
                  content: "下载失败，请删除当前小程序后重新打开",
                  showCancel: false,
                  confirmText: "知道了"
                });
              });
            }
          }
        });
      }
    });
    // #endif

    // 获取商城配置
    await this.$store.dispatch("getShopConfig");

    // 获取静态图片
    await this.$store.dispatch("getImage");
  },
  onHide: function () {
    console.log("App Hide");
  }
};
</script>
<style src="@/static/iconfont/iconfont.css"></style>
<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */

@import "@/uview-ui/index.scss";
@import "@/static/css/common.scss";
</style>

<style>
page,
body {
  font-family: PingFang SC, Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #262626;
  line-height: 1.5;
  font-size: 28rpx;
  box-sizing: border-box;
}

view,
swiper,
div {
  box-sizing: border-box;
}

.env-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
