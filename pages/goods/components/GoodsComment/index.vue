<template>
  <view
    v-if="store.is_comment == 1"
    class="detailEvaluateStyle"
    @click.stop="
      $utils.toUrl(
        '/pages/goods/comment?pageType=' + type + '&goods_id=' + propsData.id
      )
    "
  >
    <view class="module-bg"></view>
    <view class="evaluate-section">
      <view class="evaluate-header">
        <view class="evaluate-title">
          <!-- <view class="line"></view> -->
          <view class="title">评价</view>
          <view class="title-num">（{{ total > 0 ? total : '0' }}）</view>
        </view>
        <view class="title-right">
          <view>全部评论</view>
          <i class="iconfont icon-arrow-right"></i>
        </view>
      </view>

      <view class="evaluate-tab">
        <view
          class="tab-item"
          v-for="(item, index) in evaluateTab"
          :key="index"
          >{{ item.text }}</view
        >
      </view>

      <view class="evaluateList">
        <commentList :list="commentList" :showHuifu="false"></commentList>
      </view>

      <!-- <view v-if="commentList.length" class="btn">查看全部评价</view> -->
      <view v-if="!commentList.length" class="no-data">
        <view class="no-text">还没有评价～</view>
      </view>
    </view>
  </view>
</template>

<script>
// import { diySysPageMixin } from "@/components/diySystemPage/mixins/index.js";
import commentList from './components/commentList.vue';

export default {
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    type: {
      type: [String],
      default: 'goods',
    },
  },
  components: {
    commentList,
  },
  data() {
    return {
      // 评价列表
      commentList: '',
      // 评价总数
      total: 0,
      evaluateTab: [
        {
          text: '全部',
          id: '-1',
        },
        {
          text: '好评',
          id: '3',
        },
        {
          text: '中评',
          id: '2',
        },
        {
          text: '差评',
          id: '1',
        },
      ],
    };
  },
  methods: {
    // 获取商品评价
    async getCommentList() {
      // 秒杀
      if (this.type == 'miaosha') {
        const res = await this.$requestAll.miaosha.commentList({
          goods_id: this.propsData.id,
          page: 1,
        });
        this.total = res.data.row_count;
        if (res.data.list && res.data.list.length) {
          this.commentList = res.data.list.slice(0, 1);
        }
      }
      // 拼团
      else if (this.type == 'pintuan') {
        const res = await this.$requestAll.group.getComment({
          gid: this.propsData.id,
          page: 1,
        });
        this.total = res.data.row_count;
        if (res.data.comment && res.data.comment.length) {
          this.commentList = res.data.comment.slice(0, 1);
        }
      }
      // 默认普通商品
      else {
        const res = await this.$requestAll.goods.getCommentList({
          goods_id: this.propsData.id,
          page: 1,
        });
        this.total = res.data.row_count;
        if (res.data.list && res.data.list.length) {
          this.commentList = res.data.list.slice(0, 1);
        }
      }
    },
  },
  watch: {
    propsData: {
      handler(val) {
        this.getCommentList();
        console.log('获取评价');
      },
      immediate: true,
    },
  },
};
</script>

<style scoped lang="less">
.detailEvaluateStyle {
  position: relative;
  background: #fff;
  border-radius: 30rpx;
  margin: 20rpx;

  .module-bg {
    width: 100%;
    height: 100%;
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
  }
  .evaluate-section {
    width: 100%;
    padding-bottom: 4.33vw;
  }
  .evaluate-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4.2vw 20rpx 0;
    .evaluate-title {
      display: flex;
      align-items: center;
      .line {
        width: 6rpx;
        height: 4vw;
        background: #f1270d;
        margin-right: 1.067vw;
      }
      .title {
        font-size: 30rpx;
        font-weight: 600;
        color: #262626;
        margin: 0 1.067vw 0 0;
      }
      .title-num {
        font-size: 24rpx;
        color: #999;
        margin-bottom: 0;
      }
    }
    .title-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      font-size: 24rpx;
      font-weight: 400;
      color: #8c8c8c;
      .iconfont {
        position: relative;
      }
    }
  }
  .evaluate-tab {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 3.46vw;
    padding: 0 20rpx;
    .tab-item {
      height: 6.93vw;
      margin-right: 2.67vw;
      padding: 0 3.73vw;
      line-height: 6.93vw;
      text-align: center;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #262626;
      background: #fdf1f0;
      border-radius: 3.465vw;
    }
    .tab-item:last-child {
      margin-right: 0;
    }
  }
  .evaluateItem {
    padding: 30rpx 0;
    border-bottom: 1px solid #f2f2f2;
    .head {
      display: flex;
      align-items: center;
      .userPic {
        width: 60rpx;
        min-width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .userInfo {
        margin-left: 10rpx;
        display: flex;
        flex-direction: column;
        .userName {
          font-size: 26rpx;
        }
        .starList {
          display: flex;
          align-items: center;
          margin-top: 10rpx;
          .star {
            width: 18rpx;
            height: 18rpx;
            margin-right: 4rpx;
          }
        }
      }
    }
    .content {
      .evaluateContent {
        font-size: 26rpx;
        font-weight: 500;
        margin: 20rpx 0 10rpx 0;
      }
      .picList {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        .picItem {
          width: 164rpx;
          height: 164rpx;
          margin-right: 4rpx;
          margin: 10rpx 4rpx 10rpx 0;
          overflow: hidden;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .picItem:first-child {
          border-radius: 10rpx 0 0 10rpx;
        }
        .picItem:last-child {
          border-radius: 0 10rpx 10rpx 0;
        }
        .picitem:nth-child(4n + 1) {
          border-radius: 10rpx 0 0 10rpx;
        }
        .picitem:nth-child(4n) {
          border-radius: 0 10rpx 10rpx 0;
        }
      }
    }
  }
  .evaluateItem:last-child {
    border-bottom: none;
  }
  .btn {
    width: 230rpx;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    border: 1px solid #9b9b9b;
    border-radius: 30rpx;
    font-size: 24rpx;
    font-weight: 400;
    font-family: PingFang SC;
    color: #262626;
    margin: 20rpx auto 0 auto;
  }
  .no-data {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 3.46vw;
    .no-text {
      font-size: 13px;
      font-weight: 400;
      color: #8c8c8c;
    }
  }
}
</style>
