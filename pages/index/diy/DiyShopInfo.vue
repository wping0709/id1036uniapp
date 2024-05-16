<template>
  <view
    class="shop-info-navigation"
    :style="{
      height: 'calc(44px + ' + systemInfo.statusBarHeight + 'px)',
    }"
  >
    <view
      :style="{
        background: param.bg_color,
        paddingTop: systemInfo.statusBarHeight + 'px',
        height: 'calc(44px + ' + systemInfo.statusBarHeight + 'px)',
        color: param.font_color,
      }"
      class="flex-y-center content-box"
    >
      <view @click="navTo" class="flex-y-center" style="padding: 0 24rpx">
        <!-- 定位图标 -->
        <template v-if="param.is_show_logo == 0">
          <!-- 如果选中门店图片不存在，或者当前为不展示logo图片 -->
          <text
            v-if="!ADDRESS_INFO.pic_url || param.font_icon == 0"
            class="iconfont icon-dingwei"
            style="font-size: 40rpx"
          ></text>

          <view v-else class="shop-img">
            <image :src="ADDRESS_INFO.pic_url" mode="aspectFill" />
          </view>

          <view class="font-600-30 u-line-1" style="max-width: 200rpx">
            {{ selectTypeName(ADDRESS_INFO.name) }}
          </view>

          <view class="iconfont icon-arrow-right"></view>
        </template>
        <template v-else>
          <view
            class="shop-img-1"
            :style="{
              backgroundImage: `url(${param.logo_url})`,
            }"
          >
            <!-- <image :src="param.logo_url" mode="aspectFit" /> -->
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DiyShopInfo',
  props: {
    param: Object,
  },
  data() {
    return {};
  },
  computed: {
    ADDRESS_INFO() {
      return this.$store.getters['ADDRESS_INFO'];
    },
    selectTypeName() {
      return function (name) {
        if (name) return name;

        let store = this.$store.getters['SHOP_CONFIG'].store;
        switch (store.client_shop_select_module) {
          case 'city':
            return '选择城市';

            break;

          default:
            return '选择门店';
            break;
        }
      };
    },
  },
  created() {},
  methods: {
    navTo() {
      if (this.param.is_show_logo == 0) {
        if (
          this.$store.getters['SHOP_CONFIG'].store.client_shop_select_module ==
          'city'
        ) {
          this.$utils.toUrl('/pages/store/store');
        } else {
          this.$utils.toUrl('/mch/shop-region/shop-region');
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.content-box {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
}
.icon-dingwei {
  width: 50rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
}
.shop-img {
  > image {
    margin-right: 10rpx;
    width: 50rpx;
    height: 50rpx;
    border-radius: 50rpx;
  }
}

.shop-img-1 {
  height: 88rpx;
  width: 500rpx;
  background-size: auto 88rpx;
  background-repeat: no-repeat !important;
}
</style>
