<template>
  <view class="body flex-col">
    <div class="search p-y-20 p-x-20">
      <u-input
        class="u-input"
        v-model="keyword"
        placeholder="搜索"
        border="none"
        shape="circle"
        @confirm="loadData(true)"
      ></u-input>
    </div>
    <scroll-view @scrolltolower="loadData(false)" scroll-y class="flex-h-1">
      <div v-if="pageData.list.length" class="list">
        <div class="item" v-for="(item, i) in pageData.list" :key="i">
          <view class="user flex-y-center">
            <image :src="item.avatar_url" mode="aspectFill"></image>
            <view class="font-32 flex-w-1 u-line-1">{{
              item.nickname
            }}</view>
          </view>

          <view class="message">
            <div class="row">
              <view class="rol flex">
                <div class="label">姓名</div>
                <div class="flex-w-1">{{ item.name }}</div>
              </view>
              <view class="rol m-l-10 flex">
                <div class="label">手机号</div>
                <div class="flex-w-1">{{ item.mobile }}</div>
              </view>
            </div>
            <div class="row">
              <view class="rol flex">
                <div class="label">推荐人</div>
                <div class="flex-w-1">
                  {{ item.parent_nickname ? item.parent_nickname : '总店' }}
                </div>
              </view>
              <view class="rol m-l-10 flex">
                <div class="label">申请时间</div>
                <div class="flex-w-1">{{ item.addtime }}</div>
              </view>
            </div>
          </view>

          <div class="btns">
            <view @click="onReview(true, item, i)">通过</view>
            <view @click="onReview(false, item, i)">不通过</view>
          </div>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      ></u-empty>
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
      keyword: '',
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(reset) {
      reset && (this.pageData = this.$options.data().pageData);

      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.admin.shareList({
        page: this.pageData.page,
        status: 0,
        keyword: this.keyword,
      },true);
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
    },
    onReview(isSuccess, item, i) {
      var content = '是否审核通过？';
      !isSuccess && (content = '是否审核不通过？');
      uni.showModal({
        title: '提示',
        content: content,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            const { msg } = await this.$requestAll.admin.shareStatus({
              id: item.id,
              status: isSuccess ? 1 : 2,
            });
            uni.$u.toast(msg);
            this.pageData.list.splice(i, 1);
          }
        },
      });
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
  /deep/.u-input {
    background: #fff;
  }
  .list {
    padding: 0 20rpx;
    padding: 0 20rpx env(safe-area-inset-bottom);
    .item {
      padding: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      background: #fff;
      .user {
        > image {
          margin-right: 20rpx;
          width: 80rpx;
          height: 80rpx;
        }
      }
      .message {
        .row {
          display: flex;
          margin-top: 10rpx;
          .rol {
            flex: 1;
            width: 0;
            .label {
              padding: 4rpx 10rpx;
              background: #f5f5f5;
            }
            > .flex-w-1 {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 0;
            }
          }
        }
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20rpx;
        > view {
          margin-left: 20rpx;
          padding: 0 30rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          border: 1px solid #999;
          &:nth-child(1) {
            color: #446dfd;
            border-color: #446dfd;
          }
        }
      }
    }
  }
}
</style>
