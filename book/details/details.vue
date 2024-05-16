<template>
  <view v-if="pageData" class="body">
    <GoodsBanner
      :list="pageData.info.pic_list"
      :goodsData="pageData.info"
      type="yuyue"
    ></GoodsBanner>

    <GoodsTitleMsg
      type="yuyue"
      ref="GoodsTitleMsg"
      :goodsData="pageData.info"
    ></GoodsTitleMsg>

    <!-- 选择规格，品牌，无理由 -->
    <view class="page-item">
      <AttrPopup
        ref="AttrPopup"
        showText
        :goodsId="id"
        type="yuyue"
      ></AttrPopup>

      <view
        v-if="pageData.info.brand_name"
        class="flex-y-center p-20 font-26"
        style="line-height: 50rpx"
      >
        <view class="color-999" style="margin-right: 30rpx">品牌</view>
        <view>{{ pageData.info.brand_name }}</view>
      </view>

      <view
        v-if="pageData.info.service"
        class="flex flex-wrap p-20 font-26"
        style="background: #fbfcfb; border-radius: 0 0 20rpx 20rpx"
      >
        <div
          class="flex-y-center m-r-10 color-666"
          style="line-height: 50rpx"
          v-for="(item, i) in pageData.info.service"
          :key="i"
        >
          <i
            class="iconfont icon-success font-40"
            style="width: 50rpx; height: 50rpx"
          ></i>
          <text>{{ item }}</text>
        </div>
      </view>
    </view>

    <!-- 门店信息 -->
    <div class="shop-info">
      <div class="shop-title">
        <view class="title">门店信息</view>
        <view
          @click="$utils.toUrl(`/shop/shop/shop?book_id=${pageData.info.id}`)"
          class="flex-x-sb flex-y-center color-999"
        >
          <text class="font-24">全部门店</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </div>
      <div class="shop-content">
        <div class="yuyue-info">
          <view class="text_info">
            <view class="num">1</view>
            <view class="text">点击预约</view>
          </view>
          <view class="sandian">
            <div class="dian"></div>
            <div class="dian m-x-10"></div>
            <div class="dian"></div>
          </view>
          <view class="text_info">
            <view class="num">2</view>
            <view class="text">填写预约</view>
          </view>
          <view class="sandian">
            <div class="dian"></div>
            <div class="dian m-x-10"></div>
            <div class="dian"></div>
          </view>
          <view class="text_info">
            <view class="num">3</view>
            <view class="text">支付成功</view>
          </view>
          <view class="sandian">
            <div class="dian"></div>
            <div class="dian m-x-10"></div>
            <div class="dian"></div>
          </view>
          <view class="text_info">
            <view class="num">4</view>
            <view class="text">门店使用</view>
          </view>
        </div>
        <div class="shop">
          <view class="name font-w-700 flex-y-center m-b-10">
            <text class="iconfont icon-store font-30"></text>
            <text class="font-24">{{ pageData.shopList[0].name }}</text>
          </view>
          <view class="color-999 m-b-10 font-24"
            >地址：{{ pageData.shopList[0].address }}</view
          >
          <view class="color-999 font-24"
            >营业时间：{{ pageData.shopList[0].shop_time }}</view
          >
        </div>

        <div class="shop-length font-24 m-t-20">
          全部
          <text class="price-color font-w-700 font-30 m-x-10">{{
            pageData.shopList.length
          }}</text>
          家门店
        </div>
      </div>
    </div>

    <!-- 评价 -->
    <view id="comment">
      <GoodsComment :propsData="pageData.info"></GoodsComment>
    </view>

    <!-- 详情 -->
    <view id="detail">
      <GoodsDetail :goodsData="pageData.info"></GoodsDetail>
    </view>

    <GoodsFootNav
      @ok="submit"
      type="yuyue"
      goodsType="BOOK"
      :goods.sync="pageData.info"
    ></GoodsFootNav>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import AttrPopup from '@/components/goods/AttrPopup';
import GoodsDetail from '@/pages/goods/components/GoodsDetail';
import share from '@/mixins/share';

import GoodsBanner from '@/pages/goods/components/goods-banner.vue';
import GoodsTitleMsg from '@/pages/goods/components/goods-title-msg.vue';
import GoodsComment from '@/pages/goods/components/GoodsComment';
import GoodsFootNav from '@/pages/goods/components/GoodsFootNav.vue';
export default {
  components: {
    AttrPopup,
    GoodsDetail,
    GoodsBanner,
    GoodsTitleMsg,
    GoodsComment,
    GoodsFootNav,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      id: '',
      showShare: false,
    };
  },
  onLoad(params) {
    if (params.scene) {
      this.id = this.$utils.wxParams(params).gid;
    } else {
      this.id = params.id;
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.book.goodDetails({
        gid: this.id,
      });

      let pic_list = res.data.info.pic_list.map(item => {
        return { pic_url: item };
      });
      this.pageData = {
        ...res.data,
        info: {
          ...res.data.info,
          pic_list,
        },
      };
    },

    submit() {
      this.$refs['AttrPopup'].showPopup('buy');
    },
  },
  onShow() {},
  computed: {
    shareData() {
      return {
        title: this.pageData.info && this.pageData.info.name,
        path: `/book/details/details${uni.$u.queryParams({
          id: this.id,
          user_id: this.$store.getters['user/userInfo'].id || '',
          store_id: this.$store.getters['currentStore'].id || '',
          // #ifdef APP-PLUS
          _platform: 'app',
          // #endif
        })}`,
      };
    },
  },
  watch: {},
  onPageScroll({ scrollTop }) {
    this.$refs['GoodsTitleMsg'].scroll({ scrollTop });
  },

  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  .page-item {
    margin: 20rpx;
    border-radius: 30rpx;
    background: #fff;
    overflow: hidden;
  }
  /deep/.goods-attr {
    background: initial;
    padding: 0 20rpx;
    line-height: 90rpx;
    margin-top: 0;
  }
  .goods-msg {
    padding: 20rpx;
    background: #fff;

    .tips {
      display: flex;
      align-items: center;
      font-style: 26rpx;
      color: #666;
    }
  }

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
      }
    }
  }

  .bottom-fixed {
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));

    .fixed {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 100rpx;
      height: calc(100rpx + env(safe-area-inset-bottom));
      background: #fff;
      padding-bottom: env(safe-area-inset-bottom);

      display: flex;
      align-items: center;

      > view {
        height: 100%;
      }

      > .flex-col {
        width: 114rpx;

        &:nth-child(1) {
          border-right: 2rpx solid #eee;
        }
      }

      .right-bt {
        background: #fd4513;
        text-align: center;
        line-height: 100rpx;
        color: #fff;
      }
    }
  }
}
</style>
