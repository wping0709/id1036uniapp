<template>
  <view
    :class="{
      color: this.color,
      fontSize: this.fontSize,
    }"
  >
    <text>{{ contentFilter }}</text>
    <text
      class="m-l-30"
      @click="clickBt"
      v-if="content.length > num"
      :style="{
        color: btColor,
      }"
    >
      <text>
        {{ btText }}
      </text>
      <text v-if="!isZhankai" class="iconfont icon-arrow-bottom"></text>
      <text v-else class="iconfont icon-arrow-top"></text>
    </text>
  </view>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
    num: {
      type: Number,
      default: 10,
    },
    fontSize: {
      type: String,
      default: '28rpx',
    },
    color: {
      type: String,
      default: 'initial',
    },
    btColor: {
      tyep: String,
      default: 'blue',
    },
  },
  data() {
    return {
      isZhankai: false,
    };
  },
  methods: {
    clickBt() {
      this.isZhankai = !this.isZhankai;
    },
  },
  computed: {
    contentFilter() {
      if (!this.content.length) return '';
      if (this.content.length <= this.num || this.isZhankai) {
        return this.content;
      } else {
        return this.content.substring(0, this.num) + '... ';
      }
    },
    btText() {
      return this.isZhankai ? '折叠' : '展开';
    },
  },
};
</script>

<style></style>
