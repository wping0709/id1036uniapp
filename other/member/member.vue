<template>
  <view v-if="pageData" class="body">
    <view class="tops">
      <image :src="wxapp_img.huiyuan_bg" mode="aspectFill" />
      <view class="tops-content">
        <view class="user-info">
          <view class="flex-col flex-y-center flex-x-center">
            <image :src="pageData.user_info.avatar_url" mode="aspectFill" />
            <text>{{ pageData.user_info.nickname }}</text>
          </view>

          <view>{{ pageData.now_level.name }}</view>
        </view>

        <!-- 进度条 -->
        <view class="flex-y-center flex-col m-t-20">
          <view style="width: 60%"
            ><u-line-progress
              :percentage="pageData.order_money / pageData.s_money"
              :showText="false"
              activeColor="#eda200"
              height="8rpx"
            ></u-line-progress
          ></view>
          <text class="m-t-10">
            已消费{{ pageData.order_money }}元<template v-if="pageData.s_money"
              >，升级还需{{ pageData.s_money }}</template
            >
          </text>
        </view>
        <view class="balance flex-y-center flex-x-sb p-x-20">
          <view>账户余额 {{ pageData.money }}元</view>
          <view
            v-if="store.is_chongzhi == 1"
            @click="$utils.toUrl('/account-settings/recharge/recharge')"
            class="bt"
            >去充值</view
          >
        </view>
      </view>
    </view>

    <view class="equity flex-y-center bg-fff">
      <image :src="wxapp_img.icon_member_rights" mode="aspectFill" />
      <view class="m-l-10">我的会员权益</view>
    </view>
    <template v-if="store.buy_member && pageData.now_level.detail">
      <u-line color="#f5f5f5"></u-line>
      <view class="bg-ff p-20">{{ pageData.now_level.detail }}</view>
    </template>

    <view
      class="p-x-24"
      v-else-if="
        pageData.now_level.synopsis && pageData.now_level.synopsis.length
      "
    >
      <view
        class="flex m-t-20 border-b p-b-20"
        v-for="(item1, i1) in pageData.now_level.synopsis"
        :key="i1"
      >
        <view>
          <div class="flex-y-center">
            <image
              v-if="item1.pic"
              :src="item1.pic"
              style="height: 44rpx; width: 44rpx"
              mode="aspectFill"
            ></image>
            <text class="m-l-10 font-w-600">{{ item1.title }}</text>
          </div>
        </view>
        <view class="m-l-20 flex-w-1">{{ item1.content }}</view>
      </view>
    </view>

    <!-- 当前不是最高等级，还能购买会员等级 -->
    <view class="m-t-30" v-if="pageData.list.length">
      <swiper
        circular
        indicator-dots
        style="height: 384rpx"
        @change="swiperChange"
      >
        <swiper-item v-for="(item, i) in pageData.list" :key="i">
          <image
            :src="item.image"
            mode="aspectFit"
            style="width: 100%; height: 100%"
          />
        </swiper-item>
      </swiper>

      <!-- 需购买展示权益及按钮 -->
      <view
        v-if="pageData.list[current].price > 0 && store.buy_member"
        class="buy bg-fff flex-col flex-y-center"
      >
        <view @click="buySubmit(pageData.list[current])">
          ￥{{ pageData.list[current].price }} 去购买
        </view>
        <view class="font-center m-y-10">
          成为 {{ pageData.list[current].name }}，你将获得以下权益
        </view>
        <view class="font-center">{{ pageData.list[current].buy_prompt }}</view>
      </view>

      <view
        class="p-x-24"
        v-else-if="
          pageData.list[current].synopsis &&
          pageData.list[current].synopsis.length
        "
      >
        <view
          class="flex m-t-20 border-b p-b-20"
          v-for="(item1, i1) in pageData.list[current].synopsis"
          :key="i1"
        >
          <view>
            <div class="flex-y-center">
              <image
                v-if="item1.pic"
                :src="item1.pic"
                style="height: 44rpx; width: 44rpx"
                mode="aspectFill"
              ></image>
              <text class="m-l-10 font-w-600">{{ item1.title }}</text>
            </div>
          </view>
          <view class="m-l-20 flex-w-1">{{ item1.content }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import OrderPay from "@/mixins/OrderPay";
export default {
  mixins: [OrderPay],
  data() {
    return {
      pageData: "",
      current: 0,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.user.userMember({}, true);

      this.pageData = res.data;
    },
    swiperChange(e) {
      console.log(e);
      let {
        detail: { current },
      } = e;
      this.current = current;
    },
    buySubmit(item) {
      this.orderSubmit(
        {
          // level_id: this.pageData.list[this.current].id,
          level_id: item.id,
        },
        "hy"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100vh;
}
.tops {
  position: relative;
  height: 408rpx;
  text-align: center;
  color: #fff;
  > image {
    width: 100%;
    height: 100%;
  }
  .tops-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    width: 100%;
    .user-info {
      position: relative;
      margin-top: 40rpx;
      > view:nth-child(1) {
        > image {
          border-radius: 50%;
          width: 100rpx;
          height: 100rpx;
          margin-bottom: 20rpx;
        }
      }
      > view:nth-child(2) {
        position: absolute;
        right: 20rpx;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.4);
        font-size: 22rpx;
        padding: 5rpx 20rpx;
        border-radius: 20rpx;
      }
    }

    .balance {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100rpx;
      background: rgba(0, 0, 0, 0.4);
      font-size: 30rpx;
      .bt {
        padding: 6rpx 20rpx;
        border-radius: 26rpx;
        border: 2rpx solid #fff;
      }
    }
  }
}

.equity {
  padding: 0 20rpx;
  line-height: 80rpx;
  > image {
    width: 30rpx;
    height: 30rpx;
  }
}

.buy {
  padding: 0 50rpx;
  font-size: 28rpx;
  line-height: 40rpx;
  > view:nth-child(1) {
    margin-top: 20rpx;
    border-radius: 38rpx;
    border: 2rpx solid #f00;
    width: 520rpx;
    line-height: 76rpx;
    text-align: center;
    font-size: 32rpx;
    color: #f00;
  }
}
</style>
