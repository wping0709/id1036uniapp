<template>
  <view v-if="pageData" class="body">{{pageData.content}}</view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.bargain.defaultSetting({},true);
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
  padding: 30rpx;
  min-height: 100vh;
}
</style>
