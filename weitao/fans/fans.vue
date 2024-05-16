<template>
  <view v-if="pageData" class="body">
    <div v-if="pageData.list.length" class="list">
      <div
        class="item flex-y-center"
        v-for="(user, i) in pageData.list"
        :key="i"
      >
        <image :src="user.user_head" mode="aspectFill" />
        <view class="flex-y-center flex-x-sb flex-w-1">
          <view class="flex-w-1">
            <view class="u-line-1">{{ user.nickname }}</view>
            <view class="u-line-1">{{ user.desc }}</view>
          </view>
          <view @click="onGuanzhu(user, i)" class="status-bt">{{
            user.is_user_liked == 1 ? '取关' : '关注'
          }}</view>
        </view>
      </div>
    </div>
    <u-empty
      v-else
      mode="data"
      :icon="wxapp_img.empty_data"
    >
    </u-empty>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      is_focus: '',
    };
  },
  onLoad(params) {
    if (params.is_focus) {
      uni.setNavigationBarTitle({
        title: '关注',
      });
      this.is_focus = params.is_focus;
    }
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.weitao.getNotFocus(
        {
          is_focus: this.is_focus,
        },
        true
      );
      this.pageData = res.data;
    },
    async onGuanzhu(user, i) {
      const res = await this.$requestAll.weitao.focusUser({
        user_id: this.is_focus ? user.focus_user : user.user_id,
        is_user_liked: user.is_user_liked + 1,
      });
      uni.$u.toast(res.msg);
      this.pageData.list[i].is_user_liked = user.is_user_liked + 1;
      this.is_focus && this.pageData.list.splice(i, 1);
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
}

.list {
  .item {
    margin: 0 10rpx;
    border-radius: 10rpx;
    margin-bottom: 20rpx;
    background: #fff;
    padding: 20rpx;
    font-size: 30rpx;
    > image {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .status-bt {
      margin-left: 20rpx;
      padding: 0 20rpx;
      border-radius: 30rpx;
      border: 1px solid red;
      color: red;
    }
  }
}
</style>
