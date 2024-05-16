<template>
  <view v-if="stepData" class="body env-bottom">
    <view
      @click="$utils.toUrl('/step/detail/detail')"
      class="tianxin-top flex-y-center p-y-20 p-x-20"
    >
      <div class="left flex-w-1">
        <image
          :src="wxapp_img.step.price"
          mode="aspectFill"
          style="width: 30rpx; height: 30rpx"
        />

        <text class="m-x-10"
          >我的{{
            setting.step_type == 0
              ? store.option.step.currency_name
                ? store.option.step.currency_name
                : "活力币"
              : "步数积分"
          }}</text
        >
        <text class="price-color font-700 font-36">{{
          setting.step_type == 0
            ? stepData.user_data.step_currency
            : stepData.user_data.total_integral
        }}</text>
      </div>
      <div class="right iconfont icon-arrow-right"></div>
    </view>

    <div class="today">
      <image
        class="today-bg"
        :src="wxapp_img.home_bg"
        mode="aspectFill"
      ></image>
      <image
        @click="$utils.toUrl('/step/top/top')"
        :src="wxapp_img.step.top"
        class="to-paihang"
        mode="aspectFill"
      ></image>
      <image
        @click="$utils.toUrl('/pages/index/index')"
        :src="wxapp_img.step.index"
        class="to-home"
        mode="aspectFill"
      ></image>

      <div
        @click="$utils.toUrl('/step/rules/rules?rules=rules')"
        class="to-guize"
      >
        规则
      </div>

      <view @click="clickDuiHuan" class="step-cur font-center font-24">
        <view class="">今日可兑步数</view>
        <view class="font-600-56">{{ syStep }}</view>
        <view class="m-b-10">点击可兑换</view>
        <view class="color-999">每日零点清零</view>
      </view>

      <view @click="loadData" class="today-tongbu">
        <text class="iconfont icon-shuaxin"></text>
        <text>同步微信最新步数</text>
      </view>

      <div
        @click="$utils.toUrl('/step/share/share?todayStep=' + curStep.step)"
        class="today-bt"
      >
        邀请好友获得永久步数加成
      </div>

      <div class="today-haoyou">
        <div class="left flex-col flex-y-center flex-x-center">
          <view class="">好友</view>
          <view class="">助力</view>
        </div>
        <scroll-view
          @click="$utils.toUrl('/step/share/share?todayStep=' + curStep.step)"
          scroll-x="true"
          class="flex-w-1"
        >
          <view v-if="stepData.user_data.invite_list.length" class="list">
            <div
              class="item"
              v-for="(item, i) in stepData.user_data.invite_list"
              :key="i"
            >
              <image :src="item.avatar_url" mode="aspectFill"></image>
            </div>
          </view>
          <view v-else class="list">
            <div class="item" v-for="(item, i) in 5" :key="i">
              <image :src="wxapp_img.step.friend" mode="aspectFill"></image>
            </div>
          </view>
        </scroll-view>
        <div
          @click="$utils.toUrl('/step/friend/friend')"
          class="right flex-y-center flex-x-center"
        >
          <view class="flex-col flex-x-center flex-y-center m-r-10">
            <view class="">查看</view>
            <view class="">更多</view>
          </view>
          <view class="iconfont icon-arrow-right"></view>
        </div>
      </div>
    </div>

    <view class="p-y-20 bg-fff font-center font-24 color-666">
      <view class="m-b-10"
        >总邀请{{ stepData.user_data.all_invite || 0 }}人，今日邀请{{
          stepData.user_data.now_invite || 0
        }}人</view
      >
      <view class=""
        >当前步数加成{{
          stepData.user_data && stepData.user_data.now_ratio
        }}%，明天步数加成{{
          stepData.user_data && stepData.user_data.ratio
        }}%</view
      >
    </view>

    <!-- #ifdef MP-WEIXIN -->
    <ad v-if="stepData.ad_data.status == 1" :unit-id="stepData.ad_data.unit_id"></ad>
    <!-- #endif -->

    <view class="font-24 bg-fff p-x-20 p-y-20 flex-y-center flex-x-sb">
      <view class="flex-w-1">
        <view class="">每日兑换提醒</view>
        <view class="color-666 m-t-10"
          >{{
            setting.step_type == 0
              ? store.option.step.currency_name
                ? store.option.step.currency_name
                : "活力币"
              : "步数积分"
          }}可兑换礼物，记得每天来看看呦</view
        >
      </view>
      <view class="">
        <u-switch @change="switchChange" size="20" v-model="remind"></u-switch>
      </view>
    </view>

    <view class="">
      <swiper
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="1000"
        style="height: 190rpx"
      >
        <swiper-item
          @click="$utils.toUrl(item.page_url, item.open_type)"
          v-for="(item, i) in stepData.banner_list"
          :key="i"
        >
          <view class="swiper-item" style="height: 100%">
            <image
              :src="item.pic_url"
              mode="aspectFill"
              style="width: 100%; height: 100%"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="p-20 m-y-20 bg-fff" v-if="stepData.activity_data.id">
      <!-- 步数挑战标题 -->
      <view
        class="flex-y-center p-l-20"
        style="border-left: 6rpx solid #ff9d1e; height: 36rpx"
      >
        <view class="flex-y-center flex-w-1">
          <view class="font-30 m-r-20"> 步数挑战 </view>

          <view
            class="font-24 color-999"
            v-if="
              stepData.activity_data.id > 0 &&
              time != stepData.activity_data.open_date
            "
            >{{ stepData.activity_data.open_date }}开始</view
          >
          <view
            class="font-24 color-999"
            v-if="
              stepData.activity_data.id > 0 &&
              time == stepData.activity_data.open_date
            "
            >{{ stepData.activity_data.name }}进行中</view
          >
        </view>

        <view @click="$utils.toUrl('/step/dare/dare')" class="flex-y-center">
          <view>更多</view>
          <view class="iconfont icon-arrow-right"> </view>
        </view>
      </view>

      <view class="flex-y-center p-y-20">
        <image
          :src="wxapp_img.step.dare"
          mode="aspectFit"
          style="width: 250rpx; height: 250rpx"
        ></image>

        <!-- 挑战时间当日， -->
        <template v-if="time === stepData.activity_data.open_date">
          <!-- 未参赛 -->
          <template v-if="!stepData.activity_data.log">
            <view class="flex-w-1 m-l-20">
              <view class="color-666">奖金池总额</view>
              <view class="font-600-34" style="color: #ff9d1e">{{
                stepData.activity_data.suc_currency
              }}</view>
              <view class="m-t-20 color-666">达标人数</view>
              <view class="font-600-34" style="color: #ff9d1e">{{
                stepData.activity_data.suc_num
              }}</view>
            </view>
          </template>
          <!-- 参赛 -->
          <template v-else>
            <view class="flex-w-1 m-l-20">
              <view class="color-666">
                目标步数<text class="font-600-34" style="color: #ff9d1e">{{
                  stepData.activity_data.step_num
                }}</text
                >步
              </view>

              <view class="m-t-20 color-666">
                已完成<text class="font-600-34" style="color: #ff9d1e">{{
                  syStep
                }}</text
                >步
              </view>

              <view
                class="font-24 color-666 m-t-30"
                v-if="stepData.activity_data.step_num > syStep"
              >
                距目标越来越近了，加油哦~
              </view>

              <view class="m-t-20">
                <view
                  class="tiaozhan-bt-1"
                  v-if="
                    stepData.activity_data.log_status == 2 &&
                    stepData.activity_data.step_num <= syStep
                  "
                >
                  已提交成绩
                </view>
                <view
                  @click="submitTiaozhan"
                  class="tiaozhan-bt"
                  v-if="
                    stepData.activity_data.step_num >= syStep &&
                    stepData.activity_data.log_status == 3
                  "
                >
                  提交成绩
                </view>
              </view>
            </view>
          </template>
        </template>

        <!-- 挑战时间不为当日  ||  未参赛 -->
        <view
          v-if="
            time !== stepData.activity_data.open_date ||
            !stepData.activity_data.log.length
          "
          class="flex-w-1 m-l-20"
        >
          <view>
            目标步数
            <text class="font-600-36 price-color m-x-10">{{
              stepData.activity_data.step_num
            }}</text>
            步
          </view>

          <view class="m-t-20">
            <text class="m-r-10">挑战保证金</text>
            <text style="color: #ff9d1e; font-size: 26rpx">
              {{ stepData.activity_data.bail_currency
              }}{{
                store.option.step.currency_name
                  ? store.option.step.currency_name
                  : "活力币"
              }}
            </text>
          </view>
          <view>已有{{ stepData.activity_data.people_num }}人参加</view>

          <template v-if="time == stepData.activity_data.open_date">
            <view v-if="stepData.activity_data.log.length">
              <view>已完成{{ syStep }}步</view>
              <view v-if="stepData.activity_data.step_num > syStep">
                距目标越来越近了，加油哦~
              </view>
            </view>

            <view class="m-t-20">
              <view
                class="tiaozhan-bt-1"
                v-if="
                  stepData.activity_data.log_status == 2 &&
                  stepData.activity_data.step_num <= syStep
                "
              >
                已提交成绩
              </view>
              <view
                @click="submitTiaozhan"
                class="tiaozhan-bt"
                v-if="
                  activity_data.log.length &&
                  stepData.activity_data.step_num >= syStep &&
                  stepData.activity_data.log_status == 3
                "
              >
                提交成绩
              </view>
            </view>
          </template>
          <template v-else>
            <view class="m-t-20">
              <button
                open-type="share"
                class="button-initial tiaozhan-bt-1"
                v-if="stepData.activity_data.log.length"
              >
                已参赛，邀请好友
              </button>
              <view
                v-else
                @click="
                  $utils.toUrl(
                    '/step/join/join?id=' + stepData.activity_data.id
                  )
                "
                class="tiaozhan-bt"
                >立即参加</view
              >
            </view>
          </template>
        </view>
      </view>
    </view>

    <div
      class="exchange-title flex-y-center flex-x-center font-600-36"
      :style="{
        background: 'url(' + wxapp_img.step.exchange + ') no-repeat center',
        backgroundSize: '320rpx 96rpx',
      }"
    >
      免费兑换
    </div>

    <div class="goods-list">
      <div
        @click="$utils.toUrl('/step/goods/goods?goods_id=' + item.id)"
        class="goods-item"
        v-for="(item, i) in stepData.goods_data"
        :key="i"
      >
        <image :src="item.cover_pic" mode="aspectFill"></image>
        <view class="u-line-1 m-y-10">
          {{ item.name }}
        </view>
        <view style="color: #ffb71e">
          {{ item.price
          }}{{
            store.option.step.currency_name
              ? store.option.step.currency_name
              : "活力币"
          }}
        </view>
        <view class="goods-bt">立即兑换</view>
      </div>
    </div>
    
    <Share></Share>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>

