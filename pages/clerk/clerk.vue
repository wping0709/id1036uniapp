<template>
  <view v-if="pageData" class="body">
    <!-- 核销卡信息 -->
    <template v-if="params.type == 'verify'">
      <view class="shop p-x-20 p-y-10 m-b-20 bg-fff">
        <view class="flex-y-center">
          <view>核销卡名称：</view>
          <view class="flex-w-1 u-line-1">
            {{ pageData.list.verify_card_name }}
          </view>
        </view>
        <view class="flex-y-center">
          <view>核销卡用户：</view>
          <view class="flex-w-1 u-line-1">
            {{ pageData.list.verify_user_name }}
          </view>
        </view>
      </view>

      <view class="total p-x-20 p-y-10 m-y-20 bg-fff">
        <view class="flex-y-center flex-x-sb">
          <view>核销门店：</view>
          <view> {{ pageData.list.shop }} </view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>核销店铺：</view>
          <view>{{ pageData.list.mch }}</view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>剩余次数：</view>
          <view>{{ pageData.list.left_num }}</view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>有效期至：</view>
          <view>{{ pageData.list.valid_time }}</view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>核销员：</view>
          <view>{{ pageData.list.verify_user_name }}</view>
        </view>
      </view>
    </template>

    <!-- 核销订单列表 -->
    <template v-else-if="!pageData.order_list">
      <view class="address m-b-20 flex-y-center flex-x-sb p-x-20 bg-fff">
        <view>收货人：{{ pageData.name }}</view>
        <view>{{ pageData.mobile }}</view>
      </view>

      <view class="shop p-x-20 p-y-10 m-y-20 bg-fff">
        <view class="flex-y-center flex-x-sb">
          <view>订单编号：{{ pageData.order_no }}</view>
          <view class="shop-daohang" @click="$utils.copy(pageData.order_no)"
            >复制</view
          >
        </view>
        <view>下单时间：{{ pageData.addtime }}</view>
      </view>

      <view class="total p-x-20 p-y-10 m-y-20 bg-fff">
        <view class="flex-y-center flex-x-sb">
          <view>商品总额：</view>
          <view> ￥{{ pageData.goods_total_price }} </view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>商品数量：</view>
          <view>x{{ pageData.num }}</view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>优惠券优惠：</view>
          <view>-￥{{ pageData.coupon_sub_price }}</view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>运费：</view>
          <view>{{ pageData.express_price }}</view>
        </view>
        <view class="flex-y-center flex-x-sb">
          <view>买家留言：</view>
          <view class="m-l-20 flex-w-1">{{ pageData.content }}</view>
        </view>
        <view class="total-text flex-x-end">
          <view>合计：</view>
          <view class="price-color">
            {{ pageData.pay_price }}
          </view>
        </view>
      </view>

      <view
        v-for="(item, i) in pageData.goods_list"
        :key="i"
        class="goods-item p-x-20 p-y-10 m-y-20 bg-fff flex-x-sb flex-y-center"
      >
        <view style="width: 160rpx; height: 160rpx">
          <u-image
            :src="item.goods_pic"
            width="160rpx"
            height="160rpx"
            mode="aspectFill"
          ></u-image>
        </view>
        <view class="content flex-col flex-x-sb flex-w-1 m-l-20">
          <view class="u-line-2 goods-name">{{ item.name }}</view>
          <view>
            <view class="color-999 u-line-1">
              <text
                class="attr-item m-r-10"
                v-for="(attrItem, attrIndex) in item.attr"
                :key="attrIndex"
              >
                {{ attrItem.attr_group_name }}：{{ attrItem.attr_name }}
              </text>
            </view>
            <view class="flex-x-sb flex-y-center">
              <view class="color-999">X{{ item.num }}</view>

              <view class="price-color flex-w-1 font-right">
                ￥{{ item.total_price }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </template>

    <!-- 单个订单核销 -->
    <template v-else>
      <view
        class="p-24 m-b-24 bg-fff"
        v-for="(mch, i) in pageData.order_list"
        :key="mch.order_id"
      >
        <view class="font-26">
          <view class="m-b-10">{{ mch.name }}</view>
          <view class="color-999 flex-x-sb flex-y-center">
            <text>订单号：{{ mch.order_no }}</text>
            <text>{{ mch.addtime }}</text>
          </view>
        </view>

        <GoodsList :goodsList="mch.goods_list"></GoodsList>

        <view class="flex-y-center flex-x-sb">
          <view class="flex-y-center" @click="checkMch(mch, i)">
            <text
              v-if="mch.check"
              class="iconfont icon-success-fill price-color font-40"
            ></text>
            <text
              v-else
              class="iconfont icon-xuanzekuangmoren color-666 font-40"
            ></text>
            <text>确认核销</text>
          </view>

          <view class="flex-y-center">
            <view class="m-r-10">收货人：{{ mch.name }}</view>
            <view>电话：{{ mch.mobile }}</view>
          </view>
        </view>
      </view>
    </template>

    <div class="hexiao-box">
      <view class="fixed flex-y-center flex-x-center">
        <div @click="submit" class="bt">核销订单</div>
      </view>
    </div>
  </view>
</template>
<script>
import GoodsList from '@/pages/order/components/GoodsList';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      pageData:{},
      params: {
        order_no: '',
      },
    };
  },
  // onLoad(params) {
  //   console.log(params,'params');
  //   if(params.scene){
  //     let str = decodeURIComponent(params.scene);
  //     str.split(',').forEach(item => {
  //       let itemArr = item.split(':');
  //       params[itemArr[0]] = itemArr[1];
  //     });
  //     delete params.scene
  //   }
  //   // 用户二维码
  //   if (params.user_id) {
  //     this.params.user_id = params.user_id
  //   } else {
  //     this.params = params
  //   }
    

  //   this.loadData();
  // },
  onLoad(params) {
    if(params.scene){
      let str = decodeURIComponent(params.scene);
      str.split(',').forEach(item => {
        let itemArr = item.split(':');
        params[itemArr[0]] = itemArr[1];
      });
      delete params.scene
    }
    //   // 用户二维码
    if (params.user_id) {
      this.params.user_id = params.user_id
    } else {
      this.params = params
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        if (this.params.type == 'verify') {
          const res = await this.$requestAll.verify.verifyOrder(
            this.params,
            true
          );
          this.pageData = res.data;
        } else {
          const res = await this.$requestAll.order.clerkDetail(
            this.params,
            true
          );
          this.pageData = res.data;
        }
      } catch (error) {
        // setTimeout(() => {
        //   this.$utils.backTo();
        // }, 1300);
		    console.log('错误',error)
      }
    },
    checkMch(mch, i) {
      let newMch = JSON.parse(JSON.stringify(mch));
      newMch.check = !newMch.check;
      console.log(newMch);
      this.$set(this.pageData.order_list, i, newMch);
    },

    toLoaction() {
      uni.openLocation({
        latitude: this.pageData.shop.latitude - 0,
        longitude: this.pageData.shop.longitude - 0,
        complete(res) {
          console.log(res);
        },
      });
    },
    submit() {
      console.log('submit');
      if (
        this.pageData.order_list &&
        !this.pageData.order_list.some(item => item.check)
      )
        return uni.$u.toast('请选择核销订单');

      var that = this;
      uni.showModal({
        title: '提示',
        content: '是否确认核销？',
        success: async function (res) {
          if (res.confirm) {
            let formData = {};
            if (that.pageData.order_list) {
              let obj = {};
              let objKey = 0;

              for (let i = 0; i < that.pageData.order_list.length; i++) {
                const mch = that.pageData.order_list[i];
                if (mch.check) {
                  obj[objKey] = mch.order_id;
                  objKey++;
                }
              }
              formData.order_id_arr = JSON.stringify(obj);
            } else {
              formData.order_no = that.params.order_no;
            }

            if (that.params.type == 'verify') {
              formData.order_type = that.params.type;
              await that.$requestAll.order.clerkVerify(formData);
            } else {
              await that.$requestAll.order.orderClerk(formData);
            }

            uni.showModal({
              title: '提示',
              content: '核销成功',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: result => {
                if (result.confirm) {
                  that.$utils.backTo();
                }
              },
              fail: () => {},
              complete: () => {},
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  font-size: 28rpx;
  .address {
    line-height: 100rpx;
  }
  .shop {
    > view {
      line-height: 60rpx;
    }
    .shop-daohang {
      padding: 5rpx 10rpx;
      border-radius: 8rpx;
      border: 2rpx solid #e5e5e5;
      color: #999;
      font-size: 22rpx;
      height: 40rpx;
      line-height: 30rpx;
    }
  }
  .total {
    > view {
      line-height: 60rpx;
    }
    .total-text {
      border-top: 2rpx solid #f5f5f5;
      line-height: 80rpx;
    }
  }
  .goods-item {
    font-size: 26rpx;
    .goods-name {
      font-size: 28rpx;
      line-height: 40rpx;
      height: 80rpx;
    }
  }

  .hexiao-box {
    box-sizing: content-box;
    height: 100rpx;
    padding-bottom: env(safe-area-inset-bottom);
    .fixed {
      box-sizing: content-box;
      height: 100rpx;
      padding-bottom: env(safe-area-inset-bottom);
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      background: #fff;
      .bt {
        width: 680rpx;
        line-height: 80rpx;
        border-radius: 20rpx;
        background: #ff4544;
        color: #fff;
        text-align: center;
        font-size: 30rpx;
      }
    }
  }

  .goods {
    padding: 26rpx 0;
    border-bottom: 2rpx solid #e5e5e5;
    &:nth-last-child(1) {
      padding-bottom: 0;
      border: 0;
    }
    .goods-content {
      font-size: 28rpx;
      margin-left: 20rpx;
      width: 0;
      flex: 1;
      .goods-name {
        height: 72rpx;
        font-size: 28rpx;
        font-weight: bold;
        line-height: 34rpx;
        color: #262626;
      }
      .attr-num {
        margin-top: 10rpx;
        font-size: 24rpx;
        line-height: 34rpx;
        color: #8c8c8c;
      }
      .price {
        margin-top: 14rpx;

        font-size: 24rpx;
        font-weight: bold;
        line-height: 34rpx;
        color: #262626;
        text {
          font-size: 32rpx;
        }
      }
    }
  }
}
</style>
