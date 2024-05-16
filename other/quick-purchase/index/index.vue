<template>
  <view v-if="list.length" class="body flex-col">
    <view class="flex-h-1 flex">
      <scroll-view scroll-y class="left-scroll" style="">
        <view
          @click="clickCart(i)"
          v-for="(item, i) in list"
          :key="item.id"
          :class="['cart_item_1', checkCartIndex == i && 'check_cart']"
        >
          {{ item.name }}
        </view>
      </scroll-view>
      <scroll-view
        @scroll="rightScroll"
        :scroll-into-view="scrollTop"
        scroll-y
        id="right-scroll"
        class="right-scroll"
      >
        <view
          class="cart_item_2"
          :id="'cart_item_2_' + i"
          v-for="(item, i) in list"
          :key="item.id"
        >
          <div class="title p-y-30">{{ item.name }}</div>
          <view v-if="item.goods.length">
            <div
              class="goods flex"
              v-for="(item1, i2) in item.goods"
              :key="item1.id"
            >
              <div class="left">
                <image :src="item1.cover_pic" mode="aspectFill" />
              </div>
              <div class="right flex-w-1">
                <view class="goods-name u-line-2">{{ item1.name }}</view>
                <view class="font-24 color-999">
                  销量：{{ item1.virtual_sales }}
                </view>
                <view class="price-attr flex-y-center flex-x-sb">
                  <div class="price">
                    <PriceText
                      :price="item1.price"
                      ySize="30rpx"
                      fSize="24rpx"
                    ></PriceText>
                  </div>
                  <div @click="clickGoodsAttr(item1)" class="attr-bt">
                    <text>选规格</text>
                    <text class="attr-num" v-if="item1.checkNum">
                      {{ item1.checkNum || 0 }}
                    </text>
                  </div>
                </view>
              </div>
            </div>
          </view>

          <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
        </view>

        <!-- 购物车弹框 -->
        <u-popup
          :show="showCartPopup"
          mode="bottom"
          round="10"
          zIndex="999"
          :overlayStyle="{ zIndex: 999 }"
          closeable
          @close="switchBoolean('showCartPopup')"
        >
          <view class="goods-popup">
            <view class="p-y-24 font-center font-32 font-w-600">已选商品</view>
            <scroll-view scroll-y style="min-height: 30vh">
              <view v-if="checkGoodsNum" class="goods-list">
                <div
                  class="goods flex"
                  v-for="(item1, i2) in checkGoods"
                  :key="item1.id"
                >
                  <div class="left">
                    <image :src="item1.cover_pic" mode="aspectFill" />
                  </div>
                  <div class="right flex-w-1">
                    <view class="goods-name u-line-2">{{ item1.name }}</view>
                    <view class="font-24 color-999">
                      销量：{{ item1.virtual_sales }}
                    </view>
                    <view class="price-attr flex-y-center flex-x-sb">
                      <div class="price">
                        <PriceText
                          :price="item1.price"
                          ySize="30rpx"
                          fSize="24rpx"
                        ></PriceText>
                      </div>
                      <div class="attr-bt" style="background: initial">
                        <u-number-box
                          bgColor="transparent"
                          inputWidth="92rpx"
                          v-model="item1.checkNum"
                          :min="1"
                          :disabled="item1.attrData.num <= 0"
                          :max="item1.attrData.num"
                        ></u-number-box>
                      </div>
                    </view>
                  </div>
                </div>
              </view>

              <u-empty v-else mode="data" :icon="wxapp_img.empty_data">
              </u-empty>
            </scroll-view>
          </view>
        </u-popup>
      </scroll-view>
    </view>

    <div class="bottom env-bottom">
      <view class="bottom-content">
        <div class="left flex-y-center">
          <div @click="switchBoolean('showCartPopup')" class="cart-icon">
            <text class="iconfont icon-cart-full"></text>
            <div class="cart-num">{{ checkGoodsNum }}</div>
          </div>
          <div class="cart-price">
            <PriceText
              :price="totalPrice"
              ySize="38rpx"
              sSize="26rpx"
              color="#fff"
            ></PriceText>
          </div>
        </div>
        <div class="right" @click="submit">结算</div>
      </view>

      <AttrPopup
        :goodsId="goods.id"
        :selectData.sync="selectData"
        ref="AttrPopup"
        @confirm="attrConfirm"
      ></AttrPopup>
    </div>
  </view>
  <view v-else class="body flex-col">
    <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
  </view>
