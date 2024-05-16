<template>
  <view class="video-image">
    <div @click="switchVideo" class="img-box">
      <image :src="videoImg" mode="aspectFill" class="video-img" />
      <!-- <text class="iconfont icon-sanjiao-right font-50 color-fff"></text> -->
    </div>

    <video
      class="video"
      :src="videoUrl"
      :id="videoId"
      object-fit="contain"
      @fullscreenchange="fullscreenchange"
    ></video>

    <canvas
      :style="{
        position: 'absolute',
        zIndex: '-1',
        left: '-10000rpx',
        top: '-10000rpx',
        width: canvasWidth ? canvasWidth + 'px' : '100%',
        height: canvasHeight ? canvasHeight + 'px' : '100%',
      }"
      canvas-id="cvs1"
    ></canvas>
  </view>
</template>

<script>
export default {
  props: {
    imgUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    videoId: {
      type: String,
      default: 'video',
    },
    // 点击播放，默认关闭
    clickPlay: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      VideoContext: '',
      canvasWidth: 200,
      canvasHeight: 200,
    };
  },
  computed: {
    videoImg() {
      // return 'http://tianxin100we10.cyyvip.com/web/uploads/image/store_1/9bbf40117fe047461df0ee4ad2fc211299409f12.jpg'
      if (this.imgUrl) return this.imgUrl;
      return this.videoUrl + '?x-oss-process=video/snapshot,t_0,f_jpg';
    },
  },
  created() {
    this.VideoContext = uni.createVideoContext(this.videoId, this);
  },

  mounted() {
    this.bindMark();
  },
  methods: {
    // 截取视频某一帧作为展示图，目前尚未完成。后续时间允许再添加
    async bindMark() {
      return;
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const query = uni.createSelectorQuery().in(this);

      query
        .select('#' + this.videoId)
        .context(res => {
          console.log(res);
          const video = res.context;

          //创建画布内容
          const ctx = uni.createCanvasContext('cvs1');
          console.log(ctx, 'ctx');
          //图片画上去，imageW和imageH是画上去的尺寸，图像和画布间隔都是0
          ctx.drawImage(res.context, 0, 0, '200px', '200px');

          //这里一定要加定时器，给足够的时间去画（所以每次递归最少要耗时200ms，多次递归很耗时！）
          ctx.draw(false, function (e) {
            console.log(e);
            uni.canvasToTempFilePath({
              canvasId: 'cvs1',
              x: 0,
              y: 0,
              width: '200px',
              height: '200px',
              quality: 1, //最高质量
              success: res => {
                console.log(res, 'result');
                //将取出的图片路径通过回调函数返回
                // getImgSuccess(res.tempFilePath);
              },
              fail: err => {
                console.log('err', err);
              },
            });
          });
        })
        .exec();
    },
    switchVideo() {
      if(!this.clickPlay) return
      this.VideoContext.requestFullScreen({ direction: 0 });
    },
    fullscreenchange(e) {
      console.log(e.detail);

      // 进入全屏
      if (e.detail.fullScreen) {
        this.VideoContext.play();
      }

      // 退出全屏
      else {
        this.VideoContext.pause();
      }
    },
  },
  watch: {
    videoUrl: {
      handler(val) {
        console.log(val, '视频路径发生变化');
        this.$nextTick(() => {
          this.bindMark();
        });
      },
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.video-image {
  background: #000;
  // width: 720rpx;
  .img-box {

    display: flex;
    align-items: center;
    justify-content: center;
    .video-img {
      width: 100%;
    }
    .icon-sanjiao-right {
      transform: translate(-650%, -30%);
    }
  }

  .video {
    position: absolute;
    left: -9999vw;
    top: 0;
    width: 80vw;
    height: 100vh;
  }
}
</style>
