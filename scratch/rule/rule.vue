<template>
  <view  class="body">
    <view v-if="setting">
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
      const res = await this.$requestAll.scratch.scratchSetting({}, true);
      this.setting = res.data.setting;
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
  padding: 20rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  font-size: 30rpx;
}
</style>
