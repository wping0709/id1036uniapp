<template>
  <view v-if="goodsData.id" class="goods-box">
	  <!-- #ifdef H5 -->
	   <!-- <view class="diy_header">
	   	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	   </view> -->
	  <!-- #endif -->
	 
    <!-- swiper -->
    <view class="swiper-box" id="goods">
      <GoodsBanner
        :list="goodsData.pic_list"
        :goodsData="goodsData"
      ></GoodsBanner>
    </view>

    <!-- 商品信息,  标题,价格,销量,七天无理由标签 -->

    <!-- 头部信息 -->
    <GoodsTitleMsg
      :goodsData.sync="goodsData"
      type="goods"
      ref="GoodsTitleMsg"
    ></GoodsTitleMsg>
    <GoodsEvaluation
      :goodsData="goodsData.comment_list"
      :goods_id="goodsData.id"
      v-if="goodsData.comment_list && goodsData.comment_list.length != 0 && store.is_comment"
    ></GoodsEvaluation>
    <!-- 选择规格 -->
    <view class="page-item">
      <AttrPopup
        :showText="goodsData.min_price != '价格面议'"
        :goodsId="goodsId"
        ref="AttrPopup"
        type="goods"
      ></AttrPopup>

      <view
        v-if="goodsData.brand_name"
        class="flex-y-center p-20 font-26"
        style="line-height: 50rpx"
      >
        <view class="color-999" style="margin-right: 30rpx">品牌</view>
        <view>{{ goodsData.brand_name }}</view>
      </view>
      <view
        class="goods-attr flex-y-center flex-x-sb"
        v-for="(item, index) of goodsData.attr_list"
        :key="index"
      >
        <view class="color-999" style="margin-right: 30rpx; display: flex">{{
          item.name
        }}</view>
        <view>{{ item.value }}</view>
      </view>

      <view
        class="flex flex-wrap p-20 font-26 color-999"
        style="background: #fbfcfb; border-radius: 0 0 20rpx 20rpx"
        v-if="goodsData.service_list.length"
      >
        <div
          class="flex-y-center m-r-10"
          style="line-height: 50rpx"
          v-for="(item, i) in goodsData.service_list"
          :key="i"
        >
          <i
            class="iconfont icon-success font-40"
            style="width: 50rpx; height: 50rpx; color: #00b853"
          ></i>
          <text>{{ item }}</text>
        </div>
      </view>
    </view>

    <!-- 满减赠品 -->
    <view v-if="goodsData.give_list.length" class="page-item">
      <GiveGoods :goodsData="goodsData.give_list"></GiveGoods>
    </view>

    <!-- 图片魔方 -->
    <template v-for="(block,i) in goodsData.home_block">
      <GoodsRubik :block="block" :key="i"></GoodsRubik>
    </template>

    <GoodsMch :mchData="goodsData.mch"></GoodsMch>

    <!-- 商品详情 商品简介 -->
    <view id="comment">
      <!-- 评价 -->
      <GoodsComment :propsData="goodsData"></GoodsComment>
    </view>

    <view id="detail">
      <GoodsDetail :goodsData="goodsData"></GoodsDetail>
    </view>

    <!-- 商品推荐 -->
    <view id="recommended">
      <GoodsRecommended
        v-if="store.is_recommend"
        ref="GoodsRecommended"
        :goodsData="goodsData"
      ></GoodsRecommended>
    </view>

    <!-- 立即购买组件 -->
    <GoodsFootNav
      @ok="submit"
      :type="goodsData.is_negotiable ? 'goods-mianyi' : 'goods'"
      :goods.sync="goodsData"
      :room_id="room_id"
    >
    </GoodsFootNav>

    <!-- 页面导航 -->
    <div class="sticky" v-if="showNavBar">
      <view
        :class="[checkNavBar == 'goods' && 'check']"
        @click="onScrollTo('goods')"
        >商品</view
      >
      <view
        v-if="store.is_comment == 1"
        :class="[checkNavBar == 'comment' && 'check']"
        @click="onScrollTo('comment')"
        >评价</view
      >
      <view
        :class="[checkNavBar == 'detail' && 'check']"
        @click="onScrollTo('detail')"
        >详情</view
      >
      <view
        v-if="store.is_recommend"
        :class="[checkNavBar == 'recommended' && 'check']"
        @click="onScrollTo('recommended')"
        >推荐</view
      >
    </div>

    <QOfficialAccount></QOfficialAccount>
  </view>
  <u-loading-page v-else loading loading-mode="spinner" iconSize="60px"></u-loading-page>

</template>

<script>
import GoodsBanner from './components/goods-banner.vue';
import GoodsTitleMsg from './components/goods-title-msg';
import GoodsCoupon from './components/goods-coupon';
import GoodsEvaluation from './components/goodsEvaluation';
import GoodsRecommended from './components/GoodsRecommended';
import GoodsDetail from './components/GoodsDetail';
import GoodsFootNav from './components/GoodsFootNav';
import GoodsComment from './components/GoodsComment';
import GoodsMch from './components/goods-mch';
import GoodsRubik from './components/goods-rubik'

