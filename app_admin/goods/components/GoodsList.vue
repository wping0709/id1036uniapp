<template>
  <view>
    <view
      @click="showMore = ''"
      class="goods flex-x-sb"
      v-for="(goods, goodsIndex) in goodsList"
      :key="goodsIndex"
    >
      <view style="width: 156rpx; height: 156rpx">
        <image
          :src="goods.cover_pic"
          mode="aspectFill"
          style="width: 100%; height: 100%"
        />
      </view>

      <view class="goods-content">
        <view class="u-line-2">
          {{ goods.name }}
        </view>
        <!-- 规格 -->
        <view class="price font-28"> ￥{{ goods.price }} </view>
        <view class="more-num-box flex-y-center">
          <div class="goods-num">库存：{{ goods.goods_num }}</div>
          <div class="goods-sale_num"></div>
          <div class="more">
            <text
              @click.stop="showMore = goods.id"
              class="iconfont icon-gengduo-x"
            ></text>
            <div
              @click.stop
              v-if="showMore == goods.id"
              class="more-absolute flex-y-center"
            >
              <div
                @click="$emit('clickModify', goods)"
                class="flex-col flex-x-center flex-y-center"
              >
                <text class="iconfont icon-bianji"></text>
                <text class="font-20">编辑</text>
              </div>
              <div
                @click="$emit('switchStatus', goods)"
                class="flex-col flex-x-center flex-y-center"
              >
                <text
                  class="iconfont icon-xiazai"
                  :class="[goods.status == 1 ? '' : 'rotate']"
                ></text>
                <text class="font-20">{{
                  goods.status == 1 ? '下架' : '上架'
                }}</text>
              </div>
              <div
                @click="$emit('clickDelete', goods)"
                class="flex-col flex-x-center flex-y-center"
              >
                <text class="iconfont icon-ashbin1"></text>
                <text class="font-20">删除</text>
              </div>
            </div>
          </div>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    goodsList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      showMore: '',
    };
  },
};
</script>

<style lang="less" scoped>
.goods {
  padding: 20rpx 0;
  border-bottom: 2rpx solid #e5e5e5;
  &:nth-last-child(1) {
    padding-bottom: 0;
    border: 0;
  }
  .goods-content {
    font-size: 28rpx;
    margin-left: 20rpx;
    width: 0;
    flex: 1;
    > view:nth-child(1) {
      line-height: 34rpx;
      height: 68rpx;
    }
    .attr {
      line-height: 28rpx;
      height: 56rpx;
      font-size: 24rpx;
      color: #999;
      margin: 6rpx 0;
    }
    .price {
      margin-top: 10rpx;
      font-size: 24rpx;
      line-height: 34rpx;
      color: #f00;
      font-size: 30rpx;
    }
    .more-num-box {
      font-size: 26rpx;
      > div {
        flex: 1;
        width: 0;
      }
      .more {
        position: relative;
        flex: inherit;
        width: inherit;
        > text {
          width: 50rpx;
          height: 50rpx;
          line-height: 50rpx;
          font-weight: 700;
          text-align: center;
          font-size: 50rpx;
        }
        .more-absolute {
          position: absolute;
          right: 0;
          top: 0;
          transform: translateY(-100%);
          padding: 10rpx 20rpx;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 10rpx;
          color: #fff;
          > div {
            margin-right: 40rpx;
            &:nth-last-child(1) {
              margin-right: 0;
            }
          }
          .iconfont {
            font-size: 50rpx;
            width: 50rpx;
            height: 50rpx;
            line-height: 50rpx;
            margin-bottom: 10rpx;
          }
          .rotate {
            transform: rotate(180deg);
          }

          &::after {
            content: '';
            position: absolute;
            right: 10rpx;
            bottom: 0;
            transform: translateY(100%);

            border: 14rpx solid rgba(0, 0, 0, 0.5);
            border-bottom-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
          }
        }
      }
    }
  }
}
</style>
