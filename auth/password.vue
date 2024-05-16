<template>
  <view class="body">
    <u-form :model="form" :rules="rules" ref="form">
      <u-form-item prop="password">
        <u-input
          v-model="form.password"
          border="bottom"
          placeholder="请输入密码"
        ></u-input>
      </u-form-item>

      <u-form-item prop="confirm_password">
        <u-input
          v-model="form.confirm_password"
          border="bottom"
          placeholder="请再次输入密码"
        ></u-input>
      </u-form-item>
    </u-form>

    <div class="submit" @click="submit">提交</div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      mobile: '',
      type: '',
      form: { password: '', confirm_password: '' },
      rules: {
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur'],
          },
        ],
        confirm_password: [
          {
            required: true,
            message: '请输入确认密码',
            trigger: ['blur'],
          },
          {
            validator: (rule, value, callback) => {
              if (this.form.password.length && value != this.form.password) {
                return false;
              } else {
                return true;
              }
            },
            trigger: ['blur'],
            message: '两次密码不一致',
          },
        ],
      },
    };
  },
  onLoad(params) {
    this.type = params.type;
    if (this.type == 'reg') uni.setNavigationBarTitle({ title: '手机号注册' });
    this.mobile = params.mobile;
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  onShow() {},
  methods: {
    submit() {
      this.$refs['form'].validate().then(async () => {
        let formData = {
          mobile: this.mobile,
          ...this.form,
        };
        await this.$requestAll.auth.editPass(formData, true);
        // this.$store.commit('setCacheData', '');

        // 当前用户信息存在表示注册，判断是否有缓存跳转页面
        if (this.$store.getters['user/userInfo']) {
          let cacheData = this.$store.getters['cacheData'];
          if (cacheData) {
            this.$store.commit('setCacheData', '');
            return this.$utils.toUrl(
              cacheData.path + uni.$u.queryParams(cacheData.options),
              'redirectTo'
            );
          }
          // 1验证码 2登录页，3上级页面
          // this.$utils.backTo(3)
        }
        this.$utils.toUrl('/login/login/login_page', 'redirectTo');
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
</style>
