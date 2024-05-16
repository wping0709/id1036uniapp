<template>
  <view v-if="pageData" class="diy-shop">
    <view
      @click="
        $utils.toUrl('/shop/shop-detail/shop-detail?shop_id=' + value.id)
      "
      v-for="(value, key) in param.list"
      :key="key"
    >
      <view class="shop-one flex">
        <view class="flex-y-center">
          <image :src="value.pic_url" mode="aspectFill" />
        </view>
        <view @click="$utils.toUrl('')" class="flex-w-1 font-24 m-x-20">
          <view class="u-line-1" v-if="param.name == 1">
            {{ value.name }}
          </view>
          <view class="flex m-t-10" v-if="param.name == 1">
            <view>评分：</view>
            <view class="score">
              <u-rate
                :count="5"
                :value="value.score"
                :size="14"
                :gutter="1"
                disabled
              ></u-rate>
            </view>
          </view>
          <view class="m-t-10" v-if="param.mobile == 1"> 电话：{{ value.mobile }} </view>
        </view>
        <view @click.stop="onOpenLocation(value)" class="flex-y-center">
          <view class="flex-col flex-y-center">
            <view class="iconfont icon-daohang font-50"> </view>
            <view>一键导航</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "DiyShop",
  props: ["page_id", "_templateKey", "item"],
  data() {
    return {
      pageData: "",
      param: "",
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const formData = {
        page_id: this.page_id,
        _templateKey: this._templateKey,
        _templateItem: JSON.stringify(this.item),
        _template: this.item.type,
      };
      const res = await this.$requestAll.home.getTemplateData(formData);
      this.pageData = res.data;
      this.param = res.data.param;
    },
    // 导航
    onOpenLocation: function (value) {
      // this.openLocation(value.latitude, value.longitude, value.name, value.address)
      uni.openLocation({
        latitude: value.latitude - 0, //要去的纬度-地址
        longitude: value.longitude - 0, //要去的经度-地址
        name: value.name, //地址名称
        address: value.address, //详细地址名称
        success: function () {
          console.log("导航成功");
        },
        fail: function (error) {
          console.log(error);
        },
      });
    },
  },
};
</script>

<style scoped>
.shop-one {
  background-color: #fff;
  width: 100%;
  padding: 26rpx 24rpx;
  border-bottom: 2rpx solid #e2e2e2;
  color: #707070;
  box-sizing: border-box;
}

.shop-one image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
}
.score image {
  display: inline-block;
}
.diy-shop .col {
  padding-left: 30rpx;
}
</style>
