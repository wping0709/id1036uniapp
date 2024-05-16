<template>
  <view v-if="iframeUrl" class="body env-bottom">
    <web-view :src="iframeUrl"></web-view>
  </view>
</template>

<script>
import siteinfo from "@/siteinfo";
export default {
  data() {
    return {
      is_user_list: null,
      msg_url: siteinfo.kefu_host + "/#/pages/msg/index?",
      list_url: siteinfo.kefu_host + "/#/pages/index/index?",
      iframeUrl: "",
      to_user_id: null,
      host: null,
      goods_name: "",
      goods_price: "",
      goods_img: "",
      open_url: "",
    };
  },
  onLoad(params) {
    if (!this.$store.getters["user/userInfo"].binding) {
      uni.showModal({
        content: "请绑定手机号再使用客服系统",
        showCancel: false,
        confirmText: "确定",
        success: (res) => {
          if (res.confirm) {
            uni.navigateBack({ delate: 1 });
          }
        },
      });
      return;
    }
    if (params.data) {
      params = JSON.parse(decodeURIComponent(params.data));
    }
    var to_user_id = "";
    // 商家联系电话
    if (params.to_user_id) {
      // 数组
      if (params.to_user_id.indexOf(",") != -1) {
        to_user_id = this.getOne(params.to_user_id);
      }
      // 不是数组
      else {
        to_user_id = params.to_user_id;
      }
      this.to_user_id = to_user_id;
    } else {
      var mobiles =
        this.$store.getters["SHOP_CONFIG"].store.kefu_setting.mobile;
      var newMobiles = mobiles.replace("，", ",");
      if (newMobiles.indexOf(",") != -1) {
        to_user_id = this.getOne(newMobiles);
      } else {
        to_user_id = newMobiles;
      }
      this.to_user_id = to_user_id;
    }
    if (this.to_user_id == "") {
      uni.$u.toast("当前客服不在线!");
      return;
    }
    // 处理商品信息发送
    if (params.goods_name) {
      this.goods_name = params.goods_name.trim();
    }
    if (params.goods_price) {
      this.goods_price = params.goods_price.trim();
    }
    if (params.goods_img) {
      this.goods_img = params.goods_img.trim();
    }
    if (params.open_url) {
      this.open_url = params.open_url.trim();
    }
    this.host = siteinfo.apiroot.match(/\/\/(.*?)\//)[1];
    this.iframeUrl = this.iframe_url();
  },
  methods: {
    getOne(str) {
      let toUserIdArr = str.split(",");
      return toUserIdArr[uni.$u.random(0, toUserIdArr.length - 1)];
    },
    iframe_url() {
      let userInfo = this.$store.getters["user/userInfo"];
      if (userInfo.binding == this.to_user_id) {
        uni.$u.toast("不能和自己聊天哦!");
        return;
      }

      
      var returnUrl = this.msg_url +
      "host=" +
      this.host +
      "&mobile=" +
      userInfo.binding +
      "&nickname=" +
      encodeURIComponent(userInfo.nickname) +
      "&avatar=" +
      encodeURIComponent(userInfo.avatar_url) +
      "&to_mobile=" +
      this.to_user_id +
      "&goods_name=" +
      encodeURIComponent(this.goods_name) +
      "&goods_price=" +
      this.goods_price +
      "&goods_img=" +
      encodeURIComponent(this.goods_img) +
      "&open_url=" +
      encodeURIComponent(this.open_url);
      // #ifdef APP
      returnUrl = returnUrl + '&is_app=1'
      // #endif
      return returnUrl;
    },
  },
};
</script>

<style scoped>
.body {
  width: 100vw;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
</style>
