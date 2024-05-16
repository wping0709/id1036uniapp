<template>
  <view v-if="pageData" class="body">
    <div class="top">
      <div class="top-content">
        <div class="right-bts">
          <div @click="$utils.toUrl('/blind/tcp/tcp')" class="rule">规则</div>
          <div
            @click="$utils.toUrl('/blind/order-all/order-all')"
            class="counter"
          >
            货柜
          </div>
        </div>

        <!-- swiper -->
        <div class="swiper-box">
          <swiper circular :current="swiperIndex" class="swiper">
            <swiper-item
              v-for="(item, index) in pageData.box_info.boxPic"
              :key="index"
            >
              <image :src="item" mode="aspectFill" />
            </swiper-item>
          </swiper>

          <div @click="clickArrow('right')" class="arrow-right">
            <image :src="wxapp_img.blind.arrow_right" mode="aspectFit" />
          </div>
          <div @click="clickArrow('left')" class="arrow-left">
            <image :src="wxapp_img.blind.arrow_left" mode="aspectFit" />
          </div>
        </div>

        <div class="blind-describe">
          <image :src="wxapp_img.blind.blind" mode="aspectFit" />
          <div class="content">
            <view class="u-line-2">{{ pageData.box_info.name }}</view>
            <view class="u-line-2">
              <text class="font-22">
                <text>价值</text>
                <text style="color: #fcdd3d">￥</text>
              </text>
              <text class="font-32" style="color: #fcdd3d">{{
                pageData.box_info.price
              }}</text>
            </view>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bottom flex-col"
      :class="isAllGoods ? 'height-switch' : 'height-switch-initail'"
    >
      <div @click="switchHeight" class="title font-center">
        <text>{{
          isAllGoods ? (checkGoods ? "商品详情" : "全部奖品") : "查看全部商品"
        }}</text>
        <text
          class="iconfont"
          :class="
            isAllGoods
              ? checkGoods
                ? 'icon-close'
                : 'icon-arrow-bottom'
              : 'icon-arrow-top'
          "
        ></text>
      </div>
      <scroll-view v-if="!isAllGoods" scroll-x class="flex-h-1 scroll-x">
        <div class="prize-list">
          <image
            v-for="(item, i) in pageData.box_goods"
            :key="i"
            :src="item.cover_pic"
            class="prize-item"
          ></image>
        </div>
      </scroll-view>

      <scroll-view v-else scroll-y class="flex-h-1 scroll-y">
        <div v-if="!checkGoods" class="blind-list">
          <div
            @click="clickBlindGoods(item)"
            class="blind-item"
            v-for="(item, i) in pageData.box_goods"
            :key="i"
          >
            <image :src="item.cover_pic" mode="aspectFill" />
            <view class="blind-name u-line-2">{{ item.name }}</view>

            <view class="price">
              <text>价值￥</text>
              <text class="font-36 font-w-600">{{ item.price }}</text>
            </view>
          </div>
        </div>

        <div v-else class="goods-detail">
          <image :src="checkGoods.cover_pic" mode="aspectFill" />
          <div class="m-t-20 font-600-30 font-center u-line-2">
            {{ checkGoods.name }}
          </div>
          <div class="price font-center m-y-30">
            <text>价值￥</text>
            <text class="font-40">{{ checkGoods.price }}</text>
          </div>
          <div class="more-bt">更多详情</div>

          <rich-text v-html="formatRichText(checkGoods.detail)"></rich-text>
        </div>
      </scroll-view>
      <div class="bts flex-y-center flex-x-center">
        <view @click="onShowOrder(1)">
          ¥{{ pageData.box_info.price }}
          {{ pageData.setting.mh_single_open_name }}
        </view>
        <view
          v-if="pageData.box_info.open_num"
          @click="onShowOrder(pageData.box_info.open_num)"
        >
          ¥{{ pageData.box_info.open_num_price }}
          {{ pageData.setting.mh_more_open_name }}
        </view>
      </div>
    </div>

    <u-popup
      :show="showOrder"
      @close="showOrder = false"
      mode="bottom"
      closeable
      safe-area-inset-bottom
      round="20rpx"
    >
      <div class="popup-order">
        <BlindDetailRow
          :item="pageData.box_info"
          showNum
          :num="num"
        ></BlindDetailRow>

        <!-- <div
          @click="$utils.toUrl('/account-settings/address/address?is_order=1')"
          class="address flex-y-center flex-x-sb"
        >
          <div class="left u-line-1">
            <text class="iconfont icon-dingwei"></text>
            <text class="font-w-600">{{
              address.detail || address.address || '请选择收货地址'
            }}</text>
          </div>
          <div class="iconfont icon-arrow-right"></div>
        </div> -->
        <Address class="address" :address="address"></Address>

        <div class="">
          <text class="iconfont icon-success-fill"></text>
          <text class="m-r-10">同意</text>
          <text @click="$utils.toUrl('/blind/tcp/tcp')" style="color: #4a90e2"
            >《服务协议》</text
          >
        </div>

        <div @click="submit" class="submit-bt">提交订单</div>
      </div>
    </u-popup>
  </view>
