<template>
  <view v-if="setting" class="body">
    <view class="content">
      {{ setting.rule }}
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      setting: '',
    };
  },
  onLoad() {
    this.getSetting();
  },
  methods: {
    async getSetting() {
      const res = await this.$requestAll.pond.pondSetting({}, true);
      this.setting = res.data;
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
/* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  .content {
    padding: 20rpx;
    padding-bottom: 20rpx;
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
    font-size: 30rpx;
  }
}
</style>
