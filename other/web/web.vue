<template>
  <view class="body">
    <web-view style="height:100%;width:100%;" :src="webUrl" update-title></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webUrl: '',
    };
  },
  onLoad(params) {
    console.log(params);
    this.webUrl = decodeURIComponent(params.url);
  },
};
</script>

<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
