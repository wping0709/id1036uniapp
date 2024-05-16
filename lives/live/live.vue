<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <template v-if="pageData.pre_play_time">
      <!-- 当前为预播，展示封面图 -->
      <image class="bg-media" :src="pageData.pic_url" mode="aspectFill" />
      <!--预约 开播时间 -->
      <div class="reserve-box">
        <div>开播时间</div>
        <div>{{ pageData.pre_play_time }}</div>
      </div>
    </template>

    <!-- 回放 -->
    <template v-else-if="pageData.end_time">
     
      <video
        class="bg-media"
        :src="pageData.record[0]"
        :poster="pageData.pic_url"
        autoplay
        :show-progress="false"
        :show-fullscreen-btn="false"
        :show-play-btn="false"
        :title="pageData.desc"
        play-btn-position="center"
      ></video>



    
    </template>

    <!-- 直播中 -->
    <template v-else>
     <!-- #ifdef MP-WEIXIN --> 
      <live-player
        @statechange="statechange"
        class="bg-media"
        :src="pageData.Live_stream.rtmp"
        autoplay
        id="live-player"
      ></live-player>
     <!-- #endif-->

    
    <!-- <video
        class="bg-media"
        v-else
        :src="pageData.Live_stream.rtmp"
        autoplay
        :show-progress="false"
        :show-fullscreen-btn="false"
        :show-play-btn="false"
        :title="pageData.desc"
        play-btn-position="center"
      ></video> -->
     

     
    </template>

    <!-- 直播间聊天 -->
    <div v-if="!pageData.end_time" class="chat-box">
      <scroll-view
        :scroll-top="scrollTop"
        :scroll-into-view="
          commentList.length
            ? 'item' + commentList[commentList.length - 1].id
            : ''
        "
        scroll-y
        style="height: 100%"
      >
        <view class="comment-list">
          <div class="item flex color-999" style="background: initial">
            <text> 平台提醒：</text>
            <text>{{ pageData.tips }}</text>
          </div>

          <div
            :class="[item.type == 0 && 'type-0']"
            v-for="(item, index) in commentList"
            :key="index"
            class="item flex"
            :id="'item' + item.id"
          >
            <text :style="{ color: item.color }">
              <template v-if="item.type == 0">
                <template v-if="userInfo && item.user_id == pageData.anchor_user_id">
                  主播：
                </template>
                <template v-else>{{ item.nickname }}</template>
              </template>
              <template v-else-if="item.type == 3">提示：</template>
            </text>
            <text>{{ item.content }}</text>
          </div>
        </view>
      </scroll-view>
    </div>

    <!-- 头部信息 -->
    <view class="user-box">
      <u-navbar @leftClick="navTo('backTo')" bgColor="transparent">
        <view slot="center" class="head flex-y-center">
          <view class="live-info flex-y-center">
            <image :src="pageData.avatar_url" mode="" />
            <view class="flex-w-1">
              <view class="font-26 u-line-1">{{ pageData.name }}</view>
              <view class="flex" style="margin-top: 4rpx; color: #efefef">
                <text
                  v-if="
                    pageData.address != 'false' &&
                    pageData.address != 'null' &&
                    pageData.address
                  "
                  class="flex-w-1 u-line-1 m-l-10"
                  >{{ pageData.address || '' }}</text
                >
                <text>{{ pageData.look_num }}观看</text>
              </view>
            </view>
          </view>
          <view
            @click="clickGuanzhu"
            :class="pageData.is_follow && 'active'"
            class="guanzhu flex-y-center"
          >
            <text
              v-if="!pageData.is_follow"
              class="iconfont icon-guanzhu font-24"
            ></text>
            {{ pageData.is_follow ? '已关注' : '关注' }}
          </view>
        </view>
      </u-navbar>
    </view>

    <!-- 底部信息 -->
    <div class="dianzan-box">
      <view class="dianzan-content">
        <view class="input-box">
          <u-input
            v-if="!pageData.end_time"
            v-model="inputValue"
            @confirm="commentCofirm"
            shape="circle"
            placeholder="聊点什么把~"
            border="none"
          ></u-input>
        </view>
        <view class="bts">
          <view v-if="pageData.goods.length" @click="showDaihuo = true">
            <text v-if="pageData.goods.length > 0" class="cover">{{
              pageData.goods.length
            }}</text>

            <text class="iconfont icon-cart-full"></text>
          </view>
          <!-- 分享 -->
          <view @click="showShare = true">
            <text class="iconfont icon-zhuanfa"></text>
          </view>
          <!-- 點贊 -->
          <view @click="onAddZan">
            <text class="cover">{{ likeTotal }}</text>

            <text class="iconfont icon-dianzan"></text>
          </view>
        </view>
      </view>
    </div>

    <u-popup
      :show="showDaihuo"
      round="20rpx"
      @close="showDaihuo = false"
      mode="bottom"
    >
      <scroll-view scroll-y class="daihuo-popup">
        <view
          @click="
            navTo(
              '',
              '/pages/goods/goods?id=' + goods.id + '&live_room=' + pageData.id
            )
          "
          class="goods flex-x-sb"
          v-for="(goods, goodsIndex) in pageData.goods"
          :key="goodsIndex"
        >
          <view style="width: 220rpx; height: 220rpx">
            <image
              :src="goods.cover_pic"
              mode="aspectFill"
              style="width: 100%; height: 100%"
            />
            <div class="sort">{{ goodsIndex + 1 }}</div>
          </view>

          <view class="goods-content flex-col flex-x-sb">
            <view class="u-line-2">{{ goods.name }}</view>
            <view class="flex-x-sb flex-y-center">
              <div class="price-color font-32">￥{{ goods.price }}</div>
              <div class="msq-bt">马上抢</div>
            </view>
          </view>
        </view>
      </scroll-view>
    </u-popup>
    <Share :showPopup.sync="showShare" :data="room_id" type="lives"></Share>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import Share from '@/components/share/share';
