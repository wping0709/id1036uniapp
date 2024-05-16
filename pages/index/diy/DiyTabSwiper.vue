// 选项卡轮播
<template>
  <view class="diy-tab-swiper">
    <view class="tabs-box">
      <scroll-view
        :scroll-left="scrollLeft"
        scroll-x
        scroll-with-animation
        class="tabs"
        id="tabs"
      >
        <view
          @click="switchTab(index)"
          v-for="(tab, index) in param.list"
          id="tab"
          :key="index"
          :class="['tab', tabIndex == index && 'select-tab']"
        >
          <view class="u-line-1">{{ tab.name }}</view>
          <view class="u-line-1">{{ tab.title }}</view>
        </view>
      </scroll-view>
    </view>

    <swiper
      :current="tabIndex"
      autoplay
      ref="swiper"
      @animationfinish="swiperChange"
      :show-indicators="false"
    >
      <swiper-item v-for="(item, index) in param.list" :key="index">
        <view
          bindtap="natTo"
          @click="natTo(goods)"
          v-for="(goods, index1) in item.goods_list"
          :key="index1"
          class="goods-item"
        >
          <image :src="goods.pic_url" mode="aspectFill" />
          <view class="goods-name u-line-1">{{ goods.name }}</view>
          <view class="u-line-1">
            <text class="price">￥{{ goods.price }}</text>
            <text class="orl-price">￥{{ goods.original_price }}</text>
          </view>
          <view class="goods-bt"><view class="status-1">立即购买</view></view>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: ['param'],
  data() {
    return {
      tabIndex: 0,
      scrollLeft: 0,
    };
  },
  methods: {
    switchTab(index) {
      this.tabIndex = index;
    },
    async swiperChange(data) {
      this.tabIndex = data.detail.current;

      let tabsW = (await this.$uGetRect('#tabs')).width;
      let tabW = (await this.$uGetRect('#tab')).width;
      this.scrollLeft = (this.tabIndex + 1) * tabW - tabsW / 2 - tabW / 2;
    },
    natTo(goods) {
      this.$utils.toUrl('/pages/goods/goods?id=' + goods.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.u-line-1 {
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  display: block;
}

.diy-tab-swiper {
  background: #fff;
  .tabs-box {
    padding: 2vw;

    .tabs {
      &::-webkit-scrollbar {
        display: none;
      }

      white-space: nowrap;
      overflow-x: auto;

      .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0 20rpx;
        display: inline-block;
        width: 172rpx;

        text-align: center;
        color: #333;

        > view:nth-child(1) {
          margin-bottom: 5 * 2rpx;
          font-size: 16 * 2rpx;
          font-weight: 600;
        }

        > view:nth-child(2) {
          box-sizing: border-box;
          display: inline-block;
          padding: 0 5 * 2rpx;
          font-size: 12 * 2rpx;
        }
      }

      .select-tab {
        > view:nth-child(2) {
          border-radius: 20 * 2rpx;
          background: red;
          color: #fff;
        }
      }
    }
  }

  swiper {
    height: 440rpx;
    box-sizing: border-box;
    padding: 20rpx;

    .goods-item {
      display: inline-block;
      width: 226rpx;
      margin-right: 15rpx;

      &:nth-last-child(1) {
        margin-right: 0;
      }

      > image {
        object-fit: cover;
        border-radius: 5 * 2rpx;
        width: 226rpx;
        height: 226rpx;
      }

      > view {
        margin-top: 1vw;
      }

      .goods-name {
        font-weight: 600;
      }

      .price {
        font-weight: 600;
        color: #ff4544;
      }

      .orl-price {
        text-decoration: line-through;
        font-size: 12 * 2rpx;
        color: #999;
      }

      .goods-bt {
        .status-1 {
          display: inline-block;
          padding: 0 1.5vw;
          background: #ff4542;
          border-radius: 18 * 2rpx;

          line-height: 20 * 2rpx;
          font-size: 12 * 2rpx;
          color: #fff;
        }
      }
    }
  }
}
</style>
