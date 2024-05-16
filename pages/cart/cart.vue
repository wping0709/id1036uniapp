<template>
  <view class="body flex-col">
    <!-- #ifndef H5 -->
    <view
      class="diy_header"
      :style="{
        paddingTop: `${APP_INFO.STATUS_BAR_HEIGHT}px`,
        height: `${APP_INFO.HEADER_HEIGHT}px`
      }"
    >
      购物车
    </view>
    <!-- #endif -->

    <view class="top_1 flex-y-center flex-x-sb">
      <text>共{{ totalCount }}件商品</text>
      <text @click="clickModify" class="font-w-700 p-x-20">
        {{ isModify ? "完成" : "管理" }}
      </text>
    </view>
    <scroll-view scroll-y class="flex-h-1">
      <view class="goods-box">
        <!-- 购物车空 -->
        <template v-if="!goodsList.length && !mch_list.length">
          <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
        </template>

        <template v-else>
          <view class="mch-view" v-if="goodsList.length">
            <!-- 平台名称 -->
            <view @click="clickMchTitle(-1)" class="title flex-y-center">
              <text
                v-if="isMchCheck(-1)"
                class="iconfont icon-success-fill price-color font-50"
              ></text>
              <text
                v-else
                class="iconfont icon-xuanzekuangmoren color-666 font-50"
              ></text>

              <view class="font-600-30"> 平台自营 </view>
            </view>

            <u-swipe-action>
              <u-swipe-action-item
                :options="swipeData"
                @click="clickAction(item)"
                v-for="(item, index) in goodsList"
                :key="item.cart_id"
              >
                <view class="swipe-action">
                  <view class="swipe-action__content">
                    <view class="goods-item flex-x-sb">
                      <view class="">
                        <view
                          @click="
                            (!item.disabled || isModify) &&
                              goodsCheckChange(index, -1)
                          "
                          style="height: 100%"
                          class="flex-y-center flex-x-center"
                        >
                          <template v-if="!item.disabled || isModify">
                            <text
                              v-if="item.check"
                              class="iconfont icon-success-fill price-color"
                            ></text>
                            <text
                              v-else
                              class="iconfont icon-xuanzekuangmoren color-666"
                            ></text>
                          </template>

                          <template v-else>
                            <text
                              class="iconfont icon-jian"
                              style="color: #bfbfbf"
                            ></text>
                          </template>
                        </view>
                      </view>
                      <view
                        class="goods-item-right flex-w-1 flex-x-sb"
                        :style="{
                          borderBottomWidth:
                            index < goodsList.length - 1 ? '1px' : '0'
                        }"
                      >
                        <view class="left">
                          <image :src="item.goods_pic" mode="aspectFill" />
                          <image
                            v-if="item.num > item.max_num && item.max_num >= 0"
                            class="ps-img"
                            :src="wxapp_img.goods.goods_wukucun"
                            mode="aspectFill"
                          />

                          <view v-if="item.max_num == -1">
                            规格更改,不可购买,需删除
                          </view>
                        </view>
                        <view class="right flex-w-1">
                          <view class="goods-name u-line-2">
                            {{ item.goods_name }}
                          </view>
                          <view @click="showAttrPopup(item)" class="attr">
                            <view class="u-line-1">
                              <template
                                class="attr-list"
                                v-for="(attr, index) in item.attr_list"
                              >
                                {{ attr.attr_name
                                }}{{
                                  index < item.attr_list.length - 1 ? "，" : ""
                                }}
                              </template>

                              <!-- <text
                              class="iconfont icon-arrow-bottom m-l-10 font-26"
                            ></text> -->
                            </view>
                          </view>
                          <view class="price-num flex-x-sb flex-y-center">
                            <view class="price-color font-30">
                              <PriceText
                                :price="item.price"
                                :color="
                                  item.num > item.max_num && item.max_num >= 0
                                    ? '#BFBFBF'
                                    : 'red'
                                "
                                ySize="40rpx"
                                fSize="28rpx"
                              ></PriceText>
                            </view>

                            <view
                              class="num-box"
                              v-if="
                                !(item.num > item.max_num && item.max_num >= 0)
                              "
                            >
                              <u-number-box
                                v-model="item.num"
                                @change="numChange($event, index, 'goodsList')"
                                :min="1"
                                :max="item.max_num"
                                integer
                              ></u-number-box>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-swipe-action-item>
            </u-swipe-action>
          </view>

          <view
            class="mch-view"
            v-for="(mch, mchIndex) in mch_list"
            :key="mchIndex"
          >
            <!-- 平台名称 -->
            <view @click="clickMchTitle(mchIndex)" class="title flex-y-center">
              <text
                v-if="isMchCheck(mchIndex)"
                class="iconfont icon-success-fill price-color font-50"
              ></text>
              <text
                v-else
                class="iconfont icon-xuanzekuangmoren color-666 font-50"
              ></text>

              <view class="font-600-30"> {{ mch.name }} </view>
            </view>

            <u-swipe-action>
              <u-swipe-action-item
                :options="swipeData"
                @click="clickAction(item)"
                v-for="(item, index) in mch.list"
                :key="item.cart_id"
                :name="item.cart_id"
              >
                <view class="swipe-action">
                  <view class="swipe-action__content">
                    <view class="goods-item flex-x-sb">
                      <view class="">
                        <view
                          @click="
                            (!item.disabled || isModify) &&
                              goodsCheckChange(index, mchIndex)
                          "
                          style="height: 100%"
                          class="flex-y-center flex-x-center"
                        >
                          <template v-if="!item.disabled || isModify">
                            <text
                              v-if="item.check"
                              class="iconfont icon-success-fill price-color"
                            ></text>
                            <text
                              v-else
                              class="iconfont icon-xuanzekuangmoren color-666"
                            ></text>
                          </template>

                          <template v-else>
                            <text class="iconfont icon-jian color-666"></text>
                          </template>
                        </view>
                      </view>

                      <view
                        class="goods-item-right flex-w-1 flex-x-sb"
                        :style="{
                          borderBottomWidth:
                            index < mch.list.length - 1 ? '1px' : '0'
                        }"
                      >
                        <view class="left">
                          <image :src="item.goods_pic" mode="aspectFill" />
                          <image
                            v-if="item.num > item.max_num && item.max_num >= 0"
                            class="ps-img"
                            :src="wxapp_img.goods.goods_wukucun"
                            mode="aspectFill"
                          />

                          <view v-if="item.max_num == -1">
                            规格更改,不可购买,需删除
                          </view>
                        </view>
                        <view class="right flex-w-1">
                          <view class="goods-name u-line-2">
                            {{ item.goods_name }}
                          </view>
                          <view class="attr">
                            <view>
                              <template
                                class="attr-list"
                                v-for="(attr, index) in item.attr_list"
                              >
                                {{ attr.attr_name
                                }}{{
                                  index < item.attr_list.length - 1 ? "，" : ""
                                }}
                              </template>

                              <!-- <text
                              class="iconfont icon-arrow-bottom m-l-10 font-26"
                            ></text> -->
                            </view>
                          </view>
                          <view class="price-num flex-x-sb flex-y-center">
                            <view class="price-color font-30">
                              <PriceText
                                :price="item.price"
                                :color="
                                  item.num > item.max_num && item.max_num >= 0
                                    ? '#BFBFBF'
                                    : 'red'
                                "
                                ySize="40rpx"
                                fSize="28rpx"
                              ></PriceText>
                            </view>

                            <view
                              class="num-box"
                              v-if="
                                !(item.num > item.max_num && item.max_num >= 0)
                              "
                            >
                              <u-number-box
                                v-model="item.num"
                                @change="
                                  numChange($event, index, 'mch', mchIndex)
                                "
                                :min="1"
                                :max="item.max_num"
                                integer
                              ></u-number-box>
                            </view>
                          </view>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </u-swipe-action-item>
            </u-swipe-action>
          </view>
        </template>
      </view>

      <view
        @click="$utils.toUrl('/other/member/member')"
        v-if="
          store.is_member_price == 1 &&
          userInfo &&
          userInfo.level == -1 &&
          memberPrice.unitPrice > 0
        "
        class="huiyuan"
      >
        <view class="flex-y-center" style="font-size: 24rpx">
          <view>会员价</view>
          <view class="m-x-10 font-w-700 price-color"
            >¥{{ memberPrice.memberPrice }}</view
          >
          <view>立即省</view>
          <view class="m-x-10 font-w-700 price-color"
            >¥{{ memberPrice.unitPrice }}</view
          >
          <view class="m-x-10 font-w-700 price-color">开通会员></view>
        </view>
      </view>

      <!-- 全选粘性定位 -->
      <view class="total-box">
        <view class="flex-x-sb flex-y-center">
          <view class="flex-x-center flex-y-center font-24">
            <!-- 开启了合并支付 -->
            <template v-if="is_merge_pay">
              <text
                @click="clickQuanxuan"
                v-if="isAll"
                class="iconfont icon-success-fill price-color"
              ></text>
              <text
                @click="clickQuanxuan"
                v-else
                class="iconfont icon-xuanzekuangmoren color-666"
              ></text>

              <text class="" @click="clickQuanxuan">全选</text>
            </template>

            <view v-show="!isModify" class="flex-y-center m-l-20">
              <!-- 合计:￥{{ totalPrice }} -->
              <text>合计：</text>
              <PriceText
                :price="totalPrice"
                ySize="34rpx"
                fSize="24rpx"
                color="#333"
                fontWeight="700"
              ></PriceText>
            </view>
          </view>
          <view class="bt-box flex-y-centr flex-x-start">
            <view style="background: #ff1a21; font-weight: 700" @click="submit">
              {{ isModify ? "删除" : "去结算" }}({{ totalCheckGoods }})
            </view>
          </view>
        </view>
      </view>
      <TabBar ref="TabBar"></TabBar>

      <AttrPopup
        :goodsId="checkGoods.goods_id"
        ref="AttrPopup"
        type="cart"
        @confirm="attrConfirm"
      ></AttrPopup>
    </scroll-view>
  </view>
