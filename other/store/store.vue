<template>
  <view v-if="pageData" class="body">
    <view class="p-y-10 bg-fff">
      <u-search
        @search="searchConfirm"
        @custom="$utils.backTo()"
        v-model="keyword"
        placeholder="搜索城市~"
        actionText="取消"
      ></u-search>
    </view>

    <view class="current-store flex-y-center">
      <text>当前：</text>
      <text>{{ currentStore.name || SHOP_CONFIG.store_name }}</text>
    </view>

    <!-- 定位/最近访问 -->
    <view class="menu-item">
      <view class="menu-title">定位/最近访问</view>
      <view class="flex flex-wrap p-x-20">
        <view
          @click="checkStore(SHOP_CONFIG.store)"
          class="location-item flex-y-center flex-x-center"
        >
          <text class="iconfont icon-dingwei price-color"></text>
          <text class="flex-w-1 u-line-1">{{ SHOP_CONFIG.store.name }}</text>
        </view>

        <template v-if="storeHistory">
          <view
            @click="checkStore(item)"
            v-for="(item, i) in storeHistory"
            :key="i"
            class="location-item flex-y-center flex-x-center"
          >
            <text class=""></text>
            <text class="flex-w-1 u-line-1">{{ item.name }}</text>
          </view>
        </template>
      </view>
    </view>

    <!-- 其他城市 -->
    <view class="menu-item">
      <view class="menu-title">其他城市</view>
      <view class="flex flex-wrap p-x-20">
        <view
          @click="checkStore(item)"
          v-for="(item, i) in pageData.list"
          :key="i"
          class="location-item flex-y-center flex-x-center"
        >
          <text class=""></text>
          <text class="flex-w-1 u-line-1">{{ item.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      keyword: "",
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const location = await this.$store.dispatch("GETLOCATION");

      const res = await this.$requestAll.default.storeList({
        keyword: this.keyword,
        longitude: location.longitude,
        latitude: location.latitude,
      });
      this.pageData = res.data;
    },
    searchConfirm() {
      console.log("search");
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
    async checkStore(store) {
      this.$store.commit("setCurrentStore", store);
      
      if (this.$store.getters["user/userInfo"] .id) {
        const res = await this.$requestAll.login.checkCityLogin(
          {
            user_id: this.$store.getters["user/userInfo"].id,
          },
          true
        );
        uni.setStorageSync("token", res.data.access_token);
        this.$store.commit("user/setUserInfo", res.data);
      }
      this.$store.commit('setShop',store)

      if (this.SHOP_CONFIG.store.client_shop_select_module == "city") {
        this.$utils.toUrl("/pages/index/index", "reLaunch");
      } else {
        this.$utils.toUrl("/mch/shop-region/shop-region", "reLaunch");
      }
    },
  },
  computed: {
    currentStore() {
      return this.$store.getters["currentStore"];
    },
    storeHistory() {
      return this.$store.getters["storeHistory"];
    },
    SHOP_CONFIG() {
      return this.$store.getters["SHOP_CONFIG"];
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #fff;
  min-height: 100vh;
}
.current-store {
  height: 80rpx;
  margin: 0 20rpx;
  font-size: 30rpx;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}
.menu-item {
  .menu-title {
    font-size: 30rpx;
    padding: 0 20rpx;
    line-height: 80rpx;
    font-weight: 600;
    font-size: 30rpx;
  }
  .location-item {
    width: 218rpx;
    padding: 0 10rpx;
    // margin: 10rpx 0;
    margin-bottom: 20rpx;
    margin-right: 26rpx;
    line-height: 66rpx;
    border-radius: 33rpx;
    border: 1px solid #ddd;
    text-align: center;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
