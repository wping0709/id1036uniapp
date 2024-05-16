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

    <u-popup safeAreaInsetBottom :show="show" @close="popupClose" round="20rpx" :zIndex="10077">
      <!-- 头部规格价格 及库存信息 -->
      <view class="title-info">
        <image :src="imageUrl" mode="aspectFill" />

        <view class="price-box">
          <view class="font-600-30">
            <PriceText
              :price="attrPrice"
              ySize="44rpx"
              fSize="30rpx"
            ></PriceText>
            <text
              v-if="isMember"
              style="font-size: 22rpx; margin-left: 10rpx; color: red"
              >会员价</text
            >
          </view>

          <view class="stock">库存：{{ attrKucun }}</view>

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
                  <text class="m-l-10">/件</text>
                </view>
                <view>采购价￥{{ item | filterPrice }}</view>
              </view>

              <view>
                <u-number-box
                  bgColor="transparent"
                  inputWidth="92rpx"
                  v-model="item.number"
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
            v-for="item in attr_group_list"
            :key="item.attr_group_id"
          >
            <view class="att-title">{{ item.attr_group_name }}</view>
            <view class="att-content">
              <view
                :class="[
                  item1.checked && 'check',
                  item1.attr_num_0 && 'display',
                ]"
                @click="onSelectAttr(item.attr_group_id, item1.attr_id)"
                v-for="item1 in item.attr_list"
                :key="item1.attr_id"
              >
                {{ item1.attr_name }}
              </view>
            </view>
          </view>

          <!-- 数量步进器 -->
          <view
            v-if="
              !(type == 'integral' || type == 'blind' || type == 'crowdfund')
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
                v-model="selectAttr.num"
                :min="1"
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

      <div :class="['popup-btns', goodsData.num <= 0 && 'popup-btns_1']">
        <view @click="submit" class="submit-bt">
          加入购物车
        </view>
      </div>
    </u-popup>
  </view>
</template>

