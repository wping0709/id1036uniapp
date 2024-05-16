<template>
  <view class="list">
    <view
      class="item"
      @click="navToDetail(item)"
      v-for="(item, index) in list"
      :key="index"
    >
      <view class="status-box flex-y-center flex-x-sb">
        <view>
          订单号：
          {{ item.order_no }}
        </view>
        <view>
          {{ item.addtime }}
        </view>
      </view>

      <view
        class="goods flex-x-sb"
        v-for="(good, i) in item.goods_list"
        :key="i"
      >
        <image :src="good.goods_pic" mode="" />
        <view class="flex-w-1">
          <view class="u-line-2">{{ good.goods_name }}</view>
          <view class="u-line-1 color-999 m-y-10 font-24">
            <text v-for="(attr, i2) in good.attr_list" :key="i2">
              <text>{{ attr.attr_group_name }}:</text>
              <text>{{ attr.attr_name }}</text>
              <text v-if="i2 < good.attr_list.length - 1" class="p-x-10"
                >|</text
              >
            </text>
          </view>
          <view class="flex-x-sb flex-y-center">
            <text class="color-999 font-24">X{{good.num || 1}}</text>
            <text>￥{{ good.price }}</text>
          </view>
        </view>
      </view>

      <view @click.stop class="total flex-x-sb flex-y-center">
        <view>
          <!-- <text>合计：</text>
          <text class="price-color">￥{{ item.pay_price }}</text> -->

          <template v-if="item.is_agree">
            <template v-if="item.refund_type == 1">
              退货退款：<span style="color: #ff4544"
                >￥{{ item.refund_price }}</span
              >
            </template>
            <template v-if="item.refund_type == 2"> 换货 </template>
          </template>
          <template v-else>合计：￥{{ item.pay_price }}</template>
        </view>
        <view class="bts flex">
          <!-- 售后 -->
          <template v-if="item.is_agree">
            <view class="border0" v-if="item.refund_status == 0">
              <template v-if="item.refund_type == 1">
                <template v-if="item.is_agree == 0">等待处理</template>
                <template v-else>
                  <template v-if="item.is_user_send == 0">待买家发货</template>
                  <template v-else>等卖家待处理</template>
                </template>
              </template>
              <template v-else>等卖家待处理</template>
            </view>
            <view
              class="border0"
              style="color: #36ba75"
              v-if="item.refund_status == 1"
            >
              已同意并退款
            </view>
            <view
              class="border0"
              style="color: #36ba75"
              v-if="item.refund_status == 2"
            >
              已同意换货
            </view>
            <view
              class="border0"
              style="color: #ff4544"
              v-if="item.refund_status == 3"
            >
              <template v-if="item.refund_type == 1">已拒绝退货退款</template>
              <template v-if="item.refund_type == 2">已拒绝换货</template>
            </view>
          </template>

          <!-- 非售后 -->
          <template v-else>
            <!-- 未发货 -->
            <template v-if="item.is_send == 0">
              <text v-if="item.apply_delete == 1">{{
                item.is_cancel ? '已取消' : '退款申请中'
              }}</text>
              <text v-else>
                {{ item.is_cancel ? '已取消' : '' }}
              </text>

              <template v-if="item.is_pay == 0 && item.is_cancel == 0">
                <view @click="clickCancel(item)"> 取消 </view>
                <view
                  @click="
                    $utils.toUrl(
                      '/pages/pay/pay?order_type=1&order_id=' + item.order_id
                    )
                  "
                  v-if="item.pay_type != 2"
                  >付款</view
                >
              </template>

              <view
                @click="clickCancel(item)"
                v-if="item.is_pay == 1 && item.apply_delete == 0"
              >
                退款
              </view>
            </template>

            <view
              @click="onShowCode(item)"
              v-if="
                (item.is_pay == 1 || item.pay_type == 2) &&
                item.is_offline == 1 &&
                item.apply_delete == 0 &&
                item.is_confirm != 1
              "
            >
              <text class="iconfont icon-QRcode"></text>
              核销码
            </view>

            <template v-if="item.is_send == 1 && item.is_confirm == 0">
              <view
                @click="
                  $utils.toUrl(
                    '/pages/express-detail/express-detail?pageType=miaosha&id=' +
                      item.order_id
                  )
                "
                v-if="item.express"
              >
                物流
              </view>

              <view @click="orderConfirm(item)"> 确认收货 </view>
            </template>

            <template
              v-if="
                item.is_send == 1 &&
                item.is_confirm == 1 &&
                item.is_comment == 0 &&
                SHOP_CONFIG.store.is_comment
              "
            >
              <view
                @click="
                  $utils.toUrl(
                    '/pages/order-comment/order-comment?pageType=miaosha&id=' +
                      item.order_id
                  )
                "
                v-if="item.type != 6"
              >
                评价
              </view>

              <!-- <view
                v-if="item.refund == 1"
                @click="clickTabs({ index: 4 }, item)"
              >
                售后详情
              </view> -->
            </template>
          </template>
        </view>
      </view>
    </view>

    <CodePopup
      title="核销码"
      :imgUrl="codeUrl"
      :show.sync="showCodePopup"
    ></CodePopup>
  </view>
</template>

<script>
import CodePopup from '@/pages/user/components/CodePopup.vue';
export default {
  components: {
    CodePopup,
  },
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showCodePopup: false,
      codeUrl: '',
    };
  },
  methods: {
    // 取消订单
    clickCancel(item) {
      uni.showModal({
        title: '提示',
        content: '您确定取消该订单吗?',
        success: async ({ confirm }) => {
          if (confirm) {
            const { msg } = await this.$requestAll.miaosha.revoke(
              {
                order_id: item.order_id,
                mch_id: item.mch_id || 0
              },
              true
            );
            this.$utils.toast(msg || '取消订单成功');
            this.$emit('getList', item);
          }
        },
      });
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
      uni.showModal({
        title: '提示',
        content: '是否确认已收到货？',
        showCancel: true,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            const res = await this.$requestAll.miaosha.confirm({
              order_id: item.order_id,
            });
            uni.$u.toast(res.msg);

            this.$emit('getList');
          }
        },
      });
    },

    navToDetail(item) {
      if (item.order_refund_id) {
        this.$utils.toUrl(
          '/miaosha/order-refund-detail/order-refund-detail?id=' +
            item.order_refund_id
        );
      } else {
        this.$utils.toUrl(
          '/miaosha/order-detail/order-detail?id=' + item.order_id
        );
      }
    },
  },
  computed: {
    SHOP_CONFIG() {
      return this.$store.getters['SHOP_CONFIG'];
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  .item {
    margin-bottom: 20rpx;
    background: #fff;
    > view {
      padding: 0 20rpx;
    }
    .status-box {
      height: 90rpx;
      border-bottom: 2rpx solid #eee;
      font-size: 24rpx;
      color: #666;
    }
    .goods {
      padding: 20rpx;
      border-bottom: 2rpx solid #eee;
      > image {
        margin-right: 20rpx;
        width: 156rpx;
        height: 156rpx;
      }
    }
    .total {
      height: 90rpx;
      border-bottom: 2rpx solid #eee;
      .bts {
        > view {
          margin-left: 20rpx;
          padding: 0 30rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 10rpx;
          border: 2rpx solid #999;
        }
        .status2-bg-ff {
          background: #fff;
          border: 2rpx solid #999;
          color: #333;
        }
        .border0 {
          border: 0;
        }
      }
    }
  }
}
</style>
