<template>
  <view v-if="settingData" class="page-body">
    <div
      :style="{
        background: `url(${
          store.option.step.activity_pic || wxapp_img.step.dare_bg
        }) 0% 0% / 100% 100% no-repeat`,
      }"
      class="top_1"
    >
      <view class="icon-box">
        <image
          @click="$utils.toUrl('/step/log/log')"
          :src="wxapp_img.step.log"
          class="m-r-20"
          mode="aspectFit"
        />
        <image
          @click="$utils.toUrl('/step/rules/rules?rules=activity_rule')"
          :src="wxapp_img.step.rule"
          mode="aspectFit"
        />
      </view>
    </div>

    <div class="dare">
      <div
        class="join"
        v-for="(item, i) in activityData.activity_data"
        :key="i"
      >
        <div class="join-title flex-x-sb flex-y-center">
          <view>{{ item.open_date }}</view>

          <view class="font-26 color-666">
            <view class="join-status" v-if="item.open_date == time">
              <template v-if="item.log.length">已参赛</template>

              <template v-else> 未参赛 </template>
            </view>

            <view v-if="item.open_date != time">
              已有{{ item.people_num || 0 }}人报名
            </view>
          </view>
        </div>

        <!-- 挑战赛名称 -->
        <view>
          {{ item.name }}
        </view>

        <view
          class="font-center font-26 color-666"
          v-if="item.open_date == time && !item.log.length"
        >
          目标{{ item.step_num }}步
        </view>

        <view class="font-26" v-if="item.open_date == time && item.log.length">
          <view class="target">
            目标 <text style="color: red">{{ item.step_num }}</text
            >步，已完成
            <text style="color: red">{{ activityData.run_data }}</text
            >步
          </view>
          <view class="color-666 m-y-10" v-if="item.log_status != 2"
            >请于今日24点前，更新并提交步数</view
          >
          <view v-if="item.log_status == 2">奖金将于24点后结算自动发放</view>
          <view
            @click="submit(item)"
            class="submit"
            v-if="item.log_status != 2"
          >
            提交成绩
          </view>
          <button class="submit-1" v-if="item.log_status == 2">
            已提交成绩
          </button>
        </view>

        <view class="flex-y-center flex-x-sa" v-if="item.open_date == time">
          <view class="font-center">
            <view class="font-60" style="color: #ff9d1e">{{
              item.currency_num || 0
            }}</view>
            <view class="font-26 color-666">奖金池总额</view>
          </view>
          <view class="font-center">
            <view class="font-60" style="color: #ff9d1e">{{
              item.award_num || 0
            }}</view>
            <view class="font-26 color-666">达标人数</view>
          </view>
        </view>
        <view v-else>
          <view class="font-60" style="color: #ff9d1e">
            {{ item.currency_num || 0 }}
          </view>
          <view class="font-26 color-666">奖金池总额</view>
          <view class="font-26 color-666 m-y-20">
            参与满 <text style="color: #ff9d1e">{{ item.step_num }}</text
            >步起平分奖池金额
          </view>

          <view
            @click="$utils.toUrl(`/step/join/join?id=${item.id}`)"
            v-if="!item.log.length"
            class="submit"
          >
            参与比赛
          </view>

          <button class="submit-1 button-initial" openType="share" v-else>
            已参赛，邀请好友
          </button>
        </view>
      </div>
    </div>

    <!-- #ifdef MP-WEIXIN -->
    <ad v-if="ad_data.status == 1" :unit-id="ad_data.unit_id"></ad>
    <!-- #endif -->

    <u-popup
      :show="showPopup"
      @close="showPopup = false"
      mode="center"
      closeable
      :safeAreaInsetBottom="false"
      round="20rpx"
    >
      <view class="join-popup p-y-30">
        <view class="flex-y-center flex-x-center">
          <image
            :src="wxapp_img.step.participation"
            style="width: 260rpx; height: 260rpx"
            mode="aspectFill"
          />
        </view>
        <view class="m-t-20 m-b-40 font-center"
          >报名成功，记得{{ open_date }}来参加哦</view
        >
        <view class="flex-x-center">
          <button openType="share" class="button-initial submit-1">
            邀请好友
          </button>
        </view>
      </view>
    </u-popup>

    <u-popup
      :show="showSubmitPopup"
      @close="showSubmitPopup = false"
      mode="center"
      closeable
      :safeAreaInsetBottom="false"
      round="20rpx"
      bgColor="transparent"
    >
      <div class="submit-popup">
        <div class="content p-b-50">
          <div
            class="title"
            :style="{
              background: `url(${wxapp_img.step.submit}) 0% 0% / 100% 100% no-repeat`,
            }"
          >
            恭喜您
          </div>
          <view class="flex-x-center">
            <image
              :src="wxapp_img.step.success"
              mode="aspectFill"
              style="width: 200rpx; height: 200rpx"
            />
          </view>
          <view class="font-32 font-center m-t-10" style="color: #e8703e">
            <view>成功提交步数</view>
            <view>奖金将于24点结算后自动发放</view>
          </view>
          <view class="m-t-30 font-center m-t-40 m-b-20 color-666 font-26">
            奖金可至“{{
              store.option.step.currency_name
                ? store.option.step.currency_name
                : '活力币'
            }}”查看
          </view>
          <view class="flex-x-center">
            <view @click="showSubmitPopup = false" class="submit">我知道了</view>
          </view>
        </div>
      </div>
    </u-popup>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  data() {
    return {
      showSubmitPopup: false,
      showPopup: false,
      open_date: '',
      user_id: '',
      settingData: '',
      activityData: '',
      ad_data: {},
    };
  },
  onLoad(params) {
    this.user_id = params.user_id || '';
    this.open_date = params.open_date;
    this.showPopup = params.join || false;
    this.loadData();
  },

  onShow() {
    this.getActivity();
  },
  methods: {
    async loadData() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.step.defaultSetting({}, true);
      this.settingData = res.data;
      this.ad_data = res.data.ad_data
    },
    // 获取挑战数据
    async getActivity() {
      let runData = await this.getWeRunData();
      const res = await this.$requestAll.step.defaultActivity({
        user_id: this.user_id,
        encrypted_data: runData.encryptedData,
        iv: runData.iv,
        code: runData.code,
      });
      this.activityData = res.list;
      this.ad_data = res.list.ad_data
    },
    // 获取运动步数封装为promise方法
    getWeRunData() {
      return new Promise((resolve, reject) => {
        // #ifdef MP-WEIXIN
        uni.login({
          success: login => {
            console.log(login);
            wx.getWeRunData({
              success: res => {
                console.log(res);
                resolve(Object.assign(res, login));
              },
              fail: error => {
                uni.$u.toast(error.errMsg);
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
    // 提交挑战步数
    async submit(item) {
      const runData = await this.getWeRunData();
      try {
        await this.$requestAll.step.defaultActivitySubmit(
          {
            code: runData.code,
            iv: runData.iv,
            encrypted_data: runData.encryptedData,
            num: this.activityData.run_data,
            activity_id: item.id,
          },
          true
        );
        this.showSubmitPopup = true
        this.getActivity();
      } catch (error) {}
    },
  },

  computed: {
    time() {
      return uni.$u.date(new Date(), 'yyyy-mm-dd');
    },
    shareData() {
      return {
        path: `/step/dare/dare${uni.$u.queryParams({
          user_id: this.$store.getters['user/userInfo'].id || '',
        })}`,
        title: this.settingData.share_title,
      };
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.page-body {
  padding-bottom: env(safe-area-inset-bottom);
  .top_1 {
    position: relative;
    min-height: 560rpx;
    .icon-box {
      position: absolute;
      bottom: 50rpx;
      right: 30rpx;
      image {
        width: 72rpx;
        height: 72rpx;
      }
    }
  }
  .join {
    width: 93.6%;
    background-color: white;
    margin: 0 24rpx 20rpx;
    padding: 30rpx 32rpx 40rpx;
    border-radius: 16rpx;
    transform: translateY(-40rpx);
    margin-top: 20rpx;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.15);
    text-align: center;
    &-status {
      background: #eee;
    }
  }
  .join-popup {
    width: 660rpx;
  }
  .submit-popup {
    width: 630rpx;
    background: #e8703e;
    border-radius: 16rpx;
    .content {
      margin: 16rpx;
      background: #fff;
      .title {
        color: #e8703e;
        font-size: 36rpx;
        text-align: center;
        height: 132rpx;
        line-height: 100rpx;
        width: 548rpx;
        margin: 0 auto;
        transform: translateY(-66rpx);
      }
    }
  }
  .submit {
    display: inline-block;
    border-radius: 40rpx;
    min-width: 440rpx;
    padding: 0 30rpx;
    font-size: 34rpx;
    background: #ff9d1e;
    color: #fff;
    text-align: center;
    height: 80rpx;
    line-height: 80rpx;
  }
  .submit-1 {
    display: inline-block;
    border-radius: 40rpx;
    min-width: 440rpx;
    padding: 0 30rpx;
    font-size: 34rpx;
    color: #ff9d1e;
    border: 1px solid #ff9d1e;
    text-align: center;
    height: 80rpx;
    line-height: 80rpx;
  }
}
</style>
