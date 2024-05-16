<template>
  <view v-if="pageData" class="page-body">
    <div
      class="top flex-col flex-x-center flex-y-center font-30 color-fff"
      :style="{
        background: `url(${wxapp_img.step.join_bg}) no-repeat center`,
        backgroundSize: '100%',
      }"
    >
      <view class="flex-x-sa">
        <text>{{ pageData.list.name }}</text>
        <text class="m-l-10">{{ pageData.list.step_num }}步挑战赛</text>
      </view>
      <view>比赛时间：{{ pageData.list.open_date }} 00:00-23:59</view>
    </div>

    <div class="yajin font-center">
      <view class="color-666"
        >使用{{
          store.option.step.currency_name
            ? store.option.step.currency_name
            : '活力币'
        }}参赛</view
      >
      <view>
        <text class="font-60" style="color: #ff9d1e">{{
          pageData.list.bail_currency
        }}</text>
        <text>个</text>
      </view>
    </div>

    <view class="bg-fff p-b-40 m-t-20">
      <div class="title p-30 border-b">参赛步骤</div>
      <view class="flex-x-sb p-x-40 m-t-40">
        <view class="mark">1</view>
        <view class="m-l-20 flex-w-1">
          <view class="font-32">报名参赛</view>
          <view class="color-666">
            使用{{ pageData.list.bail_currency }}个{{
              store.option.step.currency_name
                ? store.option.step.currency_name
                : '活力币'
            }}参赛
          </view>
        </view>
      </view>

      <view class="flex-x-sb p-x-40 m-t-40">
        <view class="mark">2</view>
        <view class="m-l-20 flex-w-1">
          <view class="font-32"
            >比赛日行走达到{{ pageData.list.step_num }}步</view
          >
          <view class="color-666">
            比赛日完成并提交{{ pageData.list.step_num }}步行走
          </view>
        </view>
      </view>

      <view class="flex-x-sb p-x-40 m-t-40">
        <view class="mark">3</view>
        <view class="m-l-20 flex-w-1">
          <view class="font-32">
            获得{{
              store.option.step.currency_name
                ? store.option.step.currency_name
                : '活力币'
            }}奖励
          </view>
          <view class="color-666">
            挑战结束，达标用户可平分奖池{{
              store.option.step.currency_name
                ? store.option.step.currency_name
                : '活力币'
            }}
          </view>
        </view>
      </view>
    </view>

    <div class="fixed-bottom">
      <div class="submit">
        <div @click="submit" class="bt">立即报名</div>
      </div>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      id: '',
    };
  },
  onLoad(params) {
    this.activity_id = params.id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.step.defaultActivityDetail(
        {
          activity_id: this.activity_id,
        },
        true
      );
      this.pageData = res.data;
    },
   async submit() {
     const res = await this.$requestAll.step.defaultActivityJoin({
       activity_id: this.activity_id
     },true)
     let dateArr = this.pageData.list.open_date.split('.')
    this.$utils.toUrl(`/step/dare/dare?open_date=${dateArr[1]}/${dateArr[2]}&join=true`)
    }
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
}
.yajin {
  margin: -20rpx 20rpx 0;
  border-radius: 20rpx;
  background: #fff;
  min-height: 200rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.mark {
  width: 40rpx;
  height: 40rpx;
  text-align: center;
  line-height: 40rpx;
  background: #f56c1e;
  border-radius: 30rpx;
  font-size: 30rpx;
  color: #fff;
}
.top {
  height: 200rpx;
  padding: 0 20rpx;
}
.fixed-bottom {
  box-sizing: content-box;
  height: 120rpx;
  padding-bottom: env(safe-area-inset-bottom);

  .submit {
    box-sizing: content-box;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #fff;
    height: 120rpx;
    padding-bottom: env(safe-area-inset-bottom);
    .bt {
      margin: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      text-align: center;
      color: #fff;
      font-size: 32rpx;
      border-radius: 40rpx;
      background: linear-gradient(to right, #ff9f1f, #ffb71f);
    }
  }
}
</style>
