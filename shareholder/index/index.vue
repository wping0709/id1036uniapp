<template>
  <view v-if="pageData" class="page-body">
    <div class="top">
      <div v-if="!pageData.level_name && showClose" class="no-shareholder">
        <div class="content flex-x-sb flex-y-center p-l-34 p-r-20">
          <text class="iconfont icon-prompt-fill m-r-18 font-40"> </text>
          <text class="flex-w-1 font-26">
            你还不是股东，满足条件后自动成为股东！
          </text>
          <text @click="showClose = false" class="iconfont icon-close font-40">
          </text>
        </div>
      </div>

      <div class="user-info flex-y-center flex-x-sb">
        <div class="left flex-y-center">
          <image
            class="user-img"
            mode="aspectFill"
            :src="userInfo.avatar_url"
          />
          <div class="left-box">
            <view class="font-600-30">{{ userInfo.nickname }}</view>
            <view v-if="pageData.level_name" class="font-24 opacity-8">{{
              pageData.level_name
            }}</view>
          </div>
        </div>
        <div
          @click="$utils.toUrl('/sales/share-qrcode/share-qrcode')"
          class="right flex-y-center"
        >
          <div class="iconfont icon-QRcode font-40"></div>
          <div class="font-24">二维码</div>
          <div class="iconfont icon-arrow-right"></div>
        </div>
      </div>

      <template v-if="pageData.level_name">
        <div class="top-center flex-col flex-x-center flex-y-center">
          <div class="font-26 m-b-10">总计佣金(元)</div>
          <div
            @click="$utils.toUrl('/shareholder/bonus/bonus')"
            class="font-600-56 m-b-8"
          >
            {{ pageData.total_price }}
          </div>
          <!-- <div class="xinzeng" style="opacity:0;">昨日新增 +0.04</div> -->
        </div>

        <div class="flex-x-sb flex-y-center font-w-600 p-b-50">
          <div class="">
            <div class="flex-y-center m-b-10">
              <text class=""> 已提现 </text>
              <text class="iconfont icon-arrow-right font-w-400"></text>
            </div>
            <div>{{ pageData.cash_price }}</div>
          </div>
          <div @click="$utils.toUrl('/shareholder/a-bonus/a-bonus')" class="">
            <div class="flex-y-center m-b-10">
              <text class=""> 分红佣金 </text>
              <text class="iconfont icon-arrow-right font-w-400"></text>
            </div>
            <div>{{ pageData.price }}</div>
          </div>
          <div
            @click="$utils.toUrl('/shareholder/contribution/contribution')"
            class=""
          >
            <div class="flex-y-center m-b-10">
              <text class=""> 贡献值 </text>
              <text class="iconfont icon-arrow-right font-w-400"></text>
            </div>
            <div>{{ pageData.contribute_value }}</div>
          </div>
        </div>
      </template>
    </div>

    <!-- 股东条件 -->
    <div class="condition">
      <div class="flex-x-sb m-b-24">
        <div class="font-600-30">股东条件</div>
        <div
          @click="$utils.toUrl('/shareholder/analysis/analysis')"
          class="flex-y-center font-24"
          style="color: #ff1b22"
        >
          详解
          <div class="iconfont icon-arrow-right"></div>
        </div>
      </div>

      <div class="color-666">
        股东升级条件，完成对应升级条件升级为股东会员享受股东分 红奖金池。
      </div>

      <div class="condition-list font-24 m-b-24">
        <div class="flex-y-center m-t-26">
          <div class="flex-y-center">
            <div class="dian"></div>
            <div>直推下级</div>
          </div>
          <div class="m-l-40 flex-y-center">
            <div class="color-999">推荐人数</div>
            <!-- <image
              src="@/static/images/shareholder/arrow-bottom.png"
              mode="aspectFill"
              class="tubiao-arrow"
            ></image> -->
          </div>
        </div>
        <div class="flex-y-center m-t-26">
          <div class="flex-y-center">
            <div class="dian"></div>
            <div>下级业绩</div>
          </div>
          <div class="m-l-40 flex-y-center">
            <div class="color-999">人员业绩</div>
            <!-- <image
              src="@/static/images/shareholder/arrow-bottom.png"
              mode="aspectFill"
              class="tubiao-arrow"
            ></image> -->
          </div>
        </div>
        <div class="flex-y-center m-t-26">
          <div class="flex-y-center">
            <div class="dian"></div>
            <div>消费金额</div>
          </div>
          <div class="m-l-40 flex-y-center">
            <div class="color-999">消费情况</div>
            <!-- <image
              src="@/static/images/shareholder/arrow-bottom.png"
              mode="aspectFill"
              class="tubiao-arrow"
            ></image> -->
          </div>
        </div>
      </div>
    </div>

    <!-- 股东福利 -->
    <div v-if="pageData.next_level" class="upgrade-benefits">
      <div class="flex-y-center m-b-30">
        <text class="font-600-30" style="color: #ff1b22">升级锦囊</text>
        <text class="m-l-10 font-24 color-999">基于完成进度为你统计</text>
      </div>

      <div class="font-600-26">
        进度达到100%，可升级为
        <text style="color: #ff1b22"> {{ pageData.next_level.name }} </text>
      </div>

      <div class="flex-y-center m-t-16 p-b-40 m-b-30">
        <text class="font-24 color-666"> 升级进度 </text>
        <div class="m-x-10 flex-w-1">
          <u-line-progress
            :percentage="totalProgress"
            activeColor="#ff1b22"
            height="22rpx"
            :showText="false"
          ></u-line-progress>
        </div>
        <text class="font-w-600 font-24" style="color: #ff1b22">
          {{ totalProgress }}%
        </text>
      </div>

      <template v-if="analysis">
        <!-- 下级人数 -->
        <div v-if="analysis.next_level.push_num > 0" class="item border-b">
          <div
            style="background: #e7f0fe; color: #3a7dfd"
            class="left iconfont icon-sales-center-fill1"
          ></div>
          <div class="content flex-w-1">
            <div class="font-600-30 m-b-8 u-line-1">
              直推下级{{ analysis.next_level.push_num }}人
            </div>
            <div class="flex-y-center font-26">
              <div class="sign">直推下级</div>
              <div class="color-999 m-r-10">完成进度</div>
              <div style="color: #ff1b22">
                +{{
                  progress(analysis.son_users, analysis.next_level.push_num)
                }}%
              </div>
            </div>
          </div>
          <div class="right">
            <div
              @click="$utils.toUrl('/sales/share-qrcode/share-qrcode')"
              class="bt"
              v-if="analysis.son_users < analysis.next_level.push_num"
            >
              去升级
            </div>
            <div v-else style="color: #f0250e; font-size: 24rpx">已完成</div>
          </div>
        </div>

        <!-- 下级业绩 -->
        <div v-if="analysis.next_level.push_price > 0" class="item border-b">
          <div
            style="background: #fef0de; color: #f89328"
            class="left iconfont icon-certified-supplier-fill"
          ></div>
          <div class="content flex-w-1">
            <div class="font-600-30 m-b-8 u-line-1">
              直推下级业绩{{ analysis.next_level.push_price }}元
            </div>
            <div class="flex-y-center font-26">
              <div class="sign">下级业绩</div>
              <div class="color-999 m-r-10">完成进度</div>
              <div style="color: #ff1b22">
                +{{
                  progress(
                    analysis.son_users_consume_amount,
                    analysis.next_level.push_price
                  )
                }}%
              </div>
            </div>
          </div>
          <div class="right">
            <div
              @click="$utils.toUrl('/sales/share-qrcode/share-qrcode')"
              class="bt"
              v-if="
                analysis.son_users_consume_amount <
                analysis.next_level.push_price
              "
            >
              去升级
            </div>
            <div v-else style="color: #f0250e; font-size: 24rpx">已完成</div>
          </div>
        </div>
        <!-- 消费金额 -->
        <div v-if="analysis.next_level.price > 0" class="item border-b">
          <div
            style="background: #fde5dc; color: #f96431"
            class="left iconfont icon-renminbi"
          ></div>
          <div class="content flex-w-1">
            <div class="font-600-30 m-b-8 u-line-1">
              消费金额{{ analysis.next_level.price }}元
            </div>
            <div class="flex-y-center font-26">
              <div class="sign">消费金额</div>
              <div class="color-999 m-r-10">完成进度</div>
              <div style="color: #ff1b22">
                +{{
                  progress(analysis.consume_amount, analysis.next_level.price)
                }}%
              </div>
            </div>
          </div>
          <div class="right">
            <div
              @click="$utils.toUrl('/pages/index/index')"
              class="bt"
              v-if="analysis.consume_amount - 0 < analysis.next_level.price"
            >
              去升级
            </div>
            <div v-else style="color: #f0250e; font-size: 24rpx">已完成</div>
          </div>
        </div>
      </template>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      analysis: '',
      showClose: true,
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
      const res = await this.$requestAll.shareholder.bonusIndex({}, true);
      this.pageData = res.data;
      this.getAnalysis();
    },
    async getAnalysis() {
      const res = await this.$requestAll.shareholder.bonusLevelAnalysis(
        {},
        true
      );
      this.analysis = res.data;
    },
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
    progress(num, total) {
      return function (num, total) {
        let percentage = (num / total) * 100;
        return percentage <= 100 ? percentage.toFixed(2) : '100.00';
      };
    },
    totalProgress() {
      if (!this.analysis) return 0;
      var i = 0,
        progress = 0;

      // 消费金额
      if (this.analysis.next_level.price > 0) {
        let percentage =
          this.analysis.consume_amount / this.analysis.next_level.price;

        progress += percentage <= 100 ? percentage : 1;
        i++;
      }
      // 下级消费金额
      if (this.analysis.next_level.push_price > 0) {
        let percentage =
          this.analysis.son_users_consume_amount /
          this.analysis.next_level.push_price;

        progress += percentage <= 100 ? percentage : 1;
        i++;
      }

      // 下级人数
      if (this.analysis.next_level.push_num > 0) {
        let percentage =
          this.analysis.son_users / this.analysis.next_level.push_num;

        progress += percentage <= 100 ? percentage : 1;
        i++;
      }

      return ((progress / i <= 1 ? progress / i : 1) * 100).toFixed(2);
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  background: #f2f2f2;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
  /*  #ifdef H5  */
  min-height: calc(100vh - 44px);
  /* #endif */
  .top {
    position: relative;
    padding: 0 48rpx 200rpx;
    background: linear-gradient(
      to bottom,
      #ff1b22 0%,
      #ff1b22 70%,
      #f2f2f2 100%
    );
    color: #fff;
    padding-top: 24rpx;

    .no-shareholder {
      height: 84rpx;
      color: #ed9023;
      .content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        background: #fef5dd;
        height: 84rpx;
      }
    }

    .user-info {
      margin-bottom: 50rpx;
      .user-img {
        margin-right: 20rpx;
        width: 76rpx;
        height: 76rpx;
        border-radius: 50%;
      }
    }

    &-center {
      margin-bottom: 40rpx;
      .xinzeng {
        padding: 12rpx 20rpx;
        font-size: 26rpx;
        background: rgba($color: #fff, $alpha: 0.1);
        border-radius: 40rpx;
      }
    }
  }

  .condition {
    position: relative;
    margin: -200rpx 24rpx 24rpx;
    padding: 24rpx;
    background: #fff;
    border-radius: 20rpx;
    &-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .dian {
        width: 8rpx;
        height: 8rpx;
        border-radius: 50%;
        background: #ff1b22;
        margin-right: 10rpx;
      }
      .tubiao-arrow {
        width: 24rpx;
        height: 24rpx;
        margin-left: 8rpx;
      }
    }
  }

  .upgrade-benefits {
    padding: 30rpx 24rpx 0;
    margin: 0 24rpx;
    border-radius: 20rpx;
    background: linear-gradient(to bottom, #ffe2e2 0rpx, #fff 246rpx, #fff);
    .item {
      display: flex;
      align-items: center;
      padding-bottom: 28rpx;
      margin-bottom: 28rpx;
      &:nth-last-child(1) {
        margin-bottom: 28rpx;

        border: 0;
      }
      .left {
        font-size: 50rpx;
        width: 80rpx;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        border-radius: 50%;
      }
      .content {
        margin: 0 20rpx;
        .sign {
          padding: 0 10rpx;
          border: 1px solid rgba($color: #ff1b22, $alpha: 0.6);
          border-radius: 4rpx;
          font-size: 24rpx;
          color: ff1b22;
          margin-right: 10rpx;
          color: #ff1b22;
        }
      }
      .right {
        .bt {
          padding: 8rpx 24rpx;
          background: #ff1b22;
          color: #fff;
          font-size: 24rpx;
          border-radius: 8px;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
