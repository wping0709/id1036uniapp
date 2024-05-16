<template>
  <view v-if="pageData" class="body">
    <div class="top">
      <div
        class="top-content"
        :style="{
          background: 'url(' + wxapp_img.manghe.open_bg + ') no-repeat content',
        }"
      >
        <div class="right-bts">
          <div @click="$utils.toUrl('/blind/tcp/tcp')" class="rule">规则</div>
          <div
            @click="$utils.toUrl('/blind/order-all/order-all')"
            class="counter"
          >
            货柜
          </div>
        </div>

        <!-- swiper -->
        <div class="swiper-box">
          <image
            :class="showBox == 'loading' && 'animation'"
            @click="onKaiqi"
            :src="wxapp_img.manghe.open_box"
            mode="aspectFill"
          />
          <image
            v-if="showBox != 'loading'"
            @click="onKaiqi"
            :src="wxapp_img.manghe.open_shou"
            mode="aspectFit"
          />
        </div>

        <div class="blind-describe">
          <image :src="wxapp_img.blind.blind" mode="aspectFit" />
        </div>
      </div>
    </div>

    <div
      class="bottom flex-col"
      :class="isAllGoods ? 'height-switch' : 'height-switch-initail'"
    >
      <div @click="switchHeight" class="title font-center">
        <text>{{
          isAllGoods ? (checkGoods ? '商品详情' : '全部奖品') : '查看全部商品'
        }}</text>
        <text
          class="iconfont"
          :class="
            isAllGoods
              ? checkGoods
                ? 'icon-close'
                : 'icon-arrow-bottom'
              : 'icon-arrow-top'
          "
        ></text>
      </div>
      <scroll-view v-if="!isAllGoods" scroll-x class="flex-h-1 scroll-x">
        <div class="prize-list">
          <image
            v-for="(item, i) in pageData.goods_list"
            :key="i"
            :src="item.cover_pic"
            class="prize-item"
          ></image>
        </div>
      </scroll-view>

      <scroll-view v-else scroll-y class="flex-h-1 scroll-y">
        <div v-if="!checkGoods" class="blind-list">
          <div
            @click="clickBlindGoods(item)"
            class="blind-item"
            v-for="(item, i) in pageData.goods_list"
            :key="i"
          >
            <image :src="item.cover_pic" mode="aspectFill" />
            <view class="blind-name u-line-2">{{ item.name }}</view>

            <view class="price">
              <text>价值￥</text>
              <text class="font-36 font-w-600">{{ item.price }}</text>
            </view>
          </div>
        </div>

        <div v-else class="goods-detail">
          <image :src="checkGoods.cover_pic" mode="aspectFill" />
          <div class="m-t-20 font-600-30 font-center u-line-2">
            {{ checkGoods.name }}
          </div>
          <div class="price font-center m-y-30">
            <text>价值￥</text>
            <text class="font-40">{{ checkGoods.price }}</text>
          </div>
          <div class="more-bt">更多详情</div>

          <rich-text v-html="formatRichText(checkGoods.detail)"></rich-text>
        </div>
      </scroll-view>
      <div class="bts flex-y-center flex-x-center">
        <view @click="onKaiqi">开启好运</view>
      </div>
    </div>

    <u-popup
      :show="showBox === true"
      @close="showBox = false"
      mode="center"
      :safe-area-inset-bottom="false"
      round="20rpx"
      bgColor="transparent"
    >
      <div
        class="popup-order"
        :style="{
          background: 'url(' + wxapp_img.manghe.popup_bg + ') no-repeat center',
          backgroundSize: '100%',
        }"
      >
        <image
          :src="wxapp_img.manghe.open_guang"
          class="content-img"
          mode="widthFix"
        />
        <swiper class="swiper" indicator-dots autoplay circular>
          <swiper-item
            class="swiper-item"
            v-for="(item, i) in box_goods_list"
            :key="i"
          >
            <view class="swiper-item-name">{{ item.goods_name }}</view>
            <image :src="item.cover_pic" mode="aspectFill" />
          </swiper-item>
        </swiper>

        <div @click="showBox = false" class="submit-bt">开心收下</div>
      </div>
    </u-popup>
  </view>
