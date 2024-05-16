<template>
  <view>
    <view class="diy-mch-shop">
      <view class="diy-mch-title">
        <text>附近店铺</text>
        <view @click="$utils.toUrl('/shop/shop-list/shop-list')">
          更多
          <text class="iconfont icon-arrow-right font-20 color-999"></text>
        </view>
      </view>
      <div v-if="!isLocation" class="flex-col flex-y-center flex-x--center">
        <div>当前组件需用到定位信息</div>
        <div class="flex-x-center">
					<u-button @click="authLocation">立即授权</u-button>
				</div>
      </div>

      <template v-else-if="list.length">
        <view class="diy-mch-goods" v-for="(item, index) of list" :key="index">
          <view class="flex">
            <view class="img" @click="goToUrl(item.id)">
              <image :src="item.logo" />
            </view>
            <view class="particulars" @click="goToUrl(item.id)">
              <view class="name u-line-1" style="white-space: normal">
                {{ item.name }}
              </view>
              <view class="flex meta">
                <view class="meta-left" v-if="item.business_hours">
                  营业时间：{{ item.business_hours }}
                </view>
                <view class="meta-right">
                  <text style="margin-right: 15px"
                    >{{ item.delivery_time }}分钟</text
                  >
                  <text>{{ item.distance }}</text>
                </view>
              </view>
              <view
                class="flex"
                style="margin-top: 10px"
                v-if="item.waimai_delivery == '1'"
              >
                <view class="waimai-qisong" style="display: flex; flex: 1">
                  起送￥{{ item.initial_delivery_amount }}
                </view>
                <view class="waimai-wrap">
                  <view>同城配送</view>
                </view>
              </view>
              <view
                class="flex"
                style="margin-top: 10px"
                v-if="item.coupon && item.coupon.length > 0"
              >
                <view class="waimai-wrap">
                  <view
                    style="
                      border: 2px solid #ff1f1a;
                      color: #ff1f1a;
                      margin-right: 3px;
                    "
                    v-for="(coupon_item, coupon_index) of item.coupon"
                    :key="coupon_index"
                  >
                    <text v-if="coupon_item.min_price > 0"
                      >每{{ coupon_item.min_price }}优惠{{
                        coupon_item.sub_price
                      }}元</text
                    >
                    <text v-else>无门槛红包</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view class="goods-wrap clearfix" v-if="item.goods_list.length > 0">
            <view
              class="goods-item"
              v-for="(goods_item, i) of item.goods_list"
              :key="i"
              @click="goToGoods(goods_item.id)"
            >
              <image :src="goods_item.cover_pic" mode="aspectFit" />
              <view class="goods-item-name">{{ goods_item.name }}</view>
              <view class="goods-item-price">
                <text>￥</text>{{ goods_item.price }}
              </view>
              <view class="goods-item-old-price">
                ￥{{ goods_item.original_price }}
              </view>
            </view>
          </view>
        </view>
      </template>
      <template v-else>
        <u-empty mode="data"></u-empty>
      </template>
    </view>
  </view>
</template>

<script>
export default {
  name: 'DiyNearbyMch',
  props: {
    param: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      list: [],
      isLocation: false,
    };
  },
  created() {
		let that = this
    uni.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          console.log('已授权获取地理位置');
          that.getData();
          that.isLocation = true;
        } else {
          console.log('未授权获取地理位置');
        }
      },
    });
  },
  methods: {
		async authLocation() {
			await this.$store.dispatch('GETLOCATION')
			this.isLocation = true
			this.getData()
		},
    async getData() {
      // const location = this.$store.getters.locationData;
      const location = await this.$store.dispatch('GETLOCATION');
      const res = await this.$requestAll.mch.getMchList({
        longitude: location.longitude,
        latitude: location.latitude,
        cat_list: JSON.stringify(this.param.cat_list) || [],
        limit: this.param.show_num || 3,
        goods_limit: this.param.show_goods_num || 6,
      });
      this.list = res.data.list;
    },
    goToUrl: function (id) {
      this.$utils.toUrl('/mch/shop/shop?mch_id=' + id);
    },
    goToGoods: function (id) {
      // this.$router.push({ name: "GoodsDetail", query: { id: id } });
      this.$utils.toUrl('/pages/goods/goods?id=' + id);
    },
  },
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;

.loading {
  width: 100%;
  padding: 0 12 * $rpx;
}

