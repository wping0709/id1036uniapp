<template>
  <view>
    <!-- 'padding-top:'+titleHeight+'px;' -->
    <view
      class="top"
      :style="{
        backgroundImage: 'url' + `(${imgs})`,
        paddingTop: titleHeight + 'px;',
      }"
    >
    </view>
    <view class="tops" :style="{ top: titleHeight + 'px;' }">
      <view class="tops-left" @click="fanhui">
        <span class="iconfont">&#xe8c6;</span>
      </view>
      <view class="tops-center" v-if="top_show == 0"> 我的发布 </view>
      <view class="tops-right"> </view>
    </view>
    <view class="user-Img">
      <view class="user-Img-left">
        <image :src="focusData.user_img" mode=""></image>
        <view>
          {{ focusData.nickname || '' }}
        </view>
      </view>
      <view
        class="user-Img-right"
        v-if="top_show != 0 && focusData.is_focus == 0"
        @click="gzDian(focusData.is_focus)"
      >
        关注
      </view>
      <view
        class="user-Img-right2"
        v-if="top_show != 0 && focusData.is_focus == 1"
        @click="gzDian(focusData.is_focus)"
      >
        已关注
      </view>
    </view>
    <view class="myContent">
      <view class="myContent-view" @click="contentClick(0)">
        <view class="fabuNumber">
          {{ focusData.note_fanc_count || '' }}
        </view>
        <view class="fabuText"> 粉丝 </view>
      </view>
      <view class="myContent-view" @click="contentClick(1)">
        <view class="fabuNumber">
          {{ focusData.note_focus_count || '' }}
        </view>
        <view class="fabuText"> 关注 </view>
      </view>
      <view class="myContent-view" @click="contentClick(2)">
        <view class="fabuNumber">
          {{ focusData.like_count || 0 }}
        </view>
        <view class="fabuText"> 被喜欢 </view>
      </view>
    </view>
    <view class="myredate_type">
      <view
        :class="show == 0 ? 'myredate_type_view' : 'myredate_type_view2'"
        @click="qh(0)"
      >
        <view> 动态 </view>
        <text></text>
      </view>
      <view
        :class="show == 1 ? 'myredate_type_view' : 'myredate_type_view2'"
        @click="qh(1)"
      >
        <view>
          {{ comment_title }}
        </view>
        <text></text>
      </view>
      <view
        :class="show == 2 ? 'myredate_type_view' : 'myredate_type_view2'"
        @click="qh(2)"
      >
        <view> 问答 </view>
        <text></text>
      </view>
      <view
        :class="show == 3 ? 'myredate_type_view' : 'myredate_type_view2'"
        @click="qh(3)"
      >
        <view> 喜欢 </view>
        <text></text>
      </view>
    </view>
    <!-- 点击的模块是否是问答模块 questionShow代表问答下的 提问和回答 -->
    <view class="question" v-if="show == 2">
      <view
        :class="questionShow == 0 ? 'question_view' : 'question_view2'"
        @click="questionClick(0)"
      >
        提问
      </view>
      <view
        :class="questionShow == 1 ? 'question_view' : 'question_view2'"
        @click="questionClick(1)"
      >
        回答
      </view>
    </view>
    <!-- show 代表当前点的模块 0动态  1酒评  2问答  3喜欢    -->
    <view
      class="pj"
      :style="show == 2 ? 'margin-top:0rpx;' : ''"
      v-if="show == 1 || show == 2 || show == 3"
    >
      <view class="pj_content" v-for="(item, index) of list" :key="index">
        <view class="pj_conetnt_top" v-if="show != 2">
          <!-- (1问题，2回答，3酒评，4评论，5动态) -->
          <view>
            {{ like }}
            <text v-if="item.type == 1">问题</text>
            <text v-if="item.type == 2 && item.style == 0">回答</text>
            <text v-if="item.type == 2 && item.style == 1">回答评论</text>
            <text v-if="item.type == 3">酒评</text>
            <text v-if="item.type == 4">评论</text>
            <text v-if="item.type == 5 && item.style == 0">动态</text>
            <text v-if="item.type == 5 && item.style == 1">动态评论</text>
            <uni-rate
              v-if="show == 1"
              size="18"
              class="rate"
              :readonly="true"
              :value="item.score"
            />
          </view>
          <view>
            {{ item.addtime || item.add_time }}
          </view>
        </view>
        <view class="text" v-if="show == 1 || (show == 2 && questionShow == 1)">
          {{ item.content }}
        </view>
        <view
          class="pj_conetnt_center"
          @click="
            liquor(
              item.type,
              item.id,
              item.qid || item.question_id,
              item.user_id,
              item.review_id,
              item.answer_id,
              item.note_id,
              item.article_id
            )
          "
        >
          <image :src="item.cover_pic || item.pic_url" mode=""></image>

          <view class="pj_conetnt_center_view">
            <view class="title">
              {{ item.goods_name || item.question || item.name }}
            </view>

            <view class="view_bottom">
              <view>
                {{ item.want_count || item.answer_count || item.review_count }}
              </view>
              <text v-if="show == 1">想买</text>
              <text v-if="show == 2">回答</text>
              <text v-if="show == 3">评论</text>
              <text>·</text>
              <view>
                {{ item.like_count || item.eat_count }}
              </view>
              <text v-if="show == 1">买过</text>
              <text v-if="show == 2">喜欢</text>
              <text v-if="show == 3">喜欢</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="center">
      <view class="center-bottom" v-if="show == 0">
        <view
          class="center-bottom-view"
          v-for="(item, index) of list"
          :key="index"
        >
          <image
            :src="item.pic_url"
            class="center-bottom-view-img"
            mode="aspectFill"
            @click="
              liquor(
                item.type,
                item.id,
                item.qid || item.question_id,
                item.user_id,
                item.review_id,
                item.note_id
              )
            "
          ></image>
          <view class="center-bottom-view-biaoq">
            <view> #{{ item.topic_name }} </view>
          </view>
          <view class="center-bottom-view-content">
            {{ item.content }}
          </view>
          <view class="center-bottom-view-bottom">
            <view class="center-bottom-view-bottom-name">
              <image :src="item.avatar_url" mode=""></image>
              <view>
                {{ item.nickname }}
              </view>
            </view>
            <view
              class="center-bottom-view-bottom-kan"
              @click="dz(item.id, item.is_like)"
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
          </view>
        </view>
      </view>
    </view>
    <view class="chengkai"> </view>
  </view>
