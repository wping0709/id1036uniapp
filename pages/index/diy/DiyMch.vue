<template>
  <view class="diy-mch" v-if="item.param.list.length > 0">
    <template v-if="item.param.is_goods == 0">
      <view class="diy-mch-main">
        <view class="flex-x-sb p-20">
          <view class="font-30">推荐好店</view>
          <view
            class="flex-y-center font-24 color-999"
            @click="$utils.toUrl('/mch/shop-list/shop-list')"
          >
            <text>更多</text>
            <text class="iconfont icon-arrow-right font-30"></text>
          </view>
        </view>
        <view class="mch">
          <view class="flex" style="overflow-x: auto">
            <view
              v-for="(value, index) of item.param.list"
              :key="index"
              class="diy-mch-item"
              @click="$utils.toUrl('/mch/shop/shop?mch_id=' + value.mch_id)"
            >
              <view
                :to="{ name: 'MchShop', query: { mch_id: value.id } }"
                class="mch-one-0"
              >
                <view
                  class="diy-mch-bg"
                  :style="'background-image: url(' + value.header_bg + ')'"
                ></view>
                <view class="mch-img-0">
                  <view
                    :style="'background-image: url(' + value.pic_url + ')'"
                  ></view>
                </view>
                <view
                  class="font-center u-line-1"
                  style="padding: 0 30rpx; position: relative; top: -30rpx"
                >
                  {{ value.name }}
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <view>
        <template
          v-for="(value, index) in item.param.list.length > 0
            ? item.param.list
            : defaultList.mch.list"
        >
          <view class="mch-one-1">
            <view class="mch-top flex flex-y-center">
              <image
                :src="value.pic_url"
                style="width: 100rpx; height: 100rpx"
              />
              <view class="flex-grow-1" style="padding: 0 24px">
                <view class="u-line-1">{{ value.name }}</view>
                <view style="color: #666">商品数：{{ value.goods_count }}</view>
              </view>
              <view :to="{ name: 'MchShop', query: { mch_id: value.id } }">
                <view class="mch-btn">进店逛逛</view>
              </view>
            </view>
            <view class="mch-goods flex">
              <template
                v-if="
                  (value.goods_style == 2 && value.goods_list.length == 0) ||
                  (value.goods_style < 2 && value.goods_count == 0)
                "
              >
                <view
                  class="w-100"
                  style="padding: 16rpx; color: #888; text-align: center"
                >
                  暂无商品
                </view>
              </template>
              <template v-else>
                <template v-for="(v, k) in value.goods_list">
                  <view
                    :to="{ name: 'GoodsDetail', query: { id: v.id } }"
                    class="mch-goods-one flex-grow-0"
                    :style="{ backgroundImage: 'url(' + v.pic_url + ')' }"
                  >
                    <view class="mch-goods-price u-line-1"
                      >￥{{ v.price }}</view
                    >
                  </view>
                </template>
              </template>
            </view>
          </view>
        </template>
      </view>
    </template>
  </view>
</template>

<script>
export default {
  name: 'DiyMch',
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;
.diy-mch {
  padding: 0 13 * $rpx;
}
.diy-mch-main {
  background: #fff;
  border-radius: 12 * $rpx;
}
.diy-mch-title {
  height: 44 * $rpx;
  display: flex;
  line-height: 44 * $rpx;
  position: relative;
  padding: 0 10 * $rpx;
}


.diy-mch-bg {
  width: 100%;
  height: 75 * $rpx;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 5 * $rpx 5 * $rpx 0 0;
}
.mch {
  padding: 0 9 * $rpx 9 * $rpx 9 * $rpx;
}

.mch-one-0 {
  width: 112 * $rpx;
  margin-right: 8 * $rpx;
  background: #f6f6f6;
  padding-bottom: 10 * $rpx;
  border-radius: 0 0 5 * $rpx 5 * $rpx;
}
.diy-mch-main .mch .diy-mch-item:last-child .mch-one-0 {
  margin-right: 0;
}

.mch-img-0 {
  text-align: center;
}
.mch-img-0 view {
  width: 48 * $rpx;
  height: 48 * $rpx;
  display: inline-block;
  background-color: #fff;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  position: relative;
  top: -20 * $rpx;
}

.mch-top {
  padding: 12 * $rpx;
  background-color: #fff;
}

.mch-btn {
  padding: 4 * $rpx 8 * $rpx;
  border-radius: 4 * $rpx;
  border: 1 * $rpx solid #e3e3e3;
}

.mch-goods {
  overflow: auto;
  margin: 4 * $rpx;
}

.mch-goods-one {
  width: 110 * $rpx;
  height: 110 * $rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-right: 4 * $rpx;
  position: relative;
}

.mch-goods-price {
  position: absolute;
  bottom: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.85);
  color: #ff4544;
  text-align: center;
  width: 100%;
}
</style>
