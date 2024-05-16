<template>
  <view v-if="pageData" class="body">
    <!-- swiper -->
    <view class="swiper-box">
      <u-swiper
        :list="pageData.goods.goods_pic_list"
        keyName="pic_url"
        radius="0"
        indicatorMode="dot"
        indicator
        circular
        height="375"
        :autoplay="false"
        indicatorActiveColor="#ff5c5c"
        indicatorInactiveColor="#f5f5f5"
      ></u-swiper>
    </view>

    <!-- 商品信息,  标题,价格,销量,七天无理由标签 -->
    <GoodsTitleMsg :goodsData="pageData.goods" type="integral"></GoodsTitleMsg>

    <!-- 选择规格 -->
    <AttrPopup
      ref="AttrPopup"
      type="integral"
      :goodsId="params.id"
      :integral="params.integral"
      showText
    ></AttrPopup>

    <!-- 商品详情 商品简介 -->
    <view class="bg-fff m-y-20 p-y-20">
      <GoodsDetail :goodsData="pageData.goods"></GoodsDetail>
    </view>
    <view class="bottom-bts">
      <view class="flex-y-center">
        <view
          @click="$utils.toUrl('/pages/index/index')"
          class="flex-col flex-y-center flex-x-center"
        >
          <image
            :src="wxapp_img.home"
            mode="aspectFill"
            style="width: 50rpx; height: 50rpx"
          />
          <text class="m-t-10 font-22">首页</text>
        </view>
        <view class="flex-w-1" @click="submit">立即兑换</view>
      </view>
    </view>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import GoodsTitleMsg from '@/pages/goods/components/goods-title-msg';
import GoodsDetail from '@/pages/goods/components/GoodsDetail';
import AttrPopup from '@/components/goods/AttrPopup';
import share from '@/mixins/share.js'
export default {
  mixins: [share],
  components: {
    GoodsTitleMsg,
    GoodsDetail,
    AttrPopup,
  },
  data() {
    return {
      pageData: '',
      params: {},
      selectAttr: '',
    };
  },
  onLoad(params) {
     if (params.goods_id) params.id = params.goods_id;
    this.params = params;
    this.loadData();
  },
  methods: {
    async loadData() {
     
      const res = await this.$requestAll.integralmall.goodsInfo(this.params);
      this.pageData = res.data;
    },
    submit() {
      this.$refs['AttrPopup'].showPopup('buy');
    },
  },
  onShow() {},
  computed: {
     shareData() {
      return {
        title:this.pageData && this.pageData.goods.name || '商品详情',
        imageUrl: this.pageData && this.pageData.goods.cover_pic || '',
        path:
          '/integral-mall/goods-info/index' +
          uni.$u.queryParams({
            ...this.params,
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
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
}
.bottom-bts {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  > view {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    text-align: center;
    // line-height: 100rpx;
    background: #fff;
    > view:nth-child(1) {
      width: 200rpx;
    }
    > view:nth-child(2) {
      background: #ff4544;
      line-height: 100rpx;
      color: #fff;
      font-size: 32rpx;
    }
  }
}
</style>
