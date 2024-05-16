<template>
  <view v-if="orderData" class="body">
    <div class="rule" @click="$utils.toUrl('/bargain/rule/rule')">活动规则</div>

    <view class="user-goods-info">
      <div class="user flex-col flex-y-center">
        <image :src="orderData.order_user_avatar" mode="aspetFill" />
        <view class="user-name">{{ orderData.order_user_name }}</view>
        <view class="user-content m-t-10">{{ orderData.content }}</view>
      </div>

      <div class="goods-box flex-x-sb flex-y-center">
        <image :src="orderData.cover_pic" mode="aspetFill" />
        <div class="right flex-w-1">
          <view class="u-line-2">{{ orderData.goods_name }}</view>

          <!-- 砍价状态 -->
          <view class="price-color font-w-700">
            <template v-if="orderData.status == 0">
              <text>当前价</text>
              <PriceText
                :price="orderData.price"
                ySize="32rpx"
                fSize="24rpx"
              ></PriceText>
            </template>
            <template v-else-if="orderData.status == 2"> 砍价失败 </template>
            <template v-else> 砍价成功 </template>
          </view>
        </div>
      </div>

      <div class="new-progress-box p-x-20 p-t-20 m-t-30">
        <view
          class="flex-x-sb flex-y-center m-b-30 font-24 font-w-700 price-color"
        >
          <view>
            <text>原价</text>
            <PriceText
              :price="orderData.original_price"
              color="red"
              ySize="32rpx"
              fSize="24rpx"
            ></PriceText>
          </view>

          <view
            style="
              padding: 0 20rpx;
              line-height: 42rpx;
              background: #fff3f1;
              border-radius: 120rpx;
            "
          >
            <text class="color-333">已砍</text>
            <text class="p-l-10">{{ orderData.money }}</text>
          </view>
          <view>
            <text>底价</text>
            <PriceText
              :price="orderData.min_price"
              color="red"
              ySize="32rpx"
              fSize="24rpx"
            ></PriceText>
          </view>
        </view>
        <view>
          <u-line-progress
            :percentage="percentage(orderData.money, orderData.original_price)"
            height="18rpx"
          ></u-line-progress>
        </view>

        <view
          v-if="orderData.status == 0"
          class="flex-y-center flex-x-center m-y-30"
        >
          <view>剩余</view>
          <view class="price-color font-w-700 m-x-10">
            <u-count-down
              :time="orderData.reset_time * 1000"
              format="HH 时 mm 分 ss 秒"
            ></u-count-down>
          </view>
          <view>结束</view>
        </view>
        <view v-else class="flex-y-center flex-x-center m-y-30">
          <view>已结束</view>
        </view>
      </div>

      <div class="btns flex-x-center flex-y-center p-x-20">
        <template v-if="isSelf">
          <!-- 查看更多砍价商品 -->
          <template v-if="orderData.status == 2">
            <view @click="$utils.toUrl('/bargain/list/list')" class="bt-1">
              查看更多商品
            </view>
          </template>
          <template v-else>
            <view @click="onBuy" class="bt-2"> 立即购买 </view>
            <button
              @click="jixuKanjia"
              v-if="orderData.status == 0"
              class="button-initial bt-2 m-l-20"
              style="background: #ffc210"
            >
              继续砍价
            </button>
          </template>
        </template>
        <template v-else>
          <view
            @click="
              $utils.toUrl(
                '/bargain/goods/goods?goods_id=' +
                  goods_id +
                  '&mch_id=' +
                  mch_id
              )
            "
            class="bt-1"
          >
            <image
              :src="wxapp_img.icon_bargain_activity_join"
              mode="widthFix"
            />
          </view>
        </template>
      </div>
    </view>

    <!-- 砍价记录 -->
    <div class="record">
      <div class="record-title font-w-700 font-30 p-b-20">砍价记录</div>

      <div
        v-for="(user, index) in orderData.bargain_info"
        :key="index"
        class="user-item flex-y-center"
      >
        <image class="user-avatar" :src="user.avatar" mode="aspectFill" />
        <text class="flex-w-1 font-600-24">{{ user.nickname }}</text>
        <view class="flex-y-center font-w-700">
          砍掉
          <text class="price-color m-l-10">{{ user.price }}元</text>
        </view>
      </div>
    </div>

    <u-popup
      :show="resultPopup"
      round="20rpx"
      @close="resultPopup = false"
      mode="center"
      closeable
      :safeAreaInsetBottom="false"
    >
      <view class="result-popup">
        <div class="title">
          <image
            :src="wxapp_img.icon_bargain_activity_header"
            mode="widthFix"
          />
          <image
            :src="wxapp_img.icon_bargain_activity_header_1"
            mode="widthFix"
          />
        </div>

        <div class="content font-center">
          你一出手就帮{{ isSelf ? "自己" : orderData.order_user_name }}砍了
          <text class="price-color">{{ kanData.bargain_price || 0 }}</text>
          元 <br />
          <template v-if="isSelf"> 快邀请好友帮你一起砍吧 </template>
        </div>

        <button
          v-if="isSelf"
          class="bt flex-y-center flex-x-center button-initial"
          @click="jixuKanjia"
        >
          <image :src="wxapp_img.icon_bargain_activity_help" mode="widthFix" />
        </button>

        <!-- 查看商品 -->
        <button
          @click="
            $utils.toUrl(
              '/bargain/goods/goods?goods_id=' + goods_id + '&mch_id=' + mch_id
            )
          "
          v-else
          class="bt flex-y-center flex-x-center button-initial"
        >
          <image :src="wxapp_img.icon_bargain_activity_join" mode="widthFix" />
        </button>
      </view>
    </u-popup>

    <QOfficialAccount></QOfficialAccount>

    <!-- 分享组件 -->
    <Share :showPopup.sync="showShare" type="kj" :isShowHB="false"></Share>
  </view>
