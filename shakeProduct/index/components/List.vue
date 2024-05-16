<template>
  <UWaterfall ref="waterfall" v-model="list">
    <template v-slot:left="{ leftList }">
      <div class="item" v-for="(item, i) in leftList" :key="i">
        <div @click="navTo(item)" class="top-img">
          <image v-if="!item.video_url" :src="item.cover_pic" mode="widthFix" />
          <VideoImage
            v-else
            :videoUrl="item.video_url"
            :imgUrl="item.cover_pic"
          ></VideoImage>
        </div>
        <div class="p-t-10 u-line-2">
          {{ item.content }}
        </div>
        <div class="flex-x-sb flex-y-center color-999 p-y-10">
          <view class="flex-y-center" style="max-width: 240rpx">
            <image
              :src="item.user_info.avatar_url"
              style="width: 50rpx; height: 50rpx; border-radius: 10rpx"
              mode="aspectFill"
            />
            <text
              style="width: initial"
              class="flex-w-1 u-line-1 font-22 m-l-10"
              >{{ item.user_info.nickname }}</text
            >
          </view>
          <view
            @click="onGoods(item, 'leftList')"
            class="flex-w-1 flex-y-center flex-x-end"
          >
            <text
              :style="{ color: item.is_like && 'red' }"
              class="iconfont icon-dianzan font-30"
            ></text>
            <text style="width: initial" class="u-line-1">{{
              item.good_num
            }}</text>
          </view>
        </div>
      </div>
    </template>
    <template v-slot:right="{ rightList }">
      <div class="item" v-for="(item, i) in rightList" :key="i">
        <div @click="navTo(item)" class="top-img">
          <image v-if="!item.video_url" :src="item.cover_pic" mode="widthFix" />
          <VideoImage
            v-else
            :videoUrl="item.video_url"
            :imgUrl="item.cover_pic"
          ></VideoImage>
        </div>
        <div class="p-t-10 u-line-2">
          {{ item.content }}
        </div>
        <div class="flex-x-sb flex-y-center color-999 p-y-10">
          <view class="flex-y-center" style="max-width: 240rpx">
            <image
              :src="item.user_info.avatar_url"
              style="width: 50rpx; height: 50rpx; border-radius: 10rpx"
              mode="aspectFill"
            />
            <text
              style="width: initial"
              class="flex-w-1 u-line-1 font-22 m-l-10"
              >{{ item.user_info.nickname }}</text
            >
          </view>
          <view
            @click="onGoods(item, 'rightList')"
            class="flex-w-1 flex-y-center flex-x-end"
          >
            <text
              :style="{ color: item.is_like && 'red' }"
              class="iconfont icon-dianzan font-30"
            ></text>
            <text style="width: initial" class="u-line-1">{{
              item.good_num
            }}</text>
          </view>
        </div>
      </div>
    </template>
  </UWaterfall>
</template>

<script>
import UWaterfall from "@/shakeProduct/components/u-waterfall/index";
import VideoImage from "@/components/video-image";
export default {
  components: {
    UWaterfall,
    VideoImage,
  },
  props: {
    list: {
      type: [Array],
      default: () => {
        return [];
      },
    },
  },
  methods:{
     // 跳转
    navTo(item) {
      if (item.video_url) {
        // 跳转视频列表
        this.$utils.toUrl("/vgoods/edit/index?pageType=0&id=" + item.id);
      } else {
        this.$utils.toUrl(
          "/shakeProduct/user_info/index" +
            uni.$u.queryParams({ id: item.id, cart_id: 0 })
        );
      }
    },
     // 点赞
    async onGoods(item, v) {
      const res = await this.$requestAll.vgoods.vgoodsGood(
        {
          id: item.id,
          status: item.is_like ? 0 : 1,
        },
        true
      );

      var waterFll = this.$refs["waterfall"];
      let index = waterFll[v].findIndex((v) => v.id == item.id);
      let cItem = waterFll[v][index];

      cItem.is_like = item.is_like ? 0 : 1;
      cItem.good_num = item.is_like
        ? parseInt(item.good_num) - 1
        : parseInt(item.good_num) + 1;
    },
    
    clear() {
      this.$refs["waterfall"].clear();
    }
  }
};
</script>

<style lang="scss">
.item {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  .top-img {
    position: relative;
    max-height: 400rpx;
    overflow: hidden;
    border-radius: 10rpx;
    image {
      background: #eee;
      width: 100%;
    }
  }
}
</style>
