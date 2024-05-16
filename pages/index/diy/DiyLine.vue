<template>
  <div class="block-default-line d-flex justify-content-center align-items-center">
    <div class="line" :style="{'height':item.param.height +'px','backgroundColor':item.param.backgroundColor}"></div>
  </div>
</template>

<script>
export default {
  name: 'DiyLine',
  props: {
    item: Object
  }
}
</script>

<style scoped>
.block-default-line .line {
    height: 1px;
    width: 100%;
}
</style>


