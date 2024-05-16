<template>
  <view v-if="goodsList.length">
    <view class="tuijian-title p-b-20 flex-y-center flex-x-center color-999">
      <view class="line m-r-20"></view>
      <view class="iconfont icon-aixin m-x-10"></view>
      <view class="color-999">为您推荐</view>
      <view class="line m-l-20"></view>
    </view>
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
          <view class="price-num flex-x-sb flex-y-center">
            <view class="flex-w-1 u-line-1">￥{{ item.price }}</view>
            <view v-show="item.num && store.is_sales">已售{{ item.num }}件</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    goodsData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      goodsList: [],
      page: 0,
      status: 'loadmore',
    };
  },

  created() {},
  methods: {
    async getGoodsRecommend() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.goods.getGoodsRecommend(
        {
          goods_id: this.goodsData.id,
          page: this.page,
        },
        true
      );
      this.goodsList.push(...res.data.list);
      this.status = this.page + 1 >= res.data.page_count ? 'nomore' : 'loadmore';
      this.page++;
    },
  },
  watch: {
    goodsData: {
      handler(val) {
        val.id && this.getGoodsRecommend();
      },
      immediate: true,
    },
  },
  computed: {
    store() {
      return this.$store.getters['SHOP_CONFIG'].store
    }
  }
};
</script>

<style lang="scss" scoped>
.tuijian-title {
  .line {
    width: 48rpx;
    height: 2rpx;
    background: #cecece;
  }
}
.goods-box {
  padding: 0 10rpx;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
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
</style>