.loading view {
  border-radius: 12 * $rpx;
  background-color: #fff;
  padding: 15 * $rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading image {
  width: 25 * $rpx;
  height: 25 * $rpx;
}

.diy-mch-shop {
  margin: 0 12 * $rpx;
}

.flex {
  display: flex;
}

.diy-mch-shop .diy-mch-title {
  font-size: 16 * $rpx;
  font-weight: bolder;
  line-height: 40 * $rpx;
  position: relative;
}

.diy-mch-shop .diy-mch-title view {
  position: absolute;
  right: 5 * $rpx;
  top: 0;
  font-size: 12 * $rpx;
  font-weight: normal;
}

.diy-mch-shop .diy-mch-goods {
  background-color: #fff;
  border-radius: 10 * $rpx;
  margin-bottom: 10 * $rpx;
  padding: 16 * $rpx 12 * $rpx;
}

.diy-mch-shop .diy-mch-goods:last-child {
  margin-bottom: 0;
}

.diy-mch-shop .diy-mch-goods .img {
  margin-right: 10 * $rpx;
}

.diy-mch-shop .diy-mch-goods .img image {
  width: 61 * $rpx;
  height: 61 * $rpx;
  border-radius: 4 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars {
  flex: 1;
}

.diy-mch-shop .diy-mch-goods .particulars .name {
  font-size: 16 * $rpx;
  font-weight: bold;
}

.diy-mch-shop .diy-mch-goods .particulars .score {
  padding-top: 5 * $rpx;
  justify-content: justify-content-between;
}

.diy-mch-shop .diy-mch-goods .particulars .score .star image {
  width: 9 * $rpx;
  height: 9 * $rpx;
  vertical-align: top;
  padding-top: 2 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .score .scorea {
  font-size: 9 * $rpx;
  color: #ffa24e;
  vertical-align: top;
  padding: 0 5 * $rpx 0 3 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .score .sale {
  font-size: 11 * $rpx;
  color: #666666;
  vertical-align: top;
}

.diy-mch-shop .diy-mch-goods .particulars .score .item {
  font-size: 11 * $rpx;
  color: #666;
}

.diy-mch-shop .diy-mch-goods .particulars .distribution .stipulate {
  font-size: 10 * $rpx;
  color: #666666;
}

.diy-mch-shop .diy-mch-goods .particulars .distribution .stipulate span {
  padding-right: 10 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .distribution .dada {
  font-size: 10 * $rpx;
  color: #0078ee;
  border: 1 * $rpx solid #0078ee;
  padding: 0 5 * $rpx 2 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .coupon view {
  font-size: 10 * $rpx;
  line-height: 16 * $rpx;
  padding: 0 6 * $rpx;
  border: 1 * $rpx solid #ffd89a;
  color: #ffae2a;
  /* margin-right: 10*$rpx; */
  /* position: relative; */
  margin: 5 * $rpx 10 * $rpx 5 * $rpx 0;
}

.diy-mch-shop .diy-mch-goods .particulars .give {
  font-size: 11 * $rpx;
}

.diy-mch-shop .diy-mch-goods .particulars .give text {
  font-size: 10 * $rpx;
  color: #fff;
  line-height: 16 * $rpx;
  padding: 0 4 * $rpx;
  background: linear-gradient(90deg, #ff524e, #ff2c26);
  border-radius: 2 * $rpx;
}

.diy-mch-shop .meta {
  font-size: 11 * $rpx;
  color: #666;
  margin-top: 10 * $rpx;
}

.meta-left {
  display: flex;
  flex: 1;
}

.waimai-qisong {
  font-size: 10 * $rpx;
  color: #666;
}

.waimai-wrap view {
  display: inline-block;
  border: 1 * $rpx solid #7fbbf6;
  color: #0077ee;
  font-size: 10 * $rpx;
  padding: 1 * $rpx 2.5 * $rpx;
  border-radius: 2.5 * $rpx;
}

.goods-wrap {
  margin-top: 10 * $rpx;
  width: 100%;
  display: flex;
  // height: 135 * $rpx;
  overflow-y: hidden;
  overflow-x: scroll;
  /* justify-content: flex-end; */
}

.goods-item {
  max-width: 160rpx;
  min-width: 80 * $rpx;
  margin-right: 10 * $rpx;
}

.goods-item:last-child {
  margin-right: 0;
}

.goods-item image {
  width: 100%;
  height: 80 * $rpx;
  border-radius: 8 * $rpx;
}

.goods-item-name {
  font-size: 12 * $rpx;
  color: #343434;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-top: 5 * $rpx;
}

.goods-item-price {
  font-size: 14 * $rpx;
  color: #ff1f1a;
}

.goods-item-price text {
  font-size: 11 * $rpx;
}

.goods-item-old-price {
  font-size: 11 * $rpx;
  color: #9a9a9a;
  text-decoration: line-through;
}
</style>
