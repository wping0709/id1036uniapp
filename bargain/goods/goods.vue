<template>
  <view v-if="pageData" class="body">
    <GoodsBanner
      :list="pageData.goods.pic_list"
      :goodsData="pageData.goods"
      type="bargain"
    ></GoodsBanner>

    <GoodsTitleMsg
      ref="GoodsTitleMsg"
      :goodsData="pageData.goods"
      type="bargain"
    ></GoodsTitleMsg>

    <!-- 砍价列表 -->
    <view class="bargain-info" v-if="pageData.bargain_info">
      <view class="font-w-700 font-30 p-b-20">快让你的好友祝你一臂之力</view>

      <div class="flex-x-sb flex-y-center color-999">
        <view>
          <text>原价</text>
          <PriceText
            :price="pageData.goods.price"
            color="#999"
            ySize="32rpx"
            fSize="24rpx"
          ></PriceText>
        </view>
        <view class="jindu-text font-24 color-fff">
          <text>当前价</text>
          <text class="p-l-10">{{ pageData.bargain_info.price }}</text>
        </view>
        <view>
          <text>底价</text>
          <PriceText
            :price="pageData.goods.min_price"
            color="#999"
            ySize="32rpx"
            fSize="24rpx"
          ></PriceText>
        </view>
      </div>
      <view class="p-y-20">
        <u-line-progress
          :percentage="pageData.bargain_info.money_per"
          activeColor="#ff1b22"
          height="28rpx"
        ></u-line-progress>
      </view>

      <view class="flex-y-center flex-x-center" style="line-height: 1.8">
        <view>剩余</view>
        <view
          style="
            font-size: 36rpx;
            color: red;
            margin: 0 10rpx;
            font-weight: 700;
          "
        >
          <u-count-down
            :time="pageData.bargain_info.reset_time * 1000"
            format="DD天 HH:mm:ss"
          ></u-count-down>
        </view>
        <view>结束</view>
      </view>

      <view class="">
        <view
          v-for="(item, index) in pageData.bargain_info.bargain_info"
          :key="index"
          class="user-item flex-y-center"
        >
          <image
            :src="item.avatar"
            mode="aspectFill"
            style="width: 64rpx; height: 64rpx; border-radius: 50%"
          />
          <view class="m-l-10 flex-y-center flex-x-sb flex-w-1">
            <view class="flex-w-1 font-24">
              <view>{{ item.nickname }}</view>
              <view class="color-999" style="margin-top: 6rpx">
                小刀一挥帮砍
              </view>
            </view>
            <view class="font-w-700">
              砍掉
              <text class="price-color m-l-10">{{ item.price }}元</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 活动说明 -->
    <div class="shop-info">
      <div class="shop-title">
        <view class="title">砍价规则</view>
        <view class="flex-x-sb flex-y-center color-999">
          <!-- <text class="font-24">全部门店</text>
          <text class="iconfont icon-arrow-right"></text> -->
        </view>
      </div>
      <div class="shop-content">
        <div class="yuyue-info">
          <view class="text_info">
            <view class="num">1</view>
            <view class="text">点击砍价</view>
          </view>
          <view class="sandian">
            <div class="dian"></div>
            <div class="dian m-x-10"></div>
            <div class="dian"></div>
          </view>
          <view class="text_info">
            <view class="num">2</view>
            <view class="text">找人帮砍</view>
          </view>
          <view class="sandian">
            <div class="dian"></div>
            <div class="dian m-x-10"></div>
            <div class="dian"></div>
          </view>
          <view class="text_info">
            <view class="num">3</view>
            <view class="text">价格合适</view>
          </view>
          <view class="sandian">
            <div class="dian"></div>
            <div class="dian m-x-10"></div>
            <div class="dian"></div>
          </view>
          <view class="text_info">
            <view class="num">4</view>
            <view class="text">优惠购买</view>
          </view>
        </div>
        <div class="shop">
          <view class="shop_item1 m-b-10">
            本次活动开始时间：{{ pageData.goods.begin_time }}
          </view>
          <view class="shop_item1">
            本次活动结束时间：{{ pageData.goods.end_time }}
          </view>
        </div>
      </div>
    </div>

    <!-- 商品介绍 -->
    <GoodsDetail :goodsData="pageData.goods"></GoodsDetail>

    <!-- 立即购买组件 -->
    <GoodsFootNav @ok="onBuy" type="bargain" :goods.sync="pageData">
    </GoodsFootNav>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import GoodsDetail from '@/pages/goods/components/GoodsDetail';
import GoodsFootNav from '@/pages/goods/components/GoodsFootNav';

import PriceText from '@/components/price-text/index';
import Share from '@/components/share/share';
import share from '@/mixins/share';
import GoodsBanner from '@/pages/goods/components/goods-banner.vue';