<script>
import Share from "@/components/share/share";
import share from "@/mixins/share.js";
export default {
  components: {
    Share,
  },
  mixins: [share],
  data() {
    return {
      stepData: "",
      weRunData: "", //步数信息
      remind: false,
      setting: "",
      params: "",
      _platform: "",
    };
  },

  onLoad(params) {
    if (params.scene) {
      let urlData = decodeURIComponent(params.scene);
      let urlArr = urlData.split(",");
      let newParams = {};
      urlArr.forEach((item) => {
        let itemArr = item.split(":");
        newParams[itemArr[0]] = itemArr[1];
      });
      this.params = newParams;
    }
  },
  onShow() {
    // #ifndef MP-WEIXIN
    this.$utils.toUrl("/other/prompt/prompt_page", "redirectTo");
    return;
    // #endif

    this.loadData();
  },
  methods: {
    async loadData() {
      // 获取运动信息
      this.weRunData = await this.getWeRunData();
      this.getSetting();
      this.getDefaultIndex();
    },
    async getSetting() {
      const res = await this.$requestAll.step.setting({}, true);
      this.setting = res.data;
      uni.setNavigationBarTitle({
        title: res.data.title || "步数宝",
      });
    },
    // 兑换步数
    async clickDuiHuan() {
      // 还可兑换上限
      let keyongE =
        this.setting.convert_max - this.stepData.user_data.convert_num;
      keyongE = keyongE > 0 ? keyongE : 0;

      // let 还可使用步数
      let keyongB = this.syStep;

      // 还可兑换步数
      var duihuanB = 0;
      if (keyongB >= keyongE) {
        duihuanB = keyongE;
      } else {
        duihuanB = keyongB;
      }

      if (!keyongE) {
        return uni.showModal({
          title: "提示",
          content: `每日兑换上限为${this.setting.convert_max}步,明天再来吧。`,
        });
      }
      if (keyongB <= 0)
        return uni.showModal({
          title: "提示",
          content: "可用步数不足",
        });

      uni.showModal({
        title: `还剩兑换上限为${keyongE}步`,
        content:
          this.setting.step_type == 0
            ? `确认把${duihuanB}步对换${duihuanB / this.setting.convert_ratio}${
                this.store.option.step.currency_name
                  ? this.store.option.step.currency_name
                  : "活力币"
              }`
            : duihuanB < this.setting.convert_ratio
            ? `步数不足${this.setting.convert_ratio}步，无法兑换商城积分`
            : `确认把${duihuanB}步对换${Math.floor(
                duihuanB / this.setting.convert_ratio
              )}${"商城积分"}`,
        success: async ({ confirm }) => {
          if (confirm) {
            const formData = await this.getWeRunData();
            // const formData = this.weRunData

            const res = await this.$requestAll.step.convert(
              {
                iv: formData.iv,
                code: formData.code,
                encrypted_data: formData.encryptedData,
                num: duihuanB,
              },
              true
            );
            this.loadData();
          }
        },
      });
    },
    async getDefaultIndex() {
      let formData = {
        encrypted_data: this.weRunData.encryptedData,
        iv: this.weRunData.iv,
        code: this.weRunData.code,
        user_id: (this.params && this.params.uid) || 0,
        page: 1,
      };
      const res = await this.$requestAll.step.defaultIndex(formData, true);
      this.stepData = res.data;

      this.remind = Boolean(res.data.user_data.remind - 0);
    },

    async switchChange() {
      await this.$requestAll.step.remind(
        {
          remind: Number(this.remind),
        },
        true
      );
    },

    // 获取运动步数封装为promise方法
    getWeRunData() {
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
          success: (login) => {
            console.log(login);
            wx.getWeRunData({
              success: (res) => {
                console.log(res);
                resolve(Object.assign(res, login));
              },
              fail: (error) => {
                if(error.err_code == -12006){
                  uni.$u.toast('请到右上角开启微信运动步数权限');
                }else{
                  uni.$u.toast(error.errMsg);
                }
                reject(error);
              },
            });
          },
        });
        // #endif

        // #ifndef MP-WEIXIN
        resolve();
        // #endif
      });
    },

    // 提交挑战
    submitTiaozhan() {
      console.log("提交挑战");
    },
  },

  computed: {
    store() {
      return this.$store.getters["SHOP_CONFIG"].store || false;
    },
    curStep() {
      if (this.stepData) {
        return this.stepData.run_data.stepInfoList[
          this.stepData.run_data.stepInfoList.length - 1
        ];
      }
      return {
        step: 0,
      };
    },
    syStep() {
      if (this.stepData && this.setting) {
        let num = this.curStep.step - this.stepData.user_data.convert_num;
        return num > 0 ? num : 0;
      }
      return 0;
    },
    time() {
      let date = new Date();
      let y = date.getFullYear();
      y = y < 10 ? "0" + y : y;
      let m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      return `${y}.${m}.${d}`;
    },
    shareData() {
      return {
        path:
          "/step/index/index" +
          uni.$u.queryParams({
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
        title: this.setting.share_title || "",
      };
    },
  },
  onPullDownRefresh() {
    this.loadData().then(() => {
      uni.stopPullDownRefresh({});
    });
  },
};
</script>

<style lang="scss">
.body {
  min-height: 100vh;
  background: #f5f5f5;

  .tianxin-top {
    background: #fff;
  }

  .today {
    position: relative;

    .step-cur {
      position: absolute;
      left: 50%;
      top: 116rpx;
      transform: translateX(-50%);
      height: 280rpx;
      width: 280rpx;
    }

    .today-tongbu {
      position: absolute;
      left: 50%;
      top: 390rpx;
      transform: translateX(-50%);
      color: #666;
    }

    .today-bt {
      position: absolute;
      left: 50%;
      top: 470rpx;
      transform: translateX(-50%);
      width: 500rpx;
      text-align: center;
      line-height: 80rpx;
      border-radius: 40rpx;
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
      box-shadow: 0 0 20rpx #ffb71e;
      background: linear-gradient(to right, #ff9d1e, #ffb81e);
    }

    .today-haoyou {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      padding: 20rpx 0;
      background: #fff;
      width: 690rpx;

      scroll-view {
        padding: 0 30rpx;

        .list {
          white-space: nowrap;

          .item {
            display: inline-block;
            width: 80rpx;
            height: 80rpx;
            margin-right: 20rpx;

            > image {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }

      .left {
        width: 140rpx;
        height: 80rpx;
        background-color: #ffebd2;
        color: #ff9d1e;
        border-radius: 0 40rpx 40rpx 0;
        font-size: 24rpx;
      }

      .right {
        width: 140rpx;
        height: 80rpx;
        background-color: #eee;
        color: #666;
        border-radius: 40rpx 0 0 40rpx;
        font-size: 24rpx;
      }
    }

    .today-bg {
      width: 750rpx;
      height: 720rpx;
    }

    .to-paihang {
      position: absolute;
      left: 30rpx;
      top: 40rpx;
      width: 74rpx;
      height: 74rpx;
    }

    .to-home {
      position: absolute;
      left: 30rpx;
      top: 144rpx;
      width: 74rpx;
      height: 74rpx;
    }

    .to-guize {
      position: absolute;
      right: 0rpx;
      top: 46rpx;
      line-height: 60rpx;
      padding: 0 30rpx;
      border-radius: 30rpx 0 0 30rpx;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
  }

  .exchange-title {
    margin-top: 20rpx;
    margin-bottom: 10rpx;
    height: 100rpx;
  }

  .goods-list {
    padding: 0 20rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    background: #fff;
    border-radius: 20rpx;
    overflow: hidden;

    .goods-item {
      width: 344rpx;
      margin-bottom: 20rpx;

      > image {
        width: 345rpx;
        height: 345rpx;
      }

      .goods-bt {
        margin: 20rpx auto 0;
        line-height: 60rpx;
        border-radius: 30rpx;
        width: 80%;
        background: #ffb71e;
        color: #fff;
        font-size: 32rpx;
        text-align: center;
      }
    }
  }
}

.tiaozhan-bt {
  display: inline-block;
  min-width: 200rpx;
  padding: 0 20rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: 40rpx;
  background: #ff9d1e;
  color: #fff;
  font-size: 24rpx;
}
.tiaozhan-bt-1 {
  display: inline-block;
  min-width: 200rpx;
  padding: 0 20rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: 40rpx;
  border: 1px solid #ff9d1e;
  color: #ff9d1e;
  font-size: 24rpx;
}

.price-color {
  color: #ffce55;
}
</style>