</template>

<script>
import wine from '@/api/wine.js';
export default {
  computed: {
    comment_title() {
      return (
        this.$store.getters['SHOP_CONFIG']?.push_info.comment_title || '酒评'
      );
    },
  },
  data() {
    return {
      titleHeight: 0,
      imgs: 'https://img1.baidu.com/it/u=3384796346,381674655&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500',
      show: 0,
      questionShow: 0,
      texts: '提问',
      like: '发布了',
      top_show: null,
      heights: '500rpx',
      id: '',
      page: 1,
      focusData: null,
      list: [],
    };
  },
  // comments: {
  // 	list,
  // 	evaluation,
  // },
  // components:{
  // 	uniRate
  // },
  onShow() {
    this.page = 1;
    this.list = [];
    this.huoqu();
  },
  onLoad(e) {
    // 根据外层点击的类别开分辨展示内容
    console.log(e);
    // this.show = e.show
    if (e.id == '' || e.id == uni.getStorageSync('userInfo').id) {
      this.id = '';
      this.top_show = 0;
    } else {
      this.id = e.id;
      this.top_show = 1;
    }
    console.log(this.top_show, 'toShow');
    // this.top_show = e.id
    this.getHeight();
  },
  onReachBottom() {
    this.page++;
    this.huoqu();
  },

  methods: {
    dz(e, a) {
      let num = null;
      if (a == 0) {
        num = 1;
      } else if (a == 1) {
        num = 0;
      }
      let data = {
        article_id: e,
        is_liked: num,
      };
      wine.noteLikeArticle(data, 1).then(res => {
        console.log(res);
        if (res.code == 0) {
          // this.$emit("giveALike")
          this.huoqu();
        }
      });
    },
    liquor(t, j, e, a, f, answer, noteId, article) {
      console.log(t, j, e, a, f, answer, article);
      if (this.show == 0) {
        uni.navigateTo({
          url: `../../wine/topicDetails/topicDetails?id=${a}&article_id=${j}`,
        });
      } else if (this.show == 1) {
        uni.navigateTo({
          url: `../../wine/topicDetails/topicDetails?id=${a}&article_id=${j}&default_show=${3}`,
        });
      } else if (this.show == 2) {
        if (this.questionShow == 0) {
          uni.navigateTo({
            url: `../../wine/pinglunDetails/pinglunDetails?id=${e}&user_id=${a}`,
          });
        } else if (this.questionShow == 1) {
          uni.navigateTo({
            url: `../../wine/wdDetils/wdDetils?id=${a}&article_id=${e}&answer_id=${j}`,
          });
        }
      } else if (this.show == 3) {
        console.log(566);
        this.liquorTwo(t, j, e, a, f, answer, noteId, article);
        // uni.navigateTo({
        // 	url:`../../wine/wdDetils/wdDetils?id=${a}&article_id=${f}`
        // })
      }
    },
    liquorTwo(t, j, e, a, f, answer, noteId, article) {
      // t type值(1问题，2回答，3酒评，4评论，5动态)
      console.log(t, j, e, a, f, answer, noteId, article);
      if (t == 2) {
        uni.navigateTo({
          url: `../../wine/wdDetils/wdDetils?id=${a}&article_id=${e}&answer_id=${answer}`,
        });
      } else if (t == 1) {
        uni.navigateTo({
          url: `../../wine/pinglunDetails/pinglunDetails?id=${e}&user_id=${a}`,
        });
      } else if (t == 3) {
        uni.navigateTo({
          url: `../../wine/topicDetails/topicDetails?id=${a}&article_id=${noteId}&default_show=${3}`,
        });
      } else if (t == 4) {
        uni.navigateTo({
          url: `../../wine/topicDetails/topicDetails?id=${a}&article_id=${j}`,
        });
      } else if (t == 5) {
        uni.navigateTo({
          url: `../../wine/topicDetails/topicDetails?id=${a}&article_id=${article}`,
        });
      }
    },
    // 关注
    gzDian(e) {
      console.log(e);
      let num = null;
      if (e == 0) {
        num = 1;
      } else {
        num = 0;
      }
      let data = {
        user_id: this.id,
        is_user_liked: num,
      };
      wine.noteFocusUser(data).then(res => {
        console.log(res);
        if (res.code == 0) {
          uni.showToast({
            title: '关注成功',
          });
          this.huoqu();
        }
      });
    },
    huoqu() {
      if (this.show == 2) {
        let data = {
          page: this.page,
          type: this.show,
          user_id: this.id,
          answer_type: this.questionShow,
        };
        wine.userMyPush(data, 2).then(res => {
          // 修改 list == null
          console.log(res, res.data.list.length);
          console.log(res.data.list, '6666666');
          this.focusData = res;
          if (res.data.list.length == 0) {
            uni.showToast({
              title: '暂无更多数据',
              icon: 'none',
            });
          } else if (res.data == null) {
            uni.showToast({
              title: '暂无更多数据',
              icon: 'none',
            });
            // this.focusData.data.list = list
          } else {
            this.list = [];
            this.list = this.list.concat(res.data.list);
          }
        });
      } else {
        let data = {
          page: this.page,
          type: this.show,
          user_id: this.id,
        };
        wine.userMyPush(data, 1).then(res => {
          console.log(res);
          this.focusData = res;
          if (res.data == null || res.data.list.length == 0) {
            uni.showToast({
              title: '暂无更多数据',
              icon: 'none',
            });
          } else {
            this.list = [];
            this.list = this.list.concat(res.data.list);
            this.focusData = res;
            // this.focusData.data.list = list
          }
        });
      }
    },
    fanhui() {
      uni.navigateBack({
        delta: -1,
      });
    },
    getHeight() {
      let res = wx.getMenuButtonBoundingClientRect();
      this.titleHeight = res.top + 3;
    },
    qh(e) {
      let that = this;
      console.log(e);
      that.page = 1;
      that.show = e;
      that.list = [];
      this.huoqu();
      if (e == 1) {
        that.texts = '酒评';
      } else if (e == 3) {
        that.texts = '评论';
        that.like = '喜欢';
      }
    },
    questionClick(e) {
      console.log(e);
      this.questionShow = e;
      this.list = [];
      this.huoqu();
      if (this.questionShow == 0) {
        this.texts = '提问';
      } else if (this.questionShow == 1) {
        console.log(1111);
        this.texts = '回答';
      }
    },
    contentClick(e) {
      uni.navigateTo({
        url: `../content/content?id=${this.id}&show=${e}`,
      });
    },
  },
};
</script>
<style>
page {
  width: 100%;
  height: 100%;
  background-color: #f6f6f6;
}
</style>
<style scoped lang="scss">
.top {
  width: 100%;
  height: 422rpx;
  display: flex;
  justify-content: space-between;
  z-index: 2;
  background-repeat: no-repeat;
  // background-size: cover;
  overflow: hidden;
  filter: blur(3rpx);

  .top-left {
    width: 64rpx;
    height: 64rpx;
    background: #000000;
    border: 2rpx solid #eaeaea;
    opacity: 0.2;
    border-radius: 120rpx;
    margin-left: 40rpx;
    text-align: center;
    line-height: 64rpx;

    .iconfont {
      width: 16rpx;
      height: 30rpx;
      color: #ffffff;
    }
  }

  .top-center {
    height: 63rpx;
    line-height: 63rpx;
    font-size: 36rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.94);
  }

  .top-right {
    width: 130rpx;
    height: 50rpx;
  }
}
.tops {
  width: 100%;
  height: 36rpx;
  display: flex;
  justify-content: space-between;
  position: fixed;
  // top: 0;
  .tops-left {
    width: 64rpx;
    height: 64rpx;
    background: #000000;
    border: 2rpx solid #eaeaea;
    opacity: 0.2;
    border-radius: 120rpx;
    margin-left: 40rpx;
    text-align: center;
    line-height: 64rpx;

    .iconfont {
      width: 16rpx;
      height: 30rpx;
      color: #ffffff;
    }
  }

  .tops-center {
    height: 63rpx;
    line-height: 63rpx;
    font-size: 36rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(255, 255, 255, 0.94);
  }

  .tops-right {
    width: 130rpx;
    height: 50rpx;
  }
}

