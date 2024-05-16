<template>
  <view class="body">
    <u-form
      labelWidth="140rpx"
      errorType="toast"
      :rules="rules"
      :model="form"
      ref="form"
    >
      <u-form-item label="手机号码" prop="mobile">
        <u--input
          disabled
          :value="form.mobile"
          type="number"
          border="none"
          placeholder="请输入手机号"
          :customStyle="{
            background: 'initial',
          }"
        ></u--input>
      </u-form-item>

      <u-form-item label="验证码" prop="code">
        <u-input
          v-model="form.code"
          :maxlength="6"
          type="number"
          border="none"
          placeholder="请输入验证码"
        >
          <template slot="suffix">
            <u-code
              ref="uCode"
              @change="codeChange"
              seconds="59"
              changeText="X秒重新获取"
            ></u-code>
            <text @click="getCode" style="color: #ff1b22; font-size: 30rpx">{{
              tips
            }}</text>
          </template>
        </u-input>
      </u-form-item>
    </u-form>

    <view @click="submit" class="submit flex-y-center flex-x-center"
      >确定验证</view
    >

    <Password
      :show.sync="showPasswordPopup"
      type="reset"
      @success="$utils.backTo()"
    ></Password>
  </view>
</template>
<script>
import Password from '@/components/pay-password';
export default {
  components: {
    Password,
  },
  data() {
    return {
      showPasswordPopup: false,
      form: {
        mobile: '',
        code: '',
      },

      rules: {
        // 字段名称
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['change', 'blur'],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.mobile(value);
            },
            message: '手机号码不正确',
            // 触发器可以同时用blur和change
            trigger: ['change', 'blur'],
          },
        ],
        code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['change', 'blur'],
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.code(value, 6);
            },
            message: '验证码输入不正确',
            // 触发器可以同时用blur和change
            trigger: ['change', 'blur'],
          },
        ],
      },
      tips: '获取验证码',
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
  },
  onLoad() {
    if (!this.userInfo.binding) {
      return uni.showModal({
        title: '提示',
        content: '请先绑定手机号',
        showCancel: false,
        success: ({ confirm, cancel }) => {
          confirm &&
            this.$utils.toUrl(
              '/account-settings/accounts-security/index',
              'redirectTo'
            );
        },
      });
    } else {
      this.form.mobile = this.userInfo.binding;
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  onShow() {},
  methods: {
    codeChange(text) {
      this.tips = text;
    },
    // 获取验证码
    async getCode() {
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        await this.$requestAll.auth.sendSmsCode({
          mobile: this.form.mobile,
        });
        // 这里此提示会被this.start()方法中的提示覆盖
        uni.$u.toast('验证码已发送');
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start();
      } else {
        uni.$u.toast('倒计时结束后再发送');
      }
    },
    submit() {
      this.$refs.form.validate().then(async res => {
        await this.$requestAll.auth.verifySmsCode({
          mobile: this.form.mobile,
          ver_code: this.form.code,
        });
        this.showPasswordPopup = true;
      });
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
  padding-top: 20rpx;
}
/deep/.u-form-item {
  .u-form-item__body {
    padding: 0 24rpx;
    height: 102rpx;
    background: #fff;
    .u-form-item__body__left__content__label {
      font-size: 30rpx;
    }
  }
}

.submit {
  margin: 80rpx auto;
  width: 678rpx;
  height: 80rpx;
  background: #ff1b22;
  border-radius: 88rpx;
  color: #fff;
  font-size: 32rpx;
}
</style>
