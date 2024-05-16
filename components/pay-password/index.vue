<template>
  <view class="pay-password">
    <u-popup
      :show="show"
      :safeAreaInsetBottom="false"
      :overlayStyle="{ zIndex: 888 }"
      zIndex="999"
      mode="bottom"
      round="20rpx"
    >
      <view class="password flex-col flex-x-sb">
        <div class="title flex-y-center p-x-30 p-y-30">
          <div v-if="!type" class="flex-w-1 font-w-600 font-32 font-center">
            <!-- 当前未开通免密支付 && 已设置支付密码 -->
            <template
              v-if="
                !userInfo.is_free_payment && userInfo.is_set_balance_password
              "
            >
              请输入支付密码
            </template>
            <template v-else> 正在使用免密支付 </template>
          </div>

          <div v-else class="flex-w-1 font-w-600 font-32 font-center">
            <!-- 密码验证 -->
            <template v-if="type == 'pass'">
              请输入支付密码，以验证身份。
            </template>

            <!-- 重置密码 -->
            <template v-else-if="type == 'reset'">
              <template v-if="!password_new">
                请设置支付密码，用于支付验证。
              </template>
              <template v-else> 请确定支付密码，用于设置支付密码。 </template>
            </template>

            <!-- 修改密码 -->
            <template v-else-if="type == 'passReset'">
              <template v-if="!password">请输入支付密码，以验证身份。</template>
              <template v-else-if="!password_new">
                请设置支付密码，用于设置支付密码。</template
              >
              <template v-else> 请确定支付密码，用于设置支付密码。 </template>
            </template>
          </div>

          <div
            @click="$emit('update:show', false)"
            class="right iconfont icon-close font-40"
          ></div>
        </div>

        <view v-if="!type" class="price">
          <text style="font-size: 52rpx">￥</text>
          <text style="font-size: 76rpx">{{ price }}</text>
        </view>

        <div v-if="!type" class="pay-text flex-y-center flex-x-sb m-x-30">
          <div class="left">支付方式</div>
          <div class="right">余额支付</div>
        </div>

        <!-- 未开通免密 && 已设置支付密码 || 当前为修改密码，或者密码验证，或者重置密码-->
        <template
          v-if="
            (!userInfo.is_free_payment && userInfo.is_set_balance_password) ||
            type
          "
        >
          <view class="password-contetn">
            <view class="input-box">
              <view
                v-for="(item, i) in 6"
                :key="i"
                :class="['input-item', pagePasswordLength > i && 'check']"
              >
              </view>
            </view>
          </view>

          <view class="keyboard flex-wrap flex">
            <view @click="clickItem(i)" v-for="(item, i) in 9" :key="i">
              {{ i + 1 }}
            </view>
            <view class="keyboard_1"></view>
            <view @click="clickItem(-1)">0</view>
            <view @click="delPassword" class="keyboard_1">
              <text class="iconfont icon-tuige font-50"></text>
            </view>
          </view>
          <view class="zhanwei"></view>
        </template>

        <view class="bt-tip" v-else>
          <!-- 未设置免密密码 -->
          <template v-if="!userInfo.is_set_balance_password">
            <div
              @click="$utils.toUrl('/account-settings/pay-setting/pay-setting')"
              class="bt bt_1"
            >
              设置支付密码
            </div>
            <div
              @click="$utils.toUrl('/account-settings/pay-setting/pay-setting')"
              class="tip"
            >
              暂未设置支付密码，去设置>
            </div>
          </template>
          <!-- 免密支付 -->
          <template v-else-if="userInfo.is_free_payment">
            <div @click="submitPassword(1)" class="bt">免密支付</div>
            <div
              @click="$utils.toUrl('/account-settings/password-switch/index')"
              class="tip"
            >
              不使用免密支付，去设置>
            </div>
          </template>

          <view class="zhanwei" style="background: #fff"></view>
        </view>
      </view>
    </u-popup>

    <u-popup
      :show="showModal"
      :safeAreaInsetBottom="false"
      mode="center"
      round="20rpx"
      closeable
      @close="this.showModal = false"
    >
      <view class="modal">
        <view class="modal-title">提示</view>
        <div class="modal-content p-30 font-center">
          <!-- 支付密码错误 -->
          <template v-if="modalStatus == 1"> 支付密码错误，请重试 </template>
          <!-- 密码已被锁定 -->
          <template v-if="modalStatus == 2">
            您已多次尝试失败，支付密码被暂时锁定，请去找回密码
          </template>
        </div>
        <div class="modal-bts">
          <template v-if="modalStatus == 1">
            <view
              @click="$utils.toUrl('/account-settings/pay-setting/pay-setting')"
              >忘记密码</view
            >
            <view @click="clickReset" class="confirm">重试</view>
          </template>
          <template v-else-if="modalStatus == 2">
            <view
              @click="$utils.toUrl('/account-settings/verify-mobile/index')"
              class="confirm"
              >找回密码</view
            >
          </template>
        </div>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  components: {},
  props: {
    price: {
      type: [String, Number],
      default: '0.00',
    },
    // 组件显示隐藏开关
    show: {
      type: [String, Boolean],
      default: false,
    },
    type: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      pagePassword: [],
      password: '', //旧密码
      password_new: '', //新密码
      showModal: false,
      modalStatus: 1,
    };
  },
  methods: {
    clickItem(i) {
      if (this.pagePassword.length >= 6) return;
      this.pagePassword.push(i + 1);
    },
    delPassword() {
      this.pagePassword.splice(-1);
    },
    // 密码验证
    async submitPassword(type) {
      // 免密支付
      if (type) {
        this.$emit('success');
        this.$emit('update:show', false);
        return;
      }

      // 密码支付
      let password = this.pagePassword.join('');
      try {
        // 密码验证
        if (this.type == 'pass' || !this.type) {
          const res = await this.$requestAll.pay
            .verifyBalancePassword(
              {
                password,
              },
              true
            )
            .catch(err => {
              if (err.msg == '密码验证不正确') {
                this.modalStatus = 1;
                this.showModal = true;
              } else if (err.msg == '超过验证次数，请找回密码') {
                this.modalStatus = 2;
                this.showModal = true;
              }
              throw false;
            });
          this.$emit('success');
          this.$emit('update:show', false);
        }
        // 重置密码，需收集两次新密码
        else if (this.type == 'reset') {
          // 第一次密码未采集
          if (!this.password_new) {
            this.password_new = this.pagePassword.join('');
            this.pagePassword = this.$options.data().pagePassword;
            return;
          }

          // 如果两次密码不一致
          let password_new_1 = this.pagePassword.join('');
          if (password_new_1 != this.password_new) {
            uni.showModal({
              title: '提示',
              content: '新密码两次输入不一致，请重新输入。',
              showCancel: false,
            });
            this.password_new = '';
            this.pagePassword = [];
            return;
          }

          const res = await this.$requestAll.pay.setBalancePassword(
            {
              password: this.password_new,
              password_confirm: password_new_1,
            },
            true
          );
          uni.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: ({ confirm, cancel }) => {
              if (confirm) {
                this.$emit('success');
                this.$emit('update:show', false);
              }
            },
          });
        }

        // 使用旧密码重置，需收集三次密码
        else if (this.type == 'passReset') {
          // 第一次密码采集
          if (!this.password) {
            this.password = this.pagePassword.join('');
            this.pagePassword = this.$options.data().pagePassword;
            return;
          }
          // 第二次密码采集
          else if (!this.password_new) {
            this.password_new = this.pagePassword.join('');
            this.pagePassword = this.$options.data().pagePassword;
            return;
          }

          // 如果两次密码不一致
          let password_new_1 = this.pagePassword.join('');
          if (password_new_1 != this.password_new) {
            uni.showModal({
              title: '提示',
              content: '新密码两次输入不一致，请重新输入。',
              showCancel: false,
            });
            this.password_new = '';
            this.pagePassword = [];
            return;
          }

          const res = await this.$requestAll.pay.editBalancePassword(
            {
              password: this.password,
              new_password: this.password_new,
              password_confirm: password_new_1,
            },
            true
          );
          uni.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            success: ({ confirm, cancel }) => {
              if (confirm) {
                this.$emit('success');
                this.$emit('update:show', false);
              }
            },
          });
        }
      } catch (error) {
        this.$emit('update:show', false);
      }
    },
    resetData() {
      let { pagePassword, password_new, password } = this.$options.data();
      this.pagePassword = pagePassword;
      this.password_new = password_new;
      this.password = password;
    },
    clickReset() {
      // this.resetData();
      this.showModal = false;
      this.$emit('update:show', true);
    },
  },
  watch: {
    pagePassword(val) {
      if (val.length === 6) {
        this.submitPassword();
      }
    },
    show: {
      handler(val) {
        val && this.resetData();
      },
    },
  },
  computed: {
    pagePasswordLength() {
      return this.pagePassword.length;
    },
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
  },
};
</script>

