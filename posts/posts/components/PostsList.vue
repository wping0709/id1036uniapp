<template>
  <view class="list">
    <view class="item" v-for="(item, index) in postsList" :key="index">
      <view v-if="item.user_info" class="user-info flex-y-center flex-x-sb">
        <view class="left flex-w-1 flex-y-center">
          <image :src="item.user_info.avatar_url" mode="aspectFill" />
          <view class="left-right flex-w-1 m-l-20">
            <view>{{ item.user_info.nickname }}</view>
            <view class="font-24 color-999">{{ item.addtime }}</view>
          </view>
        </view>
        <view class="right">
          <!-- <view :class="[item.more && 'width-switch']" class="more-bt">
            <div
              @click="
                $utils.toUrl('/posts/posts-report/index?posts_id=' + item.id)
              "
            >
              投诉
            </div>
            <div
              v-if="item.is_my"
              @click="
                $utils.toUrl(
                  `/posts/posts-add/index?id=${item.cart_id}&posts_id=${item.id}`
                )
              "
            >
              编辑
            </div>
            <div v-if="item.is_my" @click="onDelete(item)">删除</div>
          </view> -->
          <text
            @click="clickMore(item)"
            class="iconfont icon-gengduo-shuxiang font-50"
          ></text>
        </view>
      </view>

      <view class="content">
        <view
          class="detail"
          @click="$utils.toUrl('/posts/detail/index?posts_id=' + item.id)"
        >
          {{ item.content }}
        </view>

        <!-- 图视频 -->
        <view @click="onClickVideo(item)" v-if="item.images.length">
          <u-album
            v-if="item.images[0].type == 1"
            :urls="item.images"
            keyName="feil_url"
          ></u-album>
          <video
            :ref="'video_' + item.id"
            :id="'video_' + item.id"
            :poster="item.images[0].video_pic"
            v-else
            :src="item.images[0].feil_url"
          ></video>
        </view>

        <!-- 商品 -->
        <template v-if="item.order_goods.length">
          <view
            v-for="(goods, i2) in item.order_goods"
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

      <view class="bottom flex-y-center">
        <view class="address flex-w-1 u-line-1 color-999">
          <template v-if="item.address">
            <text class="iconfont icon-dingwei font-24"></text>
            <text class="font-24">{{ item.address }}</text>
          </template>
        </view>

        <!-- 点赞评论 -->
        <view class="flex-x-end flex-y-center">
          <!-- 点赞 -->
          <div class="flex-y-center" @click="postsGood(item)">
            <div
              :style="{ color: (isGood(item.id) && 'red') || '#555' }"
              class="iconfont icon-good font-50"
            ></div>
            <div class="color-999">{{ item.good_num }}</div>
          </div>
          <div
            class="flex-y-center"
            @click="$utils.toUrl('/posts/detail/index?posts_id=' + item.id)"
          >
            <div class="iconfont icon-pinglun font-40 m-l-20"></div>
            <div class="color-999 m-l-10">{{ item.comment_num }}</div>
          </div>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    list: Array,
  },
  data() {
    return {
      postsList: [],
      checkItem: "",
    };
  },
  watch: {
    list: {
      handler(val) {
        console.log(val, "listChange");
        let good_posts = uni.getStorageSync("good_posts") || [];
        let newList = val.filter((item) => {
          item.good = good_posts.indexOf(item.id) != -1;
          return item;
        });
        this.postsList = JSON.parse(JSON.stringify(newList));
      },
      immediate: true,
    },
  },
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

      let list = this.list.filter((it) => it.id != item.id);
      this.$emit("update:list", list);
    },
    clickMore(item) {
      let itemList = ["投诉"];
      if (item.is_my) {
        itemList = ["编辑", "删除"];
      }
      uni.showActionSheet({
        itemList,
        itemColor: "#000000",
        success: ({ tapIndex }) => {
          if (item.is_my) {
            switch (tapIndex) {
              case 0:
                this.$utils.toUrl(
                  `/posts/posts-add/index?id=${item.cart_id}&posts_id=${item.id}`
                );
                break;
              case 1:
                this.onDelete(item)
                break;
            }
          } else {
            this.$utils.toUrl("/posts/posts-report/index?posts_id=" + item.id);
          }
        },
        fail: () => {},
        complete: () => {},
      });
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
    onClickVideo(item) {
      console.log(item, 1);
      this.checkItem = item;
    },
    async pageScroll(e) {
      if (this.checkItem) {
        let videoDom = await this.$uGetRect("#video_" + this.checkItem.id);
        console.log(videoDom);
        if (videoDom.top < 50) {
          let video = uni.createVideoContext(
            "video_" + this.checkItem.id,
            this
          );
          video.pause();
        }
      }
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
  },
};
</script>

<style lang="scss" scoped>
.list {
  .item {
    padding: 20rpx 47rpx;
    border: 2rpx solid #eee;
    background: #fff;

    .user-info {
      .left {
        > image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 50%;
        }
      }

      .right {
        position: relative;

        .more-bt {
          display: none;
          position: absolute;
          right: 100%;
          top: 0;
          // transform: translate(0, -50%);
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
            top: 30rpx;
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
  }
}
</style>
