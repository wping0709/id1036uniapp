<template>
  <view v-if="userInfo" class="page-body">
    <div class="bg-fff bdrd-20 p-y-30 p-x-24 m-b-24">
      <view class="font-600-30 m-b-20">转增金额</view>
      <view class="border-b p-y-40">
        <u-input
          v-model="form.number"
          type="digit"
          placeholder="请输入转增金额"
          fontSize="80rpx"
          placeholderStyle="font-size:56rpx;font-weight:400;line-height: 80rpx;"
          border="none"
          clearable
        >
          <view slot="prefix" class="font-600-56">￥</view>
        </u-input>
      </view>
      <view class="m-t-30 font-24 color-999">
        <text>可转赠{{ userInfo.money }}金额，</text>
        <text @click="form.number = userInfo.money" style="color: #ff1b22"
          >全部转赠</text
        >
      </view>
    </div>

    <div class="bg-fff bdrd-20 p-y-30 p-x-24 m-b-24">
      <view class="flex-y-center flex-x-sb">
        <view class="font-30">对方手机号</view>
        <view class="m-l-60 flex-w-1">
          <u-input
            v-model="form.mobile"
            type="number"
            placeholder="请输入对方手机号"
            border="none"
            fontSize="30rpx"
          clearable
            @change="mobileChange"
          ></u-input>
        </view>
      </view>
      <view v-if="giveInfo" class="flex-y-center border-t p-t-30 m-t-30">
        <image
          :src="giveInfo.avatar_url"
          style="width: 70rpx; height: 70rpx; border-radius: 10rpx"
          class="m-r-20"
          mode="aspectFill"
        />
        <view class="font-30">{{
          giveInfo.nickname || giveInfo.avatar_url
        }}</view>
      </view>
    </div>

    <div class="p-x-24 color-999 font-24 m-b-24">
      余额转增手续费{{ store.option.money_converting_charge || 0 }}%
    </div>

    <div
      @click="!submitDisplay && submit()"
      class="submit"
      :style="{
        opacity: submitDisplay ? 0.2 : 1,
      }"
    >
      确定转增
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      giveInfo: '',
      form: {
        number: '',
        mobile: '',
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
    async mobileChange(e) {
      if (uni.$u.test.mobile(e)) {
        const res = await this.$requestAll.user.getUserForMobile(
          {
            mobile: this.form.mobile,
          },
          true
        );
        this.giveInfo = res.data;
      } else {
        this.giveInfo = '';
      }
    },
    async submit() {
      const res = await this.$requestAll.user.priceConverting(
        {
          give_user_id: this.giveInfo.id,
          price: this.form.number,
          type: 2,
        },
        true
      );
      uni.showModal({
        title: '提示',
        content: `转增成功`,
        showCancel: false,
        success: ({ confirm, cancel }) => {
          confirm && this.$utils.toUrl('/other/member/member','redirectTo')
        },
      });
    },
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
    submitDisplay() {
      return (
        !this.giveInfo ||
        Number(this.form.number) > Number(this.userInfo.money) ||
        this.form.number <= 0
      );
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
