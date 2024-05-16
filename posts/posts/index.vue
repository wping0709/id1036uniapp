<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <div class="search">
      <div @click="$utils.toUrl('/posts/search/index')" class="search-input m-r-24 color-666">
        <div class="iconfont icon-search m-r-4 font-600-36"></div>
        <text class="font-26">请输入帖子名称</text>
      </div>
      <div @click="$utils.toUrl('/posts/my/index')" class="flex-col flex-y-center">
        <div class="iconfont icon-suggest font-44" style="width:40rpx;height:40rpx;line-height:40rpx;"></div>
        <text class="font-18">我的帖子</text>
      </div>
    </div>
    <view class="head">
      <image :src="pageData.bg_image" mode="aspectFill" />
      <view class="head-swiper-box">
        <swiper
          class="swiper"
          :circular="true"
          :indicator-dots="false"
          :autoplay="true"
        >
          <swiper-item
            v-for="(item, index) in pageData.banner_list"
            :key="index"
          >
            <view class="swiper-item uni-bg-red">
              <image :src="item.pic_url" mode="aspectFill" />
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>

    <div class="content">
      <scroll-view scroll-x class="tabs">
        <view class="tabs">
          <div
            @click="switchTab(index)"
            :class="['tab', tabIndex == index && 'check-tab']"
            v-for="(item, index) in pageData.cart_list"
            :key="index"
          >
            {{ item.name }}
          </div>
        </view>
      </scroll-view>

      <PostsList
        ref="PostsList"
        @clickComment="clickComment"
        :list.sync="list"
      ></PostsList>
      <u-loadmore :status="status"></u-loadmore>
    </div>

    <TabBar></TabBar>

    <div @click="onQufatie" class="fatie-bt">去发帖</div>

    <u-popup
      :show="showPopup"
      round="20rpx"
      :safeAreaInsetBottom="false"
      @close="showPopup = false"
      mode="center"
    >
      <div class="popup-box">
        <view class="popup-title font-600-30 font-center m-b-20">选择分类</view>
        <scroll-view scroll-y style="max-height: 50vh">
          <view class="popup-content flex flex-wrap">
            <view
              v-for="(item, i) in pageData.cart_add_list"
              :key="i"
              @click="onRelease(item)"
              class="flex-col flex-x-center flex-y-center"
            >
              <image :src="item.image_url" mode="aspectFill" />
              <text>{{ item.name }}</text>
            </view>
          </view>
        </scroll-view>
      </div>
    </u-popup>

    <CommentList
      :show="showComment"
      :postsId="postsId"
      :close.sync="showComment"
    ></CommentList>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import PostsList from './components/PostsList';
import CommentList from './components/CommentList';
import TabBar from '@/components/TabBar';
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  components: {
    PostsList,
    CommentList,
    TabBar,
  },
  data() {
    return {
      pageData: '',
      page: 0,
      status: 'loadmore',
      list: [],
      tabIndex: 0,
      cart_id: 0,
      showPopup: false,
      showComment: false,
      postsId: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData(fn) {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.posts.postsList(
        {
          page: this.page,
          cart_id: this.cart_id,
        },
        true
      );
      this.pageData = res.data;
      this.list.push(...res.data.posts_list);
      this.page++;
      this.status = res.data.posts_list.length < 10 ? 'nomore' : 'loadmore';
      fn && fn();
    },
    switchTab(index) {
      this.tabIndex = index;
      this.cart_id = this.pageData.cart_list[this.tabIndex].id;
      this.resetPageData();
      this.loadData();
    },
    resetPageData() {
      const { list, page, status } = this.$options.data();
      this.list = list;
      this.page = page;
      this.status = status;
    },
    onQufatie() {
      this.showPopup = true;
    },
    clickComment(item) {
      console.log(item);
      this.postsId = item.id;
      this.showComment = true;
    },
    onRelease(item) {
      this.$utils.toUrl('/posts/posts-add/index?id=' + item.id);
      this.showPopup = false;
    },
  },
  onShow() {
    // this.resetPageData();
    // this.loadData();
  },
  computed: {
    shareData() {
      let SHOP_CONFIG = this.$store.getters['SHOP_CONFIG'] 
      // 动态设置导航栏标题
			if (SHOP_CONFIG.wx_bar_title?.length) {
				let page = uni.$u.page()
				page = page.slice(1, page.length)
				let wx_bar_title = SHOP_CONFIG.wx_bar_title
				let item = wx_bar_title.find(item => item.url == page)
        return {
          title: item ? item.title: ''
        }
			}
      return { };
    },
  },
  watch: {},
  onReachBottom() {
    this.loadData();
  },
  async onPullDownRefresh() {
    await this.resetPageData();
    this.loadData(() => {
      uni.stopPullDownRefresh();
    });
  },
  onPageScroll(e) {
    this.$u.throttle(this.$refs['PostsList'].pageScroll(e));
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  /deep/.u-input {
    padding: 6rpx 20rpx !important;
    background: #f5f5f5;
  }
  .search {
    position: sticky;
    top: 0;
    height: 100rpx;
    z-index: 9999;

    padding: 10rpx 24rpx;
    display: flex;
    align-items: center;
    background: #fff;
    .search-input {
      flex: 1;
      width: 0;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      line-height: 64rpx;
      border-radius: 32rpx;
      padding: 0 24rpx;

    }
  }

  .head {
    position: relative;

    > image {
      width: 100%;
      height: 400rpx;
    }

    .head-swiper-box {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 280rpx;
      padding: 0 20rpx;

      .swiper {
        border-radius: 10rpx;
        overflow: hidden;
        width: 100%;
        height: 100%;

        .swiper-item {
          width: 100%;
          height: 100%;

          > image {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  > .content {
    .tabs {
      position: sticky;
      top: 100rpx;
      z-index: 9999;
      background: #fff;
      // display: flex;
      // align-items: center;
      font-weight: 600;
      white-space: nowrap;

      > .tab {
        display: inline-block;
        padding: 0 20rpx;
        text-align: center;
        line-height: 80rpx;
        max-width: 300rpx;
      }

      .check-tab {
        position: relative;
        left: 0;
        top: 0;

        &::before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 10rpx;
          transform: translate(-50%, 0);
          width: 58rpx;
          border-bottom: 6rpx solid red;
          border-radius: 3rpx;
        }
      }
    }
  }

  .fatie-bt {
    position: fixed;
    bottom: 130rpx;
    bottom: calc(130rpx + env(safe-area-inset-bottom));
    left: 50%;
    width: 200rpx;
    height: 60rpx;
    z-index: 99;
    transform: translateX(-50%);
    border-radius: 30rpx;
    background: #ff4544;

    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 30rpx;
  }

  .popup-box {
    width: 90vw;
    padding: 40rpx 20rpx;

    .popup-content {
      > view {
        min-width: 25%;
        > image {
          width: 100rpx;
          height: 100rpx;
        }

        > text {
          margin-top: 10rpx;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
