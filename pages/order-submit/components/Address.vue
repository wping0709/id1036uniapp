<template>
  <view
    @click="$utils.toUrl('/account-settings/address/address?is_order=1')"
    class="address bg-fff"
  >
    <!-- 有地址 -->
    <template v-if="address">
      <view class="address-item flex-x-sb flex-y-center">
        <view class="flex-w-1 p-b-24">
          <view class="p-t-30 p-b-20 font-26 u-line-1">{{
            address.detail
          }}</view>
          <view class="u-line-1 font-34 font-w-700 m-b-10">
            {{ address.province }}{{ address.city }}{{ address.district }}
          </view>
          <view class="flex-y-center font-26">
            <view>{{ address.name }}</view>
            <view class="m-l-20 flex-w-1">{{ address.mobile }}</view>
          </view>
          <view v-if="shopDisplay" class="price-color m-t-10">
            {{shopDisplay}}
          </view>
        </view>
        <i class="iconfont icon-arrow-right m-l-20 color-666"></i>
      </view>
    </template>

    <!-- 无地址 -->
    <view v-else class="address-item p-20 flex-y-center flex-x-sb">
      <view class="font-34 font-w-700"> 请选择收货地址 </view>

      <i class="iconfont icon-arrow-right color-666 m-l-20"></i>
    </view>

    <image
      class="line-img"
      :src="wxapp_img.order.address_line"
      mode="aspectFill"
    />
  </view>
</template>

<script>
export default {
  props: {
    address: {
      default: () => {
        return {};
      },
    },
    type: {
      type: [String],
      default: 'express',
    },
    shopDisplay: {
      type: [String,Boolean],
      default: false
    },
  },
  data() {
    return {
      formData: {
        name: '',
        mobile: '',
      },
    };
  },
  watch: {
    address: {
      handler(val) {
        if (val) {
          this.formData.name = val.name;
          this.formData.mobile = val.mobile;
        }
      },
      immediate: true,
      deep: true,
    },
    type() {
      this.formData.name = this.address.name;
      this.formData.mobile = this.address.mobile;
    },
    formData: {
      handler(val) {
        if (this.type == 'shop')
          this.$emit('formDataChange', Object.assign(this.address, val));
      },
      deep: true,
    },
  },
  computed: {
    
  },
};
</script>

<style lang="scss" scoped>
.address {
  border-radius: 20rpx;
  margin: 24rpx;
  position: relative;
  padding: 0 24rpx;
  padding-bottom: 6rpx;

  .line-img {
    position: absolute;
    left: 0;
    bottom: 0;

    width: 100%;
    height: 6rpx;
  }
}
.address-item {
  // height: 150rpx;
  min-height: 108rpx;
}
</style>
