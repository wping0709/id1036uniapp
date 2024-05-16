<template>
  <view class="page-body">
    <view class="item">
      <view v-if="pageData.user_info" class="user-info flex-y-center flex-x-sb">
        <view class="left flex-w-1 flex-y-center">
          <image :src="pageData.user_info.avatar_url" mode="aspectFill" />
          <view class="left-right flex-w-1 m-l-16">
            <view class="font-30">{{ pageData.user_info.nickname }}</view>
            <view class="font-24 color-999">{{ pageData.addtime }}</view>
          </view>
        </view>
      </view>

      <view class="content">
        <view class="detail">
          {{ pageData.content }}
        </view>

        <!-- 图视频 -->
        <view v-if="pageData.images && pageData.images.length">
          <u-album
            v-if="pageData.images[0].type == 1"
            :urls="pageData.images"
            keyName="feil_url"
          ></u-album>
          <video
            :ref="'video_' + pageData.id"
            :id="'video_' + pageData.id"
            :poster="pageData.images[0].video_pic"
            v-else
            :src="pageData.images[0].feil_url"
          ></video>
        </view>

        <!-- 商品 -->
        <template v-if="pageData.order_goods && pageData.order_goods.length">
          <view
            v-for="(goods, i2) in pageData.order_goods"
            :key="i2"
            class="goods flex"
          >
            <view class="goods-img">
              <image :src="goods.cover_pic" mode="aspectFill" />
            </view>
            <view class="goods-content flex-col flex-x-sb flex-w-1">
              <view class="font-600 u-line-2">{{ goods.name }}</view>
              <view class="flex-x-sb flex-y-center p-b-10">
                <view class="price-color">￥{{ goods.price }}</view>
                <view
                  @click="$utils.toUrl('/pages/goods/goods?id=' + goods.id)"
                  class="goods-bt"
                >
                  我也想要
                </view>
              </view>
            </view>
          </view>
        </template>
      </view>

      <view class="bottom flex-y-center m-t-20">
        <view class="address flex-w-1 u-line-1 color-999">
          <template v-if="pageData.address">
            <text class="iconfont icon-dingwei font-24"></text>
            <text class="font-24">{{ pageData.address }}</text>
          </template>
        </view>
      </view>
      <!-- 点赞评论 -->
      <view class="flex-x-sa btns">
        <!-- 点赞 -->
        <div class="flex-y-center" @click="postsGood(pageData)">
          <div
            :style="{ color: (isGood(pageData.id) && 'red') || '#555' }"
            class="iconfont icon-good font-50 m-r-4"
          ></div>
          <div class="color-999">{{ pageData.good_num }}</div>
        </div>
        <div
          v-if="!pageData.is_my"
          @click="
            $utils.toUrl('/posts/posts-report/index?posts_id=' + pageData.id)
          "
          class="flex-y-center"
        >
          <div class="iconfont icon-ziyuan1 font-44 m-r-10"></div>
          <div>投诉</div>
        </div>
        <!-- <div
          @click="$utils.toUrl('/posts/posts-report/index?posts_id=' + pageData.id)"
          class="flex-y-center"
        >
          <div class="iconfont icon-yincang font-48 m-r-10"></div>
          <div>隐藏</div>
        </div> -->
        <div
          v-if="pageData.is_my"
          @click="
            $utils.toUrl(
              `/posts/posts-add/index?id=${pageData.cart_id}&posts_id=${pageData.id}`
            )
          "
          class="flex-y-center"
        >
          <div class="iconfont icon-bianji1 font-50 m-r-6"></div>
          <div>编辑</div>
        </div>
        <div
          v-if="pageData.is_my"
          @click="onDelete(pageData)"
          class="flex-y-center"
        >
          <div class="iconfont icon-ashbin1 font-46 m-r-6"></div>
          <div>删除</div>
        </div>
      </view>
    </view>

    <div class="comment-box">
      <div class="font-600-32">评论（{{ comment.count }}）</div>
      <div class="comment-list">
        <div class="popst-item" v-for="(item, i) in comment.list" :key="i">
          <image :src="item.avatar_url" mode="aspectFill" />
          <view class="flex-w-1 m-l-16">
            <view class="">{{ item.nickname }}</view>
            <view class="m-t-10">{{ item.comment }}</view>
            <view class="color-999 font-24 m-t-18">{{ item.add_time }}</view>
          </view>
        </div>
      </div>
    </div>

    <div class="comment-input-box flex-y-center">
      <div class="fixed">
        <div class="comment-input flex-w-1 m-r-20">
          <u-input
            v-model="commentValue"
            placeholder="我想说"
            placeholderStyle="font-size:26rpx;font-weight:400;"
            :customStyle="{ background: '#f0f0f0' }"
            shape="circle"
            border="none"
            clearable
            :adjustPosition="false"
            @confirm="commentConfirm"
          ></u-input>
        </div>
        <div class="flex-col flex-y-center">
          <div class="font-24">{{ pageData.good_num }}</div>
          <div
            @click="postsGood(pageData)"
            class="iconfont icon-good font-50"
            :style="{
              width: '50rpx',
              height: '50rpx',
              lineHeight: '50rpx',
              color: isGood(pageData.id) ? 'red' : '#555',
            }"
          ></div>
        </div>
      </div>
    </div>
  </view>
