<template>
  <view class="body">
    <myeditor
      class="editor"
      @cancel="hideEditor"
      @save="saveEditor"
      v-model="html"
      :imageUploader="uploadImg"
      :muiltImage="true"
    >
    </myeditor>
    <canvas
      :style="{
        width: `${systemInfo.windowWidth}px`,
        height: `${systemInfo.windowWidth}px`,
        position: 'absolute',
        zIndex: '-1',
        left: '-10000rpx',
        top: '-10000rpx',
      }"
      canvas-id="zipCanvas"
    ></canvas>
  </view>
</template>

<script>
import myeditor from '@/app_admin/components/w-editor/robin-editor/editor.vue';
import request from '@/utils/request';
export default {
  components: { myeditor },
  data(){
    return {
      html: ''
    }
  },
  onShow() {
    this.html = uni.getStorageSync('goodsDetailHtml')
  },
  methods: {
    async uploadImg(e, call) {
      const res = await request.UPLOAD_IMAGE(e, '/default/upload-image');
      call(res.data.url);
    },
    saveEditor(e) {
      console.log(e);
      uni.setStorageSync('goodsDetailHtml', e.html)
      this.$utils.backTo()
    },
    cancel() {
      this.$utils.backTo()
    }
  },
};
</script>

<style lang="scss">
.body {
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
