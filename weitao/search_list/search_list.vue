<template>
  <view class="body">
    <div class="search flex-y-center p-y-10">
      <div class="type">
        <div
          @click="showSelect = !showSelect"
          class="show flex-y-center p-x-20"
        >
          <text>{{ search_type == 1 ? '帖子' : '话题' }}</text>
          <text
            :class="showSelect ? 'icon-arrow-top' : 'icon-arrow-bottom'"
            class="iconfont m-l-10"
          ></text>
        </div>
        <div v-if="showSelect" class="select-box">
          <view @click="switchType(2)" class="select-item">
            <text>话题</text>
            <text class="iconfont icon-arrow-right m-l-10"></text>
          </view>
          <view @click="switchType(1)" class="select-item">
            <text>帖子</text>
            <text class="iconfont icon-arrow-right m-l-10"></text>
          </view>
        </div>
      </div>
      <view class="flex-w-1">
        <u-search
          placeholder="搜帖子"
          v-model="search_data"
          @search="searchConfirm"
          @custom="searchConfirm"
        ></u-search>
      </view>
    </div>

    <List :list="pageData.list" :listChange.sync="pageData.list"></List>
  </view>
</template>
<script>
import List from '../index/components/List.vue';
import share from '@/mixins/share.js';
export default {
  components: {
    List
  },
  mixins: [share],
  data() {
    return {
      pageData: {
        list: [],
      },
      page: 1,
      search_type: 0,
      search_data: '',
      showSelect: false,
    };
  },
  onLoad(params) {
    if (params.search_topic) {
      this.search_data = params.search_topic;
      this.search_type = 2
      this.getSearchResult();
    }
  },
  onShow() {},
  methods: {
    async getSearchResult() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.weitao.searchList({
        page: this.page,
        search_data: this.search_data,
        search_type: this.search_type,
      },true);
      this.pageData.list.push(...res.data.list);
      this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.page++;
    },
    searchConfirm() {
      this.page = 1;
      this.status = 'loadmore'
      this.pageData.list = [];
      this.getSearchResult();
    },
    switchType(type) {
      this.search_type = type;
      this.showSelect = !this.showSelect;
    },
  },
  computed: {
	  shareData() {
	    return {
	      path:
	        '/weitao/search_list/search_list' +
	        uni.$u.queryParams({
	          search_topic: this.search_data,
	          // #ifdef APP-PLUS
	          _platform: 'app',
	          // #endif
	        }),
	    };
	  },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  min-height: 100vh;
  .search {
    .type {
      position: relative;
      .select-box {
        position: absolute;
        left: 0;
        right: 0;
        top: 100%;
        background: #f5f5f5;
        text-align: center;
      }
    }
  }
}
</style>