</template>
<script>
import share from "@/mixins/share";
export default {
  mixins: [share],
  data() {
    return {
      pageData: "",
      posts_id: "",
      checkItem: "",
      comment: {
        count: 0,
        page: 0,
        list: [],
        status: "loadmore",
      },
      commentValue: "",
    };
  },
  onLoad(params) {
    this.posts_id = params.posts_id;
    this.loadData();
    this.getComment();
  },
  onShow() {},
  methods: {
    async onDelete(item) {
      console.log(item);
      const { confirm } = await this.$utils.showModalAsync({
        content: "您确定删除这条动态嘛？",
      });
      if (!confirm) return;
      const res = await this.$requestAll.posts.delSelfItem({
        posts_id: item.id,
      });
      uni.$u.toast("删除成功");
      setTimeout(() => {
        this.$utils.backTo(1);
      }, 1000);
    },
    async loadData(fn) {
      const res = await this.$requestAll.posts.postsItem({ id: this.posts_id });
      this.pageData = res.data.posts;
      fn && fn();
    },
    async getComment(reset) {
      if (reset) {
        this.comment = this.$options.data().comment;
      }
      if (this.comment.status == "nomore") return;

      const res = await this.$requestAll.posts.getComment({
        id: this.posts_id,
        page: this.comment.page,
      });
      this.comment.count = res.data.count;
      this.comment.list.push(...res.data.comment_list);
      this.comment.status =
        this.comment.list.length >= this.comment.count ? "nomore" : "loadmore";
      this.comment.page++;
    },
    clickMore(item) {
      this.$set(this.pageData, "more", !this.pageData.more);
    },
    async postsGood(item) {
      if (item.good) return;
      var good_posts = uni.getStorageSync("good_posts") || [];
      if (typeof good_posts == "string") good_posts = JSON.parse(good_posts);
      const res = await this.$requestAll.posts.postsGood(
        {
          id: item.id,
        },
        true
      );
      good_posts.push(item.id);
      uni.setStorageSync("good_posts", good_posts);

      item.good_num++;
      item.good = true;
    },
    async commentConfirm(e) {
      console.log(e);
      const res = await this.$requestAll.posts.addComment({
        comment: this.commentValue,
        posts_id: this.posts_id,
        reply_id: 0,
      });
      this.commentValue = "";
      this.getComment(true);
    },
  },
  computed: {
    isGood() {
      return function (id) {
        let good_posts = uni.getStorageSync("good_posts") || [];
        return good_posts.indexOf(id) != -1;
      };
    },
    user_info() {
      return this.$store.getters["userInfo"] || {};
    },
    shareData() {
      let path = uni.$u.page();
      path =
        path +
        this.$u.queryParams({
          posts_id: this.posts_id,
          user_id: this.$store.getters["user/userInfo"].id || "",
          store_id: this.$store.getters["currentStore"].id || "",
          // #ifdef APP-PLUS
          _platform: "app",
          // #endif
        });
      return {
        path: path,
      };
    },
  },
  watch: {},
  onReachBottom() {
    this.getComment();
  },
  onPullDownRefresh() {
    this.loadData(uni.stopPullDownRefresh);
  },
};
</script>
<style lang="scss" scoped>
.page-body {
  min-height: 100vh;
  background: #f2f2f2;
}

.item {
  padding: 36rpx 30rpx 0;
  border: 2rpx solid #eee;
  background: #fff;

  .user-info {
    .left {
      > image {
        width: 62rpx;
        height: 62rpx;
        border-radius: 50%;
      }
    }

    .right {
      position: relative;

      .more-bt {
        display: none;
        position: absolute;
        right: 100%;
        top: 50%;
        transform: translate(0, -50%);
        background: #000;
        margin-right: 20rpx;
        width: 0;
        line-height: 60rpx;
        color: #fff;
        text-align: center;

        &::after {
          content: "";
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translate(0, -50%);
          border: 10rpx solid transparent;
          border-left-color: #000;
        }
      }

      .width-switch {
        display: block;
        white-space: nowrap;
        animation: widthchange 0.1s linear 0s 1 forwards;
      }

      @keyframes widthchange {
        from {
          width: 0;
        }

        to {
          width: 140rpx;
        }
      }
    }
  }

  > .content {
    // padding: 0 48rpx;
    video {
      width: 100%;
      aspect-ratio: 16/9;
      height: auto;
    }

    .detail {
      font-size: 34rpx;
      line-height: 56rpx;
      padding: 20rpx 0;
    }
  }

  .goods {
    margin-top: 10rpx;
    overflow: hidden;
    border-radius: 10rpx;
    background: #f3f3f3;

    .goods-img {
      margin-right: 20rpx;
      width: 130rpx;
      height: 130rpx;

      > image {
        border-radius: 10rpx;
        width: 100%;
        height: 100%;
      }
    }

    .goods-bt {
      border-radius: 10rpx;
      padding: 0 10rpx;
      margin-right: 10rpx;
      background: #ee3a3a;
      line-height: 40rpx;
      color: #fff;
      font-size: 24rpx;
    }
  }

  .btns {
    color: #999;
    .iconfont {
      color: #666;
    }
  }
}

.comment-box {
  margin-top: 28rpx;
  background: #fff;
  padding: 26rpx 30rpx;
  .popst-item {
    margin-top: 30rpx;
    display: flex;

    > image {
      width: 44rpx;
      height: 44rpx;
      border-radius: 50%;
    }
  }
}

.comment-input-box {
  height: 110rpx;
  padding-bottom: env(safe-area-inset-bottom);
  .fixed {
    box-sizing: content-box;
    width: 690rpx;
    height: 110rpx;
    padding: 0 30rpx;
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;

    position: fixed;
    left: 0;
    bottom: 0;

    display: flex;
    align-items: center;
  }
}
</style>
