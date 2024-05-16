<template>
  <div class="page-body flex-col">
    <DiyHead :shopData="shopData"></DiyHead>

    <view class="list flex-h-1 flex-col">
    

      <view  class="tbs flex-y-center flex-x-sa">
        <div
          @click="switchSort(1)"
          :class="sort == 1 && 'select-tab'"
          class="tab"
        >
          综合
        </div>
        <div
          @click="switchSort(2)"
          :class="sort == 2 && 'select-tab'"
          class="tab"
        >
          销量
        </div>
        <div
          @click="switchSort(3)"
          :class="sort == 3 && 'select-tab'"
          class="tab"
        >
          新品
        </div>
        <div @click="switchSort(4)" class="tab flex-y-center">
          <text>价格</text>
          <view class="m-l-10 flex-col flex-x-center flex-y-center">
            <text
              :class="sort == 4 && 'price-color'"
              class="iconfont icon-arrow-up-filling font-20"
            ></text>
            <text
              :class="sort == 5 && 'price-color'"
              class="iconfont icon-arrow-down-filling font-20"
            ></text>
          </view>
        </div>
      </view>

      <scroll-view
        v-if="goodsList.length"
        class="flex-h-1"
        scroll-y
        @scrolltolower="getShopData()"
      >
        <view class="p-x-20">
          <GoodsList :list="goodsList"></GoodsList>
          <u-loadmore :status="status"></u-loadmore>
        </view>
      </scroll-view>
      <u-empty v-else mode="data"></u-empty>
    </view>

    <ToHomeButton></ToHomeButton>

    <TabBar
      v-if="shopData"
      :params="{ tab:2, mch_id }"
      type="shopTabBar"
    ></TabBar>
  </div>
</template>

<script>
import DiyHead from '@/mch/shop/components/DiyHead.vue';

import TabBar from '@/components/TabBar';
import ToHomeButton from '@/components/ToHomeButton';
import GoodsList from '@/mch/shop/components/GoodsList';

export default {
  components: { DiyHead, ToHomeButton, TabBar, GoodsList },
  props: {},
  data() {
    return {
      mch_id: '',
      cat_id: '',
      page: 1,
      status: 'loadmore',
      shopData: '',
      goodsList: [],
      sort: 1,
    };
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(params) {
    this.mch_id = params.mch_id || '';
    this.tab = params.tab || '';
    this.cat_id = params.cat_id || '';

    this.getShopData();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  methods: {
    // 获取店铺数据
    async getShopData() {
      if (this.status == 'nomore') return;

      const formData = {
        mch_id: this.mch_id,
        tab: 2,
        page: this.page,
        sort: this.sort,
        cat_id: this.cat_id,
      };
      const res = await this.$requestAll.mch.indexShop(formData, true);

      if (this.goodsList.length) {
        this.goodsList.push(...res.data.goods_list);
      } else {
        this.goodsList = res.data.goods_list;
      }
      !this.shopData && (this.shopData = res.data);

      this.status = res.data.goods_list?.length < 20 ? 'nomore' : 'loadmore';
      this.page++;
    },

    // 筛选切换
    switchSort(sort) {
      if (sort < 4) {
        this.sort = sort;
      } else if (sort == 4 && this.sort == 4) {
        this.sort = 5;
      } else {
        this.sort = 4;
      }
      this.cat_id = '';
      this.resetData();
      this.getShopData();
    },

    // 重置数据
    resetData() {
      let {goodsList,  page, status } = this.$options.data();
      this.goodsList = goodsList
      this.page = page;
      this.status = status;
    },
  },
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style lang="scss" scoped>
.page-body {
  height: 100vh;
  // #ifdef H5
  height: calc(100vh - 44px);
  // #endif
  background: #f5f5f5;

  .list {
    .tbs {
      height: 100rpx;
      background: #fff;
      color: #666;
      > .tab {
        padding: 20rpx;
      }
      .select-tab {
        position: relative;
        color: red;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background: red;
        }
      }
    }
  }
}
</style>
