<template>
  <div class="kanjia-title" :style="{ zIndex: showShare ? 999 : 991 }">
    <!-- 秒杀专属头部 -->
    <div
      v-if="type == 'miaosha'"
      :style="{
        background:
          'url(' + wxapp_img.miaosha.miaosha_bar + ') no-repeat center',
        backgroundSize: '100% 100%',
      }"
      class="kanji-top1"
    >
      <div class="top1-content">
        <div class="left">
          <PriceText
            :price="goodsData.miaosha.miaosha_price"
            fontWeight="600"
            ySize="66rpx"
            fSize="36rpx"
            color="#fff"
          ></PriceText>

          <text
            v-if="goodsData.original_price"
            class="m-x-10"
            style="opacity: 0.8"
          >
            <text>￥</text>
            <text class="font-del">{{ goodsData.original_price }}</text>
          </text>
        </div>
        <div class="right">
          <view v-if="downTime.type">距开始：</view>
          <view v-else>距结束：</view>
          <u-count-down
            :time="downTime.downTime"
            format="DD天HH:mm:ss"
            autoStart
          ></u-count-down>
        </div>
      </div>
    </div>

    <!-- 拼团 -->
    <div
      v-else-if="type == 'pintuan'"
      :style="{
        background: 'url(' + wxapp_img.pt.pt_bar + ') no-repeat center',
        backgroundSize: '100% 100%',
      }"
      class="kanji-top1"
    >
      <div class="top1-content">
        <div class="left felx-w-1">
          <PriceText
            :price="goodsData.group_price"
            fontWeight="600"
            ySize="66rpx"
            fSize="36rpx"
            color="#fff"
          ></PriceText>

          <text
            v-if="goodsData.original_price"
            class="m-x-10"
            style="opacity: 0.8"
          >
            <text>￥</text>
            <text class="font-del">{{ goodsData.original_price }}</text>
          </text>

          <text
            style="
              background: #ffd2cb;
              line-height: 34rpx;
              border-radius: 20rpx;
              color: #ff1b22;
              font-size: 24rpx;
              padding: 0 10rpx;
            "
            >{{ goodsData.group_num }}人团</text
          >
        </div>

        <div class="right">
          <template v-if="downTime.downTime > 0">
            <u-count-down
              :time="downTime.downTime"
              format="DD天 HH:mm:ss"
              autoStart
            ></u-count-down>
          </template>
          <template v-else>
            <text style="color: transparent">:</text>
          </template>
        </div>
      </div>
    </div>

    <!-- 砍价 -->
    <div
      v-else-if="type == 'bargain'"
      :style="{
        background:
          'url(' + wxapp_img.bargain.bargain_bar + ') no-repeat center',
        backgroundSize: '100% 100%',
      }"
      class="kanji-top1"
    >
      <div class="top1-content">
        <div class="left felx-w-1">
          <PriceText
            :price="goodsData.min_price"
            fontWeight="600"
            ySize="66rpx"
            fSize="36rpx"
            color="#fff"
          ></PriceText>

          <text v-if="goodsData.price" class="m-x-10" style="opacity: 0.8">
            <text>￥</text>
            <text class="font-del">{{ goodsData.price }}</text>
          </text>
        </div>

        <div class="right">
          <template v-if="goodsData.reset_time">
            <view>砍价结束还剩：</view>
            <u-count-down
              :time="goodsData.reset_time * 1000"
              format="DD天HH:mm:ss"
              autoStart
            ></u-count-down>
          </template>
          <template v-else>
            <view>砍价开始还剩：</view>
            <u-count-down
              :time="goodsData.foreshow_time * 1000"
              format="DD天HH:mm:ss"
              autoStart
            ></u-count-down>
          </template>
        </div>
      </div>
    </div>

    <view
      :style="{
        marginTop:
          (type == 'miaosha' || type == 'pintuan' || type == 'bargain') &&
          '-30rpx',
      }"
      class="goods-msg-box p-20 bg-fff"
    >
      <!--秒杀，拼团单独设置不在这里 价格 销量 -->
      <view
        v-if="type != 'miaosha' && type != 'pintuan' && type != 'bargain'"
        class="msg_top1 flex-y-center"
      >
        <div class="msg_top1_left flex-w-1">
          <!-- 积分详情 展示价格 -->
          <template v-if="type == 'integral'">
            <text class="price-color">
              <text class="font-30">
                {{ goodsData.integral + '积分 ￥' + goodsData.price }}
              </text>
            </text>
          </template>

          <template v-else-if="type == 'yuyue'">
            <PriceText
              v-if="goodsData.price"
              :price="goodsData.price <= 0 ? '免费预约' : goodsData.price"
              fontWeight="600"
              ySize="56rpx"
              fSize="34rpx"
            >
            </PriceText>

            <!-- 因为预约没有min_price -->
            <template v-if="goodsData.price > 0">
              <text
                v-if="goodsData.original_price"
                class="font-24 m-x-10 color-999"
              >
                <text>￥</text>
                <text class="font-del">{{ goodsData.original_price }}</text>
              </text>

              <MemberPrice
                :memberPrice="goodsData.min_member_price"
              ></MemberPrice>
            </template>
          </template>

          <!-- 最小价格 -->
          <template v-else>
            <PriceText
              v-if="goodsData.min_price"
              :price="goodsData.min_price"
              fontWeight="600"
              ySize="56rpx"
              fSize="34rpx"
            >
            </PriceText>
          </template>

          <!-- 原价 -->
          <template v-if="Number(goodsData.min_price)">
            <text
              v-if="goodsData.original_price"
              class="font-24 m-x-10 color-999"
            >
              <text>￥</text>
              <text class="font-del">{{ goodsData.original_price }}</text>
            </text>

            <MemberPrice
              v-if="goodsData.is_level || store.is_member_price"
              :memberPrice="goodsData.min_member_price"
            ></MemberPrice>
          </template>
          <template v-else-if="type == 'integral'">
            <text class="font-24 m-x-10 color-999">
              <text>￥</text>
              <text class="font-del">{{ goodsData.original_price }}</text>
            </text>
          </template>
        </div>

        <div
          v-if="goodsData.sales && store.is_sales"
          class="msg_top1_right font-24 color-999"
        >
          销量 {{ goodsData.sales }}<template v-if="goodsData.unit">/{{goodsData.unit}}</template>
        </div>
      </view>

      <template v-if="type != 'integral'">
        <GoodsCoupon :goodsData="goodsData"></GoodsCoupon>
      </template>

      <!-- 秒杀 -->
      <view
        v-if="type == 'miaosha' && store.is_sales"
        class="msg_top1 m-b-10 flex-y-center"
      >
        <text
          class="flex-w-1"
          style="color: #ff1b22; margin-top: 10rpx; font-size: 24rpx"
        >
          已抢{{ goodsData.sales }}件
        </text>
      </view>

      <!-- 拼团 -->
      <view v-if="type == 'pintuan'" class="msg_top1 m-b-10 flex-y-center">
        <text
          class="flex-w-1"
          style="color: #ff1b22; margin-top: 10rpx; font-size: 24rpx"
        >
          红包补贴 ￥{{ goodsData.subsidy_price }}
        </text>
        <div v-if="store.is_sales" class="msg_top1_right font-24 color-999">
          已拼{{ goodsData.virtual_sales }}件
        </div>
      </view>

      <!-- 砍价 -->
      <view v-if="type == 'bargain'" class="msg_top1 m-b-10 flex-y-center">
        <text
          class="flex-w-1"
          style="color: #ff1b22; margin-top: 10rpx; font-size: 24rpx"
        >
          已有{{ goodsData.sale }}人参与砍价
        </text>
        <div class="msg_top1_right font-24 color-999">
          库存{{ goodsData.num }}
        </div>
      </view>

      <!-- 全返 -->
      <view v-if="goodsData.quanfan" class="msg_top3 m-b-10">
        <div v-if="goodsData.quanfan.rebate_type == 2" class="item">
          <text>预计消费返</text>
          <text class="m-l-10">{{ goodsData.quanfan.amount }}余额</text>
        </div>
        <div v-if="goodsData.quanfan.rebate_type == 1" class="item">
          <text>预计消费返</text>
          <text class="m-l-10">{{ goodsData.quanfan.amount }}积分</text>
        </div>
      </view>

      <!-- 商品名称 -->
      <view class="goods-name font-34 font-w-700 m-b-10">
        {{ goodsData.name }}
      </view>

      <template v-if="type == 'goods'">
        <div class="msg_top5 color-666">
          <div @click="onShoucang" class="item flex-y-center">
            <text
              v-if="!goodsData.is_favorite"
              class="iconfont icon-collection m-r-10 font-36"
            ></text>
            <text
              v-else
              class="iconfont icon-collection-fill price-color m-r-10 font-36"
            ></text>
            <text>{{ goodsData.is_favorite ? '已收藏' : '收藏' }}</text>
          </div>
          <div @click="switchBoolean('showShare')" class="item">
            <text class="iconfont icon-share m-r-10 font-36"></text>
            <text>分享</text>
          </div>
        </div>
      </template>

      <template v-if="type != 'integral'">
        <Share
          :showPopup.sync="showShare"
          :data="goodsData"
          :type="type"
          :isScrollTop="isScrollTop"
          :number="0"
          :routerPush="''"
          showFixedShare
        ></Share>
      </template>
    </view>
  </div>
