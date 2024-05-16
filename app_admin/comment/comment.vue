<template>
  <view class="body flex-col">
    <view class="">
      <view class="tabs">
        <div
          @click="switchTab(3, 'score')"
          :class="score == 3 && 'check'"
          class="tab"
        >
          好评
        </div>
        <div
          @click="switchTab(2, 'score')"
          :class="score == 2 && 'check'"
          class="tab"
        >
          中评
        </div>
        <div
          @click="switchTab(1, 'score')"
          :class="score == 1 && 'check'"
          class="tab"
        >
          差评
        </div>
      </view>
      <view class="tabs">
        <div
          @click="switchTab(0, 'is_reply')"
          :class="is_reply == 0 && 'check'"
          class="tab"
        >
          未回复
        </div>
        <div
          @click="switchTab(1, 'is_reply')"
          :class="is_reply == 1 && 'check'"
          class="tab"
        >
          已回复
        </div>
      </view>
    </view>

    <scroll-view scroll-y class="flex-h-1 env-bottom">
      <div v-if="pageData.list.length" class="list">
        <div class="item" v-for="(item, i) in pageData.list" :key="i">
          <view class="goods">
            <image :src="item.cover_pic" mode="aspectFill" />
            <view class="goods-right">
              <view class="font-32 u-line-2">{{ item.goods_name }}</view>
              <view class="color-999">来自用户 {{ item.nickname }}</view>
            </view>
          </view>

          <view class="flex-y-center flex-x-sb">
            <view class="flex-y-center">
              <template v-if="score == 3">
                <text
                  class="iconfont icon-haoping price-color font-40 m-r-10"
                ></text>
                <text>好评</text>
              </template>
              <template v-else-if="score == 2">
                <text
                  class="iconfont icon-zhongping price-color font-40 m-r-10"
                ></text>
                <text>中评</text>
              </template>
              <template v-else>
                <text
                  class="iconfont icon-chaping price-color font-40 m-r-10"
                ></text>
                <text>差评</text>
              </template>

              <text v-if="item.is_hide == 1" class="m-l-20 yincang-bt"
                >已隐藏</text
              >
            </view>

            <view class="flex-y-center font-32">
              <view
                @click="
                  $utils.toUrl(
                    '/app_admin/comment-detail/comment-detail?id=' + item.id
                  )
                "
              >
                {{ item.reply_content ? '修改回复' : '回复' }}
              </view>
              <view @click.stop="onSwitchHide(item)" class="m-l-20">
                {{ item.is_hide == 1 ? '取消隐藏' : '隐藏评论' }}
              </view>
            </view>
          </view>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      >
      </u-empty>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      is_reply: 0,
      score: 3,
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.getList(true);
  },
  onShow() {},
  methods: {
    async getList(isReset) {
      if (isReset) {
        this.pageData = this.$options.data().pageData;
      }
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.admin.commentList({
        page: this.pageData.page,
        score: this.score,
        is_reply: this.is_reply,
      },true);
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
    },
    switchTab(i, key) {
      this[key] = i;
      this.getList(true);
    },
    async onSwitchHide(item) {
      const { msg } = await this.$requestAll.admin.commentHide({
        id: item.id,
        is_hide: Number(!parseInt(item.is_hide)),
      });
      uni.$u.toast(msg);
      item.is_hide = Number(!parseInt(item.is_hide));
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */

  .tabs {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 30rpx;
    background: #fff;

    .tab {
      line-height: 90rpx;
    }

    .check {
      position: relative;
      color: red;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 10rpx;
        transform: translateX(-50%);
        width: 30rpx;
        height: 4rpx;
        background: red;
      }
    }
  }

  .list {
    .item {
      margin: 20rpx;
      padding: 20rpx;
      background: #fff;
      border-radius: 10rpx;
      .goods {
        display: flex;
        margin-bottom: 20rpx;
        > image {
          width: 140rpx;
          height: 140rpx;
          border-radius: 10rpx;
        }
        .goods-right {
          flex: 1;
          width: 0;
          margin-left: 20rpx;
        }
      }
      .yincang-bt {
        width: 100rpx;
        text-align: center;
        line-height: 40rpx;
        background: #ff9000;
        border-radius: 20rpx;
        font-size: 22rpx;
        color: #fff;
      }
    }
  }
}
</style>