</template>

<script>
import TabBar from "@/components/TabBar";
import PriceText from "@/components/price-text/index";
import AttrPopup from "@/components/goods/AttrPopup";
import indexPop from "@/components/indexPop/indexPop.vue";
export default {
  components: {
    TabBar,
    PriceText,
    AttrPopup,
    indexPop
  },
  data() {
    return {
      swipeData: [
        {
          text: "删除",
          style: {
            width: "136rpx",
            color: "#fff",
            background: "#ff1b22"
          }
        }
      ],
      goodsList: [], //自营商品列表
      mch_list: [], //入住商列表
      check: true,
      isModify: false,
      isAll: false,
      checkGoods: {
        goods_id: ""
      }, //当前选中商品
      is_merge_pay: 1, //支付合并提交
      APP_INFO: {
        HEADER_ALL_HEIGHT: 0,
        HEADER_HEIGHT: 0,
        STATUS_BAR_HEIGHT: 0
      }
    };
  },
  onShow() {
    this.loadData();

    this.$nextTick(() => {
      this.$refs["TabBar"].getData();
    });
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.cart.getCartList({}, true);
      this.goodsList = res.data.list;
      this.mch_list = res.data.mch_list;
      this.is_merge_pay = res.data.is_merge_pay;
    },
    goodsCheckChange(goodsIndex, mchIndex) {
      if (!this.is_merge_pay) {
        // (已选平台商品 && 选择商户商品)  || (已选商户商品 && 选择的商品不是已选商户商品 || 选择平台商品)
        if (
          (this.checkPtGoods && mchIndex > -1) ||
          (this.checkMchGoods &&
            (this.checkMchGoods != this.mch_list[mchIndex]?.id ||
              this.checkPtGoods))
        )
          return uni.$u.toast("当前未开通合并支付");
      }

      if (mchIndex == -1) {
        this.goodsList[goodsIndex].check = !this.goodsList[goodsIndex].check;
        this.$set(this.goodsList, goodsIndex, this.goodsList[goodsIndex]);
      } else {
        this.mch_list[mchIndex].list[goodsIndex].check =
          !this.mch_list[mchIndex].list[goodsIndex].check;
        this.$set(this.mch_list, mchIndex, this.mch_list[mchIndex]);
      }
    },
    async numChange({ value }, index, key, mchIndex) {
      if (key == "goodsList") {
        this.$set(this.goodsList[index], "num", value);
        console.log(this.goodsList[index]);
      } else if (key == "mch") {
        this.$set(this.mch_list[mchIndex].list[index], "num", value);
        console.log(this.mch_list[mchIndex].list[index]);
      }
      // this.$nextTick(async () => {
      let formData = {
        list: JSON.stringify(this.goodsList),
        mch_list: JSON.stringify(this.mch_list)
      };
      // console.log(formData);
      await this.$requestAll.cart.cartEdit(formData).then(() => {
        this.loadData();
      });
      // });
    },
    // 全选chenge
    clickQuanxuan() {
      const isAllcheck = this.isAll;
      if (this.isModify) {
        this.goodsList = this.goodsList.map((goods) => {
          goods.check = !isAllcheck;
          return goods;
        });

        this.mch_list.forEach((mch) => {
          mch.list.forEach((goods) => {
            goods.check = !isAllcheck;
          });
        });
        this.$set(this, "mch_list", this.mch_list);
      } else {
        this.goodsList = this.goodsList.map((goods) => {
          if (!goods.disabled) goods.check = !isAllcheck;
          return goods;
        });

        this.mch_list.forEach((mch) => {
          mch.list.forEach((goods) => {
            if (!goods.disabled) goods.check = !isAllcheck;
          });
        });
        this.$set(this, "mch_list", this.mch_list);
      }
    },
    // 点击平台全选
    clickMchTitle(index) {
      if (!this.is_merge_pay) {
        // (已选平台商品 && 选择商户商品)  || (已选商户商品 && 选择的商品不是已选商户商品 || 选择平台商品)
        if (
          (this.checkPtGoods && index > -1) ||
          (this.checkMchGoods &&
            (this.checkMchGoods != this.mch_list[index]?.id ||
              this.checkPtGoods))
        )
          return uni.$u.toast("当前未开通合并支付");
      }

      const check = this.isMchCheck(index);
      if (index < 0) {
        this.goodsList = this.goodsList.map((goods) => {
          // 是编辑就全选
          if (this.isModify) {
            goods.check = !check;
          } else {
            // 不是编辑只选可选项
            if (!goods.disabled) {
              goods.check = !check;
            }
          }
          console.log(goods);
          return goods;
        });
      } else {
        this.mch_list[index].list = this.mch_list[index].list.map((goods) => {
          // 是编辑就全选
          if (this.isModify) {
            goods.check = !check;
          } else {
            // 不是编辑只选可选项
            if (!goods.disabled) {
              goods.check = !check;
            }
          }
          return goods;
        });

        this.$set(this, "mch_list", this.mch_list);
      }
    },
    // 统计是否全选
    isAllcheck() {
      var checkNum = 0;
      var goodsLength = 0;
      // 编辑选中统计
      if (this.isModify) {
        this.goodsList.forEach((goods) => {
          // 计算选中商品长度
          if (goods.check) {
            checkNum++;
          }
          goodsLength++;
        });
        this.mch_list.forEach((mch) => {
          mch.list.forEach((goods) => {
            if (goods.check) {
              checkNum++;
            }
            goodsLength++;
          });
        });
      }
      // 购买选中
      else {
        this.goodsList.forEach((goods) => {
          // 计算选中可用商品长度
          if (goods.check && !goods.disabled) {
            checkNum++;
          }
          // 计算可用商品长度
          if (!goods.disabled) {
            goodsLength++;
          }
        });
        this.mch_list.forEach((mch) => {
          mch.list.forEach((goods) => {
            // 计算选中可用商品长度
            if (goods.check && !goods.disabled) {
              checkNum++;
            }
            // 计算可用商品长度
            if (!goods.disabled) {
              goodsLength++;
            }
          });
        });
      }
      this.isAll = checkNum == goodsLength && goodsLength >= 1;
    },
    clickModify() {
      this.isModify = !this.isModify;

      // 编辑切换购买状态
      if (!this.isModify) {
        let goodsList = this.goodsList.map((item) => {
          if (item.num > item.max_num && item.max_num >= 0) {
            console.log(item, 11111111);
            item.check = false;
          }
          return item;
        });

        let mch_list = this.mch_list.map((mch) => {
          mch.list.forEach((item) => {
            if (item.num > item.max_num && item.max_num >= 0) {
              console.log(item, 11111111);
              item.check = false;
            }
          });
          return mch;
        });
        this.$set(this, "mch_list", mch_list);
        this.$set(this, "goodsList", goodsList);
      }
    },
    submit() {
      if (this.totalCheckGoods <= 0)
        return uni.$u.toast("您还未选择结算商品！");
      // 当前为删除
      if (this.isModify) {
        let checkArr = [];
        this.goodsList.forEach((goods) => {
          if (goods.check) {
            checkArr.push(goods.cart_id);
          }
        });
        this.mch_list.forEach((mch) => {
          mch.list.forEach((goods) => {
            if (goods.check) {
              checkArr.push(goods.cart_id);
            }
          });
        });
        if (!checkArr.length) return this.$utils.toast("请选择删除项");
        uni.showModal({
          title: "提示",
          content: `确认删除${checkArr.length}项内容`,
          success: async (res) => {
            if (res.confirm) {
              await this.$requestAll.cart.delCartList({
                cart_id_list: JSON.stringify(checkArr)
              });
              this.loadData();
              this.$store.dispatch("getTabBarData");
            } else if (res.cancel) {
              console.log("用户点击取消");
            }
          }
        });
      }
      // 当前为结算
      else {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaa");
        // #ifdef APP-PLUS
        if (this.systemInfo.osName !== "ios") {
          uni.showModal({
            title: "提示",
            content: "是否同意系统获取您的位置信息?用于获取收货地址信息",
            success: ({ confirm, cancel }) => {
              if (confirm) {
                uni.showLoading({
                  title: "加载中"
                });
                let goods_list = [];
                let mch_list = [];
                this.goodsList.forEach((goods) => {
                  if (goods.check) goods_list.push({ cart_id: goods.cart_id });
                });
                if (goods_list.length) mch_list.push({ mch_id: 0, goods_list });

                this.mch_list.forEach((mch) => {
                  let goods_list = [];
                  mch.list.forEach((goods) => {
                    if (goods.check)
                      goods_list.push({ cart_id: goods.cart_id });
                  });
                  if (goods_list.length)
                    mch_list.push({ mch_id: mch.id, goods_list });
                });
                console.log(mch_list);
                this.$utils.toUrl(
                  "/pages/order-submit/order-submit?mch_list=" +
                    JSON.stringify(mch_list)
                );
              }
            }
          });
        } else {
          uni.showLoading({
            title: "加载中"
          });
          let goods_list = [];
          let mch_list = [];
          this.goodsList.forEach((goods) => {
            if (goods.check) goods_list.push({ cart_id: goods.cart_id });
          });
          if (goods_list.length) mch_list.push({ mch_id: 0, goods_list });

          this.mch_list.forEach((mch) => {
            let goods_list = [];
            mch.list.forEach((goods) => {
              if (goods.check) goods_list.push({ cart_id: goods.cart_id });
            });
            if (goods_list.length)
              mch_list.push({ mch_id: mch.id, goods_list });
          });
          console.log(mch_list);
          this.$utils.toUrl(
            "/pages/order-submit/order-submit?mch_list=" +
              JSON.stringify(mch_list)
          );
        }
        // #endif
        // #ifdef MP-WEIXIN || H5
        uni.showLoading({
          title: "加载中"
        });
        let goods_list = [];
        let mch_list = [];
        this.goodsList.forEach((goods) => {
          if (goods.check) goods_list.push({ cart_id: goods.cart_id });
        });
        if (goods_list.length) mch_list.push({ mch_id: 0, goods_list });

        this.mch_list.forEach((mch) => {
          let goods_list = [];
          mch.list.forEach((goods) => {
            if (goods.check) goods_list.push({ cart_id: goods.cart_id });
          });
          if (goods_list.length) mch_list.push({ mch_id: mch.id, goods_list });
        });
        console.log(mch_list);
        this.$utils.toUrl(
          "/pages/order-submit/order-submit?mch_list=" +
            JSON.stringify(mch_list)
        );
        // #endif
      }
    },
    clickAction(e) {
      uni.showModal({
        title: "提示",
        content: `确认删除当前选中商品吗？`,
        success: async (res) => {
          if (res.confirm) {
            await this.$requestAll.cart.delCartList({
              cart_id_list: JSON.stringify([e.cart_id])
            });
            this.loadData();
            this.$store.dispatch("getTabBarData");
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    },
    showAttrPopup(item) {
      // this.checkGoods = item;
      // this.$refs['AttrPopup'].modifySelect({
      //   attr_list: item.attr_list,
      //   num: item.num,
      //   goods_id: item.goods_id,
      // });
      // this.$refs['AttrPopup'].showPopup('');
    },
    attrConfirm(result) {
      console.log(result);
    }
  },
  watch: {
    goodsList: {
      handler() {
        this.isAllcheck();
      },
      deep: true
    },
    mch_list: {
      handler() {
        this.isAllcheck();
      },
      deep: true
    }
  },
  computed: {
    // 商家是否全选判断
    isMchCheck() {
      return function (mchIndex) {
        var checkNum = 0;
        var goodsLength = 0;
        // 编辑选中统计
        if (this.isModify) {
          if (mchIndex == -1) {
            this.goodsList.forEach((goods) => {
              // 计算选中商品长度
              if (goods.check) {
                checkNum++;
              }
              goodsLength++;
            });
            return checkNum == goodsLength && goodsLength > 0;
          } else {
            this.mch_list[mchIndex]?.list.forEach((goods) => {
              // 计算选中商品长度
              if (goods.check) {
                checkNum++;
              }
              goodsLength++;
            });

            return checkNum == goodsLength && goodsLength > 0;
          }
        }
        // 购买选中
        else {
          if (mchIndex == -1) {
            this.goodsList.forEach((goods) => {
              // 计算选中可用商品长度
              if (goods.check && !goods.disabled) {
                checkNum++;
              }
              // 计算可用商品长度
              if (!goods.disabled) {
                goodsLength++;
              }
            });

            return checkNum == goodsLength && goodsLength > 0;
          } else {
            this.mch_list[mchIndex]?.list.forEach((goods) => {
              // 计算选中可用商品长度
              if (goods.check && !goods.disabled) {
                checkNum++;
              }
              // 计算可用商品长度
              if (!goods.disabled) {
                goodsLength++;
              }
            });

            return checkNum == goodsLength && goodsLength > 0;
          }
        }
      };
    },

    totalPrice() {
      let mch_list = this.mch_list;
      let goodsList = this.goodsList;
      let totalPrice = 0;
      if (goodsList.length) {
        goodsList.forEach((goods) => {
          if (goods.check) {
            totalPrice += goods.price;
          }
        });
      }
      if (mch_list.length) {
        mch_list.forEach((mch) => {
          mch.list.forEach((goods) => {
            if (goods.check) {
              totalPrice += goods.unitPrice * goods.num;
            }
          });
        });
      }
      return totalPrice.toFixed(2);
    },
    totalCount() {
      let gLength = this.goodsList.length;
      let mLength = 0;
      this.mch_list.forEach((item) => {
        mLength += item.list.length;
      });
      return gLength + mLength;
    },
    userInfo() {
      return this.$store.getters["user/userInfo"];
    },
    memberPrice() {
      let totalPrice = {
        memberPrice: 0,
        unitPrice: 0
      };
      if (this.goodsList.length) {
        this.goodsList.forEach((item) => {
          if (item.check) {
            totalPrice.memberPrice += item.unit_become_level_price;
            totalPrice.unitPrice += item.price - item.unit_become_level_price;
          }
        });
      }
      if (this.mch_list.length) {
        this.mch_list.forEach((mch) => {
          mch.list.forEach((item) => {
            if (item.check) {
              totalPrice.memberPrice += item.unit_become_level_price;
              totalPrice.unitPrice += item.price - item.unit_become_level_price;
            }
          });
        });
      }

      for (const key in totalPrice) {
        totalPrice[key] = totalPrice[key].toFixed(2);
      }
      return totalPrice;
    },
    totalCheckGoods() {
      let total = 0;
      if (this.goodsList.length) {
        this.goodsList.forEach((item) => {
          item.check && total++;
        });
      }
      if (this.mch_list.length) {
        this.mch_list.forEach((mch) => {
          mch.list.forEach((item) => {
            item.check && total++;
          });
        });
      }
      return total;
    },
    // 店铺商品是否有显示
    checkMchGoods() {
      for (let i = 0; i < this.mch_list.length; i++) {
        const mch = this.mch_list[i];
        for (let mchIndex = 0; mchIndex < mch.list.length; mchIndex++) {
          const goods = mch.list[mchIndex];
          if (goods.check) return mch.id;
        }
      }
      return false;
    },
    // 平台商品是否有选中
    checkPtGoods() {
      for (let i = 0; i < this.goodsList.length; i++) {
        const goods = this.goodsList[i];
        if (goods.check) return true;
      }
      return false;
    }
    // 是否为置灰状态
    // isDisable() {
    //   return function (item) {
    //     if (item) {
    //       return item.num > item.max_num && item.max_num >= 0;
    //     }
    //     return false;
    //   };
    // },
  },
  created() {
    this.APP_INFO = uni.getStorageSync("APP_INFO") || {
      HEADER_ALL_HEIGHT: 0,
      HEADER_HEIGHT: 0,
      STATUS_BAR_HEIGHT: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.font-50 {
  font-size: 50rpx;
}
.body {
  // padding-bottom: 10rpx;
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  .diy_header {
    padding: 0 25rpx;
    /* #ifdef APP-PLUS */
    font-weight: bold;
    letter-spacing: 2rpx;
    font-size: 30rpx;
    /* #endif */
    /* #ifdef MP-WEIXIN */
    font-size: 24rpx;
    /* #endif */
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;
  }
  .top_1 {
    line-height: 80rpx;
    background: #fff;
    padding: 0 20rpx;
    font-size: 26rpx;
  }

  .goods-list {
    margin-bottom: 20rpx;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }

  .icon-success-fill,
  .icon-xuanzekuangmoren,
  .icon-jian {
    width: 50rpx;
    height: 50rpx;
    line-height: 50rpx;
    font-size: 50rpx;
    text-align: center;
    margin-right: 24rpx;
    color: #bfbfbf;
  }
  .price-color {
    color: red;
  }
}
.goods-box {
  margin: 0 20rpx;
  .mch-view {
    margin: 20rpx 0;
    padding: 24rpx;
    background: #fff;
    border-radius: 20rpx;
    &:nth-last-child(1) {
      margin-bottom: 0;
    }
  }
}
.goods-item {
  // margin-bottom: 30rpx;

  &:nth-last-child(1) {
    margin-bottom: 0;
  }

  .left {
    position: relative;
    > image {
      border-radius: 10rpx;
      width: 168rpx;
      height: 168rpx;
    }
    .ps-img {
      position: absolute;
      left: 0;
      top: 0;
    }
    > view {
      white-space: nowrap;
      position: absolute;
      left: 0;
      bottom: 0;
      background: #ffd3d6;
      font-size: 24rpx;
      color: red;
      padding: 5rpx 10rpx;
    }
  }
  .goods-item-right {
    padding: 24rpx 0;
    border-bottom: 1px solid #f8f8f8;
  }
  .right {
    margin-left: 20rpx;
    .goods-name {
      font-size: 26rpx;
      height: 80rpx;
      line-height: 40rpx;
      margin-bottom: 20rpx;
    }
    .attr {
      margin-bottom: 16rpx;
      display: flex;
      > view {
        border-radius: 30rpx;
        background: #f2f2f2;
        padding: 0 20rpx;
        line-height: 40rpx;
        font-size: 22rpx;
        color: #999;
      }
    }
  }
}
.huiyuan {
  height: 72rpx;
  > view {
    position: fixed;
    z-index: 999;

    bottom: 215rpx;
    bottom: calc(215rpx + env(safe-area-inset-bottom));

    left: 0;
    width: 100%;
    height: 72rpx;
    padding: 0 20rpx;

    background: #fdf2f2;
    font-size: 30rpx;
    // border-bottom: 2rpx solid #eee;
  }

  .bt-box {
    > view {
      margin-left: 20rpx;
      line-height: 70rpx;
      text-align: center;
      border-radius: 40rpx;
      padding: 0 40rpx;
      color: #fff;
    }
  }
}
.total-box {
  height: 100rpx;
  > view {
    position: fixed;
    z-index: 999;

    bottom: 115rpx;
    bottom: calc(115rpx + env(safe-area-inset-bottom));

    left: 0;
    width: 100%;
    height: 100rpx;
    padding: 0 20rpx;
    background: #fff;
    font-size: 30rpx;
    border-bottom: 2rpx solid #eee;
    border-top: 2rpx solid #eee;
  }

  .bt-box {
    > view {
      margin-left: 20rpx;
      line-height: 70rpx;
      text-align: center;
      border-radius: 40rpx;
      padding: 0 40rpx;
      color: #fff;
    }
  }
}
</style>
