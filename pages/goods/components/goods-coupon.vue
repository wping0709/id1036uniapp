<template>
  <view v-if="couponList && couponList.length">
    <template v-if="showText">
      <view
        v-if="type == 'goods'"
        @click="showPopup"
        class="goods-coupon1 flex-x-sb"
      >
        <view class="goods-coupon-left flex-w-1 flex-wrap flex">
          <!-- 默认优惠卷 -->
          <view>
            <text class="m-r-10">
              {{ defaultName[0] }}
            </text>
            <text>满{{ defaultName[1] }}可用</text>
          </view>

          <!-- 其他优惠 -->
          <view
            v-for="(item, index) in saleData"
            :key="index"
            class="flex-y-center"
          >
            <text class="m-r-10">
              {{ item.name }}
            </text>
            <text>{{ item.content }}</text>
          </view>
        </view>

        <view class="goods-coupon-right flex-y-center">
          <text>领券</text>
          <i class="iconfont icon-arrow-right"></i>
        </view>
      </view>

      <!-- 未选择优惠卷 -->
      <view
        v-else
        @click="showPopup"
        class="goods-coupon flex-x-sb flex-y-center"
      >
        <text>优惠券</text>
        <view style="margin: 0" class="flex-y-center">
          <text v-if="currenCoupon.sub_price" class="price-color"
            >-{{ currenCoupon.sub_price }}</text
          >
          <text v-else class="price-color">
            有{{ couponList.length }}张优惠券可用
          </text>
          <text class="iconfont icon-arrow-right color-999"></text>
        </view>
      </view>
    </template>

    <u-popup
      :safeAreaInsetBottom="false"
      :show="show"
      @close="showPopup"
      round="20rpx"
      bg-color="#f5f5f5"
    >
      <view class="popup-title flex-x-sb flex-y-center">
        <view class="font-32 font-w-700">优惠</view>
        <i @click="showPopup" class="iconfont icon-close"></i>
      </view>
      <scroll-view scroll-y class="popup-box">
        <!-- 其他优惠 -->
        <view
          v-if="saleData.length"
          class="font-26 m-x-20 m-b-20 p-x-20 p-b-20 bg-fff bdrd-20"
        >
          <view class="p-y-20 font-30 font-w-700">优惠</view>
          <view class="flex-col flex-x-center" style="line-height: 2.4">
            <!-- 其他优惠 -->
            <view
              v-for="(item, index) in saleData"
              :key="index"
              class="flex-y-center"
            >
              <text
                class="m-r-20 p-x-10 font-22"
                style="
                  color: #fd504d;
                  border-radius: 8rpx;
                  line-height: 34rpx;
                  border: 1px solid #fd504d;
                "
              >
                {{ item.name }}
              </text>
              <text>{{ item.content }}</text>
            </view>
          </view>
        </view>

        <!-- 优惠卷列表 -->
        <view class="bg-fff bdrd-20 m-20 env-bottom">
          <view class="p-20 font-30 font-w-700">优惠券</view>
          <view class="coupon-box">
            <view
              class="coupon-box-item"
              v-for="(item, index) in couponList"
              :key="index"
            >
              <!-- :class="[item.is_receive > 0 && 'active']" -->
              <view class="coupon-item flex-x-sb">
                <view class="item-left flex-col flex-y-center flex-x-center">
                  <view class="u-line-1">
                    <text class="font-30">￥</text>
                    <text class="font-40 font-w-700">
                      {{ item.sub_price }}
                    </text>
                  </view>
                  <view class="u-line-1 font-24"
                    >满{{ item.min_price }}可用</view
                  >
                </view>

                <view class="item-right flex-x-sb flex-y-center">
                  <view>
                    <view class="u-line-1 font-w-700 font-32">
                      <template v-if="item.appoint_type == 2">
                        指定商品使用
                      </template>
                      <template v-else>
                        {{ item.content }}
                      </template>
                    </view>
                    <view class="font-24 color-999">
                      <template v-if="item.expire_type == 2">
                        {{ item.begin_time }}-{{ item.end_time }}
                      </template>
                      <template v-else-if="item.expire_type == 1">
                        领取{{ item.expire_day }}天内有效
                      </template>
                    </view>
                    <view
                      @click="switchShowRule(item)"
                      class="font-24 color-999 flex-y-center"
                    >
                      <text>使用说明</text>
                      <text
                        v-if="!item.zhankan"
                        class="iconfont icon-arrow-bottom font-30 color-999"
                      ></text>
                      <text
                        v-else
                        class="iconfont icon-arrow-bottom font-30 color-999"
                      ></text>
                    </view>
                  </view>
                  <view
                    v-if="type == 'goods'"
                    class="btn"
                    @click.stop="receiveCoupon(item)"
                  >
                    {{ item.is_receive == 1 ? '已领取' : '立即领取' }}
                  </view>

                  <view
                    v-else-if="type == 'dangmianfu' || type == 'select'"
                    @click.stop="receiveCoupon(item)"
                  >
                    <text
                      v-if="item.user_coupon_id == currenCoupon.user_coupon_id"
                      class="iconfont font-50 icon-success-fill price-color"
                    >
                    </text>
                    <text
                      v-else
                      class="iconfont font-50 icon-xuanzekuangmoren color-999"
                    ></text>
                  </view>
                </view>
              </view>

              <view v-show="item.zhankai" class="coupon-msg">
                {{ item.rule || '暂无使用说明' }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </u-popup>
  </view>
</template>

<script>
export default {
  props: {
    // 商品数据
    goodsData: {},
    // 是否展示选择项text
    showText: {
      default: true,
    },
    // 使用场景
    type: {
      default: 'goods',
    },
    // 当前选中优惠券
    currenCoupon: {
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      show: false,
      couponList: '', //优惠券列表数据
      saleData: [], //普通商品赠送积分等信息
      selectCoupon: '',
      addNum: 0,
      isCreate: true,
    };
  },

  methods: {
    showPopup() {
      this.show = !this.show;
    },
    switchShowRule(item) {
      item.zhankai = !item.zhankai;
      this.$forceUpdate();
    },
    // 领取优惠券
    async receiveCoupon(item) {
      if (this.type == 'goods') {
        if (item.is_receive == 1) return;
        const res = await this.$requestAll.coupon.receiveCoupon(
          { id: item.id },
          true
        );
        this.selectCoupon = item;
        this.$utils.toast('领取成功');
        this.couponList = res.data.coupon_list;
      } else if (this.type == 'dangmianfu' || this.type == 'select') {
        this.show = false;
        console.log(item, this.currenCoupon, 1111111111, this.isCreate);
        if (
          !this.isCreate &&
          item.user_coupon_id == this.currenCoupon.user_coupon_id
        ) {
          this.$emit('checkCoupon', {});
        } else {
          this.isCreate = false;

          this.$emit('checkCoupon', item);
        }
      } else {
      }
    },
    // 获取优惠券列表
    async getCounponList() {
      if (this.type == 'goods') {
        const res = await this.$requestAll.goods.getGoodsCouponList({
          id: this.goodsData.id,
        });
        this.selectCoupon = res.data.coupon[0] || '';
        this.couponList = res.data.coupon;
        this.saleData = res.data.data;
      } else if (this.type == 'dangmianfu') {
        console.log(this.goodsData.coupon_list);
        this.couponList = this.goodsData.coupon_list;
        this.selectCoupon =
          (this.goodsData.coupon_list && this.goodsData.coupon_list[0]) || '';
      } else if (this.type == 'select') {
        this.receiveCoupon(this.goodsData.couponList[0]);
        this.couponList = this.goodsData.couponList;
      }
    },
  },
  computed: {
    defaultName() {
      if (this.type == 'goods') {
        const couponList = this.couponList;
        if (!couponList.length) return;

        return [couponList[0].name, couponList[0].min_price];
      } else {
        return '';
      }
    },
  },
  watch: {
    //   goodsData变动获取优惠券数据
    goodsData: {
      handler(val, ovl) {
        JSON.stringify(val) != JSON.stringify(ovl) && this.getCounponList();
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-coupon {
  color: #333;
  min-height: 100rpx;
  > view:nth-child(1) {
    margin-right: 40rpx;
  }
  > view:nth-child(2) {
    color: #666;
    margin-right: 20rpx;
  }
}

.goods-coupon1 {
  .goods-coupon-left {
    padding-top: 10rpx;
    > view {
      margin-bottom: 10rpx;
      margin-right: 10rpx;
      padding: 0 4rpx;
      line-height: 32rpx;
      background: linear-gradient(92deg, #ffe4e3 0%, #fce9e1 100%);
      border-radius: 4rpx;

      font-size: 22rpx;
      color: #ff1b22;
    }
  }
  .goods-coupon-right {
    margin-top: 10rpx;
    padding: 0 14rpx;
    height: 36rpx;
    background: linear-gradient(91deg, #ff1c22 0%, #ff7333 100%);
    line-height: 36rpx;
    font-size: 20rpx;
    color: #fff;
    border-radius: 18rpx;
    .icon-arrow-right {
      margin-left: 4rpx;
      width: 18rpx;
      height: 18rpx;
      line-height: 18rpx;
      font-size: 18rpx;
      text-align: center;
      border-radius: 50%;
      background: #ffeee8;
      color: #ff683a;
    }
  }
}
.popup-title {
  padding: 0 20rpx;
  line-height: 80rpx;
  > view:nth-child(1) {
    width: 0;
    flex: 1;
    text-align: center;
    font-size: 30rpx;
  }

  .icon-close {
    padding: 0 10rpx;
  }
}
.popup-box {
  max-height: 75vh;
  .coupon-box {
    padding: 0 20rpx;
    .coupon-box-item {
      margin-bottom: 20rpx;
      background: #ffffff;
      border: 1px solid #ebebeb;
      border-radius: 20rpx;
      overflow: hidden;

      .coupon-item {
        box-shadow: 0rpx 6rpx 12rpx rgba(51, 51, 51, 0.05);
        opacity: 1;
        border-radius: 20rpx;

        height: 200rpx;
        overflow: hidden;

        .item-left {
          width: 200rpx;
          height: 200rpx;
          background: #fff3f1;

          text-align: center;
          color: #ff313d;

          > view:nth-child(1) {
            font-size: 52rpx;
          }
        }
        .item-right {
          flex: 1;
          width: 0;
          padding: 0 20rpx;

          > view:nth-child(1) {
            flex: 1;
            width: 0;
            margin-right: 20rpx;
            font-size: 24rpx;
          }
          .btn {
            padding: 10rpx 20rpx;
            line-height: 28rpx;
            text-align: center;
            font-size: 24rpx;
            border-radius: 40rpx;
            color: #fff;
            background: #fd504d;
          }
        }
      }
      .active {
        background: #fdf7f0;
        // color: #fd504d;
        .btn {
          border: 2rpx solid #fd504d;
        }
      }
    }

    .coupon-msg {
      min-height: 100rpx;
      padding: 20rpx;
      color: #9999;
      font-size: 22rpx;
    }
  }

  .popup-close-bt {
    margin: 20rpx auto 0;
    width: 678rpx;
    height: 76rpx;
    background: linear-gradient(90deg, #f22407 0%, #f84d17 100%);
    border-radius: 120rpx;
  }
}
</style>
