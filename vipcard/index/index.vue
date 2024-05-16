<template>
  <view v-if="pageData" class="body">
    <view class="swiper-box">
      <swiper
        previous-margin="50rpx"
        next-margin="50rpx"
        class="swiper"
        style="height: 320rpx"
        :indicator-dots="false"
        :autoplay="false"
        @change="swiperChange"
      >
        <swiper-item v-for="(item, index) in pageData.list" :key="index">
          <view class="swiper-item-box">
            <view
              @click="$utils.toUrl('/vipcard/info/index?id=' + item.id)"
              class="item-content"
              :class="current != index ? 'cur' : ''"
              :style="{
                background: `url(${item.cover_pic}) 0% 0% / 100% 100% no-repeat`,
              }"
            >
              <view class="title u-line-1">{{ item.name }}</view>

              <view
                v-if="
                  item.pay_setting.continuity_setting.pay_type == 1 &&
                  item.pay_status == 0
                "
                style="bottom: 60rpx; width: 80%"
                class="price-bt flex-x-sb flex-y-center"
              >
                <view class="price p-b-20">{{ item.vip_desc }}</view>
              </view>

              <view
                v-if="item.pay_status == 1"
                class="price-bt flex-x-sb flex-y-center"
              >
                <view class="price p-b-20">{{ item.pay_desc }}</view>
              </view>
              <view @click.stop v-else class="price-bt flex-x-sb flex-y-center">
                <view class="m-l-20">
                  {{ continuousPrice(item) }}
                </view>
                <view class="bt" @click="submitPayVc">立即开通</view>
              </view>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 会员权益 -->
    <view class="equity-box">
      <view class="equity-title"
        >当前{{ pageData.list[current].pay_status == 1 ? '已' : '待' }}解锁
        {{ pageData.list[current].quanyi_num }} 项权益</view
      >
      <scroll-view scroll-x style="width: 100%">
        <view class="scroll-box">
          <!-- 余额 -->
          <view
            :style="{
              backgroundImage: `url(${wxapp_img.vipcard.money})`,
            }"
            v-if="pageData.list[current].is_money == 1"
            class="equity_cont"
          >
            <view
              style="width: 100%; height: 100%"
              class="flex-col flex-x-center flex-y-center"
            >
              <view class="use-time">{{ pageData.list[current].money }}</view>
              <view class="equity_info">余额</view>
            </view>
          </view>

          <!-- 积分 -->
          <view
            :style="{
              backgroundImage: `url(${wxapp_img.vipcard.integral})`,
            }"
            v-if="pageData.list[current].is_integral == 1"
            class="equity_cont"
          >
            <view
              style="width: 100%; height: 100%"
              class="flex-col flex-x-center flex-y-center"
            >
              <view class="use-time">{{
                pageData.list[current].integral
              }}</view>
              <view class="equity_info">积分</view>
            </view>
          </view>

          <!-- 会员价 -->
          <view
            :style="{
              backgroundImage: `url(${wxapp_img.vipcard.level})`,
            }"
            v-if="
              pageData.list[current].is_level == 1 &&
              pageData.list[current].level_list.discount < 10
            "
            class="equity_cont"
          >
            <view
              style="width: 100%; height: 100%"
              class="flex-col flex-x-center flex-y-center"
            >
              <view class="use-time">
                {{ pageData.list[current].level_list.name }}
              </view>
              <view class="equity_info">会员价</view>
            </view>
          </view>

          <!-- 优惠券 -->
          <view
            :style="{
              backgroundImage: `url(${wxapp_img.vipcard.coupon})`,
            }"
            v-if="pageData.list[current].is_coupon == 1"
            v-for="(coupon, coupon_index) in pageData.list[current].coupon_list"
            :key="coupon_index"
            class="equity_cont"
          >
            <view
              style="width: 100%; height: 100%"
              class="flex-col flex-x-center flex-y-center"
            >
              <view class="use-time">{{ coupon.sub_price }}</view>
              <view class="equity_info">{{ coupon.name }}</view>
            </view>
          </view>
          <!-- 核销卡 -->
          <view
            :style="{
              backgroundImage: `url(${wxapp_img.vipcard.card})`,
            }"
            v-if="pageData.list[current].is_card == 1"
            v-for="(card_s, card_s_index) in pageData.list[current].card_list"
            :key="'s' + card_s_index"
            class="equity_cont"
          >
            <view
              style="width: 100%; height: 100%"
              class="flex-col flex-x-center flex-y-center"
            >
              <view class="use-time">{{ card_s.total_num }}次</view>
              <view class="equity_info">{{ card_s.name }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <view class="back-bg_box">
      <view class="welfare-cont_box">
        <view class="welfare-title">
          <view class="welfare-title_cont">福利权益</view>
        </view>
        <scroll-view scroll-x style="width: 95%" class="welfare-list">
          <!-- 卡券 -->
          <view
            class="welfare-cont"
            v-if="pageData.list[current].is_card == 1"
            v-for="(card, card_index) in pageData.list[current].card_list"
            :key="'a' + card_index"
          >
            <view class="welfare-banner_box">
              <view>核销卡</view>
              <image
                mode="aspectFit"
                :src="card.pic_url"
                style="width: 100%; height: 100%"
              />
            </view>
            <view class="welfaer-hint u-line-1">{{ card.name }}</view>
            <!-- <view class="getbut">
              {{ pageData.list[current].pay_status == 1 ? '已领取' : '开通赠送' }}
            </view> -->
          </view>
          <!-- 会员价 -->
          <view
            class="welfare-cont"
            v-if="pageData.list[current].is_level == 1"
          >
            <view class="welfare-banner_box">
              <view>{{ pageData.list[current].level_list.name }}</view>
              <image
                mode="aspectFit"
                :src="wxapp_img.vipcard.level2"
                style="width: 100%; height: 100%"
              />
            </view>
            <view class="welfaer-hint u-line-1">
              可享{{ pageData.list[current].level_list.discount }}折扣
            </view>
            <!-- <view class="getbut">
              {{ pageData.list[current].pay_status == 1 ? '已领取' : '开通赠送' }}
            </view> -->
          </view>
          <!-- 优惠券 -->
          <view
            class="welfare-cont"
            v-if="pageData.list[current].is_coupon == 1"
            v-for="(coupon, coupon_index) in pageData.list[current].coupon_list"
            :key="'b' + coupon_index"
          >
            <view class="welfare-banner_box">
              <view>优惠券</view>
              <image
                mode="aspectFit"
                :src="wxapp_img.vipcard.coupon2"
                style="width: 100%; height: 100%"
              />
            </view>
            <view class="welfaer-hint u-line-1">{{ coupon.name }}</view>
            <!-- <view class="getbut">
              {{ pageData.list[current].pay_status == 1 ? '已领取' : '开通赠送' }}
            </view> -->
          </view>
        </scroll-view>
      </view>
    </view>

    <view class="submit-box">
      <view class="submit-bt flex-y-center">
        <image :src="wxapp_img.vipcard.open_bg" mode="aspectFit" />
        <view class="bt-content flex-x-sb flex-y-center">
          <view class="m-l-20">
            {{ continuousPrice(pageData.list[current]) }}
          </view>
          <view @click="submitPayVc" class="m-r-20 bt">立即开通</view>
        </view>
      </view>
    </view>

    <u-popup
      :show="showPay"
      @close="onShowPay(false)"
      round="20rpx"
      mode="bottom"
      safeAreaInsetBottom
    >
      <view class="popup-box">
        <view class="popup-title">{{ pageData.list[current].name }}</view>
        <div class="flex-y-center flex-x-center">
          <!-- 周卡 -->
          <div
            @click.stop="selectTime('week')"
            class="pay-item"
            :class="select == 'week' ? 'pay-active' : ''"
            v-if="
              pageData.list[current].pay_setting.continuity_setting.week
                .select == 1
            "
          >
            <div class="pay-price">
              {{
                pageData.list[current].pay_setting.continuity_setting
                  .pay_type == 1 && pageData.list[current].pay_status == 2
                  ? pageData.list[current].pay_setting.continuity_setting.week
                      .con_price
                  : pageData.list[current].pay_setting.continuity_setting.week
                      .price
              }}
            </div>
            <div class="pay-time">周卡/7天</div>
          </div>
          <!-- 月卡 -->
          <div
            @click.stop="selectTime('month')"
            class="pay-item"
            :class="select == 'month' ? 'pay-active' : ''"
            v-if="
              pageData.list[current].pay_setting.continuity_setting.month
                .select == 1
            "
          >
            <div class="pay-price">
              {{
                pageData.list[current].pay_setting.continuity_setting
                  .pay_type == 1 && pageData.list[current].pay_status == 2
                  ? pageData.list[current].pay_setting.continuity_setting.month
                      .con_price
                  : pageData.list[current].pay_setting.continuity_setting.month
                      .price
              }}
            </div>
            <div class="pay-time">月卡/30天</div>
          </div>
          <!-- 季卡 -->
          <div
            @click.stop="selectTime('season')"
            class="pay-item"
            :class="select == 'season' ? 'pay-active' : ''"
            v-if="
              pageData.list[current].pay_setting.continuity_setting.season
                .select == 1
            "
          >
            <div class="pay-price">
              {{
                pageData.list[current].pay_setting.continuity_setting
                  .pay_type == 1 && pageData.list[current].pay_status == 2
                  ? pageData.list[current].pay_setting.continuity_setting.season
                      .con_price
                  : pageData.list[current].pay_setting.continuity_setting.season
                      .price
              }}
            </div>
            <div class="pay-time">季卡/92天</div>
          </div>
          <!-- 年卡 -->
          <div
            @click.stop="selectTime('year')"
            class="pay-item"
            :class="select == 'year' ? 'pay-active' : ''"
            v-if="
              pageData.list[current].pay_setting.continuity_setting.year
                .select == 1
            "
          >
            <div class="pay-price">
              {{
                pageData.list[current].pay_setting.continuity_setting
                  .pay_type == 1 && pageData.list[current].pay_status == 2
                  ? pageData.list[current].pay_setting.continuity_setting.year
                      .con_price
                  : pageData.list[current].pay_setting.continuity_setting.year
                      .price
              }}
            </div>
            <div class="pay-time">年卡/365天</div>
          </div>
        </div>
        <div class="submit" @click.stop="payTypeSubmit">提交</div>
      </view>
    </u-popup>
  </view>
</template>

<script>
import OrderPay from '@/mixins/OrderPay';
export default {
  mixins: [OrderPay],
  computed: {
    // 计算当前会员卡价格，计算方法为周月季年以此判断是否开启
    continuousPrice() {
      return function (item) {
        if (item.pay_type != 2) {
          if (item.pay_setting.one_setting.pay_type == 0) {
            return `永久仅需¥${item.pay_setting.one_setting.pay_price0}`;
          } else {
            return `会员专享价格¥${
              item.pay_setting ? item.pay_setting.one_setting.pay_price1 : 0
            }/${
              item.pay_setting ? item.pay_setting.one_setting.validity_time : 0
            }天`;
          }
        } else {
          let dateKey = 'week';
          let company = '周';
          if (item.pay_setting.continuity_setting.week.select == 1) {
            dateKey = 'week';
            company = '周';
          } else if (item.pay_setting.continuity_setting.month.select == 1) {
            dateKey = 'month';
            company = '月';
          } else if (item.pay_setting.continuity_setting.season.select == 1) {
            dateKey = 'season';
            company = '季';
          } else if (item.pay_setting.continuity_setting.year.select == 1) {
            dateKey = 'year';
            company = '年';
          }
          let priceKey =
            item.pay_status == 2 &&
            item.pay_setting.continuity_setting.pay_type == 1
              ? 'con_price'
              : 'price';
          return `${item.name}¥ ${item.pay_setting.continuity_setting[dateKey][priceKey]}/${company}`;
        }
      };
    },
  },
  data() {
    return {
      pageData: '', //页面数据
      current: 0, //当前swiperIndex
      showPay: false, //年月选择弹框开关
      select: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    SETTITLE() {
      uni.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#1e1e26',
      });
    },
    async loadData() {
      const res = await this.$requestAll.vip.vipcardIndex({}, true);
      if (!res.data.list.length) {
        await this.$utils.showModalAsync({
          title: '提示',
          content: '会员卡为空！',
          showCancel: false,
        });
        this.$utils.backTo();
      }
      this.pageData = res.data;
    },
    onShowPay(b) {
      this.showPay = b;
    },
    swiperChange({ detail: { current } }) {
      this.current = current;
      this.select = '';
    },
    submitPayVc() {
      const swiper = this.pageData.list[this.current];
      if (swiper.pay_status == 1) {
        this.$utils.toast('已购买权益，请勿重复购买');
      } else {
        if (swiper.pay_type == 2) {
          this.showPay = true;
          if (!this.select) {
            if (
              this.pageData.list[this.current].pay_setting.continuity_setting
                .week.select == 1
            ) {
              this.select = 'week';
            } else if (
              this.pageData.list[this.current].pay_setting.continuity_setting
                .month.select == 1
            ) {
              this.select = 'month';
            } else if (
              this.pageData.list[this.current].pay_setting.continuity_setting
                .season.select == 1
            ) {
              this.select = 'season';
            } else if (
              this.pageData.list[this.current].pay_setting.continuity_setting
                .year.select == 1
            ) {
              this.select = 'year';
            }
          }
        } else {
          this.orderSubmit(
            {
              id: swiper.id,
            },
            'vc'
          );
        }
      }
    },
    selectTime(type) {
      this.select = type;
    },
    // 多选提交
    payTypeSubmit() {
      var current = this.current;
      var swiper = this.pageData.list[current];
      this.orderSubmit(
        {
          id: swiper.id,
          type: this.select,
          showPay: false,
        },
        'vc'
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  background: #1e1e26;
  min-height: 100vh;
  color: #fff;
}
.swiper-box {
  padding: 40rpx 0;
  .swiper-item-box {
    position: absolute;
    height: 100%;
    width: 100%;
    .item-content {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 0 50rpx;
      color: #333;
      .title {
        margin-top: 20rpx;
        font-size: 40rpx;
      }
      .price-bt {
        position: absolute;
        left: 0;
        bottom: 20rpx;
        width: 100%;
        padding: 0 50rpx;
        .bt {
          height: 48rpx;
          background: linear-gradient(90deg, #f7d8c5, #fac59c);
          border-radius: 24rpx;
          line-height: 48rpx;
          padding: 0 20rpx;
        }
      }
    }
  }
  .cur {
    transform: scale(0.92);
  }
}
.equity-box {
  padding: 0 30rpx;

  .equity-title {
    font-size: 36rpx;
  }
  .scroll-box {
    width: 100%;
    display: flex;
    .equity_cont {
      width: 160rpx;
      min-width: 160rpx;
      height: 160rpx;
      border-radius: 16rpx;
      background-color: rgba(255, 255, 255, 0.05);
      background-size: 52rpx;
      background-position: center;
      background-repeat: no-repeat;
      margin: 20rpx 8rpx;
      text-align: center;

      .use-time {
        white-space: initial;
        width: 100%;

        display: -webkit-box !important;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical !important;

        font-size: 32rpx;
        color: #fed4b3;
      }
      .equity_info {
        font-size: 24rpx;
        color: #b0b0b0;
        padding-top: 10rpx;
      }
    }
  }
}

.back-bg_box {
  color: #333;
  background: #f7f8fa;
  border-radius: 22rpx;
  padding-bottom: 22rpx;
  .welfare-title_cont {
    font-size: 32rpx;
  }
  .welfare-cont_box {
    .welfare-title {
      display: flex;
      justify-content: space-between;
      line-height: 84rpx;
      padding: 0 32rpx;
    }
    .welfare-title image {
      width: 5 * 2rpx;
      height: 10 * 2rpx;
      margin-left: 5 * 2rpx;
    }
    .welfare-list {
      white-space: nowrap;
      .welfare-cont {
        width: 106 * 2rpx;
        // height: 132 * 2rpx;
        border-radius: 8 * 2rpx;
        overflow: hidden;
        background: #fff;
        display: inline-block;
        margin-left: 6 * 2rpx;
        &:last-child {
          margin-right: 16 * 2rpx;
        }
        .welfare-banner_box {
          height: 64 * 2rpx;
          // background: #fd712b;
          position: relative;
          overflow: hidden;
        }
        .getbut {
          width: 152rpx;
          height: 44rpx;
          margin: 0 auto;
          text-align: center;
          color: #5a3f13;
          font-size: 24rpx;
          line-height: 44rpx;
          border-radius: 22rpx;
          background: linear-gradient(90deg, #fff3e0, #fbcaa7);
        }
        .welfaer-hint {
          text-align: center;
          font-size: 13 * 2rpx;
          padding: 12 * 2rpx 0 10 * 2rpx;
        }
      }
    }
  }
  .welfare-banner_box view {
    background: #21232d;
    padding: 0 6 * 2rpx;
    font-size: 11 * 2rpx;
    line-height: 18 * 2rpx;
    border-radius: 0 0 5 * 2rpx 0;
    height: 18 * 2rpx;
    color: #f8e9d5;
    position: absolute;
    left: 0;
    top: 0;
  }
}

.submit-box {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));

  .submit-bt {
    width: 700rpx;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    position: fixed;
    bottom: 10rpx;
    left: 50%;
    transform: translate(-50%, 0);
    > image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .bt-content {
      padding: 0 20rpx;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      color: #6f3e16;
      font-size: 28rpx;
      text-align: center;
      .bt {
        width: 200rpx;
        color: #fde1c8;
      }
    }
  }
}

.popup-box {
  color: #333;
  .popup-title {
    line-height: 80rpx;
    text-align: center;
    font-size: 28rpx;
  }

  .pay-item {
    height: 100 * 2rpx;
    width: 100 * 2rpx;
    border-radius: 10 * 2rpx;
    margin-right: 10 * 2rpx;
    border: 4rpx solid #999;
  }

  .pay-active {
    border: 4rpx solid red;
    color: red;
  }

  .pay-price {
    text-align: center;
    line-height: 50 * 2rpx;
    font-weight: bold;
    color: red;
    font-size: 19 * 2rpx;
  }

  .pay-time {
    text-align: center;
  }

  .submit {
    width: 90%;
    line-height: 40 * 2rpx;
    text-align: center;
    border-radius: 20 * 2rpx;
    margin: 15 * 2rpx auto 15rpx;
    background: red;
    color: #fff;
  }
}
</style>
