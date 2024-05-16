<template>
  <view v-if="detail" class="body">
    <div v-if="detail.list.status == 0" class="head-status color-fff">
      <view class="flex-y-center flex-x-center">
        <text class="iconfont icon-gift" style="font-size: 100rpx"></text>
        <view>
          <view>参加成功，等待开奖</view>
          <view class="m-t-10">{{ detail.list.time }}</view>
        </view>
      </view>
      <view class="font-center">您的幸运码为{{ detail.list.lucky_code }}</view>
    </div>

    <div v-else class="head-status color-fff">
      <template v-if="detail.list.status == 1">
        <view class="flex-y-center flex-x-center m-b-20">
          <image
            :src="wxapp_img.lottery.weizhongjiang"
            mode="aspectFill"
            style="width: 100rpx; height: 100rpx"
          ></image>
          <text class="font-30 m-l-20">很遗憾，您未中奖</text>
        </view>
      </template>
      <template v-if="detail.list.status == 3 || detail.list.status == 2">
        <view class="flex-y-center flex-x-center m-b-20">
          <image
            :src="wxapp_img.lottery.zhongjiang"
            mode="aspectFill"
            style="width: 100rpx; height: 100rpx"
          ></image>
          <text class="font-30 m-l-20">恭喜你，中奖啦！</text>
        </view>
        <view class="font-center m-b-20"
          >中奖号码为{{ detail.list.lucky_code }}</view
        >
      </template>

      <view
        @click="$utils.toUrl('/lottery/lucky-code/lucky-code?id=' + id)"
        class="font-center"
      >
        <text>查看我的幸运号码</text>
        <text class="iconfont icon-arrow-right"></text>
      </view>
    </div>

    <div class="page-content m-t-30">
      <div
        @click="
          $utils.toUrl('/lottery/goods/goods?id=' + detail.list.lottery.id)
        "
        class="goods flex"
      >
        <div class="left">
          <image :src="detail.list.gift.cover_pic" mode="aspectFill"></image>
        </div>
        <div class="right flex-w-1">
          <view class="u-line-2 m-b-10 goods-name">
            {{ detail.list.gift.name }}
          </view>
          <view class="m-b-10">共{{ detail.list.lottery.stock }}份</view>
          <view class="flex-x-sb flex-y-center">
            <view class="flex-w-1">
              <text class="price-color m-r-10">￥0</text>
              <text class="font-del"
                >原价￥{{ detail.list.gift.original_price }}</text
              >
            </view>
          </view>
        </div>
      </div>

      <!-- 邀请好友 -->
      <view
        v-if="detail.list.status == 0"
        @click="$utils.toUrl('/lottery/lucky-code/lucky-code?id=' + id)"
        class="p-30 flex-y-center"
        :style="{ background: '#fff7e7' }"
      >
        <view class="flex-w-1">
          <view class="m-b-10 color-999 font-26"
            >邀请好友参与，增加中奖概率哦！</view
          >
          <view class=""
            >已成功邀请<text class="price-color">{{
              detail.list.parent_num
            }}</text
            >位好友</view
          >
        </view>
        <view class="flex-y-center">
          <text>详情</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>

      <!-- 更多按钮 -->
      <div v-if="detail.list.status != 1" class="btns">
        <div @click="$utils.toUrl('/lottery/index/index')" class="btn">
          参与更多抽奖
        </div>
        <button
          v-if="detail.list.status == 0"
          open-type="share"
          class="button-initial btn"
        >
          邀请好友参与
        </button>

        <div @click="onDuihuan" v-else-if="detail.list.status == 2" class="btn">
          立即兑换
        </div>
        <div v-else-if="detail.list.status == 3" class="btn">已兑换</div>
      </div>

      <!-- 参与人数 -->
      <div v-if="detail.list.status == 0" class="user-list">
        <div class="p-y-20 m-t-30 border-t font-30 color-999 font-center">
          已有{{ detail.num }}人参与
        </div>
        <div class="img-box p-x-30">
          <image
            v-for="(item, i) in detail.user_list"
            :key="i"
            :src="item.user.avatar_url"
            mode="aspectFill"
          >
          </image>
        </div>
        <div class="p-y-20 font-30 color-999 font-center">
          仅显示最近参与30人
        </div>
      </div>

      <template v-if="detail.list.status != 0">
        <view class="zhongjiang">
          <div class="p-y-20 m-t-30 border-b font-30 color-999 font-center">
            已有{{ detail.num }}人参与{{ detail.list.pe_num || "" }}人中奖
          </div>
          <scroll-view @scrolltolower="loadData()" scroll-y class="user_list ">
            <div
              class="p-y-20 flex-y-center p-x-30"
              v-for="(item, i) in detail.user_list"
              :key="i"
            >
              <view class="flex-w-1 flex-y-center">
                <image
                  :src="item.user.avatar_url"
                  class="user-img"
                  mode="aspectFill"
                ></image>
                <text class="p-l-20 u-line-1 flex-w-1 font-30">
                  {{ item.user.nickname }}
                </text>
              </view>

              <view class="font-center m-l-20">
                <view class="">{{ item.lucky_code }}</view>
                <view class="">中奖幸运码</view>
              </view>
            </div>
            
            <u-loadmore :status="loadMore"></u-loadmore>
          </scroll-view>
        </view>
      </template>
    </div>

    <QOfficialAccount></QOfficialAccount>
  </view>
