<template>
  <view v-if="!store.is_shenhe" class="body">
    <view class="top">
      <div class="fixed">
        <view class="tabs">
          <view
            @click="switchTab('follow')"
            :class="['tab', tabIndex == 'follow' && 'selectTab']"
            >关注</view
          >
          <view
            @click="switchTab('choice')"
            :class="['tab', tabIndex == 'choice' && 'selectTab']"
            >精选</view
          >
          <view
            @click="switchTab(item.id)"
            v-for="item in catList"
            :key="item.id"
            :class="['tab', tabIndex == item.id && 'selectTab']"
            >{{ item.name }}</view
          >
        </view>
      </div>

      <view
        v-if="liveData.choice_list.length"
        class="swiper"
        style="margin-top: -10rpx"
      >
        <swiper
          style="width: 100%; height: 440rpx"
          @change="changeSwiper"
          next-margin="306rpx"
          circular
        >
          <swiper-item
            class="swiperItem flex-y-center flex-x-center"
            v-for="(item, index) in liveData.choice_list"
            :key="index"
            @click="$utils.toUrl('/lives/live/live?room_id=' + item.id)"
          >
            <view :class="[swiperIndex == index && 'active']" class="img-box">
              <image :src="item.pic_url" mode="aspectFill" />
              <view class="content-info">
                <view class="top flex-y-center">
                  <view>回放</view>
                  <view>{{ item.look_num }}</view>
                </view>
                <view class="bottom">
                  <view class="flex-y-center">
                    <image :src="item.avatar_url" mode="aspectFill" />
                    <text class="m-l-10">{{ item.user_nickname }}</text>
                  </view>

                  <view>
                    {{ item.desc }}
                  </view>
                </view>
              </view>
            </view>
          </swiper-item>
        </swiper>

        <view class="dian-box flex-y-center flex-x-center">
          <view
            class="dian"
            :class="swiperIndex == index && 'dian-active'"
            v-for="(item, index) in liveData.choice_list"
            :key="item.id"
          ></view>
        </view>
      </view>

      <view v-if="tabIndex != 'follow'" class="zhibo-list">
        <LiveList :liveList="liveData.list"></LiveList>
        <u-loadmore :status="liveData.status"></u-loadmore>
      </view>
      <template v-else>
        <view class="zhibo-list user-list">
          <div
            v-for="(item, index) in liveData.list"
            @click="
              $utils.toUrl('/lives/anchor/anchor?anchor_id=' + item.anchor_id)
            "
            :key="index"
            class="user-item"
          >
            <view class="left-img-box">
              <image :src="item.live.pic_url" mode="aspectFill" />
              <view class="top flex-y-center">
                <view v-if="item.live.end_time"> 回放 </view>
                <view
                  style="background: #7a94fe"
                  v-else-if="item.live.pre_play_time"
                >
                  预约
                </view>
                <view  style="background: #ff5174" v-else>直播中</view>

                <view>{{ item.live.look_num }}</view>
              </view>
            </view>
            <div class="bottom-content flex-y-center">
              <image :src="item.avatar_url" mode="aspectFill" />
              <text class="flex-w-1 u-line-1">{{ item.user_nickname }}</text>
            </div>
          </div>
        </view>
        <view class="bg-fff">
          <u-loadmore :status="liveData.status"></u-loadmore>
        </view>
      </template>
    </view>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import LiveList from '../components/LiveList.vue';
