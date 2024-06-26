<template>
  <view class="base-cloud">
    <view class="father" id="canvas">
      <view :class="{ op0: !ready }">
        <slot></slot>
      </view>
      <canvas
        :style="{
          width: width + 'px',
          height: height + 'px',
          zIndex: (complete && -1) || 'initial',
        }"
        class="abs"
        :disable-scroll="true"
        @touchstart="touchstart"
        @touchend="touchend"
        @touchmove="touchmove"
        canvas-id="scratch-card"
      ></canvas>
    </view>
  </view>
</template>

<script>
let ctx = null;
export default {
  name: 'scratch-card',
  props: {
    percentage: {
      //刮开百分之多少的时候开奖
      type: Number,
      default: 45,
    },
    touchSize: {
      //触摸画笔大小
      type: Number,
      default: 20,
    },
    fillColor: {
      //未刮开图层时的填充色
      type: String,
      default: '#ddd',
    },
    watermark: {
      //水印文字
      type: String,
      default: '刮一刮',
    },
    watermarkColor: {
      //水印文字颜色
      type: String,
      default: '#c5c5c5',
    },
    watermarkSize: {
      //水印文字大小
      type: Number,
      default: 14,
    },
    title: {
      //提示文字
      type: String,
      default: '刮一刮开奖',
    },
    titleColor: {
      //提示文字颜色
      type: String,
      default: '#888',
    },
    titleSize: {
      //提示文字大小
      type: Number,
      default: 24,
    },
    disabled: {
      //是否禁止刮卡
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      width: 0,
      height: 0,
      startX: null,
      startY: null,
      computing: false,
      complete: false,
      reset: false,
      ready: false,
      storePoints: [],
    };
  },
  mounted() {
    ctx = uni.createCanvasContext('scratch-card', this);
    this.getRect();
  },
  created() {
  },
  methods: {
    getRect: function (e) {
      const query = uni.createSelectorQuery().in(this);
      query
        .select('#canvas')
        .boundingClientRect(data => {
          this.width = data.width;
          this.height = data.height;
          setTimeout(e => {
            this.init();
          }, 80);
        })
        .exec();
    },

    init: function (e) {
      this.computing = false;
      this.complete = false;
      this.reset = false;
      this.ready = false;
      ctx.clearRect(0, 0, this.width, this.height);
      //绘制画布
      ctx.setFillStyle(this.fillColor);
      ctx.fillRect(0, 0, this.width, this.height);
      this.ready = true;
      //绘制文字水印
      this.fillWatermark();
      //绘制标题
      this.fillTitle();
      ctx.draw();
    },

    /**
     * 绘制文字水印
     */
    fillWatermark: function (e) {
      if (!this.watermark) {
        return;
      }
      var width = this.watermark.length * this.watermarkSize;
      ctx.save();
      ctx.rotate((-10 * Math.PI) / 180);
      let x = 0;
      let y = 0;
      let i = 0;
      while ((x <= this.width * 5 || y <= this.height * 5) && i < 300) {
        ctx.setFillStyle(this.watermarkColor);
        ctx.setFontSize(this.watermarkSize);
        ctx.fillText(this.watermark, x, y);
        x += width + width * 1.6;
        if (x > this.width && y <= this.height) {
          x = -Math.random() * 100;
          y += this.watermarkSize * 3;
        }
        i++;
      }
      ctx.restore();
    },

    /**
     * 绘制标题
     */
    fillTitle: function (e) {
      if (!this.title) {
        return;
      }
      ctx.setTextAlign('center');
      ctx.setTextBaseline('middle');
      ctx.setFillStyle(this.titleColor);
      ctx.setFontSize(this.titleSize);
      ctx.fillText(this.title, this.width / 2, this.height / 2);
    },

    touchstart: function (e) {
      if (this.disabled) {
        return;
      }
      this.startX = e.touches[0].x;
      this.startY = e.touches[0].y;
    },

    touchend: function (e) {
      this.getFilledPercentage();
    },

    touchmove: function (e) {
      if (this.complete || this.disabled) {
        return;
      }
      // ctx.globalCompositeOperation = 'destination-out';
      ctx.moveTo(this.startX, this.startY);
      // ctx.beginPath();
      // ctx.arc(this.startX, this.startY, 20, 0, Math.PI * 20);
      // ctx.fill();
      ctx.clearRect(this.startX, this.startY, this.touchSize, this.touchSize);
      ctx.draw(true);
      //记录移动点位
      this.startX = e.touches[0].x;
      this.startY = e.touches[0].y;
    },

    getFilledPercentage: function (e) {
      if (this.computing) {
        return;
      }
      this.computing = true;
      uni.canvasGetImageData(
        {
          canvasId: 'scratch-card',
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          success: res => {
            let pixels = res.data;
            let transPixels = [];
            for (let i = 0; i < pixels.length; i += 4) {
              if (pixels[i + 3] < 128) {
                transPixels.push(pixels[i + 3]);
              }
            }
            var percent = (
              (transPixels.length / (pixels.length / 4)) *
              100
            ).toFixed(2);
            if (percent >= this.percentage) {
              this.success();
            }
            this.computing = false;
            console.log(percent);
          },
          fail: function (e) {
            console.log(e);
          },
        },
        this
      );
    },

    success: function (e) {
      this.complete = true;
      if (this.reset) {
        return;
      }
      this.reset = true;
      ctx.moveTo(0, 0);
      ctx.clearRect(0, 0, this.width, this.height);
      ctx.stroke();
      ctx.draw(true);
      this.$emit('complete', {});
    },
  },
};
</script>

<style lang="scss">
.father {
  position: relative;
  > canvas {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
