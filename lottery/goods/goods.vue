<template>
  <view v-if="pageData" class="body">
    <!-- swiper -->
    <view class="swiper-box">
      <u-swiper
        :list="pageData.goods.pic_list"
        keyName="pic_url"
        radius="0"
        indicatorMode="dot"
        indicator
        circular
        height="375"
        :autoplay="false"
        indicatorActiveColor="#ff5c5c"
        indicatorInactiveColor="#f5f5f5"
      >
      </u-swiper>
    </view>

    <!-- 商品信息 -->
    <div class="goods-msg p-x-20 bg-fff m-b-20">
      <div class="goods-name font-32 u-line-3">
        {{ pageData.goods.name }}
      </div>

      <div class="num-price-share flex-y-center p-y-10">
        <div class="left flex-w-1 font-30">
          <view class="color-999">
            共
            <text class="price-color">{{ pageData.lottery_info.stock }}</text>
            份
            <text class="m-l-30">{{ pageData.goods.num }}人参与</text>
          </view>
          <view>
            <text class="price-color">￥{{ 0 }}</text>
            <text class="m-l-30 font-del color-999"
              >售价￥{{ pageData.goods.original_price }}</text
            >
          </view>
        </div>
        <div
          @click="showShare = true"
          class="right flex-col flex-y-center color-999"
        >
          <text
            class="iconfont icon-share font-50"
            style="width: 50rpx; line-height: 50rpx; text-align: center"
          ></text>
          <text class="font-20">分享</text>
        </div>
      </div>
    </div>

    <!-- 抽奖流程 -->
    <div class="lottery-liucheng bg-fff m-b-20">
      <div class="font-32 flex-y-center flex-x-sb p-20 border-b">
        <text>抽奖流程</text>
        <text class="iconfont icon-arrow-right"></text>
      </div>
      <view class="content">
        <div class="item">
          <view>1</view>
          <view>
            <view>参与</view>
            <view>抽奖</view>
          </view>
        </div>
        <div class="item">
          <view>2</view>
          <view>
            <view>等待</view>
            <view>开奖</view>
          </view>
        </div>
        <div class="item">
          <view>3</view>
          <view>
            <view>幸运</view>
            <view>中奖</view>
          </view>
        </div>
        <div class="item">
          <view>4</view>
          <view>
            <view>下单</view>
            <view>收礼</view>
          </view>
        </div>
      </view>
    </div>

    <!-- 实时幸运码 -->
    <div class="lucky-code p-x-20 m-b-20 bg-fff">
      <div class="title font-32 p-y-20">实时幸运码</div>
      <div class="title-tip font-22 color-999">
        邀请好友参与，额外获赠幸运码，提高中奖概率哦！
      </div>

      <div class="wrap">
        <!-- 两个数据时为了无线滚动 动画时间根据数量长度做动态-->
        <view
          v-for="it in 2"
          :key="it"
          :class="pageData.lucky_list.length > 3 && 'gundong-style'"
          :style="{
            animationDuration: pageData.lucky_list.length / 0.4 + 's',
          }"
          class="content"
        >
          <div
            class="item flex-y-center"
            v-for="(item, i) in pageData.lucky_list"
            :key="i"
          >
            <image :src="item.user.avatar_url" mode="aspectFill" />
            <view class="m-x-20 flex-w-1">{{ item.user.nickname }}</view>
            <view>{{ item.lucky_num }}个幸运码</view>
          </div>
        </view>
      </div>
    </div>

    <!-- 商品详情 -->
    <view class="goods-detail bg-fff">
      <div class="font-32 p-20">商品详情</div>
      <div>
        <u-parse
          :content="pageData.goods.detail"
          :lazyLoad="true"
          :tagStyle="{
            image: 'vertical-align: middle;',
            img: 'vertical-align: middle;',
          }"
        ></u-parse>
      </div>
    </view>

    <div class="pay-button">
      <view>
        <div @click="onPay" class="btn">直接购买</div>
        <template v-if="pageData.goods.is_ing">
          <div
            @click="onLottery"
            :style="{ background: !pageData.goods.status && '#999' }"
            class="btn"
          >
            {{ !pageData.goods.status ? "已参与" : "立即抽奖" }}
          </div>
        </template>
        <div v-else :style="{ background: '#999' }" class="btn" >暂未开始</div>
      </view>
    </div>

    <Share
      :showPopup.sync="showShare"
      type="lottery"
      :data="{ id: id }"
    ></Share>

    <view
      @click="$utils.toUrl('/lottery/index/index', 'redirectTo')"
      class="lottery-home"
    >
      <text class="iconfont icon-arrow-left"></text>
      返回抽奖会场
    </view>

    <div v-if="showPopup" @click="onLottery" class="show-popup">
      <image :src="wxapp_img.lottery.lottery_box" mode="widthFix" />
    </div>
    <ToHomeButton></ToHomeButton>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import ToHomeButton from "@/components/ToHomeButton";
