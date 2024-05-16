<template>
  <view class="body flex-col">
    <div class="search bg-fff p-x-20 p-y-10">
      <u-search
        @search="onSearch"
        @custom="onSearch"
        v-model="keyword"
        placeholder="请输入关键词"
      ></u-search>
    </div>
    <scroll-view @scrolltolower="loadData" scroll-y class="flex-h-1">
      <div class="list">
        <div
          @click="onCheckGoods(item)"
          class="item flex"
          :class="isSelect(item) && 'check'"
          v-for="(item, i) in pageData.list"
          :key="i"
        >
          <image :src="item.cover_pic" mode="aspectFill" />
          <view class="item-content flex-w-1 flex-col flex-x-sb">
            <view class="u-line-3 font-30">{{ item.name }}</view>
            <view class="flex-x-sb flex-y-center">
              <div class="price-color font-32">￥{{ item.price }}</div>
              <div class="">
                <text
                  v-if="!isSelect(item)"
                  class="iconfont icon-xuanzekuangmoren font-50"
                ></text>
                <text
                  v-else
                  class="price-color iconfont icon-success font-50"
                ></text>
              </div>
            </view>
          </view>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      keyword: '',
      checkGoodsList: [],
    };
  },
  computed: {
    isSelect() {
      return function (item) {
        if (item) {
          return (
            this.checkGoodsList.findIndex(item1 => item1.id == item.id) != -1
          );
        }
      };
    },
  },
  watch: {},
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.vgoods.shopGoodsList({
        page: this.pageData.page,
        keyword: this.keyword,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        this.pageData.list.length < 10 ? 'nomore' : 'loadmore';
    },
    onCheckGoods(goods) {
      var checkGoodsList = this.checkGoodsList;
      let i = checkGoodsList.findIndex(item => item.id == goods.id);
      if (i == -1) {
        checkGoodsList.push(goods);
      } else {
        checkGoodsList.splice(i, 1);
      }
      uni.setStorageSync('issue_goods', checkGoodsList);
    },
    onSearch() {
      this.pageData = this.$options.data().pageData;
      this.loadData();
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}

.list {
  .item {
    background: #fff;
    padding: 20rpx;
    margin: 20rpx;
    border-radius: 10rpx;
    > image {
      width: 200rpx;
      height: 200rpx;
      margin-right: 20rpx;
    }
    .item-content {
      display: flex;
    }
  }
  .check {
    border: 1px solid red;
  }
}
</style>
