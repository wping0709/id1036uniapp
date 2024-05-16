<template>
  <view>
    <view v-if="showText">
      <view
        @click="showPopup('buy')"
        class="goods-attr flex-y-center flex-x-sb"
      >
        <view class="font-26 color-999">选择</view>

        <view class="font-26" style="width: 0; flex: 1">
          <template v-if="selectAttr.attr_list.length">
            <text v-for="(item, i) in selectAttr.attr_list" :key="i">
              <text>{{ item.attr_name }}</text>
              <text v-if="i < selectAttr.attr_list.length - 1">，</text>
            </text>
          </template>
          <template v-else>请选择规格</template>
        </view>

        <view>
          <i class="iconfont icon-arrow-right"></i>
        </view>
      </view>
    </view>

    <u-popup safeAreaInsetBottom :show="show" @close="popupClose" round="20rpx">
      <!-- 头部规格价格 及库存信息 -->
      <view v-if="type != 'blind'" class="title-info">
        <image
          @click="previewImage(imageUrl)"
          :src="imageUrl"
          mode="aspectFill"
        />

        <view v-if="type == 'step'" class="price-box">
          <view class="font-600-30 flex-y-center">
            <image
              :src="wxapp_img.step.price"
              mode="aspectFill"
              style="width: 30rpx; height: 30rpx"
            />
            <text>{{ attrPrice }}</text>
          </view>
          <view style="margin-top: 30rpx"
            >库存：{{ attrKucun }}/{{ goodsData.unit }}</view
          >
        </view>

        <view v-else-if="type == 'integral'" class="price-box">
          <view class="font-600-30">
            <text>{{ attrPrice }}</text>
          </view>
        </view>

        <!-- <view
          v-else-if="type == 'crowdfund'"
          class="price-box"
          style="padding-top: 0"
        >
          <view class="font-600-30 u-line-4">
            {{ goodsData.name }}
          </view>
        </view> -->

        <view v-else class="price-box">
          <view class="font-600-30">
            <PriceText
              :price="attrPrice"
              ySize="44rpx"
              fSize="30rpx"
            ></PriceText>
            <text
              v-if="goodsData.is_level || goodsData.is_member_price"
              style="font-size: 22rpx; margin-left: 10rpx; color: red"
            >
              会员价
            </text>
          </view>

          <view class="stock">库存：{{ attrKucun }}/{{ goodsData.unit }}</view>

          <!-- 当前选中规格 -->
          <div v-if="selectAttr.attr_list.length" class="font-24 color-999">
            <text class="m-r-20">已选</text>
            <text v-for="(item, i) in selectAttr.attr_list" :key="i">
              <text>{{ item.attr_name }}</text>
              <text v-if="i < selectAttr.attr_list.length - 1">，</text>
            </text>
          </div>
        </view>

        <i @click="popupClose" class="iconfont icon-close p-x-10"></i>
      </view>

      <scroll-view scroll-y class="popup-box">
        <!-- 拼团人数规格选择表-->
        <view
          v-if="
            attr_group_num &&
            pinTuanData.show &&
            pinTuanData.type == 'GROUP_BUY'
          "
          class="att-box"
        >
          <view class="att-title">{{ attr_group_num.attr_group_name }}</view>
          <view class="att-content">
            <view
              :class="[pintuanGroupId == 0 && 'check']"
              @click="selectGroup(0)"
            >
              {{ goodsData.group_num }}人团
            </view>
            <view
              :class="[item1.id == pintuanGroupId && 'check']"
              @click="selectGroup(item1.id)"
              v-for="item1 in attr_group_num.attr_list"
              :key="item1.id"
            >
              {{ item1.group_num }}人团
            </view>
          </view>
        </view>

        <!-- 多规格选择  -->
        <template v-if="goodsData.goods_add_type == 1 && type == 'goods'">
          <view class="att-box">
            <view
              class="flex-y-center p-y-10 attr-box-item_1"
              v-for="(item, index) in attr"
              :key="index"
            >
              <view class="m-r-20 flex-w-1 color-666">
                <view>
                  <text v-for="(item1, i2) in item.attr_list" :key="i2">
                    <text>{{ item1.attr_name }}</text>
                    <text v-if="i2 < item.attr_list.length - 1">/</text>
                  </text>
                  <text class="m-l-10">/ {{ goodsData.unit || "件" }}</text>
                </view>
                <view>采购价￥{{ filterPrice(item) }}</view>
              </view>

              <view>
                <u-number-box
                  bgColor="transparent"
                  inputWidth="92rpx"
                  v-model="item.number"
                  @change="numberChange($event, item, index)"
                  :min="0"
                  :max="item.num"
                ></u-number-box>
              </view>
            </view>
          </view>
        </template>

        <!-- 规格列表 -->
        <template v-else>
          <view
            class="att-box"
            v-for="(item, i) in attr_group_list"
            :key="item.attr_group_id"
          >
            <view class="att-title">{{ item.attr_group_name }}</view>
            <view class="att-content">
              <view
                :class="[
                  item1.checked && 'check',
                  item1.attr_num_0 && 'display',
                ]"
                @click="onSelectAttr(item.attr_group_id, item1.attr_id, i, i1)"
                v-for="(item1, i1) in item.attr_list"
                :key="item1.attr_id"
              >
                {{ item1.attr_name }}
              </view>
            </view>
          </view>

          <!-- 数量步进器 -->
          <view
            v-if="
              !(
                type == 'blind' ||
                type == 'crowdfund' ||
                type == 'yuyue' ||
                type === 'integral'
              )
            "
            class="num-box flex-y-center flex-x-sb"
          >
            <view class="font-26 font-w-700">
              <view>数量</view>
              <view
                class="price-color font-w-400"
                v-if="attrInfo && attrInfo.batch_price_tips_arr.length"
              >
                <view
                  v-for="(item, index) in attrInfo.batch_price_tips_arr"
                  :key="index"
                  >{{ item }}</view
                >
              </view>
            </view>
            <view>
              <u-number-box
                bgColor="transparent"
                inputWidth="92rpx"
                button-size="60rpx"
                v-model="selectAttr.num"
                :min="1"
                :disabled="numberNum == 0"
                :max="numberNum"
              ></u-number-box>
            </view>
          </view>
        </template>
      </scroll-view>

      <template v-if="goodsData.goods_add_type == 1 && type == 'goods'">
        <view class="flex-x-sb flex-y-center p-t-20 m-20">
          <view
            >总数量：
            <text class="price-color">{{ total.num }}</text>
          </view>
          <view
            >总价格：
            <text class="price-color">{{ total.price }}</text>
          </view>
        </view>
      </template>

      <template v-else>
        <!-- 线 -->
        <view style="border: 1px solid #f5f5f5; margin: 40rpx 0 20rpx"></view>
      </template>

      <div
        :class="[
          'popup-btns',
          numberNum <= 0 && type !== 'crowdfund' && 'popup-btns_1',
        ]"
      >
        <template v-if="showType == 'addCart'">
          <view
            v-if="type == 'goods'"
            @click="clickAddCart"
            class="submit-bt add-cart"
          >
            加入购物车
          </view>
        </template>
        <template v-if="showType == 'addEnough'">
          <view
            v-if="type == 'goods'"
            @click="addEnough"
            class="submit-bt add-cart"
          >
            加入选购
          </view>
        </template>
        <view v-else @click="submit" class="submit-bt">
          <template v-if="type == 'yuyue'">立即预约</template>
          <template v-else-if="type == 'cart' || showType == ''">确定</template>
          <template v-else-if="type == 'crowdfund'">去支付</template>
          <!-- 11.07 增加goodsAttr，酒评中活动专区选规格加入购物车 -->
          <template v-else-if="type == 'goodsAttr'">加入购物车</template>
          <template v-else>立即购买</template>
        </view>
      </div>
    </u-popup>
  </view>
