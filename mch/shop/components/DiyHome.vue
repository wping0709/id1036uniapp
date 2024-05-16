<template>
  <view class="diy-home">
    <template v-for="(item, index) in shopData.template">
      <DiySearch
        v-if="item.type == 'search'"
        :param="item.param"
        :templateList="[]"
        :key="index"
        :mch_id="shopData.shop && shopData.shop.id"
      ></DiySearch>

      <DiyNav
        v-if="item.type == 'nav'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :key="index"
        :mch_id="shopData.shop && shopData.shop.id"
      ></DiyNav>

      <DiyBanner
        v-if="item.type == 'banner'"
        :param="item.param"
        :key="index"
      ></DiyBanner>

      <!-- 通知 -->
      <DiyNotice
        class="diy-notice"
        v-if="item.type == 'notice'"
        :param="item.param"
        :key="index"
      ></DiyNotice>

      <!-- 关联链接 -->
      <DiyLink
        v-if="item.type == 'link'"
        :param="item.param"
        :key="index"
      ></DiyLink>

      <DiyRubik
        v-if="item.type == 'rubik'"
        :param="item.param"
        :key="index"
      ></DiyRubik>

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
      ></DiyGoods>

      <!-- 优惠券 -->
      <DiyCoupon
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        v-if="item.type == 'coupon'"
        :key="index"
      >
      </DiyCoupon>

      <!-- 倒计时 -->
      <DiyTime v-if="item.type == 'time'" :item="item" :key="index"></DiyTime>

      <!-- 商品秒杀组件 -->
      <DiyGoodsMiaosha
        v-if="item.type == 'miaosha'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsMiaosha>

      <!-- 商品预约组件 -->
      <DiyGoodsYuyue
        v-if="item.type == 'book'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsYuyue>

      <!-- 商品砍价组件 -->
      <DiyGoodsKanjia
        v-if="item.type == 'bargain'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :index="index"
        :key="index"
      ></DiyGoodsKanjia>

      <!-- 拼团 -->
      <DiyPinTuan
        v-if="item.type == 'pintuan'"
        :page_id="page_id"
        :_templateKey="index"
        :item="item"
        :key="index"
        :mch_id="shopData.shop && shopData.shop.id"
      >
      </DiyPinTuan>

      <DiyLine v-if="item.type == 'line'" :item="item" :key="index"></DiyLine>
    </template>
  </view>
</template>

<script>
import DiySearch from '@/pages/index/diy/DiySearch';
import DiyNav from '@/pages/index/diy/DiyNav';
import DiyBanner from '@/pages/index/diy/DiyBanner';
import DiyNotice from '@/pages/index/diy/DiyNotice';
import DiyLink from '@/pages/index/diy/DiyLink';
import DiyRubik from '@/pages/index/diy/DiyRubik';
import DiyVideo from '@/pages/index/diy/DiyVideo';
import DiyGoods from '@/pages/index/diy/DiyGoods';
import DiyCoupon from '@/pages/index/diy/DiyCoupon';
import DiyTime from '@/pages/index/diy/DiyTime';
import DiyGoodsMiaosha from '@/pages/index/diy/DiyGoodsMiaosha';
import DiyGoodsYuyue from '@/pages/index/diy/DiyGoodsYuyue';
import DiyGoodsKanjia from '@/pages/index/diy/DiyGoodsKanjia';
import DiyLine from '@/pages/index/diy/DiyLine';
import DiyPinTuan from '@/pages/index/diy/DiyPinTuan';

export default {
  components: {
    DiyNav,
    DiySearch,
    DiyBanner,
    DiyLink,
    DiyNotice,
    DiyRubik,
    DiyVideo,
    DiyGoods,
    DiyCoupon,
    DiyTime,
    DiyGoodsMiaosha,
    DiyGoodsYuyue,
    DiyGoodsKanjia,
    DiyLine,
    DiyPinTuan
  },
  props: {
    pageData: {
      default() {
        return {
          page_id: '',
        };
      },
    },
  },
  data() {
    return {
      shopData: '',
      page_id: '',
    };
  },
  methods: {},
  watch: {
    pageData: {
      handler(val, ovl) {
        this.shopData = val;
      },
      immediate: true,
    },
  },
};
</script>

<style></style>
