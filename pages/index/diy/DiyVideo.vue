<template>
  <div class="diy-video">
    <video
      ref="diyVideo"
      :poster="param.pic_url"
      :src="param.url"
      controls
      loop
    ></video>
  </div>
</template>

<script>
export default {
  name: "DiyVideo",
  data() {
    return {};
  },
  props: {
    param: Object,
  },
};
</script>

<style scoped>
.diy-video {
  width: 100%;
  position: relative;
}
.diy-video video {
  width: 100%;
  object-fit: contain;
  height: 400rpx;
}
.diy-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
.diy-img img {
  display: block;
  width: 40px;
  height: 40px;
}
</style>
