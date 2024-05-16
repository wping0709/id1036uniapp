<template>
  <view class="order_detail">
    <view class="container">
      <view class="title" v-if="order.is_pay == 0">
        <view class="top"> 下单成功， 坐等开吃 </view>
        <view class="bot"> 菜品已在制作中 </view>
      </view>
      <view class="title" v-if="order.is_pay == 1">
        <view class="top"> 订单已完成 </view>
      </view>

      <view class="content-box">
        <view class="content_title">
          桌号<text style="margin: 0 10rpx 0 8rpx">{{
            order.table_info.table_number
          }}</text>
          |
          <text style="margin: 0 0 0 10rpx"
            >{{ order.diners_number }}人就餐</text
          >
        </view>
        <view class="goods_list">
          <view
            class="goods_item"
            v-for="(item, index) in order.goods_list"
            :key="index"
          >
            <view style="display: flex">
              <view class="image">
                <image
                  :src="item.pic"
                  style="width: 100rpx; height: 100rpx; border-radius: 10rpx"
                />
              </view>
              <view class="text">
                <view class="name u-line-2">
                  {{ item.name }}
                </view>
                <view class="attr_list">
                  <view
                    class="attr_item"
                    v-for="(attr, i) in item.attr_list"
                    :key="i"
                  >
                    <view>
                      {{ attr.attr_name }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="right">
              <view class="price"> ￥{{ item.total_price }} </view>
              <view class="num">
                <view>
                  <text style="margin: 0 5rpx 0 10rpx">{{ item.num }}</text
                  >份
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="bottom">
          <view class="canwei" v-if="order.table_price > 0">
            <view class="title">
              餐位费<text
                style="
                  font-size: 22rpx;
                  color: #616161;
                  font-weight: 400;
                  margin-left: 10rpx;
                "
                >X{{ order.diners_number }}</text
              >
            </view>
            <view class="price"> ￥{{ order.table_price }} </view>
          </view>
          <view class="canwei" style="margin-top: 30rpx" v-if="order.box_price > 0">
            <view class="title">
              包厢费<text
                style="
                  font-size: 22rpx;
                  color: #616161;
                  font-weight: 400;
                  margin-left: 10rpx;
                "
                >X1</text
              >
            </view>
            <view class="price"> ￥{{ order.box_price }} </view>
          </view>
        </view>
      </view>
      <view class="bot_box">
        <view class="coupon-box" @click="showPopup()" v-if="couponList.length > 0">
          <view> 优惠券 </view>
          <view class="coupon_right">
            <view v-if="sub_price == 0" style="color: #f0250e">
              有{{ couponList.length }}张优惠券可用
            </view>
            <view v-else style="color: #f0250e; font-weight: bold">
              ￥{{ sub_price }}
            </view>
            <view style="color: #ababab">
              <view class="iconfont icon-arrow-right"></view>
            </view>
          </view>
        </view>
        <view class="name">
          <view style="color: #3f3f3f"> 订单编号： </view>
          <view style="font-weight: bold; margin: 0 20rpx 0 20rpx">
            {{ order.order_no }}
          </view>
          <view @click="copyText()">
            <text
              style="
                background-color: #f2f2f2;
                border-radius: 40rpx;
                text-align: center;
                padding: 5rpx 11rpx;
              "
              >复制</text
            >
          </view>
        </view>
        <view
          class="name"
          style="
            margin-top: 30rpx;
            border-bottom: 1px solid #f8f8f8;
            padding-bottom: 30rpx;
          "
        >
          <view style="color: #3f3f3f"> 下单时间： </view>
          <view style="font-weight: bold; margin: 0 20rpx 0 20rpx">
            <text style="margin-right: 10rpx">{{ order.addtime }}</text>
          </view>
        </view>
        <view
          class="name"
          style="
            margin-top: 30rpx;
            padding-bottom: 30rpx;
            justify-content: space-between;
          "
        >
          <view style="color: #3f3f3f"> 商品总额 </view>
          <view style="font-weight: bold"> ￥{{ order.total_price }} </view>
        </view>
        <view style="float: right">
          需付款:<text
            style="
              color: #f0250e;
              font-size: 28rpx;
              margin-left: 10rpx;
              font-weight: bold;
              margin-top: 20rpx;
            "
            >￥{{ totalPrice }}</text
          >
        </view>
      </view>
    </view>
    <view class="footer" v-if="order.status == 0">
      <view class="add" @click="addGoods"> 加菜 </view>
      <view class="pay" @click="paySub"> 结账 </view>
    </view>
    <!-- 优惠券弹框 -->
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
        <!-- 优惠卷列表 -->
        <view class="bg-fff bdrd-20 m-20 env-bottom">
          <view class="p-20 font-30 font-w-700">优惠券</view>
          <view class="coupon-box">
            <view
              class="coupon-box-item"
              v-for="(item, index) in couponList"
              :key="index"
            >
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

                  <view @click.stop="receiveCoupon(item)">
                    <text
                      v-if="item.user_coupon_id == currenCoupon_id"
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
                {{ item.rule || "暂无使用说明" }}
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </u-popup>
  </view>
</template>

<script>
import OrderPay from "@/mixins/OrderPay.js";
export default {
  mixins: [OrderPay],
  data() {
    return {
      sub_price: 0,
      show: false,
      user_id: "",
      goods_id: "",
      order_id: "",
      order: {},
      currenCoupon_id: 0,
      couponList: [],
      goodList: [],
      coupon:{}
    };
  },
  onLoad(params) {
    uni.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ff1b22",
      animation: {
        duration: 400,
        timingFunc: "easeIn",
      },
    });
    console.log("路由传过来的参数", params);
    // 挂单ID
    this.order_id = params.id;
    // 桌号
    this.table_id = params.table_id;
    // 入住商ID
    this.mch_id = params.mch_id;
    
    
    params.user_id && (this.user_id = params.user_id);
    this.getOrderDetail();
    this.getCouponList();
  },
  methods: {
    switchShowRule(item) {
      item.zhankai = !item.zhankai;
      this.$forceUpdate();
    },
    receiveCoupon(item) {
      // 如果已选中的优惠券和要选中的优惠券相等 则取消当前选择的优惠券
      if (this.currenCoupon_id == parseInt(item.user_coupon_id)) {
        this.sub_price = 0;
        this.currenCoupon_id = 0;
        this.coupon = {}
        return;
      }

      this.sub_price = item.sub_price;
      this.currenCoupon_id = item.user_coupon_id;
      this.coupon = item
      
    },
    async getCouponList() {
      const res = await this.$requestAll.orderingfood.getCouponList({
        order_id: this.order_id,
      });
      if (res.code == 0) {
        this.couponList = res.data;
      }
    },
    async getOrderDetail() {
      // 这里应该去获取挂单的信息
      const res = await this.$requestAll.orderingfood.getHangindOrderDetail({
        id: this.order_id,
        mch_id:this.mch_id,
        table_id:this.table_id
      });
      this.order = res.data;
    },
    async addGoods() {
      uni.navigateBack({
        delta: 1,
      });
    },
    async paySub() {
      // 实际这个时候才去生成订单 并跳转到支付页面
      var postParams = [];
      for(var i = 0; i < this.order.goods_list.length;i++){
        this.order.goods_list[i].attr = this.order.goods_list[i].attr_list
      }
      var postParamsItem = {
        mch_id:this.mch_id,
        goods_list:this.order.goods_list,
        default_send_type:'express',
        coupon_list:this.coupon  ? [this.coupon] : [],// 选择使用的优惠券
        offline:0,
        waimai:0,
        picker_coupon:this.coupon
      };
      postParams.push(postParamsItem)
      var postData = {
        mch_list:JSON.stringify(postParams),
        // 桌号
        table_id:this.table_id,
        // 就餐人数
        diners_number:this.order.diners_number,
        // 挂单ID
        hanging_order_id:this.order_id,
        // 就餐方式 0 店内就餐  1 外卖带走
        food_type:0
      }
      await this.orderSubmit(postData, "s");
    },
    showPopup() {
      this.show = !this.show;
    },
    copyText() {
      if (this.order.order_no) {
        uni.setClipboardData({
          data: this.order.order_no,
          success: function (res) {
            console.log(res);
          },
        });
      }
    },
    handlejian() {
      uni.showModal({
        title: "提示",
        content: "是否确定删除？",
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            let attr = [];
            this.order.goods_list.forEach((item) => {
              // item.num--
              attr.push(item.attr);
              this.goods_id = item.goods_id;
              console.log(item.num);
            });
            console.log(this.order_id, attr, this.goods_id);
            const res = await this.$requestAll.orderingfood.updateorderdetail({
              order_id: this.order_id,
              attr: attr,
              goods_id: this.goods_id,
            });
            console.log(res);
            if (res.code == 0) {
              this.getOrderDetail();
              // console.log('999999',this.order)
              // if(this.order.goods_list){
              // 	console.log('跳转首页')
              // }
            }
          }
        },
      });
    },
  },

  onShow() {
    // this.getOrderDetail();
    // uni.setStorageSync('total_price', this.order.total_price);
  },
  computed:{
    totalPrice(){
      return (parseFloat(this.order.total_price) + parseFloat(this.order.table_price) + parseFloat(this.order.box_price) - parseFloat(this.sub_price)).toFixed(2);
    }
  }
};
</script>

