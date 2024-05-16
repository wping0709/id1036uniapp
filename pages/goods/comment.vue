<template>
  <div class="box">
    <div class="title">
      <view @click="changeNav(-1)" :class="current == -1 ? 'current' : ''">
        全部
      </view>
      <view @click="changeNav(3)" :class="current == 3 ? 'current' : ''">
        好评
      </view>
      <view @click="changeNav(2)" :class="current == 2 ? 'current' : ''">
        中评
      </view>
      <view @click="changeNav(1)" :class="current == 1 ? 'current' : ''">
        差评
      </view>
    </div>

    <CommentList :list="commentList"></CommentList>
    <view class="noMore">没有更多了~</view>
    <!-- 全局过渡组件 -->
    <!-- <transitionPage></transitionPage> -->
  </div>
</template>

<script>
import CommentList from './components/GoodsComment/components/commentList.vue';
export default {
  components: {
    CommentList,
  },
  data() {
    return {
      // 评价列表
      commentList: [],
      // 评价总数
      comment_count: {},
      page: 1,
      // 没有更多数据了
      noMore: false,
      // 商品id
      goods_id: 0,
      // 当前处于导航
      current: -1,
      pageType: 'goods',
    };
  },
  onReachBottom() {
    if (!this.noMore) {
      this.page++;
      this.getEvaluateList();
    }
  },
  methods: {
    async getEvaluateList() {
      if (this.noMore) return;
      var param = {
        goods_id: this.goods_id,
        page: this.page,
        score: this.current,
      };
      if (this.pageType == 'goods') {
        var res = await this.$requestAll.goods.getCommentList(param, true);
      } else if (this.pageType == 'miaosha') {
        var res = await this.$requestAll.miaosha.commentList(param, true);
      } else if (this.pageType == 'pintuan') {
        var res = await this.$requestAll.group.getComment(
          {
            gid: this.goods_id,
            page: this.page,
            score: this.current,
          },
          true
        );
        res.data.list = res.data.comment;
      }
      this.commentList.push(...res.data.list);
      this.noMore = this.commentList.length >= res.data.row_count;
    },
    // 切换导航
    changeNav(e) {
      if (e != this.current) {
        this.current = e;
        this.page = 1;
        this.noMore = false;
        this.commentList = [];
        this.getEvaluateList();
      }
    },
  },
  onLoad(t) {
    this.pageType = t.pageType || 'goods';
    this.goods_id = t.goods_id;
    this.getEvaluateList();
  },
};
</script>

<style scoped lang="less">
.box {
  box-sizing: border-box;
  width: 100%;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding-top: 100rpx;
  background-color: #fff;

  .title {
    position: fixed;
    top: 0;
    left: 0;
    /* #ifdef H5 */
    top: 44px;
    /* #endif */
    z-index: 9;
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
    background: #ffffff;
    padding: 0 36rpx;

    view {
      width: 104rpx;
      height: 52rpx;
      border-radius: 99px;
      background-color: #fdf1f0;
      font-size: 24rpx;
      color: #262626;
      font-family: PingFang SC;
      text-align: center;
      line-height: 52rpx;
      margin-right: 20rpx;
    }

    .current {
      color: #f0250e;
      border: 1px solid #f60313;
    }
  }

  .noMore {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 40rpx;
    font-size: 22rpx;
    font-family: PingFang SC;
    color: #c1c1c1;
  }
}
</style>
