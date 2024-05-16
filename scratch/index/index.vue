<template>
  <view v-if="setting" class="body">
    <image :src="wxapp_img.scratch.scratch_bg" mode="widthFix" />

    <div class="share-rule">
      <div class="rule" @click="$utils.toUrl('/scratch/rule/rule')">规则</div>
      <div class="share" @click="showShare = true">分享</div>
    </div>

    <div class="scratch-center">
      <div class="draw-num">
        你还有
        <text style="color: #b2965d">{{ indexData.oppty || 0 }}</text>
        次抽奖机会
      </div>

      <!-- 挂卡区域 -->
      <div class="gua-box">
        <image :src="wxapp_img.scratch.scratch_bg1" mode="aspectFix" />
        <div v-if="!showPopup && !hideChoujiang" class="gua-content">
          <!-- 分享时隐藏cover 中奖时隐藏cover -->

          <ScratchCard ref="card" @complete="complete" :disabled="disableb">
            <view class="zhongjiang-contetn" style="height: 320rpx">
              <template v-if="zhongJiangData">
                <div style="color: #f05525" class="font-40 m-b-20">
                  <!-- 积分 -->
                  <template v-if="zhongJiangData.list.type == 3">
                    {{ zhongJiangData.list.num }}积分
                  </template>
                  <!-- 优惠券 -->
                  <template v-else-if="zhongJiangData.list.type == 2">
                    {{ zhongJiangData.list.coupon }}
                  </template>
                  <!-- 红包 -->
                  <template v-else-if="zhongJiangData.list.type == 1">
                    {{ zhongJiangData.list.price }}元余额
                  </template>
                  <!-- 实物 -->
                  <template v-else-if="zhongJiangData.list.type == 4">
                    ￥{{ zhongJiangData.list.gift }}
                  </template>
                  <!-- 无中奖 -->
                  <template v-else-if="zhongJiangData.list.type == 5">
                    谢谢参与
                  </template>
                </div>
              </template>

              <!-- 因为层级问题在挂卡完成时再显示再刮一次按钮 -->
              <!-- 挂卡完成  && 未显示终将弹框 -->
              <!-- #ifndef APP-PLUS -->
              <cover-view v-if="is_finish" class="gua-bt" @click="resetScratch">
                再刮一次
              </cover-view>
              <!-- #endif -->

              <!-- #ifdef APP-PLUS -->
              <view v-if="is_finish" class="gua-bt" @click="resetScratch">
                再刮一次
              </view>
              <!-- #endif -->
            </view>
          </ScratchCard>
          <!-- 因为层级问题只在禁用状态下显示多少积分刮一次按钮 -->
          <!-- 当前禁用 && 未显示弹框 -->

          <!-- #ifndef APP-PLUS -->
          <cover-view v-if="disableb" @click="onGua" class="gua-bt-1">
            {{ setting.deplete_register || '' }}积分刮一次
          </cover-view>
          <!-- #endif -->

          <!-- #ifdef APP-PLUS -->
          <view class="gua-bt-1" @click="onGua" v-if="disableb">
            {{ setting.deplete_register || '' }}积分刮一次
          </view>
          <!-- #endif -->
        </div>
      </div>

      <view class="p-y-30 p-x-20 font-32 flex-y-center flex-x-sb">
        <view @click="$utils.toUrl('/pages/index/index')" class="flex-y-center">
          <text class="iconfont icon-home font-40"></text>
          <text>回到首页</text>
        </view>
        <view @click="$utils.toUrl('/scratch/prize/prize')">
          我的中奖记录 >>
        </view>
      </view>

      <div class="recording">
        <view class="p-x-30 p-b-20">
          <u-divider
            text="中奖名单"
            textColor="#fff"
            lineColor="#fff"
          ></u-divider>
        </view>
        <scroll-view scroll-y class="list">
          <view v-for="item in logList" :key="item.id">
            {{ item.create_time }} {{ item.user }} {{ item.name }}
          </view>
        </scroll-view>
      </div>
    </div>

    <Share
      :showPopup.sync="showShare"
      :close.sync="showShare"
      type="choujiang"
    ></Share>

    <view class="zhongjiang-popup" v-if="showPopup">
      <image
        class="popup-img"
        :src="wxapp_img.scratch.scratch_success"
        mode="aspectFill"
      />
      <div class="gx flex-col flex-y-center flex-x-center">
        <view>恭喜获得</view>
        <view>
          <!-- 积分 -->
          <template v-if="zhongJiangData.list.type == 3">
            {{ zhongJiangData.list.num }}积分
          </template>
          <!-- 优惠券 -->
          <template v-else-if="zhongJiangData.list.type == 2">
            {{ zhongJiangData.list.coupon }}
          </template>
          <!-- 红包 -->
          <template v-else-if="zhongJiangData.list.type == 1">
            {{ zhongJiangData.list.price }}元余额
          </template>
          <!-- 实物 -->
          <template v-else-if="zhongJiangData.list.type == 4">
            ￥{{ zhongJiangData.list.gift }}
          </template>
        </view>
      </div>
      <div class="act-modal-end flex-col flex-x-center flex-y-center">
        <div class="gua-bt" @click="resetScratch">再刮一次</div>
        <div class="act-zh">奖品已放入您的账号</div>
      </div>
    </view>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import ScratchCard from '../components/scratch-card/scratch-card';
