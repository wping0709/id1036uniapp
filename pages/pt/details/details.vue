<template>
  <view class=""> </view>
</template>
<script>
export default {
  onLoad(params) {
    this.$utils.toUrl(
      '/pt/details/details' + uni.$u.queryParams(params),
      'redirectTo'
    );
  },
};
</script>
