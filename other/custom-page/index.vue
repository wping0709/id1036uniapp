<template>
  <view class="home-box" v-if="template.length">
    <!-- 模板列表为空  && 已开启多城市 -->
    <DiyShopInfo
      v-if="
        !template.length &&
        pages_index_index.store &&
        pages_index_index.store.cyy_store_type
      "
      :param="defaultShopInfoData"
    ></DiyShopInfo>

    <!-- 没有shop_info组件 -->
    <WNavbar
      v-else-if="!template.some((item) => item.type == 'shop_info')"
      :title="pages_index_index.name"
    >
    </WNavbar>

    <template v-for="(item, index) in template">
      <!-- 选择门店 -->
      <DiyShopInfo
        v-if="item.type == 'shop_info'"
        :param="item.param"
        :key="index"
      ></DiyShopInfo>
      <DiynoteSearch
        :key="index"
        v-if="item.type == 'note_search'"
        :param="item.param"
      ></DiynoteSearch>
      <DiynoteTopic
        :key="index"
        v-if="item.type == 'note_topic'"
        @topic="topic"
        :param="item.param"
      ></DiynoteTopic>
      <DiynotePost
        :key="index"
        ref="DiynotePost"
        v-if="item.type == 'note_post'"
        :param="item.param"
        @jiaShow="gaiShow"
      ></DiynotePost>
      <DiySearch
        v-if="item.type == 'search'"
        :param="item.param"
        :templateList="template"
        :key="index"
      ></DiySearch>
      <DiyNav
        v-if="item.type == 'nav'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :key="index"
      ></DiyNav>
      <DiyBanner
        v-if="item.type == 'banner'"
        :param="item.param"
        :key="index"
      ></DiyBanner>

      <DiyFastNav
        v-if="item.type == 'fast_nav'"
        :param="item.param"
        :key="index"
      ></DiyFastNav>

      <DiyPlate
        v-if="item.type == 'plate'"
        :param="item.param"
        :key="index"
      ></DiyPlate>

      <!-- 通知提示 -->
      <DiyTopic
        class="topic"
        v-if="item.type == 'topic'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :key="index"
      >
      </DiyTopic>

      <DiyIndexRecommend
        v-if="item.type == 'index_recommend'"
        :param="item.param"
        :key="index"
      ></DiyIndexRecommend>

      <DiySuperBrand
        v-if="item.type == 'super_brand'"
        :param="item.param"
        :key="index"
      ></DiySuperBrand>

      <DiyRecommendGoods
        ref="DiyRecommendGoods"
        v-if="item.type == 'recommend_goods'"
        :item="item"
        :_templateKey="index"
        :page_id="page_id"
        :templateList="template"
        :key="index"
      ></DiyRecommendGoods>

      <DiyNearbyMch
        v-if="item.type == 'nearby_mch'"
        :param="item.param"
        :key="index"
      ></DiyNearbyMch>

      <!-- 通知 -->
      <DiyNotice
        class="diy-notice"
        v-if="item.type == 'notice'"
        :param="item.param"
        :key="index"
      ></DiyNotice>

      <!-- 视频组件 -->
      <DiyVideo
        v-if="item.type == 'video'"
        :param="item.param"
        :key="index"
      ></DiyVideo>

      <!-- 商品组件 -->
      <DiyGoods
        v-if="item.type == 'goods'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      >
      </DiyGoods>

      <!-- 商品预约组件 -->
      <DiyGoodsYuyue
        v-if="item.type == 'book'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsYuyue>

      <!-- 商品秒杀组件 -->
      <DiyGoodsMiaosha
        v-if="item.type == 'miaosha'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsMiaosha>

      <!-- 商品砍价组件 -->
      <DiyGoodsKanjia
        v-if="item.type == 'bargain'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsKanjia>

      <!-- 商品积分商城组件 -->
      <DiyGoodsIntegral
        v-if="item.type == 'integral'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsIntegral>

      <!-- 商品抽奖组件 -->
      <DiyGoodsChoujiang
        v-if="item.type == 'lottery'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsChoujiang>

      <!-- 整点秒杀 -->
      <DiyMiaosha
        v-if="item.type == 'hourly_miaosha'"
        :param="item.param"
        :key="index"
      ></DiyMiaosha>

      <!-- 关联链接 -->
      <DiyLink
        v-if="item.type == 'link'"
        :param="item.param"
        :key="index"
      ></DiyLink>

      <!-- 附近店铺 -->
      <DiyShop
        v-if="item.type == 'shop'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        class="diy-shop"
        :key="index"
      >
      </DiyShop>

      <!-- 优惠券 -->
      <DiyCoupon
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        v-if="item.type == 'coupon'"
        :key="index"
      ></DiyCoupon>

      <!-- 倒计时 -->
      <DiyTime v-if="item.type == 'time'" :item="item" :key="index"></DiyTime>

      <!-- 拼团 -->
      <DiyPinTuan
        v-if="item.type == 'pintuan'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :key="index"
      >
      </DiyPinTuan>

      <!-- 好店推荐 -->
      <DiyMch v-if="item.type == 'mch'" :item="item" :key="index"></DiyMch>

      <DiyRubik
        v-if="item.type == 'rubik'"
        :param="item.param"
        :key="index"
      ></DiyRubik>

      <DiyLine v-if="item.type == 'line'" :item="item" :key="index"></DiyLine>

      <!-- 弹框广告 -->
      <DiyModal
        v-if="item.type == 'modal'"
        :item="item"
        :key="index"
      ></DiyModal>

      <!-- 粘性定位 -->
      <DiyFloat
        v-if="item.type == 'float'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :key="index"
      ></DiyFloat>

      <!-- 文本组件 -->
      <DiyText
        v-if="item.type == 'text'"
        :param="item.param"
        :key="index"
      ></DiyText>

      <!-- 单品轮播 -->
      <DiyOneSwiper
        v-if="item.type == 'single_carousel'"
        :param="item.param"
        :key="index"
      ></DiyOneSwiper>

      <!-- 选项卡轮播 -->
      <DiyTabSwiper
        v-if="item.type == 'tab_carousel'"
        :param="item.param"
        :key="index"
      ></DiyTabSwiper>
    </template>
    <!-- 快捷导航 -->
    <DiyQuickNav></DiyQuickNav>
    <!-- <TabBar></TabBar> -->

    <QOfficialAccount></QOfficialAccount>

    <TabBar  v-if="showTabBar"></TabBar>
  </view>
