<template>
  <view>
    <!-- 多行 -->
    <view class="center" v-if="param.list_style == 2">
      <view class="center-bottom">
        <view
          class="center-bottom-view"
          @click="xiangqing(item.from_user, item.id)"
          v-for="(item, index) of pageData.list"
          :key="index"
        >
          <image
            :src="item.pic_url[0]"
            class="center-bottom-view-img"
            mode="aspectFill"
          ></image>
          <view class="center-bottom-view-biaoq">
            <view v-if="item.topic_name"> #{{ item.topic_name }} </view>
          </view>
          <view class="center-bottom-view-content">
            {{ item.content }}
          </view>
          <view class="center-bottom-view-bottom">
            <view class="center-bottom-view-bottom-name">
              <image :src="item.avatar_url" mode="aspectFill"></image>
              <view>
                {{ item.nickname }}
              </view>
            </view>
            <view class="center-bottom-view-bottom-kan">
              <image :src="wxapp_img.publish.kan" mode="aspectFill"></image>
              <view>
                {{ item.browse_num }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 单行 -->
    <template v-for="(item, index) of pageData.list">
      <view class="center2" v-if="param.list_style == 0" :key="index">
        <view class="center2-top">
          <image :src="item.avatar_url" class="" mode=""></image>
          <view class="center2-view">
            <view class="center2-view-text">
              {{ item.nickname }}
            </view>
            <view class="center2-view-text2">
              {{ item.add_time }}
            </view>
          </view>
        </view>
        <view
          class="center2-content"
          @click="xiangqing(item.from_user, item.id)"
        >
          <view class="center2-content-view" v-if="item.is_hot == 1">
            {{ item.topic_name }}
          </view>
          <view class="center2-content-view2">
            {{ item.content }}
          </view>
        </view>
        <view
          class="center2-bigImg"
          @click="xiangqing(item.from_user, item.id)"
        >
          <image :src="item.pic_url[0]" mode="aspectFill"></image>
        </view>
        <view class="center2-bq">
          <!-- v-for="(items,indexs) of item.comment_list" :key="indexs" -->
          <view> #{{ item.topic_name }} </view>
        </view>
        <view class="center2-caozuo">
          <view class="center2-caozuo-view">
            <image :src="wxapp_img.publish.pinglun" mode=""></image>
            <view>
              {{ item.share_num }}
            </view>
          </view>
          <view
            class="center2-caozuo-view"
            @click="dianzan(item.id, item.is_like)"
          >
            <image
              :src="wxapp_img.publish.dianzan"
              mode=""
              v-if="item.is_like == 0"
            ></image>
            <image :src="wxapp_img.publish.xin2" mode="" v-else></image>
            <view>
              {{ item.like_count }}
            </view>
          </view>
          <view
            class="center2-caozuo-view"
            @click="xiangqing(item.from_user, item.id)"
          >
            <image :src="wxapp_img.publish.fenxiang" mode=""></image>
            <view> 分享 </view>
          </view>
        </view>
        <view class="center2-pl">
          <view> {{ item.nickname }}： </view>
          <input
            type="text"
            placeholder="我也来评论一下"
            :focus="focusState"
            v-model="plText"
            @confirm="pinglun(event)"
            @click="dianji(item.id)"
          />
        </view>
      </view>
    </template>

    <u-loadmore
      v-if="param.list_more == 1"
      :status="pageData.isLoad ? 'loadmore' : 'nomore'"
    ></u-loadmore>
  </view>
</template>

<script>
import wine from "@/api/wine.js";
// ids 1 多行
export default {
  data() {
    return {
      id: null,
      plText: null,
      pageData: {
        page: 1,
        isLoad: true,
        list: [],
      },
    };
  },
  props: {
    param: {
      type: Object,
    },
  },

  watch: {
    // param(e,a){
    // 	if(e.){}
    // }
  },
  mounted() {
    this.huoqu();
  },
  methods: {
    pinglun() {
      console.log("我评论了，id等于", this.id);
      let data = {
        article_id: this.id,
        review_text: this.plText,
        parent_id: 0,
      };
      wine.noteReviewArticle(data).then((res) => {
        console.log(res);
        if (res.code == 0) {
          uni.showToast({
            title: "评论成功",
          });
          this.plText = "";
          this.huoqu();
        }
      });
    },
    dianji(e) {
      this.id = e;
    },
    dianzan(id, show) {
      let num = null;
      if (show == 1) {
        num = 0;
      } else {
        num = 1;
      }
      let data = {
        article_id: id,
        is_liked: num,
        // review_id: e
      };
      wine.noteLikeArticle(data, 1).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.huoqu();
          // this.$emit("giveALike")
        }
      });
    },
    xiangqing(e, a) {
      this.$utils.toUrl(
        `/wine/topicDetails/topicDetails?id=${e}&article_id=${a}`
      );
    },
    onClick(type, url) {
      if (type == "navigate") {
        // this.$router.push({path: url})
        this.$utils.toUrl(url);
      }
    },
    async huoqu(isReset) {
      if (isReset) {
        this.pageData = this.$options.data().pageData;
      }
      // 到底 || 未开启触底加载只加载一次数据
      if (
        !this.pageData.isLoad ||
        (this.param.list_more == 0 && this.pageData.page > 1)
      )
        return;
      let data = {
        ...this.pageData,
        list_more: this.param.list_more,
        list_type: this.param.list_type,
        list:
          this.param.list_type == 1
            ? JSON.stringify(this.param.list[0].goods_list)
            : "",
      };
      const res = await wine.defaultNotePost(data);
      this.pageData.list.push(...res.data);
      this.pageData.page++;
      this.pageData.isLoad = res.data.length == 30;
    },
  },
};
</script>

