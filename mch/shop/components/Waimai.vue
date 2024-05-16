<template>
  <!-- 外卖首页样式 -->
  <view class="waimai-body" v-if="shopData.is_waimai">
    <WaimaiHead
      @favoriteChange="favoriteChange"
      :shopData="shopData"
    ></WaimaiHead>

    <!-- 内容区域 -->
    <view class="waimai-content">
      <!-- 外卖tabs -->
      <view class="tabs">
        <view
          @click="tabIndex = 0"
          :class="['tab', tabIndex == 0 && 'selectTab']"
        >
          商品
        </view>

        <view
          @click="tabIndex = 1"
          :class="['tab', tabIndex == 1 && 'selectTab']"
        >
          评价
        </view>

        <view
          @click="
            $utils.toUrl(
              '/pages/scan-code-pay/scan-code-pay?mch_id=' + shopData.shop.id
            )
          "
          class="tab dangmianfu"
        >
          <view>当面付</view>
          <view>买单</view>
        </view>
      </view>

      <view v-if="tabIndex == 0" class="classify-goods flex-h-1 flex">
        <!-- 外卖分类 -->
        <scroll-view scroll-y class="classify-box">
          <view
            @click="switchCat(i)"
            v-for="(item, i) in shopData.template[0].param.list"
            :class="[i == catIndex && 'selectCat', 'catItem', 'u-line-1']"
            :key="i"
          >
            {{ item.name || item.cat_name }}
            <text class="cart-num" v-show="item.num">{{ item.num }}</text>
          </view>
        </scroll-view>

        <!-- 外卖商品 -->
        <scroll-view scroll-y @scrolltolower="getGoodsList()" class="goods-box flex-w-1">
          <template v-if="goodsList.length">
            <view
              v-for="(good, i) in goodsList"
              :key="i"
              @click="$utils.toUrl('/pages/goods/goods?id=' + good.id)"
              class="goodsItem flex"
            >
              <div class="left-img">
                <image :src="good.pic_url" mode="aspectFill" />
                <image
                  v-if="shopData.template[0].param.mark"
                  :src="shopData.template[0].param.mark_url"
                  mode="widthFix"
                />
              </div>
              <div class="goodsContent flex-w-1 flex-col flex-x-sb">
                <!-- top -->
                <view class="u-line-1">
                  <template v-if="shopData.template[0].param.name == 1">
                    {{ good.name }}
                  </template>
                </view>

                <!-- bottom -->
                <view class="content-bottom">
                  <!-- 月售 -->
                  <view v-if="store.is_sales" class="color-666 font-24">
                    月售: {{ good.monthly_sales }}
                  </view>

                  <!-- 原价 -->
                  <view class="m-y-10">
                    <text
                      v-if="shopData.template[0].param.old_price == 1"
                      class="font-del font-22 color-666"
                    >
                      ￥{{ good.original_price }}
                    </text>
                  </view>

                  <view class="flex-x-sb flex-y-center">
                    <view>
                      <text
                        v-if="shopData.template[0].param.price == 1"
                        class="price-color font-600-30"
                      >
                        ￥{{ good.price }}
                      </text>
                    </view>

                    <view class="flex" @click.stop>
                      <template v-if="good.use_attr == 0">
                        <text
                          v-if="true || good.num < 1"
                          @click.stop="addCart(good)"
                          class="add-cart-text"
                        >
                          加购
                          <text class="num" v-show="good.num > 0">{{
                            good.num
                          }}</text>
                        </text>
                      </template>
                      <template v-if="good.use_attr == 1">
                        <text @click.stop="addAttr(good)" class="add-cart-text">
                          <text>{{
                            shopData.template[0].param.buy_content
                          }}</text>
                          <text class="num" v-show="good.num > 0">{{
                            good.num
                          }}</text>
                        </text>
                      </template>
                    </view>
                  </view>
                </view>
              </div>
            </view>
          </template>
        </scroll-view>
      </view>

      <!-- 外卖评价模块 -->
      <view v-else-if="tabIndex == 1" class="classify-goods flex-h-1 pingjia">
        <ShopComment
          :mch_id="shopData.shop.id"
          :shopData="shopData"
        ></ShopComment>
      </view>

      <view v-show="tabIndex == 0" class="nav-bottom" style="z-index: 10076">
        <view class="fixed flex-y-center flex-x-sb">
          <div class="left flex-w-1 flex-y-center">
            <view class="left-num" @click="showData = true">
              <text
                class="iconfont icon-cart-full font-50 price-color font-w-600"
              ></text>
              <div class="cart-num">
                {{ totalNum < 100 ? totalNum : "99+" }}
              </div>
            </view>
            <div class="left-price u-line-1 flex-w-1">
              {{ totalPrice }}
            </div>
          </div>
          <div @click="submit" class="right flex-y-center flex-x-center">
            去结算
          </div>
        </view>
      </view>
    </view>

    <u-popup
      :show="showData"
      :round="10"
      mode="bottom"
      :closeable="true"
      @close="showData = false"
    >
      <view
        style="
          padding: 20rpx;
          line-height: 50rpx;
          color: #000000;
          font-weight: bold;
        "
      >
        已选商品
      </view>
      <view
        style="
          height: 65vh;
          overflow: scroll;
          padding: 20rpx;
          margin-bottom: 100rpx;
        "
        class="env-bottom"
      >
        <template v-for="(cat, index) in checkData">
          <view
            :key="index"
            style="display: flex; margin-bottom: 20rpx"
            v-if="cat.num > 0"
          >
            <image
              :src="cat.pic_url"
              style="width: 200rpx; height: 200rpx; border-radius: 8rpx"
            ></image>
            <view style="width: calc(100% - 200rpx); padding: 20rpx">
              <view class="goods-des u-line-2" style="font-weight: bold">{{
                cat.name
              }}</view>
              <view style="color: #999999">
                规格：<text v-for="(attr_item, i) in cat.attr" :key="i">{{
                  attr_item.attr_name
                }}</text>
              </view>
              <view
                style="
                  display: flex;
                  flex-direction: row-reverse;
                  align-items: center;
                "
              >
                <view
                  @click="jia(index)"
                  style="
                    width: 40rpx;
                    height: 40rpx;
                    background: red;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20rpx;
                  "
                  >+</view
                >
                <view style="padding: 10rpx">{{ cat.num }}</view>
                <view
                  @click="jian(index)"
                  style="
                    width: 40rpx;
                    height: 40rpx;
                    border: 1px solid #999999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 20rpx;
                  "
                  >-</view
                >
              </view>
            </view>
          </view>
        </template>
      </view>
    </u-popup>

    <!-- 选择规格 -->
    <AttrPopup
      ref="AttrPopup"
      :goodsId="checkGoodsId"
      :showText="false"
      @confirm="goodsCheckAttr"
    ></AttrPopup>
  </view>
