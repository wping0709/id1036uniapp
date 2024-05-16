<template>
  <view v-if="detail" class="body">
    <div class="detail">
      <div class="item">
        <!-- {{item.content}} -->
        <div
          @click.stop="
            $utils.toUrl(
              '/weitao/my_conter/my_conter?user_id=' + detail.from_user
            )
          "
          class="user-info flex-y-center"
        >
          <image :src="detail.head_url" mode="aspectFill" />
          <view class="m-l-20">
            <view>{{ detail.nickname }}</view>
            <view class="m-t-10 color-999 font-26">
              <text class="time" v-if="detail.time_before.day > 0">
                {{ detail.time_before.day }}天前
              </text>
              <text
                class="time"
                v-else-if="
                  detail.time_before.day < 1 && detail.time_before.hour > 0
                "
              >
                {{ detail.time_before.hour }}小时前
              </text>
              <text
                class="time"
                v-else-if="
                  detail.time_before.day < 1 &&
                  detail.time_before.hour < 1 &&
                  detail.time_before.min > 0
                "
              >
                {{ detail.time_before.min }}分钟前
              </text>
              <text
                class="time"
                v-else-if="
                  detail.time_before.day < 1 &&
                  detail.time_before.hour < 1 &&
                  detail.time_before.min < 1
                "
              >
                {{ detail.time_before.sec }}秒前
              </text>
            </view>
          </view>
        </div>

        <div class="content">
          <div class="content-text">
            <!-- 判断类别标签 -->
            <span v-if="detail.is_hot != 1" class="mark mark_2">话题</span>
            <span v-if="detail.is_hot == 1" class="mark">推荐</span>
            {{ detail.content }}
          </div>

          <!-- 图片组 -->
          <template
            v-if="
              detail.image_content &&
              detail.image_content.length &&
              detail.is_vedio != 1
            "
          >
            <u-album :urls="detail.image_content" multipleSize="30vw"></u-album>
          </template>

          <!-- 视频 -->
          <template v-if="detail.is_vedio == 1 && detail.video_url">
            <video :src="detail.video_url"></video>
          </template>
        </div>

        <!-- 带货商品 -->
        <div
          v-if="detail.goods_id > 0"
          @click="$utils.toUrl('/pages/goods/goods?id=' + detail.goods_id)"
          class="daihuo"
        >
          <image :src="detail.goods_image" mode="aspectFill" />
          <view class="goods-info">
            <view class="u-line-1">{{ detail.goods_name }}</view>
            <view>￥{{ detail.goods_price }}</view>
          </view>
        </div>

        <!-- 帖子标签 -->
        <div class="tag">
          <div
            @click.stop="
              $utils.toUrl(
                '/weitao/search_list/search_list?search_topic=' +
                  detail.topic_name
              )
            "
          >
            #{{ detail.topic_name }}
          </div>
        </div>

        <!-- 帖子分享点赞评论按钮 -->
        <div class="btns flex-x-end flex-y-center">
          <!-- #ifdef APP-PLUS -->
          <view @click="appShare" class="button-initial">
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

          <!-- <view @click.stop="onDianzan(detail, i)">
            <text
              :style="{ color: detail.is_liked == 1 && 'red' }"
              class="iconfont icon-dianzan"
            ></text>
            <text>{{ detail.like_count }}</text>
          </view>
          <view>
            <text class="iconfont icon-pinglun"></text>
            <text>{{ detail.discuss_count }}</text>
          </view> -->
        </div>

        <!-- 评论回复 -->
        <!-- <div v-if="detail.discuss" class="comment">
          <view class="user_name">{{ detail.discuss.user_name }}：</view>
          <view class="flex-w-1 u-line-1">{{ detail.discuss.review }}</view>
        </div> -->
      </div>
    </div>

    <view class="comment">
      <div class="title font-600-40">全部回复</div>
      <div class="list">
        <div class="item" v-for="(item, i) in detail.review" :key="i">
          <image
            @click="
              $utils.toUrl(
                '/weitao/my_conter/my_conter?user_id=' + item.user_id
              )
            "
            :src="item.user_head"
            mode="aspectFill"
          />
          <div class="item-content">
            <view class="font-30">{{ item.nickname }}</view>
            <view>{{ item.review }}</view>

            <view v-if="item.sun && item.sun.length" class="huifu-box">
              <div
                @click="onCheckComment(item1)"
                class="huifu-item"
                v-for="(item1, i1) in commentList(item)"
                :key="i1"
              >
                <text>
                  {{ item1.nickname }} 回复 {{ item1.parent_nickname }}：
                </text>
                <text>{{ item1.review }}</text>
              </div>
            </view>
            <div
              @click="switchMore(item, i)"
              style="color: red"
              class="p-y-10 font-24"
              v-if="item.sun && item.sun.length > 2 && !item.showMore"
            >
              更多评论({{ item.sun.length && item.sun.length - 2 }})
            </div>

            <view class="color-999 font-24 flex-y-center">
              <!-- 时间 -->
              <view>
                {{ i + 1 }}F-
                <text class="time" v-if="detail.time_before.day > 0">
                  {{ detail.time_before.day }}天前
                </text>
                <text
                  class="time"
                  v-else-if="
                    detail.time_before.day < 1 && detail.time_before.hour > 0
                  "
                >
                  {{ detail.time_before.hour }}小时前
                </text>
                <text
                  class="time"
                  v-else-if="
                    detail.time_before.day < 1 &&
                    detail.time_before.hour < 1 &&
                    detail.time_before.min > 0
                  "
                >
                  {{ detail.time_before.min }}分钟前
                </text>
                <text
                  class="time"
                  v-else-if="
                    detail.time_before.day < 1 &&
                    detail.time_before.hour < 1 &&
                    detail.time_before.min < 1
                  "
                >
                  {{ detail.time_before.sec }}秒前
                </text>
              </view>
              <!-- 按钮 -->
              <view class="btns flex-w-1 flex-x-end flex-y-center">
                <view @click.stop="onDianzan(item, i)">
                  <text
                    :style="{ color: item.is_liked == 1 && 'red' }"
                    class="iconfont icon-dianzan"
                  ></text>
                  <text>{{ item.like_count }}</text>
                </view>
                <view @click="onCheckComment(item)">
                  <text class="iconfont icon-pinglun"></text>
                  <text>{{ item.discuss_count }}</text>
                </view>
              </view>
            </view>
          </div>
        </div>
      </div>
    </view>

    <view class="bottom-input">
      <view class="fixed">
        <div class="input-box flex-w-1">
          <u-input
            ref="commentInput"
            :placeholder="inputPlaceHolder"
            v-model="review_text"
            :focus="foucus"
            border="none"
            shape="circle"
            :adjustPosition="true"
            @blur="foucus = false"
            @confirm="onCommentConfirm"
          ></u-input>
        </div>
        <div class="flex-y-center">
          <div @click="onCommentConfirm" class="bt">发送</div>
          <div @click="onDetailDianzan" class="bottom-dianzan">
            <text
              :style="{ color: detail.is_liked == 1 && 'red' }"
              class="iconfont icon-dianzan"
            ></text>
            <text>{{ detail.like_count }}</text>
          </div>
        </div>
      </view>
    </view>
  </view>
