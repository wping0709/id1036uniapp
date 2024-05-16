export default {
  /**
   *  @des 小程序版本更新管理器
   */
  getUpdateManager() {
    // #ifdef MP
    const updateManager = uni.getUpdateManager();
    updateManager.onCheckForUpdate((res) => {
      // 检测新版本后的回调
      if (res.hasUpdate) {
        uni.showModal({
          content: "新版本已经准备好，是否重启应用？",
          showCancel: false,
          confirmText: "确定",
          success: (res) => {
            if (res.confirm) {
              updateManager.onUpdateReady(() => {
                // 新版本下载完成的回调
                updateManager.applyUpdate(); // 强制当前小程序应用上新版本并重启
              });

              updateManager.onUpdateFailed(() => {
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
  },

  /**
   *  @des 获取系统信息
   *  @return {Object}
   */
  getSystemInfo() {
    // 获取手机信息
    let sysinfo = uni.getSystemInfoSync(),
      // 状态栏高度
      statusBarHeight = sysinfo.statusBarHeight,
      // 判断是否是ios
      isiOS = sysinfo.system.indexOf("iOS") > -1,
      headHeight;

    // 标题栏高度：安卓：48px，iOS：44px
    if (!isiOS) {
      headHeight = 48;
    } else {
      headHeight = 44;
    }

    return {
      statusBarHeight,
      headHeight,
      headAllHeight: statusBarHeight + headHeight,
      SDKVersion: sysinfo.SDKVersion
    };
  },

  /**
   * @des 设置状态栏高度和标题高度
   */
  setSystemInfo() {
    let { statusBarHeight, headHeight, headAllHeight, SDKVersion } =
      this.getSystemInfo();

    uni.setStorageSync("APP_INFO", {
      STATUS_BAR_HEIGHT: statusBarHeight,
      HEADER_HEIGHT: headHeight,
      HEADER_ALL_HEIGHT: headAllHeight,
      SDK_VRESION: SDKVersion
    });
  }
};