.user-Img {
  width: 670rpx;
  height: 84rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 190rpx;
  left: 36rpx;

  // background-color: red;
  .user-Img-left {
    height: 84rpx;
    display: flex;
    align-items: center;

    image {
      width: 84rpx;
      height: 84rpx;
      border-radius: 120rpx;
    }

    view {
      height: 50rpx;
      font-size: 36rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffffff;
      margin-left: 20rpx;
    }
  }

  .user-Img-right {
    width: 120rpx;
    height: 56rpx;
    text-align: center;
    line-height: 56rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #262626;
    background: #ffc91f;
    border-radius: 120rpx;
  }
  .user-Img-right2 {
    width: 120rpx;
    height: 56rpx;
    text-align: center;
    line-height: 56rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #262626;
    background: #ccc;
    border-radius: 120rpx;
  }
}

.myContent {
  width: 100%;
  height: 88rpx;
  display: flex;
  // align-items: center;
  justify-content: space-around;
  position: absolute;
  top: 300rpx;

  // left: 36rpx;
  .myContent-view {
    width: 96rpx;
    // height: 34rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .fabuNumber {
      height: 44rpx;
      font-size: 32rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: rgba(255, 255, 255, 0.94);
      text-align: center;
    }

    .fabuText {
      height: 34rpx;
      font-size: 24rpx;
      font-family: PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 0.94);
      text-align: center;
    }
  }
}

