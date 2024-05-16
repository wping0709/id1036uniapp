<template>
  <view class="body flex-col">
    <div class="search-box flex-y-center">
      <view class="flex-w-1">
        <u-input
          v-model="keyword"
          @confirm="loadData(true)"
          placeholder="搜索"
          shape="circle"
        ></u-input>
      </view>
      <div
        @click="$utils.toUrl('/app_admin/add-goods/add-goods?mch_id=' + mch_id)"
        class="add-bt flex-y-center flex-x-center"
      >
        <text class="iconfont icon-add"></text>
        <text>添加商品</text>
      </div>
    </div>

    <view class="bg-fff m-b-20">
      <u-tabs
        :current="status"
        :list="tabsList"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view @scrolltolower="loadData(false)" scroll-y class="flex-h-1">
      <template v-if="pageData.list.length">
        <div class="scroll-view p-x-20 bg-fff">
          <GoodsList
            @clickModify="clickModify"
            @switchStatus="switchStatus"
            @clickDelete="clickDelete"
            :goodsList="pageData.list"
          ></GoodsList>
        </div>
        <view style="padding-bottom: env(safe-area-inset-bottom)">
          <u-loadmore :status="pageData.status"></u-loadmore>
        </view>
      </template>
      <template v-else>
        <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
      </template>
    </scroll-view>
  </view>
</template>
<script>
import GoodsList from './components/GoodsList';
const tabsList = [
  {
    name: '出售中',
  },
  {
    name: '售罄',
  },
  {
    name: '仓库中',
  },
  {
    name: '最新',
  },
];
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      tabsList,
      mch_id: '',
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      status: 0,
      keyword: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(isReset) {
      // 主要用于恢复分页及加载状态
      isReset && (this.pageData = this.$options.data().pageData);
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.mch.mchGoodsList({
        page: this.pageData.page,
        status: this.status + 1,
        keyword: this.keyword,
      });
      // 主要用户恢复原始数组防止多次触发await
      isReset && (this.pageData = this.$options.data().pageData);
      !this.mch_id && (this.mch_id = res.data.mch_id);
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    clickTab({ index }) {
      this.status = index;
      this.loadData(true);
    },
    resetPageData() {
      let { pageData } = this.$options.data();
      this.pageData = pageData;
    },
    clickModify(goods) {
      this.$utils.toUrl(
        '/app_admin/add-goods/add-goods' +
          uni.$u.queryParams({
            mch_id: this.mch_id,
            id: goods.id,
          })
      );
    },
    async switchStatus(goods) {
      const res = await this.$requestAll.mch.goodsSetStatus({
        id: goods.id,
        status: goods.status == 1 ? 0 : 1,
      });
      uni.$u.toast(res.msg);
      let i = this.pageData.list.findIndex(item => item.id == goods.id);
      this.pageData.list[i].status = goods.status == 1 ? 0 : 1;
    },
    clickDelete(goods) {
      var that = this;
      uni.showModal({
        title: '警告',
        content: '确定删除该商品',
        success: async function (res) {
          if (res.confirm) {
            const res = await that.$requestAll.mch.goodsDelete(
              {
                id: goods.id,
              },
              true
            );
            uni.$u.toast(res.msg);
            that.pageData.list = that.pageData.list.filter(
              item => item.id != goods.id
            );
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
  },
  computed: {},
  watch: {},
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
  .search-box {
    padding: 10rpx 20rpx;
    /deep/.u-input {
      background: #fff;
      padding: 6rpx 20rpx !important;
    }
    .add-bt {
      margin-left: 20rpx;
      width: 180rpx;
      height: 56rpx;
      border-radius: 28rpx;
      color: #446dfd;
      border: 2rpx solid #446dfd;
    }
  }
}
</style>
