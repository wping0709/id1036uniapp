<template>
  <view class="goods-banner">
    <!-- autoplay -->
    <swiper
      @animationfinish="swiperChange"
      :indicator-dots="false"
      circular
      style="height: 750rpx; width: 750rpx"
    >
      <!-- #ifdef MP-WEIXIN -->
      <swiper-item v-if="goodsData.video_url" style="background:#000">
        <video
          id="goods_video"
          @fullscreenchange="switchQuanping"
          :src="goodsData.video_url"
          @play="isPlay = false"
          @pause="isPlay = true"
          @timeupdate="timeupdate"
          class="goods-video"
          autoplay
          enable-play-gesture
          :muted="isMuted"
          :controls="isFullScreen"
        ></video>
        <!-- #ifdef APP-PLUS -->
        <cover-image
          v-if="isPlay && !isFullScreen && swiperIndex == 1"
          @click="onPlay(item)"
          :src="wxapp_img.video_play"
          class="play"
        >
        </cover-image>

        <!-- 非全屏显示自定义按钮 -->
        <cover-view
          v-if="!isFullScreen && swiperIndex == 1"
          class="video-other-box"
          scroll-top="0"
        >
          <cover-image
            @click="switchMuted"
            :src="
              isMuted
                ? wxapp_img.goods.shengyin_guanbi
                : wxapp_img.goods.shengyin
            "
            class="muted"
          >
          </cover-image>
          <cover-view class="video-progress">
            <cover-view
              :style="{ width: progressWidth }"
              class="speed_of_progress"
            ></cover-view>
          </cover-view>
          <cover-image
            :src="wxapp_img.goods.quanping"
            @click="onFullScreen"
            class="full-screen"
          >
          </cover-image>
        </cover-view>
        <!-- #endif -->

        <!-- #ifndef APP-PLUS -->
        <image
          v-if="isPlay && !isFullScreen && swiperIndex == 1"
          @click="onPlay(item)"
          :src="wxapp_img.video_play"
          class="play"
        >
        </image>

        <!-- 非全屏显示自定义按钮 -->
        <view
          v-if="!isFullScreen && swiperIndex == 1"
          class="video-other-box"
          scroll-top="0"
        >
          <image
            @click="switchMuted"
            :src="
              isMuted
                ? wxapp_img.goods.shengyin_guanbi
                : wxapp_img.goods.shengyin
            "
            class="muted"
          >
          </image>
          <view class="video-progress">
            <view
              :style="{ width: progressWidth }"
              class="speed_of_progress"
            ></view>
          </view>
          <image
            :src="wxapp_img.goods.quanping"
            @click="onFullScreen"
            class="full-screen"
          >
          </image>
        </view>
        <!-- #endif -->
      </swiper-item>
      <!-- #endif -->
      <swiper-item v-for="(item, i) in list" :key="i">
        <image
          @click="clickItem(item.pic_url)"
          :src="item.pic_url"
          mode="aspectFill"
          style="width: 100%; height: 100%"
        ></image>
        <!-- #ifndef MP-WEIXIN -->
        <template v-if="!i && goodsData && goodsData.video_url">
          <image
            @click="appPlay()"
            :src="wxapp_img.video_play"
            class="play"
          ></image>
          <video
            id="goods_video"
            @fullscreenchange="switchQuanping"
            :src="goodsData.video_url"
            class="goods-video"
            style="left: -9999px; top: -9999px; position: fixed"
          ></video>
        </template>
        <!-- #endif -->
      </swiper-item>
    </swiper>

    <!-- 无库存 -->
    <view v-if="goodsData && goodsData.num <= 0" class="num0">
      <image
        :src="wxapp_img.goods_num0"
        style="width: 100%; height: 100%"
        mode="aspectFill"
      ></image>
    </view>
    <view class="dom-4"></view>

    <view class="num-box">
      {{ swiperIndex }}/
      <!-- #ifdef MP-WEIXIN -->
      {{ goodsData.video_url ? 1 + list.length : list.length }}
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      {{ list.length }}
      <!-- #endif -->
    </view>

    <!-- 砍价分销可赚内容 -->
    <!-- 商场开启显示分销 && 当前用户为分销商 && 分销金额大于0 -->
    <view
      v-if="
        goodsData &&
        goodsData.max_share_price - 0 &&
        store.is_share_price &&
        goodsData.is_share
      "
      class="dom-3"
    >
      <view class="iconfont icon-renminbi font-40"></view>

      <view class="m-r-10">分销最高可赚</view>
      <view>￥{{ goodsData.max_share_price }}</view>
    </view>
  </view>
