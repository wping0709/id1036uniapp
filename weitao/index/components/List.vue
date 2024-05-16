<template>
  <view>
    <div v-if="list.length" class="list">
      <div
        @click="$utils.toUrl('/weitao/details/details?article_id=' + item.id)"
        class="item"
        v-for="(item, i) in list"
        :key="i"
      >
        <div
          @click.stop="
            $utils.toUrl(
              '/weitao/my_conter/my_conter?user_id=' + item.from_user
            )
          "
          class="user-info flex-y-center m-b-20"
        >
          <image :src="item.from_user_head" mode="aspectFill" />
          <view class="m-l-20">
            <view>{{ item.from_user_name }}</view>
            <view class="m-t-10 color-999 font-26">
              <text class="time" v-if="item.time_before.day > 0">
                {{ item.time_before.day }}天前
              </text>
              <text
                class="time"
                v-else-if="
                  item.time_before.day < 1 && item.time_before.hour > 0
                "
              >
                {{ item.time_before.hour }}小时前
              </text>
              <text
                class="time"
                v-else-if="
                  item.time_before.day < 1 &&
                  item.time_before.hour < 1 &&
                  item.time_before.min > 0
                "
              >
                {{ item.time_before.min }}分钟前
              </text>
              <text
                class="time"
                v-else-if="
                  item.time_before.day < 1 &&
                  item.time_before.hour < 1 &&
                  item.time_before.min < 1
                "
              >
                {{ item.time_before.sec }}秒前
              </text>
            </view>
          </view>
        </div>
        <div v-if="item.is_buy && item.buy_text" class="content">
          <div class="content-text">
            <span class="mark mark_2" style="background-color: coral">{{
              item.buy_text
            }}</span>
          </div>
        </div>
        <div class="content">
          <div class="content-text">
            <!-- 判断类别标签 -->
            <span v-if="item.is_hot == 1" class="mark">推荐</span>
            <span v-else class="mark mark_2">话题</span>
            {{ item.content }}
          </div>

          <!-- 图片组 -->
          <view
            @click.stop
            v-if="
              item.image_content &&
              item.image_content.length &&
              item.is_vedio != 1
            "
          >
            <u-album :urls="item.image_content" multipleSize="220rpx"></u-album>
          </view>
          <view @click.stop v-show="item.is_vedio == 1 && item.video_url">
            <!-- #ifndef APP-PLUS -->
            <video
              :id="'video_' + i"
              @click.stop="clickVideo(i)"
              :src="item.video_url"
            ></video>
            <!-- #endif -->
			
            <!-- #ifdef APP-PLUS -->
            <VideoImage
              :videoUrl="item.video_url"
			  :imgUrl="item.goods_image"
              :videoId="'video_' + i"
              clickPlay
            ></VideoImage>
            <!-- #endif -->
          </view>
        </div>

        <!-- 带货商品 -->
        <div
          v-if="item.goods_id > 0"
          @click="$utils.toUrl('/pages/goods/goods?id=' + item.goods_id)"
          class="daihuo"
        >
          <image :src="item.goods_image" mode="aspectFill" />
          <view class="goods-info">
            <view class="u-line-1">{{ item.goods_name }}</view>
            <view>￥{{ item.goods_price }}</view>
          </view>
        </div>

        <div class="tag">
          <div
            @click.stop="
              $utils.toUrl(
                '/weitao/search_list/search_list?search_topic=' +
                  item.topic_name
              )
            "
          >
            #{{ item.topic_name }}
          </div>
        </div>

        <!-- 定位信息 -->
        <div v-if="item.address_show && item.province_name" class="m-y-10 font-26 color-999 u-line-1 font-right">
          {{item.province_name}}{{item.city_name}}{{item.district_name}}
        </div>
        
        <div @click.stop class="btns flex-x-end flex-y-center">
          <!-- #ifdef APP-PLUS -->
          <view @click="appShare(item)" class="button-initial">
            <text class="iconfont icon-zhuanfa"></text>
            <text>分享</text>
          </view>
          <!-- #endif -->
          <!-- #ifndef APP-PLUS -->
          <button open-type="share" class="button-initial">
            <text class="iconfont icon-zhuanfa"></text>
            <text>分享</text>
          </button>
          <!-- #endif -->

          <view @click.stop="onDianzan(item, i)">
            <text
              :style="{ color: item.is_liked == 1 && 'red' }"
              class="iconfont icon-dianzan"
            ></text>
            <text>{{ item.like_count }}</text>
          </view>
          <view>
            <text class="iconfont icon-pinglun"></text>
            <text>{{ item.discuss_count }}</text>
          </view>
        </div>

        <div v-if="item.discuss" class="comment">
          <view class="user_name">{{ item.discuss.user_name }}：</view>
          <view class="flex-w-1 u-line-1">{{ item.discuss.review }}</view>
        </div>
      </div>

      <!-- <u-loadmore :status="status"></u-loadmore> -->
    </div>

    <u-empty v-else mode="data" :icon="wxapp_img.empty_data"> </u-empty>
  </view>
