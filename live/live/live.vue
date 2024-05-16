<template>
  <view v-if="!store.is_shenhe" class="body">
    <div v-if="pageData.list.length" class="live-list">
      <div
        @click="onClickLive(item)"
        v-for="(item, i) in pageData.list"
        :key="i"
        class="live-item"
      >
        <div
          :style="{
            background: `url(${item.share_img}) 0% 0% / 100% 100% no-repeat`,
          }"
          class="left flex-col flex-x-sb p-x-20 p-y-10 color-fff"
        >
          <view class="status">
            <view class="flex-y-center status-bg">
              <template v-if="item.live_status == '103'">
                <div class="img-view">
                  <image
                    :src="wxapp_img.live.p2"
                    mode="widthFix"
                    style="width: 100%"
                  />
                </div>
                <text class="font-24 m-l-10">可回放</text>
              </template>
              <template v-else>
                <div class="img-view p3-img">
                  <image
                    :src="wxapp_img.live.p3"
                    mode="aspectFit"
                    style="width: 20rpx; height: 20rpx"
                  />
                </div>
                <text class="font-24 m-l-10">ID：{{ item.roomid }}</text>
              </template>
            </view>
          </view>

          <button
            @click.stop="onCheckItem(item)"
            open-type="share"
            class="button-initial flex-y-center color-fff"
          >
            <view class="flex-y-center flex-w-1">
              <image
                :src="wxapp_img.live.play"
                mode="widthFix"
                style="width: 30rpx"
              />
              <text class="m-l-10 flex-w-1 font-24 u-line-1 font-left">
                {{ item.time }}
              </text>
            </view>
            <image
              :src="wxapp_img.live.share"
              mode="aspectFit"
              style="width: 40rpx; height: 40rpx"
            />
          </button>
        </div>
        <div class="right flex-w-1 p-20">
          <view class="u-line-1 m-b-20 font-w-600">{{ item.name }}</view>
          <view class="u-line-1 m-b-20">{{ item.anchor_name }}</view>
          <scroll-view scroll-x>
            <view class="goods-list flex">
              <div
                v-for="(item1, i1) in item.goods"
                :key="i1"
                :style="{
                  background: `url(${item1.cover_img}) 0% 0% / 100% 100% no-repeat`,
                }"
                class="goods-item"
              >
                <view class="color-fff font-24 font-center font-w-600"
                  >￥{{ item1.price }}</view
                >
              </div>
            </view>
          </scroll-view>
        </div>
      </div>

      <u-loadmore :status="pageData.status"></u-loadmore>
    </div>

    <view v-else class="p-y-20">
      <u-empty mode="data" :icon="wxapp_img.empty_data">
      </u-empty>
    </view>

    <QOfficialAccount></QOfficialAccount>

  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import share from '@/mixins/share.js';
export default {
  mixins: [share],
  data() {
    return {
      pageData: {
        list: [],
        status: 'loadmore',
        page: 1,
      },
      checkItem: {},
    };
  },
  onLoad(params) {
    if(params.roomid) {
      this.onClickLive({live_status: '',roomid: params.roomid})
    } 
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      let formData = {
        page: this.pageData.page,
      }
      const res = await this.$requestAll.live.getList(formData, true);
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 15 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    onClickLive(item) {
      switch (item.live_status) {
        case '104':
          uni.$u.toast('该直播间被禁播!');
          break;
        case '107':
          uni.$u.toast('该直播间过期未开播!');
          break;

        default:
          this.$utils.toUrl(
            'plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=' +
              item.roomid
          );
          break;
      }
    },
    onCheckItem(item) {
      this.checkItem = item;
    },
  },
  computed: {
    shareData() {
      let user = this.$store.getters['user/userInfo'];
      let item = this.checkItem;
      return {
        path:
          '/live/live/live' +
          uni.$u.queryParams({
            roomid: item.roomid,
            user_id: user.id || '',
            store_id:
              this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
        imageUrl: item.share_img,
        title: item.name,
      };
    },
  },
  watch: {},
  onReachBottom() {
    this.loadData();
  },
  onPullDownRefresh() {
    this.pageData = this.$options.data().pageData;
    this.loadData().then(() => {
      uni.stopPullDownRefresh();
    });
  },
};
</script>
<style lang="scss" scoped>
.body {
  padding-top: 20rpx;
  padding-bottom: 20rpx;

  background: #f5f5f5;
  min-height: 100vh;
}
.live-list {
  .live-item {
    display: flex;
    overflow: hidden;
    margin: 0 20rpx;
    margin-bottom: 20rpx;
    background: #fff;
    border-radius: 20rpx;
    .left {
      width: 380rpx;
      height: 330rpx;
      .status {
        display: flex;
        .status-bg {
          background: rgba($color: #000000, $alpha: 0.3);
          border-radius: 20rpx;
          padding-right: 16rpx;
          overflow: hidden;
          .img-view {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 38rpx;
            height: 38rpx;
            border-radius: 50%;
          }
          .p3-img {
            display: flex;
            align-items: center;
            justify-content: center;
            background: red;
            width: 60rpx;
            border-radius: 0 20rpx 20rpx 0;
          }
        }
      }
    }
    .right {
      scroll-view {
        .goods-item {
          width: 126rpx;
          min-width: 126rpx;
          height: 126rpx;
          margin-right: 20rpx;
          border-radius: 10rpx;

          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
      }
    }
  }
}
</style>
