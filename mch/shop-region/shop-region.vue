<template>
  <view class="body flex-col">
    <!-- 手机端门店选择模块开启 all城市，门店，shop门店，city城市 -->
    <template v-if="SHOP_CONFIG.store.client_shop_select_module !== 'shop'">
      <view class="head-search flex">
        <view
          @click="$utils.toUrl('/pages/store/store')"
          class="left flex-y-center"
        >
          <text class="u-line-1 flex-w-1">
            {{ currentStore.name || SHOP_CONFIG.store.name }}
          </text>
          <text
            class="iconfont icon-arrow-bottom"
            style="margin-top: 4rpx"
          ></text>
        </view>
        <view class="right flex-w-1 flex-y-center">
          <u-search
            @search="onSearch"
            @clear="onSearch"
            placeholder="请输入门店名搜索"
            v-model="keyword"
            :showAction="false"
          ></u-search>
        </view>
      </view>
      <div class="check-city p-x-20">
        已选城市：{{ currentStore.name || SHOP_CONFIG.store.name }}
      </div>
    </template>
    <scroll-view scroll-y @scrolltolower="getShopList" class="flex-h-1">
      <view class="scroll-content">
        <div class="current-position">
          <div class="title">当前定位</div>
          <div class="position-content flex-x-sb flex-y-center">
            <view class="font-600-28 color-666">
              {{ myAddress }}
            </view>
            <view @click="resetLocation" style="color: #2394ff">
              <text class="iconfont icon-shuaxin m-r-10"></text>
              重新定位
            </view>
          </div>
        </div>

        <div class="list">
          <div class="title">附近有 {{ shopData.count }} 家门店</div>
          <ShopList @onCheck="onCheck" :list="shopData.list"></ShopList>
          <u-loadmore :status="shopData.status"></u-loadmore>
        </div>
      </view>
    </scroll-view>
  </view>
</template>
<script>
import ShopList from "./components/ShopList";
export default {
  components: {
    ShopList,
  },
  data() {
    return {
      shopData: {
        list: [],
        page: 1,
        status: "loadmore",
        count: 0,
      },
      keyword: "",
      myAddress: "",
    };
  },
  onLoad() {
    this.getAddress();
    this.getShopList();
  },
  methods: {
    async getAddress() {
      const location = await this.$store.dispatch("GETLOCATION");
      const res = await this.$requestAll.default.locationContent(
        {
          longitude: location.longitude,
          latitude: location.latitude,
        },
        true
      );
      this.myAddress =
        res.data.province + res.data.city + res.data.district + res.data.street;
    },
    async getShopList() {
      if (this.shopData.status == "nomore") return;
      const location = await this.$store.dispatch("GETLOCATION");
      const res = await this.$requestAll.default.shopList(
        {
          store_id: this.currentStore.id || this.SHOP_CONFIG.store.id,
          longitude: location.longitude,
          latitude: location.latitude,
          page: this.shopData.page,
          keyword: this.keyword,
        },
        true
      );
      this.shopData.list.push(...res.data.list);
      this.shopData.count = res.data.row_count;
      this.shopData.status =
        this.shopData.list.length >= res.data.row_count ? "nomore" : "loadmore";
      this.shopData.page++;
    },
    onSearch() {
      this.shopData = this.$options.data().shopData;
      this.getShopList();
    },
    onCheck(item) {
      console.log(item);
      this.$store.commit("setShop", item);
      this.$utils.backTo();
    },
    async resetLocation() {
      const location = await this.$store.dispatch("GETLOCATION");
      let params = {};
      if (location.latitude > 0) {
        params = {
          latitude: location.latitude,
          longitude: location.longitude,
        };
      }
      uni.chooseLocation({
        ...params,
        success: (res) => {
          this.$store.commit("setLoaction", {
            ...res,
            isSwitch: true,
            current: new Date().getTime(),
          });
          this.getShopList();
          this.getAddress();
        },
      });
    },
  },
  onShow() {},
  computed: {
    ADDRESS_INFO() {
      return this.$store.getters["ADDRESS_INFO"];
    },
    currentStore() {
      return this.$store.getters["currentStore"];
    },
    SHOP_CONFIG() {
      return this.$store.getters["SHOP_CONFIG"];
    },
  },
  watch: {
    currentStore() {
      this.shopData = this.$options.data().shopData;
      this.getAddress();
      this.getShopList();
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */

  .head-search {
    height: 100rpx;
    background: #fff;

    .left {
      padding: 0 20rpx;
      width: 200rpx;
    }

    .right {
      padding-right: 20rpx;
    }
  }
  .check-city {
    line-height: 70rpx;
    font-size: 24rpx;
    background: #fde9e7;
    color: #fa2c19;
  }

  .scroll-content {
    > view,
    > div {
      padding: 0 20rpx;
    }

    .title {
      line-height: 70rpx;
      color: #666;
    }

    .current-position {
      .position-content {
        padding: 0 20rpx;
        background: #fff;
        border-radius: 10rpx;
        height: 100rpx;
      }
    }
  }
}
</style>