import AttrPopup from '@/components/goods/AttrPopup';
import GiveGoods from '@/components/goods/GiveGoods';
import share from '@/mixins/share.js';
export default {
  components: {
    GoodsBanner,
    GoodsTitleMsg,
    AttrPopup,
    GoodsCoupon,
    GoodsRecommended,
    GoodsDetail,
    GoodsFootNav,
    GiveGoods,
    GoodsComment,
    GoodsMch,
    GoodsEvaluation,
    GoodsRubik
  },
  mixins: [share],
  data() {
    return {
      liulanData: '', //浏览记录数据
      goodsData: '', //商品数据
      scrollTop: 0,
      showNavBar: false,
      checkNavBar: 'goods',
      topAll: {
        goods: 0,
        detail: 0,
        comment: 0,
        recommended: 0,
      },
      goodsId: '',
      activity_id: null,
      room_id: '',
    };
  },
  onLoad(params) {
    this.room_id = params.room_id || '';
    this.goodsId = params.id || '';
    if (params.activity_id == undefined || params.activity_id == null) {
      // 获取商品详情
      this.getGoodsDetail();
      // 获取浏览记录
      this.getBrowse();
    } else {
      this.activity_id = params.activity_id;
      this.getGoodsDetailTwo();
    }
    this.$store.dispatch('goodsBrowseLog', this.goodsId);
  },
  methods: {
    // 点击立即购买
    submit(type) {
      this.$refs['AttrPopup'].showPopup(type);
    },
    // 浏览记录
    async getBrowse() {
      const res = await this.$requestAll.goods.getBrowse({
        id: this.goodsId,
        type: 0,
      });
      this.liulanData = res.data;
    },
    // 获取商品详情
    async getGoodsDetail() {
      const res = await this.$requestAll.goods.getGoodsDetail({
        id: this.goodsId,
      });
      this.goodsData = res.data;
      // console.log()
      console.log(res, '89898989898989');
    },
    // 获取商品详情
    async getGoodsDetailTwo() {
      const res = await this.$requestAll.goods.getGoodsDetail({
        id: this.goodsId,
        activity_id: this.activity_id,
      });
      this.goodsData = res.data;
      console.log(res, '89898989898989');
    },
    // 滚动指定位置
    async onScrollTo(key) {
      let dom = await this.$uGetRect(`#${key}`);
      // console.log(dom);
      // 跳转指定位置
      uni.pageScrollTo({ scrollTop: dom.top + this.scrollTop, duration: 0 });
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
  computed: {
    shareData() {
      return {
        title: this.goodsData.goods_share_title || this.goodsData.name,
        imageUrl: this.goodsData.goods_share_logo || this.goodsData.cover_pic,
        desc: this.goodsData.goods_share_desc,
        path:
          '/pages/goods/goods' +
          uni.$u.queryParams({
            id: this.goodsId,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
  },
  async onPageScroll({ scrollTop }) {
    this.$u.debounce(async () => {
      this.scrollTop = scrollTop - 44;

      this.$refs['GoodsTitleMsg'].scroll({ scrollTop });

      this.showNavBar = scrollTop >= 200;
      // 获取跳转top
      for (const key in this.topAll) {
        console.log(key, ' key');
        let dom = await this.$uGetRect(`#${key}`);
        console.log(dom);
        this.topAll[key] = dom.top;
      }
      console.log(this.topAll, 'topAll');

      // 给与跳转选中状态
      if (50 >= this.topAll.goods && 50 < this.topAll.comment) {
        this.checkNavBar = 'goods';
      } else if (50 >= this.topAll.comment && 50 < this.topAll.detail) {
        this.checkNavBar = 'comment';
      } else if (50 >= this.topAll.detail && 50 < this.topAll.recommended) {
        this.checkNavBar = 'detail';
      } else {
        this.checkNavBar = 'recommended';
      }
    });
  },
  onReachBottom(e) {
    this.$refs['GoodsRecommended'].getGoodsRecommend();
  },
};
</script>

<style lang="scss" scoped>
.sticky {
  position: fixed;
  top: 0;
  /* #ifdef H5 */
  top: 44px;
  /* #endif */
  left: 0;
  right: 0;
  z-index: 995;
  line-height: 80rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .check {
    position: relative;
    font-weight: 700;
    &::before {
      content: '';
      position: absolute;
      bottom: 10rpx;
      left: 50%;
      transform: translateX(-50%);
      height: 4rpx;
      width: 40rpx;
      border-radius: 2rpx;
      background: red;
    }
  }
}

.goods-box {
  position: relative;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
  .diy_header{
	  padding: 25rpx;
  }
  .page-item {
    margin: 20rpx;
    border-radius: 30rpx;
    background: #fff;
    overflow: hidden;
    .goods_guige {
      display: flex;
      justify-content: space-around;
    }
  }

  /deep/.goods-attr {
    background: initial;
    padding: 0 20rpx;
    line-height: 90rpx;
    margin-top: 0;
  }

  /deep/.give-box {
    margin: 0;
  }
}

.mch-box {
  padding: 30rpx 24rpx;
  .mch-name {
    line-height: 36rpx;
    font-size: 26rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
  }
  > image {
    width: 100rpx;
    height: 100rpx;
    background: #ffffff;
    border: 2rpx solid #f6f6f6;
    opacity: 1;
    border-radius: 8rpx;
  }

  .to-shophome {
    width: 168rpx;
    line-height: 60rpx;
    text-align: center;
    background: #ffffff;
    border: 2rpx solid #9b9b9b;
    opacity: 1;
    border-radius: 120rpx;
    font-size: 24rpx;
  }
}
</style>
