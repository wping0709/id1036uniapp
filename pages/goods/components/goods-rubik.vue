<template>
  <div class="m-20">
    <!-- 一张图 -->
    <template v-if="block.data.pic_list.length == 1">
      <view
        @click="$utils.toUrl(block.data.pic_list[0].url)"
        :style="{
          height: '336rpx',
          backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
        }"
        class="bg-cover"
      ></view>
    </template>

    <!-- 两张图 -->
    <template v-if="block.data.pic_list.length == 2">
      <template v-if="block.style == 0">
        <view class="flex">
          <view
            @click="$utils.toUrl(block.data.pic_list[0].url)"
            :style="{
              height: '336rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[1].url)"
            :style="{
              height: '336rpx',
              backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
        </view>
      </template>
      <template v-else-if="block.style == 1">
        <view class="flex">
          <view
            @click="$utils.toUrl(block.data.pic_list[0].url)"
            :style="{
              height: '228rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[1].url)"
            :style="{
              height: '228rpx',
              backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
        </view>
      </template>
    </template>

    <!-- 三张图 -->
    <template v-if="block.data.pic_list.length == 3">
      <template v-if="block.style == 0">
        <view class="flex">
          <view
            :style="{
              width: '280rpx',
              height: '336rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover"
          ></view>
          <view class="flex-w-1">
            <view
              :style="{
                height: `168rpx`,
                backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
              }"
              class="bg-cover"
            ></view>
            <view
              :style="{
                height: `168rpx`,
                backgroundImage: `url(${block.data.pic_list[2].pic_url})`,
              }"
              class="bg-cover"
            ></view>
          </view>
        </view>
      </template>
      <template v-if="block.style == 1">
        <view class="flex">
          <view
            @click="$utils.toUrl(block.data.pic_list[0].url)"
            :style="{
              height: '224rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[1].url)"
            :style="{
              height: `224rpx`,
              backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[2].url)"
            :style="{
              height: `224rpx`,
              backgroundImage: `url(${block.data.pic_list[2].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
        </view>
      </template>
    </template>

    <!-- 四张图 -->
    <template v-if="block.data.pic_list.length == 4">
      <template v-if="block.style == 0">
        <div class="flex">
          <view
            @click="$utils.toUrl(block.data.pic_list[0].url)"
            :style="{
              width: '284rpx',
              height: '336rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover"
          ></view>

          <view class="flex-w-1">
            <view
              @click="$utils.toUrl(block.data.pic_list[1].url)"
              :style="{
                height: '168rpx',
                backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
              }"
              class="bg-cover"
            ></view>

            <view class="flex">
              <view
                @click="$utils.toUrl(block.data.pic_list[2].url)"
                :style="{
                  height: '168rpx',
                  backgroundImage: `url(${block.data.pic_list[2].pic_url})`,
                }"
                class="bg-cover flex-w-1"
              ></view>
              <view
                @click="$utils.toUrl(block.data.pic_list[3].url)"
                :style="{
                  height: '168rpx',
                  backgroundImage: `url(${block.data.pic_list[3].pic_url})`,
                }"
                class="bg-cover flex-w-1"
              ></view>
            </view>
          </view>
        </div>
      </template>
      <template v-else-if="block.style == 1">
        <view class="flex">
          <view
            @click="$utils.toUrl(block.data.pic_list[0].url)"
            :style="{
              height: '178rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[1].url)"
            :style="{
              height: '178rpx',
              backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[2].url)"
            :style="{
              height: `178rpx`,
              backgroundImage: `url(${block.data.pic_list[2].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[3].url)"
            :style="{
              height: `178rpx`,
              backgroundImage: `url(${block.data.pic_list[3].pic_url})`,
            }"
            class="bg-cover flex-w-1"
          ></view>
        </view>
      </template>
      <template v-else>
        <div class="flex flex-wrap">
          <view
            @click="$utils.toUrl(block.data.pic_list[0].url)"
            :style="{
              width: '50%',
              height: '168rpx',
              backgroundImage: `url(${block.data.pic_list[0].pic_url})`,
            }"
            class="bg-cover"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[1].url)"
            :style="{
              width: '50%',
              height: '168rpx',
              backgroundImage: `url(${block.data.pic_list[1].pic_url})`,
            }"
            class="bg-cover"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[2].url)"
            :style="{
              width: '50%',
              height: '168rpx',
              backgroundImage: `url(${block.data.pic_list[2].pic_url})`,
            }"
            class="bg-cover"
          ></view>
          <view
            @click="$utils.toUrl(block.data.pic_list[3].url)"
            :style="{
              width: '50%',
              height: '168rpx',
              backgroundImage: `url(${block.data.pic_list[3].pic_url})`,
            }"
            class="bg-cover"
          ></view>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'goods-rubik',
  props: {
    block: Object,
  },
};
</script>

<style lang="scss" scoped>
.bg-cover {
  background-size: cover;
}
</style>