</template>

<script>
import VideoImage from '@/components/video-image';
export default {
  components: {
    VideoImage,
  },
  props: {
    list: {
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      currentIndex: 0,
    };
  },
  created() {
    console.log(this.list, 111111111);
  },
  methods: {
    appShare(item) {
      uni.share({
        provider: "weixin",
        title: item.content,
        scene: "WXSceneSession",
        type: 0,
        href: `/weitao/details/details${uni.$u.queryParams({
          article_id: item.id,
          store_id: this.$store.getters["currentStore"].id || "",
          user_id: this.$store.getters["user/userInfo"].id || "",
          // #ifdef APP-PLUS
          _platform: "app",
          // #endif
        })}`,
      });
    },
    async onDianzan(item, i) {
      const res = await this.$requestAll.weitao.likeArticle({
        article_id: item.id,
        is_liked: item.is_liked > 0 ? 0 : 1,
      });
      let newItem = Object.assign(item, {
        is_liked: item.is_liked > 0 ? 0 : 1,
        like_count:
          item.is_liked > 0 ? item.like_count - 0 - 1 : item.like_count - 0 + 1,
      });
      let list = JSON.parse(JSON.stringify(this.list));

      list[i] = newItem;
      this.$emit('update:listChange', list);
    },
    clickVideo(i) {
      this.currentIndex = i;
    },
    async onScroll(e) {
      var dom = await this.$uGetRect(`#video_${this.currentIndex}`);
      console.log(dom);
      if (dom.top < 0) {
        uni.createVideoContext('video_' + this.currentIndex, this).stop();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 0 20rpx;
  .item {
    padding: 20rpx 0;
    margin-bottom: 20rpx;
    border-bottom: 1px solid #eee;
    font-size: 30rpx;
    .user-info {
      image {
        width: 70rpx;
        height: 70rpx;
        border-radius: 50%;
      }
    }
    .content {
      .content-text {
        margin-bottom: 20rpx;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 6;
        -webkit-box-orient: vertical;
        word-break: break-all;
        .mark {
          display: inline-block;
          font-size: 26rpx;
          padding: 0 10rpx;
          border-radius: 10rpx;
          background: #ff8023;
          color: #fff;
          margin-right: 10rpx;
        }
        .mark_2 {
          background: #1fd44e;
        }
      }

      > video {
        display: block;
        width: 100%;
      }
    }
    .daihuo {
      margin: 20rpx 0;
      display: flex;
      background: #f5f5f5;
      padding: 10rpx;
      > image {
        width: 100rpx;
        height: 100rpx;
        border-radius: 10rpx;
        margin-right: 20rpx;
      }
      .goods-info {
        flex: 1;
        width: 0;
      }
    }

    .tag {
      margin-top: 20rpx;
      > div {
        font-size: 26rpx;
        background-color: #ebf5ff;
        border-radius: 22rpx;
        line-height: 44rpx;
        color: #3a86d1;
        display: inline-block;
        padding: 0 18rpx;
      }
    }

    .btns {
      > view,
      button {
        margin-left: 20rpx;
      }
    }

    .comment {
      margin-top: 20rpx;
      display: flex;
      padding: 10rpx;
      background: #f5f5f5;
      border-radius: 10rpx;
      .user_name {
        font-weight: 700;
      }
    }
  }
}
</style>
