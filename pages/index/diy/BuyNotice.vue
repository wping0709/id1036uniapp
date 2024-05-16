<template>
  <view
    v-if="buyData.goods"
    class="buy-notice"
    :style="{ top: 'calc(50rpx + 44px + ' + systemInfo.statusBarHeight + 'px)'}"
  >
    <view :style="{backgroundColor:param.backgroundColor}">
      <image :src="buyData.avatar_url" mode="aspectFill" />
      <view class="u-line-1" :style="{color:param.textColor}">{{ buyData.content }}</view>
      <view class="m-l-10" :style="{color:param.timeColor}">{{ $u.timeFrom(cha_time, 'yyyy年mm月dd日') }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    param: {
	  type: Object,
	  default() {
	    return {};
	  },
    },
  },
  data() {
    return {
      buyData: '',
      pageTime: '',
      cha_time: 0,
    };
  },
  created() {
    this.getBuy();
  },
  methods: {
    async getBuy() {
      let res = await this.$requestAll.default.BuyData({ time: 0,real:this.param.real,dataNum:this.param.dataNum });
      let time = new Date().getTime();
      this.buyData = res.data;
      if (res.data.goods) {
        this.cha_time = time - res.cha_time*1000;
      }

      if (!this.pageTime) {
        this.pageTime = setInterval(async () => {
          let res = await this.$requestAll.default.BuyData({ time: 0,real:this.param.real,dataNum:this.param.dataNum  });
          let time = new Date().getTime();
          this.buyData = res.data;
          if (res.data.goods) {
            this.cha_time = time - res.cha_time*1000;
          }
        }, 5000);
      }
    },
    clearTime() {
      clearInterval(this.pageTime);
      this.pageTime = '';
    },
  },
};
</script>

<style lang="scss" scoped>
.buy-notice {
  position: fixed;
  left: 20rpx;
  top: 50rpx;
  z-index: 999;
  color: #fff;

  > view {
    display: flex;
    align-items: center;
    padding: 4rpx 20rpx;
    border-radius: 30rpx;
    background: rgba($color: #000000, $alpha: 0.6);
    > image {
      margin-right: 10rpx;
      width: 50rpx;
      height: 50rpx;
      border-radius: 50%;
    }
    .u-line-1 {
      flex: 1;
      width: initial;
      max-width: 300rpx;
    }
  }
}
</style>