import share from '@/mixins/share.js'
export default {
  components: {
    Share,
  },
  mixins: [share],
  data() {
    return {
      pageData: '',
      room_id: '',
      showDaihuo: false,
      showShare: false,
      likeCount: 0,
      commentList: [],
      commentTime: '',
      inputValue: '',
      scrollTop: 0,
    };
  },
  onLoad(params) {
    if(params.scene)  params = this.$utils.wxParams(params)
    this.room_id = params.room_id;

    this.loadData();
  },
  onShow() {
    uni.setKeepScreenOn({
      keepScreenOn: true,
    });
    if (!this.pageData.end_time) {
      this.getComment();
      this.commentTime = setInterval(() => {
        this.getComment();
      }, 4500);
    }
  },
  onHide() {
    uni.setKeepScreenOn({
      keepScreenOn: false,
    });
  },
  onUnload() {
    uni.setKeepScreenOn({
      keepScreenOn: false,
    });
  },
  methods: {
    // 评论
    async commentCofirm() {
      const res = await this.$requestAll.lives.addComment({
        room_id: this.pageData.id,
        content: this.inputValue,
      });
      this.inputValue = '';

      this.getComment();
    },
    statechange(erro) {
      if (erro.code == '2006') {
        uni.showModal({
          title: '提示',
          content: '直播已结束',
          showCancel: false,
          success: res => {
            this.$utils.backTo();
          },
        });
      }
    },
    async loadData() {
      const res = await this.$requestAll.lives.getLive({
        room_id: this.room_id,
        is_look: false,
      });
      this.pageData = res.data;
      if (!res.data.end_time) {
        this.getComment();
        this.commentTime = setInterval(() => {
          this.getComment();
        }, 4500);
      }
    },
    async getComment() {
      const res = await this.$requestAll.lives.getComment({
        last_id: this.commentList[this.commentList.length - 1]?.id,
        like_count: 0,
        room_id: this.room_id,
      });

      this.commentList.push(...res.data.list);

      /* #ifdef H5 */
      this.$nextTick(async () => {
        const dom = await this.$uGetRect('.comment-list');
        console.log(dom);
        dom && (this.scrollTop = dom.height);
      });

      /* #endif */
    },
    clickGuanzhu() {
      var formData = {
          anchor_id: this.pageData.anchor_id,
        },
        msgText = '关注成功';
      const callback = async () => {
        await this.$requestAll.lives.followStatus(formData, true);
        this.pageData.is_follow = formData.is_follow;
        uni.$u.toast(msgText);
      };

      if (this.pageData.is_follow) {
        formData.is_follow = 0;
        msgText = '取消关注';
        uni.showModal({
          title: '提示',
          content: '确定取消关注吗?',
          success: function (res) {
            if (res.confirm) {
              callback();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      } else {
        formData.is_follow = 1;
        msgText = '关注成功';
        callback();
      }
    },
    async navTo(type, url) {
      // 页面离开点赞发送
      await this.$requestAll.lives.getComment(
        {
          last_id: 0,
          like_count: this.likeCount,
          room_id: this.room_id,
        },
        true
      );
      if (type == 'backTo') {
        this.$utils.backTo();
      } else {
        this.$utils.toUrl(url);
      }
    },
    share() {
      uni.share({
        provider: 'weixin',
        type: 2,
        scene: 'WXSceneSession',
        title: this.pageData.desc,
        imageUrl: this.pageData.pic_url,
        miniProgram: '',
        complete: result => {
          console.log(result);
        },
      });
    },
    onAddZan() {
      this.likeCount++;
    },
  },

  onHide() {
    clearInterval(this.commentTime);
  },

  onUnload() {
    clearInterval(this.commentTime);
  },
  computed: {
    likeTotal() {
      let room_num = this.pageData.good_num ? this.pageData.good_num : 0;
      let count = room_num + this.likeCount;
      if (count > 10000) {
        return (count / 10000).toFixed(0) + 'w+';
      } else {
        return count;
      }
    },
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  position: relative;
  // background: #000;
  height: 100vh;
  overflow: hidden;

  .cover1,
  .cover2 {
    position: relative;
    width: 100vw;
    height: 100vh;
    z-index: 9;
    background: transparent;
  }
  .cover2 {
    z-index: 99;
  }

  .bg-media {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .chat-box {
    position: absolute;
    left: 20rpx;
    bottom: 100rpx;
    bottom: calc(env(safe-area-inset-bottom) + 100rpx);
    height: 30vh;
    width: 500rpx;

    // background: #fff;
    .item {
      margin-bottom: 20rpx;
      padding: 10rpx;
      border-radius: 10rpx;
      background: rgba(0, 0, 0, 0.4);
      color: rgba($color: #fff, $alpha: 0.8);
      font-size: 24rpx;

      > text:nth-child(1) {
        margin-right: 10rpx;
      }
    }

    .type-0 {
      background: linear-gradient(to right, #728e9b, #6a7e9a);
    }
  }

  .reserve-box {
    position: absolute;
    left: 50%;
    top: 20vh;
    transform: translateX(-50%);
    padding: 30rpx;
    text-align: center;
    line-height: 1.5;
    color: #fff;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 10rpx;
  }

  .user-box {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    color: #fff;

    .head {
      font-size: 22rpx;
      width: 100vw;
      padding: 0 200rpx 0 100rpx;

      .live-info {
        width: 240rpx;

        > image {
          margin-right: 10rpx;
          width: 64rpx;
          height: 64rpx;
          border-radius: 50%;
        }
      }

      .guanzhu {
        margin-left: 20rpx;
        padding: 0 14rpx;
        line-height: 46rpx;
        border-radius: 25rpx;
        background: linear-gradient(
          90deg,
          rgba(236, 30, 89, 1),
          rgba(250, 68, 84, 1)
        );
      }

      .active {
        background: #a0a0a0;
        color: #fff;
      }
    }

    /deep/.uicon-arrow-left {
      color: #fff !important;
    }
  }

  .dianzan-box {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    width: 100%;

    .dianzan-content {
      padding-left: 30rpx;
      padding-right: 30rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 100rpx;

      .input-box {
        /deep/.u-input {
          background: rgba(0, 0, 0, 0.6);
          color: #f5f5f5;
          .uni-input-input {
            color: #f5f5f5;
          }
        }

        input {
          color: #f2f2f2 !important;
        }
      }

      .bts {
        display: flex;
        align-items: center;

        > view {
          position: relative;

          .cover {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(50%, 0);
            border-radius: 20rpx;
            text-align: center;
            background: red;
            color: #fff;
            font-size: 20rpx;
            min-width: 30rpx;
            line-height: 30rpx;
          }

          .iconfont {
            margin-left: 30rpx;
            color: #fff;
            font-size: 50rpx;
          }
        }
      }
    }
  }
}

.daihuo-popup {
  height: 50vh;
  padding: 20rpx;
  box-sizing: border-box;

  .goods {
    padding: 20rpx 0;
    border-bottom: 2rpx solid #e5e5e5;

    &:nth-last-child(1) {
      padding-bottom: 0;
      border: 0;
    }

    > view:nth-child(1) {
      position: relative;

      .sort {
        position: absolute;
        left: 0;
        top: 0;
        background: rgba($color: #000000, $alpha: 0.6);
        padding: 0 14rpx;
        border-radius: 10rpx 0 10rpx 0;

        font-size: 20rpx;
        color: #fff;
      }
    }

    .goods-content {
      font-size: 28rpx;
      margin-left: 20rpx;
      width: 0;
      flex: 1;

      .msq-bt {
        padding: 2rpx 20rpx;
        border: 4rpx solid #999;
        border-radius: 28rpx;
      }
    }
  }
}
</style>
