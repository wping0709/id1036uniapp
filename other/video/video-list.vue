<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <div class="list">
      <div class="item" v-for="(item, i) in pageData.list" :key="item.id">
        <!-- #ifdef APP-PLUS -->
        <VideoImage
          :videoUrl="item.url"
          :imgUrl="item.pic_url"
          clickPlay
        ></VideoImage>

        <!-- #endif -->
        <!-- #ifndef APP-PLUS -->

        <video
          @play="videoPlay($event, i)"
          :id="'video' + i"
          :src="item.url"
          :controls="true"
          :poster="item.pic_url"
        ></video>
        <!-- #endif -->
        <div class="content">
          <div class="title flex-y-center flex-x-sb">
            <view class="font-600-32 u-line-1 flex-w-1">
              {{ item.title }}
            </view>
            <view class="color-999">
              {{ item.time }}
            </view>
          </div>

          <view>
            <TextOverflow :content="item.content" :num="44"></TextOverflow>
          </view>
        </div>
      </div>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </div>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import TextOverflow from '@/other/components/text-overflow';
import VideoImage from '@/components/video-image';
export default {
  components: {
    TextOverflow,
    VideoImage,
  },
  data() {
    return {
      pageData: {
        list: [],
        status: 'loadmore',
        page: 1,
      },
      videoIndex: 0,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.default.videoList(
        {
          page: this.pageData.page,
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status =
        res.data.page_count <= this.pageData.page ? 'nomore' : 'loadmore';
    },
    async videoPlay(e, i) {
      this.videoIndex = i;
    },
  },
  async onPageScroll(e) {
    const videoDom = await this.$uGetRect('#video' + this.videoIndex);
    if (videoDom.top <= -80) {
      uni.createVideoContext('video' + this.videoIndex, this).pause();
    }
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {
    this.loadData();
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  .list {
    .item {
      margin-bottom: 20rpx;

      > video {
        display: block;
        width: 100%;
        height: 422rpx;
      }

      .content {
        padding: 0 20rpx;

        .title {
          line-height: 80rpx;
        }
      }
    }
  }
}
</style>