import GoodsTitleMsg from '@/pages/goods/components/goods-title-msg.vue';
export default {
  components: {
    Share,
    GoodsBanner,
    GoodsTitleMsg,
    GoodsDetail,
    GoodsFootNav,
    PriceText,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      goods_id: '',
      showShare: false,
      setting: '',
    };
  },
  onLoad(params) {
    if (params.scene) {
      params = this.$utils.wxParams(params);
      console.log(params);
    }
    this.goods_id = params.goods_id || params.gid;
    this.getSetting();
  },

  methods: {
    async loadData() {
      const res = await this.$requestAll.bargain.goods(
        {
          goods_id: this.goods_id,
          page: 1,
        },
        true
      );
      this.pageData = res.data;
    },
    // 获取砍价设置
    async getSetting() {
      const res = await this.$requestAll.bargain.defaultSetting({}, true);
      this.setting = res.data;
    },
    clickShare() {
      console.log(123);
      this.showShare = !this.showShare;
    },
    // 立即购买
    async onBuy() {
      const { confirm } = await this.$utils.showModalAsync({
        content: '是否确认购买',
      });
      if (!confirm) return;
      const params = [
        {
          mch_id: this.pageData.goods.mch_id || 0,
          goods_list: [
            {
              bargain_order_id: this.pageData.bargain_info.order_id,
            },
          ],
        },
      ];
      this.$utils.toUrl(
        '/pages/order-submit/order-submit?mch_list=' + JSON.stringify(params)
      );
    },
  },
  onShow() {
    this.loadData();
  },
  computed: {
    shareData() {
      // 设置分享标题
      let shareTitle = '';
      if (this.setting.share_title) {
        let titleArr = this.setting.share_title.split(',');
        // 判断是否多个分享标题。随机获取一个
        if (titleArr.length >= 1) {
          let randomNumber = uni.$u.random(0, titleArr.length - 1);
          shareTitle = titleArr[randomNumber];
        } else {
          shareTitle = titleArr[0];
        }
      }
      return {
        // 分享优先使用设置标题。如不存在获取商品名称
        title:
          shareTitle || (this.pageData.goods && this.pageData.goods.name) || '',
        path:
          '/bargain/goods/goods' +
          uni.$u.queryParams({
            goods_id: this.goods_id,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
  onPageScroll({ scrollTop }) {
    this.$refs['GoodsTitleMsg'].scroll({ scrollTop });
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;

  .shop-info {
    margin: 20rpx;
    background: #fff;
    padding: 20rpx 0;
    border-radius: 30rpx;

    .shop-title {
      display: flex;
      align-items: center;

      .title {
        width: 0;
        flex: 1;
        margin-right: 20rpx;
        font-size: 30rpx;
        padding: 10rpx 20rpx 30rpx;
        font-weight: 600;
      }
    }

    .shop-content {
      background: linear-gradient(180deg, #fdf5f5 0%, #fefeff 100%);
      padding: 0 20rpx;
      .yuyue-info {
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 72rpx;
        .text_info {
          display: flex;
          align-items: center;
          .num {
            position: relative;
            margin-right: 10rpx;
            font-size: 26rpx;
            font-weight: 700;
            &::before {
              content: '';
              position: absolute;
              bottom: 6rpx;
              right: 0;
              width: 20rpx;
              height: 20rpx;
              border-radius: 50%;
              background: #ffaaa7;
              opacity: 0.3;
            }
          }
          .text {
            font-size: 22rpx;
          }
        }
        .sandian {
          display: flex;
          align-items: center;
          white-space: nowrap;
          .dian {
            width: 6rpx;
            height: 6rpx;

            background: #ffbfbf;
            border-radius: 50%;
          }
          .dian:nth-child(2) {
            background: #ffaba8;
          }
          .dian:nth-child(3) {
            background: #ff9491;
          }
        }
      }
      .shop {
        padding: 20rpx;
        background: #ffffff;
        border: 2rpx solid #ffebe9;
        border-radius: 12rpx;
        .shop_item1 {
          padding-left: 20rpx;
          position: relative;
          color: red;
          font-size: 24rpx;
          &::before {
            content: '';
            position: absolute;
            left: 0rpx;
            top: 50%;
            transform: translateY(-50%);
            width: 6rpx;
            height: 6rpx;
            border-radius: 50%;
            background: red;
          }
        }
      }
    }
  }

  .head-swiper {
    position: relative;
    .swiper {
      height: 750rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .down-box {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);

      width: 710rpx;
      height: 80rpx;
      position: relative;
      > image {
        width: 100%;
        height: 100%;
      }
      > view {
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 100%;
        color: #3f3f3f;
      }
    }
  }

  .bargain-info {
    padding: 20rpx;
    margin: 20rpx;
    background: #fff;
    border-radius: 20rpx;
    .jindu-text {
      line-height: 42rpx;
      border-radius: 24rpx;
      padding: 0 20rpx;

      background: #ff1b22;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 100%);
        border: 10rpx solid transparent;
        border-top-color: #ff1b22;
      }
    }

    .user-item {
      margin-bottom: 20rpx;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
    }
  }
  .goods-msg {
    padding: 20rpx 30rpx;
    background: #fff;
    margin-bottom: 20rpx;
    .goods-name {
      line-height: 44rpx;
      height: 88rpx;
      font-size: 32rpx;
    }
  }

  .foot-box {
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    .fixed {
      background: #fff;
      position: fixed;
      left: 0;
      bottom: 0;
      padding-bottom: env(safe-area-inset-bottom);
      width: 100%;
      height: 100rpx;
      height: calc(100rpx + env(safe-area-inset-bottom));
      > view {
        height: 100%;
      }
      .bt-1 {
        font-size: 32rpx;
        width: 700rpx;
        height: 80rpx;
        border-radius: 40rpx;
        background: linear-gradient(to bottom, #ff9292, #fc6969);
        color: #fff;
      }
      .bt-2 {
        width: 340rpx;
        height: 80rpx;
        font-size: 32rpx;
        border-radius: 40rpx;
        background: linear-gradient(to bottom, #ff9292, #fc6969);
        color: #fff;
        &:nth-child(2) {
          background: linear-gradient(to bottom, #ffc46b, #ffa13c);
        }
      }
    }
  }
}
</style>
