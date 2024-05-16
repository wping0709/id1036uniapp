<template>
  <view v-if="pageData" class="body">
    <view class="pond-head">
      <image :src="wxapp_img.pond.pond_head" mode="aspectFill" />
      <view class="rule-share">
        <view @click="$utils.toUrl('/pond/rule/rule')">规则</view>
        <view @click="showShare = true">分享</view>
      </view>
    </view>

    <view class="pond-num flex-y-center flex-x-center">
      <view>
        您还有
        <text style="color: #ffb92a">{{ pageData.oppty }}</text>
        次抽奖机会
      </view>
    </view>

    <view class="pond-content">
      <div
        class="circle"
        :style="{
          top: cpStyle(item).top,
          left: cpStyle(item).left,
        }"
        v-for="item in 26"
        :key="item"
      ></div>
      <div class="container-in">
        <div
          :style="{
            background: selectIndex == i ? '#ffe400' : '#f5f0fc',
          }"
          class="content-out flex-col flex-y-center flex-x-sb"
          v-for="(goods, i) in pageData.list"
          :key="i"
        >
          <image :src="goods.image_url" mode="aspectFix"></image>

          <text class="font-24 u-line-1 font-center" style="width: 90%">{{
            goods.name
          }}</text>
        </div>

        <div
          @click="submit"
          class="content-out flex-col flex-y-center flex-x-sb"
        >
          <image
            class="start-bg"
            :src="wxapp_img.pond.pond_button"
            mode="aspectFill"
          />
          <image
            class="start-bt"
            :src="wxapp_img.pond.pond_cj"
            mode="aspectFill"
          />
        </div>
      </div>
    </view>

    <view class="flex-y-center color-fff flex-x-sb m-30 p-x-30">
      <view @click="$utils.toUrl('/pages/index/index')" class="flex-y-center">
        <text class="iconfont icon-home"></text>
        <text>回到首页</text>
      </view>
      <view @click="$utils.toUrl('/pond/prize/prize')" class="flex-y-center">
        <text>中奖记录</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </view>

    <Share :showPopup.sync="showShare" type="pond"></Share>

    <u-popup
      :show="showPondPopup"
      @close="showPondPopup = false"
      mode="center"
      bgColor="transparent"
      :safeAreaInsetBottom="false"
    >
      <div class="pond-popup">
        <div class="head">
          <image
            v-if="!prizeGoods"
            :src="wxapp_img.pond_empty"
            mode="aspectFill"
          />
          <image
            v-else
            :src="wxapp_img.pond_success"
            style="height: 430rpx"
            mode="aspectFill"
          />
          <image
            @click="showPondPopup = false"
            :src="wxapp_img.pond.pond_close"
            mode="aspectFill"
          />
        </div>
        <div class="act-modal-close flex-x-center">
          <div class="pond-xxcy">{{ prizeGoods ? '恭喜' : '谢谢参与' }}</div>
        </div>
        <div class="act-modal-close flex-x-center">
          <div class="pond-xxcy">
            {{ prizeGoods ? '抽中' + prizeGoods.name : '再换个姿势抽奖' }}
          </div>
        </div>
        <div class="act-modal-close bt-box flex-x-center">
          <div class="pond-xxcy">
            <div @click="showPondPopup = false;btnStatus = true" class="bt">继续抽奖</div>
          </div>
        </div>
      </div>
    </u-popup>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import Share from '@/components/share/share';