<script>
import PriceText from '@/components/price-text';
export default {
  components: {
    PriceText,
  },
  props: {
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
      default: 'goods',
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
          type: 'GROUP_BUY',
        };
      },
    },
  },
  data() {
    return {
      show: false,
      isMember: false,
      selectAttr: {
        goods_id: this.goodsId,
        num: 1,
        attr_list: [],
      },
      showType: 'buy', //打开弹框类型默认为购买
      // attrName: '请选择规格', //文本展示内容
      goodsData: '', //商品数据
      attrInfo: '', //根据规格获取的信息
      attrData: '', // 规格详情
      attr_group_list: '', //规格组
      attr: '', //所有规格组
      attr_group_num: '', //拼团使用选择拼团人数选择
      pintuanGroupId: 0, //拼团人数规格id
    };
  },
  watch: {},
  methods: {
    clickAddCart() {
      this.showType = 'addCart';
      this.submit();
    },
    //   显示弹框
    showPopup(showType) {
      // 打开弹框类型
      this.showType = showType;

      // 需等dom元素渲染完毕再调取数据，  修复bug父组件传参获取不到问题
      this.$nextTick(() => {
        // 商品id发生变化在获取商品数据之后再显示弹框,秒杀商品无法根据goodsData id来做判断
        if (this.type == 'miaosha') {
          if (!this.goodsData) {
            this.getGoodsDetail();
          } else {
            this.show = true;
          }
        } else {
          if (this.goodsId != this.goodsData.id) {
            this.attrInfo = this.$options.data().attrInfo
            this.getGoodsDetail();
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
      if (this.type == 'integral') {
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
      } else if (this.type == 'step') {
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
      } else if (this.type == 'crowdfund') {
        const res = await this.$requestAll.crowdfund.details({
          id: this.goodsId,
        });
        this.attr = res.data.attr_group_list;
        this.goodsData = Object.assign(res.data, {
          cover_pic: res.data.pic_list[0]?.pic_url,
        });
        this.attr_group_list = res.data.attr_group_list;
      } else if (this.type == 'miaosha') {
        const res = await this.$requestAll.miaosha.details({
          id: this.goodsId,
          scene_type: 0,
        });
        this.attr = JSON.parse(res.data.attr);
        this.goodsData = res.data;
        this.attr_group_list = res.data.attr_group_list;
      } else if (this.type == 'pintuan') {
        const res = await this.$requestAll.group.goodDetail({
          gid: this.goodsId,
        });
        this.attr = res.data.info.attr;
        this.goodsData = res.data.info;
        this.attr_group_list = res.data.attr_group_list;
        this.attr_group_num = res.data.attr_group_num;
      } else if (this.type == 'yuyue') {
        const res = await this.$requestAll.book.goodDetails({
          gid: this.goodsId,
        });
        this.goodsData = res.data.info;
        this.attr = res.data.info.attr;
        this.attr_group_list = res.data.attr_group_list;
        // 设置库存属性
        this.goodsData.num = res.data.info.stock;
      } else if (this.type == 'blind') {
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
        this.attr = JSON.parse(res.data.attr);
        this.goodsData = res.data;
        this.attr_group_list = res.data.attr_group_list;
      }
      this.onSelectAttr();
      this.show = true;
    },

    // 点击规格 规格组索引
    onSelectAttr(i, i1) {
      let attr_group_list = JSON.parse(JSON.stringify(this.attr_group_list));
      let attrs = JSON.parse(JSON.stringify(this.attr));
      let attr_group_id = i || -1;
      let attr_id = parseInt(i1) || -1;
      let checkedAttr = [];
      let attr_list = [];

      // 点击选中及取消
      for (let i in attr_group_list) {
        if (attr_group_list[i].attr_group_id != attr_group_id) {
          continue;
        }

        // TODO 重新写个for循环是为了解决bug,如有更好方案再修改
        for (let j in attr_group_list[i].attr_list) {
          let aGList = attr_group_list[i].attr_list[j];

          if (parseInt(aGList.attr_id) === attr_id && aGList.checked) {
            aGList.checked = false;
          } else {
            aGList.checked = parseInt(aGList.attr_id) === attr_id;
          }
        }
      }

      // attr_group_list.forEach(group_item => {
      // })

      // 规格组只有一组 处理库存不足问题
      if (attr_group_list.length == 1) {
        // 库存不足规格id
        let dArr = [];
        attrs.forEach(attrData => {
          if (attrData.num <= 0) {
            attrData.attr_list[0] && dArr.push(attrData.attr_list[0].attr_id);
          }
        });
        attr_group_list[0].attr_list.forEach(attr => {
          if (dArr.some(s => s == attr.attr_id)) {
            attr.attr_num_0 = true;
          }
        });
        this.$set(this, 'attr_group_list', attr_group_list);
      }

      // 获取选中规格数据
      attr_group_list.forEach(group => {
        group.attr_list.forEach(attrOBJ => {
          if (attrOBJ.checked) {
            // 获取选中id
            checkedAttr.push(attrOBJ.attr_id);
            // 获取选中数据
            attr_list.push({
              attr_group_id: group.attr_group_id,
              attr_group_name: group.attr_group_name,
              attr_id: attrOBJ.attr_id,
              attr_name: attrOBJ.attr_name,
            });
          }
        });
      });

      for (let i in attr_group_list) {
        // 如果库存为0 则不往下执行
        for (let j in attr_group_list[i].attr_list) {
          let aGList = attr_group_list[i].attr_list[j];
          if (aGList.attr_id === attr_id && aGList.attr_num_0 === true) {
            return;
          }
        }
      }

      // 无库存规格样式 start
      let attrNum_0 = [];
      attrs.forEach(attr => {
        let arr = [];
        let sign = 0;
        attr.attr_list.forEach(attr_list_attr => {
          // 当前规格不在选中规格中
          if (!checkedAttr.some(cId => cId == attr_list_attr.attr_id)) {
            sign++;
          }
          arr.push(attr_list_attr.attr_id);
        });
        // 库存不足且不在选中规格组中
        if (attr.num <= 0 && sign <= 1) {
          attrNum_0.push(arr);
        }
        // console.log(attrNum_0, sign, arr);
      });

      let checkedAttrLength = checkedAttr.length;
      let attrGroupListLength = attr_group_list.length;
      let newAttrNum_0 = [];
      if (attrGroupListLength - checkedAttrLength <= 1) {
        for (let i in checkedAttr) {
          for (let j in attrNum_0) {
            if (this.$utils.inArray(checkedAttr[i], attrNum_0[j])) {
              for (let k in attrNum_0[j]) {
                if (attrNum_0[j][k] !== checkedAttr[i]) {
                  newAttrNum_0.push(attrNum_0[j][k]);
                }
              }
            }
          }
        }
      }

      //库存为0的规格添加标识
      for (let i in attr_group_list) {
        for (let j in attr_group_list[i].attr_list) {
          let cAttr = attr_group_list[i].attr_list[j];
          if (
            this.$utils.inArray(cAttr.attr_id, newAttrNum_0) &&
            !this.$utils.inArray(cAttr.attr_id, checkedAttr)
          ) {
            cAttr.attr_num_0 = true;
          } else {
            cAttr.attr_num_0 = false;
          }
        }
      }

      // 跟新group_list
      this.attr_group_list = attr_group_list;
      // 设置选中规格id
      this.selectAttr.attr_list = attr_list;
      // 获取规格信息
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
        console.log('选择完成');
        attr.forEach(attrData => {
          let i = 0;
          attrData.attr_list.forEach(attr => {
            if (attr_list.some(s => s.attr_id == attr.attr_id)) {
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
      if (
        this.selectAttr.attr_list.length < this.attr_group_list.length &&
        this.goodsData.goods_add_type != 1
      )
        return this.$utils.toast('请正确选择商品规格!');

      if (this.goodsData.goods_add_type == 1 && this.total.num <= 0)
        return uni.$u.toast('请正确选择商品规格!');

      if (this.selectAttr.num > this.attrData.num)
        return this.$utils.toast('当前选中规格库存不足!');
      // 重新计算text规格名称
      // this.confirmText();

      this.show = false;

      // 当前为加入购物车
      if (this.showType == 'addCart') {
        if (this.goodsData.goods_add_type == 1) {
          var formData = {
            goods_id: this.goodsId,
            num: this.total.num,
            // attr: JSON.stringify(this.selectAttr.attr_list),
          };
          let attr = this.attr.filter(item => item.number);
          formData.attr_list = JSON.stringify(attr);
        } else {
          var formData = {
            goods_id: this.goodsId,
            num: this.selectAttr.num,
            attr: JSON.stringify(this.selectAttr.attr_list),
          };
        }
        const res = await this.$requestAll.cart.addCart(formData);
        await this.$store.dispatch('getTabBarData');
        this.$utils.toast(res.msg);
      }
      // 跳转预订单
      else if (this.showType == 'buy') {
        if (this.type == 'miaosha') {
          const time = new Date().getTime();
          if (this.goodsData.miaosha.begin_time * 1000 >= time)
            return uni.$u.toast('活动未开始');
          if (time >= this.goodsData.miaosha.end_time * 1000)
            return uni.$u.toast('活动已结束');

          var goods_info = {
            goods_id: this.goodsId,
            attr: this.selectAttr.attr_list,
            num: this.selectAttr.num,
          };

          this.$utils.toUrl(
            '/miaosha/order-submit/order-submit?goods_info=' +
              JSON.stringify(goods_info)
          );
        } else if (this.type == 'pintuan') {
          var goods_info = {
            goods_id: this.goodsId,
            attr: this.selectAttr.attr_list,
            num: this.selectAttr.num,
            type: this.pinTuanData.type,
            deliver_type: 1,
            group_id: this.pintuanGroupId,
            parent_id: 0,
            mch_id: this.goodsData.mch.id || '',
          };
          if (this.pinTuanData.order_id) {
            goods_info.type = 'GROUP_BUY_C';
            goods_info.group_id = 0;
            goods_info.parent_id = this.pinTuanData.order_id;
            goods_info.deliver_type = 3;
          }
          if (this.pinTuanData.type == 'ONLY_BUY') {
            goods_info.deliver_type = 3;
          }

          this.$utils.toUrl(
            '/pt/order-submit/order-submit?goods_info=' +
              JSON.stringify(goods_info)
          );
        }
        // 预约商品
        else if (this.type == 'yuyue') {
          const goods_info = [
            {
              id: this.goodsId,
              attr: this.selectAttr.attr_list,
            },
          ];
          this.$utils.toUrl(
            '/book/submit/submit?goods_info=' + JSON.stringify(goods_info)
          );
        } else if (this.type == 'crowdfund') {
          var goods_info = Object.assign(this.selectAttr, {
            attr: this.selectAttr.attr_list,
          });
          delete goods_info.attr_list;
          this.$utils.toUrl(
            '/pages/order-submit/order-submit?pageType=crowdfund&goods_info=' +
              JSON.stringify(goods_info)
          );
        }

        // 步数宝
        else if (this.type == 'step') {
          var queryData = {
            step_id: this.goodsId,
            goods_info: JSON.stringify({
              goods_id: this.goodsId,
              attr: this.selectAttr.attr_list,
              num: this.selectAttr.num,
            }),
            pageType: 'step',
          };
          this.$utils.toUrl(
            '/pages/order-submit/order-submit' + uni.$u.queryParams(queryData)
          );
        }
        // 普通商品
        else if (this.type == 'goods') {
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
            let attr = this.attr.filter(item => item.number);
            let goods_list = attr.map(item => {
              return {
                goods_id: this.goodsData.id,
                num: item.number,
                attr: item.attr_list,
              };
            });
            mch_list[0].goods_list = goods_list
          }
          console.log(mch_list);
          this.$utils.toUrl(
            '/pages/order-submit/order-submit?goodsData=' +
              encodeURIComponent(JSON.stringify(mch_list))
          );
        }
        //跳转积分兑换预订单
        else if (this.type == 'integral') {
          const formData = {
            goods_id: this.selectAttr.goods_id,
            attr: this.selectAttr.attr_list,
          };

          this.$utils.toUrl(
            '/integral-mall/order-submit/order-submit?goods_info=' +
              JSON.stringify(formData)
          );
        }
      }
      // 将选中规格发出
      else {
		  console.log('到这里了')
        //选中数据  选中商品名称  是否为立即购买
        this.$emit(
          'confirm',
          {
            ...this.selectAttr,
            pintuanGroupId: this.pintuanGroupId,
			price: this.attrPrice
          },
          this.showType
        );
      }
    },

    modifySelect(data) {
      this.selectAttr = data;
    },
    async getAttrInfo() {
      if (this.type == 'goods') {
        var res = await this.$requestAll.default.goodsAttrInfo({
          goods_id: this.goodsId,
          attr_list: JSON.stringify(
            this.selectAttr.attr_list.map(item => {
              return item.attr_id;
            })
          ),
          number: this.selectAttr.num,
        });
        this.attrInfo = res.data;
      }
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
    // 规格价格 //默认为商品价格
    attrPrice() {
      this.isMember = false;
      // 规格数据
      const attrData = this.attrData;
      // 商品数据
      const goodsData = this.goodsData;
      if (attrData) {
        // 普通商品
        if (this.type == 'goods') {
          if (attrData.member_price) {
            this.isMember = true;
            return attrData.member_price;
          } else if (attrData.price) {
            return attrData.price;
          } else {
            return goodsData.price;
          }
        }
        // 积分
        else if (this.type == 'integral') {
          return this.attr.length > 1
            ? `￥${attrData.integral}积分 ￥${attrData.price}`
            : `￥${goodsData.integral}积分 ￥${goodsData.price}`;
        }
        // 秒杀
        else if (this.type == 'miaosha') {
          return attrData.price
            ? attrData.price
            : goodsData.miaosha.miaosha_price;
        }
        // 拼团
        else if (this.type == 'pintuan') {
          if (this.pinTuanData.type == 'ONLY_BUY') {
            return attrData.single;
          } else {
            return attrData.price;
          }
        }
        // 预约
        else if (this.type == 'yuyue') {
          return attrData.member_price
            ? attrData.member_price
            : attrData.price
            ? attrData.price
            : '免费预约';
        } else {
          return attrData.price ? attrData.price : goodsData.price;
        }
      }

      // 未选择规格
      else if (goodsData) {
        // 普通商品
        if (this.type == 'goods') {
          return goodsData.price;
        }
        // 积分
        else if (this.type == 'integral') {
          return `￥${goodsData.integral}积分 ￥${goodsData.price}`;
        }
        // 秒杀
        else if (this.type == 'miaosha') {
          return goodsData.miaosha.miaosha_price;
        }
        // 拼团
        else if (this.type == 'pintuan') {
          if (this.pinTuanData.type == 'ONLY_BUY') {
            return goodsData.single_price;
          } else {
            return goodsData.price;
          }
        }
        // 预约
        else if (this.type == 'yuyue') {
          return goodsData.price != 0 ? goodsData.price : '免费预约';
        } else {
          return goodsData.price;
        }
      }
      return '';
    },
    // 库存 默认为商品库存
    attrKucun() {
      const attrData = this.attrData;
      const goodsData = this.goodsData;
      if (attrData) {
        return attrData.num;
      } else {
        return goodsData.num;
      }
    },
    // 规格图片路径
    imageUrl() {
      const attrData = this.attrData;
      const goodsData = this.goodsData;
      if (attrData && attrData.pic && this.type == 'goods') {
        return attrData.pic;
      } else {
        return goodsData.cover_pic;
      }
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store || false;
    },
    total() {
      if (this.attr) {
        var num = 0,
          price = 0;

        this.attr.forEach(item => {
          if (item.number) {
            num += item.number;

            if (item.member_price) {
              price += item.number * item.member_price;
            } else {
              price += item.number * item.price;
            }
          }
        });
        return {
          num:num.toFixed(2),
          price:price.toFixed(2),
        };
      }
      return {
        num: 0,
        price: 0,
      };
    },
  },
  filters: {
    filterPrice(item) {
      if (item.member_price) {
        return item.member_price;
      } else {
        return item.price;
      }
    },
  },
  options: {
    styleIsolation: 'shared',
  },
};
</script>

<style lang="scss" scoped>
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
        text-align: center;
        min-width: 100rpx;
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
    content: '';
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
