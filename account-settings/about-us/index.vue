<template>
  <view class="body">
    <view class="bg-fff p-x-20">
      <view @click="copyToken" class="font-center">
        <view style="padding-top: 60rpx">
          {{ pageData.app_name }}
        </view>
        <view class="font-40" style="padding-top: 60rpx"
          >Version {{ siteinfo.api_data._version }}</view
        >
      </view>
      <view
        class="top-item"
        @click="
          $utils.toUrl('/pages/article-detail/article-detail?id=about_us')
        "
      >
        <view>功能介绍</view>
        <view class="iconfont icon-arrow-right"></view>
      </view>
      <view
        class="top-item"
        @click="$utils.toUrl('/account-settings/feedback-list/index')"
      >
        <view>投诉反馈</view>
        <view class="iconfont icon-arrow-right"></view>
      </view>
    </view>

    <view class="xieyi-box font-center font-24">
      <view
        @click="$utils.toUrl('/account-settings/tcp-template/index?type=1')"
        class="color-blue"
      >
        《软件许可及服务协议》
      </view>
      <view
        @click="$utils.toUrl('/account-settings/tcp-template/index?type=2')"
        class="color-blue"
      >
        《隐私保护指引》
      </view>
      <view>{{ pageData.app_name }}</view>
      <view>{{ pageData.copyright }}</view>
    </view>
  </view>
</template>
<script>
import siteinfo from '@/siteinfo.js';
var time = 0;
export default {
  data() {
    return {
      pageData: '',
      siteinfo: require('@/siteinfo.js'),
      clickNum: 0,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      // const location = await this.$store.dispatch('GETLOCATION');
      // const res = await this.$requestAll.default.shortestStore(
      //   {
      //     longitude: location.longitude,
      //     latitude: location.latitude,
      //   },
      //   true
      // );
      // this.pageData = res.data;
      const res = await this.$requestAll.accountSettings.indexIndex({});
      this.pageData = res.data;
    },
    // 复制token用于调试功能
    copyToken() {
      let cTime = new Date().getTime();
      if (cTime - time < 1000) {
        time = cTime;
        this.clickNum++;
      } else {
        time = cTime;
        this.clickNum = 0;
      }
      console.log(time, this.clickNum);
      // 点击八次 复制token
      if (this.clickNum >= 9) {
        let str = `token: ${uni.getStorageSync('token')},\n
        apiroot: ${siteinfo.apiroot},\n
        store_id: ${siteinfo.api_data.store_id}`;
        var CryptoJS = require('crypto-js');
        var aesKey = siteinfo.api_data._version;
        // aesKey不足16位补\0
        for (let i = 0; i < 16 -siteinfo.api_data._version.length; i++) {
          console.log(i);
          aesKey += '\0';
        }

        //将秘钥转换成Utf8字节数组key
        var key = CryptoJS.enc.Utf8.parse(aesKey);
        //进行加密
        var encrypted = CryptoJS.AES.encrypt(str, key, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        });
        //把机密得到的字符串转换成大写字母
        var jiami = encrypted.ciphertext.toString().toUpperCase();
        // console.log(jiami);

        // 解密方式hex ECB 128 Pkcs7

        // 解密
        // var encryptedHexStr = CryptoJS.enc.Hex.parse(jiami);
        // var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        // var decrypt = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
        //   mode: CryptoJS.mode.ECB,
        //   padding: CryptoJS.pad.Pkcs7,
        // });
        // var jiemi = decrypt.toString(CryptoJS.enc.Utf8);
        // console.log(jiemi);
        this.$utils.copy(jiami, '复制成功');
      }
    },
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
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  .top-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 100rpx;
    border-bottom: 1px solid #eee;
    font-size: 28rpx;
    &:nth-last-child(1) {
      border: 0;
    }
  }
  .xieyi-box {
    margin-top: 80rpx;
    > view {
      line-height: 40rpx;
      color: #999;
    }
    > view:nth-child(3) {
      margin-top: 30rpx;
    }
    .color-blue {
      color: #596d96;
    }
  }
}
</style>
