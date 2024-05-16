<template>
  <view class="body">
    <image :src="wxapp_img.spread.back_red" mode="aspectFill" />
    <div class="page-content">
      <div class="flow">
        <div class="flow_icon">
          <img :src="wxapp_img.spread.bianji" alt="aspectFill" />
          <div>注册账户</div>
        </div>
        <img class="flow_img" :src="wxapp_img.spread.jindu" alt="" />
        <div class="flow_icon">
          <img :src="wxapp_img.spread.mobile" alt="aspectFill" />
          <div>下载APP</div>
        </div>
        <img class="flow_img" :src="wxapp_img.spread.jindu" alt="" />
        <div class="flow_icon">
          <img :src="wxapp_img.spread.liwu" alt="aspectFill" />
          <div>领福利</div>
        </div>
      </div>

      <div class="tabs">
        <div @click="switchTab(1)" :class="['tab', check == 1 && 'check']">
          手机号
        </div>
        <div @click="switchTab(2)" :class="['tab', check == 2 && 'check']">
          微信
        </div>
      </div>

      <div class="form-box">
        <u-form
          :model="loginForm"
          :rules="rules"
          ref="loginForm"
          labelWidth="140rpx"
          :errorType="'toast'"
        >
          <u-form-item label="手机号" prop="mobile">
            <u-input
              v-model="loginForm.mobile"
              border="none"
              shape="circle"
              placeholder="请输入手机号"
              type="number"
            ></u-input>
          </u-form-item>
          <u-form-item label="密码" prop="password">
            <u-input
              v-model="loginForm.password"
              border="none"
              shape="circle"
              placeholder="请输入密码"
              type="password"
            ></u-input>
          </u-form-item>
          <u-form-item label="验证码" prop="code">
            <u-input
              v-model="loginForm.code"
              placeholder="请输入验证码"
              type="number"
              border="none"
              shape="circle"
              maxlength="6"
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
      </div>

      <div @click="submit" class="page-btn">立即注册</div>
      <div @click="$utils.toUrl('/spread/down')" class="page-btn">
        直接下载APP
      </div>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      parent_id: 0,
      pageData: '',
      check: 1,
      loginForm: {
        mobile: '',
        code: '',
        password: '',
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['blur', 'change'],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value);
            },
            message: '手机号码不正确',
          },
        ],
        code: [
          {
            type: 'number',
            required: true,
            message: '请输入验证码',
            trigger: ['blur'],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.code(value, 6);
            },
            message: '验证码不正确',
            trigger: ['blur'],
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['blur'],
          },
          {
            min: 6,
            max: 15,
            message: '长度在6-15个字符之间',
          },
        ],
      },
      tips: '获取验证码',
    };
  },
  onLoad(params) {
    this.parent_id = params.user_id || params.parent_id || 0;
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.loginForm.setRules(this.rules);
  },
  onShow() {},
  methods: {
    switchTab(i) {
      this.check = i;
    },
    codeChange(text) {
      this.tips = text;
    },
    async getCode() {
      if (!uni.$u.test.mobile(this.loginForm.mobile, 6))
        return uni.$u.toast('手机号码不正确');

      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        await this.$requestAll.auth.sendSmsCode({
          mobile: this.loginForm.mobile,
          type: 'reg',
        });
        uni.$u.toast('验证码已发送');
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start();
      } else {
        uni.$u.toast('倒计时结束后再发送');
      }
    },
    submit() {
      this.$refs['loginForm'].validate().then(async () => {
        let formData = {
          mobile: this.loginForm.mobile,
          ver_code: this.loginForm.code,
          password: this.loginForm.password,
          parent_id: this.parent_id,
          type: 'reg'
        };
        await this.$requestAll.auth.regAndBind(formData, true);
        uni.$u.toast('注册成功');
        setTimeout(() => {
          this.$utils.toUrl('/spread/down')
        },800)
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
  position: relative;
  background: #f5f5f5;
  > image {
    width: 100vw;
    height: 100vh;
  }
  .page-content {
    position: absolute;
    left: 30rpx;
    right: 30rpx;
    z-index: 9;
    background-color: #fff;
    height: 68vh;
    border-radius: 24rpx;
    top: 30vh;
    overflow: hidden;
    .flow {
      padding: 80rpx 70rpx 0;
      // position: absolute;
      // top: 40px;
      // left: 35px;
      // right: 35px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      .flow_img {
        width: 50rpx;
        height: 10rpx;
        position: relative;
        top: -24rpx;
      }
      .flow_icon {
        font-size: 24rpx;
        > img {
          margin-bottom: 10rpx;
          width: 70rpx;
          height: 70rpx;
          display: inline-block;
        }
      }
    }
    .tabs {
      display: flex;
      justify-content: center;
      align-items: center;
      .tab {
        line-height: 80rpx;
        padding: 0 20rpx;
        color: #999;
      }
      .check {
        color: #333;
        font-weight: 700;
      }
    }

    .form-box {
      padding: 0 30rpx;
      min-height: 320rpx;
    }
    /deep/.u-input {
      background: #eee;
    }

    .page-btn {
      margin: 30rpx 40rpx;

      line-height: 80rpx;
      border-radius: 40rpx;
      text-align: center;
      font-size: 30rpx;
      color: #fff;
      background: red;
    }
  }
}
</style>
