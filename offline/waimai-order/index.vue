<template>
  <view class="body flex-col">
    <view class="bg-fff">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view
      @scrolltolower="scrolltolower"
      scroll-y
      class="content flex-h-1"
    >
      <view class="scroll-box" v-if="list.length">
        <div v-for="(order, i) in list" :key="i" class="order-item">
          <view class="flex-x-sb flex-y-center m-b-10">
            <view class="font-32">{{ order.mch.name }}</view>
            <view class="price-color">
              {{
                order.pay_type == 1
                  ? '线上支付'
                  : order.pay_type == 2
                  ? '货到付款'
                  : '余额支付'
              }}
            </view>
          </view>

          <view class="flex-x-sb border-b color-999 font-26">
            <text class="flex-w-1 u-line-1 price-color"
              >订单号：{{ order.order_no }}</text
            >
            <text>{{ order.addtime }}</text>
          </view>

          <view class="border-b p-b-20">
            <GoodsList
              :goodsList="order.goods_list ? order.goods_list : [order]"
            ></GoodsList>
          </view>

          <view class="total-box">
            <view class="flex-x-sb flex-y-center m-t-20">
              <view class=""> </view>
              <view class="m-l-10">
                共计商品{{ order.goods_list.length }}件 合计：￥{{
                  order.total_price
                }}
              </view>
            </view>
            <view class="m-t-20 flex-y-center">
              <view class="flex-w-1">
                配送方式：{{
                  order.is_dada > 0
                    ? '同城配送'
                    : order.is_offline == 1
                    ? '到店自提'
                    : '快递配送'
                }}
              </view>
              <view @click="onBeihuo(order)" class="beihuo-bt" v-if="!status"
                >备货</view
              >
            </view>
            <view class="m-t-20">
              <text>{{ order.name }}</text>
              <text class="m-l-10 color-999">{{ order.mobile }}</text>
            </view>

            <view v-if="order.content" @click.stop class="m-t-10 u-line-2">
              <text>备注：{{ order.content }}</text>
            </view>

          </view>
        </div>
        <u-loadmore :status="more"></u-loadmore>
      </view>
      <view class="scroll-box" v-else>
        <u-empty
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </view>
    </scroll-view>
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
      list1: [
        {
          name: '待发货',
        },
        {
          name: '待抢单',
        },
        {
          name: '待取货',
        },
        {
          name: '配送中',
        },
        {
          name: '已完成',
        },
      ],
      pageData: '',
      status: 0,
      list: [],
      page: 1,
      more: 'loadmore',
    };
  },
  onLoad(params) {
    console.log(params);
    this.status = parseInt(params.status || 0);
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.more == 'nomore') return;
      const res = await this.$requestAll.commander.waimaiOrder(
        {
          status: this.status,
          page: this.page,
        },
        true
      );
      this.list.push(...res.data.list);
      this.more =
        this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
      this.page++;
    },
    clickTab({ index }) {
      this.status = index;
      this.resetPageData();
      this.loadData();
    },
    scrolltolower() {
      this.page++;
      this.loadData();
    },
    resetPageData() {
      this.list = this.$options.data().list;
      this.page = this.$options.data().page;
      this.more = this.$options.data().more;
    },
    onBeihuo(item, i) {
      uni.showModal({
        title: '提示',
        content: '是否已确认备货？',
        showCancel: true,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            const res = await this.$requestAll.commander.beihuo(
              {
                order_id: item.order_id,
                order_type: 0,
              },
              true
            );

            uni.showModal({
              title: '提示',
              content: res.msg,
              showCancel: true,
              success: ({ confirm, cancel }) => {
                if (confirm) {
                  this.list.splice(i, 1);
                }
              },
            });
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
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  .scroll-box {
    padding-bottom: env(safe-area-inset-bottom);
    .order-item {
      margin: 20rpx 20rpx 0;
      padding: 20rpx;
      background: #fff;
      border-radius: 20rpx;
      .order-option-btn {
        line-height: 1.8;
        width: 100rpx;
        text-align: center;
        border-radius: 10rpx;
        border: 1px solid #999;
        margin-left: 20rpx;
      }
      .beihuo-bt {
        line-height: 1.4;
        padding: 0 10rpx;
        border-radius: 10rpx;
        border: 1px solid red;
        color: red;
      }
    }
  }
}
</style>
