<template>
  <view v-if="pageData" class="body">
    <u-swiper
      :list="pageData.detail.goods.goodsPicList"
      keyName="pic_url"
      @click="click"
      :interval="5000"
      height="750rpx"
      circular
      indicator
    ></u-swiper>

    <!-- 竞拍信息 -->
    <view
      class="price-info_box"
      :style="{
        background: pageData.detail.status == 0 ? '#07bdbf' : '#f24646',
      }"
    >
      <div v-if="pageData.detail.status == 1" class="price-style_1">
        <div class="price-style1_left">
          <view class="flex-x-sb">
            <view class="iconfont icon-V font-24"></view>
            <view class="m-r-10">出售中</view>
          </view>
          <view class="font-24">
            当前价：
            <text class="font-32 font-w-700">
              <!-- 当前价没有就显示底价 -->
              ￥{{
                pageData.detail.current_bid || pageData.detail.auction_price
              }}
            </text>
          </view>
        </div>
        <div class="price-style1_right color-666">
          <view class="font-24">距结拍还剩</view>
          <view>
            <u-count-down
              :time="pageData.detail.end_time * 1000 - new Date().getTime()"
              format="DD天HH时mm分ss秒"
            ></u-count-down>
          </view>
        </div>
      </div>
      <div v-else-if="pageData.detail.status == 0" class="price-style_2">
        <div class="price-style1_left">
          <view class="flex-x-sb">
            <view class="iconfont icon-V font-24"></view>
            <view class="m-r-10">预售中</view>
          </view>
          <view class="font-24">
            底价：
            <text class="font-32 font-w-700"
              >￥{{ pageData.detail.current_bid || pageData.detail.auction_price }}</text
            >
          </view>
        </div>
        <div class="price-style1_right color-666">
          <view class="font-24">距开拍还剩</view>
          <view>
            <u-count-down
              :time="pageData.detail.start_time * 1000 - new Date().getTime()"
              format="DD天HH时mm分ss秒"
            ></u-count-down>
          </view>
        </div>
      </div>
    </view>

    <!-- 商品信息 -->
    <div class="goods-msg flex-y-center p-20 bg-fff m-b-20">
      <view class="flex-w-1">
        {{ pageData.detail.name }}
      </view>

      <view @click="swtichBoolean('showShare')" class="font-center color-666">
        <i class="iconfont icon-share font-40"></i>
        <view class="font-24">分享</view>
      </view>
    </div>

    <view
      @click="swtichBoolean('showRule')"
      class="menu-item border-b p-20 bg-fff"
    >
      <div class="label">规则</div>
      <div class="content">
        底价/￥{{ pageData.detail.current_bid || pageData.detail.auction_price }}，加价幅度/￥{{
          pageData.detail.auction_range
        }}，保证金/￥{{ pageData.detail.support }}
      </div>
    </view>
    <div class="menu-item p-20 bg-fff m-b-20">
      <div class="label">类型</div>
      <div class="content">
        类型/{{
          pageData.detail.auction_type == 0
            ? '普通'
            : pageData.detail.auction_type == 1
            ? '直播'
            : pageData.detail.auction_type == 2
            ? '拍卖专场'
            : pageData.detail.auction_type == 3
            ? '0元抢拍'
            : '拍卖行'
        }}
      </div>
    </div>

    <!-- 出价记录 -->
    <div v-if="pageData.detail.status != 0" class="record p-20 m-b-20">
      <div class="flex-y-center flex-x-sb">
        <text class="font-600-32">出价记录</text>
        <text class="font-24 color-999">{{ pageData.bid_list.count }}条</text>
      </div>
      <view v-if="pageData.bid_list.list.length" class="record-list">
        <div
          v-for="(item, index) in pageData.bid_list.list.slice(0, 4)"
          :key="index"
          :class="['record-item flex-y-center', !index && 'font-w-700']"
        >
          <view style="width: 10%">{{ index + 1 }}</view>
          <view style="width: 20%">{{ item.nickname }}</view>
          <view style="width: 20%">{{ !index ? '领先' : '被超越' }}</view>
          <view style="width: 30%">{{ item.create_time }}</view>
          <view style="width: 20%">￥{{ item.bid }}</view>
        </div>
      </view>
      <view v-else>
        <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
      </view>
    </div>

    <div v-if="pageData.mch.mch_id" class="mch-box">
      <div class="mch-left flex-w-1 flex-y-center">
        <image :src="pageData.mch.logo" class="mch-url" mode="" />
        <view>
          <view class="font-600-30">{{ pageData.mch.name }}</view>
          <!-- <view>{{ pageData.mch.name }}</view> -->
        </view>
      </div>
      <div class="mch-right" @click="switchFollow">
        {{ pageData.mch.is_follow ? '已关注' : '关注' }}
      </div>
    </div>

    <div class="bg-fff">
      <u-parse :content="goods.goods_detial"></u-parse>
    </div>

    <div v-if="pageData.detail.status != 0" class="bottom-fixed">
      <div class="fixed">
        <div class="btns flex-grow-0 flex-y-center">
          <view
            @click="swtichBoolean('showTaolun')"
            class="font-24 p-x-20 flex-col flex-x-center flex-y-center"
          >
            <text class="iconfont icon-jurassic_bbs font-40"></text>
            <text>讨论</text>
          </view>
          <view
            @click="clickWarn"
            class="font-24 p-x-20 flex-col flex-x-center flex-y-center"
          >
            <text class="iconfont icon-tixing font-40"></text>
            <text>提醒</text>
          </view>
        </div>
        <div class="flex-grow-1">
          <div @click="onChujia" class="submit">立即出价</div>
        </div>
      </div>
    </div>

    <u-popup
      :show="showRule"
      :safeAreaInsetBottom="true"
      closeable
      round="20rpx"
      @close="swtichBoolean('showRule')"
    >
      <view style="line-height: 100rpx" class="font-center font-600-32">
        竞价规则
      </view>
      <scroll-view scroll-y class="p-x-20" style="max-height: 50vh">
        <view class="font-w-700 p-y-10">底价</view>
        <view class="p-y-10 color-666">{{
          pageData.detail.auction_price
        }}</view>
        <view class="font-w-700 p-y-10">起价幅度</view>
        <view class="p-y-10 color-666">{{
          pageData.detail.auction_range
        }}</view>
        <view class="font-w-700 p-y-10">保证金</view>
        <view class="p-y-10 color-666">{{ pageData.detail.support }}</view>
        <view class="font-w-700 p-y-10">类型</view>
        <view class="p-y-10 color-666">{{
          pageData.detail.auction_type == 0
            ? '普通'
            : pageData.detail.auction_type == 1
            ? '直播'
            : pageData.detail.auction_type == 2
            ? '拍卖专场'
            : pageData.detail.auction_type == 3
            ? '0元抢拍'
            : '拍卖行'
        }}</view>
      </scroll-view>
    </u-popup>

    <u-popup
      :show="showTaolun"
      :safeAreaInsetBottom="true"
      closeable
      round="20rpx"
      @close="swtichBoolean('showTaolun')"
    >
      <view style="line-height: 100rpx" class="font-center font-600-32">
        竞价讨论
      </view>
      <scroll-view scroll-y style="max-height: 45vh">
        <div class="taolun">
          <view
            v-for="(item, index) in commentList"
            :key="index"
            class="taolun-item p-x-20 m-b-20 flex"
          >
            <image
              :src="item.avatar_url"
              mode="aspectFill"
              style="width: 60rpx; height: 60rpx; border-radius: 50%"
            ></image>
            <view class="comment-content flex-w-1 flex">
              <view class="flex-grow-1 m-l-20">
                <view class="">{{ item.nickname }}</view>
                <view class="m-t-20">{{ item.content }}</view>
              </view>
              <view class="flex-grow-0 color-666 m-l-20">{{
                item.create_time
              }}</view>
            </view>
          </view>
        </div>
      </scroll-view>

      <view class="p-20">
        <u-search
          searchIcon=" "
          placeholder="参与讨论"
          v-model="comment"
          actionText="发送"
          @custom="taolunConfirm"
          @search="taolunConfirm"
        >
        </u-search>
      </view>
    </u-popup>

    <u-popup
      :show="showPrice"
      :safeAreaInsetBottom="true"
      closeable
      round="20rpx"
      @close="swtichBoolean('showPrice')"
    >
      <view style="line-height: 100rpx" class="font-center font-600-32">
        出价
      </view>
      <view class="font-700 p-20">当前出价人</view>
      <scroll-view scroll-y style="max-height: 40vh">
        <view
          v-if="pageData.bid_list && pageData.bid_list.list.length"
          class="record-list"
        >
          <div
            v-for="(item, index) in pageData.bid_list.list"
            :key="index"
            :class="['record-item flex-y-center', !index && 'font-w-700']"
          >
            <view style="width: 10%">{{ index + 1 }}</view>
            <view style="width: 20%">{{ item.nickname }}</view>
            <view style="width: 20%">{{ !index ? '领先' : '被超越' }}</view>
            <view style="width: 30%">{{ item.create_time }}</view>
            <view style="width: 20%">￥{{ item.bid }}</view>
          </div>
        </view>
        <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
      </scroll-view>
      <view class="font-700 p-20">出价金额</view>

      <view class="flex-y-center flex-x-center">
        <u-number-box
          v-model="auction_price"
          :min="pageData.detail.current_bid || pageData.detail.auction_price"
          :step="pageData.detail.auction_range"
          disabledInput
        >
          <view slot="minus" class="minus flex-y-center flex-x-center">
            <u-icon name="minus" color="#FFFFFF" size="36rpx"></u-icon>
          </view>

          <text
            slot="input"
            style="width: 40vw; text-align: center"
            class="input"
            >{{ auction_price }}</text
          >
          <view slot="plus" class="plus flex-y-center flex-x-center">
            <u-icon name="plus" color="#FFFFFF" size="36rpx"></u-icon>
          </view>
        </u-number-box>
      </view>

      <view @click="priceConfirm" class="m-20 price-bt"> 立即出价 </view>
    </u-popup>

    <u-popup
      :show="showSupport"
      :safeAreaInsetBottom="false"
      closeable
      round="20rpx"
      @close="swtichBoolean('showSupport')"
      mode="center"
    >
      <view style="width: 80vw; padding: 20rpx">
        <view class="p-y-20 font-center font-600-32"
          >参拍保证金{{ pageData.detail.support }}元</view
        >
        <view class="font-center color-999 p-y-20">《保证金规则》</view>
        <div class="support-btns">
          <div class="btn" @click="swtichBoolean('showSupport')">知道啦</div>
          <div class="btn" @click="supportCofirm">立即支付</div>
        </div>
      </view>
    </u-popup>

    <Share :showPopup.sync="showShare" :data="id" type="auction"></Share>
  </view>