</template>

<script>
import ShopComment from "./ShopComment.vue";
import WaimaiHead from "./WaimaiHead.vue";
import AttrPopup from "./AttrPopup";

export default {
  components: {
    ShopComment,
    AttrPopup,
    WaimaiHead,
  },

  props: {
    pageData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  created() {
    console.log("created");
    this.getGoodsList();
  },
  mounted() {
    let mchCartDataList = this.$store.getters["mchCartDataList"];
    if (mchCartDataList.some((item) => item.id == this.pageData.shop.id)) {
      this.checkData = mchCartDataList.find(
        (item) => item.id === this.pageData.shop.id
      ).list;

      this.shopData.template[0].param.list.forEach((catData) => {
        catData.goods_list.forEach((goods) => {
          let index = this.checkData.findIndex(
            (item) => item.goods_id == goods.id
          );
          if (index != -1) {
            goods.num = this.checkData[index].num;
          }
        });
      });
    }
  },
  methods: {
    async getGoodsList(reset) {
      if(this.shopData.template[0].param.list[this.catIndex].goods_style) {
        this.goodsList = this.shopData.template[0].param.list[this.catIndex].goodsList
        return
      }
      if (reset) {
        let { loadMore ,goodsList,page} = this.$options.data();
        this.page = page
        this.loadMore = loadMore;
        this.goodsList = goodsList
      }
      if (!this.loadMore) return;
      let cat_id = this.shopData.template[0].param.list[this.catIndex].cat_id;
      let page = this.page;
      let mch_id = this.$parent.mch_id;
      let formData = {
        cat_id,
        page,
        mch_id,
      };
      const res = await this.$requestAll.mch.shopGoodsList(formData, true);
      this.goodsList.push(...res.data.list);
      this.loadMore = res.data.list.length == 20
      this.page++
    },
    switchCat(i) {
      this.catIndex = i
      this.getGoodsList(true)
    },
    favoriteChange(v) {
      this.shopData.shop.is_favorite = v;
    },
    tabSwitch(i) {
      this.tabIndex = i;
    },
    // 不选择规格添加购物车
    addCart(good) {
      // good.num++;
      // console.log(good);

      good.num++;
      var index = -1;
      this.checkData.forEach((cat, cat_index) => {
        if (cat.goods_id == good.id) {
          index = cat_index;
        }
      });
      if (index != -1) {
        var checkData = this.checkData;
        checkData[index].num++;
        this.checkData = null;
        this.checkData = checkData;
      } else {
        this.checkData.push({
          goods_id: good.id,
          name: good.name,
          pic_url: good.pic_url,
          num: 1,
          attr: good.attr[0].attr_list,
          price: good.price,
        });
      }
      // console.log(this.checkData, 'this.checkData')
    },
    // 选择规格添加购物车
    addAttr(good) {
      this.checkGoodsId = good.id;
      this.$refs["AttrPopup"].showPopup("");
    },
    // 选完规格回调
    goodsCheckAttr(selectAttr, type) {
      console.log(selectAttr, "selectAttr");

      var index_goods = this.shopData.template[0].param.list[
        this.catIndex
      ].goods_list.findIndex((good) => good.id == this.checkGoodsId);

      var checkGood =
        this.shopData.template[0].param.list[this.catIndex].goods_list[
          index_goods
        ];
      checkGood.num += selectAttr.num;

      var index = -1;
      this.checkData.forEach((cat, cat_index) => {
        if (cat.attr == selectAttr.attr_list) {
          index = cat_index;
        }
      });
      if (index != -1) {
        this.checkData[index].num = selectAttr.num;
      } else {
        this.checkData.push({
          goods_id: checkGood.id,
          name: checkGood.name,
          pic_url: checkGood.pic_url,
          num: selectAttr.num,
          attr: selectAttr.attr_list,
          price: selectAttr.price,
        });
      }
    },
    submit() {
      const mch_list = [
        {
          mch_id: this.shopData.shop.id,
          goods_list: [],
        },
      ];
      this.checkData.forEach((cat) => {
        if (cat.num > 0) {
          let obj = {
            goods_id: cat.goods_id,
            num: cat.num,
            attr: cat.attr,
          };
          mch_list[0].goods_list.push(obj);
        }
      });
      this.$utils.toUrl(
        "/pages/order-submit/order-submit?mch_list=" + JSON.stringify(mch_list)
      );
    },
    jia(index) {
      var checkData = this.checkData;
      checkData[index].num++;
      this.checkData = checkData;

      this.shopData.template[0].param.list.forEach((cat, cat_index) => {
        cat.goods_list.forEach((goods, goods_index) => {
          if (goods.id == checkData[index].goods_id) {
            this.shopData.template[0].param.list[cat_index].goods_list[
              goods_index
            ].num++;
          }
        });
      });
    },
    jian(index) {
      var checkData = this.checkData;
      checkData[index].num--;

      if (checkData[index].num < 0) {
        checkData[index].num = 0;
      }
      this.checkData = checkData;

      this.shopData.template[0].param.list.forEach((cat, cat_index) => {
        cat.goods_list.forEach((goods, goods_index) => {
          if (goods.id == checkData[index].goods_id) {
            this.shopData.template[0].param.list[cat_index].goods_list[
              goods_index
            ].num--;
            this.shopData.template[0].param.list[cat_index].goods_list[
              goods_index
            ].num =
              this.shopData.template[0].param.list[cat_index].goods_list[
                goods_index
              ].num > 0
                ? this.shopData.template[0].param.list[cat_index].goods_list[
                    goods_index
                  ].num
                : 0;
          }
        });
      });
    },
  },
  data() {
    return {
      shopData: "",
      tabIndex: 0,
      catIndex: 0,
      checkGoodsId: "",
      checkData: [],
      showData: false,
      page: 1,
      goodsList: [],
      loadMore: true,
    };
  },
  watch: {
    pageData: {
      handler(val, ovl) {
        this.shopData = val;
      },
      immediate: true,
    },
    checkData(val, ovl) {
      this.$store.commit("setMchShopCartData", {
        id: this.pageData.shop.id,
        list: val,
      });
    },
  },
  computed: {
    totalNum() {
      var num = 0;
      this.checkData.forEach((cat) => {
        num += cat.num;
      });
      return num;
    },
    totalPrice() {
      var price = 0;
      this.checkData.forEach((cat) => {
        price += cat.num * cat.price;
      });
      return price.toFixed(2);
    },
    store() {
      return this.$store.getters["SHOP_CONFIG"].store;
    },
  },
};
</script>

<style lang="scss" scoped>
.waimai-body {
  min-height: 100vh;

  .waimai-content {
    max-height: 100vh;
    min-height: calc(100vh - 70px);
    display: flex;
    flex-direction: column;

    .tabs {
      padding: 20rpx 25rpx 0;
      display: flex;
      height: 100rpx;
      .tab {
        margin-right: 36rpx;
        line-height: 80rpx;
        font-size: 30rpx;
        color: #666;
      }
      .dangmianfu {
        position: relative;
        text-align: center;
        > view:nth-child(1) {
          box-sizing: content-box;
          position: absolute;
          bottom: 70%;
          left: 50%;
          transform: translateX(-50%);
          width: 82rpx;
          background: #fc8c86;
          color: #fff;
          font-size: 18rpx;
          line-height: 30rpx;
          border-radius: 18rpx;
        }
      }
      .selectTab {
        position: relative;
        color: #333;
        font-weight: 600;
        &::before {
          content: "";
          position: absolute;
          bottom: 4rpx;
          left: 50%;
          width: 50rpx;
          transform: translate(-50%, 0);
          border-bottom: 4rpx solid red;
        }
      }
    }

    .classify-goods {
      margin-top: 20rpx;
      .classify-box {
        width: 170rpx;

        .catItem {
          position: relative;

          color: #666;
          padding-left: 25rpx;
          padding-right: 25rpx;
          height: 90rpx;
          line-height: 90rpx;
          font-size: 26rpx;
          .cart-num {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            background: red;
            font-size: 20rpx;
            text-align: center;
            line-height: 30rpx;
            width: 30rpx;
            height: 30rpx;
            border-radius: 50%;
            color: #fff;
          }
        }
        .selectCat {
          position: relative;
          color: red;
          background: #fff;
          &::after {
            content: "";
            position: absolute;
            left: 6rpx;
            top: 50%;
            transform: translate(0, -50%);
            height: 40rpx;
            border-right: 4rpx solid red;
          }
        }
      }

      .goods-box {
        padding-bottom: calc(100rpx + env(safe-area-inset-bottom));
        .goodsItem {
          padding: 20rpx;
          .left-img {
            position: relative;
            > image:nth-child(1) {
              margin-right: 20rpx;
              width: 200rpx;
              height: 200rpx;
              border-radius: 10rpx;
            }
            > image:nth-child(2) {
              position: absolute;
              left: 0;
              top: 0;
              width: 60rpx;
            }
          }

          .goodsContent {
            .content-bottom {
              .add-cart {
                border-radius: 20rpx;
                height: 40rpx;
                width: 40rpx;
                text-align: center;
                line-height: 40rpx;
                font-size: 32rpx;
                color: #fff;
                background: red;
              }
              .add-cart-text {
                position: relative;
                border-radius: 20rpx;
                line-height: 40rpx;
                padding: 0 20rpx;
                background: red;
                color: #fff;
                .num {
                  position: absolute;
                  right: 0rpx;
                  top: 0rpx;
                  transform: translate(50%, -30%);
                  background: #ffba00;
                  min-width: 24rpx;
                  height: 24rpx;

                  border-radius: 20rpx;
                  font-size: 20rpx;
                  text-align: center;
                  line-height: 24rpx;
                }
              }
            }
          }
        }
      }
    }

    .pingjia {
      > view:nth-child(1) {
        margin-bottom: 20rpx;
        padding: 25rpx;
        background: #fff;
      }

      .pingjia-tabs {
        display: flex;
        flex-wrap: wrap;
        background: #fff;
        padding: 25rpx 25rpx 5rpx;
        .tab {
          font-size: 26rpx;
          border: 2rpx solid #cccccc;
          margin-right: 20rpx;
          margin-bottom: 20rpx;
          padding: 16rpx 20rpx;
          color: #666;
        }
      }
    }

    .nav-bottom {
      height: 100rpx;
      height: calc(100rpx + env(safe-area-inset-bottom));
      display: flex;
      justify-content: center;

      position: fixed;
      bottom: 0;
      // bottom: env(safe-area-inset-bottom);
      width: 100%;

      .fixed {
        background: #000;

        width: 700rpx;
        height: 100rpx;
        border-radius: 50rpx;
        overflow: hidden;
        .left {
          color: #fff;

          .left-num {
            position: relative;
            margin-left: 24rpx;
            .iconfont {
              // font-size: 100rpx;
              color: #fdd70c;
            }
            .cart-num {
              position: absolute;
              right: 0;
              top: 0;
              transform: translate(50%, -30%);
              background: red;
              font-size: 20rpx;
              text-align: center;
              line-height: 30rpx;
              min-width: 30rpx;
              height: 30rpx;
              border-radius: 50%;
            }
          }
          .left-price {
            font-size: 44rpx;
            font-weight: 600;
            margin: 0 20rpx;
          }
        }
        .right {
          width: 200rpx;
          background: red;
          color: #fff;
          font-size: 32rpx;
          font-weight: 600;
          height: 100%;
        }
      }
    }
  }
}
</style>