</template>
<script>
import PriceText from "@/components/price-text/index";
import Share from "@/components/share/share";
import share from "@/mixins/share";
export default {
  components: {
    Share,
    PriceText,
  },
  mixins: [share],
  data() {
    return {
      orderData: "",
      kanData: "",
      order_id: "",
      user_id: "",
      mch_id: "",
      resultPopup: false, //砍价成功展示弹框提示
      showShare: false,
    };
  },
  computed: {
    percentage() {
      return function (pitch, all) {
        let percentage = (pitch / all) * 100;
        return percentage.toFixed(2);
      };
    },
    isSelf() {
      if (
        this.user_id == this.$store.getters["user/userInfo"].id ||
        !this.user_id
      ) {
        return true;
      } else {
        return false;
      }
    },
    shareData() {
      // 设置分享标题
      let shareTitle = "";
      if (this.orderData.share_title) {
        let titleArr = this.orderData.share_title.split(",");
        // 判断是否多个分享标题。随机获取一个
        if (titleArr.length >= 1) {
          let randomNumber = uni.$u.random(0, titleArr.length - 1);
          shareTitle = titleArr[randomNumber];
        } else {
          shareTitle = titleArr[0];
        }
      }
      return {
        title: shareTitle || "砍价",
        path:
          "/bargain/activity/activity" +
          uni.$u.queryParams({
            order_id: this.order_id ? this.order_id : this.orderData.order_id,
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
      };
    },
  },
  onLoad(params) {
    // 订单已创建
    if (params.order_id) {
      this.order_id = params.order_id;
      if (params.user_id) {
        this.user_id = params.user_id || "";
        this.loadData();
        this.$requestAll.share.bindParent({ parent_id: params.user_id });
      }
      this.getOrderData();
    }
    // 订单还未创建,创建订单,自砍一刀
    else {
      this.goods_id = params.goods_id;
      this.loadData();
    }
  },
  onShow() {
    this.getOrderData();
  },
  methods: {
    // 创建砍价订单,自砍一刀
    async loadData() {
      if (this.goods_id) {
        // 提交砍价订单
        const res = await this.$requestAll.bargain.bargainSubmit({
          goods_id: this.goods_id,
        });
        this.order_id = res.data.order_id;
      }
      // 砍一刀
      const res1 = await this.$requestAll.bargain.orderBargain({
        order_id: this.order_id,
      });
      this.kanData = res1.data;
      this.resultPopup = true;
      this.getOrderData();
    },
    // 获取砍价订单信息
    async getOrderData() {
      const res = await this.$requestAll.bargain.orderActivity({
        order_id: this.order_id,
      });
      this.goods_id = res.data.goods_id;
      this.mch_id = res.data.mch_id;
      this.orderData = res.data;
    },

    jixuKanjia() {
      this.showShare = true;
    },
    // 立即购买
    async onBuy() {
      const { confirm } = await this.$utils.showModalAsync({
        title: "提示",
        content: "是否确认购买？",
      });
      if (!confirm) return;
      const params = [
        {
          mch_id: this.mch_id,
          goods_list: [
            {
              bargain_order_id: this.order_id,
            },
          ],
        },
      ];
      this.$utils.toUrl(
        "/pages/order-submit/order-submit?mch_list=" + JSON.stringify(params)
      );
    },
  },
  onShow() {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: linear-gradient(to bottom, #ff004e 0%, #ff1f43 20%, #ff2021 100%);
  padding-bottom: 40rpx;
  padding-top: 126rpx;
  min-height: 100vh;
  .result-popup {
    padding-bottom: 30rpx;
    .title {
      position: relative;
      width: 640rpx;
      height: 200rpx;
      > image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        &:nth-child(2) {
          width: 400rpx;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
    .content {
      padding: 40rpx 0;
      text-align: center;
      font-size: 32rpx;
      line-height: 60rpx;
      color: #666;
    }

    // 放大缩小无限循环
    @keyframes switchSale {
      0% {
        transform: scale(1);
      }
      50% {
        transform: scale(0.9);
      }
      100% {
        transform: scale(1);
      }
    }
    .bt {
      image {
        width: 520rpx;
        animation: switchSale 2s infinite;
      }
    }
  }

  .rule {
    position: absolute;
    right: 0;
    top: 24rpx;
    width: 138rpx;
    line-height: 62rpx;
    text-align: center;
    background: #ffffff;
    opacity: 0.8;
    border-radius: 120rpx 0rpx 0rpx 120rpx;

    font-size: 24rpx;
    font-weight: 600;
    color: #ff1b22;
  }

  .user-goods-info {
    padding: 20rpx 0;
    margin: 0 20rpx 20rpx;
    background: #fff;
    border-radius: 20rpx;
    .user {
      padding: 0 20rpx 20rpx;
      margin-top: -80rpx;
      border-bottom: 2rpx solid #eee;
      > image {
        width: 132rpx;
        height: 132rpx;
        border-radius: 50%;
      }
      .user-name {
        margin-top: 24rpx;
        text-align: center;
        line-height: 42rpx;
        font-size: 30rpx;
        font-weight: 600;
        color: #333333;
      }
      .user-content {
        font-size: 30rpx;
        color: #ff1b22;
      }
    }
    .goods-box {
      margin-top: 48rpx 20rpx 0;
      background: linear-gradient(180deg, #f9f9fb 0%, #ffffff 100%);
      border-radius: 10rpx;
      > image {
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
      }
      .right {
        margin-left: 20rpx;
        > view:nth-child(1) {
          line-height: 34rpx;
          height: 68rpx;
          margin-bottom: 14rpx;
        }
      }
    }
  }

  .new-progress-box {
    /deep/.u-line-progress__line {
      background: linear-gradient(91deg, #ff1c22 0%, #ff7333 100%) !important;
    }
  }

  .progress-box {
    padding: 0 40rpx;
    color: #fff;
    .progress {
      margin: 100rpx 0 0;
      background: #b91f3f;
      height: 20rpx;
      border-radius: 10rpx;

      .progress-line {
        position: relative;
        border-radius: 10rpx;
        height: 100%;
        background: #ff9f9f;
        white-space: nowrap;
        .progress-text {
          position: absolute;
          left: 50%;
          top: -20rpx;
          padding: 0 20rpx;
          font-size: 22rpx;
          line-height: 40rpx;
          border-radius: 20rpx;
          color: #ff5c5c;
          background: #fff;
        }
      }
    }
  }

  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > view,
    button {
      line-height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0rpx 6rpx 12rpx rgba(255, 0, 33, 0.2);
      border-radius: 120rpx;

      font-size: 32rpx;
      font-weight: 600;
      color: #fff;
    }
    .bt-1 {
      flex: 1;
      background: #ffc210;
    }
    .bt-2 {
      width: 316rpx;
      line-height: 80rpx;
      background: linear-gradient(91deg, #ff1c22 0%, #ff7333 100%);
    }
  }

  .record {
    border-radius: 20rpx;
    padding: 20rpx 30rpx;
    margin: 20rpx;
    background: #ffffff;

    .user-item {
      margin-bottom: 20rpx;
      .user-avatar {
        border-radius: 50%;
        width: 64rpx;
        height: 64rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
