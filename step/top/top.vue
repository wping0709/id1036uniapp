<template>
  <view class="body flex-col env-bottom">
    <div
      class="top"
      :style="{
        background: `url(${
          store.option.step.ranking_pic
            ? store.option.step.ranking_pic
            : 'http://tianxin100we10.cyyvip.com/web/uploads/image/store_1/31632a49456b0363868da526b2a5c74bbcca511a.jpg'
        }) no-repeat center`,
        backgroundSize: '100%',
      }"
    >
      <view class="tabs">
        <div @click="switchTab(1)" :class="status == 1 && 'check'" class="tab">
          好友排行
        </div>
        <div @click="switchTab(2)" :class="status == 2 && 'check'" class="tab">
          全国排行
        </div>
      </view>
    </div>

    <div class="page-list">
      <div class="page-item flex-y-center top1 p-20 m-b-20">
        <div class="content flex-w-1 flex-y-center">
          <image
            class="user-img"
            :src="user.user.avatar_url"
            mode="aspectFill"
          ></image>
          <view class="flex-w-1">
            <view class="font-600-30">{{ user.user.nickname }}</view>
            <view class="font-26 color-999 m-t-10">第{{ user.raking }}名</view>
          </view>
        </div>

        <div class="right">
          <view class="font-600-30">{{
            setting.step_type == 0 ? user.step_currency : user.total_integral
          }}</view>
          <view class="font-26 color-999 m-t-10">
            {{
              setting.step_type == 0
                ? store.option.step.currency_name
                  ? store.option.step.currency_name
                  : "活力币"
                : "步数积分"
            }}数
          </view>
        </div>
      </div>

      <div
        v-for="(item, i) in pageData.list"
        :key="i"
        class="page-item flex-y-center top1 p-20"
      >
        <div class="left m-r-20">
          <image
            v-if="i == 0"
            :src="wxapp_img.step.top1"
            mode="aspectFill"
          ></image>
          <image
            v-else-if="i == 1"
            :src="wxapp_img.step.top2"
            mode="aspectFill"
          ></image>
          <image
            v-else-if="i == 2"
            :src="wxapp_img.step.top3"
            mode="aspectFill"
          ></image>

          <view v-else>{{ i + 1 }}</view>
        </div>

        <div class="content flex-w-1 flex-y-center">
          <image
            class="user-img"
            :src="item.user.avatar_url"
            mode="aspectFill"
          ></image>
          <view class="flex-w-1">
            <view class="font-600-30">{{ item.user.nickname }}</view>
            <view class="font-26 color-999 m-t-10">第{{ i + 1 }}名</view>
          </view>
        </div>

        <div class="right">
          <view class="font-600-30">{{
            setting.step_type == 0 ? item.step_currency : item.total_integral
          }}</view>
          <view class="font-26 color-999 m-t-10">
            {{
              setting.step_type == 0
                ? store.option.step.currency_name
                  ? store.option.step.currency_name
                  : "活力币"
                : "步数积分"
            }}数
          </view>
        </div>
      </div>
    </div>
    <div>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </div>

    <!-- #ifdef MP-WEIXIN -->
    <ad v-if="ad_data.status == 1" :unit-id="ad_data.unit_id"></ad>
    <!-- #endif -->
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: "loadmore",
      },
      status: 1,
      user: "",
      stepData: "",
      setting: "",
      ad_data: {},
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.getList(false);
  },
  onShow() {
    this.stepData = uni.getStorageSync("stepData");
  },
  methods: {
    async getList(isReset) {
      if (isReset) {
        this.pageData = this.$options.data().pageData;
      }
      if (this.pageData.status == "nomore") return;
      const res = await this.$requestAll.step.ranking(
        {
          page: this.pageData.page,
          status: this.status,
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.user = res.data.user;
      this.setting = res.data.setting;
      this.ad_data = res.data.ad_data;
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? "nomore" : "loadmore";
    },
    switchTab(i) {
      this.status = i;
      this.getList(true);
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  .top {
    position: relative;
    height: 400rpx;

    .tabs {
      position: absolute;
      bottom: 0%;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.2);

      display: flex;
      align-items: center;
      justify-content: space-around;
      font-size: 30rpx;

      .tab {
        flex: 1;
        width: 0;
        text-align: center;
        color: #f5f5f5;
        font-style: 32rpx;
        line-height: 90rpx;
      }

      .check {
        position: relative;
        color: #fff;

        &::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translate(-50%, 50%) rotate(45deg);
          border: 10rpx solid #fff;
        }
      }
    }
  }

  .page-item {
    background: #fff;
    symbols: 20rpx;

    .left {
      > image {
        width: 50rpx;
        height: 50rpx;
      }

      > view {
        width: 50rpx;
        line-height: 50rpx;
        text-align: center;
        font-size: 40rpx;
      }
    }

    .user-img {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      border: 1px solid #f09b48;
    }
  }
}
</style>
