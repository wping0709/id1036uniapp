<template>
  <view v-if="pageData" class="body">
    <view class="content">
      <view class="title font-36 m-b-20" v-if="pageData.mch">{{ pageData.mch.name }}</view>
      <view class="tishi">微信扫一扫, 向我付钱</view>
      <view class="m-y-20 font-34" v-show="price"> ￥ {{ price }} </view>
      <image :src="pageData.url" mode="aspectFill" class="code-img" />
      <view class="price-img flex-y-center flex-x-center">
        <view class="price" @click="priceShow = true">设置金额</view>
        <view class="addimg" @click="addImg">保存图片</view>
      </view>
    </view>

    <u-popup
      :show="priceShow"
      :safeAreaInsetBottom="false"
      @close="priceShow = false"
      mode="center"
      round="10rpx"
    >
      <view class="popup-box">
        <div class="title">收款金额</div>
        <div class="input-box flex-y-center">
          <text>￥</text>
          <u-input
            @confirm="inputSubmit"
            v-model="priceValue"
            border="none"
            placeholder="请输入收款金额"
          ></u-input>
        </div>
        <div class="bt" @click="inputSubmit">确定</div>
      </view>
    </u-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: "",
      mch_id: "",
      priceValue: "",
      priceShow: false,
      price: "",
    };
  },
  onLoad(params) {
    this.mch_id = params.mch_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      var formData = {
        mch_id: this.mch_id,
      };
      if (this.priceValue) formData.price = this.priceValue;

      const res = await this.$requestAll.scancodepay.getQrcode(formData, true);
      this.pageData = res.data;
      if (this.priceValue) {
        this.price = this.priceValue;
      } else {
        this.price = "";
      }
    },
    inputSubmit() {
      this.loadData();
      this.priceShow = false;
    },
    addImg() {
      this.$utils.addImg(this.pageData.url)
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
  padding-top: 30rpx;
  background: #ffb600;
  min-height: 100vh;
}
.content {
  margin: 0 34rpx 0;
  padding: 80rpx 0 60rpx;
  background: #fff;
  border-radius: 16rpx;
  text-align: center;
}
.code-img {
  display: block;
  margin: 20rpx auto;
  width: 400rpx;
  height: 400rpx;
}
.price-img {
  > view {
    font-size: 28rpx;
    color: #76c2ef;
    width: 200rpx;
    line-height: 30rpx;
    &:nth-child(2) {
      border-left: 4rpx solid #76c2ef;
    }
  }
}

.popup-box {
  width: 90vw;
  padding: 0 30rpx 30rpx;
  .title {
    margin-top: 20rpx;
    text-align: center;
    line-height: 100rpx;
    font-size: 32rpx;
  }
  .input-box {
    font-size: 36rpx;
    padding: 20rpx 0;
    border-bottom: 2rpx solid #eee;
  }

  .bt {
    width: 100%;
    height: 90rpx;
    font-size: 30rpx;
    border-radius: 20rpx;
    background: #ff2300;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30rpx;
  }
}
</style>
