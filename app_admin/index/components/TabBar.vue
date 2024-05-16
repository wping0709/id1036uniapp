<template>
  <view class="tab-bar">
    <div class="fixed">
      <view @click="navTo('/app_admin/index/index')">
        <image
          v-if="tabIndex == 0"
          :src="wxapp_img.admin.index_active"
          mode="aspectFill"
        />
        <image v-else :src="wxapp_img &&wxapp_img.admin.index" mode="aspectFill" />
        <view>首页</view>
      </view>
      <view @click="navTo('/app_admin/order/order')">
        <image
          v-if="tabIndex == 1"
          :src="wxapp_img && wxapp_img.admin.order_active"
          mode="aspectFill"
        />
        <image v-else :src="wxapp_img.admin.order" mode="aspectFill" />
        <view>订单</view>
      </view>
      <view @click="navTo('/app_admin/goods/goods')">
        <image
          v-if="tabIndex == 2"
          :src="wxapp_img.admin.goods_active"
          mode="aspectFill"
        />
        <image v-else :src="wxapp_img&&wxapp_img.admin.goods" mode="aspectFill" />
        <view>商品</view>
      </view>
      <view @click="navTo('/app_admin/setting/setting')">
        <image
          v-if="tabIndex == 3"
          :src="wxapp_img.admin.setting_active"
          mode="aspectFill"
        />
        <image
          v-else
          :src="wxapp_img&&wxapp_img.admin.setting"
          mode="aspectFill"
        />
        <view>设置</view>
      </view>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      tabIndex: 0,
    };
  },
  created(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      let cPages = getCurrentPages()//关于获取页面的官方文档https://uniapp.dcloud.io/api/window/window
      console.log(cPages);
      if(cPages[cPages.length-1].route == 'app_admin/index/index') this.tabIndex = 0
      if(cPages[cPages.length-1].route == 'app_admin/order/order') this.tabIndex = 1
      if(cPages[cPages.length-1].route == 'app_admin/goods/goods') this.tabIndex = 2
      if(cPages[cPages.length-1].route == 'app_admin/setting/setting') this.tabIndex = 3
    },
    navTo(url) {
      this.$utils.toUrl(url,'redirectTo')
    }
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.tab-bar {
  height: calc(120rpx + env(safe-area-inset-bottom));
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;
    box-sizing: content-box;
    padding-bottom: env(safe-area-inset-bottom);
    height: 120rpx;
    background: #fff;

    display: flex;
    align-items: center;
    justify-content: space-around;
    text-align: center;
    > view {
      width: 0;
      flex: 1;
      font-size: 24rpx;
      > image {
        width: 50rpx;
        height: 50rpx;
      }
    }
  }
}
</style>