</template>

<script>
import TabBar from "@/components/TabBar";
import DiySearch from "@/pages/index/diy/DiySearch";
import DiyNav from "@/pages/index/diy/DiyNav";
import DiyBanner from "@/pages/index/diy/DiyBanner";
import DiyFastNav from "@/pages/index/diy/DiyFastNav";
import DiyPlate from "@/pages/index/diy/DiyPlate";
import DiyTopic from "@/pages/index/diy/DiyTopic";
import DiyMiaosha from "@/pages/index/diy/DiyMiaosha";
import DiyIndexRecommend from "@/pages/index/diy/DiyIndexRecommend";
import DiyRecommendGoods from "@/pages/index/diy/DiyRecommendGoods";
import DiySuperBrand from "@/pages/index/diy/DiySuperBrand";
import DiyShopInfo from "@/pages/index/diy/DiyShopInfo";
import DiyNearbyMch from "@/pages/index/diy/DiyNearbyMch";
import DiyNotice from "@/pages/index/diy/DiyNotice";
import DiyVideo from "@/pages/index/diy/DiyVideo";
import DiyGoods from "@/pages/index/diy/DiyGoods";
import DiyLink from "@/pages/index/diy/DiyLink";
import DiyShop from "@/pages/index/diy/DiyShop";
import DiyCoupon from "@/pages/index/diy/DiyCoupon";
import DiyTime from "@/pages/index/diy/DiyTime";
import DiyPinTuan from "@/pages/index/diy/DiyPinTuan";
import DiyMch from "@/pages/index/diy/DiyMch";
import DiyRubik from "@/pages/index/diy/DiyRubik";
import DiyGoodsYuyue from "@/pages/index/diy/DiyGoodsYuyue";
import DiyGoodsMiaosha from "@/pages/index/diy/DiyGoodsMiaosha";
import DiyGoodsKanjia from "@/pages/index/diy/DiyGoodsKanjia";
import DiyGoodsIntegral from "@/pages/index/diy/DiyGoodsIntegral";
import DiyGoodsChoujiang from "@/pages/index/diy/DiyGoodsChoujiang";
import DiyLine from "@/pages/index/diy/DiyLine";
import DiyModal from "@/pages/index/diy/DiyModal";
import DiyFloat from "@/pages/index/diy/DiyFloat";
import DiyQuickNav from "@/pages/index/diy/DiyQuickNav";
import DiyText from "@/pages/index/diy/DiyText";
import DiyOneSwiper from "@/pages/index/diy/DiyOneSwiper";
import DiyTabSwiper from "@/pages/index/diy/DiyTabSwiper";
import DiynoteSearch from "@/pages/index/diy/DiynoteSearch.vue";
import DiynoteTopic from "@/pages/index/diy/DiynoteTopic.vue";
import DiynotePost from "@/pages/index/diy/DiynotePost.vue";
import WNavbar from "@/components/w-navbar/index";

