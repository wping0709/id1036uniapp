<template>
  <view v-if="pageData" class="body">
    <view class="m-x-20 p-y-20 color-999">
      有效期: {{ pageData.sale_info.sale_time }}-{{
        pageData.sale_info.valid_time
      }}
    </view>
    <view class="num-box flex-x-sa flex-y-center p-y-20 bg-fff">
      <view class="flex-col flex-y-center">
        <view class="color-999 m-b-10">已使用次数(次)</view>
        <view class="font-34">{{pageData.sale_info.use_num}}</view>
      </view>
      <view class="flex-col flex-y-center">
        <view class="color-999 m-b-10">已优惠(元)</view>
        <view class="font-34">{{pageData.sale_info.coupon_money}}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      sale_id: "",
    };
  },
  onLoad(params) {
    this.sale_id = params.sale_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.verify.verifyLog(
        { sale_id: this.sale_id },
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
</style>
