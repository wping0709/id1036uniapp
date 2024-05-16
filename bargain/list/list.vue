<template>
  <view v-if="pageData" class="body">
    <view class="page-title">
      <swiper
        class="title-swiper"
        :indicator-dots="true"
        :autoplay="true"
        circular
      >
        <swiper-item v-for="(item, index) in pageData.banner_list" :key="index">
          <view class="swiper-item uni-bg-red">
            <image
              @click="$utils.toUrl(item.page_url)"
              :src="item.pic_url"
              mode="aspectFill"
            />
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view scroll-y class="content">
      <view
        @click="$utils.toUrl('/bargain/goods/goods?goods_id=' + goods.goods_id)"
        class="m-x-24 m-b-24"
        v-for="(goods, i) in pageData.goods_list"
        :key="i"
      >
        <Goods :goods="goods"></Goods>
      </view>
      <u-loadmore status="nomore"></u-loadmore>
      <view class="env-bottom"></view>

      <BottomBar></BottomBar>
    </view>
  </view>
</template>
<script>
import Goods from './components/goods.vue';
import BottomBar from './components/BottomBar.vue';
export default {
  components: {
    Goods,
    BottomBar,
  },
  data() {
    return {
      pageData: '',
      mch_id: 0
    };
  },
  onLoad(params) {
    if(params.mch_id) this.mch_id = params.mch_id
    this.loadData();
  },
  methods: {
    SETTITLE() {
      console.log('不设置顶部标题样式');
    },
    async loadData() {
      const res = await this.$requestAll.bargain.index(
        {
          mch_id: this.mch_id
        },
        true
      );
      this.pageData = res.data;
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding-top: 24rpx;

  .page-title {
    padding-bottom: 24rpx;
    .title-swiper {
      margin-top: 18rpx;
      height: 240rpx;
      border-radius: 20rpx;
      margin: 0 24rpx;
      overflow: hidden;

      .swiper-item {
        height: 100%;

        > image {
          width: 100%;
          height: 100%;
          border-radius: 20rpx;
        }
      }
    }
  }
}
</style>