</template>
<script>
import share from '@/mixins/share'
export default {
  mixins: [share],
  data() {
    return {
      detail: "",
      article_id: "",
      review_text: "",
      checkComment: "",
      foucus: false,
    };
  },
  onLoad(params) {
    this.article_id = params.article_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    appShare() {
      uni.share({
        provider: "weixin",
        title: this.detail.content,
        scene: "WXSceneSession",
        type: 0,
        href: `${uni.$u.page()}${uni.$u.queryParams({
          article_id: this.article_id,
          store_id: this.$store.getters["currentStore"].id || "",
          user_id: this.$store.getters["user/userInfo"].id || "",
          // #ifdef APP-PLUS
          _platform: "app",
          // #endif
        })}`,
      });
    },
    async loadData() {
      const res = await this.$requestAll.weitao.articleDetail(
        {
          article_id: this.article_id,
        },
        true
      );
      this.detail = res.data.detail;
    },
    // 回复点赞
    async onDianzan(item, i) {
      const res = await this.$requestAll.weitao.likeArticle({
        review_id: item.id,
        article_id: item.article_id,
        is_liked: item.is_liked > 0 ? 0 : 1,
      });
      let newItem = Object.assign(item, {
        is_liked: item.is_liked > 0 ? 0 : 1,
        like_count:
          item.is_liked > 0 ? item.like_count - 0 - 1 : item.like_count - 0 + 1,
      });
      let list = JSON.parse(JSON.stringify(this.detail.review));

      list[i] = newItem;
      this.$set(this.detail, "review", list);
      this.$u.toast(res.msg);
    },
    // 详情点赞
    async onDetailDianzan() {
      let item = this.detail;
      const res = await this.$requestAll.weitao.likeArticle({
        article_id: item.id,
        is_liked: item.is_liked > 0 ? 0 : 1,
      });
      let newItem = Object.assign(item, {
        is_liked: item.is_liked > 0 ? 0 : 1,
        like_count:
          item.is_liked > 0 ? item.like_count - 0 - 1 : item.like_count - 0 + 1,
      });
      this.detail = newItem;
      this.$u.toast(res.msg);
    },
    // 选择回复
    onCheckComment(item) {
      this.checkComment = item;
      this.foucus = true;
    },
    // 评论
    async onCommentConfirm() {
      await this.$requestAll.weitao.articleReview({
        article_id: this.checkComment.article_id || this.detail.id,
        parent_id: this.checkComment.id || 0,
        review_text: this.review_text,
      });
      this.loadData();
      this.review_text = "";
    },
    switchMore(item, i) {
      item.showMore = !item.showMore;
      this.$set(this.detail.review, i, item);
    },
  },
  computed: {
    inputPlaceHolder() {
      if (!this.checkComment) return "评论一下~";
      return `回复：${this.checkComment.nickname}`;
    },
    commentList() {
      return function (item) {
        if (item.showMore) {
          return item.sun;
        } else {
          return item.sun.slice(0, 2);
        }
      };
    },
    shareData() {
      return {
        path:
          "/weitao/details/details" +
          uni.$u.queryParams({
            article_id: this.article_id,
            user_id: this.$store.getters["user/userInfo"].id || "",
            store_id: this.$store.getters["currentStore"].id || "",
            // #ifdef APP-PLUS
            _platform: "app",
            // #endif
          }),
      }
    }
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  min-height: 100vh;
  padding: 0 20rpx;
}

.detail {
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

.comment {
  .list {
    .item {
      display: flex;
      padding: 10rpx 0;
      > image {
        border-radius: 50%;
        height: 80rpx;
        width: 80rpx;
        margin-right: 20rpx;
        background: #f5f5f5;
      }
      .item-content {
        flex: 1;
        width: 0;
        .huifu-box {
          background: #f5f5f5;
          border-radius: 10rpx;
          .huifu-item {
            padding: 10rpx;
            word-break: break-all;
          }
        }
        .btns {
          > view {
            min-width: 100rpx;
            padding: 0 10rpx;
            text-align: right;
          }
        }
      }
    }
  }
}

.bottom-input {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding: 0 10rpx;
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;

    font-size: 30rpx;

    display: flex;
    align-items: center;
    /deep/.u-input {
      background: #f5f5f5;
    }

    .bt {
      padding: 10rpx 20rpx;
      margin: 0 10rpx;
      background: #f61807;
      color: #fff;
      border-radius: 10rpx;
    }

    .bottom-dianzan {
      position: relative;
      padding: 20rpx;
      > text:nth-last-child(1) {
        position: absolute;
        top: 0;
        right: 0;
        font-size: 20rpx;
      }
    }
  }
}
</style>
