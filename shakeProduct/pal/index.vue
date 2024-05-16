<template>
  <view v-if="pageData" class="body flex-col">
    <view>
      <u-navbar :autoBack="false" :placeholder="true">
        <view
          @click="$utils.backTo()"
          slot="left"
          class="iconfont icon-arrow-left font-50"
        >
        </view>
        <div class="tabs bg-fff" slot="center">
          <div
            :class="tabIndex == 0 && 'check'"
            @click="clickTab(0)"
            id="id_0"
            class="tab"
          >
            关注{{ focus_num }}
          </div>
          <div
            :class="tabIndex == 1 && 'check'"
            @click="clickTab(1)"
            id="id_0"
            class="tab"
          >
            粉丝{{ fans_num }}
          </div>
        </div>
      </u-navbar>
    </view>

    <scroll-view scroll-y class="flex-h-1 env-bottom">
      <view v-if="pageData.list.length" class="user">
        <div
          class="user-item flex-y-center"
          v-for="(user, i) in pageData.list"
          :key="i"
        >
          <view class="left flex-y-center flex-w-1">
            <image :src="user.avatar_url" mode="aspectFill" />
            <view>
              <view>{{ user.nickname }}</view>
              <view class="m-t-10 font-22 color-999">粉丝{{ user.fnum }}</view>
            </view>
          </view>
          <view class="right">
            <div @click="onGuanzhu(user, i)" v-if="user.is_focus == 1">
              已关注
            </div>
            <div @click="onGuanzhu(user, i)" v-else class="btn">关注</div>
          </view>
        </div>

        <u-loadmore :status="pageData.status"></u-loadmore>
      </view>
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
        status: 'loadmore',
        page: 1,
      },
      fans_num: 0, //粉丝
      focus_num: 0, //关注
      tabIndex: 0,
      user_id: '',
    };
  },
  onLoad(params) {
    this.user_id = params.user_id;
    this.tabIndex = params.active;
    this.cart_id = params.cart_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.vgoods.focusList(
        {
          page: this.pageData.page,
          type: this.tabIndex != 1 ? 'focus' : 'user',
          user_id: this.user_id,
        },
        true
      );
      this.fans_num = res.data.fans_num;
      this.focus_num = res.data.focus_num;
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    clickTab(s) {
      this.tabIndex = s;
      const { pageData } = this.$options.data();
      this.pageData = pageData;

      this.loadData();
    },
    async onGuanzhu(user, i) {
      const res = await this.$requestAll.vgoods.focus({
        id: user.id,
        type: user.is_focus,
      });
      uni.$u.toast(res.msg);
      user.is_focus = user.is_focus == 1 ? 0 : 1;
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
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}

.tabs {
  display: flex;
  width: 100vw;
  padding-right: 200rpx;
  padding-left: 51px;
  justify-content: center;
  .tab {
    flex: 1;

    font-size: 30rpx;
    line-height: 80rpx;
    text-align: center;
  }
  .check {
    font-weight: 900;
    color: red;
    position: relative;
    &::after {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 10rpx;
      transform: translate(-50%, 0);
      width: 40rpx;
      height: 4rpx;
      background: red;
    }
  }
}

.user {
  padding-top: 20rpx;
  .user-item {
    padding: 20rpx;
    border-radius: 10rpx;
    background: #fff;
    margin: 0 10rpx;
    margin-bottom: 20rpx;
    .left {
      > image {
        margin-right: 20rpx;
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
    }
    .right {
      .btn {
        border: 1px solid red;
        color: red;
        line-height: 2;
        border-radius: 30rpx;
        padding: 0 20rpx;
        font-size: 24rpx;
      }
    }
  }
}
</style>
