<template>
  <view class="order-list">
	 <!-- #ifdef H5 -->
	 <!-- <view class="diy_header">
	 	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	 </view> -->
	 <!-- #endif -->
    <view class="bg-fff">
      <u-tabs
        :list="tabsList"
        @click="clickTabs"
        :activeStyle="{
          fontWeight: 'bold',
        }"
        :current="tabsIndex"
        :scrollable="false"
      ></u-tabs>
    </view>

    <scroll-view @scrolltolower="tolower" scroll-y class="content">
      <view v-if="orderList.length" class="conent-box">
        <OrderList
          :list="orderList"
          :is_foods="is_foods"
          @clickOrder="clickOrder"
          @onShare="onShare"
          @clickPay="clickPay"
          @clickCancel="clickCancel"
          @onTuikuan="onTuikuan"
          @orderConfirm="orderConfirm"
          @onShowCode="onShowCode"
          @clickTabs="clickTabs"
          @gotoHandleOrder="gotoHandleOrder"
        >
        </OrderList>
        <u-loadmore :status="status"></u-loadmore>
      </view>
      <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>

      <u-popup
        :show="showCodePopup"
        round="20rpx"
        @close="showCodePopup = false"
        mode="center"
        closeable
        :safeAreaInsetBottom="false"
      >
        <div class="code-popup">
          <div class="title">核销码</div>
          <image :src="codeUrl" mode="aspectFill" />
        </div>
      </u-popup>

      <WxOpenSubscribe
        :template="[orderData.refund_tpl || '', orderData.revoke_tpl || '']"
      ></WxOpenSubscribe>
    </scroll-view>
    <Share :showPopup.sync="showShare" type="order" :isShowHB="false"></Share>
    <QOfficialAccount></QOfficialAccount>
  </view>
</template>

<script>
import GoodsList from './components/GoodsList';
import OrderList from '@/components/OrderList/OrderList';
import Share from '@/components/share/share';
import share from '@/mixins/share.js';
import WxOpenSubscribe from '@/components/wx-open-subscribe';

