<template>
  <view v-if="!store.is_shenhe" class="body flex-col">
    <view class="tabs">
      <div @click="switchTab(0)" :class="status == 0 && 'check'" class="tab">
        未审核
      </div>
      <div @click="switchTab(1)" :class="status == 1 && 'check'" class="tab">
        已打款
      </div>
    </view>

    <scroll-view @scrolltolower="getList()" scroll-y class="flex-h-1 env-bottom">
      <div v-if="pageData.list.length" class="list">
        <div class="item" v-for="(item, i) in pageData.list" :key="i">
          <image :src="item.avatar_url" mode="aspectFill" />
          <view class="flex-w-1">
            <view class="font-600-32 m-b-10">{{ item.name }}</view>
            <view class="color-999"> 提现金额：￥{{ item.money }} </view>
            <view class="color-999">
              打款金额：<text style="color: #446dfd">￥{{ item.money }}</text>
            </view>
            <view v-if="status == 0" class="btns">
              <div @click="onResult(true, item)" class="btn">打款</div>
              <div @click="onResult(false, item)" class="btn">拒绝</div>
            </view>
          </view>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
    </scroll-view>
  </view>
  <q-shenhe v-else></q-shenhe>
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
      const res = await this.$requestAll.admin.cashList(
        {
          page: this.pageData.page,
          status: this.status,
          type: 1,
          keyword: '',
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
    },
    switchTab(i) {
      this.status = i;
      this.getList(true);
    },
    onResult(isSuccess, item) {
      let text = {
        title: '打款',
        content: '￥' + item.money + '\n资金将转入用户微信余额',
      };
      
      if (!isSuccess) {
        text = {
          title: '拒绝申请',
          content: `拒绝用户该次提现`,
        };
      }

      uni.showModal({
        title: text.title,
        content: text.content,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            const { msg } = await this.$requestAll.admin.cashSubmit(
              {
                id: item.id,
                type: 1,
                content: '小程序前端操作',
                status: isSuccess ? 1 : 2,
              },
              true
            );
            uni.$u.toast(msg);
            this.getList(true);
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
      background: #fff;
      padding: 20rpx;
      margin: 20rpx;
      border-radius: 10rpx;

      display: flex;
      > image {
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
      }

      .btns {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        > div {
          margin-left: 20rpx;
          line-height: 50rpx;
          border-radius: 25rpx;
          border: 1px solid #446dfd;
          width: 100rpx;
          text-align: center;
        }
      }
    }
  }
}
</style>
