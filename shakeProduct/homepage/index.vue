<template>
  <scroll-view
    :refresher-enabled="true"
    :refresher-triggered="pullStatus"
    @refresherpulling="onPull"
    @scrolltolower="loadData"
    @scroll="scroll"
    scroll-y
    class="my"
  >
    <view
      id="user-head"
      class="user-head"
      :style="{
        background: 'url(' + userInfo.list.avatar_url + ') no-repeat center',
        backgroundSize: '100%',
      }"
    >
      <view class="user-info flex-y-center">
        <image :src="userInfo.list.avatar_url" mode="aspectFill" />
        <view>
          <view class="font-32">{{ userInfo.list.nickname }}</view>
          <view class="font-24 p-t-10">个人账号：{{ userInfo.list.id }}</view>
        </view>
      </view>

      <view class="qita-num flex-y-center">
        <view
          @click="
            $utils.toUrl(
              '/shakeProduct/pal/index?active=0&user_id=' + userInfo.list.id
            )
          "
        >
          <view>{{ userInfo.list.focus_num }}</view>
          <view>关注</view>
        </view>
        <view
          @click="$utils.toUrl('/shakeProduct/pal/index?active=1&user_id=' + userInfo.list.id)"
        >
          <view>{{ userInfo.list.fans_num }}</view>
          <view>粉丝</view>
        </view>
        <view @click="showHuoZanPopup = true">
          <view>{{ userInfo.list.like_num }}</view>
          <view>获赞</view>
        </view>
      </view>
    </view>


    <view class="">
      <UWaterfall ref="waterfall" v-model="pageData.list" :showDel="status">
        <template v-slot:left="{ leftList, showDel }">
          <div class="item" v-for="(item, i) in leftList" :key="i">
            <view @click="onDelItem(item.id)" class="item-del" v-if="showDel"
              >删除</view
            >
            <div @click="navTo(item)" class="top-img">
              <image
                v-if="item.cover_pic"
                :src="item.cover_pic"
                mode="widthFix"
              />
              <video
                v-else
                :controls="false"
                :show-center-play-btn="false"
                :src="item.video_url"
              ></video>
              <div
                v-if="item.video_url"
                class="video-img flex-y-center flex-x-center"
              >
                <text class="iconfont icon-sanjiao-right font-50"></text>
              </div>
            </div>
            <div class="p-t-10 u-line-2">{{ item.content }}</div>
            <div class="flex-x-sb flex-y-center color-999 p-y-10">
              <view class="flex-y-center" style="max-width: 240rpx">
                <image
                  :src="item.user_info.avatar_url"
                  style="width: 50rpx; height: 50rpx; border-radius: 10rpx"
                  mode="aspectFill"
                />
                <text
                  style="width: initial"
                  class="flex-w-1 u-line-1 font-22 m-l-10"
                  >{{ item.user_info.nickname }}</text
                >
              </view>
              <view class="flex-w-1 flex-y-center flex-x-end">
                <text
                  :style="{ color: item.is_like && 'red' }"
                  class="iconfont icon-dianzan font-30"
                ></text>
                <text style="width: initial" class="u-line-1">{{
                  item.good_num
                }}</text>
              </view>
            </div>
          </div>
        </template>

        <template v-slot:right="{ rightList, showDel }">
          <div class="item" v-for="(item, i) in rightList" :key="i">
            <view @click="onDelItem(item.id)" class="item-del" v-if="showDel"
              >删除</view
            >

            <div @click="navTo(item)" class="top-img">
              <image
                v-if="item.cover_pic"
                :src="item.cover_pic"
                mode="widthFix"
              />
              <video
                v-else
                :controls="false"
                :show-center-play-btn="false"
                :src="item.video_url"
              ></video>
              <div
                v-if="item.video_url"
                class="video-img flex-y-center flex-x-center"
              >
                <text class="iconfont icon-sanjiao-right font-50"></text>
              </div>
            </div>
            <div class="p-t-10 u-line-2">{{ item.content }}</div>
            <div class="flex-x-sb flex-y-center color-999 p-y-10">
              <view class="flex-y-center" style="max-width: 240rpx">
                <image
                  :src="item.user_info.avatar_url"
                  style="width: 50rpx; height: 50rpx; border-radius: 10rpx"
                  mode="aspectFill"
                />
                <text
                  style="width: initial"
                  class="flex-w-1 u-line-1 font-22 m-l-10"
                  >{{ item.user_info.nickname }}</text
                >
              </view>
              <view class="flex-w-1 flex-y-center flex-x-end">
                <text
                  :style="{ color: item.is_like && 'red' }"
                  class="iconfont icon-dianzan font-30"
                ></text>
                <text style="width: initial" class="u-line-1">{{
                  item.good_num
                }}</text>
              </view>
            </div>
          </div>
        </template>
      </UWaterfall>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </view>

    <u-popup
      @close="showHuoZanPopup = false"
      :show="showHuoZanPopup"
      :safeAreaInsetBottom="false"
      mode="center"
      bgColor="transparent"
    >
      <div class="popup-box bg-fff font-center">
        <view class="font-600-34">获赞与发布</view>
        <view class="p-y-10 flex-y-center flex-x-center">
          <text class="iconfont icon-dianzan" style="color: #ff7f50"></text>
          <text>我的获赞：</text>
          <text style="color: #ff7f50">{{ userInfo.list.like_num }}</text>
        </view>
        <view class="p-y-10 flex-y-center flex-x-center">
          <text class="iconfont icon-fabu" style="color: #ff7f50"></text>
          <text>我的发布：</text>
          <text style="color: #ff7f50">{{ userInfo.list.vgoods_num }}</text>
        </view>
      </div>
    </u-popup>
  </scroll-view>
