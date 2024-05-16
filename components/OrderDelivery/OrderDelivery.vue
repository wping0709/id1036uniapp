<template>
  <!-- 订单配送选择组件，主要用在订单预览页面 -->
  <view>
    <view
      @click="switchBoolean('showPicker')"
      class="delivery-view flex-y-center flex-x-sb"
    >
      <text>配送方式</text>
      <view class="flex-y-center">
        <view
          @click="chooseItem(item)"
          :class="['send_item', current_type == item && 'send_item_active']"
          v-for="(item, index) in send_type"
          :key="index"
        >
          {{ transToWord(item, 'string') }}
          <view
            v-show="current_type == item && 'send_item_active'"
            class="iconfont icon-duihao"
          ></view>
        </view>
        <!-- <u-picker
          @cancel="switchBoolean('showPicker')"
          :show="showPicker"
          :columns="[transToWord(send_type, 'arr')]"
          keyName="name"
          @confirm="chooseItem"
        ></u-picker>
        <view class="flex-x-end flex-y-center">
          <text>{{ transToWord(current_type, 'string') }}</text>
          <text class="iconfont icon-arrow-right color-999"></text>
        </view> -->
      </view>
    </view>

    <view v-if="send_type.some(item => item === 'shop')" class="shop-default">
      <view v-if="current_type != 'shop'"
        >可选{{ delivery_method.shop }}，更方便哦~</view
      >
      <view @click="showPopup = true" v-else class="shop-info">
        <div class="left flex-w-1">
          <template v-if="!checkShop.name">
            <view class="color-999">{{ '请选择门店信息' }}</view>
          </template>

          <template v-else>
            <view class="flex">
              <view class="font-w-600 flex-w-1 u-line-1">
                {{ checkShop.name }}
              </view>
              <view class="flex-y-center">
                <view>切换门店</view>
                <div class="iconfont icon-arrow-right color-999"></div>
              </view>
            </view>
            <view class="color-999 font-24 m-t-10">电话：{{ checkShop.mobile }}</view>
            <view class="u-line-2 color-999 font-24 m-t-6"
              >地址：{{ checkShop.address }}</view
            >
          </template>
        </div>
      </view>
    </view>

    <!-- <view
      v-if="current_type == 'shop'"
      class="delivery-view flex-y-center flex-x-sb border-t"
    >
      <view>门店信息</view>
      <view class="">
        <view class="color-999 flex-y-center">
          <text>{{ checkShop.name || '请选择门店信息' }}</text>
          <text class="iconfont icon-arrow-right m-l-10"></text>
        </view>
      </view>
    </view> -->

    <u-popup
      :show="showPopup"
      @close="showPopup = false"
      mode="bottom"
      closeable
      safe-area-inset-bottom
      round="20rpx"
    >
      <view class="delivery-page">
        <view class="page-content">
          <view class="page-header">
            <view>请选择门店</view>
          </view>
          <view class="flex-y-center flex-x-sb p-x-30 font-26">
            <view class="u-line-2 flex-w-1"
              >当前地址：{{
                addressData.detail || addressData.address || '获取地址失败'
              }}</view
            >
            <view
              v-if="!mchData || mchData.is_show_shop"
              @click="getLocation"
              style="color: #2394ff"
            >
              <text class="iconfont icon-shuaxin"></text>
              <text class="">重新定位</text>
            </view>
          </view>

          <!-- 门店自提列表 -->
          <view style="height: 60vh">
            <scroll-view
              @scrolltolower="getShopList"
              scroll-y
              style="height: 100%"
            >
              <view class="shop-list">
                <view
                  class="shop-list-item"
                  v-for="(shopitem, index) in shopList"
                  :key="index"
                  @click="selectShop(shopitem)"
                >
                  <view class="shop-status">
                    <view
                      v-if="checkShop.id != shopitem.id"
                      class="iconfont icon-xuanzekuangmoren font-50"
                    ></view>
                    <view v-else class="iconfont icon-success font-50"></view>
                  </view>

                  <view class="shop-info">
                    <view class="shop-name">
                      {{ shopitem.name }}
                    </view>

                    <view class="shop-phone">
                      <text>电话：</text>
                      <text>{{ shopitem.mobile }}</text>
                    </view>

                    <view class="shop-address u-line-2">
                      {{ shopitem.address }}
                    </view>
                  </view>

                  <view
                    @click.stop="onDaohang(shopitem)"
                    class="flex-col flex-y-center p-r-20"
                  >
                    <view class="iconfont icon-daohang font-50"></view>
                    <view class="font-22">距离：{{ shopitem.juli }}km</view>
                  </view>
                </view>
                <view>
                  <u-loadmore :status="is_load"></u-loadmore>
                </view>
              </view>
            </scroll-view>
          </view>

          <view class="page-footer">
            <view @click="handleConfirm">确定</view>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showPicker: false, //选择框开关
      showPopup: false, //弹框开关
      activeTypeIndex: -1, //选中配送索引
      checkShop: '', //选中门店数据
      longitude: 0,
      latitude: 0,
      is_load: 'loadmore', //门店列表是否到底
      page: 1,
      shopList: [],
      addressData: '', //位置信息
    };
  },
  props: {
    delivery_method: {
      type: Object,
      default: {
        express: '快递配送',
        shop: '门店自提',
        waimai: '同城配送',
      },
    },
    // 配送列表
    send_type: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 当前选中配送方式
    current_type: {
      type: String,
      default: '',
    },
    // 位置信息
    location: {
      type: Object,
      default: function () {
        return {};
      },
    },
    goods_list: {
      type: Array,
      default: function () {
        return [];
      },
    },
    submitParams: {
      type: String,
      default: '',
    },
    //用来判断“是否开启展示平台门店”  不传默认为平台商品获取根据定位获取门店列表
    mchData: {
      type: [String, Object],
      default: '',
    },
  },
  watch: {
    // 根据选中配送方式高亮配送方式
    current_type: {
      handler: function (val) {
        this.activeTypeIndex = this.send_type.findIndex(item => item == val);
      },
      immediate: true,
    },

    // 定位信息改动重新获取附近门店
    location: {
      handler(val) {
        if (val) {
          this.addressData = val;
          this.longitude = val.longitude - 0;
          this.latitude = val.latitude - 0;

          this.resetPageData();
          if(this.mchData && this.mchData.shop_list && this.mchData.shop_list.length) {
            this.shopList = this.mchData.shop_list;
            let checkShop = this.mchData.shop_list.find(
              item => item.id == this.$store.getters['ADDRESS_INFO'].id
            );
            this.checkShop =
              checkShop && checkShop.id
                ? checkShop
                : this.mchData.shop_list[0] || '';
            this.is_load = 'nomore';
            this.handleConfirm();
          } else {
            this.getShopList();

          }
        }
      },
      immediate: true,
    },
  },
  computed: {
    // 配送方式转换文本
    transToWord() {
      return (val, type) => {
        if (!val) return null;

        if (val.length) {
          if (type === 'arr') {
            return val.map(val => {
              if (val === 'express') {
                return this.delivery_method.express;
              } else if (val === 'shop') {
                return this.delivery_method.shop;
              } else if (val === 'waimai') {
                return this.delivery_method.waimai;
              } else {
                return val;
              }
            });
          } else if (type === 'string') {
            if (val === 'express') {
              return this.delivery_method.express;
            } else if (val === 'shop') {
              return this.delivery_method.shop;
            } else if (val === 'waimai') {
              return this.delivery_method.waimai;
            } else {
              return val;
            }
          } else {
            if (val == this.delivery_method.express) {
              return 'express';
            } else if (val == this.delivery_method.shop) {
              return 'shop';
            } else if (val == this.delivery_method.waimai) {
              return 'waimai';
            } else {
              return val;
            }
          }
        }
      };
    },
  },
  created() {},
  methods: {
    onDaohang(shopitem) {
      uni.openLocation({
        longitude: Number(shopitem.longitude),
        latitude: Number(shopitem.latitude),
        name: shopitem.name,
        address: shopitem.address,
      });
    },
    // 更改配送方式
    chooseItem(e) {
      // let item = e.value[0];
      let item = e;

      if (item == this.delivery_method.shop) {
        if (!this.longitude) uni.$u.toast('获取定位信息失败，请重新获取定位');
        if (!this.shopList.length) uni.$u.toast('获取附近门店为空，请重新定位');
      }
      this.switchBoolean('showPicker');
      console.log(this.transToWord(item), 11111111111);
      this.$emit('deliveryChange', this.transToWord(item, false));
    },

    // 手动更改定位
    getLocation() {
      uni.chooseLocation({
        latitude: this.latitude,
        longitude: this.longitude,
        success: res => {
          console.log(res, '重选位置成功');
          this.addressData = res;
          this.longitude = res.longitude;
          this.latitude = res.latitude;

          this.resetPageData();
          this.getShopList();
        },
      });
    },
    // 重置数据
    resetPageData() {
      const { is_load, shopList, page, checkShop } = this.$options.data();
      this.is_load = is_load;
      this.shopList = shopList;
      this.page = page;
      // this.checkShop = this.$store.getters['ADDRESS_INFO'];
      this.checkShop = checkShop;
    },

    // 获取附近门店列表
    async getShopList() {
      if (this.is_load == 'nomore') return;
      let query = {
        page: this.page,
        longitude: this.longitude,
        latitude: this.latitude,
      };
      const res = await this.$requestAll.default.shopList(query);

      console.log(1111111111111);
      console.log(res.data.list, this.checkShop);
      // 给与默认选中项，默认选中缓存门店，否则默认选中第一个门店
      if (res.data.list.length && !this.checkShop) {
        if (this.$store.getters['ADDRESS_INFO']) {
          this.checkShop = this.$store.getters['ADDRESS_INFO'];
        } else {
          this.checkShop = res.data.list[0];
        }
        this.handleConfirm();
      }
      this.shopList.push(...res.data.list);
      this.page++;
      this.is_load =
        this.shopList.length >= res.data.row_count ? 'nomore' : 'loadmore';
    },

    // 选择门店
    selectShop(item) {
      this.checkShop = item;
    },

    // 点击确认按钮
    handleConfirm() {
      console.log(7878787);
      let emitData = {
        type: this.current_type,
        shop: this.checkShop,
      };

      // if (this.current_type != 'shop') delete emitData.shop;
      this.$emit('confirm', emitData);
      console.log(emitData, 1111111111);
      this.showPopup = false;
    },
    switchBoolean(key) {
      this[key] = !this[key];
    },
  },
};
</script>

