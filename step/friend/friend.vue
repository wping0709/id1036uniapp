<template>
  <view v-if="info" class="body flex-col">
    <div class="top">
      <div class="top_1">
        <view class="font-40 font-w-700" style="color: #ff9d1e">{{info.count}}</view>
        <view class="font-26 color-666 m-t-10">邀请好友总数</view>
      </div>

      <div class="top_2">
        <view class="font-40 font-w-700" style="color: #ff9d1e">{{info.now_count}}</view>
        <view class="font-26 color-666 m-t-10">今日邀请好友</view>
      </div>
    </div>

    <view class="page_content flex-h-1">
      <view class="tabs">
        <div class="tab">助力好友</div>
        <div class="tab">助力时间</div>
      </view>

      <!-- <scroll-view scroll-y class="flex-h-1 env-bottom"> -->
      <div v-if="pageData.list.length" class="list">
        <div class="item flex-y-center" v-for="(item,i) in pageData.list" :key="i">
					<div class="left flex-w-1 flex-y-center">
						<image :src="item.avatar_url" mode="aspectFill" />
						<text class="m-l-20">{{item.nickname}}</text>
					</div>
					<div class="right font-26 color-999">{{item.invite_time}}</div>
				</div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      >
      </u-empty>
      <!-- </scroll-view> -->
    </view>
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
			info: '',
      status: 0,
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.getList(false);
  },
  onShow() {},
  methods: {
    async getList(isReset) {
      if (isReset) {
        this.pageData = this.$options.data().pageData;
      }
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.step.inviteDetail({
        page: this.pageData.page,
      });
			this.info = res.data.info
      this.pageData.list.push(...res.data.invite_list);
      this.pageData.page++;
      this.pageData.status = res.data.info.count <= this.pageData.list.length ? 'nomore' : 'loadmore';
    },
    switchTab(i) {
      this.status = i;
      this.getList(true);
    },
  },
  onReachBottom() {
		this.getList()
	},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  .top {
    display: flex;
    margin: 20rpx;
    background: #fff;
    border-radius: 10rpx;

    > div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      flex: 1;
      width: 0;
      position: relative;
      height: 240rpx;
				&:nth-child(2) {
				&::before{
					content: '';
					position: absolute;
					left: 0;
					top: 50%;
					transform: translateY(-50%);
					height: 50%;
					width: 2px;
					background: #eee;
				}
			}
    }
  }

  .page_content {
    margin: 20rpx;
    background: #fff;
    border-radius: 10rpx;
    padding: 20rpx;

		.list {
			.item {
				height: 100rpx;
				image {
					width: 70rpx;
					height: 70rpx;
					border-radius: 50%;
				}
			}
		}
  }

  .tabs {
    display: flex;
    align-items: center;
		justify-content: space-between;
    // justify-content: space-around;
    font-size: 30rpx;
    background: #fff;

    .tab {
			position: relative;
			padding: 0 30rpx;
      font-size: 42rpx;
      font-weight: 500;
      color: #666;
		
    }

    
  }
}
</style>
