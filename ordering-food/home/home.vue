<template>
  <!-- home -->
  <view class="container">
    <view
      class="daohang"
      :style="{
        paddingTop: getAppInfo.STATUS_BAR_HEIGHT + 'px',
        height: getAppInfo.HEADER_HEIGHT + 'px'
      }"
    >
      <view class="title" v-if="show == 0"> 扫码点餐 </view>
      <view class="title" v-if="show == 1"> 搜索 </view>
      <view
        class="iconfont icon-arrow-left"
        @click="goHome()"
        v-if="show == 1"
      ></view>
    </view>
    <view
      class="home"
      v-if="show == 0"
      :style="{
        paddingTop: getAppInfo.HEADER_ALL_HEIGHT + 'px'
      }"
    >
      <view class="header">
        <view class="lef">
          <view class="top" style="display: flex; align-items: center">
            <view class="name">
              {{ topdata.mch_name }}
            </view>
            <view class="iconfont icon-arrow-right"></view>
          </view>
          <view style="margin-top: 15rpx" v-if="topdata.store">
            桌号
            <text style="margin: 0 10rpx">{{ topdata.table_number }}</text> |
            <text style="margin-left: 10rpx">{{ topdata.num }}</text
            >人就餐
          </view>
          <view style="margin-top: 15rpx" v-if="topdata.pack"> 打包带走 </view>
        </view>
        <view class="rig">
          <view class="search" @click="toHome()">
            <u-icon name="home" color="#ffffff" size="27"></u-icon>
          </view>
          <view class="search" @click="toSearch()">
            <view class="iconfont icon-search"></view>
          </view>
          <view class="order" @click="toOrder()">
            <u-icon name="order" color="#ffffff" size="27"></u-icon>
          </view>
        </view>
      </view>
      <view class="content">
        <view class="fenlei">
          <scroll-view scroll-y="true" class="scroll-Y">
            <view class="classify_list">
              <view
                class="classify_item"
                v-for="(item, index) in classifyList"
                :key="index"
                @click="checkClassify(item, index)"
                :class="[checkclassifyidx == index && 'checked']"
              >
                {{ item.name }}
              </view>
            </view>
          </scroll-view>
        </view>
        <view class="content_detail">
          <view class="top">
            {{ classifyList[checkclassifyidx].name }}
          </view>
          <scroll-view scroll-y="true" class="list_scroll">
            <view class="goods_list">
              <view
                class="goods_item"
                v-for="(goods, index) in shopcarList"
                :key="goods.id"
              >
                <view style="display: flex; align-items: center; width: 100%">
                  <view class="image">
                    <image :src="goods.pic_url" mode=""></image>
                  </view>
                  <view class="text" style="width: 100%">
                    <view class="name u-line-2">
                      {{ goods.name }}
                    </view>
                    <view class="miaoshu u-line-1" v-if="goods.desc">
                      {{ goods.desc }}
                    </view>
                    <view class="num">
                      月售 <text>{{ goods.sales }}</text>
                    </view>
                    <view class="flex-y-center flex-x-sb">
                      <view class="price">
                        <view
                          style="font-size: 15px; color: red; font-weight: bold"
                          >￥{{ goods.price }}</view
                        ><view style="color: #b8b8b8; font-size: 11px"
                          >原价：￥<text
                            style="text-decoration: line-through"
                            >{{ goods.original_price }}</text
                          ></view
                        >
                      </view>
                      <view class="single_box" v-if="goods.use_attr == 0">
                        <view class="step">
                          <u-number-box integer min="0">
                            <view
                              slot="minus"
                              class="minus"
                              @click="handleMinus(goods)"
                            >
                              <u-icon
                                name="minus"
                                size="11"
                                color=" #FF0000"
                              ></u-icon>
                            </view>
                            <text
                              slot="input"
                              style="width: 10px; text-align: center"
                              class="input"
                              >{{ handleGoodsNum(goods) }}</text
                            >
                            <view
                              slot="plus"
                              class="plus"
                              @click="handlePlus(goods)"
                            >
                              <u-icon
                                name="plus"
                                color="#FFFFFF"
                                size="11"
                              ></u-icon>
                            </view>
                          </u-number-box>
                        </view>
                      </view>

                      <view
                        class="guige"
                        @click="select_guige(goods)"
                        v-if="goods.use_attr == 1"
                      >
                        选规格
                        <view class="mark">
                          {{ handleGoodsNum(goods) }}
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>
    <!-- 搜索  待排查 -->
    <view class="search" v-if="show == 1">
      <view class="conent-box">
        <view class="search-input">
          <u--input
            prefixIcon="search"
            placeholder="请输入商品名称"
            border="none"
            v-model="searchValue"
            @change="inputChange"
            @confirm="confirm"
          ></u--input>
        </view>
        <view class="hot" v-if="hotShow">
          <view class="title"> 热门搜索 </view>
          <view class="hot_list">
            <view
              class="hot_item"
              v-for="(item, index) in hotList"
              :key="index"
              @click="checkHot(item)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <view class="goods_list" v-if="!emptyShow">
          <view
            class="goods_item"
            v-for="(goods, index) in SearchshopcarList"
            :key="index"
          >
            <view style="display: flex; align-items: center">
              <view class="image">
                <image :src="goods.pic_url" mode=""></image>
              </view>
              <view class="text">
                <view class="name">
                  {{ goods.name }}
                </view>
                <view class="miaoshu">
                  {{ goods.desc }}
                </view>
                <view class="num">
                  月售 <text>{{ goods.sales }}</text>
                </view>
                <view class="price">
                  <text style="font-size: 34rpx; color: red; font-weight: bold"
                    >￥{{ goods.price }}</text
                  ><text
                    style="
                      text-decoration: line-through;
                      color: #b8b8b8;
                      font-size: 24rpx;
                      margin-left: 5rpx;
                    "
                    >￥{{ goods.original_price }}</text
                  >
                </view>
              </view>
            </view>
            <view class="single_box" v-if="goods.use_attr == 0">
              <view class="step">
                <u-number-box integer min="0">
                  <view slot="minus" class="minus" @click="handleMinus(goods)">
                    <u-icon name="minus" size="11" color=" #FF0000"></u-icon>
                  </view>
                  <text
                    slot="input"
                    style="width: 10px; text-align: center"
                    class="input"
                    >{{ handleGoodsNum(goods) }}</text
                  >
                  <view slot="plus" class="plus" @click="handlePlus(goods)">
                    <u-icon name="plus" color="#FFFFFF" size="11"></u-icon>
                  </view>
                </u-number-box>
              </view>
            </view>
            <view
              class="guige"
              @click="select_guige(goods)"
              v-if="goods.use_attr == 1"
            >
              选规格
              <view class="mark">
                {{ handleGoodsNum(goods) }}
              </view>
            </view>
          </view>
        </view>
        <view v-else>
          <u-empty
            mode="data"
            icon="http://cdn.uviewui.com/uview/empty/car.png"
          >
          </u-empty>
        </view>
      </view>
    </view>
    <!-- 这里处理好了 -->
    <u-popup
      :show="shopCatShow"
      @close="close"
      closeable
      mode="bottom"
      :round="10"
      :closeable="false"
    >
      <view class="shopcat_box">
        <view class="top">
          <view class="title"> 已选商品 </view>
          <view class="clear" @click="clearShopCar()">
            <view class="icon">
              <u-icon name="trash" size="20" color="#7f7f7f"></u-icon>
            </view>
            <view style="color: #979797; margin-left: 8rpx; font-size: 24rpx">
              清空购物车
            </view>
          </view>
        </view>
        <!-- 这里处理好了 -->
        <scroll-view scroll-y="true" class="shopcarlist_scroll">
          <view class="shopcar_list">
            <view
              class="shopcar_item"
              v-for="(s, index) in selectList"
              :key="index"
            >
              <view v-if="s.num_init > 0">
                <view class="flex-y-center flex-x-sb">
                  <image
                    class="image"
                    :src="s.pic_url"
                    mode="aspectFit"
                  ></image>
                  <view class="text flex-w-1">
                    <view class="name u-line-2">
                      {{ s.name }}
                    </view>
                    <view
                      class="attr-box"
                      style="display: flex"
                      v-if="s.use_attr == 1"
                    >
                      <view
                        class="attr-item"
                        v-for="item in s.selectAttr"
                        :key="item.attr_id"
                        style="
                          color: #b8b8b8;
                          font-size: 24rpx;
                          margin-right: 10rpx;
                        "
                      >
                        {{ item.attr_name }}
                      </view>
                    </view>
                    <view class="flex-y-center flex-x-sb">
                      <view class="price"> ￥{{ s.price }} </view>
                      <view class="step">
                        <u-number-box integer min="0">
                          <view
                            slot="minus"
                            class="minus"
                            @click="handleMinus(s)"
                          >
                            <u-icon
                              name="minus"
                              size="12"
                              color=" #FF0000"
                            ></u-icon>
                          </view>
                          <text
                            slot="input"
                            style="width: 10px; text-align: center"
                            class="input"
                            >{{ s.num_init }}</text
                          >
                          <view slot="plus" class="plus" @click="handlePlus(s)">
                            <u-icon
                              name="plus"
                              color="#FFFFFF"
                              size="12"
                            ></u-icon>
                          </view>
                        </u-number-box>
                      </view>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        <!-- 这里处理好了 -->
        <view class="shopcar_bottom">
          <view class="shopcar_left">
            <view class="shop_car">
              <view class="left" :class="carTotal > 0 && 'redcar'">
                <u-icon
                  name="shopping-cart-fill"
                  color="#ffffff"
                  size="38"
                ></u-icon>
                <view class="mark">
                  {{ carTotal }}
                </view>
              </view>
              <view class="" style="font-weight: bold">
                {{ selectList.length > 0 ? totalPrice : "未选购商品" }}
              </view>
            </view>
          </view>
          <view
            class="button"
            :class="carTotal > 0 && 'redbutton'"
            @click="submit()"
          >
            下单
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 这里处理好了 -->
    <view class="footer" @click="shopCarShow()">
      <view class="shop_car">
        <view class="left" :class="carTotal > 0 && 'redcar'">
          <u-icon name="shopping-cart-fill" color="#ffffff" size="38"></u-icon>
          <view class="mark">
            {{ carTotal }}
          </view>
        </view>
        <view class="" style="font-weight: bold" v-if="carTotal == 0">
          未选购商品
        </view>
        <view v-else>{{ totalPrice }}</view>
      </view>
      <view class="button" :class="carTotal > 0 && 'redbutton'"> 选好了 </view>
    </view>

    <AttrPopup
      :goodsId="goodsId"
      ref="AttrPopup"
      type="goods"
      @addEnough="addEnough"
    ></AttrPopup>
  </view>