</template>

<script>
import Share from '@/components/share/share';
import PriceText from '@/components/price-text/index.vue';
import MemberPrice from '@/components/member-price';
import GoodsCoupon from './goods-coupon';
export default {
  props: {
    // 商品数据
    goodsData: {
      type: [Object, String],
    },
    // goods 普通商品 miaosha秒杀商品, integral积分商品
    type: {
      type: String,
      default: 'goods',
    },
  },
  data() {
    return {
      showShare: false,
      isScrollTop: false,
    };
  },
  components: {
    Share,
    PriceText,
    GoodsCoupon,
    MemberPrice,
  },
  methods: {
    switchBoolean(key) {
      this[key] = !this[key];
    },
    async onShoucang() {
      var goods = JSON.parse(JSON.stringify(this.goodsData));
      if (goods.is_favorite) {
        await this.$requestAll.user.favoriteRemove(
          {
            goods_id: goods.id,
          },
          true
        );
        var msg = '取消成功';
        goods.is_favorite = 0;
      } else {
        await this.$requestAll.user.favoriteAdd(
          {
            goods_id: goods.id,
          },
          true
        );
        var msg = '收藏成功';
        goods.is_favorite = 1;
      }
      console.log(goods);
      uni.$u.toast(msg);
      this.$emit('update:goodsData', goods);
    },
    scroll({ scrollTop }) {
      this.isScrollTop = scrollTop - 44 >= 200;
    },
  },
  computed: {
    downTime() {
      // 已知开始时间结束时间
      // 结束-开始 >1小时 = 未开始  则相反
      if (this.goodsData.miaosha && this.type == 'miaosha') {
        // const time = new Date().getTime();
        let time_over =
          this.goodsData.miaosha.end_time - this.goodsData.miaosha.now_time;
        if (time_over / 3600 >= 1) {
          return {
            type: 1,
            downTime: (time_over - 3600) * 1000,
          };
        } else {
          return {
            type: 0,
            downTime: time_over * 1000,
          };
        }
      } else if (this.goodsData && this.type == 'pintuan') {
        return {
          type: 0,
          downTime: this.goodsData.limit_time * 1000 - new Date().getTime(),
        };
      } else {
        return {
          type: 0,
          downTime: 0,
        };
      }
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
  },
};
</script>

<style lang="scss" scoped>
.kanjia-title {
  position: relative;
  z-index: 991;
  // #ifdef MP-WEIXIN
  z-index: initial !important;
  // #endif
  margin: -50rpx 20rpx 20rpx;
  border-radius: 30rpx;
  overflow: hidden;

  .kanji-top1 {
    height: 170rpx;
    padding-bottom: 30rpx;

    .top1-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-size: 100% 100%;
      color: #fff;
      padding: 20rpx;
      .right {
        padding-top: 56rpx;
        display: flex;
        align-items: center;
      }
    }
  }

  .goods-msg-box {
    background: #fff;
    border-radius: 30rpx 30rpx 0 0;

    .msg_top1 {
      .price-color {
        color: #ff0000;
      }
    }

    // 分享最高可赚box
    .share-price {
      color: #ff191d;
      font-weight: 700;
    }

    .msg_top3 {
      display: flex;
      align-items: center;
      color: #ff0000;
      font-size: 24rpx;

      .item {
        margin-right: 10rpx;
        padding: 0 4rpx;
        line-height: 32rpx;
        background: linear-gradient(92deg, #ffe4e3 0%, #fce9e1 100%);
        border-radius: 4rpx;
        font-size: 22rpx;
        color: #ff1b22;
      }
    }

    .msg_top5 {
      display: flex;
      .item {
        padding-top: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        font-size: 24rpx;
      }
    }
  }
}

.goods-info {
  // padding: 32rpx 24rpx;

  .goods-title {
    margin-bottom: 24rpx;
  }

  .goods-price-content {
    .goods-price-left {
      > view:nth-child(1) {
        color: red;

        > image {
          width: 94rpx;
          height: 40rpx;
          margin-left: 20rpx;
        }
      }

      > view:nth-child(2) {
        color: #666;
        margin-top: 10rpx;
      }
    }

    .goods-price-right {
      color: #666;
      font-size: 24rpx;

      image {
        width: 46rpx;
        height: 46rpx;
      }
    }
  }
}

.rebate {
  margin-top: -32rpx;
  padding: 0 24rpx;
  padding-bottom: 32rpx;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .rebate-item {
    margin-right: 10px;
    margin-top: 10px;
    padding: 0 5px;
    max-width: 145px;
    line-height: 23px;
    background: linear-gradient(90deg, #feddf1 0%, #ffe7e1 100%);
    border-radius: 4px;
    font-size: 12px;
    color: #ff191d;
  }
}
</style>
