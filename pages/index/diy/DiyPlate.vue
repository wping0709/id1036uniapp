<template>
  <view class="flex-x-center" :style="{
    paddingTop: param.padding_top+ 'px',
    paddingBottom:  param.padding_bottom + 'px',
  }">
    <image
      style="width:100%;"
      mode="widthFix"
      v-for="(item, index) in param.list"
      :key="index"
      :src="item.pic_url"
      @click="$utils.toUrl(item.url, item.open_type)"
      show-menu-by-longpress="true"
    ></image>
  </view>
</template>

<script>
export default {
  name: "DiyPlate",
  props: ["param"],
};
</script>

<style lang="scss" scoped>

</style>
