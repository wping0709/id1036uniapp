<template>
  <view class="page-body">
    <view v-if="pageData.list.length" class="">
      
    <PostsList ref="PostsList" :list.sync="pageData.list"></PostsList>
    <u-loadmore :status="pageData.loadmoreStatus"></u-loadmore>
    </view> 
    <u-empty mode="data" v-else></u-empty>
  </view>
</template>
<script>
import PostsList from "../posts/components/PostsList.vue";
export default {
  components: {
    PostsList,
  },
  data() {
    return {
      pageData: {
        page: 1,
        pageSize: 10,
        count: 0,
        list: [],
        loadmoreStatus: "loadmore",
      },
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(reset, fn) {
      if (reset) {
        let { pageData } = this.$options.data();
        this.pageData = pageData;
      }
      if (this.pageData.loadmoreStatus == "nomore") return;
      const res = await this.$requestAll.posts.selfList({page: this.pageData.page,status: 1,});
      this.pageData.list.push(...res.data.posts_list);
      this.pageData.loadmoreStatus =
        res.data.count <= this.pageData.list.length ? "nomore" : "loadmore";
      this.pageData.page++;
      fn && fn();
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {
    this.loadData()
  },
  onPullDownRefresh() {
    this.loadData(true,uni.stopPullDownRefresh)
  },
};
</script>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;
}
</style>
