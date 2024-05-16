<template>
  <view class="body">
    <view
      v-if="
        SHOP_CONFIG.share_setting.share_condition == 1 &&
        user_info.is_distributor == 0
      "
      class="form-box"
    >
      <div class="info">
        <image :src="SHOP_CONFIG.share_setting.pic_url_1" mode="aspectFit" />
      </div>
      <div class="info-item border-b flex-y-center">
        欢迎加入
        <text class="m-x-10" style="color: red">{{
          SHOP_CONFIG.store.name
        }}</text>
        请填写申请信息
      </div>

      <u-form
        :model="form"
        :rules="rules"
        labelWidth="140rpx"
        ref="form1"
        errorType="toast"
      >
        <u-form-item label="邀请人" borderBottom>
          <view style="padding-left: 20rpx">
            <text style="color: red">{{ user_info.parent }}</text>
            (请核对)
          </view>
        </u-form-item>
        <u-form-item label="姓名" prop="name" required borderBottom>
          <u-input
            v-model="form.name"
            border="none"
            placeholder="请填写真实姓名"
          ></u-input>
        </u-form-item>
        <u-form-item label="手机号" prop="mobile" required borderBottom>
          <u-input
            v-model="form.mobile"
            type="number"
            border="none"
            placeholder="请填写手机号码"
          ></u-input>
        </u-form-item>
      </u-form>

      <div @click="switchCheck" class="info-item flex-y-center border-b">
        <text
          v-if="form.agree"
          style="font-size: 40rpx; color: red"
          class="iconfont icon-success"
        ></text>
        <text
          v-else
          style="font-size: 40rpx; color: #333"
          class="iconfont icon-xuanzekuangmoren"
        ></text>

        我已阅读并了解<text @click.stop="clickXieyi" style="color: #014c8c"
          >【分销商申请协议】</text
        >
      </div>

      <div @click="submit" class="info-bt">申请成为分销商</div>

      <div class="info-item border-b flex-y-center">分销商特权</div>

      <div class="info-item border-b flex-y-center">
        <image
          :src="wxapp_img.img_share_money"
          style="width: 60rpx; height: 60rpx; margin-right: 20rpx"
          mode=""
        />
        <view class="flex-w-1 p-y-10">
          <view class="font-600-30 m-b-10">销售拿佣金</view>
          <view class="font-24"
            >成为{{
              SHOP_CONFIG.store.share_custom_data.words.share_name.name
            }}后卖出商品，您可以获得佣金</view
          >
        </view>
      </div>

      <div class="info-item color-666" style="padding: 20rpx">
        {{
          SHOP_CONFIG.store.share_custom_data.words.share_name.name
        }}的商品销售统一由厂家直接收款、直接发货，并提供产品的售后服务，分销佣金由厂家统一设置。
      </div>
    </view>
    <view v-else class="status">
      <view class="info">
        <image
          v-if="SHOP_CONFIG.share_setting.pic_url_1"
          :src="SHOP_CONFIG.share_setting.pic_url_1"
          mode="aspectFit"
        />
      </view>
      <view class="m-t-30 flex-y-center flex-x-center">
        <image
          style="width: 80rpx; height: 80rpx"
          :src="wxapp_img.img_share_info"
          mode="aspectFit"
        />
      </view>
      <view class="m-y-30 p-b-30 font-30 font-center"
        >谢谢您的支持，请等待审核！</view
      >

      <view class="go-home" @click="$utils.toUrl('/pages/index/index')"
        >去商城逛逛</view
      >
    </view>

    <u-popup
      :show="showXieyi"
      :safeAreaInsetBottom="false"
      mode="center"
      round="20rpx"
    >
      <view style="width: 80vw">
        <view class="xieyi-title font-center p-y-20">分销协议</view>
        <scroll-view
          scroll-y
          style="max-height: 70vh; min-height: 30vh"
          class="xieyi-content"
        >
          <view class="p-x-20">
            <u-parse :content="SHOP_CONFIG.share_setting.agree"></u-parse>
          </view>
        </scroll-view>
        <view
          class="flex-y-center border-top font-center m-t-20"
          style="line-height: 80rpx"
        >
          <view
            style="
              background: #ff4544;
              border-bottom-left-radius: 20rpx;
              border-bottom-right-radius: 20rpx;
            "
            @click="showXieyi = false"
            class="flex-w-1 color-fff border-left"
          >
            确定
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
<script>
export default {
  data() {
    return {
      showXieyi: false,
      pageData: "",
      form: {
        name: "",
        mobile: "",
        agree: false,
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写真实姓名",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value);
            },
            message: "手机号码填写错误",
          },
        ],
      },
    };
  },
  onLoad(params) {
    this.loadData();
    // this.$nextTick(()=> {
    //   let form = this.$refs['form1']
    //   console.log(form);
    //   form.setRules(this.rules)
    // })
  },
  onReady() {
    this.$refs.form1 && this.$refs.form1.setRules(this.rules);
  },
  onShow() {},
  methods: {
    clickXieyi() {
      this.showXieyi = true;
      this.form.agree = true;
    },
    async loadData() {
      const res = await this.$requestAll.share.check();
      this.pageData = res.data;
    },
    async submit() {
      if (this.form.share) return uni.$u.toast("请先阅读并确认");
      this.$refs["form1"].validate().then(async () => {
        console.log("验证通过");
        await this.$requestAll.share.postJoin(
          Object.assign(this.form, { agree: Number(this.form.agree) }),
          true
        );
        let user_info = JSON.parse(JSON.stringify(this.user_info));
        user_info.is_distributor = 2;
        this.$store.commit("user/setUserInfo", user_info);
      });
    },
    switchCheck() {
      this.form.agree = !this.form.agree;
    },
  },
  computed: {
    SHOP_CONFIG() {
      return this.$store.getters["SHOP_CONFIG"];
    },
    user_info() {
      return this.$store.getters["user/userInfo"];
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  font-size: 30rpx;
  .border-b {
    border-bottom: 1px solid #ccc;
  }

  .info {
    height: 300rpx;
    > image {
      width: 100%;
      height: 100%;
    }
  }
  .form-box {
    .info-item {
      padding: 0 20rpx;
      min-height: 104rpx;
    }
    /deep/.u-form {
      .u-form-item__body {
        min-height: 104rpx;
        padding-left: 20rpx;
        padding-right: 20rpx;
      }
      .u-line {
        transform: scaleY(1) !important;
        border-bottom: 1px solid #ccc !important;
      }
    }
    .info-bt {
      height: 100rpx;
      line-height: 100rpx;
      margin: 24rpx;
      background: #ff4544;
      color: #fff;
      text-align: center;
      font-size: 32rpx;
      font-weight: 700;
      border-radius: 10rpx;
    }
  }
  .status {
    height: 100vh;
    .go-home {
      margin: 30rpx auto 0;
      width: 90vw;
      background-color: #ff4544;
      color: #fff;
      text-align: center;
      font-weight: bold;
      height: 100rpx;
      line-height: 100rpx;
      border-radius: 10rpx;
    }
  }
}
</style>
