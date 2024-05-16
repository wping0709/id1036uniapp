/* // 单品轮播组件 */
<template>
  <div>
    <view :style="{ background: param.bg_color }" class="diy-one-swiper">
      <swiper
        :current="currentSwiper"
        @animationfinish="swiperChange"
        autoplay
        :class="param.per == 1 && 'my-swiper'"
      >
        <swiper-item v-for="(goods, index) in param.goods_list" :key="index">
          <view
            class="swiper-item"
            @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)"
          >
            <view :class="['img-box-1-1', param.per == 1 && 'img-box-3-2']">
              <image
                class="goods-img"
                :src="goods.pic_url"
                mode="aspectFill"
              ></image>
            </view>

            <view v-if="param.name" class="goods-name u-line-2">
              {{ goods.name }}
            </view>
            <view class="goods-price-bt">
              <view class="flex-y-center">
                <text v-if="param.price" class="price"
                  >￥{{ goods.price }}</text
                >
                <text v-if="param.old_price" class="olv-price"
                  >￥{{ goods.original_price }}</text
                >
              </view>

              <view
                @click.stop="clickGoods(goods)"
                v-if="param.buy"
                class="goods-bt"
              >
                <view v-if="param.buy_list == 0" class="status-0">
                  <image
                    :src="param.buy_content"
                    style="width: 50rpx; height: 50rpx"
                    alt=""
                  ></image>
                </view>
                <view v-if="param.buy_list == 2" class="status-2">
                  {{
                    param.buy_content ? param.buy_content : param.buy_default
                  }}
                </view>
                <view v-if="param.buy_list == 1" class="status-1">+</view>
                <view v-if="param.buy_list == 3" class="status-3">
                  {{
                    param.buy_content ? param.buy_content : param.buy_default
                  }}
                </view>
                <view
                  v-if="param.buy_list == 4"
                  class="status-3"
                  style="border-radius: 40rpx"
                >
                  {{
                    param.buy_content ? param.buy_content : param.buy_default
                  }}
                </view>
                <view
                  v-if="param.buy_list == 5"
                  class="status-2"
                  style="border-radius: 4rpx"
                >
                  {{
                    param.buy_content ? param.buy_content : param.buy_default
                  }}
                </view>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <template v-if="param.style == 2">
        <view
          style="color: red"
          @click="switchSwiper('left')"
          class="iconfont left-arrow icon-round-arrow-left"
        >
        </view>
        <view
          style="color: red"
          @click="switchSwiper('right')"
          class="iconfont right-arrow icon-round-arrow-right"
        >
        </view>
      </template>
    </view>
    <AttrPopup
      ref="attrPopup"
      :showText="false"
      :goodsId="goods.goods_id"
    ></AttrPopup>
  </div>
</template>

<script>
import AttrPopup from '@/components/goods/AttrPopup';
export default {
  components: {
    AttrPopup,
  },
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      currentSwiper: 0,
      showPopup: false,
      goods: '',
      form: {
        number: 1,
      },
      attr_group_list: '',
    };
  },
  methods: {
    swiperChange({ detail: { current } }) {
      console.log(current);
      this.currentSwiper = current;
    },
    switchSwiper(type) {
      console.log(type, this.data);

      if (type == 'left') {
        this.currentSwiper =
          this.currentSwiper == 0
            ? this.param.goods_list.length - 1
            : this.currentSwiper - 1;
      } else {
        this.currentSwiper =
          this.currentSwiper >= this.param.goods_list.length - 1
            ? 0
            : this.currentSwiper + 1;
      }
    },
    clickGoods(goods) {
      this.goods = goods;
      this.$refs['attrPopup'].showPopup('addCart');
    },
    closePopup() {
      this.setData({
        showPopup: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.u-line-2 {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.diy-one-swiper {
  position: relative;

  .iconfont {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 8vw;
    font-weight: 500;
    font-size: 60rpx;
  }

  .left-arrow {
    left: 1vw;
  }

  .right-arrow {
    right: 1vw;
  }

  swiper {
    width: 100vw;
    height: calc(100vw + 180rpx);
    padding: 3vw;
    .swiper-item {
      .img-box-1-1 {
        .goods-img {
          display: block;
          margin: 0 auto;
          background: skyblue;
          width: 94vw;
          height: 94vw;
        }
      }

      .img-box-3-2 {
        .goods-img {
          width: 80vw;
          height: calc(80 / 3 * 2vw);
          background: red;
        }
      }

      .goods-name {
        height: 80rpx;
        font-weight: 600;
        margin: 12 * 2rpx 0;
      }

      .goods-price-bt {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 4rpx;

        view:nth-child(1) {
          font-size: 11 * 2rpx;
          font-weight: 500;
          color: #aaaaaa;

          .price {
            color: #ff4544;
            font-size: 18 * 2rpx;
          }

          .olv-price {
            margin: 0 5 * 2rpx;
            text-decoration: line-through;
          }
        }

        .goods-bt {
          .status-0 {
            background: initial;
          }

          .status-2 {
            background: #ff4544;
            border-radius: 20 * 2rpx;
            padding: 1vw 3vw;
            color: #fff;
          }

          .status-1 {
            border-radius: 50%;
            width: 6vw;
            line-height: 6vw;
            font-size: 22 * 2rpx;
            text-align: center;
            border: 1 * 2rpx solid #ff4544;
            color: #ff4544;
          }

          .status-3 {
            padding: 1vw 3vw;
            border-radius: 2 * 2rpx;
            border: 1 * 2rpx solid #ff4544;
            color: #ff4544;
          }
        }
      }
    }
  }
  .my-swiper {
    width: 100vw;
    height: calc(94vw + -80rpx);
  }
}
</style>
