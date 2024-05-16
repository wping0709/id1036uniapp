<template>
  <view v-if="pageData" class="body">
    <view class="head">
      <div :style="{
        background: `url(${pageData.setting && pageData.setting.pic_url}) 0% 0% / 100% 100% no-repeat`
      }" class="head-content flex-col flex-x-sb">
        <view class="flex-x-sb">
          <view class="flex-col flex-y-center head-1">
            <view>我的积分</view>
            <view class="head-price m-t-20">{{ pageData.user.integral }}</view>
          </view>
          <view class="flex-col flex-y-center head-1">
            <view>累计总积分</view>
            <view class="head-price m-t-20">{{
              pageData.user.total_integral
            }}</view>
          </view>
        </view>
        <view class="flex-x-sb flex-y-center head-2">
          <view
            @click="$utils.toUrl('/integral-mall/exchange/index')"
            class="flex-y-center"
          >
            <text class="iconfont icon-gift font-50 color-999"></text>
            <text>我的兑换</text>
          </view>
          <view
            @click="$utils.toUrl('/integral-mall/detail/index')"
            class="flex-y-center"
          >
            <text class="iconfont icon-gift font-50 color-999"></text>
            <text>积分明细</text>
          </view>
        </view>
      </div>
    </view>
    <div
      @click="$utils.toUrl('/integral-mall/register/index')"
      class="qiandao-bt flex-y-center flex-x-center"
    >
      <view v-if="!pageData.today" class="flex-x-center flex-y-center">
        <view>立即签到赚积分</view>
        <view class="iconfont icon-arrow-right color-fff font-22"></view>
      </view>
      <view v-else>今日已签到</view>
    </div>

    <view class="m-y-20">
      <u-swiper
        @click="clickSwitch"
        indicator
        height="190rpx"
        circular
        radius="0"
        :list="pageData.banner_list"
        keyName="pic_url"
        mode="dot"
      ></u-swiper>
    </view>

    <!-- 优惠券 -->
    <view class="coupon-box bg-fff">
      <div class="title font-30 m-b-20">兑换优惠券</div>
      <div class="coupon-list">
        <div
          @click="
            $utils.toUrl(
              '/integral-mall/coupon-info/index?coupon_id=' + item.id
            )
          "
          v-for="(item, index) in pageData.coupon_list"
          :key="index"
          class="coupon-item"
        >
          <image
            mode="aspectFill"
            v-if="item.type == 0"
            :src="wxapp_img.icon_coupon_index"
          />
          <image v-else :src="wxapp_img.icon_coupon_no" />
          <div class="coupon-pl">
            <div class="pl-top">
              ￥<span>{{ item.sub_price }}</span>
            </div>
            <div class="pl-btm u-line-1">满{{ item.min_price }}元可用</div>
          </div>
          <div v-if="item.type == 0" class="conpon-pr flex-row">
            <span class="flex-y-center">立即兑换</span>
          </div>
          <div v-else class="conpon-pr flex-row">
            <span class="flex-y-center">已兑换</span>
          </div>
        </div>
      </div>
    </view>

    <div class="cart-box bg-fff">
      <div class="title font-30 m-b-20 m-x-20 p-t-20">优惠购专区</div>
      <scroll-view scroll-x class="scroll-view-x p-x-20">
        <div
          class="nav-item"
          :class="index == current ? 'current' : ''"
          replace
          v-for="(item, index) in pageData.cat_list"
          :key="item.id"
          @click="catGoods(index)"
        >
          <image class="item-image" :src="item.pic_url" />
          <view class="u-line-1 m-t-10">{{ item.name }}</view>
        </div>
      </scroll-view>

      <view class="scroll-box p-x-20">
        <view
          v-for="(item, index) of goodsData.list"
          :key="index"
          class="goods-item"
          @click="
            $utils.toUrl(
              '/integral-mall/goods-info/index?id=' +
                item.id +
                '&integral=' +
                item.integral
            )
          "
        >
          <view class="goods-pic">
            <image :src="item.cover_pic" mode="aspectFill" />
          </view>
          <view class="goods-txt">
            <view class="goods-des u-line-2">{{ item.name }}</view>

            <view class="price-color">
              {{ item.integral }}积分
              <span v-if="item.price > 0"> +￥{{ item.price }} </span>
            </view>
            <view class="goods-btm m-t-10 flex-x-sb flex-y-center u-line-1">
              <view class="font-30">
                <text
                  v-if="item.original_price"
                  class="color-999 font-26 font-del"
                  >￥{{ item.original_price }}</text
                >
              </view>
              <view class="font-24 color-999">
                仅剩{{ item.goods_num }}{{ item.unit }}
              </view>
            </view>

            <view class="bt">立即兑换</view>
          </view>
        </view>
      </view>
      <view style="background: #f5f5f5; padding: 2rpx 0">
        <u-loadmore :status="goodsData.isBottom ? 'nomore' : 'loading'" />
      </view>
    </div>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>

