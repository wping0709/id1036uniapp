<template>
  <view v-if="pageData" class="body">
    <image :src="wxapp_img.binding_pic" mode="aspectFill" class="top-img" />
    <template v-if="pageData.mobile">
      <view class="mobile-info font-center">
        <view>已绑定手机号</view>
        <view class="m-t-10 font-30">{{ pageData.mobile }}</view>
      </view>
    </template>

    <!-- #ifndef MP-WEIXIN -->
    <view style="margin: 0 50rpx">
      <u-form
        ref="form"
        errorType="toast"
        :model="form"
        :rules="rules"
        labelWidth="130rpx"
      >
        <u-form-item label="手机号" prop="mobile">
          <u-input
            v-model="form.mobile"
            type="number"
            border="bottom"
          ></u-input>
        </u-form-item>
        <u-form-item label="验证码" prop="ver_code">
          <u-input
            v-model="form.ver_code"
            border="bottom"
            placeholder="请输入验证码"
          >
            <template slot="suffix">
              <u-code
                ref="uCode"
                @change="codeChange"
                seconds="60"
                changeText="X秒重新获取"
              ></u-code>
              <u-button
                @tap="getCode"
                :text="tips"
                type="success"
                size="mini"
              ></u-button>
            </template>
          </u-input>
        </u-form-item>
      </u-form>
    </view>
    <div class="zd-bt">
      <u-button open-type="getPhoneNumber" @click="appSwitchMobile">
        {{ pageData.mobile ? "更换绑定" : "立即绑定" }}
      </u-button>
    </div>
    <!-- #endif -->

    <!-- #ifdef MP-WEIXIN -->
    <div class="zd-bt">
      <u-button open-type="getPhoneNumber" @getphonenumber="switchMobile">
        {{ pageData.mobile ? "更换绑定" : "立即绑定" }}
      </u-button>
    </div>
    <!-- #endif -->
  </view>
</template>
<script>
var time = "";
export default {
  data() {
    return {
      pageData: "",
      form: {
        mobile: "",
        ver_code: "",
      },
      rules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value);
            },
            message: "手机号不正确",
          },
        ],
        ver_code: [
          {
            required: true,
            message: "请输入验证码",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.code(value, 6);
            },
            message: "验证码不正确",
          },
        ],
      },
      tips: "获取验证码",
      loginCode: "",
    };
  },
  onLoad() {
    this.loadData();
    uni.login({
      success: (res) => {
        console.log(res);
        this.loginCode = res.code;
      },
    });
  },
  onShow() {
  },
  onReady() {
    this.$refs["form"] && this.$refs["form"].setRules(this.rules);
  },
  methods: {
    codeChange(text) {
      this.tips = text;
    },

    async getCode() {
      if (!uni.$u.test.mobile(this.form.mobile))
        return uni.$u.toast("请正确输入手机号");
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: "正在获取验证码",
        });
        await this.$requestAll.user.userHandBinding({
          content: this.form.mobile,
        });
        uni.hideLoading();
        // 这里此提示会被this.start()方法中的提示覆盖
        uni.$u.toast("验证码已发送");
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start();
      } else {
        uni.$u.toast("倒计时结束后再发送");
      }
    },
    appSwitchMobile() {
      this.$refs["form"].validate().then(async () => {
        let form = {
          phone: this.form.mobile,
          phone_code: this.form.ver_code,
          bind_type: 2,
        };
        await this.$requestAll.user.userEmpower(form, true);
        this.loadData();
        this.$utils.toast("修改成功");
        this.form = this.$options.data().form;
      });
    },
    async loadData() {
      const res = await this.$requestAll.accountSettings.userIndex({});
      this.pageData = res.data;
    },
    async switchMobile(e) {
      console.log(e);
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        uni.checkSession({
          success: async (res) => {
            let data = {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              code: this.loginCode,
            };
            try{
              var res = await this.$requestAll.user.userBinding(data, true);
              this.loadData();
              this.$utils.toast("修改成功");
            }catch(e){
              uni.login({
                success: (res) => {
                  this.loginCode = res.code;
                  this.switchMobile(e)
                },
              });
            }  
          },
          fail: (err) => {
            uni.login({
              success: (res) => {
                console.log("getCode");
                this.loginCode = res.code;
                this.switchMobile(e)
              },
            });
          },
        });
      } else {
        uni.showModal({
          title: "提示",
          content: "获取手机号失败",
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          },
        });
      }
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onUnload() {
    time && clearInterval(time);
  },
  onHide() {
    time && clearInterval(time);
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding-top: 30rpx;
  .top-img {
    width: 288rpx;
    height: 288rpx;
    display: block;
    margin: 0 auto 30rpx;
  }
  .mobile-info {
    line-height: 40rpx;
    margin-bottom: 80rpx;
  }

  .zd-bt {
    /deep/.u-button {
      width: initial;
      box-sizing: border-box;
      height: 88rpx;
      background: #ff4544;
      border-radius: 44rpx;
      margin: 0rpx 24rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 30rpx;
    }
  }
}
</style>
