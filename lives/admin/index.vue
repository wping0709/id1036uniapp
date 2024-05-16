<template>
  <view v-if="pageData" class="body">
    <div class="head">
      <image
        class="head-bg"
        :src="wxapp_img.anchor_admin_index_head_bg"
        mode=""
      />
      <div class="head-content">
        <div class="user-box flex-y-center">
          <image :src="pageData.avatar_url" mode="" />
          <view>
            <view class="font-w-600 font-32">{{ pageData.user_nickname }}</view>
            <view class="anchor-tisp flex-y-center"
              >{{ pageData.anchor_cat }}主播<text
                class="iconfont icon-arrow-right"
                style="margin-top: 4rpx"
              ></text
            ></view>
          </view>
        </div>

        <div class="num-box">
          <view class="font-center">
            <text class="font-600-36 m-r-10">{{
              pageData.follow_num > 0 ? pageData.follow_num : 0
            }}</text
            >关注
          </view>
          <view class="font-center">
            <text class="font-600-36 m-r-10">{{ pageData.good_num || 0 }}</text
            >获赞
          </view>
          <view class="font-center">
            <text class="font-600-36 m-r-10">{{ pageData.look_num || 0 }}</text
            >人观看
          </view>
        </div>
      </div>
    </div>

    <div class="menu-price flex">
      <view class="flex-col flex-y-center flex-x-center">
        <view>
          <text class="font-600-36">{{ pageData.order.order_count }}</text>
          个
        </view>
        <view class="m-t-10">订单</view>
      </view>
      <view class="flex-col flex-y-center flex-x-center">
        <view>
          <text class="font-600-36">{{ pageData.order.price || '0.00' }}</text>
          元
        </view>
        <view class="m-t-10">销售额</view>
      </view>
      <view class="flex-col flex-y-center flex-x-center">
        <view>
          <text class="font-600-36">{{ pageData.live_price }}</text>
          元
        </view>
        <view class="m-t-10">佣金</view>
      </view>
    </div>

    <div class="menu-box">
      <div class="menu-title">我的</div>
      <div class="menu-list">
        <view
          @click="$utils.toUrl(item.url + '?anchor_id=' + pageData.id)"
          v-for="item in my"
          :key="item.url"
          class="flex-col flex-x-center flex-y-center"
        >
          <image :src="item.img" mode="" />
          <view>{{ item.name }}</view>
        </view>
      </div>
    </div>

    <div class="menu-box">
      <div class="menu-title">更多</div>
      <div class="menu-list">
        <view
          @click="
            $utils.toUrl('/pages/cash/cash?type=live&anchor_id=' + pageData.id)
          "
          class="flex-col flex-x-center flex-y-center"
        >
          <image :src="wxapp_img.anchor_more_tixian" mode="aspectFilt" />
          <view>提现申请</view>
        </view>
        <view
          @click="
            $utils.toUrl(
              '/pages/cash-detail/cash-detail?type=live&anchor_id=' +
                pageData.id
            )
          "
          class="flex-col flex-x-center flex-y-center"
        >
          <image :src="wxapp_img.anchor_my_detail" mode="aspectFilt" />
          <view>提现明细</view>
        </view>
      </div>
    </div>

    <div @click="$utils.toUrl('/lives/room/found')" class="start-live">
      <image :src="wxapp_img.start_live" mode="" />
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.lives.getAnchorInfo({},true);
      this.pageData = res.data;
    },
  },
  onShow() {},
  computed: {
    my() {
      if (this.wxapp_img) {
        return [
          {
            img: this.wxapp_img.anchor_my_order,
            name: '订单列表',
            url: '/lives/admin/order-list/order-list',
          },
          {
            img: this.wxapp_img.anchor_my_goods,
            name: '商品列表',
            url: '/lives/admin/goods-list/goods-list',
          },
          {
            img: this.wxapp_img.anchor_my_detail,
            name: '分销明细',
            url: '/lives/admin/share-list/share-list',
          },
          {
            img: this.wxapp_img.anchor_my_live,
            name: '直播记录',
            url: '/lives/admin/live-log/live-log',
          },
        ];
      } else {
        return [];
      }
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .head {
    position: relative;

    .head-bg {
      display: block;
      width: 100%;
      height: 312rpx;
    }
    .head-content {
      position: absolute;
      top: 0;
      left: 0;
      padding: 30rpx;
      width: 100%;
      height: 100%;
      .user-box {
        color: #fff;
        > image {
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
          margin-right: 20rpx;
        }
        .anchor-tisp {
          margin-top: 10rpx;
          padding: 0 10rpx;
          background: rgba($color: #fff, $alpha: 0.8);
          border-radius: 20rpx;
          font-size: 22rpx;
          color: #fb2020;
        }
      }
      .num-box {
        margin-top: 40rpx;
        display: flex;
        align-items: center;
        color: #fff;
        font-size: 26rpx;
        > view {
          flex: 1;
        }
      }
    }
  }

  .menu-price {
    position: relative;
    z-index: 9;
    background: #fff;
    margin: -40rpx 20rpx 20rpx;
    border-radius: 20rpx;
    > view {
      flex: 1;
      width: 0;
      height: 140rpx;
      font-size: 24rpx;
      &:nth-child(2) {
        border: 2rpx solid #eee;
        border-top: 0;
        border-bottom: 0;
      }
    }
  }

  .menu-box {
    margin: 20rpx;
    border-radius: 20rpx;
    background: #fff;
    .menu-title {
      line-height: 80rpx;
      padding: 0 30rpx;
      border-bottom: 2rpx solid #eee;
    }
    .menu-list {
      display: flex;
      > view {
        flex: 1;
        width: 0;
        padding: 20rpx 0;
        > image {
          width: 50rpx;
          height: 50rpx;
          margin-bottom: 10rpx;
          font-size: 24rpx;
        }
      }
    }
  }

  .start-live {
    position: fixed;
    bottom: 30rpx;
    bottom: calc(30rpx + env(safe-area-inset-bottom));
    right: 30rpx;
    > image {
      width: 120rpx;
      height: 120rpx;
    }
  }
}
</style>