</template>

<script>
import UWaterfall from '@/shakeProduct/components/u-waterfall/index';
export default {
  components: {
    UWaterfall,
  },
  data() {
    return {
      user_id: '',
      userInfo: '', //用户信息
      status: 0, //tabs索引
      isFixed: false, //tabs定位开关
      showHuoZanPopup: false, //获赞弹框开关
      pullStatus: false, //下拉刷新开关
      pageData: {
        list: [],
        page: 0,
        status: 'loadmore',
      },
    };
  },
  onLoad(params) {
    this.user_id = params.user_id;
    this.getUserInfo();
    this.loadData();
  },
  methods: {
    async getUserInfo() {
      const res = await this.$requestAll.vgoods.userInfo(
        {
          from: 1,
          user_id: this.user_id,
        },
        true
      );
      this.userInfo = res.data;
      uni.setNavigationBarTitle({ title: res.data.list.nickname + '的主页' });
    },
    async scroll(e) {
      let rectInfo = await this.$uGetRect('#user-head');
      this.isFixed = e.target.scrollTop >= rectInfo.height;
    },
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.vgoods.list({
        page: this.pageData.page,
        cart_id: 0,
        from: 2,
        type: 'add',
        user_id: this.user_id,
      });
      this.pageData.list.push(...res.data.vgoods_list);
      this.pageData.page++;
      this.pageData.status =
        res.data.count <= this.pageData.list.length ? 'nomore' : 'loadmore';
    },
    clickTab({ index }) {
      this.status = index;
      this.pageData = this.$options.data().pageData;
      this.$refs['waterfall'].clear();
      this.loadData();
    },
    // 跳转
    navTo(item) {
      if (item.video_url) {
        // 跳转视频列表
        this.$utils.toUrl('/vgoods/edit/index?pageType=1&id=' + item.id);
      } else {
        this.$utils.toUrl(
          '/shakeProduct/user_info/index' +
            uni.$u.requeryParams({ id: item.id, cart_id: 3 })
        );
      }
    },
    async onDelItem(id) {
      var that = this;
      uni.showModal({
        title: '提示',
        content: '确定删除该条作品',
        success: async function (res) {
          if (res.confirm) {
            await that.$requestAll.vgoods.delVgoods({
              vgoods_id: id,
            });
            that.$refs['waterfall'].remove(id);
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    // 下拉刷新
    onPull() {
      if (this.pullStatus) return;
      this.pullStatus = true;

      this.getUserInfo().then(() => {
        this.pageData = this.$options.data().pageData;
        this.$refs['waterfall'].clear();
        this.loadData().then(() => {
          this.pullStatus = false;
        });
      });
    },
  },
  computed: {
    tabsStyle() {
      return `top: calc(${44}px + ${this.systemInfo.statusBarHeight}px)`;
    },
  },
};
</script>

<style lang="scss" scoped>
.my {
  position: relative;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
.user-head {
  color: #fff;
  height: 430rpx;
  .user-info {
    padding: 100rpx 30rpx;
    > image {
      margin-right: 20rpx;
      width: 120rpx;
      height: 120rpx;
      border-radius: 50%;
    }
  }

  .qita-num {
    padding: 0 20rpx;
    > view {
      padding: 0 30rpx;
      text-align: center;
    }
  }
}

.my-tabs {
  height: 44px;
  > view {
    padding: 0 100rpx;
    background: #fff;
    z-index: 999;
  }
  .fixed {
    position: fixed;
    left: 0;
    right: 0;
  }
}

.item {
  position: relative;
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  .top-img {
    position: relative;
    image {
      border-radius: 10rpx;
      background: #eee;
      width: 340rpx;
      max-height: 700rpx;
    }
    video {
      width: 340rpx;
      max-height: 700rpx;
      background: #000;
      border-radius: 10rpx;
    }
    .video-img {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      color: #f5f5f5;
    }
  }
  .item-del {
    position: absolute;
    left: 10rpx;
    top: 10rpx;
    z-index: 999;

    border-radius: 10rpx;
    padding: 4rpx 10rpx;
    background: #ff7f50;
    color: #fff;
    font-size: 20rpx;
  }
}
.popup-box {
  width: 80vw;
  padding: 30rpx;
  border-radius: 10px;
  overflow: hidden;
}
</style>
