<template>
  <div v-if="order" class="pay-box">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <div
      style="
        font-size: 14px;
        color: #999999;
        text-align: center;
        padding-top: 25px;
        height: 40px;
      "
    >
      {{ pay_time <= 0 ? '请尽快完成支付' : pay_time_msg }}
    </div>
    <div class="price-box">
      <div><span style="font-size: 20px">￥</span>{{ order.pay_price }}</div>
    </div>
    <!-- 推荐支付 -->
    <div
      class="pay-box p-t-20"
      style="background: #ffffff; margin-bottom: 11px"
    >
      <div
        style="
          padding: 20rpx;
          font-size: 16px;
          color: #000000;
          font-weight: bold;
          padding-bottom: 10px;
        "
      >
        推荐支付
      </div>
      <div
        v-for="(item, index) in pay_type"
        :key="index"
        class="item-box"
        @click="selectPay(item.payment)"
        v-if="pay_type.length > 0 && index == 0"
      >
        <div class="info">
          <img :src="item.icon" />
          {{ item.name }}
        </div>
        <div class="select-box">
          <img
            v-if="item.payment == payment"
            :src="wxapp_img.icon_shop_checked"
          />
          <img
            v-else
            @click="selectPay(item.payment)"
            :src="wxapp_img.icon_shop_un"
          />
        </div>
      </div>
    </div>
    <!-- 其他支付 -->
    <div class="pay-box" style="background: #ffffff" v-if="pay_type.length > 1">
      <div
        style="
          padding: 20rpx;
          font-size: 16px;
          color: #000000;
          font-weight: bold;
          padding-bottom: 10px;
        "
      >
        其他支付
      </div>
      <div
        v-for="(item, index) in pay_type"
        :key="index"
        class="item-box p-x-20"
        @click="selectPay(item.payment)"
        v-if="pay_type && index > 0"
      >
        <div class="info">
          <img :src="item.icon" />
          <text>{{ item.name }}</text>
          <text v-if="item.payment == 3" class="color-999 font-24 m-l-20">{{
            balance
          }}</text>
        </div>
        <div class="select-box">
          <img
            v-if="item.payment == payment"
            :src="wxapp_img.icon_shop_checked"
          />
          <img v-else :src="wxapp_img.icon_shop_un" />
        </div>
      </div>
    </div>
    <div class="but-box">
      <div
        class="but"
        :style="{ backgroundColor: isSubmit ? 'red' : '#eee' }"
        @click="isSubmit && submitPay()"
      >
        确认支付
      </div>
    </div>

    <PayPassword
      :show.sync="showPasswordPopup"
      @success="passwordSuccess"
      :price="order.pay_price"
    ></PayPassword>
  </div>
