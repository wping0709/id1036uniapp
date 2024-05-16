<template>
  <div>
    <u-popup
      :show="showAuth"
      :safe-area-inset-bottom="false"
      closeable
      :closeOnClickOverlay="false"
      @close="cancelAuthPopup"
      mode="center"
      round="20rpx"
    >
      <div class="authorization-popup">
        <image
          mode="widthFix"
          :src="wxapp_img.getlocation"
          style="width: 600rpx"
        ></image>

        <div class="font-600-32 font-center m-b-20">是否授权当前位置</div>
        <div class="p-x-50 m-x-50 font-center m-b-28">
          我们需要获取地理位置信息，为您 推荐附近站点，拒绝授权，将
          默认进入系统“默认主站”
        </div>

        <div @click="getLocation" class="bt">授权位置</div>
      </div>
    </u-popup>
    <u-popup
      :show="showCity"
      :safe-area-inset-bottom="false"
      closeable
      :closeOnClickOverlay="false"
      @close="onCancel"
      mode="center"
      round="20rpx"
    >
      <div class="city-popup">
        <div class="font-600-32 p-y-22 font-center">请选择你的城市</div>

        <div class="color-666 flex-y-center m-b-48">
          <template v-if="address">
            <!-- <div class="iconfont icon-dingwei font-40"></div> -->
            <div class="flex-w-1 u-line-1 font-center">
              <!-- {{ address }} -->
              定位显示你在“{{ cityList[1].name }}”
            </div>
          </template>
        </div>

        <div class="list">
          <div
            @click="checkStore(item)"
            class="item"
            v-for="(item, i) in cityList"
            :key="i"
          >
            <div class="left">
              <div
                v-if="item.id == selectStore.id"
                class="iconfont icon-success-fill font-40 price-color"
              ></div>
              <div
                v-else
                class="iconfont icon-xuanzekuangmoren font-40 color-666 font-w-300"
              ></div>
            </div>
            <div class="right">
              <div class="flex-y-center">
                <div v-if="item.id == store.id" class="check">当前</div>
                <div v-else class="check check_1">附近</div>
                <div class="font-w-600 flex-w-1 u-line-1">{{ item.name }}</div>

                <div v-if="i" class="m-l-10 font-24 color-999">
                  {{ (item.juli || 0) + "km" }}
                </div>
              </div>
              <div class="font-24 color-999 m-t-10 u-line-1">
                {{ item.address }}
              </div>
            </div>
          </div>
        </div>

        <div
          class="color-999 font-center p-y-10"
          @click="$utils.toUrl('/other/store/store')"
        >
          查看更多
        </div>

        <div class="flex-x-sb bts m-t-30">
          <div @click="onCancel" class="bt">不切换</div>
          <div @click="onConfirm" class="bt bt_1">切换站点</div>
        </div>
      </div>
    </u-popup>
  </div>
</template>

<script>
//多城市逻辑梳理
// 1.商城开启多城市选择
// 2.如果开启定位权限，直接选择城市，如果不使用推荐城市，则再次获取相同附近城市不再弹框选择
// 3.如果未开启定位权限，判断当前组件是否有关闭不需选择，或者拒绝过定位权限获取，则下次进入不进行展示。
// 4.如果未开启定位，且未拒绝过，弹出引导授权弹框，供客户选择授权
// 5.不进行城市选择：如果当前附近城市没有，如果附近城市列表未发生变化
var cancelAuth = false;
export default {
  props: {},
  data() {
    return {
      showCity: false,
      cityList: [],
      address: "",
      selectStore: "",
      showAuth: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    onShowAuth() {
      uni.getSetting({
        success: (result) => {
          if (result.authSetting["scope.userLocation"]) {
            this.getLocation();
          } else {
            // 是否有关闭授权弹框引导，或者拒绝授权
            if (!cancelAuth) {
              this.showAuth = true;
            } else {
              this.$emit("update:show", false);
            }
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
    async getLocation() {
      const location = await this.$store.dispatch("GETLOCATION");

      if (location.errMsg === "getLocation:ok") {
        // 获取附近城市
        const res = await this.$requestAll.default.getStoreList(location, true);

        // 如果附近没有城市 || 附近城市为当前城市，不展示城市切换选择
        if (!res.data.list.length) return;
        let cancelCheckStore = uni.getStorageSync("cancelCheckStore");

        // 判断取消或者确定的商城列表有无变化，列表无变化不做弹框
        if (cancelCheckStore.id == res.data.list[0].id) return;
        this.cityList = [this.store, ...res.data.list];
        this.address = res.data.address;
        this.selectStore = res.data.list[0];

        this.showAuth = false;
        this.showCity = true;
      } else {
        cancelAuth = true;
      }
    },
    cancelAuthPopup() {
      this.showAuth = false;
      cancelAuth = true;
    },
    checkStore(item) {
      this.selectStore = item;
    },
    async onConfirm() {
      uni.setStorageSync("cancelCheckStore", this.cityList[1]);

      if (this.$store.getters["user/userInfo"].id) {
        const res = await this.$requestAll.login.checkCityLogin(
          {
            user_id: this.$store.getters["user/userInfo"].id,
          },
          true
        );
        uni.setStorageSync("token", res.data.access_token);
        this.$store.commit("user/setUserInfo", res.data);
      }

      this.$store.commit("setCurrentStore", this.selectStore);
      this.$store.commit("setShop", this.selectStore);

      this.showCity = false;
      this.$utils.toUrl("/pages/index/index", "reLaunch");
    },
    onCancel() {
      // 推荐最近的城市取消之后储存，
      // 用来判断下次获取最近城市是否为取消的城市，
      // 不再给予用户弹框选择
      uni.setStorageSync("cancelCheckStore", this.cityList[1]);
      this.showCity = false;
    },
  },
};
</script>

<style lang="scss" scoped>
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

.city-popup {
  width: 600rpx;
  padding: 0 48rpx;
  padding-bottom: 48rpx;
  .list {
    .item {
      display: flex;
      margin-bottom: 24rpx;
      .left {
        height: 44rpx;
        line-height: 44rpx;
        margin-right: 6rpx;
      }
      .right {
        flex: 1;
        width: 0;
        .check {
          padding: 0 8rpx;
          margin-right: 14rpx;
          font-size: 22rpx;
          background: #fdf1f0;
          color: #f0250e;
        }
        .check_1 {
          background: #fbefe5;
          color: #ee893d;
        }
      }
    }
  }
  .bts {
    .bt {
      width: 240rpx;
      height: 76rpx;
      line-height: 76rpx;
      border-radius: 120rpx 120rpx 120rpx 120rpx;
      border: 1px solid #f2f2f2;

      font-size: 30rpx;
      font-weight: 600;
      text-align: center;
    }
    .bt_1 {
      border: 1px solid #f0250e;
      background: #f0250e;
      color: #fff;
    }
  }
}
</style>