</template>
<script>
import BlindDetailRow from '../components/BlindDetailRow.vue';
import OrderPay from '@/mixins/OrderPay';
export default {
  components: {
    BlindDetailRow,
  },
  mixins: [OrderPay],
  data() {
    return {
      pageData: '', //当前盲盒信息
      box_goods_list: [], //盲盒中奖商品
      num: 1, //盲盒数量
      order_id: '', //盲盒id
      swiperIndex: 0, //轮播索引
      checkGoods: '', //选中的商品
      isAllGoods: false, //显示盲盒全部商品
      showBox: false, //显示订单弹框
    };
  },
  onLoad(param) {
    this.order_id = param.order_id;
    this.loadData();
  },
  onShow() {
    const address = uni.getStorageSync('address');
    console.log(address, '缓存获取');
    if (address) this.address = address;
    uni.removeStorageSync('address');
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.blind.lotteryDetail(
        {
          order_id: this.order_id,
        },
        true
      );
      this.pageData = res.data;
      this.address = res.data.address || '';
    },
    clickBlindGoods(item) {
      this.checkGoods = item;
    },
    switchHeight() {
      if (this.checkGoods) {
        this.checkGoods = '';
        return;
      }
      this.isAllGoods = !this.isAllGoods;
    },
    async onKaiqi() {
      uni.showLoading({
        title: '加载中',
      });
      this.showBox = 'loading';
      try {
        var res = await this.$requestAll.blind.openBox(
          {
            order_id: this.order_id,
            num: this.pageData.surplus_num,
          },
          true
        );
        this.box_goods_list = res.data;
        setTimeout(() => {
          this.showBox = true;
          uni.hideLoading();
        }, 1000);
      } catch (error) {
        this.showBox = false;
      }
    },
    showAttrPopup(item) {},
  },
  computed: {
    formatRichText(html) {
      return function (html) {
        var deschtml = html.replace(
          /\<img/g,
          '<img style="width:100%;height:auto;"'
        );
        deschtml = deschtml.replace(/\<p/g, '<p style="width-100"');
        deschtml = deschtml.replace(/\<div/g, '<div class="width-100"');
        return deschtml;
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  .top {
    color: #fff;
    background: #331fa8;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .top-content {
      position: absolute;
      left: 0;
      right: 0;
      height: 440rpx;
      bottom: calc(440rpx + env(safe-area-inset-bottom));
      top: 0;

      .right-bts {
        position: absolute;
        right: 0;
        top: 30rpx;
        min-width: 98rpx;
        > view,
        > div {
          text-align: center;
          width: 98rpx;
          background: #5c4cba;
          border: 1px solid #8579cb;
          border-radius: 120rpx 0rpx 0rpx 120rpx;
          line-height: 52rpx;
          font-size: 24rpx;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20rpx;
        }
      }

      .swiper-box {
        width: 100%;
        height: 100%;
        > image:nth-child(1) {
          position: absolute;
          left: 50%;
          top: 0;
          transform: translate(-50%, 0);
          width: 600rpx;
          height: 600rpx;
        }
        > image:nth-child(2) {
          position: absolute;
          left: 50%;
          top: 27%;
          width: 210rpx;
          height: 210rpx;
        }
        .animation {
          animation: animation 0.23s linear infinite;
          @keyframes animation {
            0% {
              left: 52%;
            }
            50% {
              left: 45%;
            }
            100% {
              left: 52%;
            }
          }
        }
      }

      .blind-describe {
        display: flex;
        justify-content: center;
        > image {
          margin-left: 40rpx;
        }
      }
    }
  }

  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 400rpx;
    height: calc(400rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    flex-direction: column;
    border-radius: 24rpx 24rpx 0 0;
    background: #fafafc;
    .title {
      line-height: 80rpx;
    }
    .scroll-x {
      padding: 0 20rpx;
      width: 100vw;
      box-sizing: border-box;
      .prize-list {
        white-space: nowrap;
        padding: 0 20rpx;
        .prize-item {
          margin-right: 20rpx;
          border-radius: 10rpx;
          width: 180rpx;
          height: 180rpx;
          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }
    .scroll-y {
      width: 100vw;
      box-sizing: border-box;
      padding: 0 20rpx;

      .blind-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .blind-item {
          $width: 345rpx;
          flex: 1;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          padding: 20rpx;
          border-radius: 20rpx;
          border: 2rpx solid #eee;
          &:nth-child(2n) {
            margin-right: 0;
          }
          > image {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            width: 240rpx;
            height: 240rpx;
            border-radius: 20rpx;
          }

          .blind-name {
            margin: 10rpx 0;
            line-height: 42rpx;
            font-weight: 600;
            height: 84rpx;
          }
        }
      }

      .goods-detail {
        > image {
          display: block;
          margin: 0 auto;
          border-radius: 20rpx;

          width: 360rpx;
          height: 360rpx;
          margin-bottom: 20rpx;
        }
        .more-bt {
          margin: 30rpx 0;
          border: 1px solid #999;
          line-height: 70rpx;
          border-radius: 35rpx;

          text-align: center;
        }
      }
    }

    .bts {
      padding: 10rpx 0;
      > view {
        width: 600rpx;
        border-radius: 35rpx;
        padding: 0 20rpx;

        text-align: center;
        color: #fff;
        line-height: 70rpx;
        background: #f83133;
      }
    }
  }
  .height-switch {
    transition: all 0.6s;
    height: 80vh;
  }
  .height-switch-initail {
    transition: all 0.6s;
    height: 400rpx;
    height: calc(400rpx + env(safe-area-inset-bottom));
  }

  .popup-order {
    padding: 24rpx;
    padding-top: 130rpx;
    width: 600rpx;
    height: 760rpx;
    position: relative;

    .swiper {
      position: relative;
      z-index: 10;
      height: 460rpx;
      .swiper-item {
        .swiper-item-name {
          text-align: center;
          line-height: 40rpx;
          margin-bottom: 20rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          word-break: break-all;
          white-space: nowrap;
        }
        image {
          display: block;
          margin: 0 auto;
          width: 400rpx;
          height: 400rpx;
        }
      }
    }
    .content-img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 100%;
    }
    .submit-bt {
      position: relative;
      z-index: 9;
      margin: 0 auto;
      margin-top: 54rpx;
      line-height: 80rpx;
      background: #f83133;
      border-radius: 120rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
      color: #ffffff;
    }
  }
}
</style>
