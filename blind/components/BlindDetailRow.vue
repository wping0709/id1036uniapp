<template>
  <view>
    <div
      class="blind-item"
      @click="$utils.toUrl('/blind/goods-detail/goods-detail?id=' + item.id)"
    >
      <image :src="item.cover_pic" mode="aspectFill" />
      <div class="flex-w-1 flex-col flex-x-sb">
        <view class="blind-name u-line-2">{{ item.name }}</view>
        <view>
          <view class="u-line-1 font-22 color-999"
            >{{option.mh_prefix_price || ''}}¥{{ item.original_price }}</view
          >
          <view class="price-color">
            <text>¥</text>

            <template v-if="showNum">
              <text class="font-36">
                {{ num > 1 ? item.open_num_price : item.price }}
              </text>
              <text class="m-l-10 color-999 font-22">
                {{ num > 1 ? num + '连抽' : '一发入魂' }}
              </text>
            </template>

            <text v-else class="font-36">{{ item.price }}</text>
          </view>
        </view>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default() {
        return {};
      },
    },
    // 是否显示一发入魂 这些字体
    showNum: {
      type: Boolean,
      default: false,
    },
    // 是否为一发入魂
    num: {
      type: [String, Number],
      default: 1,
    },
    option: {
      type: Object,
      default() {return {}}
    }
  },
};
</script>

<style lang="scss" scoped>
.blind-item {
  display: flex;
  background: #fff;
  > image {
    margin-right: 20rpx;
    width: 200rpx;
    height: 200rpx;
  }
  .blind-name {
    white-space: initial;
    height: 84rpx;
    line-height: 42rpx;
    font-weight: 600;
  }
}
</style>
