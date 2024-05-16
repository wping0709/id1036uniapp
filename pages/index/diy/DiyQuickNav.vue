<template>
  <view class="quick-nav" style="pointer-events:none;">
    <movable-area style="pointer-events:none;">
      <movable-view
      style="pointer-events: auto;"
        direction="all"
        inertia
        :out-of-bounds="false"
        x="0"
        y="1000rpx"
        damping="30"
        friction="30"
      >
        <view
          @click="isShowMenus = !isShowMenus"
          class="nav-content flex-y-center"
        >
          <div
            :class="[
              'iconfont',
              isShowMenus ? 'icon-arrow-left' : 'icon-arrow-right',
            ]"
          ></div>
          <div class="text">
            <view>快捷</view>
            <view>导航</view>
          </div>
        </view>

        <div :class="isShowMenus && 'switch-width'" class="menus">
          <view
            @click="navTo(item)"
            class="tab-item"
            :style="tabItemStyle"
            v-for="(item, index) in tabBarData.navs"
            :key="index"
          >
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
        </div>
      </movable-view>
    </movable-area>
    <IndexPop :show.sync="showIndexPop"></IndexPop>
  </view>
</template>

<script>
import IndexPop from '@/components/indexPop/indexPop'
export default {
  components: {
    IndexPop
  },
  data() {
    return {
      isShowMenus: false,
      tabBarData: '',
      // 当前页索引
      currentIndex: '',
      showIndexPop:false
    };
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
    this.getData();
  },
  methods: {
    async getData() {
      // shop使用tabBar数据
      if (this.type == 'shopTabBar') {
        const res = await this.$requestAll.mch.shopNavbar(this.params);
        this.tabBarData = res.data.navbar;
      }
      // 当前商城tabbar数据需要获取
      else {
        const res = await this.$requestAll.config.getTabBar();
        this.tabBarData = res.data;
      }
      // 获取当前页判断是否当前页
      const pageS = getCurrentPages();
      const currentUrl = pageS[pageS.length - 1].$page.fullPath;
      this.currentIndex = this.tabBarData.navs.findIndex(item => {
        if (this.type == 'shopTabBar') {
          let new_url =
            currentUrl +
            uni.$u.queryParams(this.params) +
            '&mch_id=' +
            this.params.mch_id;

          return item.new_url == new_url;
        } else {
          return item.new_url == currentUrl;
        }
      });
    },
    navTo(item) {
      var url = item.new_url || item.url;
		if(item.new_url == "/publish/publish/publish"){
			// this.$emit('tanqi',true)
      this.showIndexPop = !this.showIndexPop
		}else
      // 当前TabBar为拨打电话
      if (item.url == 'tel') {
        uni.makePhoneCall({
          phoneNumber: item.params.tel,
        });
        return;
      }

      // 阻止跳转页面和当前页面一致
      if (url == this.tabBarData.navs[this.currentIndex]?.new_url) return;

      // shopTabBar首页 跳转需redirectTo
      if (this.type == 'shopTabBar') {
        const navUrl = url.split('?')[0];
        var open_type = '';
        if (navUrl == '/mch/shop/shop') open_type = 'redirectTo';
      }
      this.$utils.toUrl(url, open_type);
    },
  },
};
</script>

<style lang="scss" scoped>
.quick-nav {
  position: fixed;
  top: 40vh;
  right: 0;
  z-index: 999;
  width: 110rpx;
  height: 45vh;
  font-size: 24rpx;
  color: #fff;
  movable-area {
    width: 100%;
    height: 100%;
  }
  movable-view {
    width: 100%;
    height: 78rpx;
  }
  .nav-content {
    height: 100%;
    padding-left: 8rpx;
    padding-right: 0rpx;
    border-radius: 36rpx 0 0 36rpx;
    background: red;

    position: relative;
    z-index: 999;
  }
  .menus {
    position: absolute;
    top: 0;
    left: 40rpx;
    z-index: 998;
    height: 100%;

    transform: translateX(0%);
    width: 60vw;
    padding-left: 10rpx;
    padding-right: 40rpx;
    background: #fff;
    border-radius: 36rpx 0 0 36rpx;

    display: flex;
    align-items: center;
    .tab-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #888;
      font-size: 20rpx;
      text-align: center;

      > image {
        width: 40rpx;
        height: 40rpx;
      }
    }
    .tab-active {
      color: red;
    }
  }
  .switch-width {
    transition: all 0.3s;
    transform: translateX(-100%);
  }
}
</style>
