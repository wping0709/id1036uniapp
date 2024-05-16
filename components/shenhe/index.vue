<template>
  <div class="shenhe-body">
    <view class="goods-box">
      <view
        @click="$utils.toUrl('/pages/goods/goods?id=' + item.id)"
        class="goods-item"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <image :src="item.pic_url" mode="aspectFill" />
        <view class="goods-info">
          <view class="goods-title u-line-2">{{ item.name }}</view>
          <view class="price-num flex-x-sb flex-y-center u-line-1">
            <view>￥{{ item.price }}</view>
            <view v-show="item.num && store.is_sales"
              >已售{{ item.num }}件</view
            >
          </view>
        </view>
      </view>
    </view>

    <view class="env-bottom">
      <u-loadmore status="nomore"></u-loadmore>
    </view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
    };
  },
  created() {
    if (this.store.is_shenhe) {
      this.getGoodsList();
      uni.setNavigationBarTitle({ title: '商品列表' });
    }
  },
  methods: {
    async getGoodsList() {
      const res = await this.$requestAll.default.goodsList({ page: 1 }, true);
      this.goodsList = res.data.list;
    },
  },
};
</script>

<style lang="scss">
.shenhe-body {
  min-height: 100vh;
  .goods-box {
    padding: 0 10rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    .goods-item {
      width: 358rpx;
      background: #fff;
      margin-bottom: 12rpx;
      border-radius: 20rpx;
      overflow: hidden;
      &:nth-child(2n) {
        margin-right: 0;
      }
      > image {
        display: block;
        width: 100%;
        height: 370rpx;
        background: #f5f5f5;
      }
      .goods-info {
        padding: 0 15rpx;
        .goods-title {
          margin: 8rpx 0;
          font-size: 28rpx;
        }
        .price-num {
          padding: 8rpx 0;
          font-size: 22rpx;
          > view:nth-child(1) {
            color: #ff334b;
          }
        }
      }
    }
  }
}
</style>
