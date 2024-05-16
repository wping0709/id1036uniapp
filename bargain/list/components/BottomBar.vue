<template>
  <movable-area class="movable">
    <movable-view direction="vertical" class="">
      <view @click="toUrl('/bargain/order-list/order-list')" class="item">
        我的砍价
      </view>
    </movable-view>
  </movable-area>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    cPage() {
      let pages = getCurrentPages();
      return pages[pages.length - 1].route;
    },
  },
  methods: {
    toUrl(url) {
      // if (url == `/${this.cPage}`) {
      //   return;
      // }
      this.$utils.toUrl(url);
    },
  },
};
</script>

<style lang="scss" scoped>
movable-area {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  movable-view {
    pointer-events: auto;
    position: absolute;
    left: 100vw;
    top: 80vh;

    width: 128rpx;
    height: 54rpx;

    .item {
      pointer-events: auto;
      width: 128rpx;
      white-space: nowrap;
      background: #fff;
      border-radius: 40rpx 0 0 40rpx;
      padding: 10rpx 16rpx;

      font-size: 24rpx;
      font-weight: 600;
      color: #ff1b22;
    }
  }
}
// view {
//   box-sizing: content-box;
// }

// .bottom-bar {
//   padding-bottom: env(safe-area-inset-bottom);
//   height: 100rpx;

//   .fixe {
//     background: #fff;
//     position: fixed;
//     bottom: 0;
//     left: 0;
//     right: 0;
//     height: 100rpx;
//     padding-bottom: env(safe-area-inset-bottom);

//     display: flex;

//     > view {
//       flex: 1;
//       line-height: 100rpx;
//       text-align: center;

//       &:nth-child(2) {
//         position: relative;

//         &::after {
//           content: ' ';
//           position: absolute;
//           left: 0;
//           top: 25rpx;
//           height: 50rpx;
//           width: 1px;
//           background: #f2f2f2;
//         }
//       }
//     }

//     .check {
//       color: red;
//       font-weight: 600;
//     }
//   }
// }
</style>
