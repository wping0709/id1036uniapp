<template>
  <view class="body flex-col">
    <div class="search flex-y-center">
      <div class="search-input flex-w-1">
        <u-search
          bgColor="#efefef"
          placeholder="搜话题"
          v-model="keyword"
          :showAction="false"
          @search="searchConfirm"
        ></u-search>
      </div>
    </div>

    <scroll-view @scrolltolower="getGoodsList" scroll-y class="flex-h-1">
      <div v-if="pageData.list.length" class="list">
        <div
          v-for="(item, i) in pageData.list"
          :key="i"
          :class="item.id == topic_id && 'check'"
          @click="$utils.toUrl('/pages/goods/godos?id=' + item.id)"
          class="item m-b-20 flex"
        >
          <image :src="item.pic_url" mode="aspectFill" />
          <view class="flex-w-1 flex-col flex-x-sb">
            <div class="goods-name u-line-2">{{ item.name }}</div>

            <view @click.stop>
              <view class="flex-x-end">
                <view @click="onCheckGoods(item)" class="add-bt">{{
                  goods_id == item.id ? '已添加' : '添加'
                }}</view>
              </view>
              <div class="flex-x-sb flex-y-center">
                <div class="color-999">库存{{ item.sort }}</div>
                <div class="price-color font-40">￥{{ item.price }}</div>
              </div>
            </view>
          </view>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty v-else mode="data" :icon="wxapp_img.empty_data">
      </u-empty>
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
      goods_id: '',
      pageType: '',
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.pageType = params.type;
    this.goods_id = params.goods_id;
    this.getGoodsList();
  },
  onShow() {},
  methods: {
    async getGoodsList() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.default.defaultSearch({
        page: this.pageData.page,
        keyword: this.keyword,
      },true);
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        res.data.list.length < 10 ? 'nodemore' : 'loadmore';
    },
    searchConfirm() {
      this.pageData = this.$options.data().pageData;
      this.getGoodsList();
    },
    onCheckGoods(item) {
      if (this.pageType == 'select') {
        uni.setStorageSync('checkGoods', item);
        this.$utils.backTo();
      }
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding: 0 20rpx;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  .list {
    padding-bottom: env(safe-area-inset-bottom);
    padding-top: 20rpx;
    .item {
      > image {
        width: 250rpx;
        height: 250rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      .goods-name {
        line-height: 40rpx;
        height: 80rpx;
        font-size: 30rpx;
      }

      .add-bt {
        margin-bottom: 20rpx;
        width: 120rpx;
        line-height: 50rpx;
        border-radius: 25rpx;
        border: 1px solid red;
        color: red;
        text-align: center;
      }
    }
  }
}
</style>
