<template>
  <view v-if="coupon" class="body env-bottom">
    <image
      :src="wxapp_img.coupon.img_banner2x"
      mode="widthFix"
      style="width: 100vw; display: block"
    />
    <view class="coupon-box">
      <div
        class="coupon-info-box"
        :style="{
          background: 'url(' + wxapp_img.coupon.img_coupon_bj2x + ')',
          backgroundSize: 'cover',
          backgroundRepeat: 'round',
        }"
      >
        <div class="left">
          <view class="">
            <text>￥</text>
            <text class="font-40 font-w-700">{{ coupon.sub_price }}</text>
          </view>
          <view>满{{ coupon.min_price }}可用</view>
        </div>
        <div class="right">
          <view class="price-color font-32 m-b-10">{{ coupon.name }}</view>
          <view class="font-24"
            >{{ coupon.begin_time }} / {{ coupon.end_time }}</view
          >
        </div>
      </div>
    </view>

    <view class="tuijian-title p-b-20 flex-y-center flex-x-center color-999">
      <view class="line m-r-20"></view>
      <view class="iconfont icon-aixin m-x-10"></view>
      <view class="color-fff">为您推荐</view>
      <view class="line m-l-20"></view>
    </view>
    <view class="goods-box">
      <view
        @click="$utils.toUrl('/pages/goods/goods?id=' + item.id)"
        class="goods-item"
        v-for="(item, index) in goodsList"
        :key="index"
      >
        <image :src="item.cover_pic" mode="aspectFill" />
        <view class="goods-info">
          <view class="goods-title u-line-2">{{ item.name }}</view>
          <view class="price-num flex-x-sb flex-y-center u-line-1">
            <view>
              <text>￥{{ item.price }}</text>
              <text class="font-del m-l-10 color-666"
                >￥{{ item.original_price }}</text
              >
            </view>
            <view v-show="item.num">已售{{ item.num }}件</view>
          </view>
        </view>
      </view>
    </view>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import share from '@/mixins/share';
export default {
  components: {},
  data() {
    return {
      coupon: '',
      order_id: '',
      goodsList: [],
      coupon_rule_id: '',
    };
  },
  mixins: [share],
  onLoad(params) {
    this.order_id = params.order_id;
    this.coupon_rule_id = params.coupon_rule_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.coupon.shareCouponIndex(
        {
          order_id: this.order_id,
          coupon_rule_id: this.coupon_rule_id,
        },
        true
      );
      this.coupon = res.data.coupon;
      this.goodsList.push(...res.data.goods_list);
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #e20b0b;
  min-height: 100vh;

  .coupon-box {
    height: 230rpx;

    padding: 0 10rpx;
    margin-bottom: 30rpx;
    .coupon-info-box {
      display: flex;
      align-items: center;
      height: 100%;
      .left {
        color: #831c01;
        text-align: center;
        padding-left: 35px;
        border-right: 1px solid #a85b43;
        padding-right: 18px;
      }
      .right {
        padding-left: 28rpx;
      }
    }
  }

  .tuijian-title {
    color: #fff;
    .line {
      width: 48rpx;
      height: 2rpx;
      background: #fff;
    }
  }
  .goods-box {
    padding: 0 10rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .goods-item {
    width: 358rpx;
    background: #fff;
    margin-bottom: 12rpx;
    border-radius: 20rpx;
    overflow: hidden;
    &:nth-child(2n) {
      margin-right: 0;
    }
    > image {
      display: block;
      width: 100%;
      height: 370rpx;
      background: #f5f5f5;
    }
    .goods-info {
      padding: 0 15rpx;
      .goods-title {
        line-height: 42rpx;
        height: 84rpx;
        margin: 8rpx 0 0;
        font-size: 28rpx;
      }
      .price-num {
        padding: 8rpx 0;
        font-size: 22rpx;
        > view:nth-child(1) {
          color: #ff334b;
        }
      }
    }
  }
}
</style>
