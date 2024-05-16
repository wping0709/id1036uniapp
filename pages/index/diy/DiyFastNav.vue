<template>

    <!-- paddingTop: param.padding_top + 'px',
    paddingBottom: param.padding_bottom + 'px', -->
  <view v-show="list" :style="{
    background: param.bg_color
  }" class="body flex-x-sb flex-y-center">
    <view class="left flex-w-1">
      <scroll-view scroll-x class="scroll-x">
        <view
        @click="$utils.toUrl(item.url,item.open_type)"
          class="item"
          :class="index == 0 && 'active'"
          v-for="(item, index) in list"
          :key="index"
        >
          {{ item.name }}
        </view>
      </scroll-view>
    </view>
    <view @click="$utils.toUrl('/pages/cat/cat')" class="right flex-y-center">
      <text class="iconfont icon-category color-fff"></text>
      <text>分类</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "DiyFastNav",
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
    };
  },
  created() {
    let list = this.param.list;
    list.unshift({
      name: "首页",
      open_type: "navigate",
      url: "/pages/index/index",
      appid: "",
      path: "",
      page_name: "商城首页",
    });
    this.list = list;
  },
};
</script>

<style lang="scss" scoped>
$bg-color: #ff7f9e;
.body {
  background: $bg-color;
  color: #fff;
  font-size: 28rpx;
  line-height: 80rpx;
}
.scroll-x {
  white-space: nowrap;

  .item {
    padding: 0 20rpx;
    display: inline-block;
  }
  .active {
    font-size: 32rpx;
    font-weight: 600;
  }
}

.right {
  padding: 0 20rpx;
  .iconfont {
    font-size: 45rpx;
  }
}
</style>
