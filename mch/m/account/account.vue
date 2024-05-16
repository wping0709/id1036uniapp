<template>
  <div class="body" v-if="account && !store.is_shenhe">
    <div class="info">
      <img :src="account.header_bg" class="bg" />
      <div class="info-txt">
        <div class="d1">账户余额(元)</div>
        <div class="dc">{{ account.account_money }}</div>
        <view class="tixian-bt" @click="$utils.toUrl('/pages/cash/cash?type=mch')">提现</view>
      </div>
    </div>
    <div class="menu-group">
      <view
        @click="$utils.toUrl('/mch/m/account-log/account-log')"
        class="menu-item"
      >
        <div class="fl">收支记录</div>
        <div class="fr">
          <text class="iconfont icon-arrow-right"></text>
        </div>
      </view>
      <view @click="$utils.toUrl('/mch/m/cash-log/cash-log')" class="menu-item">
        <div class="fl">提现记录</div>
        <div class="fr">
          <text class="iconfont icon-arrow-right"></text>
        </div>
      </view>
    </div>
    <div class="menu-group">
      <view
        @click="$utils.toUrl('/mch/m/settle-detail/settle-detail?settle_type=0')"
        class="menu-item"
      >
        <div class="fl">未结算金额</div>
        <div class="fr flex-y-center">
          <span>￥{{ account.no_settle_price }}</span>
          <text class="iconfont icon-arrow-right"></text>
        </div>
      </view>
      <view
        @click="$utils.toUrl('/mch/m/settle-detail/settle-detail?settle_type=1')"
        class="menu-item"
      >
        <div class="fl">已结算金额</div>
        <div class="fr flex-y-center">
          <span>￥{{ account.settle_price }}</span>
          <text class="iconfont icon-arrow-right"></text>
        </div>
      </view>
      <view class="menu-item">
        <div class="fl">今日订单数量</div>
        <div class="fr flex-y-center">
          <span>{{ account.today_settle_num }}</span>
        </div>
      </view>
      <view class="menu-item">
        <div class="fl">今日订单金额</div>
        <div class="fr flex-y-center">
          <span>￥{{ account.today_settle_price }}</span>
        </div>
      </view>
    </div>
    <div class="footer">
      <div class="sm-btn" @click="show_modal = true">交易手续费说明</div>
    </div>

    <u-transition :show="show_modal" mode="fade">
      <div class="show-modal">
        <div class="show-modal-body">
          <div class="show-modal-head">交易手续费说明</div>
          <div class="show-modal-main">
            <p>{{ account.desc }}</p>
          </div>
          <div class="show-modal-btm" @click="show_modal = false">确定</div>
        </div>
      </div>
    </u-transition>
  </div>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      account: '',
      page: 1,
      status: 'loadmore',
      show_modal: false,
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.mch.userAccount({}, true);
      this.account = res.data;
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
}
.info {
  position: relative;
  width: 100%;
  height: 160*2rpx;
  color: #fff;
  padding: 24*2rpx 0;
  box-sizing: border-box;
  margin-bottom: 10*2rpx;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 160*2rpx;
  }
  .info-img {
    position: absolute;
    right: 0;
    top: 24*2rpx;
    width: 18*2rpx;
    height: 18*2rpx;
    margin-right: 10*2rpx;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .info-txt {
    position: relative;

    text-align: center;
    .d1 {
      line-height: 16*2rpx;
    }
    .dc {
      margin: 14*2rpx 0 16*2rpx;
      font-size: 26*2rpx;
      line-height: 36*2rpx;
      font-weight: 600;
    }
    .tixian-bt {
      width: 72*2rpx;
      display: inline-block;
      height: 28*2rpx;
      line-height: 28*2rpx;
      border-radius: 14*2rpx;
      border: 1*2rpx solid #fff;
      color: #fff;
    }
  }
}
.menu-group {
  background-color: #fff;
  margin-bottom: 10*2rpx;
  .menu-item {
    box-sizing: content-box;
    background: #fff;
    height: 20*2rpx;
    line-height: 20*2rpx;
    border-bottom: 1*2rpx solid #eee;
    padding: 12*2rpx 8*2rpx 12*2rpx 12*2rpx;
    display: block;
    .pointer {
      width: 14*2rpx;
      height: 14*2rpx;
      margin-left: 4*2rpx;
      display: inline-block;
      vertical-align: middle;
    }
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding-bottom: 28*2rpx;
  .sm-btn {
    font-size: 12*2rpx;
    padding: 6*2rpx;
    display: inline-block;
    color: #397ed3;
  }
}
.show-modal {
  position: fixed;
  top: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  height: 100%;
  max-width: 768*2rpx;
  z-index: 999;
  .show-modal-body {
    position: absolute;
    background-color: #fff;
    width: 260*2rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    -webkit-transform: translate(-50%, -50%);
    text-align: center;
    letter-spacing: 1*2rpx;
    border-radius: 6*2rpx;
    overflow: hidden;
  }
  .show-modal-head {
    line-height: 52*2rpx;
    font-size: 15*2rpx;
    font-weight: bold;
  }
  .show-modal-main {
    padding: 0 12*2rpx 20*2rpx;
    color: #888;
  }
}
.show-modal-btm {
  height: 44*2rpx;
  line-height: 44*2rpx;
  color: #ff4544;
  border-top: 1*2rpx solid #eee;
}
</style>
