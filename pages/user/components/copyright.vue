<template>
  <view class="p-b-20">
    <template v-if="copyright.text || copyright.icon">
      <!-- 打开小程序 && 非拨打手机号 && 公众号 -->
      <template
        v-if="
          copyright.open_type == 'wxapp' &&
          copyright.is_phone != 1 &&
          $utils.is_webpage()
        "
      >
        <!-- 公众号打开小程序 -->
        <wx-open-launch-weapp :username="appId" :path="pagePath">
          <script type="text/wxtag-template">
            <div style="
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              height: 100%;
              ">
              <!-- 选中图片 -->
              <img
                wx:if="{{copyright.icon || store.copyright_pic_url}}"
                src="{{copyright.icon || store.copyright_pic_url}}"
                style="width:32px;height:32px;"
              />
              <div style="font-size:10px;color: #888;text-align: center;">{{ store.name }}</div>
              <div wx:if="{{copyright.text || store.copyright}}" style="font-size:10px;color: #888;text-align: center;">{{ copyright.text || store.copyright }}</div>
            </div>
          </script>
        </wx-open-launch-weapp>
      </template>

      <view
        v-else
        @click="onClick"
        class="page-body flex-col flex-y-center font-center"
      >
        <u-image
          v-if="copyright.icon"
          :src="copyright.icon"
          width="120px"
          height="30px"
          mode="aspectFit"
        ></u-image>
        <div class="font-22 color-999">
          {{ store.name }}
        </div>
        <view v-if="copyright.text" class="font-22 color-999">{{
          copyright.text
        }}</view>
      </view>
    </template>

    <!-- 默认平台设置 -->
    <template v-else>
      <view
        @click="$utils.toUrl(store.copyright_url)"
        class="page-body flex-col flex-y-center font-center"
      >
        <u-image
          v-if="store.copyright_pic_url"
          :src="store.copyright_pic_url"
          width="120px"
          height="30px"
          mode="aspectFit"
        ></u-image>

        <view class="font-22 color-999">
          {{ store.name }}
        </view>
        <view v-if="store.copyright" class="font-22 color-999">
          {{ store.copyright }}
        </view>
      </view>
    </template>
  </view>
</template>
<script>
export default {
  props: {
    copyright: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {},
  onShow() {},
  methods: {
    onClick() {
      let copyright = this.copyright;
      if (Number(copyright.is_phone)) {
        uni.makePhoneCall({
          phoneNumber: copyright.phone,
        });
      }

      // 跳转小程序页面
      else if (copyright.open_type == 'navigate') {
        this.$utils.toUrl(copyright.url);
      }

      // 打开其他小程序app
      else if (copyright.open_type == 'wxapp') {
        uni.navigateToMiniProgram({
          appId: copyright.appId,
          path: copyright.path,
          extraData: this.$utils.toUrlJson(copyright.path),
          envVersion: 'release',
          success: result => {},
          fail: () => {
            uni.showModal({
              title: '提示',
              content: '打开小程序失败，请查看配置是否正确！',
              showCancel: false,
            });
          },
        });
      }
    },
  },
  computed: {
    appId() {
      if (this.copyright.open_type == 'wxapp') {
        let url = decodeURIComponent(this.copyright.url);
        let paramArr = url.split('?')[1].split('&');
        console.log(paramArr);
        let param = {};
        paramArr.forEach(item => {
          let vArr = item.split('=');
          param[vArr[0]] = vArr[1];
        });
        return param.appId || '';
      } else {
        return '';
      }
    },
    pagePath() {
      if (this.copyright.open_type == 'wxapp') {
        let url = decodeURIComponent(this.copyright.url);
        let paramArr = url.split('?')[1].split('&');
        console.log(paramArr);
        let param = {};
        paramArr.forEach(item => {
          let vArr = item.split('=');
          param[vArr[0]] = vArr[1];
        });
        return param.path || '';
      } else {
        return '';
      }
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
}
</style>
