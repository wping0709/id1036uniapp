<template>
  <view v-if="pageData" class="page-body">
    <div class="page-top bg-fff bdrd-20 p-t-40 p-x-24">
      <div class="font-center p-b-30">
        <div class="font-26">总计佣金(元)</div>
        <div class="font-w-600" style="font-size: 68rpx">
          {{ pageData.price }}
        </div>
      </div>

      <div class="flex-y-center flex-x-sa p-b-60">
        <div class="font-center">
          <div class="color-999 font-26">预计分红佣金</div>
          <div class="font-600-38" style="color: #299b76">
            {{ pageData.avg_price }}
          </div>
        </div>
      </div>
    </div>

    <!-- 流水明细 -->
    <div class="detail p-24 bg-fff bdrd-20 m-t-24 flex-col">
      <div class="title flex-y-center flex-x-sb">
        <div class="left font-600-30">佣金明细</div>
        <div class="right">
          <div :class="status && 'active'" @click="showStatus = !showStatus">
            <text> 交易类型 </text>
            <text class="iconfont icon-arrow-bottom"> </text>
          </div>

          <div v-if="showStatus" class="fold-box">
            <div
              @click="clickStatus(0)"
              :class="['border-b p-y-24', status == 0 && 'active']"
            >
              全部
            </div>
            <div
              @click="clickStatus(1)"
              :class="['border-b p-y-24', status == 1 && 'active']"
            >
              获得
            </div>
            <div
              @click="clickStatus(2)"
              :class="['border-b p-y-24', status == 2 && 'active']"
            >
              扣除
            </div>
          </div>
        </div>
      </div>

      <view>
        <div v-if="pageData.bonus_log.length">
          <div
            v-for="(item, i) in pageData.bonus_log"
            :key="i"
            class="item flex m-t-50"
          >
            <div class="left">
              <text v-if="item.status == 1" style="color: #ff1b22">收入</text>
              <text v-else style="color: #3678f2">支出</text>
            </div>
            <div class="content flex-w-1 m-x-24">
              <div>{{ item.desc }}</div>
              <div class="color-999 font-24">
                {{ $u.timeFormat(item.addtime, 'yyyy-mm-dd hh:MM:ss') }}
              </div>
            </div>
            <div class="right font-right">
              <div>{{item.status == 1 ? '+': '-'}}{{item.money}}</div>
              <div class="color-999 font-24">已到账</div>
            </div>
          </div>
        </div>
        <u-empty v-else mode="data"></u-empty>
      </view>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      showStatus: false,
      status: 0,
    };
  },
  onLoad() {
    uni.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff1b22',
    });
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.shareholder.bonusListList(
        {
          status: this.status,
        },
        true
      );
      this.pageData = res.data;
    },
    clickStatus(status) {
      this.status = status;
      this.loadData();
      this.showStatus = false;
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  background: linear-gradient(
    to bottom,
    #ff1b22 0rpx,
    #fff 238rpx,
    #f2f2f2 300rpx
  );
  min-height: 100vh;
  padding: 24rpx;
  padding-bottom: env(safe-area-inset-bottom);
  // #ifdef H5
  min-height: calc(100vh - 44px);
  // #endif

  .theme-color {
    color: #ff1b22;
  }

  .detail {
    height: 1000rpx;

    .title {
      .right {
        position: relative;
        .fold-box {
          position: absolute;
          right: 0;
          top: calc(100% + 24rpx);
          z-index: 9;
          min-width: 340rpx;
          padding: 0 24rpx;
          background: #fff;
          border-radius: 10rpx;
          box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, 0.16);
          > div:nth-last-child(1) {
            border: 0;
          }

          &::after {
            content: '';
            border: 12rpx solid #fff;
            border-top-color: transparent;
            border-left-color: transparent;
            border-right-color: transparent;
            position: absolute;
            right: 60rpx;
            top: 0;
            transform: translateY(-100%);
          }
        }
      }
    }
  }

  .active {
    color: #ff1b22;
  }
}
</style>
