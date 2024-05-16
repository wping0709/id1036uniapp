<template>
  <view class="body" :style="{backgroundColor: list_setting.page_bar_color}">
    <div v-if="list_setting.page_pic" class="flex-x-center flex-y-center">
      <image :src="list_setting.page_pic" mode="aspectFill" style="width:710rpx;aspect-ratio:375/240;height:initial;"></image>
    </div>
    <template v-if="goodsList.length">
      <GoodsList :goodsList="goodsList"></GoodsList>
      <u-loadmore :status="status"></u-loadmore>
    </template>
    <template v-else>
      <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
    </template>

    <view @click="$utils.toUrl('/pages/index/index')" class="fixed-box">
      <view class="iconfont icon-home font-50"></view>
    </view>
  </view>
</template>
<script>
import GoodsList from '@/components/goods/GoodsList';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      goodsList: [],
      page: 1,
      status: 'loadmore',
      list_setting: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.default.goodsList(
        {
          page: this.page,
          buying_method: 2,
        },
        true
      );
      !this.list_setting && (this.list_setting = res.data.list_setting);
      this.goodsList.push(...res.data.list);
      this.status = this.page >= res.data.page_count ? 'nomore' : 'loadmore';
      this.page++;
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
  background: #f5f5f5;
  min-height: 100vh;

  .fixed-box {
    position: fixed;
    right: 0;
    bottom: 140rpx;
    bottom: calc(140rpx + env(safe-area-inset-bottom));
    width: 90rpx;
    height: 70rpx;
    border-radius: 10rpx 0 0 10rpx;
    background: #c9c9c9;

    display: flex;
    justify-content: center;
    align-items: center;

    > view {
      color: #666;
      line-height: 60rpx;
    }
  }
}
</style>
