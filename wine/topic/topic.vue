<template>
  <view>
    <view class="sousuo">
      <view class="sousuo-view">
        <span class="iconfont">&#xe7b4;</span>
        <input
          type="text"
          v-model="ipt"
          @confirm="confirmTap()"
          placeholder="请输入"
        />
      </view>
    </view>
    <view class="topic-list">
      <template v-if="list.length">
        <view
          class="topic-list-view"
          @click="xiangqing(item)"
          v-for="(item, index) of list"
          :key="index"
        >
          <image
            :src="item.pic_url"
            class="topic-list-view-img"
            mode="aspectFill"
          ></image>
          <view class="topic-list-view-content">
            <view class="topic-list-view-content-text">
              {{ item.name }}
            </view>
            <view class="topic-list-view-content-text2">
              价格 {{ item.price }}
            </view>
            <view class="topic-list-view-content-text3">
              库存 {{ item.goods_num }}
            </view>
          </view>
        </view>
      </template>
      <template v-if="lists.length">
        <view
          class="topic-list-view"
          @click="xiangqing(item)"
          v-for="(item, index) of lists"
          :key="index"
        >
          <image
            :src="item.pic_url"
            class="topic-list-view-img"
            mode="aspectFill"
          ></image>
          <view class="topic-list-view-content">
            <view class="topic-list-view-content-text">
              {{ item.topic_name }}
              <view class="yellowview">{{ item.tag }}</view>
            </view>
            <view class="topic-list-view-content-text2">
              {{ item.title }}
            </view>
            <view class="topic-list-view-content-text3">
              {{ item.dynamic_num }}条动态 · {{ item.browse_num }}次浏览
            </view>
          </view>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
import wine from '@/api/wine.js';
export default {
  data() {
    return {
      show: null,
      // 酒评页数
      winePage: 1,
      // 话题页数
      topicPage: 1,
      ipt: '',
      // 酒评数组
      list: [],
      // 话题数组
      lists: [],
    };
  },
  onLoad(e) {
    // 0 为酒评  1 为话题  2 为全部话题的跳转
    console.log(e);
    this.show = e.id;
    if (this.show == 0) {
      this.list = [];
      this.wineSuo(this.ipt);
      uni.setNavigationBarTitle({
        title: '搜索酒品', //这是修改后的导航栏文字
      });
    } else if (this.show == 1) {
      this.lists = [];
      this.topic(this.ipt);
      uni.setNavigationBarTitle({
        title: '搜索话题', //这是修改后的导航栏文字
      });
    } else if (this.show == 2) {
      this.lists = [];
      this.topic(this.ipt);
      uni.setNavigationBarTitle({
        title: '请搜索', //这是修改后的导航栏文字
      });
    }
  },
  onReachBottom() {
    if (this.show == 0) {
      this.winePage = this.winePage + 1;
      this.wineSuo(this.ipt);
    } else if (this.show == 1) {
      this.topicPage = this.topicPage + 1;
      this.topic(this.ipt);
    } else {
      this.topicPage = this.topicPage + 1;
      this.topic(this.ipt);
    }
  },
  methods: {
    confirmTap() {
      if (this.show == 0) {
        this.wineSuo(this.ipt);
      } else if (this.show == 1) {
        this.topic(this.ipt);
      } else {
        this.topic(this.ipt);
      }
    },
    xiangqing(e) {
      if (this.show == 0) {
        uni.setStorageSync('wine_goods', e);
        uni.navigateBack({
          delta: -1,
        });
      } else if (this.show == 1) {
        uni.setStorageSync('topic', e);
        uni.navigateBack({
          delta: -1,
        });
      } else if (this.show == 2) {
        uni.navigateTo({
          url: '../topicContent/topicContent?id=' + e.id,
        });
      }
    },
    // 酒评搜索
    async wineSuo(e) {
      let data = {
        page: this.winePage,
        keyword: e,
      };
      const res = await wine.defaultSearch(data, true);
      if (!res.data.list.length) {
        uni.$u.toast('暂无更多信息')
      } else {
        this.list.push(...res.data.list);
      }
    },
    // 话题搜索
    async topic(e) {
      console.log(e);
      let data = {
        page: this.topicPage,
        topic_name: e,
      };
      const res = await wine.getTopicList(data, true);
      if (!res.data.length) {
        uni.$u.toast('暂无更多信息')
      } else {
        this.lists.push(...res.data)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.sousuo {
  width: 750rpx;
  height: 84rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  .sousuo-view {
    width: 690rpx;
    height: 64rpx;
    background: #f2f2f2;
    border-radius: 60rpx;
    display: flex;
    align-items: center;

    .iconfont {
      color: #9b9b9b;
      margin-left: 24rpx;
    }

    input {
      width: 632rpx;
      height: 36rpx;
      color: #9b9b9b;
      margin-left: 10rpx;
    }
  }
}

.topic-list {
  width: 750rpx;

  .topic-list-view {
    width: 702rpx;
    height: 232rpx;
    display: flex;
    align-items: center;
    border-bottom: 1rpx solid #f8f8f8;
    margin-left: 24rpx;

    .topic-list-view-img {
      width: 166rpx;
      height: 166rpx;
      border-radius: 10rpx;
    }

    .topic-list-view-content {
      width: 498rpx;
      height: 166rpx;
      margin-left: 20rpx;

      .topic-list-view-content-text {
        height: 82rpx;
        font-size: 30rpx;
        font-family: PingFang SC;
        font-weight: bold;
        color: #262626;
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        .redview {
          padding-left: 5rpx;
          padding-right: 5rpx;
          height: 30rpx;
          background: #e84f3b;
          border-radius: 6rpx;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 30rpx;
          text-align: center;
          color: #fafafa;
          margin-left: 20rpx;
        }

        .yellowview {
          max-width: 125rpx;
          padding-left: 5rpx;
          padding-right: 5rpx;
          height: 30rpx;
          background: #ffcb34;
          border-radius: 6rpx;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 30rpx;
          text-align: center;
          color: #fafafa;
          // margin-left: 20rpx;
        }

        .blueview {
          width: 114rpx;
          height: 30rpx;
          background: #0798e9;
          border-radius: 6rpx;
          font-size: 20rpx;
          font-family: PingFang SC;
          font-weight: 500;
          line-height: 30rpx;
          text-align: center;
          color: #fafafa;
          margin-left: 20rpx;
        }
      }

      .topic-list-view-content-text2 {
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
        overflow: hidden;
        white-space: nowrap;
        /*限制不换行*/
        text-overflow: ellipsis;
        margin-top: 12rpx;
      }

      .topic-list-view-content-text3 {
        height: 36rpx;
        font-size: 26rpx;
        font-family: PingFang SC;
        font-weight: 400;
        color: #8c8c8c;
        margin-top: 20rpx;
      }
    }
  }
}
</style>
