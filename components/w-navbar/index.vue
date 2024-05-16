<template>
  <view v-if=" show" class="navbar-box">
    <!-- 占位用 -->
    <view
      v-if="isZhanwei"
      :style="{
        paddingTop: systemInfo.statusBarHeight + 'px',
      }"
    ></view>

    <view
      :style="{
        background: bgColor,
        color: color,
        position: fixed ? 'fixed' : 'absolute',
        paddingTop: systemInfo.statusBarHeight + 'px',
      }"
      class="navbar flex-y-center"
    >
      <view class="left flex-y-center flex-x-center">
        <slot name="left">
          <text
            @click="clickLeft"
            v-if="pagesLength > 1"
            class="iconfont icon-arrow-left font-56"
          ></text>
          <text
            @click="clickLeft"
            v-else
            class="iconfont icon-home font-56"
          ></text>
        </slot>
      </view>

      <view class="content flex-w-1 u-line-1 font-center font-32">
        <slot name="center">
          <text>{{ title }}</text>
        </slot>
      </view>

      <view class="right">
        <slot name="right"> </slot>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    // 是否显示
    show: {
      type: [Boolean],
      default: true,
    },
    // 是否粘性定位
    fixed: {
      type: [Boolean],
      default: true,
    },
    // 是否需要占位
    isZhanwei: {
      type: [Boolean],
      default: true,
    },
    // 背景颜色
    bgColor: {
      type: [String],
      default: '#fff',
    },
    color: {
      type: [String],
      default: '#333',
    },

    title: {
      type: [String],
      default: '自定义导航栏',
    },
  },
  data() {
    return {
      pagesLength: 1,
    };
  },
  methods: {
    clickLeft() {
      console.log(123);
      this.$utils.backTo();
    },
  },
  created() {
    let pages = getCurrentPages();
    this.pagesLength = pages.length;
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.navbar-box {
  position: relative;

  > view {
    box-sizing: content-box;
    height: 44px;
  }

  .navbar {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    // top: env(safe-area-inset-top);

    z-index: 9999;
    height: 44px;

    .left {
      font-weight: 500;
      text-align: center;
      min-width: 100rpx;
    }

    .content {
      font-weight: 500;
    }

    .right {
      min-width: 100rpx;
    }
  }
}
</style>
