<template>
  <div
    @click="$utils.toUrl('/miaosha/details/details?id=' + goods.id)"
    class="item flex-x-sb"
  >
    <image :src="goods.cover_pic" class="goods-img" mode="aspectFill" />
    <view class="right flex-w-1">
      <div class="goods-name u-line-1">{{ goods.name }}</div>
      <div class="progress m-y-10">
        <u-line-progress
          height="28rpx"
          :percentage="percentage"
          :activeColor="percentage >= 100 ? '#b7b4b8' : '#ff1927'"
          inactiveColor="#ffe4e4"
        >
          <view v-if="percentage >= 100" class="font-20 p-r-20">
            {{ goods.miaosha_num }}件抢光了
          </view>

          <view v-else class="flex-y-center">
            <text v-if="percentage >= 40" class="m-r-20 font-20"
              >{{ percentage }}%</text
            >
            <image
              :src="wxapp_img.miaosha.jindu_icon"
              mode="aspectFill"
              style="width: 40rpx; height: 40rpx"
            />
          </view>
        </u-line-progress>
      </div>

      <div class="num flex-y-center flex-x-sb m-y-10">
        <!-- <text class="color-999">已抢购{{ goods.sell_num }}</text> -->
        <text class="price-color"> 仅剩{{ surplus }} </text>
      </div>

      <div class="price-box flex-x-sb flex-y-center">
        <div class="price-left flex-w-1">
          <!-- <view class="price-color font-600-30"
            >￥{{ goods.miaosha_price }}</view
          > -->
          <PriceText
            :price="goods.miaosha_price"
            ySize="44rpx"
            fSize="28rpx"
          ></PriceText>
          <text class="font-del m-l-10 color-999 font-24">
            ￥{{ goods.price }}
          </text>
        </div>
        <div v-if="surplus" class="bt-right">立即抢</div>
        <div v-else class="bt-right bt-right_1">已抢光</div>
      </div>
    </view>
  </div>
</template>

<script>
import PriceText from '@/components/price-text';
export default {
  props: {
    goods: {
      type: [String, Object],
    },
  },
  components: {
    PriceText,
  },
  computed: {
    surplus() {
      if (this.goods) {
        return this.goods.miaosha_num - this.goods.sell_num;
      }
      return 0;
    },
    percentage() {
      if (this.goods) {
        if (this.goods.miaosha_num == 0) return 100;
        let percentage = (this.goods.sell_num / this.goods.miaosha_num) * 100;
        return percentage.toFixed(2);
      }
      return 0;
    },
  },
  options: {
    styleIsolation: 'shared',
  },
};
</script>

<style lang="scss" scoped>
/deep/.u-line-progress {
  overflow: initial;
}
.item {
  border-radius: 24rpx;
  .goods-img {
    margin-right: 20rpx;
    width: 192rpx;
    height: 192rpx;
    border-radius: 10rpx;
  }
  .goods-name {
    margin-bottom: 12rpx;
    line-height: 42rpx;
    font-size: 30rpx;
    font-weight: 600;
    color: rgba(51, 51, 51, 0.94);
  }
  .progress {
    width: 320rpx;
    margin-bottom: 16rpx;
  }

  .num {
    margin-bottom: 10rpx;
    .price-color {
      color: #ff1b22;
    }
  }
  .bt-right {
    width: 128rpx;
    line-height: 60rpx;
    text-align: center;
    background: linear-gradient(90deg, #ff1b22 0%, #ff7333 100%);
    border-radius: 32rpx;
    font-style: 28rpx;
    font-weight: 600;
    color: #fff;
  }

  .bt-right_1 {
    opacity: 0.4;
  }
}
</style>
