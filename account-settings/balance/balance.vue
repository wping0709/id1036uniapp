<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <view class="money-box">
      <image
        :src="pageData.setting.pic_url"
        mode="aspectFill"
        style="width: 100%; height: 100%"
      />
      <view class="money-content">
        <view>账户余额(元)</view>
        <view>{{ pageData.money }}</view>
        <view v-if="store.is_chongzhi == 1" @click="$utils.toUrl(pageData.setting.page_url)">充值</view>
      </view>
      <view @click="tishiShow = true" class="tishi iconfont icon-tishi"></view>
    </view>

    <image
      @click="$utils.toUrl(pageData.setting.page_url)"
      class="to-url"
      :src="pageData.setting.ad_pic_url"
      mode="aspectFill"
      style=""
    />

    <view class="liushui">
      <view class="date-title flex-y-center flex-x-center">
        <view @click="swtichMoth('-')" class="p-x-20">
          <text class="iconfont icon-arrow-left font-40"></text>
        </view>
        <view>{{ date }}</view>
        <view @click="swtichMoth('+')" class="p-x-20">
          <text class="iconfont icon-arrow-right font-40"></text>
        </view>
      </view>
      <view class="liushui-box">
        <view
          v-for="item in list"
          :key="item.id"
          class="liushui-item flex-x-sb flex-y-center"
        >
          <view class="left flex-w-1 m-r-20">
            <view class="u-line-1 m-b-10 font-28">{{ item.desc }}</view>
            <view class="color-999">{{ item.date }}</view>
          </view>
          <view
            class="right font-32"
            :style="{
              color: item.price > 0 ? '#ff4544' : '#3fc24c',
            }"
            >{{ item.price }}</view
          >
        </view>
      </view>
    </view>

    <u-popup
      :show="tishiShow"
      round="10"
      @close="tishiShow = false"
      mode="center"
      :safeAreaInsetBottom="false"
    >
      <view class="popup-box">
        <view class="popup-title">充值说明</view>
        <view class="popup-content">{{
          pageData.setting.help || '暂无说明'
        }}</view>
        <view @click="tishiShow = false" class="popup-bt">知道了</view>
      </view>
    </u-popup>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      list: [],
      date: '',
      tishiShow: false,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.recharge.index({}, true);
      this.pageData = res.data;
      this.date = res.data.date;
      this.list = res.data.list;
    },
    async getList() {
      const res = await this.$requestAll.recharge.record(
        {
          date: this.date,
        },
        true
      );
      this.date = res.data.date;
      this.list = res.data.list;
    },
    swtichMoth(type) {
      let dateArr = this.date.split('-');
      if (type == '-') {
        let y = dateArr[0];
        let m = dateArr[1] - 1;
        if (m < 1) {
          y = y - 1;
          m = 12;
        }
        m = m < 10 ? '0' + m : m;
        this.date = `${y}-${m}`;
      } else {
        let m = dateArr[1] - 0 + 1;
        let y = dateArr[0];
        if (m > 12) {
          y = y - 0 + 1;
          m = 1;
        }
        m = m < 10 ? '0' + m : m;
        this.date = `${y}-${m}`;
      }
      this.getList();
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
}
.money-box {
  position: relative;
  height: 320rpx;
  text-align: center;
  color: #fff;
  .money-content {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    font-size: 32rpx;
    > view:nth-child(1) {
      margin-top: 30rpx;
    }
    > view:nth-child(2) {
      margin-top: 30rpx;
      font-size: 60rpx;
      font-weight: 600;
    }
    > view:nth-child(3) {
      margin: 30rpx auto 0;
      width: 140rpx;
      line-height: 54rpx;
      border: 4rpx solid #fff;
      border-radius: 30rpx;
    }
  }
  .tishi {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 40rpx;
  }
}
.to-url {
  display: block;
  height: 180rpx;
  width: 100%;
  margin: 20rpx 0;
}

.liushui {
  color: #666;
  .date-title {
    background: #fff;
    line-height: 80rpx;
    > view:nth-child(2) {
      margin: 0 30rpx;
    }
  }
  .liushui-box {
    .liushui-item {
      background: #fff;
      padding: 30rpx 20rpx;
      margin: 1px 0;
    }
  }
}
.popup-box {
  border-radius: 20rpx;
  width: 80vw;
  padding: 40rpx 30rpx;
  .popup-title {
    text-align: center;
    font-size: 34rpx;
  }
  .popup-content {
    min-height: 180rpx;
    margin: 20rpx 6rpx;
  }
  .popup-bt {
    border-radius: 10rpx;
    background: #ff4544;
    line-height: 80rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
  }
}
</style>
