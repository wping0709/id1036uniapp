<template>
  <view v-if="goodsData" class="goods-box">
    <GoodsBanner
      :list="goodsData.pic_list"
      :goodsData="goodsData"
    ></GoodsBanner>

    <!-- <MiaoshaBar :goodsData="goodsData"></MiaoshaBar> -->

    <!-- 商品信息,  标题,价格,销量,七天无理由标签 -->
    <GoodsTitleMsg
      ref="GoodsTitleMsg"
      :goodsData="{ ...goodsData, goods_id: goodsId }"
      type="miaosha"
    ></GoodsTitleMsg>

    <!-- 选择规格 -->
    <view
      style="
        margin: 20rpx;
        border-radius: 30rpx;
        background: #fff;
        overflow: hidden;
      "
    >
      <AttrPopup
        :showText="true"
        :goodsId="goodsId"
        ref="AttrPopup"
        type="miaosha"
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
        class="flex flex-wrap p-20 font-26"
        style="background: #fbfcfb; border-radius: 0 0 20rpx 20rpx"
      >
        <div
          class="flex-y-center m-r-10 color-666"
          style="line-height: 50rpx"
          v-for="(item, i) in goodsData.service_list"
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

    <GoodsMch :mchData="goodsData.mch"></GoodsMch>

    <GoodsComment :propsData="goodsData" type="miaosha"></GoodsComment>

    <!-- 商品详情 商品简介 -->
    <GoodsDetail :goodsData="goodsData" type="miaosha"></GoodsDetail>

    <!-- 立即购买组件 -->
    <GoodsFootNav @ok="submit" type="miaosha" :goods="goodsData" goodsType="MIAOSHA"></GoodsFootNav>
    <QOfficialAccount></QOfficialAccount>

  </view>
</template>

<script>
import GoodsTitleMsg from '@/pages/goods/components/goods-title-msg';
import AttrPopup from '@/components/goods/AttrPopup';
import GoodsDetail from '@/pages/goods/components/GoodsDetail';
import GoodsFootNav from '@/pages/goods/components/GoodsFootNav';
import GoodsBanner from '@/pages/goods/components/goods-banner.vue';
import GoodsComment from '@/pages/goods/components/GoodsComment';
import GoodsMch from '@/pages/goods/components/goods-mch'

import share from '@/mixins/share';
export default {
  components: {
    GoodsTitleMsg,
    AttrPopup,
    GoodsDetail,
    GoodsFootNav,
    GoodsBanner,
    GoodsComment,
    GoodsMch
  },
  mixins: [share],
  data() {
    return {
      goodsId: '', //商品id
      liulanData: '', //浏览记录数据
      goodsData: '', //商品数据
    };
  },
  onLoad(params) {
    if (params.scene) {
      let str = decodeURIComponent(params.scene);
      str
        .split(',')
        .map(item => {
          return item.split(':');
        })
        .forEach(item => {
          switch (item[0]) {
            case 'uid':
              params.user_id = item[1];
              break;
            case 'store':
              params.store_id = item[1];
              break;

            default:
              if (uni.$u.page() == '/pages/goods/goods' && item[0] == 'gid') {
                params.id = item[1];
              } else {
                params[item[0]] = item[1];
              }
              break;
          }
        });
    }
    console.log(params);
    this.goodsId = params.id || params.gid;
    // 获取商品详情
    this.getGoodsDetail();
    // 获取浏览记录
    this.getBrowse();
  },
  methods: {
    // 点击立即购买
    submit(type) {
      const time = new Date().getTime();
      if (this.goodsData.miaosha.begin_time * 1000 >= time)
        return uni.$u.toast('活动未开始');
      if (time >= this.goodsData.miaosha.end_time * 1000)
        return uni.$u.toast('活动已结束');
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
      const res = await this.$requestAll.miaosha.details({
        id: this.goodsId,
        scene_type: 0,
      });
      this.goodsData = res.data;
    },
  },
  computed: {
    shareData() {
      return {
        title: this.goodsData && this.goodsData.name,
        path:
          '/miaosha/details/details' +
          uni.$u.queryParams({
            id: this.goodsId,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id:
              this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  onPageScroll({ scrollTop }) {
    this.$refs['GoodsTitleMsg'].scroll({ scrollTop });
  },
};
</script>

<style lang="scss" scoped>
.goods-box {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
