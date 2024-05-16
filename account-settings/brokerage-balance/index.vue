<template>
  <view v-if="userInfo" class="page-body">
    <div class="bg-fff bdrd-20 p-y-30 p-x-24 m-b-24">
      <view class="font-600-30 m-b-20">转换金额</view>
      <view class="border-b p-y-40">
        <u-input
          v-model="form.number"
          type="digit"
          placeholder="请输入转换金额"
          placeholderStyle="font-size:56rpx;font-weight:400;line-height: 80rpx;"
          fontSize="80rpx"
          border="none"
          clearable
        >
          <view slot="prefix" class="font-600-56">￥</view>
        </u-input>
      </view>
      <view class="m-t-30 font-24 color-999">
        <text>可转换{{ userInfo.price }}金额，</text>
        <text @click="form.number = userInfo.price" style="color: #ff1b22"
          >全部转换</text
        >
      </view>
    </div>

    <!-- <div class="p-x-24 color-999 font-24 m-b-24">积分转换手续费{{store.option.money_converting_charge || 0}}%</div> -->

    <div
      @click="!submitDisplay && submit()"
      class="submit"
      :style="{
        opacity: submitDisplay ? 0.2 : 1,
      }"
    >
      确定转换
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      form: {
        number: '',
      },
    };
  },
  onLoad() {},
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.user.getList({});

      if (res.data.user_info) {
        this.$store.commit('user/setUserInfo', res.data.user_info);
      }
    },
    async submit() {
      const res = await this.$requestAll.user.priceConverting(
        {
          price: this.form.number,
          type: 3,
        },
        true
      );
      uni.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: ({ confirm, cancel }) => {
          confirm && this.loadData();
        },
      });
    },
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
    submitDisplay() {
      return this.form.number-0 > this.userInfo.price || this.form.number <= 0;
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style></style>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
  padding: 20rpx;
  /deep/.u-input {
    padding: 0 !important;
    input {
      height: 80rpx !important;
      line-height: 80rpx !important;
    }
  }

  .submit {
    margin: 80rpx 24rpx 0;
    background: #f0250e;
    border-radius: 120rpx;
    height: 88rpx;

    color: #fff;
    line-height: 88rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
  }
}
</style>
