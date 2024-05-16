<template>
  <view class="order-submit" style="">
    <!-- #ifdef H5 -->
    <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
    <!-- #endif -->
    <template v-if="orderDetail">
      <!-- 收货地址 -->
      <view v-if="!pack">
        <Address :address="address" :shopDisplay="shopDisplay"></Address>
      </view>
      <!-- 商家商品及赠品 -->
      <template v-for="(item, index) in orderDetail.mch_list">
        <!-- 表单 -->
        <SubmitForm
          class="SubmitFrom"
          v-if="item.form && item.form.is_form == 1"
          :form.sync="item.form"
          :key="index"
        ></SubmitForm>

        <view class="mch-item" :key="index">
          <view class="m-y-20">
            <div
              v-if="item.name"
              class="p-y-20 font-w-700"
              style="padding: 0 28rpx; line-height: 100rpx"
            >
              <text class="iconfont icon-store font-36"></text>
              <text class="font-30 font-w-700 m-l-10">{{ item.name }}</text>
            </div>
            <!-- 商品 -->

            <Goods
              @goodsChange="goodsChange($event, item)"
              :goodsList="item.goods_list"
            ></Goods>

            <!-- 订单赠送 -->
            <GiveGoods
              :goodsData="item.give_list"
              width="80rpx"
              height="80rpx"
              :title="['订单满额赠送', ' 任选其一']"
              :isClick="true"
              @clickGive="clickGive($event, item)"
            ></GiveGoods>
          </view>

          <!-- 买家留言 -->
          <view class="p-x-20 flex-x-sb leave p-t-10">
            <view>留言</view>
            <view class="flex-w-1 flex-y-center m-l-20">
              <u-textarea
                :placeholderStyle="{
                  fontSize: '26rpx',
                  lineHeight: '30rpx',
                  textAlign: 'right',
                }"
                v-model="item.content"
                class="textarea"
                placeholder="请填写备注"
                autoHeight
                border="none"
              >
              </u-textarea>
            </view>
          </view>

          <!-- 配送方式 -->
          <view v-if="!pond_id && !pack" class="OrderDelivery">
            <OrderDelivery
              :mchData="item"
              :send_type="item.send_type"
              :delivery_method="item.delivery_method"
              :current_type="item.default_send_type"
              @deliveryChange="deliveryChange($event, item, index)"
              :location="address"
              @confirm="shopConfirm($event, item, index)"
            ></OrderDelivery>
          </view>
          <template v-if="item.default_send_type == 'waimai'">
            <view
              v-if="!item.waimai_delivery"
              class="price-color p-x-28 p-b-30"
            >
              当前地址不在配送范围
            </view>
            <view
              v-if="item.total_price < item.initial_delivery_amount"
              class="price-color p-x-28 p-b-30"
            >
              起送金额未达到￥{{ item.initial_delivery_amount }}
            </view>
          </template>
        </view>

        <view class="youhui-box" :key="index" v-if="!pack">
          <!-- 满减折扣 -->
          <!-- 有满减 &&  (不能同时使用优惠券 &&  未选择优惠券   ||   可以同时使用优惠券) -->
          <view
            v-if="
              item.minus_num > 0 &&
              ((!item.minus_num_is_use_coupon &&
                (!item.picker_coupon || !item.picker_coupon.user_coupon_id)) ||
                item.minus_num_is_use_coupon)
            "
            class="p-x-20 flex-x-sb flex-y-center height100"
          >
            <view class=""> 满减 </view>
            <view class="price-color font-w-700">
              <text>{{ item.minus_num }}折</text>
              <text class="iconfont icon-arrow-right color-transparent"></text>
            </view>
          </view>

          <!-- 选择优惠券 -->
          <view v-if="item.coupon_list.length" class="p-x-20">
            <GoodsCoupon
              @checkCoupon="couponChange($event, item, index)"
              type="select"
              showText
              :goodsData="{ couponList: item.coupon_list }"
              :currenCoupon="item.picker_coupon || item.coupon_list[0]"
            ></GoodsCoupon>
          </view>

          <!-- 积分 -->
          <view
            v-if="item.integral.forehead > 0"
            class="p-x-20 flex-x-sb flex-y-center height100"
          >
            <view class="">
              {{ item.integral.forehead_integral }}积分抵扣{{
                item.integral.forehead
              }}元
            </view>
            <view class="">
              <u-switch
                v-model="submitData.use_integral"
                :activeValue="1"
                :inactiveValue="2"
                size="20"
              >
              </u-switch>
            </view>
          </view>

          <!-- 满减 -->
          <!-- 有满减 &&  (不能同时使用优惠券 &&  未选择优惠券   ||   可以同时使用优惠券) -->
          <view
            v-if="
              item.minus_price > 0 &&
              ((!item.minus_price_is_use_coupon &&
                (!item.picker_coupon || !item.picker_coupon.user_coupon_id)) ||
                item.minus_price_is_use_coupon)
            "
            class="p-x-20 flex-x-sb flex-y-center height100"
          >
            <view>满减</view>
            <view class="price-color font-w-700">
              <text>-{{ item.minus_price }}</text>
              <text class="iconfont icon-arrow-right color-transparent"></text>
            </view>
          </view>

          <!-- 运费 -->
          <view class="p-x-20 flex-x-sb flex-y-center height100" v-if="!pack">
            <view>运费</view>
            <view class="font-w-600">
              <text>￥{{ freight(item) }}</text>
              <text class="iconfont icon-arrow-right color-transparent"></text>
            </view>
          </view>

          <!-- 打包费 -->
          <view
            v-if="item.dabao_price > 0"
            class="p-x-20 flex-x-sb flex-y-center height100"
          >
            <view>打包费</view>
            <view class="font-w-600">
              <text>￥{{ item.dabao_price }}</text>
              <text class="iconfont icon-arrow-right color-transparent"></text>
            </view>
          </view>
        </view>
      </template>

      <BottomBar
        :pack="pack"
        :totalPrice="totalPrice"
        :memberPrice="memberPrice"
        @submit="onOrderSubmit"
        :shopDisplay="shopDisplay"
        :waimaiDisplay="waimaiDisplay"
      ></BottomBar>
      <WxOpenSubscribe :template="orderDetail.message_info"></WxOpenSubscribe>
    </template>
    <u-popup
      :show="showMemberModal"
      bgColor="transparent"
      mode="center"
      :safe-area-inset-bottom="false"
    >
      <div class="member-popup p-b-20">
        <div class="font-600-32 p-y-30">该商品是会员专享商品</div>
        <div class="msg p-b-30">您还不满足会员等级</div>
        <div
          @click="$utils.toUrl('/vipcard/index/index', 'redirectTo')"
          class="bt m-t-20"
        >
          立即前往升级
        </div>
        <div
          @click="showMemberModal = false"
          class="iconfont icon-reeor color-999"
        ></div>
      </div>
    </u-popup>
  </view>