.myredate_type {
  width: 750rpx;
  height: 90rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .myredate_type_view {
    height: 48rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    view {
      height: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #ffcb34;
    }

    text {
      width: 50rpx;
      height: 6rpx;
      display: block;
      background: #ffcb34;
    }
  }

  .myredate_type_view2 {
    height: 48rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    view {
      height: 40rpx;
      font-size: 28rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #262626;
    }

    text {
      width: 50rpx;
      height: 6rpx;
      background: #fff;
      // display: block;
    }
  }
}
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
            font-size: 24rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #8c8c8c;
            margin-left: 20rpx;
          }
        }

        .center-bottom-view-bottom-kan {
          width: 88rpx;
          height: 40rpx;
          display: flex;
          justify-content: space-between;
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
          }
        }
      }
    }
  }
}
.question {
  width: 702rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  margin-left: 24rpx;

  .question_view {
    width: 120rpx;
    height: 56rpx;
    text-align: center;
    line-height: 56rpx;
    background: #e4e4e4;
    border-radius: 28rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #262626;
  }

  .question_view2 {
    width: 120rpx;
    height: 56rpx;
    text-align: center;
    line-height: 56rpx;
    border-radius: 28rpx;
    font-size: 26rpx;
    font-family: PingFang SC;
    font-weight: bold;
    color: #262626;
  }
}