</template>
<script>
import BlindDetailRow from "../components/BlindDetailRow.vue";
import OrderPay from "@/mixins/OrderPay";
import Address from "@/pages/order-submit/components/Address";
export default {
  components: {
    BlindDetailRow,
    Address,
  },
  mixins: [OrderPay],
  data() {
    return {
      pageData: "", //当前盲盒信息
      address: "", //收货地址
      num: 1, //盲盒数量
      box_id: "", //盲盒id
      swiperIndex: 0, //轮播索引
      checkGoods: "", //选中的商品
      isAllGoods: false, //显示盲盒全部商品
      showOrder: false, //显示订单弹框
    };
  },
  onLoad(param) {
    this.box_id = param.id;
    this.loadData();
  },
  onShow() {
    const address = uni.getStorageSync("address");
    console.log(address, "缓存获取");
    if (address) this.address = address;
    uni.removeStorageSync("address");
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.blind.boxDetail(
        {
          box_id: this.box_id,
        },
        true
      );
      this.pageData = res.data;
      this.address = res.data.address || "";
    },
    clickArrow(e) {
      if (e == "right") {
        this.swiperIndex =
          this.swiperIndex == this.pageData.box_info.boxPic.length - 1
            ? 0
            : this.swiperIndex + 1;
      } else {
        this.swiperIndex =
          this.swiperIndex == 0
            ? this.pageData.box_info.boxPic.length - 1
            : this.swiperIndex - 1;
      }
    },
    clickBlindGoods(item) {
      this.checkGoods = item;
    },
    switchHeight() {
      if (this.checkGoods) {
        this.checkGoods = "";
        return;
      }
      this.isAllGoods = !this.isAllGoods;
    },
    onShowOrder(num) {
      this.showOrder = true;
      this.num = num;
    },
    submit() {
      if (!this.address) return uni.$u.toast("请选择收货地址");
      this.orderSubmit(
        {
          open_num: this.num,
          box_id: this.box_id,
          address_id: this.address.id,
        },
        "blind"
      );
    },
  },
  computed: {
    formatRichText(html) {
      return function (html) {
        var deschtml = html.replace(
          /\<img/g,
          '<img style="width:100%;height:auto;"'
        );
        deschtml = deschtml.replace(/\<p/g, '<p style="width-100"');
        deschtml = deschtml.replace(/\<div/g, '<div class="width-100"');
        return deschtml;
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  .top {
    color: #fff;
    background: #331fa8;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .top-content {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 440rpx;
      bottom: calc(440rpx + env(safe-area-inset-bottom));
      top: 0;
      .right-bts {
        position: absolute;
        right: 0;
        top: 0rpx;
        min-width: 98rpx;
        > view,
        > div {
          text-align: center;
          width: 98rpx;
          background: #5c4cba;
          border: 1px solid #8579cb;
          border-radius: 120rpx 0rpx 0rpx 120rpx;
          line-height: 52rpx;
          font-size: 24rpx;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 20rpx;
        }
      }

      .swiper-box {
        position: absolute;
        left: 50%;
        bottom: 306rpx;
        z-index: 9;
        transform: translateX(-50%);
        swiper {
          width: 456rpx;
          height: 456rpx;
          image {
            border-radius: 20rpx;
            width: 100%;
            height: 100%;
          }
        }
        .arrow-right {
          position: absolute;
          right: -78rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 46rpx;
          height: 46rpx;
          > image {
            width: 100%;
            height: 100%;
          }
        }
        .arrow-left {
          position: absolute;
          left: -78rpx;
          top: 50%;
          transform: translateY(-50%);
          width: 46rpx;
          height: 46rpx;
          > image {
            width: 100%;
            height: 100%;
          }
        }
      }

      .blind-describe {
        position: absolute;
        bottom: -180rpx;
        left: 50%;
        transform: translateX(-50%);
        width: 648rpx;
        height: 528rpx;
        > image {
          margin-left: 40rpx;
        }
        .content {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          transform: translateY(-50%);
          text-align: center;
        }
      }
    }
  }

  .bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 400rpx;
    height: calc(400rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    display: flex;
    flex-direction: column;
    border-radius: 24rpx 24rpx 0 0;
    background: #fafafc;
    .title {
      line-height: 80rpx;
    }
    .scroll-x {
      padding: 0 20rpx;
      width: 100vw;
      box-sizing: border-box;
      .prize-list {
        white-space: nowrap;
        padding: 0 20rpx;
        .prize-item {
          margin-right: 20rpx;
          border-radius: 10rpx;
          width: 180rpx;
          height: 180rpx;
          &:nth-last-child(1) {
            margin-right: 0;
          }
        }
      }
    }
    .scroll-y {
      width: 100vw;
      box-sizing: border-box;
      padding: 0 20rpx;

      .blind-list {
        display: flex;
        flex-wrap: wrap;
        .blind-item {
          $width: 345rpx;
          width: $width;
          margin-right: 20rpx;
          margin-bottom: 30rpx;
          padding: 20rpx;
          border-radius: 20rpx;
          border: 2rpx solid #eee;
          &:nth-child(2n) {
            margin-right: 0;
          }
          > image {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            width: 240rpx;
            height: 240rpx;
            border-radius: 20rpx;
          }

          .blind-name {
            margin: 10rpx 0;
            line-height: 42rpx;
            font-weight: 600;
            height: 84rpx;
          }
        }
      }

      .goods-detail {
        > image {
          display: block;
          margin: 0 auto;
          border-radius: 20rpx;

          width: 360rpx;
          height: 360rpx;
          margin-bottom: 20rpx;
        }
        .more-bt {
          margin: 30rpx 0;
          border: 1px solid #999;
          line-height: 70rpx;
          border-radius: 35rpx;

          text-align: center;
        }
      }
    }

    .bts {
      padding: 10rpx 0;
      padding-left: 20rpx;
      > view {
        flex: 1;
        width: 0;
        border-radius: 35rpx;
        padding: 0 20rpx;

        text-align: center;
        color: #fff;
        line-height: 70rpx;
        margin-right: 20rpx;
      }
      &:nth-last-child(1) {
        margin-right: 0;
      }
      > view:nth-child(1) {
        background: #000;
      }
      > view:nth-child(2) {
        background: #f83133;
      }
    }
  }
  .height-switch {
    transition: all 0.6s;
    height: 80vh;
  }
  .height-switch-initail {
    transition: all 0.6s;
    height: 400rpx;
    height: calc(400rpx + env(safe-area-inset-bottom));
  }

  .popup-order {
    padding: 24rpx;
    .address {
      /deep/.address-item {
        padding-left: 0;
        padding-right: 0;
      }
    }

    .submit-bt {
      margin: 0 auto;
      margin-top: 54rpx;
      width: 710rpx;
      line-height: 80rpx;
      background: #f83133;
      border-radius: 120rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 600;
      color: #ffffff;
    }
  }
}
</style>
