<template>
  <view class="body">
    <div class="head">
      <image :src="wxapp_img.weitao.head_back" mode="aspectFill" />
      <div class="content">
        <!-- 用户信息 -->
        <div class="user-info">
          <view class="flex-x-sb flex-y-center">
            <div class="left">
              <image :src="user.head" mode="aspectFill" />
              <view class="flex-w-1">
                <view class="font-40 u-line-2">{{ user.nickname }}</view>
                <view class="type-bt">{{
                  user.mch_id > -1 ? '商家' : '达人'
                }}</view>
              </view>
            </div>
            <div
              @click="$utils.toUrl('/weitao/personal/personal')"
              v-if="isMy"
              class="right"
            >
              编辑资料
            </div>
            <div v-else class="right flex-y-center">
              <view
                @click="
                  $utils.toUrl(
                    '/weitao/private_chat/private_chat?chat_user=' + user_id
                  )
                "
                class="right-bt"
                >私信</view
              >
              <view
                v-if="user.is_user_liked == 0"
                class="right-bt"
                @click="onGuanzhu"
                >关注</view
              >
            </div>
          </view>
          <view class="m-t-20 u-line-1" v-if="Boolean(user.desc)">
            {{ user.desc }}
          </view>
        </div>

        <!-- 点赞信息 -->
        <div class="total-box font-center flex-x-sa flex-y-center">
          <view>
            <view class="font-600-40 u-line-1">{{ user.like_count }}</view>
            <view>获赞</view>
          </view>
          <view
            @click="isMy && $utils.toUrl('/weitao/fans/fans?is_focus=1')"
          >
            <view class="font-600-40 u-line-1">{{ user.focus_count }}</view>
            <view>关注</view>
          </view>
          <view @click="isMy && $utils.toUrl('/weitao/fans/fans')">
            <view class="font-600-40 u-line-1">{{ user.fans_count }}</view>
            <view>粉丝</view>
          </view>
        </div>
      </div>
    </div>

    <div class="page-content">
      <div
        v-if="user.mch_id > 0"
        @click="$utils.toUrl('/mch/shop/shop?mch_id=' + user.mch_id)"
        class="shop-info p-x-30 flex-x-sb flex-y-center"
      >
        <view class="flex-y-center">
          <image :src="wxapp_img.weitao.goods_img" mode="aspectFill" />
          <view class="font-600-30">Wo的店铺</view>
        </view>
        <view class="color-999 flex-y-center">
          <text>逛逛Wo的店铺</text>
          <text class="iconfont icon-arrow-right m-l-20"></text>
        </view>
      </div>

      <div class="list-title font-30 color-999 p-b-20 p-x-30">{{isMy ? 'Wo': 'Ta'}}发布的内容</div>
      <div v-if="list.length" class="list p-x-30">
        <div
          @click="$utils.toUrl('/weitao/details/details?article_id=' + item.id)"
          class="item"
          v-for="(item, i) in list"
          :key="i"
        >
          <!-- {{item.content}} -->
          <div class="user-info flex-y-center">
            <image :src="item.from_user_head" mode="aspectFill" />
            <view class="m-l-20 flex-w-1">
              <view class="flex-x-sb">
                <view class="font-30">{{ item.from_user_name }}</view>
                <view v-if="isMy" class="flex-y-center">
                  <view class="font-26">
                    <template v-if="item.is_audit == 0">待审核</template>
                    <template v-else-if="item.is_audit == 2">审核拒绝</template>
                  </view>
                  <view
                    @click.stop="onDel(item, i)"
                    class="m-l-20 font-26 del-bt flex-y-center"
                  >
                    <text>删除</text>
                    <text class="iconfont icon-ashbin1"></text>
                  </view>
                </view>
              </view>
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

          <div class="content">
            <div class="content-text">
              <!-- 判断类别标签 -->
              <span v-if="item.is_hot != 1" class="mark mark_2">话题</span>
              <span v-if="item.is_hot == 1" class="mark">推荐</span>
              {{ item.content }}
            </div>

            <!-- 图片组 -->
            <template v-if="item.image_content && item.image_content.length && item.is_vedio != 1">
              <u-album :urls="item.image_content" multipleSize="29vw"></u-album>
            </template>

            <template v-if="item.is_vedio == 1 && item.video_url">
              <video @click.stop :src="item.video_url"></video>
            </template>
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

          <div class="btns flex-x-end flex-y-center">
            <button @click.stop open-type="share" class="button-initial">
              <text class="iconfont icon-zhuanfa"></text>
              <text>分享</text>
            </button>

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
        <u-loadmore status="nomore"></u-loadmore>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      >
      </u-empty>
    </div>
  </view>
