<template>
  <view v-if="$utils.is_webpage() && newTemplate" class="subscribe-nav">
    <view class="style">
      <view class=""> 订阅 </view>
      <view class=""> 公众号 </view>
    </view>
    <wx-open-subscribe class="subscribe-subject" :template="newTemplate">
      <script type="text/wxtag-template">
        <button style="font-size:12px;width:100%;height:100%;">
          点击订阅
        </button>
      </script>
    </wx-open-subscribe>
  </view>
</template>

<script>
import wxConfig from '@/utils/wxConfig.js';
export default {
  props: {
    template: {
      type: [Array, String, Object],
      default: '',
    },
  },
  computed: {
    newTemplate() {
      let val = this.template;
      if (val) {
        let type = typeof val;
        switch (type) {
          case 'array':
            return val.jion('');
          case 'object':
            var result = '';
            for (const key in val) {
              result += val[key] + ',';
            }
            return result.slice(0, -1);
          default:
            return val;
        }
      }
      return '';
    },
  },
  created() {
    // #ifdef H5
    this.$utils.is_webpage() && this.loadComponent();
    // #endif
  },
  methods: {
    loadComponent() {
      wxConfig
        .init([], ['wx-open-launch-weapp', 'wx-open-subscribe'])
        .then(jWeixin => {
          console.log(jWeixin);
        });
    },
  },
};
</script>

<style lang="scss">
.subscribe-nav {
  position: fixed;
  top: 80%;
  right: 24rpx;
  background: rgba(255, 255, 255, 0.4);
  display: inline-block;
  z-index: 111111;
  height: 80rpx;
  width: 90rpx;
  .style {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #1aa349;
    border-top-left-radius: 30rpx;
    border-bottom-left-radius: 30rpx;
    font-size: 20rpx;
  }
  .subscribe-subject {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
}
</style>
