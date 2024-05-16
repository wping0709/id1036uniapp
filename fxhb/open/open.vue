<template>
  <view v-if="pageData" class="body">
    <image
      class="body-bg"
      :src="wxapp_img.fxhb.bg"
      mode="aspectFill"
    />
    <div class="page-content">
      <view class="hongbao flex-y-center flex-x-center">
        <image
          :src="wxapp_img.fxhb.hongbao_bg"
          mode="aspectFill"
        />
        <view class="hongbao-text font-center">
          <view>{{ pageData.coupon_total_money }}元红包已包好</view>
          <view>快拆开和小伙伴分享红包</view>
        </view>

        <div @click="onLingqu" class="open-hongbao-bt">领取</div>
      </view>
    </div>

    <div @click="switchShow('showRule')" class="rule">活动规则</div>

    <u-modal
      @confirm="switchShow('showRule')"
      :show="showRule"
      title="拆红包活动规则"
    >
      <view class="font-left">{{ pageData.rule }}</view>
    </u-modal>

    <Share></Share>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import Share from '@/components/share/share';
import share from '@/mixins/share';
export default {
  mixins: [share],

  components: {
    Share,
  },
  data() {
    return {
      pageData: '',
      form_id: '',
      showRule: false,
    };
  },
  onLoad(params) {
    this.form_id = params.id;

    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.fxhb.open({}, true);
      if (res.data.hongbao_id) {
        this.$utils.toUrl(
          '/fxhb/detail/detail?id=' + res.data.hongbao_id,
          'redirectTo'
        );
      }
      this.pageData = res.data;
    },
    switchShow(key) {
      this[key] = !this[key];
    },
    // 领取红包
    async onLingqu() {
      await this.$utils.bindMessage([this.pageData.tpl_msg_id]);
      const res = await this.$requestAll.fxhb.openSubmit(
        {
          form_id: this.form_id,
          fxhb_id: this.form_id || '',
        },
        true
      );
      this.$utils.toUrl(
        '/fxhb/detail/detail?id=' + res.data.hongbao_id,
        'redirectTo'
      );
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
  position: relative;
  min-height: 100vh;
  background: #fe6b2e;
  /deep/.u-modal__title {
    padding-top: 20rpx;
  }
  /deep/.u-modal__content {
    padding-left: 20rpx;
    padding-right: 20rpx;
    justify-content: flex-start;
  }
  .body-bg {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .page-content {
    position: absolute;
    z-index: 9;
    width: 100vw;
    min-height: 100vh;
    padding-top: 400rpx;
    .hongbao {
      position: absolute;

      width: 100vw;
      height: 722rpx;
      > image {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 600rpx;
        height: 722rpx;
      }
      .hongbao-text {
        position: absolute;
        z-index: 9;
        top: 350rpx;
        color: #ffd212;
        font-size: 32rpx;
      }
      .open-hongbao-bt {
        position: absolute;
        bottom: 70rpx;
        width: 410rpx;
        line-height: 70rpx;
        text-align: center;
        color: #cf292f;
        background: #ffd212;
        border-radius: 35rpx;
      }
    }
  }
  .rule {
    position: absolute;
    top: 80rpx;
    right: 0;
    z-index: 99;
    border-radius: 40rpx 0 0 40rpx;
    background: rgba(0, 0, 0, 0.4);
    color: #fff;
    padding: 10rpx 30rpx;
  }
}
</style>
