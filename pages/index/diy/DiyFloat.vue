<template>
  <view class="float-box" v-if="param.cat_style != 2">
    <view v-show="!isHide || param.cat_style == 1" class="content-box">
      <!-- 拨打电话 -->
      <image
        @click="clickMenu('dial')"
        v-if="param.dial == 1"
        :src="param.dial_pic"
        mode="aspectFill"
      />

      <!-- 外部链接 -->
      <image
        @click="clickMenu('web_service_status')"
        v-if="param.web_service_status == 1"
        :src="param.web_service"
        mode="aspectFill"
      />

      <!-- 在线客服   -->
      <image
        @click="clickMenu('show_customer_service')"
        v-if="param.show_customer_service == 1"
        :src="param.service"
        mode="aspectFill"
      />

      <!-- 官方客服   -->
      <button
        class="u-reset-button item-button"
        v-if="param.show_wx_customer_service == 1"
        open-type="contact"
        :style="{
          background: `url(${param.customer_service_url}) 0 0 / cover no-repeat;`,
        }"
      ></button>

      <!-- 跳转小程序   -->
      <image
        @click="clickMenu('wxapp_status')"
        v-if="param.wxapp_status == 1"
        :src="param.pic_url"
        mode="aspectFill"
      />

      <!-- 一键导航   -->
      <image
        @click="clickMenu('quick_map_status')"
        v-if="param.quick_map_status == 1"
        :src="param.icon"
        mode="aspectFill"
      />
    </view>
    <!-- 展开图片 -->
    <view
      class="zhedie-box"
      @click="isHide = !isHide"
      v-if="param.cat_style == 0"
    >
      <image
        v-if="isHide"
        :src="param.close"
        mode="aspectFill"
        style="width: 100%; height: 100%"
      />
      <image
        v-else
        :src="param.open"
        mode="aspectFill"
        style="width: 100%; height: 100%"
      />
    </view>
  </view>
</template>

<script>
export default {
  props: ["page_id", "_templateKey", "item"],
  data() {
    return {
      pageData: "",
      param: "",
      isHide: true,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const formData = {
        page_id: this.page_id,
        _templateKey: this._templateKey,
        _templateItem: JSON.stringify(this.item),
        _template: this.item.type,
      };
      const res = await this.$requestAll.home.getTemplateData(formData);
      this.pageData = res.data;
      this.param = res.data.param;
    },
    clickMenu(type) {
      switch (type) {
        // 拨打电话
        case "dial":
          uni.makePhoneCall({
            phoneNumber: this.param.dial_tel,
          });
          break;
        // 客服外链 跳转外部链接;
        case "web_service_status":
          this.$utils.toUrl("/other/web/web?url=" + this.param.web_service_url);
          break;
        // 在线客服;
        case "show_customer_service":
          this.$utils.toUrl("/kefu/kefu?is_user_list=true");
          break;
        // 跳转小程序;
        case "wxapp_status":
          uni.navigateToMiniProgram({
            appId: this.param.appid,
            path: this.param.path,
            extraData: this.$utils.toUrlJson(this.param.path),
          });
          break;
        // 一键导航;
        case "quick_map_status":
			uni.showModal({
				title:'提示',
				content:'是否允许系统获取您的地理位置？用于打开导航功能',
				success: ({confirm,cancel}) => {
					if(confirm) {
						var location = this.param.lal.split(",");
						uni.openLocation({
						  longitude: Number(location[1]),
						  latitude: Number(location[0]),
						  name: this.param.address,
						  address: this.param.address,
						});
					}
				}
			})
        
          break;

        default:
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$imageSize: 80rpx;
.float-box {
  position: fixed;
  z-index: 999;
  right: 30rpx;
  bottom: 200rpx;

  .zhedie-box {
    width: $imageSize;
    height: $imageSize;
    border-radius: 50%;
    overflow: hidden;
  }
  .content-box {
    > image,>.item-button {
      display: block;
      width: $imageSize;
      height: $imageSize;
      // border-radius: 50%;
      margin-bottom: 20rpx;
    }
  }
}
</style>
