<template>
  <view v-if="pageData" class="body">
    <view class="anchor-title"
      >主播 {{ pageData.user.nickname }} 的直播间列表</view
    >
    <scroll-view @scrolltolower="loadData" scroll-y class="zhibo-list">
      <LiveList :liveList="pageData.list"></LiveList>
      <u-loadmore :status="liveData.status"></u-loadmore>
    </scroll-view>
  </view>
</template>
<script>
import LiveList from '../components/LiveList'
export default {
  components: {
    LiveList
  },
  data() {
    return {
      anchor_id: '',
      pageData: {
        user: '',
        list: [],
        page: 1,
        status: 'loadmore',
      },
      page: 1,
      status: 'loadmore',
    };
  },
  onLoad(params) {
    this.anchor_id = params.anchor_id || '';
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.lives.getAnchorRoomList({
        anchor_id: this.anchor_id,
        page: this.page,
      });
      !this.pageData.user && (this.pageData.user = res.data.user);
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list < 10 ? 'nomore' : 'loadmore';
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>

.body {
  background: #fafafa;
  min-height: 100vh;
  .anchor-title {
    text-align: center;
    line-height: 80rpx;
    font-size: 32rpx;
  }

  .zhibo-list {
    box-sizing: border-box;
    height: calc(100vh - 80rpx);
  }
}
</style>