</template>
<script>
import share from "@/mixins/share.js";
export default {
  mixins: [share],
  data() {
    return {
      detail: "",
      user_list: [],
      id: 0,
      lottery_id: 0,
      loadMore: "loadmore",
      page_num: 1,
    };
  },
  onLoad(params) {
    // 通过订单传递参数
    params.id && (this.id = params.id);
    // 通过商品详情跳转传参
    params.lottery_id && (this.lottery_id = params.lottery_id);
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData(reset, fn) {
      if (reset) {
        this.page_num = 1;
        this.loadMore = "loadmore";
        this.user_list = [];
      }
      console.log(fn);
      if (this.loadMore == "nomore") return;
      const res = await this.$requestAll.lottery.detail({
        id: this.id,
        lottery_id: this.lottery_id,
        page_num: this.page_num,
        form_id: "",
      });
      this.detail = res.data;
      this.user_list.push(...res.data.user_list);
      this.loadMore = res.data.user_list.length < 5 ? "nomore" : "loadmore";
      this.page_num++;
      fn && fn();
    },
    onDuihuan() {
      let data = {
        goods_id: this.detail.list.goods_id,
        attr: JSON.parse(this.detail.list.attr),
        num: 1,
      };
      this.$utils.toUrl(
        "/pages/order-submit/order-submit" +
          uni.$u.queryParams({
            lottery_id: this.detail.list.id,
            goods_info: JSON.stringify(data),
          })
      );
    },
  },
  computed: {
    shareData() {
      return {
        title: "抽奖",
        path:
          "/lottery/goods/goods" +
          uni.$u.queryParams({
            id: this.detail && this.detail.list.lottery_id,
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
  onPullDownRefresh() {
    this.loadData(true, () => uni.stopPullDownRefresh());
  },
};
</script>
<style lang="scss" scoped>
.body {
  padding: 20rpx;
  background: #ff4544;
  min-height: 100vh;
}

.page-content {
  overflow: hidden;
  background: #fff;
  border-radius: 20rpx;

  .goods {
    padding: 20rpx;
    background: #fff;
    margin-bottom: 20rpx;

    .left {
      margin-right: 20rpx;
      position: relative;

      > image {
        width: 220rpx;
        height: 220rpx;
        border-radius: 10rpx;
      }

      .num {
        position: absolute;
        left: 0;
        top: 0;
        border-radius: 0 20rpx 20rpx 0;
        background: #ffe4e7;
        padding: 0 10rpx;
        color: red;
      }
    }

    .right {
      .goods-name {
        line-height: 38rpx;
        height: 114rpx;
      }

      .goods-bt {
        line-height: 1.8;
        border-radius: 25rpx;
        background: #ff4544;
        color: #ffffff;
        padding: 0 20rpx;
      }
    }
  }
}

.btns {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 20rpx 0;

  .btn {
    width: 300rpx;
    line-height: 70rpx;
    font-size: 30rpx;
    border-radius: 40rpx;
    text-align: center;

    &:nth-child(1) {
      border: 1px solid #ff4544;
      color: #ff4544;
    }

    &:nth-child(2) {
      background-color: #ff4544;
      color: #fff;
      border: 1px solid #ff4544;
    }
  }
}

.user-list {
  .img-box {
    margin: 0 auto;

    > image {
      width: 56rpx;
      height: 56rpx;
      margin-right: 10rpx;
      margin-bottom: 10rpx;

      &:nth-child(10n) {
        margin-right: 0;
      }
    }
  }
}

.zhongjiang {
  background: #f5f5f5;
  .user_list {
    max-height:520rpx;
    .user-img {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
    }
  }
}
</style>
