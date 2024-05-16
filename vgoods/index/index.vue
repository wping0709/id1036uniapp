<template>
  <view v-if="!store.is_shenhe" class="body flex-col">
    <scroll-view scroll-x>
      <div class="tabs bg-fff">
        <!-- <div
          :class="cart_id == 0 && 'check'"
          @click="clickTab({ id: 0, name: '全部' })"
          id="id_0"
          class="tab"
        >
          全部
        </div> -->
        <div
          :class="cart_id == cat.id && 'check'"
          @click="clickTab(cat)"
          class="tab"
          v-for="(cat, i) in cart_list"
          :key="i"
        >
          {{ cat.name }}
        </div>
      </div>
    </scroll-view>

    <scroll-view
      scroll-y
      @scrolltolower="loadData"
      class="page-content flex-h-1 env-bottom"
    >
      <div class="swiper-box">
        <swiper class="swiper" :indicator-dots="true">
          <swiper-item v-for="(banner, i) in banner_list" :key="i">
            <view
              @click="$utils.toUrl('/pages/index/index')"
              class="swiper-vitem"
              style="height: 100%; width: 100%"
            >
              <image
                :src="banner.pic_url"
                mode="aspectFill"
                style="height: 100%; width: 100%"
              />
            </view>
          </swiper-item>
        </swiper>
      </div>

      <view class="p-20">
        <UWaterfall ref="waterfall" v-model="pageData.list">
          <template v-slot:left="{ leftList }">
            <div class="item" v-for="(item, i) in leftList" :key="i">
              <div @click="navTo(item)" class="top-img">
                <image
                  v-if="!item.video_url"
                  :src="item.cover_pic"
                  mode="widthFix"
                />
                <VideoImage
                  v-else
                  :videoUrl="item.video_url"
                  :imgUrl="item.cover_pic"
                ></VideoImage>
              </div>
              <div class="p-t-10 u-line-2">
                {{ item.content }}
              </div>
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
                <view
                  @click="onGoods(item, 'leftList')"
                  class="flex-w-1 flex-y-center flex-x-end"
                >
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
          <template v-slot:right="{ rightList }">
            <div class="item" v-for="(item, i) in rightList" :key="i">
              <div @click="navTo(item)" class="top-img">
                <image
                  v-if="!item.video_url"
                  :src="item.cover_pic"
                  mode="widthFix"
                />
                <VideoImage
                  v-else
                  :videoUrl="item.video_url"
                  :imgUrl="item.cover_pic"
                ></VideoImage>
              </div>
              <div class="p-t-10 u-line-2">
                {{ item.content }}
              </div>
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
                <view
                  @click="onGoods(item, 'rightList')"
                  class="flex-w-1 flex-y-center flex-x-end"
                >
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
    </scroll-view>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import UWaterfall from '@/vgoods/components/u-waterfall/index';
import VideoImage from '@/components/video-image';

export default {
  components: {
    UWaterfall,
    VideoImage,
  },
  data() {
    return {
      pageData: {
        list: [],
        page: 0,
        status: 'loadmore',
      },
      cart_list: [],
      banner_list: [],
      cart_id: -1,
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.vgoods.list({
        page: this.pageData.page,
        cart_id: this.cart_id,
      });
      !this.cart_list.length && (this.cart_list = res.data.cart_list);
      !this.banner_list.length && (this.banner_list = res.data.banner_list);
      this.pageData.list.push(...res.data.vgoods_list);
      this.pageData.page++;
      this.pageData.status =
        res.data.count <= this.pageData.list.length ? 'nomore' : 'loadmore';
    },
    clickTab(cat) {
      this.cart_id = cat.id;
      this.$refs.waterfall.clear();
      this.pageData = this.$options.data().pageData;
      this.$nextTick(() => {
        this.loadData();
      });
    },
    async onGoods(item, v) {
      const res = await this.$requestAll.vgoods.vgoodsGood({
        id: item.id,
        status: item.is_like ? 0 : 1,
      });

      var waterFll = this.$refs['waterfall'];
      let index = waterFll[v].findIndex(v => v.id == item.id);
      let cItem = waterFll[v][index];

      cItem.is_like = item.is_like ? 0 : 1;
      cItem.good_num = item.is_like
        ? parseInt(item.good_num) - 1
        : parseInt(item.good_num) + 1;
    },
    // 跳转
    navTo(item) {
      if (item.video_url) {
        // 跳转视频列表
        this.$utils.toUrl('/vgoods/edit/index?pageType=1&id=' + item.id);
      } else {
        this.$utils.toUrl(
          '/shakeProduct/user_info/index' +
            uni.$u.queryParams({ id: item.id, cart_id: 0 })
        );
      }
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
}

.tabs {
  display: flex;
  .tab {
    margin-left: 20rpx;
    font-size: 30rpx;
    padding: 0 10rpx;
    line-height: 80rpx;
    text-align: center;
  }
  .check {
    font-weight: 900;
  }
}

.swiper {
  height: 200rpx;
  .swiper-vitem {
    padding: 10rpx;
  }
  image {
    border-radius: 10rpx;
  }
}

.item {
  margin-bottom: 20rpx;
  background: #fff;
  border-radius: 10rpx;
  padding: 10rpx;
  .top-img {
    position: relative;
    max-height: 400rpx;
    overflow: hidden;
    border-radius: 10rpx;

    image {
      background: #eee;
      width: 100%;
    }
    
  }
}
</style>