</template>

<script>
import PriceText from "@/components/price-text/index";
export default {
  components: {
    PriceText,
  },
  props: {
    // 抖品id通常使用抖品商品添加到购物车时使用
    vgoods_id: {
      type: String,
      default: "",
    },
    // 是否展示选择项text
    showText: {
      type: Boolean,
      default: false,
    },
    // 商品id
    goodsId: {
      type: [String, Number],
      default: -1,
    },
    // 使用场景类型
    type: {
      type: String,
      default: "goods",
    },
    // 积分使用项
    integral: {
      type: [String, Number],
      default: -1,
    },
    // 拼团 是否为可选拼团人数
    pinTuanData: {
      type: Object,
      default() {
        return {
          show: true,
          order_id: 0,
          type: "GROUP_BUY",
        };
      },
    },
    // 当前选中数据
    selectData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 主播带货id
    room_id: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {
      show: false,
      selectAttr: {
        goods_id: this.goodsId,
        num: 1,
        attr_list: [],
      },
      showType: "buy", //打开弹框类型默认为购买
      goodsData: "", //商品数据
      attrInfo: "", //根据规格获取的信息
      attrData: "", // 规格详情
      attr_group_list: "", //规格组
      attr: "", //所有规格组
      attr_group_num: "", //拼团使用选择拼团人数选择
      pintuanGroupId: 0, //拼团人数规格id
      goodsName: "", //商品名
    };
  },
  watch: {
    selectData: {
      deep: true,
      immediate: true,
      handler(val, ovl) {
        if (val) {
          for (const key in val) {
            if (!val[key]) delete val[key];
          }
          if (JSON.stringify(val) != "{}") {
            this.selectAttr = uni.$u.deepMerge(this.selectAttr, val);
          }
        }
      },
    },
  },
  methods: {
    // 扫码点餐加入选购
    addEnough(){
      if (this.goodsData.goods_add_type == 1) {
        var formData = {
          goods_id: this.goodsId,
          num: this.total.num,
          // attr: JSON.stringify(this.selectAttr.attr_list),
        };
        let attr = this.attr.filter((item) => item.number);
        formData.attr_list = JSON.stringify(attr);
      } else {
        var formData = {
          goods_id: this.goodsId,
          num: this.selectAttr.num,
          attr: JSON.stringify(this.selectAttr.attr_list),
          name:this.goodsData.name,
          pic_url:this.goodsData.cover_pic,
          price:this.attrPrice,
        };
      }
      formData = Object.assign(formData, { vgoods_id: this.vgoods_id });
      this.$emit('addEnough',formData)
    },
    // 初始化数据
    resetData() {
      let { attrData, selectData, attrInfo } = this.$options.data();
      this.attrData = attrData;
      // this.selectData = selectData;
      this.$emit("update:selectData", {});
      this.attrInfo = attrInfo;
    },
    clickAddCart() {
      this.showType = "addCart";
      this.submit();
    },
    //   显示弹框
    showPopup(showType) {
      this.showType = showType;
      this.$nextTick(() => {
        if (this.type == "miaosha") {
          if (!this.goodsData) {
            this.getGoodsDetail();
          } else if (this.goodsData.is_real_name == 1) {
            uni.showModal({
              title: "提示",
              content: "请先进行实名认证！",
              confirmText: "立即认证",
              success: ({ confirm, cancel }) => {
                if (confirm) {
                  this.$utils.toUrl("/lives/real/index");
                }
              },
            });
          } else {
            this.show = true;
          }
        } else {
          if (this.goodsId != this.goodsData.id) {
            this.attrInfo = this.$options.data().attrInfo;
            console.log(this.selectData);
            if (JSON.stringify(this.selectData) == "{}")
              this.selectAttr = this.$options.data().selectAttr;
            this.getGoodsDetail();
          } else if (this.goodsData.is_real_name == 1) {
            uni.showModal({
              title: "提示",
              content: "请先进行实名认证！",
              confirmText: "立即认证",
              success: ({ confirm, cancel }) => {
                if (confirm) {
                  this.$utils.toUrl("/lives/real/index");
                }
              },
            });
          } else {
            this.show = true;
          }
        }
      });
    },
    // 关闭弹框
    popupClose() {
      this.show = false;
    },
    // 获取商品详情
    async getGoodsDetail() {
      // 初始化数据
      this.resetData();

      if (this.type == "integral") {
        const res = await this.$requestAll.integralmall.goodsInfo(
          {
            id: this.goodsId,
            integral: this.integral,
          },
          true
        );
        this.attr = res.data.goods.attr;
        this.goodsData = res.data.goods;
        this.attr_group_list = res.data.attr_group_list;
      } else if (this.type == "step") {
        const res = await this.$requestAll.step.goods(
          {
            goods_id: this.goodsId,
          },
          true
        );
        this.attr = JSON.parse(res.data.goods.attr);
        this.goodsData = Object.assign(res.data.goods, {
          cover_pic: res.data.goods.attr_pic,
        });
        this.attr_group_list = res.data.goods.attr_group_list;
      } else if (this.type == "crowdfund") {
        const res = await this.$requestAll.crowdfund.details(
          {
            id: this.goodsId,
          },
          true
        );
        this.attr = JSON.parse(res.data.attr);
        this.goodsData = Object.assign(res.data, {
          cover_pic: res.data.pic_list[0]?.pic_url,
        });
        this.attr_group_list = res.data.attr_group_list;
      } else if (this.type == "miaosha") {
        const res = await this.$requestAll.miaosha.details(
          {
            id: this.goodsId,
            scene_type: 0,
          },
          true
        );
        this.attr = JSON.parse(res.data.attr);
        this.goodsData = res.data;
        this.attr_group_list = res.data.attr_group_list;
      } else if (this.type == "pintuan") {
        const res = await this.$requestAll.group.goodDetail(
          {
            gid: this.goodsId,
          },
          true
        );
        this.attr = res.data.info.attr;
        this.goodsData = res.data.info;
        this.attr_group_list = res.data.attr_group_list;
        this.attr_group_num = res.data.attr_group_num;
      } else if (this.type == "yuyue") {
        const res = await this.$requestAll.book.goodDetails(
          {
            gid: this.goodsId,
          },
          true
        );
        this.goodsData = res.data.info;
        this.attr = res.data.info.attr;
        this.attr_group_list = res.data.attr_group_list;
        // 设置库存属性
        this.goodsData.num = res.data.info.stock;
      } else if (this.type == "blind") {
        const res = await this.$requestAll.blind.selectAttr(
          {
            goods_id: this.goodsId,
          },
          true
        );
        this.attr = JSON.parse(res.data.goods.attr);
        this.goodsData = res.data.goods;
        this.attr_group_list = res.data.attr_group_list;
      } else {
        const res = await this.$requestAll.goods.getGoodsDetail(
          {
            id: this.goodsId,
          },
          true
        );
        console.log(res, "获得的商品详情");
        this.goodsName = res.data.name;
        this.attr = JSON.parse(res.data.attr);
        this.goodsData = res.data;
        this.attr_group_list = res.data.attr_group_list;
      }

      // 如果规格列表就一行 默认获取完数据选中第一个规格
      if (
        this.attr_group_list.length == 1 &&
        this.attr_group_list[0].attr_list.length
      ) {
        this.onSelectAttr(
          this.attr_group_list[0].attr_group_id,
          this.attr_group_list[0].attr_list[0].attr_id
        );
      } else {
        this.onSelectAttr();
      }
      if (this.goodsData.is_real_name == 1) {
        uni.showModal({
          title: "提示",
          content: "请先进行实名认证！",

          confirmText: "立即认证",
          success: ({ confirm, cancel }) => {
            if (confirm) {
              this.$utils.toUrl("/lives/real/index");
            }
          },
        });
      } else {
        this.show = true;
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
      // let attr_group_id = typeof i != 'number' ? -1 : i;
      // let attr_id = typeof i1 != 'number' ? -1 : i1;
      if (this.goodsData.goods_add_type == 1 && this.type != "goodsAttr")
        return;
      if (this.attr_group_list[index].attr_list[index1].attr_num_0)
        return uni.$u.toast("当前规格无库存");
      // 规格组
      let attr_group_list = JSON.parse(JSON.stringify(this.attr_group_list));
      // 规格组合数组
      let attrs = JSON.parse(JSON.stringify(this.attr));
      //选中的规格id
      let checkedAttr = [];
      // 选中的规格
      let attr_list = [];

      let num0Arr = attrs.filter((it) => {
        return !Number(it.num);
      }); //无库存规格组
      console.log(num0Arr, this.attr);
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
                attr_group_name: it.attr_group_name,
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

      console.log("需要禁用的attr_id", disabledArr);

      // 跟新group_list
      this.attr_group_list = attr_group_list;
      // 设置选中规格id
      this.selectAttr.attr_list = attr_list;
      console.log(this.selectAttr.attr_list);
      // 获取规格信息
      this.getGoodsAttr();

      return;

      // 点击选中及取消
      for (let i in attr_group_list) {
        let group = attr_group_list[i];

        for (let j in attr_group_list[i].attr_list) {
          let attr = attr_group_list[i].attr_list[j];

          // 如果当前选中状态库存为0 不做任何操作
          if (attr.attr_id === attr_id && attr.attr_num_0) return;

          // 只有当前选中规格，和当前为真的取消选中。
          // 查找当前规格组,不然，其他规格组也将赋值为未选中
          if (attr_group_list[i].attr_group_id == attr_group_id) {
            if (parseInt(attr.attr_id) === attr_id && attr.checked) {
              attr.checked = false;
            } else {
              attr.checked = parseInt(attr.attr_id) === attr_id;
            }
          }

          // 获取选中规格数据
          if (attr.checked) {
            // 获取选中id
            checkedAttr.push(attr.attr_id);
            // 获取选中数据
            attr_list.push({
              attr_group_id: group.attr_group_id,
              attr_group_name: group.attr_group_name,
              attr_id: attr.attr_id,
              attr_name: attr.attr_name,
            });
          }
        }
      }

      //无库存标识添加逻辑
      //1.循环sku组合，

      // 无库存规格样式 start
      let attrNum_0 = [];
      attrs.forEach((attr) => {
        let arr = [];
        let sign = 0;
        attr.attr_list.forEach((attr_list_attr) => {
          // 当前规格不在选中规格中
          if (!checkedAttr.some((cId) => cId == attr_list_attr.attr_id)) sign++;
          arr.push(attr_list_attr.attr_id);
        });

        // 库存不足 && 当前循环
        if (attr.num <= 0 && sign <= 1) {
          attrNum_0.push(arr);
        }
      });
      console.log(attrNum_0);

      let checkedAttrLength = checkedAttr.length;
      let attrGroupListLength = attr_group_list.length;
      let newAttrNum_0 = [];
      if (attrGroupListLength - checkedAttrLength <= 1) {
        // 循环选中数据
        for (let i in checkedAttr) {
          // 循环无库存规格组合
          for (let j in attrNum_0) {
            // 如果当前选中数据存在，无规格组合，将这组规格组合未选中的放入无库存标识数组。
            if (this.$utils.inArray(checkedAttr[i], attrNum_0[j])) {
              for (let k in attrNum_0[j]) {
                if (attrNum_0[j][k] !== checkedAttr[i]) {
                  newAttrNum_0.push(attrNum_0[j][k]);
                }
              }
            }
          }
        }

        // // 规格组只有一组 添加无库存标识  当前为未选中的时候就做判断是否有无库存规格组合
        attrs.forEach((attrData) => {
          if (attrData.num <= 0) {
            attrData.attr_list[0] &&
              newAttrNum_0.push(attrData.attr_list[0].attr_id);
          }
        });
      }

      //库存为0的规格添加标识
      for (let i in attr_group_list) {
        for (let j in attr_group_list[i].attr_list) {
          let cAttr = attr_group_list[i].attr_list[j];

          //  cAttr.attr_num_0 =
          //   newAttrNum_0.some(item => item == cAttr.attr_id) &&
          //   !checkedAttr.some(item => item == cAttr.attr_id);

          cAttr.attr_num_0 =
            this.$utils.inArray(cAttr.attr_id, newAttrNum_0) &&
            !this.$utils.inArray(cAttr.attr_id, checkedAttr);
        }
      }

      // 跟新group_list
      this.attr_group_list = attr_group_list;
      // 设置选中规格id
      this.selectAttr.attr_list = attr_list;
      // 获取规格信息
      this.getGoodsAttr();
    },

    selectGroup(id) {
      console.log(id);
      this.pintuanGroupId = id;
      this.getGoodsAttr();
    },

    // 获取选中规格信息
    getGoodsAttr() {
      // 当前表示规格种类只有一种..  可根据规格信息判断库存.
      const attr_list = this.selectAttr.attr_list;
      const attr_group_list = this.attr_group_list;
      const attr = this.attr;
      if (attr_list.length == attr_group_list.length) {
        // 获取选中规格数据
        console.log("选择完成");
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

    async submit() {
		 //#ifdef APP-PLUS
		 if(this.systemInfo.osName !== 'ios'){
			 uni.showModal({
			 	title:'提示',
			 	content:"是否允许系统获取您的位置信息?用于获取您的收货地址",
			 	success:async ({confirm,cancel}) => {
			 		if(confirm) {
			 			if (
			 			  this.selectAttr.attr_list.length < this.attr_group_list.length &&
			 			  this.total.num <= 0
			 			)
			 			  return this.$utils.toast("请正确选择商品规格!");
			 			
			 			if (this.selectAttr.num > this.attrData.num)
			 			  return this.$utils.toast("当前选中规格库存不足!");
			 			// 重新计算text规格名称
			 			// this.confirmText();
			 			
			 			this.show = false;
			 			
			 			// 当前为加入购物车
			 			if (this.showType == "addCart") {
			 			  if (this.goodsData.goods_add_type == 1) {
			 			    var formData = {
			 			      goods_id: this.goodsId,
			 			      num: this.total.num,
			 			      // attr: JSON.stringify(this.selectAttr.attr_list),
			 			    };
			 			    let attr = this.attr.filter((item) => item.number);
			 			    formData.attr_list = JSON.stringify(attr);
			 			  } else {
			 			    var formData = {
			 			      goods_id: this.goodsId,
			 			      num: this.selectAttr.num,
			 			      attr: JSON.stringify(this.selectAttr.attr_list),
			 			    };
			 			  }
			 			  formData = Object.assign(formData, { vgoods_id: this.vgoods_id });
			 			  const res = await this.$requestAll.cart.addCart(formData);
			 			  await this.$store.dispatch("getTabBarData");
			 			  this.$utils.toast(res.msg);
			 			}
			 			// 跳转预订单
			 			else if (this.showType == "buy") {
			 			  if (this.type == "miaosha") {
			 			    const time = new Date().getTime();
			 			    if (this.goodsData.miaosha.begin_time * 1000 >= time)
			 			      return uni.$u.toast("活动未开始");
			 			    if (time >= this.goodsData.miaosha.end_time * 1000)
			 			      return uni.$u.toast("活动已结束");
			 			
			 			    var goods_info = {
			 			      goods_id: this.goodsId,
			 			      attr: this.selectAttr.attr_list,
			 			      num: this.selectAttr.num,
			 			    };
			 			
			 			    this.$utils.toUrl(
			 			      "/miaosha/order-submit/order-submit?goods_info=" +
			 			        JSON.stringify(goods_info)
			 			    );
			 			  } else if (this.type == "pintuan") {
			 			    var goods_info = {
			 			      goods_id: this.goodsId,
			 			      attr: this.selectAttr.attr_list,
			 			      num: this.selectAttr.num,
			 			      type: this.pinTuanData.type,
			 			      deliver_type: 1,
			 			      group_id: this.pintuanGroupId,
			 			      parent_id: 0,
			 			      mch_id: this.goodsData.mch.id || "",
			 			    };
			 			    if (this.pinTuanData.order_id) {
			 			      goods_info.type = "GROUP_BUY_C";
			 			      goods_info.group_id = 0;
			 			      goods_info.parent_id = this.pinTuanData.order_id;
			 			      goods_info.deliver_type = 3;
			 			    }
			 			    if (this.pinTuanData.type == "ONLY_BUY") {
			 			      goods_info.deliver_type = 3;
			 			    }
			 			
			 			    this.$utils.toUrl(
			 			      "/pt/order-submit/order-submit?goods_info=" +
			 			        JSON.stringify(goods_info)
			 			    );
			 			  }
			 			  // 预约商品
			 			  else if (this.type == "yuyue") {
			 			    const goods_info = [
			 			      {
			 			        id: this.goodsId,
			 			        attr: this.selectAttr.attr_list,
			 			      },
			 			    ];
			 			    this.$utils.toUrl(
			 			      "/book/submit/submit?goods_info=" + JSON.stringify(goods_info)
			 			    );
			 			  } else if (this.type == "crowdfund") {
			 			    var goods_info = Object.assign(this.selectAttr, {
			 			      attr: this.selectAttr.attr_list,
			 			    });
			 			    delete goods_info.attr_list;
			 			    this.$utils.toUrl(
			 			      "/pages/order-submit/order-submit?pageType=crowdfund&goods_info=" +
			 			        JSON.stringify(goods_info)
			 			    );
			 			  }
			 			
			 			  // 步数宝
			 			  else if (this.type == "step") {
			 			    var queryData = {
			 			      step_id: this.goodsId,
			 			      goods_info: JSON.stringify({
			 			        goods_id: this.goodsId,
			 			        attr: this.selectAttr.attr_list,
			 			        num: this.selectAttr.num,
			 			      }),
			 			      pageType: "step",
			 			    };
			 			    this.$utils.toUrl(
			 			      "/pages/order-submit/order-submit" + uni.$u.queryParams(queryData)
			 			    );
			 			  }
			 			  // 普通商品
			 			  else if (this.type == "goods") {
			 			    var mch_list = [
			 			      {
			 			        mch_id: this.goodsData.mch ? this.goodsData.mch.id : 0,
			 			        goods_list: [
			 			          {
			 			            goods_id: this.goodsData.id,
			 			            num: this.selectAttr.num,
			 			            attr: this.selectAttr.attr_list,
			 			          },
			 			        ],
			 			      },
			 			    ];
			 			    if (this.goodsData.goods_add_type == 1) {
			 			      let attr = this.attr.filter((item) => item.number);
			 			      let goods_list = attr.map((item) => {
			 			        return {
			 			          goods_id: this.goodsData.id,
			 			          num: item.number,
			 			          attr: item.attr_list,
			 			        };
			 			      });
			 			      mch_list[0].goods_list = goods_list;
			 			    }
			 			    console.log(mch_list);
			 			
			 			    this.$utils.toUrl(
			 			      `/pages/order-submit/order-submit?goodsData=${encodeURIComponent(
			 			        JSON.stringify(mch_list)
			 			      )}&room_id=${this.room_id}`
			 			    );
			 			  }
			 			  //跳转积分兑换预订单
			 			  else if (this.type == "integral") {
			 			    const formData = {
			 			      goods_id: this.goodsId,
			 			      attr: this.selectAttr.attr_list,
			 			      num: this.selectAttr.num,
			 			    };
			 			
			 			    this.$utils.toUrl(
			 			      "/integral-mall/order-submit/order-submit?goods_info=" +
			 			        JSON.stringify(formData)
			 			    );
			 			  }
			 			}
			 			// 将选中规格发出
			 			else {
			 			  //选中数据  选中商品名称  是否为立即购买
			 			  this.$emit(
			 			    "confirm",
			 			    {
			 			      ...this.selectAttr,
			 			      pintuanGroupId: this.pintuanGroupId,
			 			      attrData: this.attrData,
			 			      imgUrl: this.imageUrl,
			 			      goodsName: this.goodsName,
			 			    },
			 			    this.showType
			 			  );
			 			}
			 		}
			 	}
			 })
		 }else {
			 if (
			   this.selectAttr.attr_list.length < this.attr_group_list.length &&
			   this.total.num <= 0
			 )
			   return this.$utils.toast("请正确选择商品规格!");
			 
			 if (this.selectAttr.num > this.attrData.num)
			   return this.$utils.toast("当前选中规格库存不足!");
			 // 重新计算text规格名称
			 // this.confirmText();
			 
			 this.show = false;
			 
			 // 当前为加入购物车
			 if (this.showType == "addCart") {
			   if (this.goodsData.goods_add_type == 1) {
			     var formData = {
			       goods_id: this.goodsId,
			       num: this.total.num,
			       // attr: JSON.stringify(this.selectAttr.attr_list),
			     };
			     let attr = this.attr.filter((item) => item.number);
			     formData.attr_list = JSON.stringify(attr);
			   } else {
			     var formData = {
			       goods_id: this.goodsId,
			       num: this.selectAttr.num,
			       attr: JSON.stringify(this.selectAttr.attr_list),
			     };
			   }
			   formData = Object.assign(formData, { vgoods_id: this.vgoods_id });
			   const res = await this.$requestAll.cart.addCart(formData);
			   await this.$store.dispatch("getTabBarData");
			   this.$utils.toast(res.msg);
			 }
			 // 跳转预订单
			 else if (this.showType == "buy") {
			   if (this.type == "miaosha") {
			     const time = new Date().getTime();
			     if (this.goodsData.miaosha.begin_time * 1000 >= time)
			       return uni.$u.toast("活动未开始");
			     if (time >= this.goodsData.miaosha.end_time * 1000)
			       return uni.$u.toast("活动已结束");
			 
			     var goods_info = {
			       goods_id: this.goodsId,
			       attr: this.selectAttr.attr_list,
			       num: this.selectAttr.num,
			     };
			 
			     this.$utils.toUrl(
			       "/miaosha/order-submit/order-submit?goods_info=" +
			         JSON.stringify(goods_info)
			     );
			   } else if (this.type == "pintuan") {
			     var goods_info = {
			       goods_id: this.goodsId,
			       attr: this.selectAttr.attr_list,
			       num: this.selectAttr.num,
			       type: this.pinTuanData.type,
			       deliver_type: 1,
			       group_id: this.pintuanGroupId,
			       parent_id: 0,
			       mch_id: this.goodsData.mch.id || "",
			     };
			     if (this.pinTuanData.order_id) {
			       goods_info.type = "GROUP_BUY_C";
			       goods_info.group_id = 0;
			       goods_info.parent_id = this.pinTuanData.order_id;
			       goods_info.deliver_type = 3;
			     }
			     if (this.pinTuanData.type == "ONLY_BUY") {
			       goods_info.deliver_type = 3;
			     }
			 
			     this.$utils.toUrl(
			       "/pt/order-submit/order-submit?goods_info=" +
			         JSON.stringify(goods_info)
			     );
			   }
			   // 预约商品
			   else if (this.type == "yuyue") {
			     const goods_info = [
			       {
			         id: this.goodsId,
			         attr: this.selectAttr.attr_list,
			       },
			     ];
			     this.$utils.toUrl(
			       "/book/submit/submit?goods_info=" + JSON.stringify(goods_info)
			     );
			   } else if (this.type == "crowdfund") {
			     var goods_info = Object.assign(this.selectAttr, {
			       attr: this.selectAttr.attr_list,
			     });
			     delete goods_info.attr_list;
			     this.$utils.toUrl(
			       "/pages/order-submit/order-submit?pageType=crowdfund&goods_info=" +
			         JSON.stringify(goods_info)
			     );
			   }
			 
			   // 步数宝
			   else if (this.type == "step") {
			     var queryData = {
			       step_id: this.goodsId,
			       goods_info: JSON.stringify({
			         goods_id: this.goodsId,
			         attr: this.selectAttr.attr_list,
			         num: this.selectAttr.num,
			       }),
			       pageType: "step",
			     };
			     this.$utils.toUrl(
			       "/pages/order-submit/order-submit" + uni.$u.queryParams(queryData)
			     );
			   }
			   // 普通商品
			   else if (this.type == "goods") {
			     var mch_list = [
			       {
			         mch_id: this.goodsData.mch ? this.goodsData.mch.id : 0,
			         goods_list: [
			           {
			             goods_id: this.goodsData.id,
			             num: this.selectAttr.num,
			             attr: this.selectAttr.attr_list,
			           },
			         ],
			       },
			     ];
			     if (this.goodsData.goods_add_type == 1) {
			       let attr = this.attr.filter((item) => item.number);
			       let goods_list = attr.map((item) => {
			         return {
			           goods_id: this.goodsData.id,
			           num: item.number,
			           attr: item.attr_list,
			         };
			       });
			       mch_list[0].goods_list = goods_list;
			     }
			     console.log(mch_list);
			 
			     this.$utils.toUrl(
			       `/pages/order-submit/order-submit?goodsData=${encodeURIComponent(
			         JSON.stringify(mch_list)
			       )}&room_id=${this.room_id}`
			     );
			   }
			   //跳转积分兑换预订单
			   else if (this.type == "integral") {
			     const formData = {
			       goods_id: this.goodsId,
			       attr: this.selectAttr.attr_list,
			       num: this.selectAttr.num,
			     };
			 
			     this.$utils.toUrl(
			       "/integral-mall/order-submit/order-submit?goods_info=" +
			         JSON.stringify(formData)
			     );
			   }
			 }
			 // 将选中规格发出
			 else {
			   //选中数据  选中商品名称  是否为立即购买
			   this.$emit(
			     "confirm",
			     {
			       ...this.selectAttr,
			       pintuanGroupId: this.pintuanGroupId,
			       attrData: this.attrData,
			       imgUrl: this.imageUrl,
			       goodsName: this.goodsName,
			     },
			     this.showType
			   );
			 }
		 }
	
      //#endif
	  //#ifdef MP-WEIXIN || H5
	  if (
	    this.selectAttr.attr_list.length < this.attr_group_list.length &&
	    this.total.num <= 0
	  )
	    return this.$utils.toast("请正确选择商品规格!");
	  
	  if (this.selectAttr.num > this.attrData.num)
	    return this.$utils.toast("当前选中规格库存不足!");
	  // 重新计算text规格名称
	  // this.confirmText();
	  
	  this.show = false;
	  
	  // 当前为加入购物车
	  if (this.showType == "addCart") {
	    if (this.goodsData.goods_add_type == 1) {
	      var formData = {
	        goods_id: this.goodsId,
	        num: this.total.num,
	        // attr: JSON.stringify(this.selectAttr.attr_list),
	      };
	      let attr = this.attr.filter((item) => item.number);
	      formData.attr_list = JSON.stringify(attr);
	    } else {
	      var formData = {
	        goods_id: this.goodsId,
	        num: this.selectAttr.num,
	        attr: JSON.stringify(this.selectAttr.attr_list),
	      };
	    }
	    formData = Object.assign(formData, { vgoods_id: this.vgoods_id });
	    const res = await this.$requestAll.cart.addCart(formData);
	    await this.$store.dispatch("getTabBarData");
	    this.$utils.toast(res.msg);
	  }
	  // 跳转预订单
	  else if (this.showType == "buy") {
	    if (this.type == "miaosha") {
	      const time = new Date().getTime();
	      if (this.goodsData.miaosha.begin_time * 1000 >= time)
	        return uni.$u.toast("活动未开始");
	      if (time >= this.goodsData.miaosha.end_time * 1000)
	        return uni.$u.toast("活动已结束");
	  
	      var goods_info = {
	        goods_id: this.goodsId,
	        attr: this.selectAttr.attr_list,
	        num: this.selectAttr.num,
	      };
	  
	      this.$utils.toUrl(
	        "/miaosha/order-submit/order-submit?goods_info=" +
	          JSON.stringify(goods_info)
	      );
	    } else if (this.type == "pintuan") {
	      var goods_info = {
	        goods_id: this.goodsId,
	        attr: this.selectAttr.attr_list,
	        num: this.selectAttr.num,
	        type: this.pinTuanData.type,
	        deliver_type: 1,
	        group_id: this.pintuanGroupId,
	        parent_id: 0,
	        mch_id: this.goodsData.mch.id || "",
	      };
	      if (this.pinTuanData.order_id) {
	        goods_info.type = "GROUP_BUY_C";
	        goods_info.group_id = 0;
	        goods_info.parent_id = this.pinTuanData.order_id;
	        goods_info.deliver_type = 3;
	      }
	      if (this.pinTuanData.type == "ONLY_BUY") {
	        goods_info.deliver_type = 3;
	      }
	  
	      this.$utils.toUrl(
	        "/pt/order-submit/order-submit?goods_info=" +
	          JSON.stringify(goods_info)
	      );
	    }
	    // 预约商品
	    else if (this.type == "yuyue") {
	      const goods_info = [
	        {
	          id: this.goodsId,
	          attr: this.selectAttr.attr_list,
	        },
	      ];
	      this.$utils.toUrl(
	        "/book/submit/submit?goods_info=" + JSON.stringify(goods_info)
	      );
	    } else if (this.type == "crowdfund") {
	      var goods_info = Object.assign(this.selectAttr, {
	        attr: this.selectAttr.attr_list,
	      });
	      delete goods_info.attr_list;
	      this.$utils.toUrl(
	        "/pages/order-submit/order-submit?pageType=crowdfund&goods_info=" +
	          JSON.stringify(goods_info)
	      );
	    }
	  
	    // 步数宝
	    else if (this.type == "step") {
	      var queryData = {
	        step_id: this.goodsId,
	        goods_info: JSON.stringify({
	          goods_id: this.goodsId,
	          attr: this.selectAttr.attr_list,
	          num: this.selectAttr.num,
	        }),
	        pageType: "step",
	      };
	      this.$utils.toUrl(
	        "/pages/order-submit/order-submit" + uni.$u.queryParams(queryData)
	      );
	    }
	    // 普通商品
	    else if (this.type == "goods") {
	      var mch_list = [
	        {
	          mch_id: this.goodsData.mch ? this.goodsData.mch.id : 0,
	          goods_list: [
	            {
	              goods_id: this.goodsData.id,
	              num: this.selectAttr.num,
	              attr: this.selectAttr.attr_list,
	            },
	          ],
	        },
	      ];
	      if (this.goodsData.goods_add_type == 1) {
	        let attr = this.attr.filter((item) => item.number);
	        let goods_list = attr.map((item) => {
	          return {
	            goods_id: this.goodsData.id,
	            num: item.number,
	            attr: item.attr_list,
	          };
	        });
	        mch_list[0].goods_list = goods_list;
	      }
	      console.log(mch_list);
	  
	      this.$utils.toUrl(
	        `/pages/order-submit/order-submit?goodsData=${encodeURIComponent(
	          JSON.stringify(mch_list)
	        )}&room_id=${this.room_id}`
	      );
	    }
	    //跳转积分兑换预订单
	    else if (this.type == "integral") {
	      const formData = {
	        goods_id: this.goodsId,
	        attr: this.selectAttr.attr_list,
	        num: this.selectAttr.num,
	      };
	  
	      this.$utils.toUrl(
	        "/integral-mall/order-submit/order-submit?goods_info=" +
	          JSON.stringify(formData)
	      );
	    }
	  }
	  // 将选中规格发出
	  else {
	    //选中数据  选中商品名称  是否为立即购买
	    this.$emit(
	      "confirm",
	      {
	        ...this.selectAttr,
	        pintuanGroupId: this.pintuanGroupId,
	        attrData: this.attrData,
	        imgUrl: this.imageUrl,
	        goodsName: this.goodsName,
	      },
	      this.showType
	    );
	  }
	  //#endif
    },

    modifySelect(data) {
      this.selectAttr = data;
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
            number: this.selectAttr.num,
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
            number: this.selectAttr.num,
          },
          true
        );
        this.attrInfo = res.data;
      }
    },
    numberChange(e, item, index) {
      item.number = e.value;
      this.$set(this.attr, index, item);
    },
    // 预览图片
    previewImage(imgUrl) {
      uni.previewImage({
        current: "",
        urls: [imgUrl],
        fail: (err) => {
          uni.showModal({
            title: "提示",
            content: JSON.stringify(err),
          });
        },
      });
    },
    // 重新计算text规格名称

    // confirmText() {
    //   let text = '';
    //   this.attr_group_list.forEach(group => {
    //     group.attr_list.forEach(attr => {
    //       if (attr.checked) {
    //         text += `${attr.attr_name},`;
    //       }
    //     });
    //   });
    //   this.attrName = text.substring(text.length - 1, 0);
    // },
  },

  computed: {
    // 库存计算
    numberNum() {
      if (this.attrData) {
        return this.attrData.num;
      } else if (this.goodsData) {
        if (this.type == "integral") {
          // 当前库存大于等于限购数量。最大购买为限购数量
          if (this.goodsData.goods_num >= this.goodsData.user_num)
            return this.goodsData.user_num;
          // 当前限购为库存为主
          return this.goodsData.goods_num;
        }

        return this.goodsData.num || 0;
      }

      return 0;
    },
    // 规格价格 //默认为商品价格
    attrPrice() {
      // 规格数据
      const attrData = this.attrData;
      const attrInfo = this.attrInfo;
      // 商品数据
      const goodsData = this.goodsData;

      // 如下类型已对接规格信息接口
      if (attrInfo) {
        switch (this.type) {
          // 普通商品
          case "goods":
            if (attrInfo.member_price && goodsData.is_level) {
              return attrInfo.member_price;
            } else {
              return attrInfo.price;
            }
            break;

          // 拼团
          case "pintuan":
            if (this.pinTuanData.type == "ONLY_BUY") {
              return attrInfo.single;
            } else {
              return attrInfo.price;
            }
            break;

          default:
            break;
        }
      }

      if (attrData) {
        // 积分
        if (this.type == "integral") {
          return this.attr.length > 1
            ? `￥${attrData.integral}积分 ￥${attrData.price}`
            : `￥${goodsData.integral}积分 ￥${goodsData.price}`;
        }
        // 秒杀
        else if (this.type == "miaosha") {
          return attrData.price
            ? attrData.price
            : goodsData.miaosha.miaosha_price;
        }

        // 预约
        else if (this.type == "yuyue") {
          return attrData.member_price
            ? attrData.member_price
            : attrData.price
            ? attrData.price
            : "免费预约";
        } else {
          return attrData.price ? attrData.price : goodsData.price;
        }
      }

      // 未选择规格
      else if (goodsData) {
        // 积分
        if (this.type == "integral") {
          return `￥${goodsData.integral}积分 ￥${goodsData.price}`;
        }
        // 秒杀
        else if (this.type == "miaosha") {
          return goodsData.miaosha.miaosha_price;
        }

        // 预约
        else if (this.type == "yuyue") {
          return goodsData.price != 0 ? goodsData.price : "免费预约";
        } else {
          return goodsData.price;
        }
      }
      return "";
    },
    // 库存 默认为商品库存
    attrKucun() {
      const attrData = this.attrData;
      const attrInfo = this.attrInfo;
      const goodsData = this.goodsData;
      if (attrInfo) {
        return attrInfo.num;
      } else if (attrData) {
        return attrData.num;
      } else {
        return goodsData.num;
      }
    },
    // 规格图片路径
    imageUrl() {
      const attrData = this.attrData;
      const attrInfo = this.attrInfo;
      const goodsData = this.goodsData;
      // if (attrData && attrData.pic && this.type == 'goods') {
      //   return attrInfo.pic ? attrInfo.pic : attrData.pic;
      // } else {
      //   return goodsData.cover_pic;
      // }
      return attrData.pic || attrInfo.pic || goodsData.cover_pic;
    },
    total() {
      if (this.attr) {
        var num = 0,
          price = 0;

        this.attr.forEach((item) => {
          if (item.number) {
            num += item.number;

            // 只有默认规格
            if (!this.goodsData.use_attr) {
              if (this.goodsData.member_price) {
                price += item.number * this.goodsData.member_price;
              } else {
                price += item.number * this.goodsData.price;
              }
            }

            // 自定义规格
            else {
              if (item.member_price) {
                price += item.number * item.member_price;
              } else {
                price += item.number * item.price;
              }
            }
          }
        });
        return {
          num: num.toFixed(2),
          price: price.toFixed(2),
        };
      }
      return {
        num: 0,
        price: 0,
      };
    },
    // 商品开启会员价 用户有会员等级

    filterPrice(item) {
      return function (item) {
        // 只有默认规格，取商品上的价格
        if (!this.goodsData.use_attr) {
          if (
            this.goodsData.member_price &&
            (this.goodsData.is_member_price || this.goodsData.is_level)
          ) {
            return this.goodsData.member_price;
          } else {
            return this.goodsData.price;
          }
        }

        // 取规格价格
        else {
          if (
            item.member_price &&
            (this.goodsData.is_member_price || this.goodsData.is_level)
          ) {
            return item.member_price;
          } else {
            return item.price;
          }
        }
      };
    },

    userInfo() {
      return this.$store.getters["user/userInfo"];
    },
  },
  filters: {},
  options: {
    styleIsolation: "shared",
  },
};
</script>

