<template>
  <view v-if="pageData" class="body">
    <!-- <view class="top-img">
      <image :src="wxapp_img.crowdfund.top_back" mode="aspectFill" />
    </view> -->
    <u-swiper
      :list="pageData.banner"
      keyName="pic_url"
      @click="click"
      :interval="5000"
      height="320rpx"
      circular
      indicator
    ></u-swiper>

    <CrowdfundList :list="pageData.list"></CrowdfundList>
  </view>
</template>
<script>
import CrowdfundList from './components/CrowdfundList';
export default {
  components: {
    CrowdfundList,
  },
  data() {
    return {
      pageData: '',
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.crowdfund.list({}, true);
      this.pageData = res.data;
    },
    click(item) {
      this.$utils.toUrl(this.pageData.banner[0].page_url);
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
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding-bottom: env(safe-area-inset-bottom);

  .top-img {
    > image {
      width: 100%;
      height: 320rpx;
    }
  }
}
</style>
