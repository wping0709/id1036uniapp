<template>
  <view v-if="pageData" class="body">
    <view class="bt" @click="$utils.toUrl('/account-settings/feedback/index')"
      >去提交</view
    >
    <view class="font-center font-30 m-y-20">历史记录</view>
    <view class="list">
      <div class="item bg-fff" v-for="(item, index) in pageData" :key="index">
        <view class="color-666">{{ item.addtime }}</view>
        <view>{{ item.questions }}</view>
        <template v-if="item.form_value && item.form_value.length">
          <template v-for="(it2, i2) in item.form_value">
            <view v-if="it2.type == 'uploadImg'" :key="i2" class="flex"> 
              <view class="m-r-20">{{ it2.key }}</view>
              <image :src="it2.value" mode="widthFix" style="max-height:500rpx;width:300rpx;" />
            </view>
            <view v-else :key="i2"> {{ it2.key }}：{{ it2.value }} </view>
          </template>
        </template>
        <view v-if="item.reply" class="mch-reply flex">
          <view class="price-color">商家：</view>
          <view class="flex-w-1">{{ item.reply }}</view>
        </view>
      </div>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.accountSettings.feedbackList({}, true);
      this.pageData = res.data;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding-top: 30rpx;
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  .bt {
    margin: 0 auto;
    border-radius: 50rpx;
    width: 700rpx;
    color: #fff;
    text-align: center;
    line-height: 80rpx;
    font-size: 32rpx;
    font-weight: 600;
    background-color: #f1400c;
  }
  .item {
    margin: 20rpx;
    border-radius: 10rpx;
    padding: 30rpx 20rpx;
    > view {
      font-size: 28rpx;
      margin-bottom: 14rpx;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
    }
    .mch-reply {
      background: #f5f5f5;
      border-radius: 20rpx;
      padding: 20rpx;
      word-break: break-all;
    }
  }
}
</style>