<style lang="scss" scoped>
/deep/.u-number-box {
  height: 60rpx !important;
  line-height: 60rpx !important;
  border-radius: 10rpx !important;
  border: 2rpx solid #f2f2f2 !important;
  background: #fff !important;
  .u-number-box__minus {
    background-color: initial !important;
    width: 60rpx !important;
    height: 60rpx !important;
    line-height: 60rpx !important;
    font-weight: 900 !important;
    .uicon-minus {
      font-size: 30rpx !important;
    }
  }
  .u-number-box__plus {
    width: 60rpx !important;
    height: 60rpx !important;
    line-height: 60rpx !important;
    background-color: initial !important;
    font-weight: 900 !important;
    .uicon-plus {
      font-size: 30rpx !important;
    }
  }
}
.title-info {
  padding: 36rpx;
  display: flex;

  > image {
    width: 192rpx;
    height: 192rpx;
    background: #f2f2f2;
    opacity: 1;
    border-radius: 14rpx;
  }

  .price-box {
    flex: 1;
    width: 0;
    margin-left: 20rpx;
    padding-top: 68rpx;

    .stock {
      color: red;
      font-size: 24rpx;
    }
  }
}

.popup-box {
  max-height: calc(70vh - 300rpx);

  .att-box {
    padding: 0 24rpx;

    .att-title {
      line-height: 80rpx;
      font-size: 26rpx;
      font-weight: 700;
    }

    .att-content {
      display: flex;
      flex-wrap: wrap;

      > view {
        padding: 8rpx 18rpx;
        margin-right: 24rpx;
        margin-bottom: 24rpx;
        font-size: 26rpx;
        background: #f2f1f2;
        border-radius: 28rpx;
        // text-align: center;
        // min-width: 100rpx;
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

  .num-box {
    padding: 24rpx;
  }
}
.popup-btns {
  margin: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  > view {
    margin-right: 20rpx;
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }

  .submit-bt {
    flex: 1;
    width: 0;
    height: 76rpx;
    border-radius: 35rpx;
    background: linear-gradient(90deg, #f22407 0%, #f84d17 100%);

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 26rpx;
    font-weight: 600;
    color: #ffffff;
  }

  .add-cart {
    background: linear-gradient(90deg, #ffb11c 0%, #ffbf14 100%);
  }
}
.popup-btns_1 {
  position: relative;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba($color: #fff, $alpha: 0.4);
  }
}

.goods-attr {
  color: #333;
  line-height: 92rpx;
  padding: 0 24rpx;
  background: #fff;
  // margin-top: 24rpx;

  > view:nth-child(1) {
    margin-right: 30rpx;
  }

  > view:nth-child(2) {
    margin-right: 20rpx;
  }
}
</style>
