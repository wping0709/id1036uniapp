// #当前组件已做高度占位, 引入页面无需新写高度占位

<template>
  <view v-if="tabBarData" class="tab-bar-box">
    <view
      :style="{
        background:
          (tabBarData.navigation_bar_color &&
            tabBarData.navigation_bar_color.bottomBackgroundColor) ||
          '#ffffff',
      }"
      class="tab-bar-fixed"
    >
      <template v-for="(item, index) in tabBarData.navs">
        <button
          v-if="item.url === 'contact'"
          :key="index"
          :style="tabItemStyle"
          class="button-initial tab-item-father"
          open-type="contact"
        >
          <view class="tab-item">
            <!-- 选中图片 -->
            <image
              :src="currentIndex == index ? item.active_icon : item.icon"
              mode="aspectFill"
            />
            <!-- tabBarText -->
            <view
              :style="{
                color: currentIndex == index ? item.active_color : item.color,
              }"
              class="u-line-1"
              >{{ item.text }}</view
            >
          </view>
        </button>
        <!-- #ifdef H5 -->
        <wx-open-launch-weapp
          v-else-if="item.open_type == 'wxapp' && $utils.is_webpage()"
          :key="index"
          :style="tabItemStyle"
          :username="item.params.gh_id"
          :path="item.params.path"
        >
          <script type="text/wxtag-template">
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 100%;
              ">
              <!-- 选中图片 -->
              <img
                src="{{currentIndex == index ? item.active_icon : item.icon}}"
                style="width:32px;height:32px;"
              />
              <!-- tabBarText -->
              <div style="font-size:10px;color: #888;text-align: center;">{{ item.text }}</div>
            </div>
          </script>
        </wx-open-launch-weapp>
        <!-- #endif -->

        <view
          v-else
          :style="tabItemStyle"
          :key="index"
          @click="navTo(item)"
          class="tab-item-father"
        >
          <view class="tab-item">
            <!-- 选中图片 -->
            <image
              :src="currentIndex == index ? item.active_icon : item.icon"
              mode="aspectFill"
            />
            <!-- tabBarText -->
            <view
              :style="{
                color: currentIndex == index ? item.active_color : item.color,
              }"
              class="u-line-1"
              >{{ item.text }}</view
            >
          </view>

          <div
            v-if="item.url == '/pages/cart/cart' && tabBarData.cart_count > 0"
            class="tip-num"
          >
            {{ tabBarData.cart_count }}
          </div>
        </view>
      </template>
    </view>

    <IndexPop :show.sync="showIndexPop"></IndexPop>
  </view>
</template>

<script>
import wxConfig from '@/utils/wxConfig.js';
import IndexPop from '@/components/indexPop/indexPop';
export default {
  props: {
    type: {
      type: String,
      default: 'homeTabBar',
    },
    params: {
      type: Object,
      defatult() {
        return {};
      },
    },
  },
  components: {
    IndexPop,
  },
  data() {
    return {
      tabBarData: '',
      // 当前页索引
      currentIndex: '',
      showIndexPop: false,
    };
  },
  watch: {
    '$store.getters.tabBarData': {
      handler(data) {
        if (this.type == 'homeTabBar') {
          this.tabBarData = data;
        }
      },
      immediate: true,
    },
  },
  computed: {
    // 计算tabBar宽度
    tabItemStyle() {
      if (!this.tabBarData) return;
      const length = this.tabBarData.navs.length;
      return `width: ${100 / length}%`;
    },
  },
  created() {
    // #ifdef H5
    if (this.$utils.is_webpage()) this.setConfig();
    // #endif

    this.getData();
  },
  mounted() {
  	console.log(111111111111,this.tabBarData)
  },
  methods: {
    async setConfig() {
      wxConfig.init(['onMenuShareTimeline'], ['wx-open-launch-weapp']);
    },
    async getData() {
      // shop使用tabBar数据
      if (this.type == 'shopTabBar') {
        const res = await this.$requestAll.mch.shopNavbar({
          ...this.params,
          tab: this.params.tab || 0,
        });
        this.tabBarData = {
          ...res.data.navbar,
          navigation_bar_color: res.data.navigation_bar_color,
        };
      }

      // 当前商城tabbar数据需要获取
      else {
        await this.$store.dispatch('getTabBarData');
      }
      // 获取当前页判断是否当前页
      const pageS = getCurrentPages();
      const currentUrl = pageS[pageS.length - 1].$page.fullPath;
      // 这里需要考虑如果是两个相同的页面路径 但是参数不同的情况

      this.currentIndex = this.tabBarData.navs.findIndex(item => {
        return item.new_url.indexOf(currentUrl) != -1;
      });
    },
    navTo(item) {
      var url = item.new_url || item.url;
      if (item.new_url == '/publish/publish/publish') {
        // this.$emit('tanqi',true)
        console.log('showIndexPop');
        this.showIndexPop = !this.showIndexPop;
      }
      // 当前TabBar为拨打电话
      else if (item.url == 'tel') {
        uni.makePhoneCall({
          phoneNumber: item.params.tel,
        });
      }
      // 打开小程序 不支持h5 app
      else if (item.open_type === 'wxapp') {
        uni.navigateToMiniProgram({
          appId: item.params.appid,
          path: item.params.path,
          extraData: this.$utils.urlToJson(item.params.path),
          envVersion: 'release',
          success: result => {},
          fail: () => {
            uni.showModal({
              title: '提示',
              content: '打开小程序失败，请查看配置是否正确！',
              showCancel: false,
            });
          },
          complete: () => {},
        });
      }
      // 跳转外部链接
      else if (item.open_type === 'web') {
        this.$utils.toUrl(
          '/other/web/web?url=' + decodeURIComponent(item.params.web)
        );
      } else {
        // 阻止跳转页面和当前页面一致
        if (url == this.tabBarData.navs[this.currentIndex]?.new_url) return;

        // shopTabBar首页 跳转需redirectTo
        if (this.type == 'shopTabBar') {
          const navUrl = url.split('?')[0];
          var shopTabBarPages = [
            '/mch/shop/shop',
            '/mch/shop-goods/index',
            '/mch/shop-new-goods/index',
          ];
          var open_type = '';
          if (shopTabBarPages.some(item => item == navUrl))
            open_type = 'redirectTo';
        }
        console.log(url, open_type, 'tabBar跳转信息');
        this.$utils.toUrl(url, open_type);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-bar-box {
  box-sizing: content-box;
  height: 115rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .tab-bar-fixed {
    box-sizing: content-box;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9999;

    width: 100%;
    height: 115rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    .tab-item-father {
      position: relative;

      .tab-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
        color: #888;
        font-size: 20rpx;
        text-align: center;

        > image {
          width: 64rpx;
          height: 64rpx;
        }
        > img {
          width: 32px;
          height: 32px;
        }
      }

      .tab-active {
        color: red;
      }

      .tip-num {
        position: absolute;
        right: 20%;
        top: 0;
        background: red;
        border-radius: 15rpx;
        min-width: 30rpx;
        line-height: 30rpx;
        height: 30rpx;

        color: #fff;
        font-size: 20rpx;
        text-align: center;
      }
    }
  }
}
</style>
