<template>
  <view class="box">
    <div
      class="statusBar"
      :style="'height:' + systemInfo.statusBarHeight + 'px'"
    ></div>

    <view class="head">
      <view
        class="iconfont icon-arrow-left font-54"
        @click="loginBackTo()"
      ></view>
	  <!-- #ifndef H5 -->
	    <view>请登录</view>
	  <!-- #endif -->
    
    </view>

    <view class="login-content">
      <view>
        <!-- 微信环境开始··························· -->
        <!-- #ifdef MP-WEIXIN -->

        <!-- 后台配置登录默认头像昵称 -->
        <view
          v-if="store.default_user_info"
          class="app"
          style="margin-bottom: 150rpx"
        >
          <image
            :src="store && store.store_share_logo"
            mode="heightFix"
            class="logo-img"
          ></image>
          <text>{{ store.name }}</text>
        </view>
        <!-- 未设置默认头像昵称，需采集信息 -->
        <template v-else>
          <button
            class="avatar-wrapper button-initial"
            open-type="chooseAvatar"
            @chooseavatar="onChooseAvatar"
          >
            <image
              class="avatar"
              :src="avatar_url || wxapp_img.default.user_head"
              mode="aspectFill"
              style="border-radius: 50%"
            ></image>
          </button>

          <view
            class="flex-y-center p-x-30"
            style="width: 100%; margin-top: 100rpx; margin-bottom: 150rpx"
          >
            <view class="m-r-20 font-w-600 font-32">昵称</view>
            <view class="flex-w-1">
              <u-input
                v-model="nickname"
                border="bottom"
                type="nickname"
                placeholder="请输入昵称"
              ></u-input>
            </view>
          </view>
        </template>

        <!-- 微信账号登录 -->
        <button v-if="store.login_type" class="btn" @click="getuserinfo">
          <!-- <text
            class="iconfont icon-wechat"
            style="
              color: #fff;
              font-size: 40rpx;
              font-weight: 400;
              margin-right: 14rpx;
            "
          ></text> -->
          账号快捷登录
        </button>

        <!-- 微信手机号登录 -->
        <view v-else class="btn moblie-btn-box">
          <button
            v-if="isShowMoblieLoginBtnMask"
            style="margin-top: 0"
            class="btn mask"
            @click="getphonenumber"
          >
            <!-- <text
              class="iconfont icon-wechat"
              style="
                color: #fff;
                font-size: 40rpx;
                font-weight: 400;
                margin-right: 14rpx;
              "
            ></text> -->
            手机号快捷登录
          </button>
          <button
            class="btn"
            style="margin-top: 0"
            open-type="getPhoneNumber"
            @getphonenumber="getphonenumber"
          >
            <!-- <text
              class="iconfont icon-wechat"
              style="
                color: #fff;
                font-size: 40rpx;
                font-weight: 400;
                margin-right: 14rpx;
              "
            ></text> -->
            手机号快捷登录
          </button>
        </view>
        <!-- #endif -->
        <!-- 微信环境结束··························· -->

        <!-- 非微信环境开始··························· -->
        <!-- #ifndef MP-WEIXIN -->
        <view class="app">
          <image
            :src="store && store.store_share_logo"
            mode="heightFix"
            class="logo-img"
          ></image>
          <text>{{ store.name }}</text>
        </view>

        <view class="m-t-30 p-x-20 p-t-30">
          <u-form
            :model="loginForm"
            :rules="rules"
            ref="loginForm"
            labelWidth="150rpx"
          >
            <u-form-item :label="isCode ? '手机号：' : '账号'" prop="mobile">
              <u-input
                v-model="loginForm.mobile"
                type="text"
                placeholder="请输入11位手机号"
                border="bottom"
              >
              </u-input>
            </u-form-item>
            <u-form-item v-if="isCode" label="验证码：" prop="code">
              <u-input
                v-model="loginForm.code"
                type="number"
                placeholder="请输入手机验证码"
                border="bottom"
                @confirm="submit"
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
            <u-form-item v-else label="密码：" prop="password">
              <u-input
                @confirm="submit"
                v-model="loginForm.password"
                :type="isShowPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                border="bottom"
              >
                <view class="flex-y-center" slot="suffix">
                  <text
                    @click="isShowPassword = !isShowPassword"
                    v-if="isShowPassword"
                    class="iconfont icon-yincang color-999 p-x-20"
                  ></text>
                  <text
                    @click="isShowPassword = !isShowPassword"
                    v-else
                    class="iconfont icon-yanjing_xianshi color-999 p-x-20"
                  ></text>
                  <text
                    @click="$utils.toUrl('/auth/reg?type=pass')"
                    class="color-999"
                    >忘记密码</text
                  >
                </view>
              </u-input>
            </u-form-item>
          </u-form>
        </view>
        <view class="color-999 m-t-30 flex-x-sb p-x-20">
          <view @click="isCode = !isCode">{{
            isCode ? "密码登录" : "手机号登录"
          }}</view>
          <view @click="$utils.toUrl('/auth/reg?type=reg')">新用户注册</view>
        </view>

        <div @click="submit" class="btn btn1">登录</div>

        <!-- #ifdef H5 -->
        <button
          v-if="$utils.is_webpage()"
          style="margin-top: 40rpx"
          class="btn"
          open-type="login"
          @click="getuserinfo"
        >
          <text
            class="iconfont icon-wechat"
            style="
              color: #fff;
              font-size: 40rpx;
              font-weight: 400;
              margin-right: 14rpx;
            "
          ></text>
          微信快捷登录
        </button>
        <!-- #endif -->

        <!-- #ifdef APP-PLUS -->
        <button
          v-if="systemInfo.osName == 'ios' && store.is_apple_login"
          style="margin-top: 40rpx; background: #000"
          class="btn"
          open-type="login"
          @click="getuserinfo('apple')"
        >
          <text
            class="iconfont icon-apple"
            style="
              color: #fff;
              font-size: 40rpx;
              font-weight: 400;
              margin-right: 14rpx;
            "
          ></text>
          通过Apple登录
        </button>

        <button
          style="margin-top: 40rpx"
          class="btn"
          open-type="login"
          @click="getuserinfo('weixin')"
        >
          <text
            class="iconfont icon-wechat"
            style="
              color: #fff;
              font-size: 40rpx;
              font-weight: 400;
              margin-right: 14rpx;
            "
          ></text>
          微信快捷登录
        </button>
        <!-- #endif -->

        <!-- #endif -->
        <!-- 非微信环境结束··························· -->
      </view>

      <!-- 底部协议 -->
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

    <canvas
      :style="{
        width: `${systemInfo.windowWidth}px`,
        height: `${systemInfo.windowWidth}px`,
        position: 'absolute',
        zIndex: '-1',
        left: '-10000rpx',
        top: '-10000rpx',
      }"
      canvas-id="zipCanvas"
    ></canvas>
    <WxPrivacyPopup ref="WxPrivacyPopup"></WxPrivacyPopup>
  </view>
