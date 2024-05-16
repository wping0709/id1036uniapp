<template>
  <div class="order-list">
    <view
      @click="$emit('clickOrder', order)"
      class="order-item"
      v-for="(order, i) in list"
      :key="i"
    >
      <!-- 订单标题 -->
      <div class="item-1" v-if="type != 'book'">
        <div class="item-1-left">
          <template v-if="type == 'pt'">
            <text
              class="price-color"
              v-if="order.is_group == 1 && order.status == 2"
              >还差{{ order.surplusGruopNum }}人成团</text
            >
            <text v-else class="price-color">{{ order.status_name }} </text>
          </template>

          <!-- 非售后订单显示 -->
          <template v-else-if="!order.refund_status">
            <i class="iconfont icon-store font-36"></i>
            <text>{{ order.mch && order.mch.name }}</text>
          </template>

          <template v-else>
            <template v-if="order.refund_type == 1">
              <text class="iconfont icon-wodeshouhou font-36 m-r-10"></text>
              <text>退货退款</text>
            </template>
            <template v-if="order.refund_type == 2">
              <text class="iconfont icon-wodeshouhou font-36 m-r-10"></text>
              <text>换货</text>
            </template>
          </template>
        </div>
        <div class="item-1-right">
          <view v-if="type == 'pt' && order.status_name" class="price-color">
            {{ order.status_name }}
          </view>
          <view v-else class="text-status">
            <!-- 售后 -->
            <view class="border0" v-if="order.refund_status == 0">
              <template v-if="order.refund_type == 1">
                <template v-if="order.is_agree == 0">等待处理</template>
                <template v-else>
                  <template v-if="order.is_user_send == 0">待买家发货</template>
                  <template v-else>等卖家待处理</template>
                </template>
              </template>
              <template v-else>等卖家待处理</template>
            </view>
            <view
              class="border0"
              style="color: #36ba75"
              v-if="order.refund_status == 1"
            >
              已同意并退款
            </view>
            <view
              class="border0"
              style="color: #36ba75"
              v-if="order.refund_status == 2"
            >
              已同意换货
            </view>
            <view
              class="border0"
              style="color: #ff4544"
              v-if="order.refund_status == 3"
            >
              <template v-if="order.refund_type == 1">已拒绝退货退款</template>
              <template v-if="order.refund_type == 2">已拒绝换货</template>
            </view>
          </view>
        </div>
      </div>

      <!-- 订单编号 -->
      <div class="item-2 flex-y-center">
        <view class="flex-grow-1">订单编号：{{ order.order_no }}</view>
        <view class="flex-grow-0"></view>
      </div>
	  <div class="item-2 flex-y-center" v-if="order.is_order_food && order.running_number">
	    <view class="flex-grow-1">流水号：A{{ order.running_number }}</view>
	    <view class="flex-grow-0"></view>
	  </div>
	  <div class="item-2 flex-y-center" v-if="order.is_order_food">
	    <view class="flex-grow-1">点餐类型：{{ order.order_food_type?'打包带走':'店内堂食' }}</view>
	    <view class="flex-grow-0"></view>
	  </div>
	  <div class="item-2 flex-y-center" v-if="order.is_order_food && order.table_number">
	    <view class="flex-grow-1">桌号：{{ order.table_number }}</view>
	    <view class="flex-grow-0"></view>
	  </div>
	  <div class="item-2 flex-y-center" v-if="order.is_order_food && order.diners_number">
	    <view class="flex-grow-1">就餐人数：{{ order.diners_number }}</view>
	    <view class="flex-grow-0"></view>
	  </div>
	
	  

      <!-- 商品 -->
      <div class="item-3">
        <view
          class="goods-box"
          v-for="(goods, goodsIndex) in order.goods_list"
          :key="goodsIndex"
        >
          <view class="flex-grow-0">
            <image
              :src="goods.goods_pic"
              mode="aspectFill"
              class="goods-pic"
            ></image>
          </view>

          <div class="goods-content flex-grow-1">
            <div class="content-1 flex-y-center">
              <div class="goods-name flex-grow-1 u-line-1">
                {{ goods.goods_name }}
              </div>
              <div v-if="goods.price" class="goods-price flex-grow-0 m-l-20">
                <text class="font-24">￥</text>{{ goods.price }}
              </div>
            </div>

            <div class="content-2">
              <div v-if="goods.attr_list" class="attr-list flex-grow-1 u-line-2">
                <text
                  v-for="(attr, attrIndex) in goods.attr_list"
                  :key="attrIndex"
                >
                  {{ attr.attr_group_name }}：{{ attr.attr_name }}
                  <text
                    style="margin: 0 10rpx"
                    v-show="attrIndex < goods.attr_list.length - 1"
                  >
                    |
                  </text>
                </text>
              </div>

              <div class="goods-num" v-if="goods.num">X{{ goods.num }}</div>
            </div>
          </div>
        </view>
      </div>

      <div class="item-4 flex-y-center">
        <div
          v-if="type == 'pt'"
          class="item-4-left flex-y-center flex-grow-1"
          style="color: red; font-size: 28rpx"
        >
          <!-- 是团长拼团 && 正在拼团中 -->
          <template v-if="order.is_launch && (order.is_group == 1 && order.status == 2)">
            剩余：
            <u-count-down
              :time="cptTime(order)"
              format="DD天HH时mm分ss秒"
            ></u-count-down>
          </template>
        </div>
        <div v-else class="item-4-left flex-grow-1">
          <template v-if="type == 'book'">
            {{ $u.timeFormat(order.addtime, 'yyyy-mm-dd hh:MM:ss') }}
          </template>
          <template v-else>
            {{ order.addtime }}
          </template>
        </div>

        <!-- 合计位置 -->
        <div class="item-4-right flex-grow-0">
          <template v-if="type == 'integral'">
            合计：<text class="price-color"
              >积分{{ order.integral }} + ￥{{ order.pay_price }}</text
            >
          </template>
          <template v-else-if="!order.refund_status">
            合计：<text class="price-color">￥{{ order.pay_price }}</text>
          </template>
          <template v-else>
            <template v-if="order.refund_type == 1">
              退货退款：<text class="price-color"
                >￥{{ order.refund_price }}</text
              >
            </template>
          </template>
        </div>
      </div>

      <div class="item-5">
        <!-- button -->

        <view @click.stop class="total-button flex-y-center">
          <view class="button-box flex-y-center">
            <!-- 预约订单 -->
            <template v-if="type == 'book'">
              <!-- 已支付 -->
              <template v-if="order.is_pay == 1">
                <template v-if="order.is_use == 0 && order.apply_delete == 0">
                  <view class="button1" @click="$emit('clickShiyong', order)"
                    >立即使用</view
                  >
                  <view
                    @click="$emit('applyRefund', order)"
                    v-if="order.pay_price > 0"
                    class="button1"
                  >
                    申请退款
                  </view>
                </template>
              </template>
              <!-- 未支付 -->
              <template v-else>
                <!-- 未支付 未取消 -->
                <template v-if="order.is_cancel == 0">
                  <view
                    class="button1"
                    @click="
                      $utils.toUrl(
                        '/pages/pay/pay?order_type=3&order_id=' + order.id
                      )
                    "
                  >
                    支付
                  </view>
                  <view
                    class="bt m-l-20 bt-bg-fff"
                    @click="$emit('clickCancel', order)"
                    >取消</view
                  >
                </template>
              </template>

              <template
                v-if="
                  order.is_use == 1 &&
                  order.is_comment == 0 &&
                  $store.state.baseData.store.is_comment
                "
              >
                <view
                  @click="
                    $utils.toUrl(
                      '/book/order-comment/order-comment?id=' + order.id
                    )
                  "
                  class="button1"
                >
                  评价
                </view>
              </template>

              <template
                v-if="
                  order.apply_delete == 1 &&
                  order.is_refund == 2 &&
                  order.is_use == 0
                "
              >
                <view class="button1" @click="$emit('clickShiyong', order)"
                  >立即使用</view
                >
              </template>
            </template>

            <!-- 积分兑换订单 -->
            <template v-else-if="type == 'integral'">
              <!-- 未发货 -->
              <template v-if="order.is_send == 0">
                <text v-if="order.apply_delete == 1">
                  {{ order.is_cancel == 1 ? '已取消' : '退款申请中' }}
                </text>

                <template v-if="order.is_pay == 0">
                  <view @click="$emit('clickCancel', order)"> 取消 </view>
                  <view
                    @click="$emit('clickPay', order)"
                    v-if="order.pay_type != 2"
                    class="button1"
                  >
                    付款</view
                  >
                </template>

                <view
                  @click="$emit('clickCancel', order)"
                  v-if="order.is_pay == 1 && order.apply_delete == 0"
                >
                  取消
                </view>
              </template>

              <template v-if="order.is_send == 1 && order.is_confirm == 0">
                <view
                  @click="
                    $utils.toUrl(
                      '/pages/express-detail/express-detail?pageType=integral&id=' +
                        order.id
                    )
                  "
                  v-if="order.express"
                  class="button1"
                >
                  物流
                </view>
                <view @click="$emit('orderConfirm', order)" class="button1">
                  确认收货
                </view>
              </template>

              <template
                v-if="
                  order.is_send == 1 &&
                  order.is_confirm == 1 &&
                  order.is_comment == 0 &&
                  SHOP_CONFIG.store.is_comment
                "
              >
                <view
                  @click="
                    $utils.toUrl(
                      '/pages/order-comment/order-comment?pageType=integral&id=' +
                        order.id
                    )
                  "
                  v-if="order.type != 6"
                  class="button1"
                >
                  评价
                </view>
              </template>

              <!-- 核销码 -->
              <view
                class="button1"
                @click="$emit('onShowCode', order)"
                v-if="
                  (order.is_pay == 1 || order.pay_type == 2) &&
                  order.is_offline == 1 &&
                  order.apply_delete == 0 &&
                  order.is_confirm != 1
                "
              >
                <text class="iconfont icon-QRcode"></text>
                核销码
              </view>
            </template>

            <!-- 拼团订单 -->
            <template v-else-if="type == 'pt'">
              <view
                v-if="order.status == 1"
                class="button1"
                @click="
                  $utils.toUrl(
                    '/pages/pay/pay?order_type=2&order_id=' + order.order_id
                  )
                "
              >
                去支付
              </view>

              <view
                v-if="
                  order.status == 2 || order.status == 3 || order.status == 4
                "
                class="button"
                @click="
                  $utils.toUrl(
                    '/pt/order-detail/order-detail?id=' + order.order_id
                  )
                "
              >
                订单详情
              </view>

              <view
                v-if="
                  (order.status == 2 ||
                    order.status == 3 ||
                    order.status == 4) &&
                  order.is_group == 1
                "
                class="button1"
                @click="$utils.toUrl('/pt/group/details?oid=' + order.order_id)"
              >
                拼团详情
              </view>

              <view
                v-if="
                  order.is_send == 1 &&
                  order.is_confirm == 1 &&
                  order.is_comment == 0
                "
                class="button1"
                @click="
                  $utils.toUrl(
                    '/pages/order-comment/order-comment?pageType=pt&id=' +
                      order.order_id
                  )
                "
              >
                评价
              </view>
            </template>

            <!-- 普通订单按钮 -->
            <template v-else>
              <!-- 分享给好友 -->
              <button
                v-if="$utils.orderStatus(order) == 0 && order.pay_type == 5"
                @click="$emit('onShare', order)"
                class="button-initial"
              >
                分享给好友
              </button>

              <!-- 已取消，退款申请中 -->
              <template v-if="order.is_send == 0">
                <template v-if="is_foods">
                  <!-- 结账 -->
                  <view
                    @click="$emit('gotoHandleOrder', order)"
                  >
                    去结账
                  </view>
                </template>
                <template v-else>
                  <text v-if="order.apply_delete == 1">
                    {{ order.is_cancel == 1 ? '已取消' : '退款申请中' }}
                  </text>
                  <text v-else>
                    {{ order.is_cancel == 1 ? '已取消' : '' }}
                  </text>

                  <!-- 取消付款 -->
                  <template v-if="order.is_pay == 0 && order.is_cancel == 0">
                    <view @click="$emit('clickCancel', order)"> 取消 </view>
                    <view
                      class="button1"
                      @click="$emit('clickPay', order)"
                      v-if="order.pay_type != 2"
                    >
                      付款
                    </view>
                  </template>

                  <!-- 退款 -->
                  <view
                    @click="$emit('onTuikuan', order)"
                    v-if="order.is_pay == 1 && order.apply_delete == 0"
                  >
                    退款
                  </view>
                </template>
              </template>

              <!-- 核销码 -->
              <view
                class="button1"
                @click="$emit('onShowCode', order)"
                v-if="
                  (order.is_pay == 1 || order.pay_type == 2) &&
                  order.is_offline == 1 &&
                  order.apply_delete == 0 &&
                  order.is_confirm != 1
                "
              >
                <text class="iconfont icon-QRcode"></text>
                核销码
              </view>

              <!-- 物流，确认收货 -->
              <template v-if="order.is_send == 1 && order.is_confirm == 0">
                <view
                  @click="
                    $utils.toUrl(
                      '/pages/express-detail/express-detail?id=' +
                        order.order_id
                    )
                  "
                  v-if="order.express"
                >
                  物流
                </view>

                <view class="button1" @click="$emit('orderConfirm', order)">
                  确认收货
                </view>
              </template>

              <!-- 评价 ，售后详情-->
              <template
                v-if="
                  order.is_send == 1 &&
                  order.is_confirm == 1 &&
                  order.is_comment == 0
                  
                "
              >
                <view
                
                  class="button1"
                  @click="
                    $utils.toUrl(
                      '/pages/order-comment/order-comment?id=' + order.order_id
                    )
                  "
                  v-if="order.type != 6 && SHOP_CONFIG.store.is_comment"
                >
                  评价
                </view>

                <view
                  v-if="order.refund == 1"
                  @click="$emit('clickTabs', { index: 4 }, order)"
                >
                  售后详情
                </view>
              </template>
            </template>
          </view>
        </view>
      </div>
    </view>
  </div>
