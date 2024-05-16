<template>
  <view class="body" v-if="pageData">
    <view class="p-20 flex-x-sb flex-y-center">
      <view>
        <text class="font-36 m-r-10">我的卡</text>
        <text class="font-26 color-999">共{{ pageData.num }}张</text>
      </view>
      <view
        @click="$utils.toUrl('/mch/verify-lose/verify-lose')"
        class="color-999"
      >
        <text>失效卡</text>
        <text class="iconfont icon-arrow-right font-22"></text>
      </view>
    </view>

    <view class="card-list">
      <template v-if="pageData.list.length">
        <view
          @click="
            $utils.toUrl('/mch/verify-detail/verify-detail?sale_id=' + item.id)
          "
          class="card-item"
          v-for="item in pageData.list"
          :key="item.id"
        >
          <image :src="item.pic_url" mode="aspectFill" />
          <view class="flex-w-1">
            <view class="font-36 font-w-600">{{ item.verify_card_name }}</view>
            <view class="m-t-10"> 剩余次数: {{ item.left_num }}次 </view>
            <view class="m-t-10">有效期至: {{ item.valid_time }}</view>
          </view>
        </view>
      </template>
      <template v-else>
        <u-empty
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </template>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      status: 0,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.verify.verifyIndex(
        { status: this.status },
        true
      );
      this.pageData = res.data;
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}
.card-item {
  > image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  padding: 20rpx;
  margin: 0 20rpx 20rpx;
  background: #ecac16;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
</style>
