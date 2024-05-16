<template>
  <view
    class="swiper-box"
    :style="{
      background: param.bg_color,
      padding: param.padding ? param.padding + 'rpx': '20rpx 24rpx',
    }"
  >
    <swiper
      indicator-active-color="#ffffff"
      indicatorMode="dot"
      indicator-dots
      autoplay
      circular
      :previousMargin="param.style == 2 ? '40rpx' : '0'"
      :nextMargin="param.style == 2 ? '40rpx' : '0'"
      :style="{
        height: param.height ? param.height + 'rpx' : '280rpx',
      }"
    >
      <swiper-item v-for="(item, i) in param.list" :key="i">
        <div
          :class="param.style == 2 && 'p-x-16'"
          style="width: 100%; height: 100%"
        >
          <image
            @click="clickItem(i)"
            :src="item.pic_url"
            style="width: 100%; height: 100%; border-radius: 16rpx"
            :mode="param.fill == 1 ? 'aspectFill' : 'aspectFit'"
          />
        </div>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
export default {
  props: ['param'],
  data() {
    return {};
  },
  methods: {
    clickItem(index) {
      this.$utils.toUrl(this.param.list[index].page_url);
    },
  },
};
</script>

<style lang="scss" scoped></style>
