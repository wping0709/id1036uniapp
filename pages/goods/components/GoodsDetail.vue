<template>
  <view v-if="goodsData.detail">
    <div class="goods-detail">
      <view class="evaluate-title">
        <!-- <view class="line"></view> -->
        <view class="title">详情</view>
      </view>
      <!-- 商品详情 -->
      <div class="content">
        <u-parse
          :content="goodsData.detail"
          :lazyLoad="false"
          :tagStyle="tagStyle"
        ></u-parse>
      </div>
    </div>
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
    type: {
      type: String,
      default: 'goods',
    },
  },
  data() {
    return {
      tagStyle: {
        image: 'vertical-align: middle;max-width:100%;',
        img: 'vertical-align: middle;',
      },
    };
  },

  methods: {},
};
</script>

<style lang="scss" scoped>
.page-item {
  margin: 20rpx;
  border-radius: 20rpx;
  background: #fff;
  overflow: hidden;
}

.goods-detail {
  margin: 20rpx;
  border-radius: 20rpx;
  background: #fff;
  .evaluate-title {
    padding-bottom: 20rpx;
    padding-left: 10rpx;
    padding: 20rpx;
    padding-top: 28rpx;
    display: flex;
    align-items: center;
    .line {
      width: 6rpx;
      height: 4vw;
      background: #f1270d;
      margin-right: 1.067vw;
    }
    .title {
      font-size: 30rpx;
      font-weight: 600;
      color: #262626;
      margin: 0 1.067vw 0 0;
    }
  }

  .content {
    border-radius: 20rpx;
    overflow: hidden;
  }
}
</style>
