<template>
  <view v-if="detail && !store.is_shenhe" class="body">
    <view class="menu-item">
      <div class="title p-y-20 font-30">基本资料</div>
      <div class="content bg-fff">
        <view class="flex">
          <view class="label">申请人</view>
          <view class="label-text flex-w-1">{{ detail.nickname }}</view>
        </view>
        <view class="flex">
          <view class="label">联系人</view>
          <view class="label-text flex-w-1">{{ detail.realname }}</view>
        </view>
        <view class="flex">
          <view class="label">联系电话</view>
          <view class="label-text flex-w-1">{{ detail.tel }}</view>
        </view>
        <view class="flex">
          <view class="label">微信号</view>
          <view class="label-text flex-w-1">{{ detail.wechat_name }}</view>
        </view>
        <view class="flex">
          <view class="label flex-y-center">
            <text
              class="iconfont icon-renminbi font-30"
              style="color: #ffbc4b"
            ></text>
            <text>手续费</text>
          </view>
          <view class="label-text flex-w-1">
            <u-input
              v-model="transfer_rate"
              placeholder="设置0-1000整数交易手续费率(‰)"
              border="none"
            ></u-input>
          </view>
        </view>
      </div>
    </view>
    <view class="menu-item">
      <div class="title p-y-20 font-30">店铺信息</div>
      <div class="content bg-fff">
        <view class="flex">
          <view class="label">店铺名称</view>
          <view class="label-text flex-w-1">{{ detail.name }}</view>
        </view>
        <view class="flex">
          <view class="label">所在地区</view>
          <view class="label-text flex-w-1">{{ detail.city }}</view>
        </view>
        <view class="flex">
          <view class="label">详细地址</view>
          <view class="label-text flex-w-1">{{ detail.address }}</view>
        </view>
        <view class="flex">
          <view class="label">所售类目</view>
          <view class="label-text flex-w-1">{{ detail.cat_name }}</view>
        </view>
        <view class="flex">
          <view class="label">客服电话</view>
          <view class="label-text flex-w-1">{{ detail.service_tel }}</view>
        </view>
      </div>
    </view>

    <div class="btns flex-y-center">
      <view class="cancel" @click="showPopup = true">不通过</view>
      <view class="confirm" @click="success(true)">通过</view>
    </div>

    <u-popup
      :show="showPopup"
      :safeAreaInsetBottom="false"
      mode="center"
      bgColor="transparent"
      @cancel="showPopup = false"
    >
      <div class="popup-box">
        <view class="font-center font-600-32"> 不通过申请 </view>

        <view class="p-y-20">
          <u-textarea
            v-model="review_remark"
            placeholder="请输入拒绝理由"
          ></u-textarea>
        </view>

        <div class="popup-bt flex-y-center">
          <div @click="showPopup = false" class="cancel">取消</div>
          <div @click="success(false)" class="confirm">确定</div>
        </div>
      </div>
    </u-popup>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      detail: '',
      id: '',
      transfer_rate: '',
      review_remark: '',
      showPopup: false,
    };
  },
  onLoad(params) {
    this.id = params.id || '';
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.admin.reviewDetail({
        id: this.id,
      });
      this.detail = res.data.detail;
    },
    async success(isSuccess) {
      var { msg } = await this.$requestAll.admin.reviewSwitch({
        transfer_rate: this.transfer_rate,
        type: 1,
        status: isSuccess ? 1 : 2,
        review_remark: this.review_remark,
        mch: this.id,
      });
      uni.$u.toast(msg);
      setTimeout(() => {
        this.$utils.backTo();
      }, 1000);
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  .menu-item {
    margin: 0 20rpx;
    .content {
      padding: 20rpx;
      background: #fff;
      font-size: 30rpx;
      border-radius: 10rpx;
      .label {
        padding-left: 20rpx;
        width: 170rpx;
        color: #999;
      }
      > view {
        padding: 16rpx 0;
      }
    }
  }

  .btns {
    margin-top: 20rpx;
    padding: 0 20rpx;
    > view {
      flex-grow: 1;
      line-height: 80rpx;
      border-radius: 40rpx;
      text-align: center;
      font-size: 32rpx;
      background: #e2e2e2;
    }
    .confirm {
      background: #446dfd;
      margin-left: 20rpx;
      color: #fff;
    }
  }
  .popup-box {
    width: 80vw;
    padding: 20rpx;
    border-radius: 10rpx;
    background: #fff;
    .popup-bt {
      border-top: 1px solid #eee;
      padding: 10rpx 0;
      display: flex;

      > div {
        flex: 1;
        width: 0;
        height: 70rpx;
        line-height: 80rpx;
        text-align: center;
        font-size: 32rpx;
      }
      .confirm {
        border-left: 1px solid #eee;
        color: #446dfd;
      }
    }
  }
}
</style>