</template>
<script>
import PriceText from '@/components/price-text';
import AttrPopup from '@/components/goods/AttrPopup';
export default {
  components: {
    PriceText,
    AttrPopup,
  },
  data() {
    return {
      list: [], //页面数据
      checkCartIndex: 0, //当前选中分类索引
      showCartPopup: false, //当前选中商品弹框展示开关
      goods: '', //当前选中商品id用于选择规格
      scrollTop: '',
      selectData: {},
    };
  },

  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    // 获取页面数据
    async loadData() {
      const res = await this.$requestAll.quick.quick({}, true);

      if (res.data.list.some(item => item.goods && item.goods.length)) {
        this.list = res.data.list.filter(item => {
          if (item.goods && item.goods.length) return item;
        });
      }
    },
    // 选中分类
    clickCart(i) {
      this.checkCartIndex = i;
      this.scrollTop = `cart_item_2_${i}`;
    },
    // 商品栏目滚动事件
    async rightScroll(e) {
      uni.$u.throttle(async () => {
        // 当前为向上滚动，查询当前索引加1dom是否巨顶0
        console.log(e.detail.deltaY);
        if (e.detail.deltaY < 0) {
          console.log('向上滚动');
          var dom = await this.$uGetRect(
            '#cart_item_2_' + (this.checkCartIndex + 1)
          );

          console.log('top', dom.top);
          if (dom && dom.top <= 0) {
            this.checkCartIndex++;
            console.log(this.checkCartIndex);
          }
        }
        // 当前为向下滚动
        else {
          console.log('向下滚动');
          var dom = await this.$uGetRect(
            '#cart_item_2_' + (this.checkCartIndex - 1)
          );
          if (dom && dom.top >= 0) {
            this.checkCartIndex = this.checkCartIndex - 1;
          }
        }

        this.scrollTop = '';
      }, 30);
    },
    // 切换布尔值
    switchBoolean(key) {
      this[key] = !this[key];
    },
    // 点击选择规格
    clickGoodsAttr(goods) {
      this.goods = goods;
      this.selectData = { num: goods.checkNum };
      this.$refs['AttrPopup'].showPopup('');
    },
    attrConfirm(data) {
      for (const key in this.list) {
        let item = this.list[key];
        if (!item.goods || !item.goods.length) continue;
        for (const key1 in item.goods) {
          let goods = item.goods[key1];

          //这里使用attrData 是为了数量步进器选择限制。
          if (this.goods && goods.id == this.goods.id) {
            goods.checkNum = data.num;
            goods.checkAttr = data.attr_list;
            goods.attrData = data.attrData;
          }
        }
      }

      this.list = JSON.parse(JSON.stringify(this.list));
    },
    submit() {
      if (!this.checkGoodsNum) return uni.$u.toast('请选择商品结算！');
      let mch_list = [
        {
          mch_id: 0,
          goods_list: [],
        },
      ];
      this.checkGoods.forEach(goods => {
        mch_list[0].goods_list.push({
          goods_id: goods.id,
          num: goods.checkNum,
          attr: goods.checkAttr,
        });
      });
      this.$utils.toUrl(
        '/pages/order-submit/order-submit?mch_list=' + JSON.stringify(mch_list)
      );
    },
  },
  computed: {
    checkGoods() {
      let result = [];
      if (this.list.length) {
        for (const key in this.list) {
          let item = this.list[key];
          if (!item.goods || !item.goods.length) continue;

          for (const key1 in item.goods) {
            let goods = item.goods[key1];
            if (goods.checkNum) result.push(goods);
          }
        }
      }
      return result;
    },
    totalPrice() {
      let totalPrice = 0;
      if (this.checkGoods.length) {
        this.checkGoods.forEach(item => {
          totalPrice += item.checkNum * item.price;
        });
      }
      return totalPrice;
    },
    checkGoodsNum() {
      let num = 0;
      if (this.checkGoods.length) {
        this.checkGoods.forEach(goods => {
          num += goods.checkNum;
        });
      }
      return num;
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */

  .left-scroll {
    height: 100%;
    width: 160rpx;
    background: #f5f5f5;
    .cart_item_1 {
      height: 80rpx;
      line-height: 80rpx;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      word-break: break-all;
      text-align: center;
      font-size: 28rpx;
    }
    .check_cart {
      background: #fff;
      font-weight: 700;
    }
  }

  .right-scroll {
    height: 100%;
    width: 0;
    flex: 1;

    .cart_item_2 {
      padding: 0 20rpx;
    }

    .goods {
      .left {
        margin-right: 20rpx;
        width: 160rpx;
        height: 160rpx;
        border-radius: 10rpx;
        overflow: hidden;
        image {
          width: 100%;
          height: 100%;
        }
      }

      .right {
        .goods-name {
          font-weight: 600;
          line-height: 42rpx;
          height: 84rpx;
        }

        .price-attr {
          .attr-bt {
            position: relative;
            left: 0;
            right: 0;
            background: #ff0000;
            color: #fff;
            text-align: center;
            padding: 6rpx 16rpx;
            border-radius: 20rpx;
            font-size: 24rpx;
            .attr-num {
              position: absolute;
              right: 0;
              top: 0;
              transform: translate(50%, -50%);
              background: #fff;
              border: 1px solid red;
              color: red;
              font-size: 22rpx;
              line-height: 30rpx;
              height: 30rpx;
              min-width: 30rpx;
              border-radius: 30rpx;
            }
          }
        }
      }
    }
  }

  .bottom {
    position: relative;
    z-index: 1000;
    .bottom-content {
      background: #000;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        margin-left: 30rpx;
        .cart-icon {
          position: relative;
          top: -30rpx;
          width: 100rpx;
          height: 100rpx;
          background: #fcb36a;
          border-radius: 50%;
          line-height: 100rpx;
          text-align: center;
          .icon-cart-full {
            font-size: 60rpx;
          }
          .cart-num {
            position: absolute;
            right: 0;
            top: 0;
            min-width: 30rpx;
            height: 30rpx;
            line-height: 30rpx;
            border-radius: 30rpx;
            font-size: 22rpx;
            background: red;
            color: #fff;
          }
        }

        .cart-price {
          margin-left: 30rpx;
          color: #fff;
          font-size: 32rpx;
        }
      }

      .right {
        background: red;
        color: #fff;
        height: 100rpx;
        font-size: 36rpx;
        font-weight: 600;
        width: 200rpx;

        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .goods-popup {
    padding-bottom: 130rpx;
    scroll-view {
      max-height: 50vh;
      .goods-list {
        padding: 0 24rpx;
      }
    }
  }
}
</style>