<style lang="scss">
.password {
  .price {
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-top: 20rpx;
  }
  .pay-text {
    margin-top: 30rpx;
    border-top: 1px solid #f8f8f8;
    border-bottom: 1px solid #f8f8f8;
    height: 100rpx;
  }
  .password-contetn {
    margin-top: 30rpx;
    .password-hint {
      margin-bottom: 60rpx;
      text-align: center;
      line-height: 48rpx;
      font-size: 34rpx;
      color: rgba(51, 51, 51, 0.94);
    }
    .input-box {
      display: flex;
      align-items: center;
      justify-content: center;
      .input-item {
        margin-right: 12rpx;
        width: 80rpx;
        height: 80rpx;
        background: #f2f2f2;
        border-radius: 10rpx;
        &:nth-last-child(1) {
          margin-right: 0;
        }
      }

      .check {
        // border: 1px solid skyblue;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 16rpx;
          height: 16rpx;
          background: #333;
          border-radius: 50%;
        }
      }
    }
  }

  .keyboard {
    margin-top: 60rpx;
    > view {
      border-top: 1px solid #eaeaea;

      width: 33.3333%;
      line-height: 104rpx;
      text-align: center;
      font-weight: 600;
      font-size: 44rpx;
      color: rgba(51, 51, 51, 0.94);
      &:nth-child(3n + 2) {
        border-left: 1px solid #eaeaea;
        border-right: 1px solid #eaeaea;
      }
    }

    .keyboard_1 {
      background: #eaeaea;
    }
  }
  .zhanwei {
    width: 100%;
    height: 0;
    height: env(safe-area-inset-bottom);
    background: #eaeaea;
  }

  .bt-tip {
    margin-top: 60rpx;
    .bt {
      margin: 0 auto;
      width: 690rpx;
      line-height: 76rpx;
      background: #ff1b22;
      border-radius: 120rpx;

      text-align: center;
      font-size: 28rpx;
      font-weight: 600;
      color: #ffffff;
    }
    .bt_1 {
      background: #999999;
    }

    .tip {
      margin-top: 40rpx;
      margin-bottom: 50rpx;
      line-height: 40rpx;

      text-align: center;
      color: rgba(51, 51, 51, 0.94);
    }
  }
}

.modal {
  width: 80vw;
  .modal-title {
    height: 96rpx;
    line-height: 96rpx;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
  }
  .modal-bts {
    padding: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-around;
    > view {
      width: 230rpx;
      height: 76rpx;
      border-radius: 38rpx;
      line-height: 76rpx;
      text-align: center;
      border: 1px solid #8e8e8e;
      font-weight: 600;
    }
    .confirm {
      background: #fd1a25;
      color: #fff;
      border: 1px solid #fd1a25;
    }
  }
}
</style>