import share from '@/mixins/share';
export default {
  components: {
    Share,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      showShare: false, //分享开关
      selectIndex: 0,
      showPondPopup: false, //中奖开关
      prizeGoods: '', //中奖信息
      btnStatus:true
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.pond.pondIndex({}, true);

      this.pageData = res.data;
    },
    async submit() {
      if (this.pageData.oppty <= 0) return uni.$u.toast('抽奖次数已用完');
      if(this.btnStatus == false){
          return uni.$u.toast('不要着急，奖励正在赶来的路上～');
      }
      this.btnStatus = false
      const res = await this.$requestAll.pond.pondLottery({});
      
      let i = -1;
      let time = setInterval(() => {
        if (this.selectIndex == i) {
          clearInterval(time);
          this.showPondPopup = true;
        } else if (this.selectIndex < 7) {
          this.selectIndex++;
        } else {
          this.selectIndex = 0;
        }
      }, 150);
      
      this.pageData.oppty = res.data.oppty;
      let index = this.pageData.list.findIndex(item => item.id == res.data.id);
      this.prizeGoods =
        this.pageData.list[index].type != 5 ? this.pageData.list[index] : '';
      // 3秒后开奖
      setTimeout(() => {
        i = index;
      }, 3000);
    },
  },
  computed: {
    cpStyle() {
      return function (index) {
        if (index < 7) {
          return {
            top: '4rpx',
            left: index * 110 + 4 + 'rpx',
          };
        } else if (index < 14) {
          return {
            top: (index - 6) * 78 + 'rpx',
            left: 'calc(100% - 18rpx)',
          };
        } else if (index < 19) {
          return {
            top: 'calc(100% - 18rpx)',
            left: (index - 15) * 110 + 220 + 'rpx',
          };
        } else {
          return {
            top: (index - 20) * 78 + 156 + 'rpx',
            left: `4rpx`,
          };
        }
      };
    },
    shareData() {
      return {
        title: '抽奖',
        path:
          '/pond/pond/pond' +
          uni.$u.queryParams({
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding-bottom: env(safe-area-inset-bottom);
  background: #f12416;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
.pond-head {
  position: relative;
  height: 430rpx;
  > image {
    width: 100%;
    height: 100%;
  }

  .rule-share {
    position: absolute;
    right: 0;
    top: 40rpx;
    color: #fff;
    > view {
      margin-bottom: 20rpx;
      line-height: 50rpx;
      padding: 0 20rpx;
      border-radius: 25rpx 0 0 25rpx;
      background: rgba(0, 0, 0, 0.4);
    }
  }
}
.pond-num {
  position: relative;
  margin-top: -30rpx;
  > view {
    line-height: 60rpx;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 30rpx;
    padding: 0 30rpx;
    color: #fff;
  }
}

.pond-content {
  position: relative;
  height: 566rpx;
  width: 680rpx;
  background-color: #f47915;
  margin: 32rpx auto 30rpx auto;
  border-radius: 16rpx;
  position: relative;

  .circle {
    position: absolute;
    border-radius: 50%;
    width: 15rpx;
    height: 15rpx;

    top: 2rpx;
    left: 2rpx;
    &:nth-child(2n) {
      background: #f12416;

      animation: switch-bg-ff 2s infinite;
    }
    &:nth-child(2n + 1) {
      background: #fff;
      animation: switch-bg-red 2s infinite;
    }
    @keyframes switch-bg-ff {
      0% {
        background: #f12416;
      }
      50% {
        background: #fff;
      }
      100% {
        background: #f12416;
      }
    }
    @keyframes switch-bg-red {
      0% {
        background: #fff;
      }
      50% {
        background: #f12416;
      }
      100% {
        background: #fff;
      }
    }
  }

  .container-in {
    position: absolute;
    width: 640rpx;
    height: 526rpx;
    background-color: #f12416;
    border-radius: 20rpx;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;

    .content-out {
      position: absolute;
      top: 18rpx;
      left: 18rpx;

      height: 144rpx;
      width: 196rpx;
      background-color: #f5f0fc;
      border-radius: 16rpx;
      box-shadow: 0 16rpx 0 #ffcec0;
      color: #c62015;
      padding: 4rpx 0;
      > image {
        width: 100rpx;
        height: 100rpx;
      }
      .start-bg {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
      }
      .start-bt {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -55%);
        width: 178rpx;
        height: 136rpx;
        animation: switch-tsf 2s infinite;
        @keyframes switch-tsf {
          0% {
            transform: translate(-50%, -55%);
          }
          50% {
            transform: translate(-50%, -60%);
          }
          100% {
            transform: translate(-50%, -55%);
          }
        }
      }

      &:nth-child(2n) {
        top: 18rpx;
        left: 222rpx;
      }
      &:nth-child(3) {
        top: 18rpx;
        left: 222 + 196 + 8rpx;
      }
      &:nth-child(4) {
        top: 18 + 8 + 160rpx;
        left: 222 + 196 + 8rpx;
      }
      &:nth-child(5) {
        top: 18 + 16 + 320rpx;
        left: 222 + 196 + 8rpx;
      }
      &:nth-child(6) {
        top: 18 + 16 + 320rpx;
        left: 222rpx;
      }
      &:nth-child(7) {
        top: 18 + 16 + 320rpx;
        left: 18rpx;
      }
      &:nth-child(8) {
        top: 18 + 8 + 160rpx;
        left: 18rpx;
      }
      &:nth-child(9) {
        top: 18 + 8 + 160rpx;
        left: 18 + 8 + 196rpx;
      }
    }
  }
}

.pond-popup {
  .head {
    > image:nth-child(1) {
      height: 240rpx;
      width: 750rpx;
    }
    > image:nth-child(2) {
      position: absolute;
      right: 80rpx;
      top: 0;
      z-index: 555;
      width: 50rpx;
      height: 50rpx;
    }
  }
  .pond-xxcy {
    width: 591rpx;
    text-align: center;
    background: #ffffff;
    color: #353535;
    font-size: 32rpx;
  }
  .bt-box {
    > div {
      background: #ffffff;
      border-radius: 0 0 24rpx 24rpx;
      .bt {
        margin: 64rpx auto;
        width: 480rpx;
        background: #ff5c5c;
        border-radius: 40rpx;

        color: #fff;
        line-height: 80rpx;
      }
    }
  }
}
</style>
