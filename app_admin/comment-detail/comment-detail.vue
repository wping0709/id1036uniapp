<template>
  <view v-if="pageData" class="body">
    <div class="menu-item">
      <div class="title font-32 p-y-10 color-666">买家评论</div>
      <div class="content">
        <view class="goods">
          <image :src="pageData.cover_pic" mode="aspectFill" />
          <view class="goods-right flex-col flex-x-sb">
            <view class="u-line-2">{{ pageData.goods_name }}</view>
            <view class="flex-y-center">
              <template v-if="pageData.score == 3">
                <text
                  class="iconfont icon-haoping price-color font-40 m-r-10"
                ></text>
                <text>好评</text>
              </template>
              <template v-else-if="pageData.score == 2">
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
            </view>
          </view>
        </view>

        <div class="comment-box">
          <div class="comment-text p-t-20 p-y-20 font-30">
            {{ pageData.content }}
          </div>

          <div class="comment-imgs">
            <u-album :urls="pageData.pic_url" multipleSize="216rpx"></u-album>
          </div>
        </div>
      </div>
    </div>
    <div class="menu-item">
      <div class="title font-32 p-y-10 color-666">卖家回复</div>
      <div class="content">
        <u-textarea
          v-model="pageData.reply_content"
          placeholder="请输入回复的内容"
        ></u-textarea>
      </div>
    </div>

    <div @click="submit" class="submit">发布修改</div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      id: '',
    };
  },
  onLoad(params) {
    this.id = params.id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.admin.commentDetail(
        { id: this.id },
        true
      );
      this.pageData = res.data.list;
      this.reply_content = res.data.list.reply_content;
    },
    async submit() {
      const { msg } = await this.$requestAll.admin.commentReply({
        id: this.id,
        reply_content: this.pageData.reply_content,
      });
      uni.$u.toast(msg);
      setTimeout(() => {
        this.$utils.backTo();
      }, 1000);
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding: 0 20rpx;
}
.menu-item {
  .content {
    background: #fff;
    border-radius: 10rpx;
    padding: 20rpx;
    .goods {
      display: flex;
      padding-bottom: 20rpx;
      border-bottom: 1px solid #e5e5e5;
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
  }
}

.submit {
  background: #446dfd;
  margin: 100rpx 20rpx 0;
  border-radius: 40rpx;
  line-height: 80rpx;

  text-align: center;
  font-size: 32rpx;
  color: #fff;
}
</style>
