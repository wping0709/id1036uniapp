<template>
  <view v-if="pageData" class="body">

    <div class="maimbox">
      <image
        :src="wxapp_img.icon_register_head"
        style=""
        alt=""
        mode="aspectFill"
      />
      <div class="maimbox-content">
        <image
          v-if="!pageData.today"
          @click="calendarChange(currentDate)"
          style="width: 308rpx; height: 308rpx"
          mode="aspectFill"
          :src="wxapp_img.icon_register_sign_in"
        />
        <view v-else class="current-box font-center font-30 color-fff">
          <view>已连续签到</view>
          <view class="qiandao-day"
            >{{ pageData.register && pageData.register.continuation
            }}<text class="m-l-20 font-30 color-fff">天</text></view
          >
        </view>
        <view class="font-center font-30 color-fff">
          今日签到获得
          <text class="font-600" style="color: rgb(255, 222, 0)">{{
            pageData.setting.register_integral
          }}</text>
          积分
        </view>
        <view class="font-center font-24 m-t-20 color-fff">
          连续签到{{ pageData.setting.register_continuation }}天有惊喜哦
        </view>
      </div>
      <div class="guize" @click="showGuize = true">规则</div>
    </div>

    <div class="content">
      <WCalendar
        type="sign"
        :defaultDate="pageData.registerTime"
        @change="calendarChange"
      ></WCalendar>
    </div>

    <!-- 规则弹框 -->
    <u-popup
      :show="showGuize"
      round="10"
      closeable
      @close="showGuize = false"
      mode="center"
      safeAreaInsetBottom
    >
      <view class="guize-popup" style="width: 600rpx">
        <view class="popup-title font-600 font-36 font-center">签到规则</view>
        <view class="popup-content">
          <view
            v-for="(item, index) in pageData.setting.register_rule"
            :key="index"
            >{{ item }}</view
          >
        </view>
      </view>
    </u-popup>
    <!-- 签到成功弹框 -->
    <u-popup
      :show="showSuccess"
      round="10"
      @close="showSuccess = false"
      mode="center"
      safeAreaInsetBottom
    >
      <view class="guize-popup" style="width: 600rpx">
        <image
          class="title-img"
          :src="wxapp_img.jiangli"
          mode="widthFix"
        />
        <view class="font-center font-30 qiandao-content">
          <view>
            连续签到
            <text style="color: red">{{ pageData.register && pageData.register.continuation }}</text>
            天
          </view>
          <view>
            今日获得
            <text style="color: red">{{
              pageData.setting.register_integral
            }}</text>
            积分
          </view>
          <div class="popup-bt" @click="showSuccess = false">知道咯</div>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import WCalendar from "../components/WCalendar/WCalendar";
export default {
  components: {
    WCalendar,
  },
  data() {
    return {
      pageData: "",
      showGuize: false,
      showSuccess: false,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.integralmall.integralmallExplain(
        { today: this.currentDate },
        true
      );
      this.pageData = res.data;
    },
    clickGuize() {
      this.showGuize = true;
    },
    // 签到
    async calendarChange(value) {
      console.log(value, "qiandao日期");
      await this.$requestAll.integralmall.integralmallRegister({
        today: value.replace(/-/g, "/"),
      });
      this.loadData();
      this.showSuccess = true;
    },
  },
  onShow() {},
  computed: {
    currentDate() {
      const myDate = new Date();
      var y = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
      var m = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
      m = m < 10 ? "0" + m : m;
      var d = myDate.getDate(); //获取当前日(1-31)
      d = d < 10 ? "0" + d : d;
      return `${y}/${m}/${d}`;
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
}

.maimbox {
  position: relative;
  height: 624rpx;
  > image {
    width: 100%;
    height: 100%;
  }
  .maimbox-content {
    position: absolute;
    left: 50%;
    top: 20rpx;
    //   width: 100%;
    height: 100%;
    transform: translate(-50%, 0);
    .current-box {
      margin-top: 80rpx;
      margin-bottom: 40rpx;

      .qiandao-day {
        margin: 20rpx 0;
        font-size: 100rpx;
        color: #ffde00;
      }
    }
  }
  .guize {
    position: absolute;
    right: 0;
    top: 20rpx;
    padding: 6rpx 20rpx;
    font-size: 24rpx;
    color: #fff;
    background: rgba(0, 0, 0, 1);
    opacity: 0.5;
    border-radius: 20rpx 0 0 20rpx;
  }
}

.guize-popup {
  padding: 20rpx;
  min-height: 300rpx;
  .popup-title {
    line-height: 60rpx;
  }
  .popup-content {
    margin: 20rpx 0;
    font-size: 28rpx;
    > view {
      line-height: 40rpx;
    }
  }
  .popup-bt {
    line-height: 60rpx;
    border-radius: 30rpx;
    font-size: 32rpx;
    text-align: center;
    width: 90%;
    color: #fff;
    background: red;
    margin: 20rpx auto;
  }
  .title-img {
    width: 700rpx;
    position: absolute;
    top: -252rpx;
    left: -52rpx;
  }
  .qiandao-content {
    position: relative;
    z-index: 9;
    margin-top: 100rpx;
  }
}

.content {
  background: #fce7e2;
  padding-top: 24px;
  padding-bottom: 29px;
  box-sizing: border-box;
}
</style>