import Share from "@/components/share/share.vue";
import share from "@/mixins/share";
export default {
  mixins: [share],
  components: {
    ToHomeButton,
    Share,
  },
  data() {
    return {
      pageData: "",
      id: "",
      showShare: false,
      showPopup: false,
    };
  },
  onLoad(params) {
    if (params.scene) {
      params = this.$utils.wxParams(params);
    }
    this.id = params.id || params.gid || "";
    if (params.user_id || params.uid) {
      this.bindingChildren();
    }
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.lottery.goods(
        {
          id: this.id,
        },
        true
      );
      this.pageData = res.data;
      this.pageData.lucky_list = res.data.lucky_list.splice(0, 5);
    },
    async bindingChildren() {
      await this.$requestAll.lottery.clerk({
        user_id: this.parent_id,
        lottery_id: this.id,
      });
      this.showPopup = true;
    },
    onPay() {
      var mch_list = [
        {
          mch_id: 0,
          goods_list: [
            {
              goods_id: this.pageData.goods.id,
              num: 1,
              attr: JSON.parse(this.pageData.lottery_info.attr),
            },
          ],
        },
      ];

      this.$utils.toUrl(
        "/pages/order-submit/order-submit?mch_list=" + JSON.stringify(mch_list)
      );
    },
    async onLottery() {
      if (!this.pageData.goods.status) return uni.$u.toast("您已参与当前抽奖");

      await this.$utils.bindMessage(this.pageData.lottery_success_notice)
      console.log("抽奖去");
      this.showPopup = false;
      this.$utils.toUrl(
        "/lottery/detail/detail?lottery_id=" + this.pageData.lottery_info.id
      );
    },
  },
  computed: {
    shareData() {
      return {
        title: (this.pageData && this.pageData.goods.name) || "",
        path:
          "/lottery/goods/goods" +
          uni.$u.queryParams({
            id: this.id,
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}

.lottery-liucheng {
  .content {
    padding: 20rpx 0;
    padding-right: 20rpx;
    display: flex;
    justify-content: space-around;

    .item {
      display: flex;
      align-items: center;
      font-size: 30rpx;

      > view:nth-child(1) {
        margin-right: 20rpx;
        font-size: 70rpx;
        // width: ;
        font-weight: 500;
        color: #cacaca;
      }
    }
  }
}

.lucky-code {
  .wrap {
    height: 240rpx;
    overflow: hidden;
    .content {
      .item {
        height: 80rpx;
        > image {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
        }
      }
    }
    .gundong-style {
      // 无线滚动数据
      animation: scroll-top 3s linear infinite;
      // animation-duration: 3s!important;
      @keyframes scroll-top {
        0% {
          transform: translateY(0);
        }

        100% {
          transform: translateY(-100%);
        }
      }
    }
  }
}

.pay-button {
  box-sizing: content-box;
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  > view {
    box-sizing: content-box;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: env(safe-area-inset-bottom);

    display: flex;
    align-items: center;
    background: #fff;
    .btn {
      flex: 1;
      width: 0;
      height: 100rpx;
      line-height: 100rpx;
      font-size: 32rpx;
      text-align: center;
      &:nth-child(1) {
        background: #fff5f5;
        color: red;
      }
      &:nth-child(2) {
        background: #ff4544;
        color: #fff;
      }
    }
  }
}

.lottery-home {
  position: fixed;
  left: 0;
  bottom: 150rpx;
  bottom: calc(150rpx + env(safe-area-inset-bottom));
  padding-right: 20rpx;
  background: #ff4544;
  color: #fff;
  border-radius: 0 20rpx 20rpx 0;
  font-size: 26rpx;

  display: flex;
  align-items: center;
}

.show-popup {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba($color: #000000, $alpha: 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  image {
    width: 360rpx;
    animation: siazeChange 1.2s linear infinite;
  }

  @keyframes siazeChange {
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
}
</style>
