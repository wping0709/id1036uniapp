<template>
  <view class="page-body flex-col">
    <WNavbar>
      <div slot="center" class="">
        <div style="width: 450rpx">
          <u-input
            v-model="searchValue"
            placeholder="请输入帖子名称"
            placeholderStyle="font-size:26rpx;font-weight:400;"
            :customStyle="{ background: '#f5f5f5' }"
            shape="circle"
            border="none"
            clearable
            focus
            :adjustPosition="false"
            @focus="inputFocus"
            @blur="inputBlur"
            @confirm="inputConfirm"
          ></u-input>
        </div>
      </div>
    </WNavbar>
    <scroll-view @scrolltolower="getList()" scroll-y class="flex-h-1">
      <div v-if="is_focus" class="history p-l-36 p-r-12">
        <div class="flex-y-center flex-x-sb p-t-30 p-b-20 p-r-24">
          <div class="font-600-30">搜索历史</div>
          <div
            @click="deleteHistory"
            class="iconfont icon-ashbin1 font-600-32"
          ></div>
        </div>
        <div class="list">
          <div
            @click="inputConfirm(item)"
            class="item"
            v-for="(item, index) in historyList"
            :key="index"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div v-else>
        <PostsList ref="PostsList" :list="pageData.list"></PostsList>
        <u-loadmore :status="pageData.loadmore"></u-loadmore>
      </div>
    </scroll-view>
  </view>
</template>
<script>
import WNavbar from "../../components/w-navbar";
import PostsList from "../posts/components/PostsList.vue";
export default {
  components: {
    WNavbar,
    PostsList,
  },
  data() {
    return {
      pageData: {
        list: [],
        page: 0,
        loadmore: "loadmore",
      },
      searchValue: "",
      is_focus: false,
      historyList: [],
    };
  },
  onLoad() {
    // this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll;
      this.pageData = res.data;
    },
    inputFocus() {
      console.log(uni.getStorageSync("postsSearchHistory"), 123);
      this.historyList = uni.getStorageSync("postsSearchHistory") || [];
      this.is_focus = true;
    },
    inputBlur() {
      // this.is_focus = false
    },
    async deleteHistory() {
      const { confirm } = await this.$utils.showModalAsync({
        content: "您确定清空搜索记录吗？",
      });
      if (!confirm) return;
      uni.removeStorageSync("postsSearchHistory");
      this.historyList = [];
    },
    listData() {
      return uni.getStorageSync("postsSearchHistory") || [];
    },
    async inputConfirm(e) {
      console.log(e);
      let list = uni.getStorageSync("postsSearchHistory") || [];
      let index = list.findIndex((item) => item == e);
      if (index == -1) {
        list.push(e);
      } else {
        list.splice(index, 1);
        list.push(e);
      }
      uni.setStorageSync("postsSearchHistory", list);
      this.is_focus = false;
      this.getList(true);
    },
    async getList(reset, fn) {
      if (reset) {
        this.pageData = this.$options.data().pageData;
      }
      if (this.pageData.loadmore == "nomore") return;

      const res = await this.$requestAll.posts.postsList(
        {
          page: this.pageData.page,
          keyword: this.searchValue,
        },
        true
      );
      this.pageData.list.push(...res.data.posts_list);
      this.pageData.page++;
      this.pageData.loadmore =
        res.data.posts_list.length < 10 ? "nomore" : "loadmore";
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  height: 100vh;
  > .flex-h-1 {
    .list {
      display: flex;
      flex-wrap: wrap;
      .item {
        background: #f2f2f2;
        padding: 10rpx 20rpx;
        border-radius: 50rpx;
        font-size: 24rpx;
        margin-right: 24rpx;
        margin-bottom: 30rpx;
      }
    }
  }
}
</style>
