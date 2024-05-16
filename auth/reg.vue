<template>
  <view class="body">
    <u-form :model="form" :rules="rules" ref="form" labelWidth="200rpx">
      <u-form-item prop="mobile">
        <u-input
          v-model="form.mobile"
          border="bottom"
          placeholder="请输入手机号"
        ></u-input>
      </u-form-item>

      <u-form-item prop="ver_code">
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

      <u-form-item>
        <u-input
          v-model="form.invite_code"
          border="bottom"
          placeholder="请输入邀请码（选填）"
        ></u-input>
      </u-form-item>
    </u-form>

    <div class="submit" @click="submit">下一步</div>
	<view class="tcp-box m-t-30 flex-y-center flex-x-center">
	  <text
	    @click="isAgree = !isAgree"
	    v-if="isAgree"
	    class="iconfont icon-success-fill price-color"
	  ></text>
	  <text
	    @click="isAgree = !isAgree"
	    v-else
	    class="iconfont icon-xuanzekuangmoren color-666"
	  ></text>
	  <text
	    @click="
	      $utils.toUrl(
	        '/pages/article-detail/article-detail?id=' +
	          store.option.client_service_id
	      )
	    "
	  >
	    《服务条款》
	  </text>
	  <text style="margin: 0 5rpx; color: #262626">与</text>
	  <text
	    @click="
	      $utils.toUrl(
	        '/pages/article-detail/article-detail?id=' +
	          store.option.client_privacy_id
	      )
	    "
	  >
	    《隐私政策》
	  </text>
	</view>
  </view>
</template>
<script>
export default {
  data() {
    return {
	  isAgree: false, //是否同意协议
      type: 'reg',
      form: { mobile: '', ver_code: '', invite_code: '' },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur'],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value);
            },
            message: '请正确输入手机号',
            trigger: ['blur'],
          },
        ],
        ver_code: [
          {
            required: true,
            message: '请输入验证码',
            trigger: ['blur'],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.code(value, 6);
            },
            trigger: ['blur'],
            message: '请正确输入验证码',
          },
        ],
      },
      tips: '获取验证码',
    };
  },
  onLoad(params) {
    this.type = params.type;
    if (this.type == 'reg') {
      uni.setNavigationBarTitle({ title: '新用户注册' });
    } else {
      uni.setNavigationBarTitle({ title: '找回密码' });
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

    async getCode() {
      if (!uni.$u.test.mobile(this.form.mobile))
        return uni.$u.toast('请正确输入手机号');
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: '正在获取验证码',
        });
        let formData = { mobile: this.form.mobile, type: this.type };
        await this.$requestAll.auth.sendSmsCode(formData);
        uni.hideLoading();
        // 这里此提示会被this.start()方法中的提示覆盖
        uni.$u.toast('验证码已发送');
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start();
      } else {
        uni.$u.toast('倒计时结束后再发送');
      }
    },
    submit() {
		if (!this.isAgree) return uni.$u.toast("请先同意底部协议");
      this.$refs['form'].validate().then(async () => {
        let formData = {
          type: this.type,
          ...this.form,
        };
        await this.$requestAll.auth.verifySmsCode(formData, true);
        if (this.type == 'reg') {
          let res = await this.$requestAll.auth.regUser(formData, true);
          this.$store.commit('login/login',res.data)
          await this.$requestAll.share
            .bindParent({
              parent_id: this.form.invite_code,
            })
            .catch(err => err);
        }

        this.$utils.toUrl(
          '/auth/password' +
            uni.$u.queryParams({
              type: this.type == 'reg' ? 'set' : 'edit',
              mobile: this.form.mobile,
            }),
            'redirectTo'
        );
      });
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
  padding: 30rpx;
  background: #fff;
  min-height: 100vh;
}

.submit {
  cursor: pointer;
  margin: auto;
  margin-top: 30px;
  background: linear-gradient(90deg, #f22300, #ff4c17);
  width: 312px;
  height: 45px;
  border-radius: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 600;
  color: #ffffff;
}
    .tcp-box {
      text-align: center;
      color: #f0250e;
      font-size: 25rpx;
      margin-bottom: 28rpx;
      margin-bottom: calc(28rpx + env(safe-area-inset-bottom));
      .iconfont {
        height: 34rpx;
        line-height: 34rpx;
        font-size: 40rpx;
      }
    }
</style>
