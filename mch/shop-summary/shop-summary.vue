<template>
  <view v-if="shopData" class="body">
    <WaimaiHead :shopData="shopData"></WaimaiHead>

    <view class="row-item flex-y-center">
      <view @click="openLocation" class="flex-y-center flex-w-1">
        <text class="iconfont icon-dingwei font-40 color-666"></text>
        <text class="flex-w-1 p-x-10 u-line-1">{{
          shopData.shop.address
        }}</text>
      </view>
      <view
        @click="makePhoneCall"
        style="height: 40rpx"
        class="mobile iconfont icon-dianhua font-40"
      ></view>
    </view>

    <div class="row-item flex-y-center">
      <text class="iconfont icon-shijian font-40"></text>
      <text class="font-w-600 p-l-10">配送时间：</text>
      <text>{{ shopData.shop.delivery_time }}分钟</text>
    </div>
    <div class="row-item">
      <div class="p-y-30 flex">
        <div class="font-w-600 p-l-10">店铺公告：</div>
        <div class="flex-w-1">{{ shopData.shop.notice }}</div>
      </div>
    </div>
    <div class="row-item">
      <div class="p-y-30 flex">
        <div class="font-w-600 p-l-10">店铺简介：</div>
        <div class="flex-w-1">{{ shopData.shop.summary }}</div>
      </div>
    </div>
    <div class="row-item">
      <div class="p-y-30 flex">
        <div class="font-w-600 p-l-10">主营内容：</div>
        <div class="flex-w-1">{{ shopData.shop.main_content }}</div>
      </div>
    </div>

    <div class="row-item" v-if="shopData.shop.business">
      <div class="p-y-30 flex">
        <div class="font-w-600 p-l-10">营业执照：</div>
        <div class="flex-w-1 img-box">
          <image :src="shopData.shop.business" mode="aspectFit" @click="clickImage(shopData.shop.business)"></image>
        </div>
      </div>
    </div>
    <div class="row-item" v-if="shopData.shop.food_license">
      <div class="p-y-30 flex">
        <div class="font-w-600 p-l-10">食品许可证：</div>
        <div class="flex-w-1 img-box">
          <image :src="shopData.shop.food_license" mode="aspectFit" @click="clickImage(shopData.shop.food_license)"></image>
        </div>
      </div>
    </div>
  </view>
</template>
<script>
import WaimaiHead from "@/mch/shop/components/WaimaiHead.vue";
export default {
  components: {
    WaimaiHead,
  },
  data() {
    return {
      shopData: "",
      mch_id: "",
    };
  },
  onLoad(params) {
    this.mch_id = params.mch_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      const formData = {
        tab: 0,
        cat_id: 0,
        mch_id: this.mch_id,
      };
      const res = await this.$requestAll.mch.indexShop(formData, true);
      this.shopData = res.data;
    },
    makePhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.shopData.shop.tel,
      });
    },
    openLocation() {
      uni.openLocation({
        latitude: this.shopData.shop.latitude - 0,
        longitude: this.shopData.shop.longitude - 0,
        name: this.shopData.shop.name,
        address: this.shopData.shop.address,
      });
    },
    clickImage(src){
      uni.previewImage({
        urls: [src],
      })
    }
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .row-item {
    padding: 0 30rpx;
    background: #fff;
    margin: 20rpx 0;
    min-height: 100rpx;
  }
  .mobile {
    padding-left: 40rpx;
    border-left: 2rpx solid #999;
    line-height: 42rpx;
  }
  .img-box{
    text-align: center;
    >image{
      width:70%
    }
  }
}
</style>
