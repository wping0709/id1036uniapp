<template>
  <view v-if="pageData" class="body">
    <div
      class="menu flex-x-sb flex-y-center p-x-20"
      v-for="(item, i) in pageData.list"
      :key="i"
      @click="
        $utils.toUrl('/pages/article-detail/article-detail?id=' + item.id)
      "
    >
      <text>{{ item.title }}</text>
      <text class="iconfont icon-arrow-right"></text>
    </div>
  </view>
</template>
<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  data() {
    return {
      pageData: '',
      cat_id: '',
    };
  },
  onLoad(param) {
    this.cat_id = param.id;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.default.articleList(
        { cat_id: this.cat_id },
        true
      );
      this.pageData = res.data;
    },
  },
  onShow() {},
  computed: {
	  shareData() {
	    return {
	      path:
	        '/other/article-list/article-list' +
	        uni.$u.queryParams({
	          id: this.cat_id,
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
  background: #f5f5f5;
  min-height: 100vh;
  .menu {
    margin-bottom: 4rpx;

    background: #fff;
    font-size: 30rpx;
    height: 100rpx;
  }
}
</style>
