<template>
  <view v-if="pageData" class="body">
    <view class="head flex-y-center flex-x-sb">
      <view>
        <view>{{custom.menus.money.name}}</view>
        <view class="m-t-20">{{ pageData.price.total_price }}元</view>
      </view>
      <view class="price-bt" @click="$utils.toUrl('/pages/cash-detail/cash-detail')">{{custom.menus.cash.name}}</view>
    </view>

    <view class="item flex-y-center flex-x-sb">
      <view> {{custom.words.can_be_presented.name || custom.words.can_be_presented.default}} </view>
      <view> {{ pageData.price.price }}元 </view>
    </view>

    <view class="item border m-t-20 flex-y-center flex-x-sb">
      <view> {{custom.words.already_presented.name || custom.words.already_presented.default}} </view>
      <view> {{ pageData.price.cash_price }}元 </view>
    </view>
    <view class="item flex-y-center flex-x-sb">
      <view> {{custom.words.pending_money.name || custom.words.pending_money.default}} </view>
      <view> {{ pageData.price.un_pay }}元 </view>
    </view>

    <view style="padding: 0" class="w-collapse m-t-20">
      <u-collapse accordion :border="false">
        <u-collapse-item :title="custom.words.user_instructions.name || custom.words.user_instructions.default">
          <u-icon name="tags-fill" size="20" slot="icon"></u-icon>
          <div class="u-collapse-content" v-html="share_setting.content"></div>
        </u-collapse-item>
      </u-collapse>
    </view>

    <view @click="$utils.toUrl('/pages/cash/cash')" class="bt"> {{custom.words.apply_cash.name || custom.words.apply_cash.default}} </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      share_setting: '',
      custom:{},
    };
  },
  onLoad() {
    this.getShareData()
    this.loadData();
  },
  methods: {
    async loadData() {
      const res1 = await this.$requestAll.share.index({});
      this.share_setting = res1.data;
      const res = await this.$requestAll.share.getPrice({}, true);
      this.pageData = res.data;
    },
    async getShareData() {
      const res1 = await this.$requestAll.share.getInfo({}, true);
      this.custom = res1.data.custom;
      if(this.custom.menus.money) {
        uni.setNavigationBarTitle({
          title: this.custom.menus.money.name,
        });
      }
    }
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  min-height: 100vh;
  background: #f5f5f5;
  font-size: 30rpx;
  .head {
    padding: 30rpx;
    background: #ff4544;
    color: #fff;
    .price-bt {
      border: 2rpx solid #fff;
      border-radius: 10rpx;
      padding: 0 20rpx;
      line-height: 50rpx;
    }
  }

  .item {
    padding: 0 30rpx;
    height: 100rpx;
    background: #fff;
  }
  .border {
    border-bottom: 2rpx solid #eee;
  }
}

.w-collapse {
  background: #fff;
  margin-top: 20rpx;
  color: #333;
}

.bt {
  margin: 60rpx auto 0;
  color: #fff;
  width: 95%;
  background-color: #ff4544;
  border-radius: 10rpx;
  line-height: 90rpx;
  text-align: center;
}
</style>
