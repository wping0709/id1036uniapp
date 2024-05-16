<template>
  <view v-if="pageData" class="body">
    <div class="list">
      <div
        @click="$utils.toUrl('/delivery/delivery_info_log/delivery_info_log')"
        v-for="(item, i) in pageData.list"
        :key="i"
        class="item"
      >
        <view class="flex-x-sb m-b-20">
          <view>{{ statusText(item.status) }}</view>
          <view>
            佣金
            <text class="price-color">￥{{ item.peisong_price }}</text>
          </view>
        </view>

        <!-- 订单配送信息 -->
        <div class="p-y-20 delivery-box flex-y-center">
          <view class="m-r-20"> </view>

          <view class="delivery-address flex-w-1 flex-col flex-x-sb">
            <view>
              <view class="font-600-34">{{ item.mch_info.name }}</view>
              <view class="font-24 m-t-10">{{ item.mch_info.address }}</view>
            </view>

            <view class="m-t-20">
              <div class="font-600-34">{{ item.user_info.name }}</div>
              <div class="font-24 m-t-10">{{ item.user_info.address }}</div>
              <view
                @click.stop="onMobile(item.user_info.service_tel)"
                class="font-24 flex-y-center"
              >
                <text class="price-color">
                  {{ item.user_info.service_tel }}
                </text>
                <text class="m-l-20 iconfont icon-dianhua font-40"></text>
              </view>
            </view>
          </view>
        </div>
      </div>

      <view>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </view>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
    };
  },
  onLoad(params) {
    this.getList();
  },
  onShow() {},
  methods: {
    async getList() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.user.getDeliveryList({
        status: 5,
        page: this.pageData.page,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    // 拨打电话
    onMobile(mobile) {
      uni.makePhoneCall({
        phoneNumber: mobile,
      });
    },
  },
  computed: {
    statusText() {
      return function (status) {
        switch (status - 0) {
          case 5:
            return '已送达';

          default:
            return '其他';
        }
      };
    },
  },
  watch: {},
  onReachBottom() {
    this.getList();
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .list {
    padding: 20rpx;
    .item {
      margin-bottom: 20rpx;
      padding: 20rpx;
      border-radius: 20rpx;
      background: #fff;
      .delivery-box {
        > view:nth-child(1) {
          position: relative;
          height: 200rpx;
          border-left: 4rpx dotted #666;

          &::before {
            content: '';
            position: absolute;
            left: -6rpx;
            top: 0%;
            transform: translate(-0%, -200%);
            width: 8rpx;
            height: 8rpx;
            background: #43bea8;
          }
          &::after {
            content: '';
            position: absolute;
            left: -6rpx;
            bottom: 0;
            transform: translate(-0%, 200%);
            width: 8rpx;
            height: 8rpx;
            background: #fa823c;
          }
        }
        .delivery-juli {
          height: 210rpx;
        }
        .delivery-address {
          min-height: 250rpx;
        }
      }
    }
  }
}
</style>