<style lang="scss" scoped>
.order_detail {
  height: 100vh;
  background-color: #efefef;

  .container {
    padding: 20rpx;

    .title {
      text-align: center;

      .top {
        font-size: 38rpx;
        color: #ff1b22;
        font-weight: bold;
      }

      .bot {
        margin-top: 20rpx;
        color: #676767;
      }
    }

    .content-box {
      box-sizing: border-box;
      margin-top: 20rpx;
      background-color: #ffffff;
      border-radius: 15rpx;
      padding: 20rpx;

      .content_title {
        font-weight: bold;
      }

      .goods_list {
        border-top: 1px solid #f8f8f8;
        border-bottom: 1px solid #f8f8f8;
        margin-top: 40rpx;
        padding: 0 0 25rpx 0;

        .goods_item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 30rpx;

          .image {
            width: 100rpx;
            height: 100rpx;
            border-radius: 15rpx;
            background-color: #f8f8f8;
          }

          .text {
            margin-left: 20rpx;

            .name {
              font-weight: bold;
            }

            .maioshu {
              color: #bbbbbb;
              font-size: 24rpx;
            }

            .attr_list {
              display: flex;

              .attr_item {
                color: #bbbbbb;
                font-size: 24rpx;
                margin-right: 15rpx;
              }
            }
          }

          .right {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-end;
            .price {
              color: #ff1b22;
              font-weight: bold;
              font-size: 26rpx;
            }

            .num {
              display: flex;
              align-items: center;
              color: #3f3f3f;
              .jian {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 36rpx;
                height: 36rpx;
                border-radius: 50%;
                border: 1px solid #b0b0b0;
                .jian_item {
                  width: 18rpx;
                  height: 2rpx;
                  background-color: #3b3b3b;
                }
              }
            }
          }
        }
      }

      .bottom {
        margin-top: 20rpx;

        .canwei {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .title {
            font-weight: bold;
          }

          .price {
            color: #ff4d53;
            font-weight: bold;
          }
        }
      }
    }

    .bot_box {
      overflow: hidden;
      background-color: #ffffff;
      border-radius: 15rpx;
      padding: 20rpx;
      margin-top: 20rpx;

      .name {
        display: flex;
      }

      .coupon-box {
        margin-bottom: 25rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .coupon_right {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .footer {
    width: 100%;
    height: 140rpx;
    background-color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;

    .add {
      width: 330rpx;
      height: 70rpx;
      color: #ff1b22;
      border: 1px solid #ff1b22;
      border-radius: 40rpx;
      text-align: center;
      line-height: 70rpx;
    }

    .pay {
      width: 330rpx;
      height: 70rpx;
      background-color: #ff1b22;
      border-radius: 40rpx;
      text-align: center;
      line-height: 70rpx;
      color: #ffffff;
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
}
</style>