<style scoped lang="scss">
.center {
  width: 100%;
  // margin-left: 18rpx;
  margin-top: 10rpx;

  .center-bottom {
    display: flex;
    flex-wrap: wrap;

    .center-bottom-view {
      width: 352rpx;
      height: 544rpx;
      // background: red;
      border-radius: 16rpx;
      margin-left: 18rpx;
      margin-top: 10rpx;
      border-radius: 16rpx;
      background-color: #fff;

      .center-bottom-view-img {
        width: 352rpx;
        height: 352rpx;
        border-radius: 10rpx 10rpx 0 0;
      }

      .center-bottom-view-biaoq {
        width: 308rpx;
        height: 60rpx;
        overflow-x: auto;
        white-space: nowrap;
        margin-top: 10rpx;

        view {
          width: 144rpx;
          height: 48rpx;
          display: inline-block;
          background: #f1f1f1;
          border-radius: 10rpx;
          text-align: center;
          line-height: 48rpx;
          margin-left: 20rpx;
          font-size: 22rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #262626;
        }
      }

      .center-bottom-view-content {
        width: 308rpx;
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #262626;
        margin-left: 20rpx;
        overflow: hidden;
        white-space: nowrap;
        /*限制不换行*/
        text-overflow: ellipsis;
      }

      .center-bottom-view-bottom {
        width: 308rpx;
        height: 40rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 20rpx;
        margin-top: 20rpx;

        .center-bottom-view-bottom-name {
          width: 220rpx;
          height: 40rpx;
          display: flex;
          // justify-content: space-between;
          align-items: center;

          image {
            width: 40rpx;
            height: 40rpx;
            border-radius: 120rpx;
          }

          view {
            width: 120rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #8c8c8c;
            margin-left: 20rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .center-bottom-view-bottom-kan {
          max-width: 93rpx;
          height: 40rpx;
          display: flex;
          // justify-content: space-between;
          align-items: center;

          image {
            width: 28rpx;
            height: 23rpx;
          }

          view {
            height: 34rpx;
            line-height: 34rpx;
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 600;
            color: #8c8c8c;
            margin-left: 20rpx;
          }
        }
      }
    }
  }
}
.center2 {
  width: 750rpx;
  // height: 1106rpx;
  background: #ffffff;
  overflow: hidden;
  margin-top: 25rpx;
  .center2-top {
    width: 300rpx;
    height: 60rpx;
    margin-top: 30rpx;
    margin-left: 20rpx;
    display: flex;
    align-items: center;
    image {
      width: 60rpx;
      height: 60rpx;
      border-radius: 50%;
    }
    .center2-view {
      height: 60rpx;
      margin-left: 15rpx;
      .center2-view-text {
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #262626;
      }
      .center2-view-text2 {
        font-size: 20rpx;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ccc;
      }
    }
  }
  .center2-content {
    height: 40rpx;
    display: flex;
    align-items: center;
    margin-top: 30rpx;
    margin-left: 20rpx;
    .center2-content-view {
      // width: 60rpx;
      padding-left: 20rpx;
      padding-right: 20rpx;
      height: 30rpx;
      text-align: center;
      font-size: 20rpx;
      font-family: PingFang SC;
      line-height: 30rpx;
      background-color: #f18642;
      color: #fff;
      border-radius: 5rpx;
    }
    .center2-content-view2 {
      height: 40rpx;
      line-height: 40rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 500;
      color: #262626;
      margin-left: 10rpx;
    }
  }
  .center2-bigImg {
    width: 400rpx;
    height: 600rpx;
    margin-top: 40rpx;
    margin-left: 20rpx;
    image {
      width: 100%;
      height: 100%;
      border-radius: 10rpx;
    }
  }
  .center2-bq {
    height: 40rpx;
    margin-left: 20rpx;
    display: flex;
    margin-top: 30rpx;
    view {
      min-width: 120rpx;
      height: 50rpx;
      // text-align: center;
      // line-height: 40rpx;
      padding: 5rpx 15rpx;
      // padding-top: 5rpx;
      color: #7997c1;
      background-color: #edf5fd;
      border-radius: 20rpx;
      margin-left: 10rpx;
      &:nth-child(1) {
        margin-left: 0;
      }
    }
  }
  .center2-caozuo {
    height: 40rpx;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 60rpx;
    .center2-caozuo-view {
      height: 36rpx;
      display: flex;
      margin-right: 60rpx;
      image {
        width: 36rpx;
        height: 36rpx;
      }
      view {
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
        margin-left: 10rpx;
      }
    }
  }
  .center2-pl {
    width: 710rpx;
    height: 78rpx;
    background: #fafafa;
    border-radius: 20rpx;
    margin-left: 20rpx;
    margin-top: 24rpx;
    border-radius: 10rpx;
    display: flex;
    align-items: center;
    margin-bottom: 30rpx;
    view {
      height: 36rpx;
      line-height: 36rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #262626;
      margin-left: 28rpx;
    }
    input {
      width: 540rpx;
      height: 36rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: #8c8c8c;
      margin-top: 5rpx;
    }
  }
}
.tianjia {
  width: 88rpx;
  height: 88rpx;
  // background: #FFCC36;
  position: fixed;
  bottom: 280rpx;
  right: 18rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
