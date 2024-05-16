<template>
  <view>
    <view class="center">
      <!-- 头部图片和热聊 -->
      <view class="center-top">
        <view
          class="center-top-left"
          @click="onClick(param, param.open_type, param.url)"
        >
          <image :src="param.icon" mode="scaleToFill"></image>
        </view>
        <view
          class="center-top-right"
          :style="{
            background:
              param.background_icon == ''
                ? 'url(' + param.background_icon + ')'
                : 'url(' + param.background_icon + ')',

            'background-repeat': param.bg_color,
            'background-size': '100%',
          }"
        >
          <view class="center-top-right-top">
            <view class="center-top-right-top-text"> 正在热聊 </view>
            <view class="center-top-right-top-imgView">
              <image :src="wxapp_img.wine.huati" mode=""></image>
            </view>
          </view>
          <view
            class="center-top-right-bottom"
            :style="{ background: param.bg_color }"
          >
            <view
              class="center-top-right-bottom-view"
              v-for="(item, index) of param.list"
              :key="index"
              @click="onClick(item, item.open_type, item.url)"
            >
              {{ item.name }}<view v-if="index == 0">TOP1</view>
            </view>
          </view>
        </view>
      </view>
      <!-- 循环 -->
      <!-- <list></list> -->
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    param: {
      type: Object,
    },
  },
  mounted() {
    console.log(this.param, "paramparamparamparam");
  },
  methods: {
    quanbu() {
      uni.navigateTo({
        url: "../topic/topic?id=" + 2,
      });
    },
    onClick(item, type, url) {
      // console.log(item,url,"itemitemitem")
      // console.log(item.url.split("id=")[1],"截取后");
      if (item.url.split("id=")[1] == "" && item.open_type != "navigate") {
        console.log("这个是空");
      return  this.$emit("topic");
      } else {
				this.$utils.toUrl(url);
			}
    },
  },
};
</script>

<style scoped lang="scss">
.center {
  width: 100%;
  margin-top: 10rpx;

  .center-top {
    height: 432rpx;
    margin-top: 10rpx;
    display: flex;

    .center-top-left {
      width: 352rpx;
      height: 432rpx;
      margin-left: 18rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      image {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
        background-size: 100% 100%;
      }
    }

    .center-top-right {
      width: 352rpx;
      height: 432rpx;
      background: linear-gradient(89deg, #ffcb34 0%, #f8df51 100%);
      border-radius: 16rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 18rpx;

      .center-top-right-top {
        width: 316rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .center-top-right-top-text {
          height: 42rpx;
          font-size: 30rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #262626;
        }

        .center-top-right-top-imgView {
          width: 77rpx;
          height: 77rpx;

          image {
            width: 100%;
            height: 100%;
          }
        }
      }

      .center-top-right-bottom {
        width: 316rpx;
        height: 332rpx;
        background: #fff6c5;
        border-radius: 16rpx;

        .center-top-right-bottom-view {
          // width: 240rpx;
          // height: 36rpx;
          display: flex;
          // align-items: center;
          margin-top: 24rpx;
          margin-left: 22rpx;
          font-size: 26rpx;
          font-family: PingFang SC;
          font-weight: 500;
          color: #262626;

          view {
            width: 70rpx;
            height: 30rpx;
            background: #e84f3b;
            border-radius: 6rpx;
            text-align: center;
            line-height: 30rpx;
            font-size: 20rpx;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 30rpx;
            color: #fafafa;
            margin-left: 10rpx;
          }
        }
      }
    }
  }
}
</style>
