<!--  -->
<template>
  <div class="app-download_page">
    <img
      class="back_white"
      :src="wxapp_img.sprea.back_white"
      mode="aspectFill"
    />
    <div
      class="app-portrait"
      :style="'background-image: url(' + store.logo + ');'"
    >
      <!-- <img :src="$store.state.baseData.store.logo" alt="" /> -->
    </div>
    <div class="app-name">{{ store.name }}</div>
    <div class="app-synopsis">精选好货 帮你省钱 开启品质生活</div>
    <div class="app-download" @click="onClickDown">立即下载</div>
    <div class="operator-name">{{ store.store_name }} 电商平台</div>
    <div class="operator-feature">衣食住行一网打尽，电商服务一点无忧。</div>
    <!-- <img
      v-if="getIsWxClient"
      src="@/assets/images/to_down.png"
      style="
        height: 100vh;
        width: 100%;
        z-index: 999;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.3);
      "
      alt=""
      srcset=""
    /> -->
    <!-- <div class="open-app">已下载APP名称立即打开>></div> -->
  </div>
</template>

<script>
// import Api from '@/api';

export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    isIos: function () {
      let u = navigator.userAgent;
      return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    },
    getIsWxClient() {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
      } else {
        return false;
      }
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
  },
  watch: {},
  methods: {
    onClickDown: function () {
      if (this.getPhoneType() == 'android') {
        console.log('安卓');
        window.location.href = this.store.app_down_android;
      } else if (this.getPhoneType() == 'ios') {
        console.log('ios');
        window.location.href = this.store.app_down_ios;
      }
    },
    getPhoneType() {
      var u = navigator.userAgent;
      var isXiaomi = u.indexOf('XiaoMi') > -1; // 小米手机
      var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // 其它安卓
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios
      if (isAndroid || isXiaomi) {
        return 'android';
      } else if (isIOS) {
        return 'ios';
      }
    },
  },
  created() {},
  mounted() {},
  beforeCreate() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
};
</script>
<style lang="scss" scoped>
.app-download_page {
  text-align: center;
}
.back_white {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
}
.app-portrait {
  position: fixed;
  left: 0;
  right: 0;
  top: 88 * 2rpx;
  width: 85 * 2rpx;
  height: 85 * 2rpx;
  border: 2 * 2rpx solid #fff;
  margin: 0 auto;
  border-radius: 17 * 2rpx;
  overflow: hidden;
  background-size: 85 * 2rpx auto;
  background-repeat: no-repeat;
  background-position: center;
}
.app-portrait img {
  width: 100%;
  height: 100%;
}
.app-name {
  position: fixed;
  left: 0;
  right: 0;
  top: 187 * 2rpx;
  font-size: 22 * 2rpx;
  font-weight: bold;
  color: #fff;
}
.app-synopsis {
  position: fixed;
  left: 0;
  right: 0;
  top: 220 * 2rpx;
  color: rgba(255, 255, 255, 0.5);
}
.app-download {
  position: fixed;
  left: 0;
  right: 0;
  top: 315 * 2rpx;
  width: 250 * 2rpx;
  height: 50 * 2rpx;
  line-height: 50 * 2rpx;
  color: #ff1e5a;
  font-size: 18 * 2rpx;
  font-weight: bold;
  background-color: #fff;
  border-radius: 8 * 2rpx;
  margin: 0 auto;
}
.operator-name {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 134 * 2rpx;
  font-weight: bold;
  font-size: 18 * 2rpx;
}
.operator-feature {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 110 * 2rpx;
  font-size: 13 * 2rpx;
  color: #999999;
}
.operator-feature::before {
  content: '';
  width: 25 * 2rpx;
  height: 4 * 2rpx;
  background-color: #ff1f5c;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0;
  bottom: -18 * 2rpx;
  margin: 0 auto;
}
.open-app {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 46 * 2rpx;
  color: #ff1e5a;
  font-size: 14 * 2rpx;
}
</style>