</template>

<script>
export default {
  props: ['list', 'goodsData'],
  data() {
    return {
      swiperIndex: 1,
      isPlay: true, //是否显示播放按钮
      isMuted: true, //是否静音
      isFullScreen: false, //是否全屏
      progressWidth: 0,
    };
  },
  computed: {
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
  },
  methods: {
    clickItem(curUrl) {
      let urls = this.list.map(item => item.pic_url);
      uni.previewImage({
        urls: urls,
        current: curUrl,
      });
    },
    swiperChange(e) {
      let {
        detail: { current },
      } = e;
      if (current != 0) {
        uni.createVideoContext('goods_video', this).pause();
      }
      this.swiperIndex = current + 1;
    },
    // 点击播放
    onPlay() {
      uni.createVideoContext('goods_video', this).play();
    },
    // 打开全屏
    onFullScreen() {
      this.isFullScreen = true;
      uni.createVideoContext('goods_video', this).requestFullScreen();
    },
    // 全屏change
    switchQuanping({ detail }) {
      let { fullScreen, direction } = detail;
      // 进入全屏
      if (fullScreen) {
        // #ifndef MP-WEIXIN
        uni.createVideoContext('goods_video', this).play();
        // #endif
      } else {
        // #ifndef MP-WEIXIN
        uni.createVideoContext('goods_video', this).pause();
        // #endif
        // #ifdef MP-WEIXIN
        this.isFullScreen = false;
        // #endif
      }
    },
    // 非小程序点击播放
    appPlay() {
      // 打他开全屏
      uni.createVideoContext('goods_video', this).requestFullScreen();
    },
    // 静音切换
    switchMuted() {
      this.isMuted = !this.isMuted;
    },
    // 播放进度change
    timeupdate({ detail }) {
      this.progressWidth = (detail.currentTime / detail.duration) * 100 + '%';
    },
  },
};
</script>

<style lang="scss" scoped>
.goods-banner {
  position: relative;
  .play {
    position: absolute;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);
    width: 140rpx;
    height: 140rpx;
  }

  .goods-video {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: calc(100% - 180rpx);
  }

  .num-box {
    position: absolute;
    bottom: 80rpx;
    right: 20rpx;
    z-index: 99;
    line-height: 40rpx;
    padding: 0 20rpx;
    border-radius: 30rpx;
    background: #000000;
    opacity: 0.5;
    color: #f5f5f5;
    font-size: 22rpx;
    font-weight: 600;
  }
  .num0 {
    position: absolute;
    left: 0;
    top: 0;
    width: 750rpx;
    height: 750rpx;
    background: rgba(0, 0, 0, 0.3);
  }
  .dom-3 {
    position: absolute;
    left: 20rpx;
    bottom: 74rpx;
    z-index: 99;
    display: flex;
    align-items: center;
    padding: 0 20rpx 0 10rpx;
    line-height: 52rpx;
    background: rgba(255, 255, 255, 0.95);
    border: 2rpx solid #ff650b;
    border-radius: 120rpx;
    font-size: 22rpx;
    font-weight: 600;
    color: #ff650b;
    .icon-renminbi {
      margin-right: 10rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 40rpx;
      text-align: center;
      border-radius: 50%;
      background: #fff;
      color: #ff650b;
      font-size: 36rpx;
    }
  }

  .dom-4 {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    background: linear-gradient(
      180deg,
      rgba(242, 242, 242, 0) 0%,
      rgba(242, 242, 242, 0.6) 49%,
      #f2f2f2 100%
    );
    height: 100rpx;
  }
}

.video-other-box {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  bottom: 140rpx;
  z-index: 99;
  height: 40rpx;

  display: flex;
  align-items: center;
  justify-content: center;
  .muted,
  .full-screen {
    width: 50rpx;
    height: 50rpx;
  }
  .video-progress {
    margin: 0 20rpx;
    height: 4rpx;
    width: 0;
    flex: 1;
    background: #666;
    .speed_of_progress {
      height: 100%;
      width: 0%;
      background: #f5f5f5;
    }
  }
}
</style>
