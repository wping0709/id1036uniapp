<template>
  <!-- <view style="height: 80rpx"> -->
  <!-- #ifdef H5 -->
  <view
    :style="{
      top:0,
      height: '80rpx',
      background: param.backgroundColorW,
    }"
    class="search flex-y-center"
  >
  <!-- #endif -->
  <!-- #ifndef H5 -->
  <view
    :style="{
      top: upTop,
      height: '80rpx',
      background: param.backgroundColorW,
    }"
    class="search flex-y-center"
  >
  <!-- #endif -->
    <view
      @click="$utils.toUrl('/pages/search/search?mch_id=' + mch_id)"
      :style="{
        color: param.color,
        backgroundColor: param.backgroundColor,
        borderRadius: param.borderRadius + 'rpx',
      }"
      class="input flex-w-1 flex-y-center color-999 p-x-20"
    >
      <view class="flex-w-1" :style="{ textAlign: param.textPosition }">
        <text class="iconfont icon-sousuo m-r-10"></text>
        <text>{{ param.text }}</text>
      </view>

      <view
        @click.stop="saoyisao"
        v-if="!mch_id"
        class="iconfont icon-saoyisao font-40 p-x-10"
      >
      </view>
    </view>
    <view :style="{color: shopInfoData.param && shopInfoData.param.font_color}" class="qiandao flex-y-center font-18">
      <template v-if="shopInfoData.param">
        <view
          v-if="shopInfoData.param.btn_1_img && shopInfoData.param.btn_1_text"
          @click="navTo(1)"
          class="m-l-20 flex-col flex-y-center flex-x-center"
        >
          <image
            :src="shopInfoData.param.btn_1_img"
            style="width: 36rpx; height: 36rpx"
            mode="aspectFill"
          />
          <text class="">{{ shopInfoData.param.btn_1_text }}</text>
        </view>
        <view
          v-if="shopInfoData.param.btn_2_img && shopInfoData.param.btn_2_text"
          @click="navTo(2)"
          class="m-l-20 flex-col flex-y-center flex-x-center"
        >
          <image
            :src="shopInfoData.param.btn_2_img"
            style="width: 36rpx; height: 36rpx"
            mode="aspectFill"
          />
          <text class="">{{ shopInfoData.param.btn_2_text }}</text>
        </view>
      </template>
    </view>
  </view>
  <!-- </view> -->
</template>

<script>
export default {
  name: 'DiySearch',
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
    templateList: {
      type: Array,
      default() {
        return [];
      },
    },
    mch_id: {
      type: [String, Number],
      default: '',
    },
    // isFixed: {
    //   type: Boolean,
    //   default: true,
    // },
  },

  computed: {
    // isFixed() {
    //   // 当前页面是否去除默认标题
    //   let bar = false;
    //   var val = this.templateList;
    //   if (val.length) {
    //     // 判断是否有头部组件 shop_info
    //     let shop_info = val.findIndex(item => item.type == 'shop_info') != -1;

    //     if (!bar && shop_info) {
    //       return;
    //     }
    //   }
    // },
    // 计算粘性定位高度top
    upTop() {
      const pages = getCurrentPages();
      if (pages.length) {
        const page = pages[pages.length - 1].route;
        if (page == 'mch/shop/shop') {
          return 0;
        }
        return `calc(44px + ${this.systemInfo.statusBarHeight}px)`;
      }
    },
    shopInfoData() {
      if (this.templateList.some(item => item.type === 'shop_info'))
        return this.templateList.find(item => item.type === 'shop_info');
      return {};
    },
  },
  methods: {
    async saoyisao() {
		 // #ifdef APP-PLUS
		 if(this.systemInfo.osName !== 'ios'){
			 uni.showModal({
			 	title:'提示',
			 	content: '是否允许系统调用设备摄像头?用于获取二维码信息',
			 	success:async({confirm,cancel}) => {
			 		if(confirm){
			 			const res = await this.$utils.scanCode();
			 			this.$utils.toUrl(res.path);
			 		}else {
			 			console.log(cancel)
			 		}
			 	}
			 })
		 }else {
			 const res = await this.$utils.scanCode();
			 this.$utils.toUrl(res.path);
			 }
		 // #endif
		 // #ifdef MP-WEIXIN || H5
		 const res = await this.$utils.scanCode();
		 console.log(res)
		 this.$utils.toUrl(res.path);
		 // #endif
      // console.log('点击扫一扫');
     
    },
    navTo(index) {
      // 跳转客服处理参数
      if (this.shopInfoData.param[`btn_${index}_open_type`] == 'webKefu') {
         let params = {
          to_user_id: this.store.kefu_setting.mobile,
          to_user_nickname: '平台客服',
          to_user_img: this.store.copyright_pic_url,
          to_mch_id: 0,
        };
        this.$utils.toUrl('/kefu/kefu' + '?data=' + encodeURIComponent(JSON.stringify(params)));
      } else {
        this.$utils.toUrl(this.shopInfoData.param[`btn_${index}_url`]);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.search {
  position: sticky;
  left: 0;
  width: 100%;
  z-index: 999;
  padding: 0 24rpx;

  // padding-bottom: 10rpx;
  .input {
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 32rpx;
    background: #fff;
  }
}
</style>
