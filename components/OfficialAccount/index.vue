<template>
  <!-- #ifdef MP-WEIXIN -->
  <div v-if="store.is_official_account" class="official-account">
    <official-account></official-account>
  </div>
  <!-- #endif -->
</template>

<script>
export default {};
</script>

<style>
.official-account {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 115rpx);
  left: 0;
  right: 0;
  width: 100%;
  z-index: 10000;
}
</style>
