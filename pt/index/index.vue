<template>
  <view v-if="pageData" class="body">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <!-- 搜索栏 -->
    <view class="body-search">
      <!-- fixed -->
      <view class="page-title">
        <!-- 搜素背景dom -->
        <div
          @click="$utils.toUrl('/pt/search/search')"
          class="search flex-y-center"
        >
          <text class="iconfont icon-sousuo m-l-24 m-r-10"></text>
          <text class="font-26">请输入商品名称搜索</text>

          <div class="search-bt">搜索</div>
        </div>
      </view>
    </view>

    <!-- 轮播图 -->
    <swiper class="title-swiper" circular :indicator-dots="true">
      <swiper-item v-for="(item, i) in pageData.banner" :key="i">
        <image
          @click="$utils.toUrl(item.page_url,item.open_type)"
          :src="item.pic_url"
          mode="aspectFill"
          style="width: 100%; height: 100%"
        />
      </swiper-item>
    </swiper>

    <!-- 分类列表 -->
    <scroll-view scroll-x class="scroll-view">
      <div class="scroll-box">
        <view
          @click="switchTab('')"
          :class="['tab-item', '' == cid && 'select-tab']"
          >热销</view
        >
        <view
          v-for="(item, i) in pageData.cat"
          :key="i"
          @click="switchTab(item.id)"
          :class="['tab-item', item.id == cid && 'select-tab']"
        >
          {{ item.name }}
        </view>
      </div>
    </scroll-view>

    <!-- 商品列表 -->
    <view
      @click="$utils.toUrl('/pt/details/details?gid=' + goods.id)"
      v-for="(goods, i) in goodsList"
      :key="i"
      class="m-t-10"
    >
      <Goods :goods="goods"></Goods>
      <view v-if="i < goodsList.length - 1" class="line"></view>
    </view>
    <u-loadmore status="nomore"></u-loadmore>

    <view class="env-bottom"></view>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import Goods from './components/goods-item.vue';
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  components: {
    Goods,
  },
  data() {
    return {
      pageData: '',
      goodsList: [],
      page: 1,
      status: 'loadmore',
      cid: '',
      mch_id: '',
    };
  },
  onLoad(params) {
    this.cid = params.cid || '';
    this.mch_id = params.mch_id || '';
    this.loadData();
  },
  methods: {
    SETTITLE() {
      console.log('不设置顶部标题样式');
    },
    async loadData() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.group.index(
        {
          mch_id: 0,
          page: this.page,
          cid: this.cid,
          mch_id: this.mch_id,
        },
        true
      );
      this.pageData = res.data;
      this.goodsList.push(...res.data.goods.list);
      this.page++;  
      this.status =
        this.goodsList.length >= res.data.goods.row_count
          ? 'nomore'
          : 'loadmore';
    },
    switchTab(v) {
      console.log(v);
      this.cid = v;
      this.resetPageData();
      this.loadData();
    },
    resetPageData() {
      this.goodsList = [];
      this.status = 'loadmore';
      this.page = 1;
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
  onShow() {},
  computed: {
    shareData() {
      return {
        title: '拼团',
        path:
          '/pt/index/index' +
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
  watch: {},
  onReachBottom() {
    this.loadData();
  },
};
</script>
<style lang="scss" scoped>
.line {
  height: 1px;
  width: 490rpx;
  background: #f8f8f8;
  // background: red;
  margin-left: auto;
  margin-right: 24rpx;
}
.body {
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  .diy_header{
	padding: 25rpx;
	background-color: #ffffff;
}
  /* #endif */
  .body-search {
    height: 100rpx;
  }

  .page-title {
    position: fixed;
    top: 0;
    /* #ifndef H5 */
    top: 44px;
    /* #endif */
    left: 0;
    right: 0;
    z-index: 99;
    height: 100rpx;
    background: #fff;

    .search {
      margin: 18rpx 24rpx;
      background: #f8f8f8;
      height: 64rpx;
      line-height: 64rpx;
      border-radius: 64rpx;
      height: 64rpx;
      color: #999;

      .search-bt {
        margin-left: auto;
        margin-right: 4rpx;
        width: 96rpx;
        height: 56rpx;
        line-height: 56rpx;
        background: #fb312c;
        opacity: 1;
        border-radius: 1200rpx;

        text-align: center;
        font-size: 24rpx;
        color: rgba(255, 255, 255, 0.94);
      }
    }
  }

  .title-swiper {
    height: 240rpx;
    border-radius: 20rpx;
    margin: 0 24rpx;
    overflow: hidden;

    image {
      border-radius: 20rpx;
    }
  }

  .scroll-view {
    position: sticky;
    top: 100rpx;

    /* #ifdef H5 */
    top: calc(100rpx + 44px);
    /* #endif */
    left: 0;

    z-index: 98;
    margin-top: 24rpx;

    padding-left: 19rpx;
    box-sizing: border-box;
    background: #fff;

    .scroll-box {
      white-space: nowrap;
      padding-bottom: 24rpx;

      .tab-item {
        display: inline-block;
        padding: 0 16rpx;
        height: 54rpx;
        line-height: 54rpx;
        background: #fff;
        border-radius: 10rpx;
        margin-right: 12rpx;

        font-size: 24rpx;
        color: rgba(51, 51, 51, 0.94);
      }

      .select-tab {
        position: relative;
        background: #ffddd9;
        font-weight: 600;
        color: #ff1b22;
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 98%;
          transform: translateX(-50%);
          border: 10rpx solid #ffddd9;
          // border: 10rpx solid blue;
          border-right-color: transparent;
          border-left-color: transparent;
          border-bottom-color: transparent;
        }
      }
    }
  }
}
</style>