.pj {
  width: 100%;
  // height: 300rpx;
  margin-top: 20rpx;
  background-color: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .pj_content {
    width: 702rpx;
    // height: 392rpx;
    border-bottom: 1rpx solid #f8f8f8;

    // background: #FFFFFF;
    .pj_conetnt_top {
      height: 36rpx;
      margin-top: 18rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;

      // margin-left: 24rpx;
      view {
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
        display: flex;

        text {
          font-size: 26rpx;
          font-family: PingFang SC;
          font-weight: 400;
          color: #262626;
          margin-left: 10rpx;
        }

        .rate {
          margin-left: 15rpx;
        }
      }
    }

    .text {
      // height: 36rpx;
      font-size: 26rpx;
      font-family: PingFang SC;
      font-weight: bold;
      color: #262626;
      margin-top: 18rpx;
    }

    .pj_conetnt_center {
      width: 702rpx;
      height: 232rpx;
      border-radius: 10rpx;
      margin-top: 18rpx;
      margin-bottom: 24rpx;
      background: #f2f2f2;
      display: flex;
      align-items: center;
      justify-content: space-around;

      image {
        width: 166rpx;
        height: 166rpx;
        border-radius: 10rpx;
        margin-left: 30rpx;
      }

      .pj_conetnt_center_view {
        height: 166rpx;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: space-between;

        .title {
          width: 432rpx;
          height: 132rpx;
          font-size: 30rpx;
          font-family: PingFang SC;
          font-weight: bold;
          color: #262626;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }

        .view_bottom {
          height: 36rpx;
          display: flex;

          view {
            height: 36rpx;
            font-size: 26rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #262626;
            font-weight: 600;
          }

          text {
            height: 36rpx;
            font-size: 26rpx;
            font-family: PingFang SC;
            font-weight: 400;
            color: #8c8c8c;

            &:nth-child(3) {
              margin-left: 15rpx;
              margin-right: 15rpx;
            }
          }
        }
      }
    }
  }
}
.chengkai {
  width: 100rpx;
  height: 100rpx;
}
</style>
