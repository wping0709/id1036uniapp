<template>
  <!-- 打开客服 -->
  <button
    v-if="urlObj.open_type == 'contact'"
    open-type="contact"
    class="u-reset-button"
    style="display: block"
  >
    <slot></slot>
  </button>

  <view v-else @click="onClick(urlObj)">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    urlObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    onClick(copyright) {
      this.$utils.toUrl(copyright.url, copyright.open_type);
    },
  },
};
</script>

<style></style>