</template>

<script>
import AttrPopup from "@/components/goods/AttrPopup";
export default {
  components: {
    AttrPopup
  },
  data() {
    return {
      attr: "", //所有规格组
      show: 0,
      emptyShow: false,
      hotShow: true,
      attr_group_list: [],
      moreAttr: [],
      hotList: [],
      attrLists: [],
      showNumBox: false,
      topdata: {},
      selectAttr: {
        goods_id: this.goodsId,
        num: 1,
        attr_list: []
      },
      attrdata: [],
      singleValue: 0,
      searchValue: "",
      order_id: 0,
      selectList: [],
      shopCatShow: false,
      attrList: {}, //规格弹框数据
      minusShow: false,
      SearchshopcarList: [],
      checkIndex: 0,
      page: 1,
      redCar: 0,
      checkclassifyidx: 0,
      checkspicy: 0,
      stepValue: 0,
      paramas: {},
      shopcarList: [],
      weightList: [],
      spicyList: [],
      classifyList: [],
      goodsId: 0,
      hangingOrderId: 0
    };
  },
  onLoad(option) {
    uni.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ff1b22",
      animation: {
        duration: 400,
        timingFunc: "easeIn"
      }
    });
    this.topdata = JSON.parse(option.query);
    this.order_id = this.topdata.order_id;
    this.paramas = {
      table_id: this.topdata.table_id,
      mch_id: this.topdata.mch_id
    };
    this.loadData();
  },
  onShow() {
    this.checkclassifyidx = 0
    this.shopCatShow = false;
    this.loadData();
  },
  methods: {
    // 初始化页面数据
    async loadData() {
      const res = await this.$requestAll.orderingfood.getQrorderCatList(
        {
          mch_id: parseInt(this.paramas.mch_id)
        },
        true
      );
      this.classifyList = res.data.list;
      //首次需要调动第一个分类的商品列表数据
      if (this.classifyList.length) {
        this.getShopcarList(this.classifyList[0].id);
      }

      const res1 = await this.$requestAll.orderingfood.getHotSearch(
        {
          mch_id: parseInt(this.paramas.mch_id)
        },
        true
      );
      if (res1.code == 0) {
        this.hotList = res1.data;
      }
      // 这里要获取用户是否有挂起的订单
      const res2 = await this.$requestAll.orderingfood.getHangindOrder({
        mch_id: this.paramas.mch_id
      });
      if (res2.code == 0 && res2.data && res2.data.orderDetail.length > 0) {
        this.hangingOrderId = res2.data.id;
        var list = [];
        // for (var i = 0; i < res2.data.orderDetail.length; i++) {
        //   var item = {
        //     id: res2.data.orderDetail[i].goods_id,
        //     name: res2.data.orderDetail[i].name,
        //     num_init: res2.data.orderDetail[i].num,
        //     pic_url: res2.data.orderDetail[i].pic,
        //     price: res2.data.orderDetail[i].price,
        //     selectAttr: res2.data.orderDetail[i].attr_list,
        //     use_attr: 1,
        //   };
        //   list.push(item);
        // }
        this.selectList = list;
      }
    },
    // 显示购物车弹窗
    shopCarShow() {
      this.shopCatShow = true;
    },
    // 返回商城首页
    toHome() {
      //跳转首页
      this.$utils.toUrl("/pages/index/index");
    },
    // 热搜关键次搜索
    async checkHot(item) {
      let keyword = item.name;
      const res = await this.$requestAll.orderingfood.getSearchList(
        {
          mch_id: parseInt(this.paramas.mch_id),
          page: this.page,
          keyword: keyword
        },
        true
      );
      if (res.code == 0) {
        this.hotShow = false;
        this.SearchshopcarList = res.data.list;
        if (this.SearchshopcarList.length > 0) {
          this.emptyShow = false;
        } else {
          this.emptyShow = true;
        }
      }
    },
    // 搜索页面 监听输入
    inputChange(val) {},
    // 搜索页面 执行搜索
    async confirm() {
      const res = await this.$requestAll.orderingfood.getSearchList(
        {
          mch_id: parseInt(this.paramas.mch_id),
          page: this.page,
          keyword: this.searchValue
        },
        true
      );
      if (res.code == 0) {
        this.hotShow = false;
        this.SearchshopcarList = res.data.list;
        if (this.SearchshopcarList.length > 0) {
          this.emptyShow = false;
        } else {
          this.emptyShow = true;
        }
      }
    },
    // 通过接口获取订单商品  还不知道有什么用
    async getShopcarList(cat_id) {
      const res = await this.$requestAll.orderingfood.getQrorderGoodsList(
        {
          mch_id: parseInt(this.paramas.mch_id),
          cat_id: cat_id
        },
        true
      );

      this.shopcarList = res.data.list;
    },
    // 跳转订单列表
    toOrder() {
      //跳转到订单列表
      this.$utils.toUrl("/pages/order/order?status=6&from=food");
    },
    // 关闭购物车弹窗
    close() {
      this.shopCatShow = false;
    },
    // 打开公用规格选择弹窗
    select_guige(item) {
      this.goodsId = item.id;
      this.$refs["AttrPopup"].showPopup("addEnough");
    },
    // 执行加入购物车
    addEnough(formData) {
      // 需要判断一下 已加入的是否存在
      var index = -1;
      this.selectList.forEach((cat, cat_index) => {
        if (JSON.stringify(cat.selectAttr) == formData.attr) {
          index = cat_index;
        }
      });
      if (index != -1) {
        this.selectList[index].num_init += formData.num;
      } else {
        this.selectList.push({
          name: formData.name,
          pic_url: formData.pic_url,
          num_init: formData.num,
          price: formData.price,
          use_attr: 1,
          selectAttr: JSON.parse(formData.attr),
          id: formData.goods_id
        });
      }
      this.$refs["AttrPopup"].popupClose();
    },
    // 清空购物车
    clearShopCar() {
      this.selectList = [];
      this.shopcarList.forEach((i) => {
        i.num_init = 0;
      });
    },
    // 分类点击切换事件
    checkClassify(item, index) {
      this.checkclassifyidx = index;
      this.getShopcarList(this.classifyList[this.checkclassifyidx].id);
    },
    // 加商品数量
    handlePlus(item) {
      var index = -1;
      this.selectList.forEach((cat, cat_index) => {
        if (cat.id == item.id) {
          index = cat_index;
        }
      });
      if (index != -1) {
        this.selectList[index].num_init++;
      } else {
        this.selectList.push({
          name: item.name,
          pic_url: item.pic_url,
          num_init: 1, // 首次添加是1个
          price: item.price,
          use_attr: 0,
          selectAttr: "",
          id: item.id,
          attr:[{
            attr_group_id:item.attr_group_list[0].attr_group_id,
            attr_group_name:item.attr_group_list[0].attr_group_name,
            attr_id:item.attr_group_list[0].attr_list[0].attr_id,
            attr_name:item.attr_group_list[0].attr_list[0].attr_name
          }]
        });
      }
    },
    // 减商品数量
    handleMinus(item) {
      var index = -1;
      this.selectList.forEach((cat, cat_index) => {
        if (cat.id == item.id) {
          index = cat_index;
        }
      });
      if (index == -1) {
        return;
      } else {
        if (this.selectList[index].num_init > 1) {
          this.selectList[index].num_init--;
        } else {
          // 要删除这个商品
          this.selectList.splice(index, 1);
        }
      }
    },
    // 显示搜索页面
    toSearch() {
      this.show = 1;
    },
    // 提交订单 进入订单预览页面
    async submit() {
      if (this.topdata.pack) {
        var arr = [];
        if (this.selectList) {
          this.selectList.forEach((item) => {
            if (item.use_attr == 0) {
              // var singleArr = [
              //   {
              //     attr_group_id: "1",
              //     attr_group_name: "规格",
              //     attr_id: "1",
              //     attr_name: "默认"
              //   }
              // ];
              let o = {};
              o.num = item.num_init;
              o.goods_id = item.id;
              o.attr = item.attr;
              arr.push(o);
            } else {
              let o = {};
              o.num = item.num_init;
              o.goods_id = item.id;
              o.attr = item.selectAttr;
              arr.push(o);
            }
          });
        }
        let data = {
          mch_id: parseInt(this.paramas.mch_id),
          goods_list: arr
        };
        let mch_list = [];
        mch_list.push(data);
        this.$utils.toUrl(
          "/pages/order-submit/order-submit?mch_list=" +
            JSON.stringify(mch_list) +
            "&topdata=" +
            JSON.stringify(this.topdata)
        );
      } else {
        var arr = [];
        if (this.selectList) {
          this.selectList.forEach((item) => {
            if (item.use_attr == 0) {
              // var singleArr = [
              //   {
              //     attr_group_id: "1",
              //     attr_group_name: "规格",
              //     attr_id: "1",
              //     attr_name: "默认"
              //   }
              // ];
              let o = {};
              o.num = item.num_init;
              o.goods_id = item.id;
              o.attr = item.attr;
              arr.push(o);
            } else {
              let o = {};
              o.num = item.num_init;
              o.goods_id = item.id;
              o.attr = item.selectAttr;
              arr.push(o);
            }
          });
        }
        const result = await this.$requestAll.orderingfood.handingOrder(
          {
            mch_id: parseInt(this.paramas.mch_id),
            goods_list: JSON.stringify(arr),
            id: this.hangingOrderId,
            table_id: this.paramas.table_id,
            diners_number: this.topdata.num
          },
          true
        );
        if (result.code == 0) {
          // 这里要清理一下 缓存的已选购商品
          this.$store.commit("setMchFoodCartData", {
            id: this.paramas.mch_id,
            list: []
          });
        }
        //  挂单成功后直接跳转到订单预览页面 调用订单预览接口
        this.$utils.toUrl(
          "/ordering-food/order-detail/order-detail?id=" +
            result.id +
            "&table_id=" +
            parseInt(this.paramas.table_id) +
            "&mch_id=" +
            parseInt(this.paramas.mch_id)
        );
      }
    },
    // 当前已选规格与无库存组合比对，返回需禁用规格id
    disableAttr(num0Arr, checkedAttrIds) {
      let disabledArr = [];

      // 循环无库存组合，查找与已选规格配对无库存id
      num0Arr.forEach((item) => {
        let length = 0;
        let disabledArr_1 = [];
        item.attr_list.forEach((item2) => {
          if (checkedAttrIds.some((cItem) => cItem == item2.attr_id)) {
            length++;
          } else {
            disabledArr_1.push(item2.attr_id);
          }
        });

        if (length && length == checkedAttrIds.length) {
          disabledArr.push(...disabledArr_1);
        }
      });
      return disabledArr;
    },
    // 点击规格 规格组索引
    onSelectAttr(i, i1, index = 0, index1 = 0) {
      if (this.attr_group_list[index].attr_list[index1].attr_num_0)
        return uni.$u.toast("当前规格无库存");
      // 规格组
      let attr_group_list = JSON.parse(JSON.stringify(this.attr_group_list));
      // 规格组合数组
      let attrs = JSON.parse(this.attr);
      //选中的规格id
      let checkedAttr = [];
      // 选中的规格
      let attr_list = [];

      let num0Arr = attrs.filter((it) => {
        return !Number(it.num);
      }); //无库存规格组
      let disabledArr = []; //无库存规格标识

      // 只有一个规格组，先标识无库存才能选择,
      // 如果是多个规格组，需先选再进行匹配无库存规格组合
      if (attr_group_list.length == 1) {
        if (
          num0Arr.length &&
          (!this.selectData.attr_list || !this.selectData.attr_list.length)
        ) {
          // 无库存标识
          num0Arr.forEach((it) => {
            for (const key in attr_group_list[0].attr_list) {
              const item = attr_group_list[0].attr_list[key];

              if (item.attr_id == it.attr_list[0].attr_id) {
                item.attr_num_0 = true;
                break;
              }
            }
          });
        }
      }

      // 只要没有无库存标识则选中
      if (!attr_group_list[index].attr_list[index1].attr_num_0) {
        attr_group_list.forEach((it, itIndex) => {
          it.attr_list.forEach((item, i) => {
            if (itIndex == index) {
              // 当前循环项已被选中，且当前再次点击选择应改为取消选中
              if (i == index1 && item.checked) {
                item.checked = false;
              } else {
                item.checked = i == index1;
              }
            }

            if (item.checked) {
              attr_list.push({
                attr_group_id: attr_group_list[index].attr_group_id,
                attr_id: item.attr_id,
                attr_name: item.attr_name,
                attr_group_name: it.attr_group_name
              });
              checkedAttr.push(item.attr_id);
            }
          });
        });
      }

      // 与无库存组合比对返回无库存组合id，进行标识
      if (attr_group_list.length > 1) {
        if (checkedAttr.length == attr_group_list.length) {
          for (let i = 0; i < checkedAttr.length; i++) {
            let disableResult = this.disableAttr(
              num0Arr,
              checkedAttr.filter((it, ni) => i != ni)
            );
            disabledArr.push(...disableResult);
          }
        } else {
          disabledArr = this.disableAttr(num0Arr, checkedAttr);
        }

        // 无库存进行标识
        attr_group_list.forEach((attr_group) => {
          attr_group.attr_list.forEach((attr) => {
            attr.attr_num_0 = disabledArr.some((item) => item == attr.attr_id);
          });
        });
      }
      // 跟新group_list
      this.attr_group_list = attr_group_list;
      // 设置选中规格id
      this.selectAttr.attr_list = attr_list;
      uni.setStorageSync("attr_list", this.selectAttr.attr_list);
      // 获取规格信息
      this.getGoodsAttr();
      return;
    },
    // 获取选中规格信息
    getGoodsAttr() {
      // 当前表示规格种类只有一种..  可根据规格信息判断库存.
      const attr_list = this.selectAttr.attr_list;
      const attr_group_list = this.attr_group_list;
      const attr = JSON.parse(this.attr);
      if (attr_list.length == attr_group_list.length) {
        // 获取选中规格数据
        attr.forEach((attrData) => {
          let i = 0;
          attrData.attr_list.forEach((attr) => {
            if (attr_list.some((s) => s.attr_id == attr.attr_id)) {
              i++;
            }
            if (i == attr_list.length) {
              this.attrData = attrData;
            }
          });
        });
        this.getAttrInfo();
      }
    },
    async getAttrInfo() {
      if (this.type == "goods") {
        var res = await this.$requestAll.default.goodsAttrInfo(
          {
            goods_id: this.goodsId,
            attr_list: JSON.stringify(
              this.selectAttr.attr_list.map((item) => {
                return item.attr_id;
              })
            ),
            number: this.selectAttr.num
          },
          true
        );
        this.attrInfo = res.data;
      } else if (this.type == "pintuan") {
        var res = await this.$requestAll.group.goodsAttrInfo(
          {
            goods_id: this.goodsId,
            group_id: this.pintuanGroupId,
            attr_list: JSON.stringify(
              this.selectAttr.attr_list.map((item) => {
                return item.attr_id;
              })
            ),
            number: this.selectAttr.num
          },
          true
        );
        this.attrInfo = res.data;
      }
    },
    // 返回点餐页面
    goHome() {
      this.show = 0;
    }
  },

  computed: {
    // 计算加入商品的总金额
    totalPrice: function () {
      var total_price = 0;
      for (var i = 0; i < this.selectList.length; i++) {
        total_price += this.selectList[i].price * this.selectList[i].num_init;
      }
      return total_price.toFixed(2);
    },
    // 加入商品的数量
    carTotal: function () {
      var num = 0;
      this.selectList.forEach((cat) => {
        num += parseInt(cat.num_init);
      });
      return num;
    },
    // 对应商品列表商品 显示已选择数量
    handleGoodsNum() {
      return (goods) => {
        var num = 0;
        this.selectList.forEach((cartGoods) => {
          if (cartGoods.id == goods.id) num = cartGoods.num_init;
        });
        return num;
      };
    }
  },
  watch: {
    selectList: {
      handler(val, oval) {
        this.$store.commit("setMchFoodCartData", {
          id: this.paramas.mch_id,
          list: val
        });
      },
      deep: true
    }
  },
  mounted() {
    let mchFoodDataList = this.$store.getters["mchFoodDataList"];
    if (mchFoodDataList.some((item) => item.id == this.paramas.mch_id)) {
      this.selectList = mchFoodDataList.find(
        (item) => item.id === this.paramas.mch_id
      ).list;
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  .daohang {
    position: fixed;
    z-index: 999;
    top: 0rpx;
    left: 0rpx;
    background-color: #ff0000;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: content-box;

    .title {
      font-size: 40rpx;
      color: #ffffff;
      text-align: center;
      font-weight: bold;;
    }

    .iconfont {
      position: absolute;
      top: 50%;
      left: 30rpx;
      color: #ffffff;
      font-size: 40rpx;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
    }
  }

  .step {
    .minus {
      width: 20px;
      height: 20px;
      border-width: 2px;
      border-color: #ff0000;
      border-style: solid;
      border-top-left-radius: 100px;
      border-top-right-radius: 100px;
      border-bottom-left-radius: 100px;
      border-bottom-right-radius: 100px;
      @include flex;
      justify-content: center;
      align-items: center;
    }

    .input {
      padding: 0 10px;
    }

    .plus {
      width: 20px;
      height: 20px;
      background-color: #ff0000;
      border-radius: 50%;
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      justify-content: center;
      align-items: center;
    }
  }

  .home {
    // margin-top: 120rpx;
    position: relative;
    height: 100%;
    background-color: #ff1b22;

    .step {
      .minus {
        width: 20px;
        height: 20px;
        border-width: 2px;
        border-color: #ff0000;
        border-style: solid;
        border-top-left-radius: 100px;
        border-top-right-radius: 100px;
        border-bottom-left-radius: 100px;
        border-bottom-right-radius: 100px;
        @include flex;
        justify-content: center;
        align-items: center;
      }

      .input {
        padding: 0 10px;
      }

      .plus {
        width: 20px;
        height: 20px;
        background-color: #ff0000;
        border-radius: 50%;
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        justify-content: center;
        align-items: center;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25rpx;

      .lef {
        color: #ffffff;

        .name {
          font-size: 32rpx;
        }
      }

      .rig {
        width: 190rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .iconfont {
          color: #ffffff;
          font-size: 55rpx;
        }
      }
    }

    .content {
      border-radius: 30rpx;
      overflow: hidden;
      display: flex;

      .fenlei {
        width: 160rpx;
        height: 1300rpx;
        background-color: #ffffff;

        .scroll-Y {
          height: 1300rpx;

          .classify_list {
            .classify_item {
              height: 90rpx;
              background-color: #ffffff;
              color: #2d2d2d;
              text-align: center;
              line-height: 90rpx;
            }

            .checked {
              color: #808080;
              background-color: #f2f2f2;
              border-radius: 0 15rpx 15rpx 0;
            }
          }
        }
      }

      .content_detail {
        flex: 1;
        height: 1300rpx;
        background-color: #ffffff;

        .list_scroll {
          height: 1300rpx;

          .goods_list {
            padding: 25rpx 15rpx 220rpx 15rpx;

            .goods_item {
              display: flex;
              align-items: flex-end;
              justify-content: space-between;
              margin-bottom: 30rpx;

              .image {
                width: 180rpx;
                height: 180rpx;
                border-radius: 20rpx;
                background-color: #ececec;

                > image {
                  width: 180rpx;
                  height: 180rpx;
                }
              }

              .text {
                display: flex;
                flex-direction: column;
                margin-left: 20rpx;

                .name {
                  font-weight: bold;
                  font-size: 28rpx;
                }

                .miaoshu {
                  color: #b8b8b8;
                }

                .num {
                  color: #b8b8b8;
                }
              }

              .single {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40rpx;
                height: 40rpx;
                background-color: #ff0000;
                border-radius: 50%;
              }

              .guige {
                position: relative;
                width: 120rpx;
                height: 45rpx;
                background-color: #f4240d;
                color: #ffffff;
                border-radius: 40rpx;
                text-align: center;
                line-height: 45rpx;

                .mark {
                  position: absolute;
                  top: -15rpx;
                  right: -15rpx;
                  width: 32rpx;
                  font-size: 24rpx;
                  height: 32rpx;
                  background-color: #f84a33;
                  border-radius: 50%;
                  text-align: center;
                  line-height: 32rpx;
                }
              }
            }
          }
        }

        .top {
          font-size: 30rpx;
          font-weight: bold;
          height: 75rpx;
          background-color: #ffffff;
          line-height: 75rpx;
          padding-left: 30rpx;
        }
      }
    }

    .popup_box {
      padding: 25rpx;
      height: 950rpx;
      display: flex;
      flex-direction: column;

      .goods {
        display: flex;
        margin-bottom: 40rpx;

        .image {
          width: 180rpx;
          height: 180rpx;
          border-radius: 20rpx;
          background-color: #ececec;

          > image {
            width: 100%;
            height: 100%;
          }
        }

        .text {
          height: 150rpx;
          display: flex;
          flex-direction: column;
          margin-left: 20rpx;
          justify-content: space-between;

          .name {
            font-weight: bold;
            font-size: 28rpx;
          }

          .miaoshu {
            color: #b8b8b8;
          }
        }
      }

      .popup-num {
        margin-bottom: 40rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      // 多规格弹框样式
      .att-box {
        .att-title {
          line-height: 80rpx;
          font-size: 26rpx;
          font-weight: 700;
        }

        .att-content {
          display: flex;
          flex-wrap: wrap;

          > view {
            width: 200rpx;
            height: 75rpx;
            background-color: #f8f8f8;
            border-radius: 20rpx;
            text-align: center;
            line-height: 75rpx;
            margin-right: 20rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
            // text-align: center;
            // min-width: 100rpx;
          }

          .weight_active {
            border: 1px solid #ff0000;
            color: #ff0000;
            background-color: #fff3f1;
          }

          .check {
            background: #fbeceb;
            color: #ff191d;
          }

          .display {
            background: #f5f5f5;
            color: #8c8c8c;
            text-decoration: line-through;
            border: 0;
          }
        }

        .attr-box-item_1 {
          border-bottom: 2rpx solid #eee;
          // &:nth-last-child(1) {
          //   border-bottom: 0 solid #000;
          // }
        }
      }

      .weight {
        margin-bottom: 40rpx;

        .weight_list {
          margin-top: 20rpx;
          display: flex;

          .weight_item {
            width: 200rpx;
            height: 75rpx;
            background-color: #f8f8f8;
            border-radius: 20rpx;
            text-align: center;
            line-height: 75rpx;
            margin-right: 20rpx;
            font-weight: bold;
          }

          .weight_active {
            border: 1px solid #ff0000;
            color: #ff0000;
            background-color: #fff3f1;
          }
        }
      }

      .spicy {
        .spicy_list {
          margin-top: 20rpx;
          display: flex;

          .spicy_item {
            width: 200rpx;
            height: 75rpx;
            background-color: #f8f8f8;
            border-radius: 20rpx;
            text-align: center;
            line-height: 75rpx;
            margin-right: 20rpx;
            font-weight: bold;
          }

          .spicy_active {
            border: 1px solid #ff0000;
            color: #ff0000;
            background-color: #fff3f1;
          }
        }
      }

      .button {
        margin-top: 70rpx;
        height: 75rpx;
        background-color: #ff1b22;
        border-radius: 40rpx;
        text-align: center;
        line-height: 75rpx;
        color: #ffffff;
      }

      .button1 {
        margin-top: 70rpx;
        height: 75rpx;
        background-color: #8c8c8c;
        border-radius: 40rpx;
        text-align: center;
        line-height: 75rpx;
        color: #ffffff;
      }
    }
  }

  .footer {
    padding: 0 30rpx;
    position: fixed;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
    bottom: 0;
    width: 100%;
    height: 170rpx;
    background-color: #f4f4f4;

    .shop_car {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 250rpx;

      .left {
        width: 90rpx;
        height: 90rpx;
        background-color: #8c8c8c;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .redcar {
        width: 90rpx;
        height: 90rpx;
        background-color: #ff0000;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .mark {
        position: absolute;
        top: -10rpx;
        right: 155rpx;
        width: 32rpx;
        font-size: 24rpx;
        height: 32rpx;
        background-color: #f84a33;
        border-radius: 50%;
        text-align: center;
        line-height: 32rpx;
        color: #ffffff;
      }
    }

    .button {
      width: 210rpx;
      height: 85rpx;
      background-color: #9f9f9f;
      border-radius: 40rpx;
      text-align: center;
      line-height: 85rpx;
      color: #ffffff;
    }

    .redbutton {
      width: 210rpx;
      height: 85rpx;
      background-color: #f84a33;
      border-radius: 40rpx;
      text-align: center;
      line-height: 85rpx;
      color: #ffffff;
    }
  }

  .shopcat_box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 25rpx;

    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title {
        font-weight: bold;
      }

      .clear {
        display: flex;
        align-items: center;
      }
    }

    .shopcarlist_scroll {
      height: 500rpx;

      .shopcar_list {
        .shopcar_item {
          > view {
            margin-bottom: 20rpx;

            .image {
              margin-right: 20rpx;
              width: 110rpx;
              height: 110rpx;
              background-color: #f2f2f2;
              border-radius: 15rpx;
            }

            .text {
              .name {
                font-weight: bold;

                .ladu {
                  font-weight: 400;
                  font-size: 24rpx;
                  color: #a5a5a5;
                }
              }

              .price {
                color: #ff1b22;
                font-weight: bold;
              }
            }
          }
        }
      }
    }

    .shopcar_bottom {
      width: 100%;
      height: 170rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .shopcar_left {
        display: flex;
        align-items: center;

        .shop_car {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 250rpx;

          .left {
            width: 90rpx;
            height: 90rpx;
            background-color: #8c8c8c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .redcar {
            width: 90rpx;
            height: 90rpx;
            background-color: #ff0000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .mark {
            position: absolute;
            top: -10rpx;
            right: 155rpx;
            width: 32rpx;
            font-size: 24rpx;
            height: 32rpx;
            background-color: #f84a33;
            border-radius: 50%;
            text-align: center;
            line-height: 32rpx;
            color: #ffffff;
          }
        }
      }

      .button {
        width: 210rpx;
        height: 85rpx;
        background-color: #9f9f9f;
        border-radius: 40rpx;
        text-align: center;
        line-height: 85rpx;
        color: #ffffff;
      }

      .redbutton {
        width: 210rpx;
        height: 85rpx;
        background-color: #f84a33;
        border-radius: 40rpx;
        text-align: center;
        line-height: 85rpx;
        color: #ffffff;
      }
    }
  }

  .search {
    .step {
      .minus {
        width: 22px;
        height: 22px;
        border-width: 2px;
        border-color: #ff0000;
        border-style: solid;
        border-top-left-radius: 100px;
        border-top-right-radius: 100px;
        border-bottom-left-radius: 100px;
        border-bottom-right-radius: 100px;
        @include flex;
        justify-content: center;
        align-items: center;
      }

      .input {
        padding: 0 10px;
      }

      .plus {
        width: 22px;
        height: 22px;
        background-color: #ff0000;
        border-radius: 50%;
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        justify-content: center;
        align-items: center;
      }
    }

    .conent-box {
      margin-top: 135rpx;
      padding: 0 30rpx;

      .search-input {
        height: 70rpx;
        background-color: #f2f2f2;
        border-radius: 50rpx;

        /deep/ .input-placeholder {
          font-size: 26rpx;
        }
      }

      .hot {
        margin-top: 40rpx;

        .title {
          font-weight: bold;
        }

        .hot_list {
          margin-top: 30rpx;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .hot_item {
            margin-right: 20rpx;
            background-color: #f8f8f8;
            padding: 15rpx;
            border-radius: 15rpx;
            color: #6a6a6a;
            margin-bottom: 20rpx;
          }
        }
      }

      .goods_list {
        margin-top: 30rpx;

        .goods_item {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 30rpx;

          .image {
            width: 180rpx;
            height: 180rpx;
            border-radius: 20rpx;
            background-color: #ececec;

            > image {
              width: 180rpx;
              height: 180rpx;
            }
          }

          .text {
            display: flex;
            flex-direction: column;
            margin-left: 20rpx;

            .name {
              font-weight: bold;
              font-size: 28rpx;
            }

            .miaoshu {
              color: #b8b8b8;
            }

            .num {
              color: #b8b8b8;
            }
          }

          .guige {
            position: relative;
            width: 120rpx;
            height: 45rpx;
            margin-left: 40rpx;
            background-color: #f4240d;
            color: #ffffff;
            border-radius: 40rpx;
            text-align: center;
            line-height: 45rpx;

            .mark {
              position: absolute;
              top: -15rpx;
              right: -15rpx;
              width: 32rpx;
              font-size: 24rpx;
              height: 32rpx;
              background-color: #f84a33;
              border-radius: 50%;
              text-align: center;
              line-height: 32rpx;
            }
          }
        }
      }
    }
  }
}
</style>