</template>
<script>
import OrderPay from '@/mixins/OrderPay';
import PayPassword from '@/components/pay-password';
export default {
  name: 'pay',
  components: {
    PayPassword,
  },
  mixins: [OrderPay],
  data() {
    return {
      showPasswordPopup: false,
      passwordType: 'pass',
      order_type: 0,
      order_id: 0,
      order: {},
      pay_type: [],
      pay_fail_url: '',
      pay_success_url: '',
      payment: -1,
      pay_time: 0,
      pay_time_msg: '',
      balance: 0,
      isPasswordSuccess: false,
      isSubmit: true,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
  },
  onLoad(params) {
    this.order_type = params.order_type;
    this.order_id = params.order_id;
    // 获取用户信息
    this.getInfo();
  },
  onShow() {
    this.$store.dispatch('user/getUserInfo');
  },
  methods: {
    async getInfo() {
      const res = await this.$requestAll.pay.getPayInfo(
        {
          order_id: this.order_id,
          order_type: this.order_type,
        },
        true
      );
      this.balance = res.data.balance;
      this.order = res.data.order;

      // if (
      //   res.data.pay_type.some(item => item.payment === 4) &&
      //   this.$utils.is_webpage()
      // ) {
      //   let newPayList = res.data.pay_type.filter(item => {
      //     if (item.payment !== 4) return item;
      //   });
      //   this.pay_type = newPayList;
      // } else {
      //   this.pay_type = res.data.pay_type;
      // }

      this.pay_type = res.data.pay_type;
      this.pay_time = parseInt(res.data.pay_time / 1000);
      this.pay_fail_url = res.data.pay_fail_url;
      this.pay_success_url = res.data.pay_success_url;
      if (res.data.pay_type.length > 0) {
        this.payment = res.data.pay_type[0].payment;
      }

      if (this.pay_time > 0) {
        var msg = '支付剩余时间 ';
        var i = parseInt(this.pay_time / 60);
        msg += i + ':';
        var s = parseInt(this.pay_time % 60);
        msg += s < 10 ? '0' + s : s;
        this.pay_time = this.pay_time - 1;
        this.pay_time_msg = msg;
        setInterval(() => {
          if (this.pay_time > 0) {
            var msg = '支付剩余时间 ';
            var i = parseInt(this.pay_time / 60);
            msg += i + ':';
            var s = parseInt(this.pay_time % 60);
            msg += s < 10 ? '0' + s : s;
            this.pay_time = this.pay_time - 1;
            this.pay_time_msg = msg;
          }
        }, 1000);
      }
    },
    selectPay(payment) {
      this.payment = payment;
    },
    passwordSuccess() {
      console.log('密码验证通过');
      this.isPasswordSuccess = true;
      this.submitPay();
    },
    async submitPay() {
      uni.$u.throttle(async () => {
        // 当前为余额支付  && 未通过支付密码验证  && 未开启免密支付
        if (this.payment == 3 && !this.isPasswordSuccess) {
          this.showPasswordPopup = true;
          return;
        }
        var pay = {
          order_id: this.order_id,
          order_type: this.order_type,
          payment: this.payment,
        };
        /* #ifdef H5 */
        if (!this.$utils.is_webpage()) {
          pay.is_wechat = 2;
        }
        /* #endif */

        const res = await this.$requestAll.pay.sendPay(pay, true);
        if (res.data && res.data.price == 0) {
          this.paySuccess();
          return;
        }
        switch (this.payment) {
          // 微信支付
          case 1:
            // 调支付
            await this.wxPay(res);

            this.paySuccess();
            break;
          case 2:
            // 货到付款
            this.paySuccess();
            break;
          case 3:
            // 余额支付
            this.paySuccess();
            break;
          case 4:
            // 支付宝支付
            await this.aliPay(res, pay);
            this.paySuccess();

            break;
          case 5:
            // 朋友代付
            this.paySuccess();
            break;
          default:
            this.$toast('支付方式错误');
            break;
        }
      });
    },
    aliPay(res, payData) {
      // 支付宝支付已在公众号环境剔除，
      // h5无需再次判断公众号环境，
      // app支付调用和h5调用方式不同需根据环境判断调用，

      /* #ifdef APP-PLUS */
      return new Promise((resolv, reject) => {
        uni.requestPayment({
          provider: 'alipay',
          orderInfo: res.data,
          success: ress => {
            resolv(ress);
          },
          fail: error => {
            console.log(error);
            uni.$u.toast('支付失败');
            reject(error);
          },
        });
      });
      /* #endif */

      /* #ifndef APP-PLUS */
      // uni.showModal({
      //   title: '提示',
      //   content: '是否已支付？',
      //   cancelText: '未支付',
      //   confirmText: '已支付',
      //   success: res => {
      //     if (res.confirm) {
      //       this.$utils.toUrl('/pages/order/order?status=1');
      //     } else if (res.cancel) {
      //       this.$utils.toUrl('/pages/order/order?status=0');
      //     }
      //   },
      // });

      // 公众号环境
      if (this.$utils.is_webpage()) {
        this.$utils.toUrl('/other/pay/alipay' + uni.$u.queryParams(payData));
      } else {
        window.location.href = res.data;
      }

      return Promise.reject();
      /* #endif */
    },
    paySuccess() {
      this.$utils.toast('支付成功');
      this.isSubmit = false;
      setTimeout(() => {
        // 没有支付成功跳转地址
        if (this.pay_success_url == -1 || !this.pay_success_url) {
          this.$utils.backTo();
          return;
        }
        // 朋友代付，跳转代付订单
        else if (this.payment == 5) {
          // 查找截取替换
          this.pay_success_url = this.pay_success_url.replace(
            'status=1',
            'status=0'
          );
        }
        this.$utils.toUrl(this.pay_success_url, 'redirectTo');
      }, 1500);
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
};
</script>

<style scope>
.price-box {
  width: 100%;
  display: flex;
  justify-content: center;
  font-size: 40px;
  color: #000000;
  font-weight: 600;
  padding: 10px 0 20px;
}
.pay-box {
  /* padding: 10px 10px 0; */
 
}
 .diy_header{
  	padding: 25rpx;
  	background-color: #ffffff;
  }
.item-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 20rpx;
  border-top: 1px solid #fafafa;
}

.item-box .info {
  display: flex;
  align-items: center;
  color: #000000;
}

.item-box .info img {
  width: 20px;
  height: 20px;
  margin-right: 5px;
}

.item-box .select-box img {
  width: 17px;
  height: 17px;
}

.but-box {
  background-color: #ffffff;
  padding: 10px 10px 25px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.but-box .but {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  color: #ffffff;
  height: 40px;
  border-radius: 20px;
}
</style>