</template>
<script>
import Share from '@/components/share/share';
export default {
  components: {
    Share,
  },
  data() {
    return {
      id: '',
      pageData: '',
      goods: '',
      showShare: false,
      showRule: false,
      showTaolun: false,
      showSupport: false,
      showPrice: false,
      comment: '',
      commentList: [],
      auction_price: '',
    };
  },
  onLoad(params) {
    this.id = params.id;
    
  },
  onShow() {
    this.getGoodsDetail();
    this.getDetail();
  },
  methods: {
    async getGoodsDetail() {
      const res = await this.$requestAll.auction.goodsDetial(
        {
          auction_id: this.id,
        },
        true
      );
      this.goods = res.data;
    },
    async getDetail() {
      const res = await this.$requestAll.auction.detail(
        {
          auction_id: this.id,
        },
        true
      );
      this.pageData = res.data;
      this.auction_price = res.data.detail.current_bid;
      uni.setNavigationBarTitle({ title: res.data.detail.name });
    },
    async getCommentList() {
      const { data } = await this.$requestAll.auction.bidDiscuss({
        auction_id: this.id,
      });
      this.commentList = data;
    },
    async swtichBoolean(key) {
      if (key == 'showTaolun' && !this.showTaolun) {
        await this.getCommentList();
      }
      // 当前分享线上未作，当前且先不做
      else if (key == 'showShare') {
        return;
      }
      this[key] = !this[key];
    },
    async clickWarn() {
      console.log(this.pageData.detail.status);
      const res = await this.$requestAll.auction.warn(
        {
          auction_id: this.id,
          status: Number(!this.pageData.detail.is_warn),
        },
        true
      );
      uni.showModal({
        title: res.msg,
        content: '',
        showCancel: false,
        success: () => {
          this.getDetail();
        },
      });
    },
    async taolunConfirm() {
      const res = await this.$requestAll.auction.publishComment(
        {
          auction_id: this.id,
          comment: this.comment,
        },
        true
      );
      this.comment = '';
      this.getCommentList();
    },
    async onChujia() {
      const res = await this.$requestAll.auction
        .supportStatus({
          auction_id: this.id,
        })
        .catch(error => error);
      // 判断是否支付定金
      if (res.data.is_support && !res.data.is_pay) {
        this.showSupport = true;
        return;
      }
      // 显示出价弹框
      this.showPrice = true;
    },
    async supportCofirm() {
      const res1 = await this.$requestAll.auction.paySupport(
        { order_id: this.id },
        true
      );
      this.showSupport = false;

      this.$utils.toUrl(
        '/pages/pay/pay' +
          uni.$u.queryParams({
            order_id: res1.data.order_id,
            order_type: 12,
          })
      );
    },
    async priceConfirm() {
      const res = await this.$requestAll.auction.startbid({
        auction_id: this.id,
        bid: this.auction_price,
      });
      uni.$u.toast(res.msg);
      setTimeout(() => {
        this.getDetail();
      }, 1000);
    },
    async switchFollow() {
      const res = await this.$requestAll.auction.follow(
        {
          mch_id: this.pageData.mch.mch_id,
          status: Number(!this.pageData.mch.is_follow),
        },
        true
      );
      this.pageData.mch.is_follow = Number(!this.pageData.mch.is_follow);
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;

  .price-info_box {
    // display: flex;
    // align-items: center;
    // justify-content: space-between;
    background: #f24646;
    height: 100rpx;

    .price-style_1,
    .price-style_2 {
      padding-left: 30rpx;
      display: flex;
      justify-content: space-between;

      .price-style1_left {
        color: #fff;

        > view:nth-child(1) {
          display: flex;
          align-items: center;
          height: 32rpx;
          background: #ffecec;
          border-radius: 4rpx;
          padding: 0 2rpx;
          margin-top: 16rpx;
          width: 114rpx;
          font-size: 22rpx;
          color: red;
        }
      }

      .price-style1_right {
        padding: 0 50rpx;
        background: #efc290;
        border-radius: 50rpx 0 0 50rpx;
        height: 100rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }
    }

    .price-style_2 {
      .price-style1_left {
        > view:nth-child(1) {
          color: #07bdbf;
        }
      }

      .price-style1_right {
        background: #d4ffff;
      }
    }
  }

  .border-b {
    border-bottom: 1px solid #f5f5f5;
  }

  .menu-item {
    display: flex;
    align-items: center;
    height: 100rpx;
    line-height: 100rpx;

    .label {
      font-weight: 700;
      margin-right: 30rpx;
    }

    .content {
      color: #666;
      font-size: 24rpx;
    }
  }

  .record {
    background: #fff;
  }
  .record-list {
    .record-item {
      font-size: 24rpx;
      line-height: 80rpx;
      text-align: center;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
    }
  }

  .bottom-fixed {
    box-sizing: content-box;
    height: 100rpx;
    padding-bottom: env(safe-area-inset-bottom);

    .fixed {
      background: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      box-sizing: content-box;
      padding: 0 20rpx;

      height: 100rpx;
      padding-bottom: env(safe-area-inset-bottom);
      display: flex;
      align-items: center;

      > .flex-grow-1 {
        margin-left: 40rpx;

        .submit {
          width: 100%;
          line-height: 80rpx;
          border-radius: 40rpx;
          background: #f24646;
          text-align: center;
          font-size: 32rpx;
          color: #fff;
          font-weight: 700;
        }
      }
    }
  }

  .taolun {
    .taolun-item {
    }
  }

  .support-btns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20rpx 0;
    .btn {
      width: 40%;
      line-height: 60rpx;
      text-align: center;
      border: 1px solid #f24646;
      color: #f24646;
      border-radius: 30rpx;
      &:nth-child(2) {
        margin-left: 10%;
        color: #fff;
        background: #f24646;
      }
    }
  }

  .price-bt {
    font-size: 32rpx;
    font-weight: 700;
    text-align: center;
    line-height: 80rpx;
    background: #f24646;
    color: #fff;
    border-radius: 40rpx;
  }
}

.mch-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  margin-bottom: 20rpx;
  margin-top: 20rpx;
  background: #fff;
  .mch-left {
    display: flex;
    .mch-url {
      margin-right: 10rpx;
      border-radius: 50%;
      width: 80rpx;
      height: 80rpx;
    }
  }
  .mch-right {
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    width: 120rpx;
    border-radius: 10rpx;
    background: red;
    color: #fff;
  }
}

.minus {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 50%;
  background: #5e5e5e;
}
.plus {
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  border-radius: 50%;
  background: #efc290;
}
</style>