export default {
  components: {
    GoodsList,
    OrderList,
    Share,
    WxOpenSubscribe,
  },
  mixins: [share],
  data() {
    return {
      tabsList:[],
      tabsIndex: 0,
      orderData: '',
      orderList: [],
      status: 'loadmore',
      page: 1,
      showCodePopup: false, //code弹框开关
      showShare: false,
      codeUrl: '', //code url
      checkItem: '',
      order_id: '',
      coupon_rule_id: '',
      coupon_rule: '',
      is_foods:false,
      type:0,
    };
  },
  onLoad(params) {
    const tabsList = [
      {
        name: '待付款',
      },
      {
        name: '待发货',
      },
      {
        name: '待收货',
      },
      {
        name: '已完成',
      },
      {
        name: '售后',
      },
      {
        name: '已取消',
      },
    ];
    
    this.tabsIndex = params.status ? params.status - 0 : 0;
	
	if(params.type == 2){
		this.type = 2;
	}
    // 如果开启了支付分享领取优惠卷
    if (params.status == 1 && params.order_id) {
      this.order_id = params.order_id;
      this.getCouponRuleId();
    }
    if(params.from && params.from == 'food'){
      tabsList.push({name:'待下单'})
      this.is_foods = true
    }
    this.tabsList = tabsList
    this.getOrderList();
  },
  onShow() {
    // 监听更改评论状态
    uni.$once('modifyCommentStatus', (id, status) => {
      let index = this.orderData.list.findIndex(item => item.order_id == id);
      this.orderData.list[index].is_comment = status;
      console.log('更新完成', this.orderData.list[index]);
    });
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.resetData();
    this.getOrderList(uni.stopPullDownRefresh);
  },
  methods: {
    // 挂单订单去结账
    gotoHandleOrder(order){
      console.log(order,'order');
      this.$utils.toUrl('/ordering-food/order-detail/order-detail?id=' + order.order_id + '&table_id=' + order.table_id + '&mch_id=' + order.mch.id)
    },
    async getCouponRuleId() {
      var res = await this.$requestAll.coupon.shareCounponRule(
        {
          order_id: this.order_id,
        },
        true
      );
      if (res.data.coupon_rule) {
        this.coupon_rule_id = res.data.coupon_rule_id;
        this.coupon_rule = res.data.coupon_rule;
        uni.showModal({
          title: '分享领取优惠券',
          content: '分享给好友可以领取优惠券哦~',
          confirmText: '分享',
          confirmColor: '#ff0000',
          success: ({ confirm, cancel }) => {
            if (confirm) {
              /* #ifdef H5 */
              return this.$utils.toUrl(
                '/other/coupon-share/coupon-share' +
                  uni.$u.queryParams({
                    order_id: this.order_id,
                    coupon_rule_id: this.coupon_rule_id,
                    user_id: this.$store.getters['user/userInfo'].id || '',
                    store_id:
                      (this.$store.getters['currentStore'] &&
                        this.$store.getters['currentStore'].id) ||
                      1,
                    // #ifdef APP-PLUS
                    _platform: 'app',
                    // #endif
                  })
              );
              /* #endif */

              this.showShare = true;
            }
          },
        });
      }
    },
    onShare(order) {
      this.checkItem = order;
      /* #ifdef H5 */
      return this.$utils.toUrl(
        '/pages/order-share/order-share' +
          uni.$u.queryParams({
            id: this.checkItem.order_id,
            user_id: this.checkItem.user_id,
            store_id: this.$store.getters['currentStore'].id || '' || 1,
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          })
      );
      /* #endif */
      this.showShare = true;
    },
    // 点击核销码
    async onShowCode(order) {
      const res = await this.$requestAll.order.getQrcode(
        {
          order_no: order.order_no,
        },
        true
      );
      this.codeUrl = res.data.url;
      this.showCodePopup = true;
    },
    // 确认收货
    async orderConfirm(item) {
      const res = await this.$requestAll.order.orderConfirm({
        order_id: item.order_id,
      });
      uni.$u.toast(res.msg);

      this.resetData();
      this.getOrderList();
    },
    clickTabs({ index }, order) {
      this.tabsIndex = index;
      this.resetData();
      this.order_id = order ? order.order_id : '';
      this.getOrderList();
    },
    // 重置数据
    resetData() {
      this.orderData = this.$options.data().orderData;
      this.orderList = this.$options.data().orderList;
      this.status = this.$options.data().status;
      this.page = this.$options.data().page;
    },
    // 获取数据列表
    async getOrderList(fn) {
      this.status = 'loading';
      var params = {
        status: this.tabsIndex,
		    type:this.type,
        page:this.page
      };
      if (this.order_id) params.order_id = this.order_id;
      const res = await this.$requestAll.order.getOrderList(params, true);
      this.orderData = res.data;
      this.orderList.push(...res.data.list);
      this.status =
        this.orderList.length >= res.data.row_count ? 'nomore' : 'loadmore';
      fn && fn();
    },
    // 点击订单
    clickOrder(item) {
      console.log(item);
      if (this.tabsIndex == 4) {
        this.$utils.toUrl(
          '/pages/order-refund-detail/order-refund-detail?id=' +
            item.order_refund_id
        );
      } else {
        this.$utils.toUrl(
          '/pages/order-detail/order-detail?id=' + item.order_id
        ); 
      }
    },
    // 取消订单
    async clickCancel(item) {
      await this.bindMessage();

      const { confirm } = await this.$utils.showModalAsync({
        content: '您确定取消该订单吗?',
      });
      if (!confirm) return;

      const { msg } = await this.$requestAll.order.orderRevoke(
        {
          order_id: item.order_id,
        },
        true
      );
      this.$utils.toast(msg || '取消订单成功');
      this.resetData();
      this.getOrderList();
    },
    // 点击支付
    clickPay(order) {
      console.log(order);
      this.$utils.toUrl(
        '/pages/pay/pay' +
          uni.$u.queryParams({
            order_id: order.order_id,
            order_type: 0,
          })
      );
    },
    // 点击退款
    async onTuikuan(item) {
      await this.bindMessage();

      const { confirm } = await this.$utils.showModalAsync({
        content: `是否申请退款该订单？`,
      });
      if (!confirm) return;

      const { msg } = await this.$requestAll.order.orderRevoke(
        {
          order_id: item.order_id,
        },
        true
      );
      await this.$utils.showModalAsync({ content: msg, showCancel: false });
      let i = this.orderData.list.findIndex(it => item.order_id == it.order_id);
      this.orderData.list[i].apply_delete = 1;
    },
    // 触底加载
    tolower() {
      if (this.status == 'nomore') return;
      this.page++;
      this.getOrderList();
    },
    async bindMessage() {
      let ids = [this.orderData.revoke_tpl, this.orderData.refund_tpl];
      await this.$utils.bindMessage(ids);
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },

  computed: {
    SHOP_CONFIG() {
      return this.$store.getters['SHOP_CONFIG'];
    },
    shareData() {
      if (this.coupon_rule) {
        return {
          title: this.coupon_rule.name,
          imageUrl: this.coupon_rule.pic_url,
          path:
            '/other/coupon-share/coupon-share' +
            uni.$u.queryParams({
              order_id: this.order_id,
              coupon_rule_id: this.coupon_rule_id,
              user_id: this.$store.getters['user/userInfo'].id || '',
              store_id: this.$store.getters['currentStore'].id || '',
              // #ifdef APP-PLUS
              _platform: 'app',
              // #endif
            }),
        };
      } else {
        // #ifdef MP-WEIXIN || APP-PLUS
        return {
          title: '有一笔订单请你帮我付！',
          imageUrl: this.checkItem && this.checkItem.goods_list[0].goods_pic,
          path:
            '/pages/order-share/order-share' +
            uni.$u.queryParams({
              id: this.checkItem.order_id,
              user_id: this.checkItem.user_id,
              store_id:
                (this.$store.getters['currentStore'] &&
                  this.$store.getters['currentStore'].id) ||
                1,
              // #ifdef APP-PLUS
              _platform: 'app',
              // #endif
            }),
        };
        // #endif
      }
    },
  },
};
</script>

<style lang="less" scoped>
.order-list {
  font-family: PingFang SC;
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  flex-direction: column;
 .diy_header{
	padding: 25rpx;
	background-color: #ffffff;
}
  /deep/.u-tabs {
    .u-tabs__wrapper__nav__item {
      height: 90rpx !important;
      line-height: 90rpx;
      font-weight: 400;
      font-size: 28rpx;
      color: #262626;
    }

    .u-tabs__wrapper__nav__line {
      bottom: 16rpx;
      width: 50rpx !important;
      height: 6rpx !important;
      background-color: #f0250e !important;
    }

    .u-tabs__wrapper__nav__item {
      padding: 0;
    }
  }

  > .content {
    flex: 1;
    height: 0;
  }

  .button-initial {
    font-size: 28rpx;
    line-height: 1.5;
    border-radius: 10rpx;
    border: 1px solid #333;
    padding: 0 10rpx;
    font-weight: 400;
  }
}

.conent-box {
  // padding-top: 20rpx;

  .order-item {
    // border-radius: 20rpx;
    padding: 20rpx 0;
    // box-shadow: 4rpx 6rpx 2rpx #eee;
    margin: 0 0 20rpx;
    background: #fff;

    > view {
      padding: 0 20rpx;
    }

    .order-title {
      font-size: 26rpx;
      // border-bottom: 2rpx solid #e5e5e5;

      > view:nth-child(1) {
        font-size: 28rpx;
        font-weight: 700;

        .text-status {
          font-weight: normal;
          line-height: 34rpx;
          font-size: 24rpx;
          color: #f0250e;
        }
      }

      > view:nth-child(2) {
        font-size: 24rpx;
        line-height: 34rpx;
        color: #8c8c8c;
      }
    }

    .total-titme {
      .time {
        font-size: 24rpx;
        line-height: 34rpx;
        color: #8c8c8c;
      }

      .total {
        font-size: 24rpx;
        font-weight: bold;
        line-height: 34rpx;
        color: #262626;

        text {
          color: #f60313;
        }
      }
    }

    .total-button {
      margin-top: 10rpx;
      padding-top: 20rpx;
      // border-top: 2rpx solid #eee;
      // height: 60rpx;

      .button-box {
        width: 0;
        flex: 1;
        justify-content: flex-end;

        > view,
        > button {
          width: 152rpx;
          text-align: center;
          line-height: 60rpx;
          margin-left: 24rpx;

          border-radius: 30rpx;
          border: 2rpx solid #a1a1a1;
          font-size: 26rpx;
          color: #262626;
        }

        > button {
          width: initial;
          padding: 0 20rpx;
        }

        .button1 {
          color: #f60313;
          border-color: #f60313;
        }
      }
    }
  }
}

.code-popup {
  padding: 40rpx;
  box-sizing: content-box;
  text-align: center;

  image {
    display: block;
    margin: 0 auto;
    width: 450rpx;
    height: 450rpx;
  }
}

.border0 {
  border: 0 !important;
}
</style>
