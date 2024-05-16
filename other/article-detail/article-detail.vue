<template>
  <view v-if="pageData" class="body">
    <!-- <view v-html="pageData.content"></view> -->
    <u-parse :content="pageData.content"></u-parse>
  </view>
</template>
<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  data() {
    return {
      pageData: "",
      id: "",
    };
  },
  onLoad(params) {
    uni.showShareMenu({
      withShareTicket: false,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    this.id = params.id;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.default.articleDetail(
        { id: this.id },
        true
      );
      uni.setNavigationBarTitle({
          title: res.data.title
      });
      this.pageData = res.data;
    },
  },
  onShow() {},
  computed: {
	  shareData() {
	    return {
	      path:
	        '/other/article-detail/article-detail' +
	        uni.$u.queryParams({
	          id: this.id,
	          // #ifdef APP-PLUS
	          _platform: 'app',
	          // #endif
	        }),
	    };
	  },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  min-height: 100vh;
  padding: 20rpx;
  font-size: 28rpx;
  line-height: 40rpx;
}
</style>
