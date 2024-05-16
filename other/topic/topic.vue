<template>
  <view v-if="pageData" class="body p-x-20">
    <view class="p-y-20 font-600-30 u-line-2">
      {{ pageData.title }}
    </view>
    <view class="flex-x-sb flex-y-center m-y-20 color-999 font-24">
      <text>{{ pageData.addtime }}</text>
      <text>{{ pageData.read_count }}</text>
    </view>

    <view class="topic-content">
      <u-parse :content="pageData.content"></u-parse>
    </view>

    <view class="bottom-tabr">
      <div class="fixed flex-y-center">
        <view
          @click="topicFavorite"
          class="flex-col flex-x-center flex-y-center"
        >
          <text
            class="iconfont font-50 icon-collection-fill price-color"
            v-if="pageData.is_favorite"
          ></text>
          <text class="iconfont font-50 icon-collection" v-else></text>
          <text class="font-26">{{
            pageData.is_favorite ? '已收藏' : '收藏'
          }}</text>
        </view>

        <view
          @click="showPopup = true"
          class="flex-col flex-x-center flex-y-center"
        >
          <text class="iconfont font-50 icon-zhuanfa"></text>
          <text class="font-26">分享</text>
        </view>
      </div>
    </view>

    <Share :showPopup.sync="showPopup" :data="pageData" type="topic"></Share>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import Share from '@/components/share/share.vue';
import share from '@/mixins/share';
export default {
  components: {
    Share,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      id: '',
      showPopup: false,
    };
  },
  onLoad(params) {
    // 微信扫码参数处理
    if (params.scene) {
      console.log(params.scene);
      let urlData = decodeURIComponent(params.scene);
      let urlArr = urlData.split(',');
      let newParams = {};
      urlArr.forEach(item => {
        let itemArr = item.split(':');
        newParams[itemArr[0]] = itemArr[1];
      });
      this.id = newParams.gid;
    } else {
      this.id = params.id;
    }
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.default.topic({
        id: this.id,
      });
      this.pageData = res.data;
    },
    // 收藏切换
    async topicFavorite() {
      const { msg } = await this.$requestAll.user.topicFavorite({
        topic_id: this.id,
        action: this.pageData.is_favorite > 0 ? 0 : 1,
      });
      this.$utils.toast(msg, 'success');
      this.pageData.is_favorite = this.pageData.is_favorite > 0 ? 0 : 1;
    },
  },
  onShow() {},
  computed: {
    shareData() {
      return {
        title: this.pageData && this.pageData.title,
        path: `/other/topic/topic${uni.$u.queryParams({
          id: this.id,
          user_id: this.$store.getters['user/userInfo'].id || '',
          store_id:
            this.$store.getters['currentStore'].id || '',
          // #ifdef APP-PLUS
          _platform: 'app',
          // #endif
        })}`,
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #fff;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
  .bottom-tabr {
    height: 100rpx;
    .fixed {
      background: #fff;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      padding-bottom: env(safe-area-inset-bottom);
      height: 100rpx;
      height: calc(env(safe-area-inset-bottom) + 100rpx);
      > view {
        flex: 1;
        width: 0;
      }
    }
  }

  // /deep/.topic-content {
  //   font-size: 56rpx;
  // }

  /deep/.goods-link {
    position: relative;
    overflow: hidden;
    margin-bottom: 10rpx;
    border-radius: 10rpx;
    background: #f5f5f5;
    height: 224rpx !important;
    padding: 20rpx !important;
  }

  /deep/.goods-info {
    padding: 0 20rpx 0 204rpx !important;
    height: 184rpx;
  }
  /deep/.goods-name {
   
    // -webkit-line-clamp: 2;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
    // overflow: hidden;
    margin-bottom: 16rpx;
  }

  /deep/.goods-img {
    position: absolute;
    left: 20rpx;
    top: 20rpx;

    width: 184rpx !important;
    height: 184rpx !important;
    margin: 0 !important;
  }
}

// .topic-body/ deep/ .topic-content {
//   font-size: 28 * 2rpx;
// }

// .topic-content /deep/ .goods-link {
//   overflow: hidden;
//   height: 110 * 2rpx !important;
//   position: relative;
//   margin-bottom: 5 * 2rpx;
// }

// .topic-content /deep/ .goods-link img {
//   width: 92 * 2rpx !important;
//   height: 92 * 2rpx !important;
//   background: #fff;
//   top: 8 * 2rpx;
//   left: 8 * 2rpx;
//   position: absolute;
//   display: block;
// }

// .topic-content /deep/ .goods-link .goods-info {
//   position: relative;
//   padding: 16 * 2rpx 12 * 2rpx 12 * 2rpx 116 * 2rpx !important;
//   height: 100%;
// }

// .topic-content /deep/ .goods-info {
//   display: block;
// }

// .topic-content /deep/ .goods-link .goods-name {
//   -webkit-line-clamp: 2;
//   display: -webkit-box;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   margin-bottom: 16rpx;
// }
</style>
