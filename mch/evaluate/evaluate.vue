<template>
  <view class="body flex-col">
    <view class="bg-fff">
      <u-tabs
        :current="current"
        :list="tabsList"
        :activeStyle="{ color: 'red' }"
        :scrollable="false"
        lineColor="red"
        @change="tabsChange"
      ></u-tabs>
    </view>
    <scroll-view
      @scrolltolower="loadData()"
      scroll-y
      class="flex-h-1 env-bottom"
    >
      <!-- 待评价订单列表 -->
      <view v-if="!current" class="order-list">
        <view class="order-item" v-for="(order, i) in pageData.list" :key="i">
          <!-- 订单编号 -->
          <div class="item-2 flex-y-center">
            <view class="iconfont icon-store m-r-10 font-36"></view>
            <view class="flex-w-1 u-line-1">{{ order.store_name }}</view>
          </div>

          <!-- 商品 -->
          <div class="item-3">
            <view class="goods-box">
              <view class="flex-grow-0">
                <image
                  :src="order.goods_pic"
                  mode="aspectFill"
                  class="goods-pic"
                ></image>
              </view>

              <div class="goods-content flex-grow-1">
                <div class="content-1 flex-y-center">
                  <div class="goods-name flex-grow-1 u-line-1">
                    {{ order.goods_name }}
                  </div>
                  <div
                    v-if="order.price"
                    class="goods-price flex-grow-0 m-l-20"
                  >
                    <text class="font-24">￥</text>{{ order.price }}
                  </div>
                </div>

                <div class="content-2">
                  <div class="attr-list flex-grow-1 u-line-2">
                      <text
                        v-for="(attr, attrIndex) in order.attr_list"
                        :key="attrIndex"
                      >
                        {{ attr.attr_group_name }}：{{ attr.attr_name }}
                        <text
                          style="margin: 0 10rpx"
                          v-show="attrIndex < order.attr_list.length - 1"
                        >
                          |
                        </text>
                      </text>
                  </div>

                  <div class="goods-num" v-if="order.num">X{{ order.num }}</div>
                </div>
              </div>
            </view>
          </div>

          <div class="item-5">
            <view @click.stop class="total-button flex-y-center">
              <view class="button-box flex-y-center">
                <view
                  class="button1"
                  @click="
                    $utils.toUrl(
                      '/pages/order-comment/order-comment?id=' + order.order_id
                    )
                  "
                >
                  评价
                </view>
              </view>
            </view>
          </div>
        </view>
      </view>
      <!-- 已评价订单列表 -->
      <view v-else class="order-list">
        <view v-for="(order, i) in pageData.list" :key="i" class="order-item">
          <!-- 用户信息 -->
          <div class="flex-y-center">
            <image
              :src="order.avatar_url"
              mode="aspectFill"
              style="width: 50rpx; height: 50rpx; border-radius: 50rpx"
            />
            <view class="flex-w-1 m-l-20 u-line-1">{{ order.user_name }}</view>
          </div>

          <!-- 分类 -->
          <div class="p-t-24 color-999 font-24 u-line-2">
            {{ order.attr.attr_group_name }}：{{ order.attr.attr_name }}
          </div>

          <!-- 评价信息 -->
          <div>
            <div class="p-y-24 font-28">{{ order.comment_content }}</div>
            <div v-if="order.pic_list && order.pic_list.length" class="p-b-24">
              <u-album :urls="order.pic_list"></u-album>
            </div>
          </div>

          <!-- 商品信息 -->
          <div
            @click="$utils.toUrl('/pages/goods/goods?id=' + order.goods_id)"
            class="p-20 flex-y-center"
            style="background: #f5f5f5; border-radius: 10rpx"
          >
            <image
              :src="order.good_cover"
              mode="aspectFill"
              style="width: 100rpx; height: 100rpx; border-radius: 10rpx"
            />
            <view class="flex-w-1 m-l-20">
              <view class="u-line-1">{{ order.good_name }}</view>
              <view class="price-color m-t-20">￥{{ order.good_price }}</view>
            </view>
          </div>
        </view>
      </view>

      <u-loadmore :status="status"></u-loadmore>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      page: 1,
      status: 'loadmore',
      current: 0,
    };
  },
  onLoad() {
    this.loadData();
  },
  computed: {
    tabsList() {
      return [
        {
          name: `待评价(${
            (this.pageData && this.pageData.not_evaluate_num) || 0
          })`,
        },
        {
          name: `全部评价(${
            (this.pageData && this.pageData.all_evaluate_num) || 0
          })`,
        },
      ];
    },
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.default.evaluateCenter(
        {
          type: this.current,
          page: this.page,
        },
        true
      );
      if (this.pageData) {
        this.pageData.not_evaluate_num = res.data.not_evaluate_num;
        this.pageData.all_evaluate_num = res.data.all_evaluate_num;
        this.pageData.list.push(...res.data.list);
      } else {
        this.pageData = res.data;
      }
      this.page++;
      this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
    },
    tabsChange(e) {
      console.log(e);
      this.current = e.index;
      let { page, pageData, status } = this.$options.data();
      this.page = page;
      this.pageData = pageData;
      this.status = status;
      this.loadData();
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
  height: 100vh;
  // #ifdef H5
  height: calc(100vh - 44px);
  // #endif

  .order-list {
    padding: 24rpx;
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
  }
}
</style>
