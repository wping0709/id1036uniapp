<template>
  <!-- 个人中心头部，后续改组件 -->
  <view class="user-top">
    <image :src="pageData.user_center_bg" mode=""></image>

    <!-- 已登录 -->
    <template v-if="pageData.user_info && pageData.user_info.access_token">
      <view v-if="pageData.style.top == 0" class="userinfo-txt">
        <div class="flex-x-sb flex-y-center">
          <view class="avatar flex-y-center">
            <image
              @click="$utils.toUrl('/account-settings/user/index')"
              class="avatar-img"
              :src="pageData.user_info.avatar_url"
              mode="aspectFill"
            ></image>
            <view style="margin-left: 24rpx" class="">
              <view
                class="font-28"
                @click="$utils.toUrl('/account-settings/user/index')"
              >
                {{ pageData.user_info.nickname }}
              </view>
              <view
                v-if="
                  store.client_shop_select_module &&
                  store.client_shop_select_module != 'shop'
                "
                class="font-24 u-line-1"
                style="margin-bottom: 6rpx; opacity: 0.8"
              >
                当前：{{ currentStore.name }}
              </view>
              <view class="member flex-y-end">
                <!-- 会员 -->
                <view
                  @click="$utils.toUrl('/other/member/member')"
                  class="level-name flex-y-center flex-x-center"
                >
                  <text>{{ pageData.user_info.level_name }}</text>
                  <text
                    class="iconfont icon-arrow-right font-fff font-20"
                  ></text>
                </view>
                <view
                  @click="$utils.toUrl('/account-settings/index/index')"
                  class="flex-y-center flex-x-center"
                >
                  <text>账户设置</text>
                  <text
                    class="iconfont icon-arrow-right font-fff font-20"
                  ></text>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="pageData.code_url.data && pageData.code_url.data.url"
            @click="clickCode"
            class="flex-x-center flex-col right"
          >
            <view class="flex-col flex-x-center code-box flex-y-center">
              <text
                class="iconfont icon-QRcode font-50"
                style="color: #ff4a40"
              ></text>
              <text style="margin-top: -12rpx" class="font-center">取件码</text>
            </view>
          </view>
        </div>
        <view v-if="pageData.is_push_fans_follow_love == 1" class="myContent">
          <view class="myContent-view" @click="dian(1)">
            <view class="fabuNumber">
              {{ pageData.push_count }}
            </view>
            <view class="fabuText"> 我的发布 </view>
          </view>
          <view class="myContent-view" @click="dian(2)">
            <view class="fabuNumber">
              {{ pageData.note_fanc_count }}
            </view>
            <view class="fabuText"> 粉丝 </view>
          </view>
          <view class="myContent-view" @click="dian(3)">
            <view class="fabuNumber">
              {{ pageData.note_focus_count }}
            </view>
            <view class="fabuText"> 关注 </view>
          </view>
          <view class="myContent-view" @click="dian(4)">
            <view class="fabuNumber">
              {{ pageData.like_count }}
            </view>
            <view class="fabuText"> 喜欢 </view>
          </view>
        </view>
        <!-- 开启购买会员卡 && 显示会员卡信息 -->
        <view
          v-if="
            store.buy_member &&
            pageData.vipcard &&
            pageData.vipcard.is_vipcard == 1
          "
          @click="$utils.toUrl('/vipcard/index/index')"
          class="member-box flex-x-sb flex-y-center p-x-30"
        >
          <view class="flex-y-center">
            <text class="iconfont icon-huiyuan font-40 m-r-10"></text>
            <text>{{ pageData.vipcard.text || "购买会员卡享受更多折扣" }}</text>
          </view>
          <view>查看</view>
        </view>
      </view>

      <div
        v-else-if="pageData.style.top == 1"
        class="userinfo-txt userinfo-text-1"
      >
        <div class="flex-x-sb flex-y-center">
          <view class="flex-w-1 avatar">
            <view class="flex-col flex-y-center flex-x-center">
              <image
                class="avatar-img"
                :src="pageData.user_info.avatar_url"
                mode="aspectFill"
              ></image>

              <!-- 会员 -->
              <view
                class="member flex-x-center flex-y-center"
                style="margin-top: 10rpx"
              >
                <view
                  @click="
                    store.buy_member && $utils.toUrl('/other/member/member')
                  "
                  class="level-name flex-y-center flex-x-center"
                >
                  <image
                    :src="wxapp_img.icon_user_level"
                    mode="aspectFilt"
                    style="width: 40rpx; height: 40rpx"
                  />
                  <text>{{ pageData.user_info.level_name }}</text>
                </view>
              </view>

              <view class="font-28 m-t-10">
                {{ pageData.user_info.nickname }}
              </view>
            </view>
          </view>

          <!-- 取件码 -->
          <view class="flex-col flex-x-sb flex-y-end right">
            <view
              @click="$utils.toUrl('/account-settings/index/index')"
              class="setting"
              >账户设置</view
            >

            <view
              v-if="pageData.code_url.data && pageData.code_url.data.url"
              @click="clickCode"
              class="code-box flex-col flex-x-center flex-y-center"
            >
              <text
                class="iconfont icon-QRcode font-50"
                style="color: #ff4a40"
              ></text>
              <text style="margin-top: -12rpx" class="font-center">取件码</text>
            </view>
          </view>
        </div>

        <!-- 开启购买会员卡 && 显示会员卡信息 -->
        <view
          v-if="
            store.buy_member &&
            pageData.vipcard &&
            pageData.vipcard.is_vipcard == 1
          "
          @click="$utils.toUrl('/vipcard/index/index')"
          class="member-box flex-x-sb flex-y-center p-x-30"
        >
          <view class="flex-y-center">
            <text class="iconfont icon-huiyuan font-40 m-r-10"></text>
            <text>{{ pageData.vipcard.text || "购买会员卡享受更多折扣" }}</text>
          </view>
          <view>查看</view>
        </view>
      </div>

      <div class="userinfo-txt-2" v-else-if="pageData.style.top == 2">
        <view class="userinfo-box">
          <view class="flex-w-1 flex-y-center">
            <image
              class="avatar-img"
              :src="pageData.user_info.avatar_url"
              mode="aspectFill"
            />

            <view class="m-l-20">
              <view>{{ pageData.user_info.nickname }}</view>
              <view
                class="flex-y-center m-t-20 color-fff font-24 member-setting"
              >
                <view
                  @click="
                    store.buy_member && $utils.toUrl('/other/member/member')
                  "
                  class="level-name flex-y-center flex-x-center"
                >
                  <image :src="wxapp_img.icon_user_level" mode="aspectFilt" />
                  <text>{{ pageData.user_info.level_name }}</text>
                </view>
                <view @click="$utils.toUrl('/account-settings/index/index')"
                  >账户设置</view
                >
              </view>
            </view>
          </view>

          <view
            @click="$utils.toUrl('/account-settings/address/address')"
            class="flex-col flex-y-center"
          >
            <text class="iconfont icon-icon-test font-50"></text>
            <text class="font-24">收货地址</text>
          </view>
        </view>

        <!-- 开启购买会员卡 && 显示会员卡信息 -->
        <view
          v-if="
            store.buy_member &&
            pageData.vipcard &&
            pageData.vipcard.is_vipcard == 1
          "
          @click="$utils.toUrl('/vipcard/index/index')"
          class="member-box flex-x-sb flex-y-center p-x-30"
        >
          <view class="flex-y-center">
            <text class="iconfont icon-huiyuan font-40 m-r-10"></text>
            <text>{{ pageData.vipcard.text || "购买会员卡享受更多折扣" }}</text>
          </view>
          <view>查看</view>
        </view>
      </div>
    </template>

    <!-- 未登录 -->
    <view v-else class="userinfo-txt flex-y-center flex-x-center login">
      <view class="avatar flex-col flex-y-center flex-x-center">
        <image src="" mode="aspectFit"></image>
        <view @click="login" style="" class="font-600-28 login">
          登录/注册
        </view>
      </view>
    </view>

    <CodePopup
      title="您的取件码"
      :show.sync="showCode"
      :imgUrl="pageData.code_url.data && pageData.code_url.data.url"
    ></CodePopup>
  </view>
