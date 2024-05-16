<template>
  <view v-if="pageData" class="page-body">
    <div class="color-999">
      当前股东等级为<text class="theme-color">{{
        pageData.now_level.name
      }}</text
      >，完成对应升级条件，即可解锁股东 分红奖金池佣金分红。
    </div>

    <template v-if="pageData.next_level">
      <!-- 直推人数条件 -->
      <div class="page-item" v-if="pageData.next_level.push_num > 0">
        <div class="page-item-column1 flex-y-center flex-x-sb m-b-14">
          <div class="font-600-30">直推下级</div>
          <div @click="$utils.toUrl('/sales/share-qrcode/share-qrcode')" class="bt font-24">
            {{
              pageData.son_users > pageData.next_level.push_num
                ? '已达成'
                : '去完成'
            }}
          </div>
        </div>

        <div class="font-48 m-b-10">
          直推{{ pageData.next_level.push_num }}人
        </div>
        <!-- <div class="m-b-30 color-999 flex-y-center">
        <template v-if="i != 2">
          <image
            src="@/static/images/shareholder/arrow-top.png"
            style="width: 24rpx; height: 24rpx"
          ></image>
          <text class="m-l-10">较比昨日有所上升</text>
        </template>
        <template v-else>
          <image
            src="@/static/images/shareholder/arrow-bottom.png"
            style="width: 24rpx; height: 24rpx"
          ></image>
          <text class="m-l-10">较比昨日有所下降</text>
        </template>
      </div> -->

        <div class="color-999 font-24 m-b-30">
          推荐下级助力升级条件，升级为股东会员享受分销股东分红奖 金池等佣金。
        </div>

        <div class="font-600-24 m-b-10">
          直推人数<text class="theme-color">{{ pageData.son_users }}</text
          >/{{ pageData.next_level.push_num }}人
        </div>

        <div class="flex-y-center">
          <text class="font-24 color-666"> 升级进度 </text>
          <div class="m-x-10 flex-w-1">
            <u-line-progress
              :percentage="
                progress(pageData.son_users, pageData.next_level.push_num)
              "
              activeColor="#ff1b22"
              height="22rpx"
              :showText="false"
            ></u-line-progress>
          </div>
          <text class="font-w-600 font-24" style="color: #ff1b22">
            {{ progress(pageData.son_users, pageData.next_level.push_num) }}%
          </text>
        </div>
      </div>

      <!-- 下级业绩金额条件 -->
      <div
        class="page-item"
        v-if="pageData.next_level.push_price > 0"
      >
        <div class="page-item-column1 flex-y-center flex-x-sb m-b-14">
          <div class="font-600-30">下级业绩</div>
          <div @click="$utils.toUrl('/sales/share-qrcode/share-qrcode')" class="bt font-24">
            {{
              pageData.son_users_consume_amount > pageData.next_level.push_price
                ? '已达成'
                : '去完成'
            }}
          </div>
        </div>

        <div class="font-48 m-b-10">
          直推下级业绩,达到{{ pageData.next_level.push_price }}元
        </div>
        <!-- <div class="m-b-30 color-999 flex-y-center">
        <template v-if="i != 2">
          <image
            src="@/static/images/shareholder/arrow-top.png"
            style="width: 24rpx; height: 24rpx"
          ></image>
          <text class="m-l-10">较比昨日有所上升</text>
        </template>
        <template v-else>
          <image
            src="@/static/images/shareholder/arrow-bottom.png"
            style="width: 24rpx; height: 24rpx"
          ></image>
          <text class="m-l-10">较比昨日有所下降</text>
        </template>
      </div> -->

        <div class="color-999 font-24 m-b-30">
          推荐下级助力升级条件，升级为股东会员享受分销股东分红奖 金池等佣金。
        </div>

        <div class="font-600-24 m-b-10">
          直推下级业绩<text class="theme-color">{{
            pageData.son_users_consume_amount
          }}</text
          >/{{ pageData.next_level.push_price }}元
        </div>

        <div class="flex-y-center">
          <text class="font-24 color-666"> 升级进度 </text>
          <div class="m-x-10 flex-w-1">
            <u-line-progress
              :percentage="
                progress(
                  pageData.son_users_consume_amount,
                  pageData.next_level.push_price
                )
              "
              activeColor="#ff1b22"
              height="22rpx"
              :showText="false"
            ></u-line-progress>
          </div>
          <text class="font-w-600 font-24" style="color: #ff1b22">
            {{
              progress(
                pageData.son_users_consume_amount,
                pageData.next_level.push_price
              )
            }}%
          </text>
        </div>
      </div>

      <!-- 消费金额 -->
      <div class="page-item" v-if="pageData.next_level.price > 0">
        <div class="page-item-column1 flex-y-center flex-x-sb m-b-14">
          <div class="font-600-30">消费金额</div>
          <div @click="$utils.toUrl('/pages/index/index')" class="bt font-24">
            {{
              pageData.consume_amount-0 > pageData.next_level.price
                ? '已达成'
                : '去完成'
            }}
          </div>
        </div>

        <div class="font-48 m-b-10">
          消费金额,达到{{ pageData.next_level.price }}元
        </div>
        <!-- <div class="m-b-30 color-999 flex-y-center">
        <template v-if="i != 2">
          <image
            src="@/static/images/shareholder/arrow-top.png"
            style="width: 24rpx; height: 24rpx"
          ></image>
          <text class="m-l-10">较比昨日有所上升</text>
        </template>
        <template v-else>
          <image
            src="@/static/images/shareholder/arrow-bottom.png"
            style="width: 24rpx; height: 24rpx"
          ></image>
          <text class="m-l-10">较比昨日有所下降</text>
        </template>
      </div> -->

        <div class="color-999 font-24 m-b-30">
          推荐下级助力升级条件，升级为股东会员享受分销股东分红奖 金池等佣金。
        </div>

        <div class="font-600-24 m-b-10">
          消费金额<text class="theme-color">{{ pageData.consume_amount }}</text
          >/{{ pageData.next_level.price }}元
        </div>

        <div class="flex-y-center">
          <text class="font-24 color-666"> 升级进度 </text>
          <div class="m-x-10 flex-w-1">
            <u-line-progress
              :percentage="
                progress(pageData.consume_amount, pageData.next_level.price)
              "
              activeColor="#ff1b22"
              height="22rpx"
              :showText="false"
            ></u-line-progress>
          </div>
          <text class="font-w-600 font-24" style="color: #ff1b22">
            {{ progress(pageData.consume_amount, pageData.next_level.price) }}%
          </text>
        </div>
      </div>
    </template>

    <!-- 当前会员等级 -->
    <!-- <div v-if="pageData.now_level" class="page-item">
      <div class="flex-y-center flex-x-sb p-b-24 border-b">
        <div class="font-600-30">{{ pageData.now_level.name }}</div>
        <div class="theme-color font-24">已达成</div>
      </div>

      <div class="m-t-24 flex-x-center flex-y-center">
        <div class="flex-y-center">
          <div class="font-30">分红比例</div>
          <div class="sign m-l-10">已达成</div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          {{ pageData.now_level.bonus_ratio }}%
        </div>
      </div>

      <div
        v-if="pageData.now_level.price"
        class="m-t-24 flex-x-center flex-y-center"
      >
        <div class="flex-y-center">
          <div class="font-30">消费金额</div>
          <div
            v-if="pageData.consume_amount-0 > pageData.now_level.price"
            class="sign m-l-10"
          >
            已达成
          </div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          消费金额{{ pageData.now_level.price }}元
        </div>
      </div>

      <div
        v-if="pageData.now_level.push_num > 0"
        class="m-t-24 flex-x-center flex-y-center"
      >
        <div class="flex-y-center">
          <div class="font-30">直推下级</div>
          <div class="sign m-l-10">已达成</div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          {{ pageData.now_level.push_num }}人，达到{{ pageData.now_level.name }}
        </div>
      </div>

      <div
        v-if="pageData.now_level.push_price"
        class="m-t-24 flex-x-center flex-y-center"
      >
        <div class="flex-y-center">
          <div class="font-30">直推下级业绩</div>
          <div class="sign m-l-10">已达成</div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          {{ pageData.now_level.push_price }}元
        </div>
      </div>

      <div class="m-t-30 color-999">
        推荐下级助力升级条件升级为股东会员享受分销股东分红奖金 池等佣金。
      </div>
    </div> -->

    <!-- 下级会员等级 -->
    <!-- <div v-if="pageData.next_level" class="page-item">
      <div class="flex-y-center flex-x-sb p-b-24 border-b">
        <div class="font-600-30">{{ pageData.next_level.name }}</div>
        <div class="theme-color font-24">待解锁</div>
      </div>

      <div class="m-t-24 flex-x-center flex-y-center">
        <div class="flex-y-center">
          <div class="font-30">分红比例</div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          {{ pageData.next_level.bonus_ratio }}%
        </div>
      </div>

      <div
        v-if="pageData.next_level.price"
        class="m-t-24 flex-x-center flex-y-center"
      >
        <div class="flex-y-center">
          <div class="font-30">消费金额</div>
          <div
            v-if="pageData.consume_amount-0 > pageData.next_level.price"
            class="sign m-l-10"
          >
            已达成
          </div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          消费金额{{ pageData.next_level.price }}元
        </div>
      </div>

      <div
        v-if="pageData.next_level.push_num > 0"
        class="m-t-24 flex-x-center flex-y-center"
      >
        <div class="flex-y-center">
          <div class="font-30">直推下级</div>
          <div
            v-if="pageData.son_users > pageData.next_level.push_num"
            class="sign m-l-10"
          >
            已达成
          </div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          {{ pageData.next_level.push_num }}人，达到{{
            pageData.next_level.name
          }}
        </div>
      </div>

      <div
        v-if="pageData.next_level.push_price"
        class="m-t-24 flex-x-center flex-y-center"
      >
        <div class="flex-y-center">
          <div class="font-30">直推下级业绩</div>
          <div
            v-if="
              pageData.son_users_consume_amount > pageData.next_level.push_price
            "
            class="sign m-l-10"
          >
            已达成
          </div>
        </div>
        <div class="flex-w-1 font-600-30 font-right">
          {{ pageData.next_level.push_price }}元
        </div>
      </div>

      <div class="m-t-30 color-999">
        推荐下级助力升级条件升级为股东会员享受分销股东分红奖金 池等佣金。
      </div>
    </div> -->
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.shareholder.bonusLevelAnalysis(
        {},
        true
      );
      this.pageData = res.data;
    },
  },
  computed: {
    progress(num, total) {
      return function (num, total) {
        return ((num / total) * 100).toFixed(2);
      };
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
  padding: 24rpx;
  padding-bottom: env(safe-area-inset-bottom);
  // #ifdef H5
  min-height: calc(100vh - 44px);
  // #endif
  font-size: 26rpx;

  .theme-color {
    color: #ff1b22;
  }

  .page-item {
    margin-top: 24rpx;
    background: #fff;
    border-radius: 20rpx;
    padding: 24rpx;

    &-column1 {
      .bt {
        padding: 8rpx 24rpx;
        color: #ff1b22;
        border: 1px solid #ff1b22;
        border-radius: 8rpx;
        font-weight: 600;
        font-size: 24rpx;
      }
    }

    > .m-t-24 {
      .sign {
        padding: 0 10rpx;
        font-size: 24rpx;
        color: #f0250e;
        border: 1px solid rgba($color: #f0250e, $alpha: 0.6);
        border-radius: 4rpx;
      }
    }
  }
}
</style>