</template>

<script>
export default {
  props: ['list', 'type', 'is_foods'],
  name: 'OrderItem',
  data() {
    return {};
  },
  computed: {
    SHOP_CONFIG() {
      return this.$store.getters['SHOP_CONFIG'];
    },
    cptTime() {
      return function (order) {
        return (
          order.limit_time.days * 86400000 +
          order.limit_time.hours * 3600000 +
          order.limit_time.mins * 60000 +
          order.limit_time.secs * 1000
        );
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.order-list {
  padding: 24rpx;
}

.order-item {
  border-radius: 20rpx;
  margin-bottom: 24rpx;
  padding: 24rpx;
  background: #fff;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }

  .item-1 {
    display: flex;
    margin-bottom: 20rpx;

    .item-1-left {
      flex-grow: 1;
      display: flex;
      align-items: center;

      line-height: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: 600;
      color: #262626;
    }

    .item-1-right {
      flex-grow: 0;
      font-size: 24rpx;
      color: #f0250e;
    }
  }

  .item-2 {
    font-size: 24rpx;
    color: #8c8c8c;
  }

  .item-3 {
    .goods-box {
      display: flex;

      margin-top: 24rpx;
      margin-bottom: 24rpx;

      &:nth-last-child(1) {
        margin-bottom: 0;
      }

      .goods-pic {
        width: 144rpx;
        height: 144rpx;
        margin-right: 20rpx;
        border-radius: 10rpx;
      }

      .goods-content {
        flex-grow: 1;

        .content-1 {
          margin-bottom: 10rpx;

          .goods-name {
            line-height: 40rpx;
            font-size: 28rpx;
            color: #262626;
          }

          .goods-price {
            line-height: 44rpx;
            font-size: 32rpx;
            font-weight: 600;
            color: #262626;
          }
        }

        .content-2 {
          display: flex;
          height: 68rpx;
          font-size: 24rpx;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 34rpx;
          color: #8c8c8c;
          opacity: 1;

          .attr-list {
          }

          .goods-num {
            margin-left: 20rpx;
          }
        }
      }
    }
  }

  .item-4 {
    margin-top: 24rpx;

    .item-4-left {
      height: 34rpx;
      font-size: 24rpx;
      color: #8c8c8c;
    }

    .item-4-right {
      line-height: 40rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #262626;
    }
  }

  .item-5 {
    .total-button {
      margin-top: 24rpx;

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
</style>