</template>

<script>
import CodePopup from "./CodePopup.vue";
export default {
  components: {
    CodePopup,
  },
  props: {
    pageData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      showCode: false,
    };
  },
  methods: {
    login() {
      this.$store.commit("setCacheData", "");
      this.$utils.toUrl("/login/login/login_page");
    },
    clickCode() {
      this.showCode = true;
    },
    dian(e) {
      console.log(e);
      // conso
      if (e == 1) {
        this.$utils.toUrl(`../../Myrebate/index/index?id=${""}&show=${e}`);
      } else if (e == 2) {
        this.$utils.toUrl(`../../Myrebate/content/content?id=${""}&show=${0}`);
      } else if (e == 3) {
        this.$utils.toUrl(`../../Myrebate/content/content?id=${""}&show=${1}`);
      } else if (e == 4) {
        this.$utils.toUrl(`../../wine/likes/likes`);
      }

      // uni.navigateTo({
      // 	url:`../../Myrebate/index/index?id=${1}&show=${e}`
      // })
    },
  },
  computed: {
    store() {
      return this.$store.getters["SHOP_CONFIG"].store;
    },
    currentStore(){
      return this.$store.getters["currentStore"];
    }
  },
};
</script>

<style lang="scss" scoped>
.user-top {
  position: relative;
  height: 348rpx;
  width: 100%;

  > image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .userinfo-txt {
    padding: 0 40rpx;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    color: #fff;

    display: flex;
    flex-direction: column;
    justify-content: center;
    .myContent {
      width: 100%;
      height: 88rpx;
      display: flex;
      // align-items: center;
      justify-content: space-around;
      .myContent-view {
        width: 96rpx;
        // height: 34rpx;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        .fabuNumber {
          height: 44rpx;
          font-size: 32rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.94);
          text-align: center;
        }
        .fabuText {
          height: 34rpx;
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.94);
          text-align: center;
        }
      }
    }
    .avatar {
      font-size: 22rpx;
      .avatar-img {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
        margin-left: -5rpx;
      }

      .member {
        > view {
          background-color: rgba(0, 0, 0, 0.3);
          height: 36rpx;
          line-height: 36rpx;
          border-radius: 18rpx;
          padding: 0 16rpx;

          .iconfont {
            font-size: 16rpx;
          }
        }

        .level-name {
          margin-right: 20rpx;
          border-radius: 18rpx;

          > image {
            margin-right: 16rpx;
            width: 44rpx;
            height: 44rpx;
          }
        }
      }
    }

    .right {
      .code-box {
        width: 90rpx;
        height: 90rpx;
        background: rgba($color: #fff, $alpha: 0.8);
        border-radius: 6rpx;
        font-size: 20rpx;
        text-align: center;
        color: #ff4544;

        > image {
          width: 50rpx;
          height: 50rpx;
        }

        // > text {
        //   margin: 5rpx;
        // }
      }
    }
    .member-box {
      margin-top: 20rpx;
      border-radius: 20rpx;
      height: 80rpx;
      background: linear-gradient(to right, #524848, #0f0c03);
    }
  }

  .userinfo-text-1 {
    .avatar {
      .member {
        .level-name {
          padding-left: 0;
          margin-right: 0;
          > image {
            margin-top: -10rpx;
          }
        }
      }
    }
    .right {
      height: 100%;
      .setting {
        margin-right: -40rpx;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 10rpx 0 0 10rpx;
        padding: 6rpx 20rpx;
        font-size: 24rpx;
      }
      .code-box {
        margin-right: -20rpx;
      }
    }
  }

  .userinfo-txt-2 {
    padding: 0 40rpx;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    .userinfo-box {
      margin-top: 50rpx;
      padding: 20rpx;
      border-radius: 20rpx;
      background: #fff;
      display: flex;
      align-items: center;

      .avatar-img {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
      }

      .member-setting {
        > view {
          background: rgba(0, 0, 0, 0.7);
          border-radius: 18rpx;
          height: 36rpx;
          line-height: 36rpx;
          font-size: 24rpx;
          padding: 0 20rpx;
        }
        .level-name {
          padding-left: 0;
          margin-right: 20rpx;
          border-radius: 18rpx;

          > image {
            margin-top: -10rpx;
            margin-right: 16rpx;
            width: 44rpx;
            height: 44rpx;
          }
        }
      }
    }

    .member-box {
      color: #fff;
      margin-top: 20rpx;
      border-radius: 20rpx;
      height: 80rpx;
      background: linear-gradient(to right, #524848, #0f0c03);
    }
  }

  .login {
    .avatar {
      > image {
        width: 130rpx;
        height: 130rpx;
        border-radius: 50%;
        border: 2rpx solid #fff;
      }

      .member {
        > view {
          background-color: #3c3642;
          height: 36rpx;
          line-height: 36rpx;
          border-radius: 18rpx;
          padding: 0 20rpx;
        }

        .level-name {
          margin-right: 20rpx;
          padding: 0;
          padding-right: 20rpx;
          border-radius: 18rpx;

          > image {
            margin-right: 16rpx;
            width: 44rpx;
            height: 44rpx;
          }
        }
      }
    }

    .login {
      margin-top: 20rpx;
      border: 4rpx solid #fff;
      padding: 0 15rpx;
      border-radius: 25rpx;
    }
  }
}
</style>