<style lang="scss" scoped>
.delivery-view {
  // line-height: 100rpx;
  padding-bottom: 30rpx;

  .send_item {
    position: relative;
    width: 164rpx;
    height: 64rpx;
    line-height: 64rpx;
    margin-right: 12rpx;
    text-align: center;
    font-size: 26rpx;
    border-radius: 16rpx;
    border: 2rpx solid #e2e2e2;
    overflow: hidden;

    > .iconfont {
      position: absolute;
      right: 0;
      bottom: 0;

      width: 28rpx;
      height: 28rpx;
      text-align: center;
      line-height: 28rpx;
      font-size: 20rpx;
      color: #fff;
      background: #ff1b22;
      border-radius: 16rpx 0 16rpx 0;
    }

    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
  .send_item_active {
    border-color: #ff0021;
    color: #ff1b22;
    background: #fff3f1;
  }
}

.shop-default {
  padding: 0 24rpx;
  font-size: 26rpx;
  line-height: 36rpx;
  padding-bottom: 30rpx;
  > view {
    padding: 24rpx;
    background: #f8f8f8;
    border-radius: 20rpx;
  }
  .shop-info {
    display: flex;
    align-items: center;
  }
}

.delivery-section {
  margin-left: 36rpx;
  display: flex;
  align-items: center;
  // padding: 24rpx 0;
  // border-bottom: 2rpx solid #f2f2f2;

  .delivery-item {
    border: 1px solid #666;
    width: 150rpx;
    height: 50rpx;
    // background: #f2f2f2;
    border-radius: 10rpx;
    font-size: 22rpx;
    font-family: PingFang SC;
    font-weight: 400;
    // color: #bfbfbf;
    text-align: center;
    line-height: 50rpx;
    margin-left: 24rpx;
  }

  .active {
    background: #fcedeb;
    border: 2rpx solid #f7271f;
    color: #f7271f;
  }
}

.delivery-page {
  .page-content {
    .page-header {
      width: 100%;
      height: 98rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      view {
        font-size: 32rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #262626;
        display: flex;
        align-items: baseline;
      }
    }

    .shop-list {
      margin-left: 36rpx;

      .shop-list-item {
        display: flex;
        align-items: center;
        border-bottom: 1rpx solid #f2f2f2;
        padding: 24rpx 0;

        .shop-status {
          margin-right: 22rpx;

          view {
            width: 50rpx;
            height: 50rpx;
            color: #999;
          }

          .icon-success {
            color: red;
            opacity: 0.8;
          }
        }

        .shop-info {
          width: 0;
          flex: 1;
          padding-right: 36rpx;

          .shop-name-box {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .shop-name {
              display: flex;
              align-items: center;
              font-size: 26rpx;
              font-family: PingFang SC;
              font-weight: 500;
              color: #262626;
              line-height: 44rpx;
              max-width: 500rpx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;

              .nearby-box {
                width: 90rpx;
                height: 26rpx;
                background: #ffffff;
                border: 1rpx solid #f7271f;
                border-radius: 4rpx;
                font-size: 20rpx;
                font-weight: 400;
                color: #f7271f;
                text-align: center;
                line-height: 26rpx;
                margin-left: 18rpx;
              }
            }
          }

          .shop-address,
          .shop-phone {
            font-size: 22rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #8c8c8c;
            line-height: 44rpx;
          }
        }
      }
    }

    .page-footer {
      width: 100%;
      height: 99rpx;
      background: #ffffff;
      box-shadow: 0 1rpx 0 0 #f2f2f2;
      display: flex;
      justify-content: center;
      align-items: center;

      view {
        width: 678rpx;
        height: 76rpx;
        background: linear-gradient(90deg, #ff4e18, #f32524);
        border-radius: 38rpx;
        text-align: center;
        line-height: 76rpx;
        font-size: 30rpx;
        font-family: PingFang;
        font-weight: bold;
        color: #ffffff;
      }
    }
  }
}
</style>
