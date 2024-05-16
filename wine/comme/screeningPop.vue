<template>
  <view @touchmove.stop.prevent class="box">
    <view class="big" @click="guanbi" v-if="show == 1">
      <view class="big-view">
        <view class="big-view-title"> 筛选条件 </view>
        <scroll-view scroll-y class="big-view-content">
					<div class="flex-wrap flex">
						<view class="big-view-contentView" @click="quanbu(0, '全部')">
							全部
						</view>
						<view
							class="big-view-contentView"
							@click="quanbu(item.id, item.name)"
							v-for="(item, index) of guigeList"
							:key="index"
						>
							{{ item.name }}
						</view>
					</div>
        </scroll-view>
      </view>
    </view>
    <view class="big2" @click="guanbi" v-if="show == 0">
      <view class="big-view">
        <view class="big-view-title"> 选择分类 </view>
        <view class="big-view-content">
          <view
            class="big-view-contentView"
            @click="quanbu(item.id, item.name)"
            v-for="(item, index) of guigeList"
            :key="index"
          >
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    guigeList: {
      type: Array,
    },
    show: {
      type: Number,
    },
  },
  mounted() {
    console.log(this.guigeList, "5656566666666");
  },
  methods: {
    quanbu(e, a) {
      this.$emit("ShutDown", false, e, a);
    },
    guanbi() {
      this.$emit("ShutDown", false);
    },
		clear(event) {
      // 判断事件的目标元素是否为弹框内的字元素
			console.log(event);
      if (!event.target.closest('.big-view-content')) {
        event.preventDefault();
      }
		}
  },
};
</script>

<style lang="scss" scoped>

.big {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 14%;
  z-index: 1000000;
  background-color: rgba(0, 0, 0, 0.5);
  // border-top: 1rpx solid #ccc;
  .big-view {
    width: 750rpx;
    // height: 276rpx;
    background: #ffffff;
    overflow: hidden;
    .big-view-title {
      height: 42rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #000000;
      margin-left: 36rpx;
      margin-top: 20rpx;
    }
    .big-view-content {
      min-height: 180rpx;
      max-height: 280rpx;
      
			
      .big-view-contentView {
        width: 144rpx;
        height: 58rpx;
        background: #f2f1f2;
        border-radius: 120rpx;
        text-align: center;
        line-height: 58rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
        margin-top: 24rpx;
        margin-left: 24rpx;
      }
      .big-view-contentView2 {
        width: 144rpx;
        height: 58rpx;
        background: #f2f1f2;
        border-radius: 120rpx;
        text-align: center;
        line-height: 58rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #9b9b9b;
        margin-top: 24rpx;
        margin-left: 24rpx;
      }
    }
  }
}
.big2 {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 1000000;
  background-color: rgba(0, 0, 0, 0.5);
  // border-top: 1rpx solid #ccc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .big-view {
    width: 500rpx;
    height: 376rpx;
    background: #ffffff;
    overflow: hidden;
    border-radius: 50rpx 50rpx;
    .big-view-title {
      height: 42rpx;
      font-size: 30rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #000000;
      margin-left: 36rpx;
      margin-top: 20rpx;
    }
    .big-view-content {
      height: 140rpx;
      display: flex;
      flex-wrap: wrap;
      .big-view-contentView {
        width: 144rpx;
        height: 58rpx;
        background: #f2f1f2;
        border-radius: 120rpx;
        text-align: center;
        line-height: 58rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
        margin-top: 24rpx;
        margin-left: 24rpx;
      }
      .big-view-contentView2 {
        width: 144rpx;
        height: 58rpx;
        background: #f2f1f2;
        border-radius: 120rpx;
        text-align: center;
        line-height: 58rpx;
        font-size: 24rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #9b9b9b;
        margin-top: 24rpx;
        margin-left: 24rpx;
      }
    }
  }
}
</style>