export default {
  components: {
    LiveList,
  },
  data() {
    return {
      catList: '',
      liveData: {
        page: 1,
        list: [],
        choice_list: [],
        status: 'loadmore',
      },
      tabIndex: 'choice',
      swiperIndex: 0,
    };
  },
  onLoad() {
    this.getCatList();
    this.getLiveList();
  },
  methods: {
    async getCatList() {
      const res = await this.$requestAll.lives.getLiveCat({}, true);
      this.catList = res.data.list;
    },
    async getLiveList() {
      if (this.liveData.status == 'nomore') return;
      const res = await this.$requestAll.lives.getLiveList(
        {
          cat_id: this.tabIndex,
          page: this.liveData.page,
        },
        true
      );
      if (!this.liveData.choice_list.length) {
        this.liveData.choice_list = res.data.choice_list;
      }
      this.liveData.list.push(...res.data.list);
      this.liveData.page++;
      this.liveData.status = res.data.list.length < 5 ? 'nomore' : 'loadmore';
    },

    changeSwiper(v) {
      this.swiperIndex = v.detail.current;
    },
    switchTab(i) {
      this.tabIndex = i;
      this.liveData = this.$options.data().liveData;
      this.getLiveList();
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {
    this.getLiveList();
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;

  > .top {
    background: #ff2851;

    .fixed {
      height: 90rpx;
      .tabs {
        position: fixed;
        top: 0;
        z-index: 999;
        width: 100%;
        height: 90rpx;
        background: #ff2851;
        white-space: nowrap;
        overflow-x: auto;
        // display: flex;

        .tab {
          display: inline-block;
          padding: 0 20rpx;
          line-height: 100rpx;
          font-size: 30rpx;
          color: #fff;
          opacity: 0.5;
        }

        .selectTab {
          position: relative;
          font-weight: 600;
          font-size: 32rpx;
          opacity: 1;
          &::before {
            content: '';
            position: absolute;
            bottom: 14rpx;
            left: 50%;
            width: 50rpx;
            height: 6rpx;
            border-radius: 3rpx;
            background: #fff;
            transform: translate(-50%, 0);
          }
        }
      }
    }
  }
  .swiper {
    .img-box {
      position: relative;
      left: 0;
      top: 0;
      z-index: 1;
      height: 370rpx;
      width: 390rpx;
      border-radius: 10rpx;
      overflow: hidden;
      > image {
        display: block;
        width: 100%;
        height: 100%;
      }
      .content-info {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 100%;
        height: 100%;
        transform: translate(-50%, -50%);
        color: #fff;
        > .top {
          position: absolute;
          top: 20rpx;
          left: 20rpx;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 20rpx;
          font-size: 22rpx;
          color: #fff;
          > view:nth-child(1) {
            border-radius: 20rpx;
            background: #41cbdd;
            padding: 0 10rpx;
            left: 40rpx;
          }
          > view:nth-child(2) {
            padding: 0 20rpx;
          }
        }
        > .bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          min-height: 100rpx;
          background: rgba(0, 0, 0, 0.7);
          > view:nth-child(1) {
            padding-left: 24rpx;
            margin-top: -24rpx;
            > image {
              width: 60rpx;
              height: 60rpx;
              border-radius: 50%;
            }
          }
          > view:nth-child(2) {
            margin-top: 10rpx;
            font-size: 30rpx;
            padding-left: 24rpx;
          }
        }
      }
    }
    .active {
      transform: scale(1.1);
      transition: all 0.3s ease-in 0s;
      z-index: 2;
    }

    .dian-box {
      padding: 20rpx 0 30rpx;
      .dian {
        margin: 0 10rpx;
        width: 10rpx;
        height: 10rpx;
        background: #f5f5f5;
        opacity: 0.8;
        border-radius: 5rpx;
      }
      .dian-active {
        opacity: 1;
        width: 24rpx;
        background: #fff;
        transition: all 0.3s;
      }
    }
  }

  .zhibo-list {
    margin: 0 20rpx;
  }
  .user-list {
    border-radius: 28rpx 28rpx 0 0;
    background: #fff;
    padding: 40rpx 30rpx 0;
    margin: 0;

    display: flex;
    flex-wrap: wrap;
    .user-item {
      margin: 0;
      width: 340rpx;
      margin-bottom: 10rpx;
      &:nth-child(2n) {
        margin-left: 10rpx;
      }
      .left-img-box {
        position: relative;
        > image {
          width: 340rpx;
          height: 340rpx;
          border-radius: 10rpx;
        }
        > .top {
          position: absolute;
          top: 20rpx;
          left: 20rpx;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 20rpx;
          font-size: 22rpx;
          color: #fff;
          > view:nth-child(1) {
            border-radius: 20rpx;
            background: #41cbdd;
            padding: 0 10rpx;
            left: 40rpx;
          }
          > view:nth-child(2) {
            padding: 0 20rpx;
          }
        }
      }
      .bottom-content {
        line-height: 90rpx;
        > image {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
          margin-right: 10rpx;
        }
      }
    }
  }
  /deep/.u-loadmore {
    margin: 0 !important;
    padding: 20rpx 0;
  }
}
</style>
