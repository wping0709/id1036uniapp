<template>
  <view class="page-body" v-if="pageData">
    <u-parse
      :content="pageData.desc"
      :lazyLoad="false"
      :tagStyle="{
        image: 'vertical-align: middle;max-width:100%;',
        img: 'vertical-align: middle;',
      }"
    ></u-parse>
  </view>
</template>
<script>
export default {
  data() {
    return {
      id: '',
      pageData: '',
    };
  },
  onLoad(params) {
    this.id = params.id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.vip.vipcardInfo({ id: this.id }, true);
      uni.setNavigationBarTitle({
        title: res.data.card.name,
      });
      this.pageData = res.data.card;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;
  // #ifdef H5
  min-height: calc(100vh - 44px);
  // #endif
  background: #f5f5f5;
}
</style>
