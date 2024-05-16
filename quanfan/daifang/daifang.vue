<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <div class="header">
      <view class="font-32">
        <template v-if="pageType == 'daifang'"> 待释放 </template>
        <template v-else> 已释放 </template>
      </view>

      <view class="font-40 m-t-10">
        {{ pageType == 'daifang' ? pageData.dai : pageData.yi || 0 }}元
      </view>
    </div>

    <div class="date-m">
      <div @click="switchDate(-1)" class="iconfont icon-arrow-left"></div>
      <div class="center">{{ pageData.date }}</div>
      <div @click="switchDate(+1)" class="iconfont icon-arrow-right"></div>
    </div>

    <div
      class="page-item flex-y-center p-20"
      v-for="(item, i) in pageData.list"
      :key="i"
    >
      <view class="left flex-w-1">
        <view class="">{{ item.content }}</view>
        <view class="font-size-24">{{ item.date }}</view>
      </view>
      <view
        class="right font-center"
        :style="{
          color: pageType == 'daifang' ? '#3fc24c' : 'red',
        }"
      >
        <view class="">{{ item.price || 0 }}</view>

        <view v-if="pageType == 'daifang'" class="font-24"
          >待释放金额{{ item.zonge }}</view
        >
        <view v-else class="font-24">待释放金额{{ item.yifan || 0 }}</view>
      </view>
    </div>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      pageType: 'daifang',
      pageData: '',
    };
  },
  onLoad(params) {
    this.pageType = params.pageType;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(date) {
      if (this.pageType == 'daifang') {
        var res = await this.$requestAll.recharge.daifang(
          {
            date: date ? date : '',
          },
          true
        );
      } else {
        var res = await this.$requestAll.recharge.yifang(
          {
            date: date ? date : '',
          },
          true
        );
      }
      this.pageData = res.data;
    },
    switchDate(type) {
      let dateArr = this.pageData.date.split('-');
      let newY = dateArr[0];
      let newM = dateArr[1];
      if (newM <= 1 && type == -1) {
        newY = newY - 1;
        newM = 12;
      } else if (newM >= 12 && type == +1) {
        newY = Number(newY) + 1;
        newM = 1;
      } else {
        newM = parseInt(newM) + type;
      }
      let newDate = `${newY}-${newM < 10 ? '0' + newM : newM}`;
      console.log(newDate);
      this.loadData(newDate);
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

  .header {
    background: #fc0e0e;
    color: #fff;
    padding: 48rpx 0;
    text-align: center;
  }

  .date-m {
    position: sticky;
    top: 0;
    background: #fff;
    font-size: 32rpx;

    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 80rpx;

    > .iconfont {
      font-size: 46rpx;
      padding: 0 30rpx;
    }
  }

  .page-item {
    border-bottom: 1px solid #f2f2f2;

    &:nth-last-child(1) {
      border: 0;
    }
  }
}
</style>
