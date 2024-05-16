<template>
  <view>
    <!-- #ifndef H5 -->
    <view
      class="diy_header"
      :style="{
        paddingTop: `${APP_INFO.STATUS_BAR_HEIGHT}px`,
        height: `${APP_INFO.HEADER_HEIGHT}px`
      }"
    >
      分类列表
    </view>
    <!-- #endif -->
    <Search></Search>
    <view v-if="catData.cat_style == 5">
      <u-tabs style="font-size: 33rpx;"
        @change="$emit('cat1Change', $event)"
        :list="catData.list"
        :current="current1"
        keyName="name"
        lineColor="#ff4544"
      ></u-tabs>
      <u-line color="#eee"></u-line>
      <view class="cat-2" v-if="catData.list[current1].list.length">
        <view
          @click="$emit('cat2Change', { index: i2 })"
          v-for="(cat2, i2) in catData.list[current1].list"
          :key="i2"
          :class="['cat-2-item', cat2.id == cat_id && 'active-cat-2']"
          >{{ cat2.name }}</view
        >
      </view>
    </view>

    <scroll-view scroll-x v-else-if="catData.cat_style == 8 || catData.cat_style == 9">
      <div v-if="catList.length" style="flex-wrap: nowrap" class="cat-box">
        <view
          v-for="(cat1, i1) in catData.list"
          :key="i1"
          :class="[
            'cat2-item-style3',
            'cat2-item-style8',
            current1 == i1 && 'active-cat-8'
          ]"
          @click="$emit('cat1Change', { index: i1 })"

        >
         <!-- <image :src="cat1.pic_url" mode="aspectFill" /> -->

		  <view :class="current1 == i1 && 'active-cat-9'">
			  <view class="view">{{ cat1.name }}</view>
		  </view>
        </view>
      </div>
    </scroll-view>
  </view>
</template>

<script>
import Search from "./search";
export default {
  props: {
    current1: {
      type: [String, Number],
      default: 0
    },
    catData: {
      type: [Object],
      default: () => {
        return {};
      }
    },
    catList: {
      type: [Array],
      default: () => {
        return [];
      }
    },
    cat_id: {
      type: [Number, String],
      default: ""
    }
  },
  components: {
    Search
  },
  data() {
    return {
      APP_INFO: {
        HEADER_ALL_HEIGHT: 0,
        HEADER_HEIGHT: 0,
        STATUS_BAR_HEIGHT: 0
      }
    };
  },

  created() {
    this.APP_INFO = uni.getStorageSync("APP_INFO") || {
      HEADER_ALL_HEIGHT: 0,
      HEADER_HEIGHT: 0,
      STATUS_BAR_HEIGHT: 0
    };
  }
};
</script>

<style lang="scss">
.diy_header {
  padding: 0 25rpx;
  /* #ifdef APP-PLUS */
  font-weight: bold;
  letter-spacing: 2rpx;
  font-size: 30rpx;
  /* #endif */
  /* #ifdef MP-WEIXIN */
  font-size: 24rpx;
  /* #endif */
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: content-box;
}
.cat-2 {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20rpx;
  padding-bottom: 20rpx;
  .cat-2-item {
    border: 2rpx solid #eee;
    border-radius: 30rpx;
    padding: 10rpx 20rpx;
    margin: 20rpx 20rpx 0 0;
  }
  .active-cat-2 {
    border: 2rpx solid #ff4544;
    color: #ff4544;
  }
}
.cat-box {
  display: flex;
  flex-wrap: wrap;

  .cat2-item-style3 {
    margin: 20rpx 0;

    height: 120rpx;
    display: flex;
    flex-direction: column;

    > image {
      display: block;
      margin: 0 auto;
      width: 100rpx;
      height: 100rpx;
    }
    .view {
      text-align: center;
      margin-top: 20rpx;
      font-size: 30rpx;
      //width: 220rpx;
      height: 90rpx;
    }
  }
  .cat2-item-style8 {

    margin: 0 8rpx 0 0;
    padding: 10rpx 0;
    width: 220rpx;
    min-width: 134rpx;
    > image {
      width: 70rpx;
      height: 70rpx;
    }
  }
  .active-cat-8 {
    font-size: 34rpx;
    font-weight: 600;
    color: #fff;
  }
  .active-cat-9{
    //width: 220rpx;
    height: 72rpx;
    border-radius: 14rpx 14rpx 0 0;
    background-color: #fb5b5b;

  }
}
</style>
