<template>
  <view class="body flex-col">
    <div
      :style="{
        background: 'url(' + wxapp_img.detail_bg + ') no-repeat center',
        backgroundSize: '100% 100%',
      }"
      class="top p-x-20 flex-col flex-x-center"
    >
      <view class="font-30">
        账户{{
          setting.step_type == 0 ? 
            (store.option.step.currency_name
              ? store.option.step.currency_name
              : '活力币') : '步数积分'
        }}
      </view>
      <view class="m-t-10 font-600-40">{{ setting.step_type == 0 ? user.step_currency : user.total_integral }}个</view>
    </div>

    <div class="tabs">
      <div @click="switchTab(1)" :class="['tab', tabIndex == 1 && 'check']">
        收入
      </div>
      <div @click="switchTab(2)" :class="['tab', tabIndex == 2 && 'check']">
        支出
      </div>
    </div>

    <scroll-view scroll-y="true" class="flex-h-1">
      <view class="scroll-list env-bottom">
        <div
          class="item flex-y-center p-20 bg-fff m-t-20"
          v-for="(item, i) in list"
          :key="i"
        >
          <div class="left flex-w-1">
            <view class="font-30 m-b-10">步数兑换</view>
            <view class="font-24">{{ item.create_time }}</view>
          </div>
          <div class="right">
            {{ item.status == 1 ? '+' : '-' }}{{ item.step_currency }}
          </div>
        </div>

        <u-loadmore :status="status"></u-loadmore>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tabIndex: 1,
      user: '',
      list: '',
      page: 1,
      status: 'loadmore',
      setting: ''
    };
  },
  onLoad() {
    this.getData();
  },
  methods: {
    switchTab(index) {
      this.tabIndex = index;
      this.getData(true);
    },
    async getData(isReset) {
      if (isReset) {
        let { list, page, status } = this.$options.data();
        this.list = list;
        this.page = page;
        this.status = status;
      }
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.step.log(
        {
          status: this.tabIndex,
          page: 1,
        },
        true
      );
      this.setting = res.data.setting;
      this.page++;
      !this.user && (this.user = res.data.user);
      this.list = res.data.log;
      this.status = res.data.log.length < 10 ? 'nomore' : 'loadmore';
    },
  },
  computed: {
    store() {
      return this.$store.getters['SHOP_CONFIG'].store || false;
    },
  },
};
</script>

<style lang="scss">
.body {
  height: 100vh;
  background: #f5f5f5;
}

.top {
  height: 160rpx;
  color: #fff;
}

.tabs {
  display: flex;
  background: #fff;

  .tab {
    flex: 1;
    width: 0;
    font-size: 30rpx;
    line-height: 100rpx;
    text-align: center;
  }

  .check {
    position: relative;
    color: red;

    &:before {
      content: '';
      position: absolute;
      bottom: 10rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 40rpx;
      height: 4rpx;
      border-radius: 2rpx;
      background-color: red;
    }
  }
}
</style>