</template>
<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  data() {
    return {
      pageData: '',
      user_id: '',
      user: '',
      list: [],
    };
  },
  onLoad(params) {
    this.user_id = params.user_id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.weitao.userCenter(
        {
          user_id: this.user_id || 0,
        },
        true
      );
      this.user = res.data.user;
      this.list = res.data.list;
    },
    // 点赞
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

      this.$set(this.list, i, newItem);
      this.$u.toast(res.msg);
    },
    async onDel(item, i) {
      uni.showModal({
        title: '提示',
        content: '是否删除',
        success: async res => {
          if (res.confirm) {
            console.log('用户点击确定');
            await this.$requestAll.weitao.deleteArticle({
              article_id: item.id,
            });
            uni.$u.toast('删除成功');
            this.list.splice(i, 1);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 关注
    async onGuanzhu() {
      const res = await this.$requestAll.weitao.focusUser(
        {
          user_id: this.user_id,
          is_user_liked: 1,
        },
        true
      );
      uni.$u.toast(res.msg || '关注成功');
      this.user.is_user_liked = 1;
    },
  },
  computed: {
    isMy() {
      
      const userInfo = this.$store.getters['user/userInfo']
      if(this.user_id == userInfo.id || !this.user_id) return true
      return false
    },
	shareData() {
	  return {
	    path:
	      '/weitao/my_conter/my_conter' +
	      uni.$u.queryParams({
	        user_id: this.user_id,
	        // #ifdef APP-PLUS
	        _platform: 'app',
	        // #endif
	      }),
	  };
	},
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  min-height: 100vh;
}

.head {
  position: relative;
  > image {
    width: 100vw;
    height: 400rpx;
  }
  .content {
    color: #fff;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    .user-info {
      margin: 60rpx 30rpx 30rpx;

      .left {
        flex: 1;
        width: 0;
        display: flex;

        > image {
          margin-right: 20rpx;
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }

        .type-bt {
          display: inline-block;
          padding: 0 10rpx;
          border-radius: 30rpx;
          background: #ffb434;
          color: #fff;
          margin-top: 10rpx;
          font-size: 20rpx;
        }
      }
      .right {
        .right-bt {
          margin-left: 20rpx;
          width: 100rpx;
          line-height: 50rpx;
          border-radius: 30rpx;
          border: 1px solid #fff;
          color: #fff;
          text-align: center;
        }
      }
    }
    .total-box {
      > view {
        flex: 1;
        width: 0;
        padding: 0 20rpx;
      }
    }
  }
}

.page-content {
  position: relative;
  z-index: 2;
  border-radius: 30rpx;
  margin-top: -30rpx;
  padding: 30rpx 0;
  background: #fff;
  .shop-info {
    border-bottom: 20rpx solid #f5f5f5;
    padding-bottom: 20rpx;
    > view:nth-child(1) {
      > image {
        width: 50rpx;
        height: 50rpx;
        margin-right: 20rpx;
      }
    }
  }

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
      .del-bt {
        padding: 0 20rpx;
        border: 1px solid #999;
        border-radius: 30rpx;
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
</style>