import Share from '@/components/share/share';
import share from '@/mixins/share';
export default {
  mixins: [share],
  components: {
    ScratchCard,
    Share,
  },
  data() {
    return {
      nextId: '', //下次id
      indexData: '', //刮刮卡信息
      logList: '', //中奖记录
      setting: '', //刮刮卡配置
      zhongJiangData: '', //中奖信息
      disableb: true,
      showShare: false,
      Interval: '',
      showPopup: false, //中奖弹框
      is_finish: false, //挂卡完成？
      hideChoujiang: false,
    };
  },

  onLoad() {
    this.scratchIndex();
    this.getSetting();
    this.scratchLog();
    // this.resetScratch();
  },
  methods: {
    // 获取刮刮卡设置
    async getSetting() {
      const res = await this.$requestAll.scratch.scratchSetting({}, true);
      this.setting = res.data.setting;
    },
    // 获取页面信息
    async scratchIndex() {
      const res = await this.$requestAll.scratch.scratchIndex();
      this.indexData = res.data;
      this.zhongJiangData = res.data;
      this.nextId = res.data.list.id
    },
    // 获取中奖记录
    async scratchLog() {
      const res = await this.$requestAll.scratch.scratchLog();
      this.logList = res.data;
      // this.Interval = setInterval(async () => {
      //   let res1 = await this.$requestAll.scratch.scratchLog();
      //   this.logList = res1.data;
      // }, 3000);
    },
    // 获取刮奖信息
    async scratchReceive() {
      const res = await this.$requestAll.scratch.scratchReceive({
        id: this.nextId,
      },true);
      this.nextId = res.data.list.id || ''

      // this.indexData.list = res.data.list;
      this.scratchLog();
    },

    // 点击支付开始开始挂卡
    onGua() {
      if (!this.indexData.oppty) {
        return uni.showModal({
          title: '提示',
          content: '机会已用完',
        });
      }
      this.scratchReceive().then(() => {
        this.disableb = false;
      });
    },
    // 点击再次刮卡
    resetScratch() {
      if(this.is_finish){
        // 刷新页面
        this.scratchIndex();
        this.getSetting();
        this.scratchLog();
        this.showPopup = false;
        this.is_finish = false;
        this.disableb = true;
      }else{
        // 关闭中奖弹框
        this.showPopup = false;
        this.is_finish = false;
        this.disableb = true;
        this.$refs['card'] && this.$refs['card'].init();
      }
    },
    complete() {
      // this.showPopup()
      console.log('挂卡完成');
      this.is_finish = true;
      if (this.zhongJiangData.list.type != 5) this.showPopup = true;
      this.indexData.oppty--;
    },
  },
  onShow() {},
  computed: {
    shareData() {
      return {
        title: '刮刮卡',
        path:
          '/scratch/index/index' +
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
};
</script>
<style lang="scss" scoped>
.body {
  position: relative;
  background: #5f02b7;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  > image {
    position: absolute;
    width: 100%;
  }

  .share-rule {
    position: absolute;
    z-index: 10;
    right: 0;
    top: 140rpx;
    > div {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 30rpx 0 0 30rpx;
      padding: 0 10rpx 0 20rpx;
      color: #fff;
      margin-bottom: 20rpx;
      font-size: 30rpx;
    }
  }

  .gua-bt {
    display: block !important;
    box-sizing: content-box !important;
    min-width: 220rpx !important;
    width: initial !important;

    background: #f05525;
    line-height: 2.5;
    color: #fff;
    border-radius: 35rpx;
  }
  .canvas-bt {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 999;
    width: 100%;
    height: 100%;
  }
  .gua-bt-1 {
    z-index: -1;
    display: block !important;
    box-sizing: content-box !important;
    min-width: 220rpx !important;
    width: initial !important;

    height: 70rpx;
    line-height: 70rpx;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    background: #f05525;
    text-align: center;
    color: #fff;
    border-radius: 35rpx;
  }

  .scratch-center {
    margin: 0 48rpx;
    position: relative;
    z-index: 2;
    padding-top: 380rpx;
    color: #fff;

    text-align: center;
    .draw-num {
      padding: 0 30rpx;
      display: inline-block;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 25rpx;
      margin-bottom: 20rpx;

      font-size: 30rpx;
      line-height: 1.8;
    }
    .gua-box {
      position: relative;
      > image {
        width: 640rpx;
        height: 360rpx;
      }
      .gua-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600rpx;
        height: 320rpx;

        .zhongjiang-contetn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }

    .recording {
      padding: 30rpx 40rpx;
      // padding-top: 0;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 20rpx;
      text-align: left;
      font-size: 30rpx;
      /deep/.u-divider {
        margin: 0;
      }
    }
  }

  .zhongjiang-popup {
    position: fixed;
    top: 0;
    /* #ifdef H5 */
    top: 44px;
    /* #endif */

    left: 0;
    z-index: 999;
    width: 100vw;
    height: 100vh;
    /* #ifdef H5 */
    height: calc(100vh - 44px);
    /* #endif */
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    .popup-img {
      width: 100%;
      height: 730rpx;
    }

    .gx {
      position: absolute;
      top: 500rpx;
      left: 50%;
      right: 0;
      transform: translate(-50%, 0);
      height: 210rpx;

      color: #f05525;
    }

    .act-modal-end {
      position: relative;
      border-bottom: 10rpx solid #ffb947;
      border-radius: 0 0 24rpx 24rpx;
      border-left: 10rpx solid #ffb947;
      border-right: 10rpx solid #ffb947;
      margin: 0 131rpx;
      background: #ffffff;
      height: 160rpx;
    }
    .act-zh {
      color: #999;
      margin-top: 30rpx;
    }
  }
}
.list{
  height: 340rpx;
}
</style>