</template>

<script>
import WxPrivacyPopup from '../../components/wx-privacy-popup.vue'
import siteinfo from "@/siteinfo.js";
import request from "@/utils/request.js";
export default {
  components: {WxPrivacyPopup,},
  computed: {
    // 手机号登录蒙层是否显示
    isShowMoblieLoginBtnMask() {
      return (
        !this.isShowPhoneBt ||
        !this.avatar_url ||
        !this.nickname ||
        (this.nickname && !this.nickname.trim().length) ||
        !this.isAgree
      );
    },
  },
  data() {
    return {
      current_env: "weixin",
      isCode: false,
      isShowPassword: false,
      tips: "获取验证码",
      access_token: "",
      loginForm: {
        mobile: "",
        code: "",
        password: "",
      },
      rules: {
        mobile: [
          {
            type: "number",
            required: true,
            message: "请输入手机号",
            trigger: ["blur"],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            trigger: ["blur"],
          },
        ],
        code: [
          {
            type: "number",
            required: true,
            message: "请输入验证码",
            trigger: ["blur"],
          },
          {
            validator: (rule, value, callback) => {
              return uni.$u.test.code(value, 6);
            },
            message: "验证码不正确",
            trigger: ["blur"],
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: ["blur"],
          },
        ],
      },
      avatar_url: "",
      nickname: "",
      showWxPopup: false,
      isShowPhoneBt: false, // 用于获取到后端返回的数据再展示手机号按钮,防止未获取到默认数据，点击按钮弹出用户昵称或者头像不能为空而没有信息采集框
      code: "",
      isAgree: false, //是否同意协议
    };
  },
  onReady() {
    this.$refs.loginForm && this.$refs.loginForm.setRules(this.rules);
  },
  onLoad(params) {
    // 用于公众号登录
    if (params.access_token) {
      this.isAgree = true;
      this.access_token = params.access_token;
      this.getuserinfo();
    }

    // #ifdef H5
    // 处理手机号登录获取code，微信公众号支付open_id报错问题
    var { origin, pathname, hash, search } = window.location;

    if (this.$utils.is_webpage()) {
      // 如果是参数在路由前转换至路由后边，防止再次进入onLoad获取不到参数
      if (search && !params.code) {
        return window.location.replace(origin + pathname + hash + search);
      } else {
        if (params.code) {
          this.isAgree = true;
          this.code = params.code;
          let form = JSON.parse(params.state);
          form.ver_code && (form.code = form.ver_code);
          delete form.ver_code;
          this.isCode = form.isCode;
          delete form.isCode;
          this.loginForm = form;

          this.$nextTick(() => {
            this.submit();
          });
        }
      }
    }

    // #endif

    // #ifdef MP-WEIXIN
    this.getUserNameAvatar();
    // #endif

    this.$nextTick(() => {
      this.$refs["WxPrivacyPopup"]?.switchShow(true);
    });
  },
  onShow() {},
  methods: {
    getUserNameAvatar(v) {
      uni.login({
        success: async (success) => {
          const res = await this.$requestAll.login.passportCode({
            code: success.code,
          });
          // 未查到信息  &&  商城开启了默认头像昵称
          if (!res.data.avatar_url && this.store.default_user_info) {
            this.avatar_url = this.store.default_user_info.default_user_pic;
            this.nickname = this.store.default_user_info.default_user_nickname;
          } else {
            this.avatar_url = res.data.avatar_url || "";
            this.nickname = res.data.nickname || "";
          }
          this.isShowPhoneBt = true;
        }
      });
    },
    // 获取头像
    async onChooseAvatar(e) {
		console.log('e,',e)
      const { avatarUrl } = e.detail;
      console.log(e);
      const res = await request.UPLOAD_IMAGE(
        avatarUrl,
        "/default/upload-image",
        "image"
      );
      this.avatar_url = res.data.url;
    },
    // 微信手机号登录
    async getphonenumber(e) {
      if (!this.isAgree) return uni.$u.toast("请先同意底部协议");
      if (!this.isShowPhoneBt) return uni.$u.toast("数据加载中，请稍后再试");

      if (!this.nickname || (this.nickname && !this.nickname.trim().length))
        return uni.$u.toast("用户昵称不能为空");

      if (!this.avatar_url) return uni.$u.toast("请上传头像");

      let { detail } = e;
      if (detail.errMsg == "getPhoneNumber:ok") {
        const loginData = await wx.login();
        console.log(loginData, "loginData");
        if (loginData.errMsg !== "login:ok")
          return this.$utils.toast(loginData.errMsg || "授权login失败，请重试");
        console.log(detail);
        var param = {
          code: loginData.code,
          encrypted_data: detail.encryptedData,
          iv: detail.iv,
          signature: detail.signature,
          parent_id: this.$store.getters["parent_id"] || "",
          nickname: this.nickname,
          avatar_url: this.avatar_url || this.wxapp_img.default.user_head,
        };
        const result = await this.$requestAll.login.loginPhone(param, true);
        // 设置缓存
        this.$store.commit("login/login", result.data);
        // 返回上一页
        this.loginBackTo(result.data);
      } else {
        uni.$u.toast(detail.errMsg);
      }
    },
    // 判断是否需要手机号绑定
    isMobileBinding(userInfo) {
      return new Promise((resolve, reject) => {
        if (!userInfo.binding && this.store.login_forcibly_bind_mobile) {
          uni.showModal({
            title: "提示",
            content: "需要手机认证",
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                this.$utils.toUrl("/account-settings/bangding/bangding");
              }
            },
          });
          reject(false);
        } else {
          resolve(true);
        }
      });
    },
    // 微信用户信息登录
    async getuserinfo(provider) {
      if (!this.isAgree) return uni.$u.toast("请先同意底部协议");
      /* #ifdef MP-WEIXIN */
      if (!this.nickname.trim().length) return uni.$u.toast("用户昵称不能为空");
      if (!this.avatar_url.length) return uni.$u.toast("用户头像不能为空");
      wx.getUserProfile({
        desc: "用户完善会员资料",
        success: async (userInfo) => {
          console.log(userInfo, "userInfo");
          const loginData = await wx.login();
          console.log(loginData, "loginData");
          if (loginData.errMsg !== "login:ok")
            return this.$utils.toast(loginData.errMsg);
          // 服务发起登录
          const param = {
            code: loginData.code,
            user_info: userInfo.rawData,
            encrypted_data: userInfo.encryptedData,
            iv: userInfo.iv,
            signature: userInfo.signature,
            parent_id: this.$store.getters["parent_id"] || "",
            nickname: this.nickname,
            avatar_url: this.avatar_url,
          };
          const result = await this.$requestAll.login.wxLogin(param, true);
          // 设置缓存
          this.$store.commit("login/login", result.data);
          this.loginBackTo(result.data);
        },
        fail:err => {
          if(err.errMsg == 'getUserProfile:fail privacy permission is not authorized') {
            this.$refs['WxPrivacyPopup'].switchShow(true)
            uni.$u.toast('请先授权隐私协议！')
          }
        }
      });

      /* #endif */

      /* #ifdef H5 */
      if (this.access_token) {
        const result = await this.$requestAll.user
          .userInfo({
            access_token: this.access_token,
          })
          .catch((error) => error);
        console.log(result);
        // 设置缓存
        this.$store.commit("login/login", result.data);
        // 返回上一页
        this.loginBackTo(result.data);
      } else {
        let origin = window.location.origin;

        let baseUrl =
          process.env.NODE_ENV === "development"
            ? origin
            : `${window.location.protocol}//${window.location.host}`;
        window.location.href = `${baseUrl}/web/index.php?_platform=app&store_id=${
          this.$store.getters["currentStore"].id ||
          "" ||
          siteinfo.api_data.store_id
        }&r=api/passport/gzh-login`;
      }
      /* #endif */

      /* #ifdef APP-PLUS */
      uni.login({
        provider: provider,
        scopes: ["auth_user"],
        success: (res) => {
          console.log(res, "login");

          uni.getUserInfo({
            provider: provider,
            success: async (userInfo) => {
              console.log(userInfo, "userInfo");
              if (userInfo.errMsg !== "getUserInfo:ok")
                return uni.$u.toast(userInfo.errMsg);
              // 服务发起登录
              const param = {
                unionid: res.authResult.unionid,
                openid: res.authResult.openid,
                nickname: userInfo.userInfo.nickName,
                headimgurl: userInfo.userInfo.avatarUrl,
                // appcid: plus.push.getClientInfo().clientid,
              };
              console.log(param, "发送参数");
              try {
                const result = await this.$requestAll.default.wxLogin(
                  param,
                  true
                );
                // 设置缓存
                this.$store.commit("login/login", result.data);
                // 返回上一页
                this.loginBackTo(result.data);
              } catch (error) {
                console.log(error, "error");
                this.$utils.showModalAsync({
                  content: JSON.stringify(error),
                  showCancel: false,
                });
              }
            },
            fail: (fail) => {
              console.log(fail);
              this.$utils.showModalAsync({
                content: JSON.stringify(fail),
                showCancel: false,
              });
            },
          });
        },
        fail: (fail) => {
          this.$utils.showModalAsync({
            content: '用户取消登录',
            showCancel: false,
          });

          console.log(fail);
        },
      });
      /* #endif */
    },
    codeChange(text) {
      this.tips = text;
    },
    async getCode() {
      let mobile = this.loginForm.mobile;
      if (!uni.$u.test.mobile(mobile))
        return uni.$u.toast("请输入正确的手机号");
      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: "正在获取验证码",
        });
        await this.$requestAll.auth
          .sendSmsCode({
            mobile: this.loginForm.mobile,
          })
          .catch(() => uni.hideLoading);

        uni.hideLoading();
        uni.$u.toast("验证码已发送");
        // 通知验证码组件内部开始倒计时
        this.$refs.uCode.start();
      } else {
        uni.$u.toast("请在倒计时结束后获取");
      }
    },
    // 手机号  或 密码登录
    async submit() {
      if (!this.isAgree) return uni.$u.toast("请先同意底部协议");

      if (this.isCode) {
        var loginData = {
          type: "mobile",
          mobile: this.loginForm.mobile,
          ver_code: this.loginForm.code,
        };
      } else {
        var loginData = {
          type: "password",
          mobile: this.loginForm.mobile,
          password: this.loginForm.password,
        };
      }
      this.$refs["loginForm"].validate().then(async () => {
        if (
          !this.code &&
          this.$utils.is_webpage() &&
          process.env.NODE_ENV != "development"
        )
          return this.getWxCode(loginData);

        const res = await this.$requestAll.auth.authLogin(
          { ...loginData, code: this.code },
          true
        );
        this.$store.commit("login/login", res.data);

        this.loginBackTo(res.data);
      });
    },
    async getWxCode(formData) {
      var url = window.location.href.split("#")[0];
      if (process.env.NODE_ENV == "development")
        url = "http://qjonline.cyyvip.com/webpage/";
      var res = await this.$requestAll.wechat.wechatConfig({ url });

      let appid = res.data.app_id; //微信APPid
      let local = window.location.href;
      // ${JSON.stringify(formData)}
      // console.log(encodeURIComponent(local));
      //不存在就打开上面的地址进行授权
      // window.location.href =
      //   'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
      //   appid +
      //   '&redirect_uri=' +
      //   encodeURI(local) +
      //   '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
      window.location.replace(
        `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(
          local
        )}&response_type=code&scope=snsapi_base&state=${JSON.stringify({
          ...formData,
          isCode: this.isCode,
        })}#wechat_redirect`
      );
    },
    async loginBackTo(userInfo) {
      console.log(userInfo);
      if (
        userInfo &&
        this.$store.getters["parent_id"] &&
        userInfo.parent_id <= 0
      ) {
        this.$requestAll.share.bindParent({
          parent_id: this.$store.getters["parent_id"],
        });
        this.$store.commit("setParentId", "");
      }

      // 强制绑定手机号
      // if (userInfo) await this.isMobileBinding(userInfo);
      // 返回上一页
      let cacheData = this.$store.getters["cacheData"];
      console.log(cacheData);
      if (cacheData && uni.getStorageSync("token")) {
        this.$store.commit("setCacheData", "");
        this.$utils.toUrl(
          cacheData.path + uni.$u.queryParams(cacheData.options),
          "reLaunch"
        );
      } else {
        let curPages = getCurrentPages();
        console.log(curPages, "pages");
        if (curPages.length > 1) {
          for (let i = curPages.length - 1; i < curPages.length; i--) {
            const item = curPages[i];
            console.log(item.route);
            if (
              item.route !== "login/login/login_page" &&
              item.route !== "auth/reg" &&
              item.route !== "auth/password"
            ) {
              // 返回到上级页面
              console.log(item.route, "返回的这个页面", -(i + 1));
              return this.$utils.backTo(i + 1);
              // return this.$utils.toUrl(`/${item.route}${uni.$u.queryParams(item.options)}`, "reLaunch");
            }
          }
        }
        this.$utils.toUrl(`/pages/index/index`, "reLaunch");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);

  /* #endif */
  .login-content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

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
  }

  .head {
    display: flex;
    padding-left: 20rpx;
    padding-right: 80rpx;
    // justify-content: space-between;
    align-items: center;
    height: 88rpx;
    width: 100%;

    > view:nth-child(2) {
      // width: 500rpx;
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: rgba(29, 29, 29, 0.94);
      opacity: 1;
    }
  }

  .app {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 220rpx;
    font-size: 30rpx;
    line-height: 42rpx;
    color: #262626;
    font-weight: 600;

    .logo-img {
      height: 100rpx;
      margin-bottom: 22rpx;
    }
  }

  .btn {
    cursor: pointer;
    width: 600rpx;
    height: 88rpx;
    border-radius: 44rpx;
    background: #2cba0a;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 600;
    color: #ffffff;
  }

  .btn1 {
    margin: auto;
    margin-top: 30px;
    background: linear-gradient(90deg, #f22300, #ff4c17);
  }

  .avatar {
    margin-top: 200rpx;
    width: 140rpx;
    height: 140rpx;
    border-radius: 10rpx;
    background: #f5f5f5;
  }

  .moblie-btn-box {
    position: relative;
    margin-left: auto;
    margin-right: auto;
    .btn {
      margin-top: 0;
    }
    .mask {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 9;
    }
  }
}
</style>
