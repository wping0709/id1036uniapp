<template>
  <scroll-view @scrolltolower="getComment" scroll-y class="pingjia">
    <!-- 商家评分 -->
    <view class="pingfen flex-y-center flex-x-sb">
      <view class="flex-col flex-x-center flex-y-center">
        <div class="price-color" style="font-size: 70rpx">
          {{ shopData.shop.score }}
        </div>
        <view class="font-26 color-999">商家评分</view>
      </view>

      <view class="flex-y-center">
        <text>评分</text>
        <u-rate :value="shopData.shop.score" :disabled="true"></u-rate>
      </view>
    </view>

    <view class="pingjia-tabs">
      <div @click="switchType(0)" :class="['tab',comment_type == 0 && 'selectTab']">
        全部 ({{ shopData.shop.comment_count }})
      </div>
      <div @click="switchType(4)" :class="['tab',comment_type == 4 && 'selectTab']">
        有图评价 ({{ shopData.shop.pic_comment_count }})
      </div>
      <div @click="switchType(3)" :class="['tab',comment_type == 3 && 'selectTab']">
        好评 ({{ shopData.shop.favorable_comment_count }})
      </div>
      <div @click="switchType(2)" :class="['tab',comment_type == 2 && 'selectTab']">
        中评 ({{ shopData.shop.middle_comment_count }})
      </div>
      <div @click="switchType(1)" :class="['tab',comment_type == 1 && 'selectTab']">
        差评 ({{ shopData.shop.negative_comment_count }})
      </div>
    </view>

    <view class="m-t-20 bg-fff">
      <view v-if="pageData.list.length">
        <CommentList :list="pageData.list"></CommentList>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </view>

      <view v-else class="p-y-20">
        <u-empty
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import CommentList from '@/pages/goods/components/GoodsComment/components/commentList';
export default {
  props: {
    mch_id: {
      type: [String,Number],
      default: '',
    },
    shopData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      pageData: {
        page: 0,
        list: [],
        status: 'loadmore',
      },
      comment_type: 0,
    };
  },
  components: {
    CommentList,
  },
  created() {
    this.getComment();
  },
  methods: {
    async getComment() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.mch.mchCommentList({
        mch_id: this.mch_id,
        comment_type: this.comment_type,
        page: this.pageData.page,
      },true);
      this.pageData.list.push(...res.data.list);
      this.pageData.status =
        this.pageData.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    switchType(type) {
      this.comment_type = type;
      this.pageData = this.$options.data().pageData;
      this.getComment();
    },
  },
};
</script>

<style lang="scss" scoped>
.pingjia {
  height: 100%;
  .pingfen {
    margin-bottom: 20rpx;
    padding: 25rpx;
    background: #fff;
  }
  /deep/.uicon-star-fill {
    color: #ffd261 !important;
  }
  

  .pingjia-tabs {
    display: flex;
    flex-wrap: wrap;
    background: #fff;
    padding: 25rpx 25rpx 5rpx;
    .tab {
      border-radius: 10rpx;
      font-size: 26rpx;
      border: 2rpx solid #cccccc;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      padding: 16rpx 20rpx;
      color: #666;
    }
    .selectTab {
      color: red;
      border-color: red;
    }
  }
}
</style>
