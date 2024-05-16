<template>
  <div
    :style="{
      background: param.bg_color,
    }"
    class="diy-text"
  >
    <div
      :style="{
        fontWeight: param.title_style.bold ? 600 : 400,
        color: param.title_style.color,
        fontSize: param.title_style.size + 'px',
      }"
      class="title"
    >
      {{ param.title }}
    </div>
    <div
      :style="{
        fontWeight: param.content_style.bold ? 600 : 400,
        color: param.content_style.color,
        fontSize: param.content_style.size + 'px',
      }"
      class="content-box"
    >
      <template v-if="param.style == 1">
        <div class="status-1">
          <u-parse
            v-for="(item, index) in param.content"
            :key="index"
            :content="item"
          >
          </u-parse>
        </div>
      </template>

      <div v-else-if="param.style == 2" class="status-2">
        <div v-for="(item, index) in param.content" :key="index">
          <u-parse :content="item"> </u-parse>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["param"],
};
</script>

<style lang="scss" scoped>
$rpx: 2rpx;
.diy-text {
  padding: 18 * $rpx 20 * $rpx 34 * $rpx;
  .title {
    margin-bottom: 10 * $rpx;
    text-align: center;
    font-weight: 600;
    font-size: 14 * $rpx;
  }
  .content-box {
    font-size: 14 * $rpx;
    // .status-1 {
    //   line-height: 22 * $rpx;
    // }
    .status-2 {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      > div {
        margin-bottom: 15 * $rpx;
        width: 48.5%;
        margin-right: 3%;
        &:nth-child(2n) {
          margin: 0;
        }
      }
    }
    // .status-3 {
    //   width: 100%;
    //   display: flex;
    //   justify-content: center;
    // }
    // .status-4 {
    //   display: flex;
    //   justify-content: center;
    //   > div {
    //     display: flex;
    //   }
    //   .left {
    //     margin-right: 20px;
    //   }
    // }
    // .text-shu {
    //   margin: 0 2px;
    //   writing-mode: vertical-lr; //文本竖展示
    //   letter-spacing: 0.2em;
    // }
  }
}
</style>