<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  components: {},
  data() {
    return {
      pageData: '',
      current: 0,
      goodsData: {
        list: [],
        page: 1,
        isBottom: false,
      },
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.integralmall.integralmallIndex(
        {},
        true
      );
      this.pageData = res.data;
      this.getGoodsData();
    },
    clickSwitch(index) {
      const val = this.pageData.banner_list[index];

      this.$utils.toUrl(val.page_url, val.open_type);
    },
    catGoods(index) {
      this.goodsData = this.$options.data().goodsData;
      this.current = index;
      this.getGoodsData();
    },
    async getGoodsData() {
      if (this.goodsData.isBottom) return;
      const formData = {
        page: this.goodsData.page,
        cat_id: this.pageData.cat_list[this.current].id,
      };
      const res = await this.$requestAll.integralmall.integralmallGoodsList(
        formData,
        true
      );
      this.goodsData.list.push(...res.data.list);
      this.goodsData.isBottom =
        this.goodsData.list.length >= res.data.pagination.totalCount;
    },
  },
  computed: {
    shareData() {
      return {
        title: '积分商城',
        path:
          '/integral-mall/index/index' +
          uni.$u.queryParams({
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  onReachBottom() {
    this.goodsData.page++;
    this.getGoodsData();
  },
};
</script>

<style lang="scss" scoped>
.flex-row {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-flex-direction: row;
  flex-direction: row;
}
.body {
  padding-bottom: env(safe-area-inset-bottom);
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
}
.head {
  background: #000;
  color: #fff;
  position: relative;
  height: 320rpx;
  .head-content {
    padding: 20rpx 80rpx;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    font-size: 30rpx;
    .head-1 {
      color: #999;
      .head-price {
        color: #ecb786;
        font-size: 50rpx;
      }
    }
    .head-2 {
      margin-bottom: 60rpx;
    }
  }
}

.qiandao-bt {
  position: relative;
  z-index: 9;
  color: #fff;
  background: #fb6b44;
  font-size: 26rpx;
  width: 380rpx;
  line-height: 80rpx;
  margin: 0 auto;
  margin-top: -40rpx;
  border-radius: 40rpx;
  view {
    opacity: 0.8;
  }
}

.coupon-box {
  padding: 20rpx 20rpx;
  margin-bottom: 20rpx;
  .title {
    padding-left: 20rpx;
    line-height: 30rpx;
    border-left: 4rpx solid #fb6b44;
  }
  .coupon-list {
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    padding: 0 10 * 2rpx;
    box-sizing: border-box;
  }
  .coupon-list::-webkit-scrollbar,
  .scroll-view-x::-webkit-scrollbar {
    display: none;
  }
  .coupon-list .coupon-item {
    width: 140 * 2rpx;
    height: 72 * 2rpx;
    box-sizing: content-box;
    margin-right: 6 * 2rpx;
    display: inline-block;
    position: relative;
  }
  .coupon-list .coupon-item:last-child {
    margin-right: 0;
  }
  .coupon-list .coupon-item image {
    width: 100%;
    height: 100%;
  }
  .coupon-list .coupon-item .coupon-pl {
    position: absolute;
    top: 0;
    left: 0;
    width: 108 * 2rpx;
    height: 72 * 2rpx;
    text-align: center;
    z-index: 1;
    color: #fff;
  }
  .coupon-list .coupon-item .coupon-pl .pl-top {
    height: 44 * 2rpx;
    line-height: 44 * 2rpx;
  }
  .coupon-list .coupon-item .coupon-pl .pl-top span {
    font-size: 22 * 2rpx;
  }
  .coupon-list .coupon-item .coupon-pl .pl-btm {
    height: 28 * 2rpx;
    line-height: 28 * 2rpx;
    font-size: 12 * 2rpx;
  }
  .coupon-list .coupon-item .conpon-pr {
    box-sizing: content-box;
    position: absolute;
    right: 0;
    top: 0;
    height: 72 * 2rpx;
    width: 14 * 2rpx;
    padding: 0 9 * 2rpx;
    color: #fff;
    text-align: center;
    white-space: normal;
    font-size: 12 * 2rpx;
    line-height: 14 * 2rpx;
  }
}

.cart-box {
  .title {
    padding-left: 20rpx;
    line-height: 30rpx;
    border-left: 4rpx solid #fb6b44;
  }
  .scroll-view-x {
    white-space: nowrap;

    .nav-item {
      // display: flex;
      // flex-direction: column;
      // align-items: center;
      display: inline-block;
      width: 120rpx;
      height: 100rpx;
      text-align: center;
      font-size: 22rpx;
      > image {
        display: block;
        margin: 0 auto;
        width: 50rpx;
        height: 50rpx;
      }
    }
    .current {
      color: #ff6f28;
    }
  }

  .scroll-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding-top: 10rpx;
    background: #f5f5f5;
    .goods-item {
      width: 49%;
      background: #fff;
      border-radius: 10rpx;
      overflow: hidden;
      margin-bottom: 10rpx;
      .goods-pic > image {
        display: block;
        margin: 0 auto;
        width: 100%;
        height: 360rpx;
      }
      .goods-txt {
        padding: 10rpx;
        .goods-des {
          line-height: 36rp;
          height: 72rpx;
        }
        .bt {
          line-height: 52rpx;
          background: #e19a59;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-align: center;
          -ms-flex-align: center;
          align-items: center;
          -webkit-box-pack: center;
          -ms-flex-pack: center;
          justify-content: center;
          border-radius: 26rpx;
          color: #fff;
          font-size: 26rpx;
          background-image: linear-gradient(120deg, #f1b37d, #e19a59);
        }
      }
    }
  }
}
</style>