import share from "@/mixins/share.js";
export default {
  mixins: [share],
  components: {
    DiySearch,
    DiyNav,
    TabBar,
    DiyBanner,
    DiyFastNav,
    DiyPlate,
    DiyTopic,
    DiyMiaosha,
    DiyIndexRecommend,
    DiyRecommendGoods,
    DiySuperBrand,
    DiyShopInfo,
    DiyNearbyMch,
    DiyNotice,
    DiyVideo,
    DiyGoods,
    DiyLink,
    DiyShop,
    DiyCoupon,
    DiyTime,
    DiyPinTuan,
    DiyMch,
    DiyRubik,
    DiyGoodsYuyue,
    DiyGoodsMiaosha,
    DiyGoodsKanjia,
    DiyGoodsIntegral,
    DiyGoodsChoujiang,
    DiyLine,
    DiyModal,
    DiyFloat,
    DiyQuickNav,
    DiyText,
    DiyOneSwiper,
    DiyTabSwiper,
    WNavbar,
    DiynoteSearch,
    DiynoteTopic,
    DiynotePost,
  },
  data() {
    return {
      pages_index_index: {},
      template: [],
      // page_id: 82,
      page_id: -1,
      page_data: [],
    };
  },

  onLoad(param) {
    this.page_id = param.page_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.home.getPage(
        {
          page_id: this.page_id,
        },
        true
      );

      // uni.setNavigationBarTitle({ title: res.data.name });

      this.pages_index_index = res.data;
      this.template = res.data.template;
    },
    topic() {
      console.log("触发了");
      uni.navigateBack({
        delta: -1,
      });
    },
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.loadData();
    uni.stopPullDownRefresh();
  },
  onReachBottom() {
    // 推荐商品模块触底加载更多商品
    if (this.template.some((item) => item.type == "recommend_goods")) {
		  this.$refs.DiyRecommendGoods && this.$refs.DiyRecommendGoods[0].moreRecommendGoods();
    }
    if (this.template.some((item) => item.type == "note_post")) {
      this.$refs["DiynotePost"][0].huoqu();
    }
  },
  computed: {
    store() {
      return this.$store.getters["SHOP_CONFIG"].store;
    },
    SHOP_CONFIG() {
      return this.$store.getters["SHOP_CONFIG"];
    },
    shareData() {
      return {
        title: this.pages_index_index.name,
        path:
          "/other/custom-page/index" +
          uni.$u.queryParams({
            page_id: this.page_id,
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
      };
    },
    showTabBar() {
      let tabBarData = this.$store.getters["tabBarData"];
      if (tabBarData) {
        let { navs } = tabBarData;
        return navs.some(
          (item) =>
            item.new_url == `/other/custom-page/index?page_id=${this.page_id}`
        );
      }

      return false
    },
  },
};
</script>

<style lang="scss" scoped>
.home-box {
  // 横向滚动组件样式
  /deep/.u-scroll-list {
    padding-bottom: 10rpx;

    .u-scroll-list__indicator {
      margin-top: 10rpx;
    }
  }

  // 五角星组件样式
  .diy-shop {
    /deep/.uicon-star-fill {
      color: #f00 !important;
    }
  }

  .topic {
    /deep/.u-icon__img {
      width: 54rpx !important;
      height: 28rpx !important;
    }
  }

  /deep/.u-count-down__text {
    color: inherit !important;
    font-size: inherit !important;
  }

  background: #f5f5f5;
  min-height: 100vh;
}
</style>
