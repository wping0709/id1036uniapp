<template>
  <scroll-view class="cat1" scroll-y style="width: 180rpx">
    <view
      @click="cat1Change(i1)"
      v-for="(cat1, i1) in list"
      :key="i1"
      :class="['u-line-1', 'cat1-item-style2', i1 == current1 && 'active-cat1']"
      >
	   <view class="flex">
	    {{ cat1.name }}
	    <img class="image" :src="cat1.pic_url" alt="" style="margin-top: 15rpx" />
	   </view>

    </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    current1: {
      type: [String, Number],
      default: 0,
    },
  },
  data() {
    return {};
  },
  methods: {
    cat1Change(index) {
      this.$emit('change', { index });
    },
  },
};
</script>

<style lang="scss" scoped>
.cat1 {
  height: 100%;
  background: #f5f5f5;

  .cat1-item-style2 {
    font-size: 28rpx;
    //line-height: 80rpx;
    text-align: center;
    padding: 10rpx;
  }

  .active-cat1 {
    background: #fff;
   /* border-left: 6rpx solid #ff4544; */
  }
}
.flex{
	display: flex;
	flex-direction: column;
	justify-items: space-around;
}
.image{
	width: 60rpx;
	height: 60rpx;
	display: block;
	margin: auto;
	margin-bottom: 20rpx;
}
</style>