</template>

<script>
import Address from "./components/Address";
import GiveGoods from "@/components/goods/GiveGoods";
import GoodsCoupon from "@/pages/goods/components/goods-coupon";
import OrderDelivery from "@/components/OrderDelivery/OrderDelivery";
import BottomBar from "./components/bottom-bar";
import Goods from "./components/Goods";
import OrderPay from "@/mixins/OrderPay.js";
import SubmitForm from "./components/SubmitForm";
import WxOpenSubscribe from "@/components/wx-open-subscribe";
export default {
  mixins: [OrderPay],
  components: {
    Address,
    GiveGoods,
    BottomBar,
    Goods,
    GoodsCoupon,
    OrderDelivery,
    SubmitForm,
    WxOpenSubscribe,
  },
  data() {
    return {
      topdata: {},
      pack: "",
      lottery_id: "", //抽奖商品id信息
      pond_id: "", //九宫格重讲商品id信息
      goods_info: "", //抽奖商品信息 或者 九宫格抽奖商品信息
      isNewOrder: false, // 是否为线下购物车订单
      params: {},

      address: "", //地址
      orderDetail: "", //订单信息
      totalPrice: {
        totalPrice: 0,
      },
      submitData: {
        use_integral: 2,
        address_id: "",
      },
      showMemberModal: false, //会员等级不足引导弹框开关
      room_id: 0,
    };
  },
  onLoad(params) {
    console.log("params", params);
    if (params.topdata) {
      this.topdata = JSON.parse(params.topdata);
      this.pack = this.topdata.pack;
      console.log("pack", this.pack);
    }

    if (params.goodsData)
      params.goodsData = decodeURIComponent(params.goodsData);
    this.params = params;
    this.room_id = params.room_id || 0;

    if (params.goodsData) {
      this.params = params.goodsData;
    } else if (params.cartData) {
      this.params = params.cartData;
    } else if (params.mch_list) {
      // 是否为线下购物车订单
      this.isNewOrder = params.isNewOrder && params.isNewOrder;
      this.params = params.mch_list;
    }
    // 九宫格抽奖
    else if (params.pond_id) {
      this.pond_id = params.pond_id;
      this.goods_info = params.goods_info;
    }

    if (params.lottery_id) {
      this.lottery_id = params.lottery_id;
      this.goods_info = params.goods_info;
      this.params = JSON.stringify([
        {
          mch_id: 0,
          goods_list: [JSON.parse(params.goods_info)],
        },
      ]);
    }

    this.getOrderDetail();
  },
  onShow() {
    console.log("this", this);
    const address = uni.getStorageSync("address");
    if (address) {
      this.address = address;
      uni.removeStorageSync("address");
      this.orderDetail = this.$options.data().orderDetail;
      this.getOrderDetail();
    }
  },
  methods: {
    // 获取订单详情
    async getOrderDetail() {
      const locationData = await this.$store.dispatch("GETLOCATION");

      var params = {
        address_id: this.address && this.address.id,
        longitude: locationData.longitude,
        latitude: locationData.latitude,
        mch_list: this.params,
        goods_info: this.goods_info,
      };

      // 九宫格抽奖订单信息接口为preview
      if (this.pond_id) {
        var res = await this.$requestAll.order.orderSubmitPreview(params, true);
        res.data.mch_list = [
          {
            ...res.data,
            default_send_type: "express",
            goods_list: res.data.list.map((goods) => {
              goods.original_price = goods.price;
              return goods;
            }),
          },
        ];
        res.data.mch_list.forEach((mch) => {
          // 抽奖商品需去除一些优惠
          mch.coupon_list = ""; //优惠券
          mch.total_price = 0; //合计金额
          mch.goods_list.forEach((item) => {
            item.single_price = 0;
            item.original_price = 0;
            item.price = 0;
          });
        });
      }
      // 刮刮卡获取订单信息
      else if (this.params.scratch_id) {
        params.mch_list = "";
        params.goods_info = this.params.goods_info;
        var res = await this.$requestAll.order.orderSubmitPreview(params, true);
        res.data.mch_list = [
          {
            ...res.data,
            default_send_type: "express",
            goods_list: res.data.list.map((item) => {
              delete item.price;
              return item;
            }),
            send_type: ["express"],
            total_price: 0,
          },
        ];
      }
      // 众筹订单
      else if (this.params.pageType == "crowdfund") {
        var res = await this.$requestAll.crowdfund.submitPreview(
          {
            goods_info: this.params.goods_info,
          },
          true
        );

        res.data = {
          address: res.data.address,
          mch_list: [
            {
              goods_list: res.data.list,
              send_type: res.data.send_type,
              total_price: res.data.total_price,
              default_send_type: "express",
              // coupon_list: res.data.coupon_list,
              coupon_list: [],
              dabao_price: 0,
              express_price: 0,
            },
          ],
        };
      }

      // 步数宝订单
      else if (this.params.pageType == "step") {
        delete params.mch_list;
        params = {
          ...params,
          ...this.params,
        };
        delete params.pageType;
        var res = await this.$requestAll.order.orderSubmitPreview(params, true);
        res.data = {
          address: res.data.address,
          mch_list: [
            {
              ...res.data,
              form: res.data.form,
              goods_list: res.data.list.map((goods) => {
                delete goods.price;
                return goods;
              }),
              send_type: ["express"],
              total_price: res.data.total_price,
              default_send_type: "express",
              coupon_list: [],
              dabao_price: res.data.dabao_price,
            },
          ],
        };
      }
      // 线下购物车订单
      else if (this.isNewOrder) {
        var res = await this.$requestAll.order.orderNewSubmitPreview(
          params,
          true
        );
      }
      // 普通订单
      else {
        var res = await this.$requestAll.order
          .getOrderSubmit(params, true)
          .catch((err) => err);
        if (res.code == 1 && res.msg == "不满足会员等级") {
          this.showMemberModal = true;
          return;
        }
      }

      this.orderDetail = res.data;

      // 抽奖兑换不需要选择配送方式
      if (!this.pond_id) {
        this.orderDetail.mch_list.forEach((item) => {
          if (
            item.default_send_type &&
            item.send_type &&
            item.send_type.length
          ) {
            let i = item.send_type.findIndex(
              (item1) => item1 == item.default_send_type
            );
            i == -1 && (item.default_send_type = item.send_type[0]);
          }
        });
      }
      this.address = res.data.address;

      if (this.lottery_id) {
        delete res.data.integral;
        res.data.mch_list.forEach((mch) => {
          // 抽奖商品需去除一些优惠
          mch.give_list = ""; //赠送商品
          mch.coupon_list = ""; //优惠券
          mch.minus_price = ""; //满减
          mch.dabao_price = 0; //打包费
          mch.total_price = 0; //合计金额
          mch.waimai_delivery_cost = 0; //外卖费
          mch.send_type = ["express"]; //配送方式
        });
      }
      // 计算合计金额
      this.countPrice();
    },
    // 计算合计金额
    countPrice() {
      console.log("重新计算金额");
      const mch_list = this.orderDetail.mch_list;

      if (this.params.pageType == "step") {
        this.totalPrice = {
          expressPrice:
            Number(mch_list[0].express_price) + Number(mch_list[0].dabao_price),
          totalPrice: mch_list[0].total_price,
          pageType: this.params.pageType || "",
        };

        return;
      }

      let totalPrice = {
        expressPrice: 0,
        totalPrice: 0,
      };

      mch_list.forEach((mch) => {
        // 运费
        if (mch.default_send_type == "express") {
          totalPrice.totalPrice += mch.express_price * 1;
        } else if (mch.default_send_type == "waimai") {
          totalPrice.totalPrice += mch.waimai_delivery_cost * 1;
        }

        // 满折
        // <!-- 有满减 &&  (不能同时使用优惠券 &&  未选择优惠券   ||   可以同时使用优惠券) -->
        if (
          mch.minus_num > 0 &&
          (mch.minus_num_is_use_coupon ||
            (!mch.minus_num_is_use_coupon &&
              (!mch.picker_coupon || !mch.picker_coupon.user_coupon_id)))
        ) {
          totalPrice.totalPrice -= mch.total_price * (1 - mch.minus_num / 10);
        }

        // 满减金额
        // <!-- 有满减 &&  (不能同时使用优惠券 &&  未选择优惠券   ||   可以同时使用优惠券) -->
        if (
          mch.minus_price > 0 &&
          (mch.minus_price_is_use_coupon ||
            (!mch.minus_price_is_use_coupon &&
              (!mch.picker_coupon || !mch.picker_coupon.user_coupon_id)))
        ) {
          totalPrice.totalPrice -= mch.minus_price * 1;
        }

        // 积分
        if (this.submitData.use_integral == 1) {
          totalPrice.totalPrice -= mch.integral.forehead;
        }

        // 优惠券
        //只要选择优惠券就减去优惠券金额，满减，及满折已做选择优惠券判断
        if (mch.picker_coupon && mch.picker_coupon.user_coupon_id) {
          totalPrice.totalPrice -= mch.picker_coupon.sub_price;
        }

        // 打包费
        if (mch.dabao_price > 0) {
          totalPrice.totalPrice += mch.dabao_price * 1;
        }

        totalPrice.totalPrice += mch.total_price * 1;
      });

      if (totalPrice.totalPrice < 0) totalPrice.totalPrice = 0;

      // 处理计算出现多小数
      for (const key in totalPrice) {
        totalPrice[key] = totalPrice[key].toFixed(2);
      }
      this.totalPrice = totalPrice;
    },
    // 商家赠品选择
    clickGive(id, item) {
      const list = item.give_list;
      for (let it in list) {
        if (list[it].id == id) {
          list[it].check = true;
        } else {
          list[it].check = false;
        }
      }
      item.give_id = id;
      this.$forceUpdate();
    },
    // 商品赠品选择
    goodsChange(e, item) {
      item.goods_list = e;
      this.$forceUpdate();
    },

    // 配送方式改变
    deliveryChange(val, mch, index) {
      console.log("配送方式更改");

      mch.default_send_type = val;
      // this.$set(this.orderDetail.mch_list[index], 'default_send_type', val);
      this.$set(this.orderDetail.mch_list, index, mch);
      this.countPrice();
    },
    // 门店改变
    shopConfirm(shop, mch, index) {
      mch.shop = shop.shop;

      this.$set(this.orderDetail.mch_list, index, mch);
      console.log(this.orderDetail.mch_list);
    },
    // 选择优惠券改变
    couponChange(coupon, item, index) {
      console.log(item, "選擇優惠卷");

      item.picker_coupon = coupon;
      this.$set(this.orderDetail.mch_list, index, item);
      this.countPrice();
    },

    // 订单提交
    async onOrderSubmit() {
      uni.$u.throttle(async () => {
        try {
          if (!this.address && !this.pack) throw "请选择收货地址";
          var mch_list = this.orderDetail.mch_list;
          mch_list.forEach((mch) => {
            if (!mch.default_send_type) throw "请选择配送方式";
            if (
              mch.default_send_type == "shop" &&
              (!mch.shop || !mch.shop.id) &&
              !this.pack
            )
              throw "请选择门店信息";

            if (mch.default_send_type == "shop" && !this.pack) {
              mch.offline = 1;
              mch.waimai = 0;
              mch.offline_name = this.address.name;
              mch.offline_mobile = this.address.mobile;
            } else if (mch.default_send_type == "express") {
              mch.offline = 0;
              mch.waimai = 0;
            } else if (mch.default_send_type == "waimai") {
              mch.offline = 0;
              mch.waimai = 1;
            } else if (this.pack) {
              mch.offline = 1;
            }

            // 表单验证
            mch.form &&
              mch.form.is_form &&
              mch.form.list.forEach((item) => {
                let defaultType = [
                  "text",
                  "textarea",
                  "date",
                  "time",
                  "uploadImg",
                ];
                if (item.required == 1) {
                  // 当前为default判断
                  if (
                    defaultType.indexOf(item.type) != -1 &&
                    !item.default.trim().length
                  )
                    throw item.tip ? item.tip : `${item.name}不能为空`;

                  // 当前为选择判断
                  if (
                    defaultType.indexOf(item.type) == -1 &&
                    !item.default_list.some(
                      (defaultItem) => defaultItem.is_selected
                    )
                  )
                    throw item.tip ? item.tip : `${item.name}未选择`;
                }
              });
          });

          // 订阅模板消息
          if (this.params.pageType != "crowdfund") {
            await this.bindMessage();
          }

          uni.showLoading({
            title: "提交中...",
          });
          // 这里不能取缓存啊  取缓存就有问题
          // var params = uni.getStorageSync("params");
          var table_id = this.topdata.table_id ?? 0;
          const submitData = {
            ...this.submitData,
            address_id: this.address.id || 0,
            live_room: this.room_id,
            mch_list: JSON.stringify(mch_list),
            table_id: table_id ? table_id : "",
            diners_number: this.topdata.num ? this.topdata.num : "",
            food_type: 1,
            order_origin: 3,
            verify_card_id: 0,
          };
          // 抽奖商品提交
          if (this.lottery_id) {
            this.lotterySubmit(submitData);
            return;
          }
          // 刮刮卡商品提交
          else if (this.params.scratch_id) {
            const res = await this.$requestAll.scratch.submit({
              address_id: this.address.id,
              goods_info: this.params.goods_info,
              content: mch_list[0].content || "", //备注
              use_integral: 1,
              form: JSON.stringify(mch_list[0].form),
              scratch_id: this.params.scratch_id,
              offline: mch_list[0].offline,
            });
            this.$utils.toUrl(
              "/pages/pay/pay" +
                uni.$u.queryParams({
                  order_id: res.data.order_id,
                  order_type: 0,
                })
            );
          } else if (this.params.pageType == "step") {
            const res = await this.$requestAll.step.submit({
              address_id: this.address.id,
              goods_info: this.params.goods_info,
              content: mch_list[0].content || "", //备注
              use_integral: 1,
              form: JSON.stringify(mch_list[0].form),
              step_id: this.params.step_id,
              offline: mch_list[0].offline,
            });
            console.log(res);
            this.$utils.toUrl(
              "/pages/pay/pay" +
                uni.$u.queryParams({
                  order_id: res.data.order_id,
                  order_type: 0,
                })
            );
          }
          // 九宫格抽奖商品提交
          else if (this.pond_id) {
            this.pondSubmit(submitData);
            return;
          } else if (this.params.pageType == "crowdfund") {
            const res = await this.$requestAll.crowdfund.submit({
              goods_info: this.params.goods_info,
              address_id: this.address.id,
              user_coupon_id:
                (mch_list[0] &&
                  mch_list[0].picker_coupon &&
                  mch_list[0].picker_coupon.user_coupon_id) ||
                "",
              content: mch_list[0].content || "",
            });
            this.$utils.toUrl(
              "/pages/pay/pay" +
                uni.$u.queryParams({
                  order_id: res.data.order_id,
                  order_type: 10,
                }),
              "redirectTo"
            );
          }
          // 普通商品提交
          else {
            console.log(submitData, "submitData");
            await this.orderSubmit(submitData, "s");
          }
        } catch (error) {
          this.$utils.toast(error.message || error);
        }
      }, 500);
    },
    // 抽奖提交
    async lotterySubmit(submitData) {
      let mch_list = JSON.parse(submitData.mch_list);
      let goods = mch_list[0].goods_list[0];

      let formData = {
        address_id: submitData.address_id,
        offline: 0,
        form: goods.form,
        goods_info: JSON.stringify(goods),
        use_integral: 1,
        dabao_price: 0,
        lottery_id: this.lottery_id,
      };
      uni.hideLoading();
      const res = await this.$requestAll.lottery.submit(formData, true);
      if (res.data.p_price <= 0) {
        this.$utils.toUrl("/pages/order/order?status=1", "redirectTo");
      } else {
        this.$utils.toUrl(
          `/pages/pay/pay${uni.$u.queryParams({
            order_id: res.data.order_id,
            order_type: 0,
          })}`,
          "redirectTo"
        );
      }
    },
    // 九宫格抽奖商品提交
    async pondSubmit(submitData) {
      submitData.mch_list = JSON.parse(submitData.mch_list);
      let formData = {
        address_id: this.address.id,
        offline: 0,
        form: submitData.mch_list[0].goods_list[0].form,
        goods_info: this.goods_info,
        use_integral: 1,
        pond_id: this.pond_id,
        dabao_price: submitData.dabao_price,
      };
      const res = await this.$requestAll.pond.pondSubmit(formData);
      this.$utils.toUrl(
        "/other/pay/pay" +
          uni.$u.queryParams({ order_id: res.data.order_id, order_type: 0 }),
        "redirectTo"
      );
    },
    // 订阅消息
    async bindMessage() {
      let ids = [];
      for (const key in this.orderDetail.message_info) {
        ids.push(this.orderDetail.message_info[key]);
      }
      await this.$utils.bindMessage(ids);
    },
    backPrevious() {
      uni.navigateBack({
        delta: 1,
      });
    },
  },
  computed: {
    freight(mch) {
      return function (mch) {
        if (mch.default_send_type == "shop") {
          return 0;
        } else if (mch.default_send_type == "express") {
          return mch.express_price;
        } else if (mch.default_send_type == "waimai") {
          return mch.waimai_delivery_cost;
        }
      };
    },
    // 当前是否选择门店自提
    shopDisplay() {
      if (this.orderDetail && this.address) {
        // 地址没有经纬度 && 选择同城配送
        if (!this.address.longitude || !this.address.latitude) {
          return this.orderDetail.mch_list &&
            this.orderDetail.mch_list.some(
              (item) => item.default_send_type == "waimai"
            )
            ? "地址需要添加经纬度"
            : false;
        }
        // 选择同城配送 && 地址不在配送范围
        else {
          return this.orderDetail.mch_list &&
            this.orderDetail.mch_list.some(
              (item) =>
                item.default_send_type == "waimai" && !item.waimai_delivery
            )
            ? "当前地址不在配送范围"
            : false;
        }
      }
      return false;
    },
    waimaiDisplay() {
      if (this.orderDetail) {
        for (let i = 0; i < this.orderDetail.mch_list.length; i++) {
          let item = this.orderDetail.mch_list[i];
          if (
            item.default_send_type == "waimai" &&
            item.total_price < item.initial_delivery_amount
          )
            return true;
        }
      }
      return false;
    },

    memberPrice() {
      let totalPrice = {
        memberPrice: 0,
        unitPrice: 0,
      };
      if (!this.orderDetail) return totalPrice;
      if (this.orderDetail.mch_list.length) {
        this.orderDetail.mch_list.forEach((mch) => {
          mch.goods_list.forEach((goods) => {
            goods.become_level_price = goods.become_level_price - 0;
            totalPrice.memberPrice += goods.become_level_price;
            totalPrice.unitPrice += goods.price - goods.become_level_price;
          });
        });
      }

      for (const key in totalPrice) {
        totalPrice[key] = totalPrice[key].toFixed(2);
      }
      console.log(totalPrice, "totalPricetotalPricetotalPricetotalPrice");
      return totalPrice;
    },

    // // 是否在配送范围
    // is_submit() {
    //   if (this.orderDetail) {
    //     let mch_list = this.orderDetail.mch_list;
    //     if (mch_list.some(item => !item.waimai_delivery)) return 0;
    //   }
    // },
  },
  watch: {
    address(val) {
      this.submitData.address_id = this.address && this.address.id;
    },
    "submitData.use_integral": {
      handler(val) {
        this.countPrice();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.OrderDelivery {
  /deep/.delivery-view {
    padding: 0 20rpx 30rpx;
  }

  /deep/.u-textarea {
    textarea {
      font-size: 26rpx !important;
    }
  }
}

.order-submit {
  padding: 1px 0;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  background: #f5f5f5;
  font-size: 26rpx;

  /deep/.give-box {
    margin: 20rpx 28rpx;
  }
  .diy_header {
    padding: 25rpx;
    background-color: #ffffff;
  }
  .youhui-box {
    padding: 30rpx 0 0;
    margin: 24rpx;
    border-radius: 20rpx;
    background: #fff;

    > div,
    > view {
      padding-bottom: 30rpx;
    }

    // 选择优惠卷
    /deep/.goods-coupon {
      min-height: initial;

      .flex-y-center > .price-color {
        font-weight: 700;
      }
    }
  }

  // 留言
  .leave {
    padding-bottom: 30rpx;
    box-sizing: content-box;
    // min-height: 80rpx;
    display: flex;

    /deep/.u-textarea {
      padding: 0;

      textarea {
        font-size: 26rpx;
        text-align: right;
      }
    }
  }

  .mch-item {
    margin: 24rpx;
    border-radius: 20rpx;
    background: #fff;
  }
}

.member-popup {
  position: relative;
  background: linear-gradient(to bottom, #fbeec7 0%, #fff 40%, #fff 100%);
  border-radius: 20rpx;
  text-align: center;
  width: 70vw;
  font-size: 30rpx;
  .bt {
    margin: 0 auto;
    width: 80%;
    line-height: 80rpx;
    border-radius: 50rpx;
    background: #ffdb4f;
    font-weight: 600;
  }
  .icon-reeor {
    position: absolute;
    bottom: -100rpx;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 70rpx;
  }
}
</style>
