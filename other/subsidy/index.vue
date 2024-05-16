<template>
  <view v-if="subsidyData && !store.is_shenhe" class="body flex-col">
    <div class="money">
      <image
        :src="wxapp_img.recharge.icon_balance_bg"
        mode="aspectFill"
      />
      <view class="money-content">
        <view class="font-32 m-b-20">账户收入</view>
        <view class="font-600-40 m-b-20">{{ subsidyData.money }}</view>
        <view class="btns flex-x-center flex-y-center">
          <view @click="$utils.toUrl('/pages/cash/cash?type=subsidy')"
            >提现</view
          >
          <view @click="$utils.toUrl('/pages/subsidy/cash-detail')">记录</view>
          <view @click="onSwitchShow('showXieyi')" v-if="subsidyData.setting.is_rebate == 1 && subsidyData.setting.apply_status == -1">申请</view>
          <view v-if="subsidyData.setting.is_rebate == 1 && subsidyData.setting.apply_status == 0">审核中</view>
          <view v-if="subsidyData.setting.is_rebate == 1 && subsidyData.setting.apply_status == 2">已拒绝</view>
        </view>
        <view style="padding-top:15rpx;" v-if="subsidyData.setting.is_show == 1">今日商城销售总额：{{subsidyData.setting.now_money}}元</view>
      </view>
    </div>
    <div style="text-align:center;" v-if="subsidyData.setting.is_show_price == 1 || subsidyData.setting.is_show_cash == 1 || subsidyData.setting.is_show_rebate == 1">
        <view style="padding-top:15rpx;" v-if="subsidyData.setting.is_show_price == 1">我的消费总额：{{subsidyData.setting.user_total_price}}元</view>
        <view style="padding-top:15rpx;" v-if="subsidyData.setting.is_show_rebate == 1">我的补贴总额：{{subsidyData.setting.user_total_rebate}}元</view>
        <view style="padding-top:15rpx;" v-if="subsidyData.setting.is_show_cash == 1">我的提现总额：{{subsidyData.setting.user_total_subsidy}}元</view>
    </div>
    <!-- <scroll-view scroll-y class="flex-h-1"> -->
    <view class="scroll-box" v-if="pageData.list.length">
      <view
        class="tixian-item flex-y-center flex-x-sb"
        v-for="(item, index) in pageData.list"
        :key="index"
      >
        <view>
          <view class="font-30 m-b-10">{{ item.desc }}</view>
          <view class="font-24">{{ item.addtime }}</view>
        </view>
        <view
          :style="{
            color: item.status ? '#3fc24c' : 'red',
          }"
          >{{ item.money }}</view
        >
      </view>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </view>
    <view class="scroll-box" v-else>
      <u-empty mode="data" :icon="wxapp_img.empty_data">
      </u-empty>
    </view>
    <u-popup
      :show="showXieyi"
      :safeAreaInsetBottom="false"
      mode="center"
      round="20rpx"
    >
      <view style="width: 80vw">
        <view class="xieyi-title font-center p-y-20">免责协议</view>
        <scroll-view
          scroll-y
          style="max-height: 70vh; min-height: 30vh"
          class="xieyi-content"
        >
          <view class="p-x-20">
            <!-- {{ subsidyData.setting.agreement || '' }} -->
            <rich-text :nodes="subsidyData.setting.agreement"></rich-text>
          </view>
        </scroll-view>
        <view
          class="flex-y-center border-top font-center m-t-20"
          style="line-height: 80rpx"
        >
          <view class="flex-w-1" @click="onSwitchShow('showXieyi')">拒绝</view>
          <view
            @click="onSwitchShow('showXieyi',true)"
            class="flex-w-1 price-color border-left"
            >同意</view
          >
        </view>
      </view>
    </u-popup>
    <!-- </scroll-view> -->
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      subsidyData: '',
      showXieyi: false,
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    // this.get
    this.subsidyIndex();
    this.subsidyList();
  },
  onShow() {},
  methods: {
    async subsidyList() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.subsidy.subsidyList({
        page: this.pageData.page,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
    },
    async subsidyIndex() {
      const res = await this.$requestAll.subsidy.subsidyIndex();
      this.subsidyData = res.data;
    },
    async rebateApply() {
      const res = await this.$requestAll.user.rebateApply();
    },
    onSwitchShow(key, b) {
      console.log(typeof b);
      if (this.showXieyi && b) {
        this[key] = !this[key];
        this.rebateApply()
      } else {
        this[key] = !this[key];
      }
    },
  },
  onReachBottom() {
    this.subsidyList();
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .money {
    height: 320rpx;
    position: relative;
    > image {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 100%;
    }
    .money-content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      text-align: center;
      color: #fff;
      padding: 50rpx 0;
      .btns {
        > view {
          line-height: 2;
          border: 1px solid #fff;
          border-radius: 30rpx;
          padding: 0 20rpx;
          margin-right: 20rpx;
          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }
  }
  .tixian-item {
    margin-top: 20rpx;
    padding: 30rpx;
    background: #fff;
  }
}
</style>
