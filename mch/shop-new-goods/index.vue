<template>
  <div class="page-body flex-col">
    <DiyHead :shopData="shopData"></DiyHead>

    <view class="list flex-h-1 flex-col">
      <scroll-view v-if="goodsList.length" class="flex-h-1" scroll-y @scrolltolower="getShopData()">
        <view class="p-x-20">
          <view class="" v-for="(item,i) in goodsList" :key="i">
            <div class="font-24 color-999 p-y-12">{{item.date}}</div>
            <GoodsList :list="item.list"></GoodsList>
          </view>
          <u-loadmore :status="status"></u-loadmore>
        </view>
      </scroll-view>

      <u-empty v-else mode="data"></u-empty>
    </view>

    <ToHomeButton></ToHomeButton>

    <TabBar
      v-if="shopData"
      :params="{ tab:3, mch_id }"
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
      page: 1,
      status: 'loadmore',
      shopData: '',
      goodsList: [],
    };
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(params) {
    this.mch_id = params.mch_id || '';

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
        page: this.page,
        tab: 3,
        sort: 1,
      };
      const res = await this.$requestAll.mch.indexShop(formData, true);

      if (this.goodsList.length) {
        this.goodsList.push(...res.data.new_list);
      } else {
        this.goodsList = res.data.new_list;
      }

      !this.shopData && (this.shopData = res.data);


      this.status = res.data.new_list?.length < 20 ? 'nomore' : 'loadmore';
      this.page++;
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
