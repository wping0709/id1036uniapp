<template>
  <view class="body flex-col">
    <view class="bg-fff">
      <u-tabs
        :current="status"
        :list="list1"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <view class="flex-h-1 flex-col">
      <swiper style="flex: 1" :current="status" @change="swiperChange">
        <!-- 商品列表 -->
        <swiper-item>
          <scroll-view
            style="height: 100%"
            @scrolltolower="scrolltolower('shoucang')"
            scroll-y
          >
            <view class="scroll-box" v-if="shoucangData.list.length">
              <GoodsList :list="shoucangData.list"></GoodsList>
              <u-loadmore :status="shoucangData.status"></u-loadmore>
            </view>
            <view class="scroll-box" v-else>
              <u-empty
                mode="data"
                :icon="wxapp_img.empty_data"
              >
              </u-empty>
            </view>
          </scroll-view>
        </swiper-item>
        <swiper-item>
          <scroll-view
            style="height: 100%"
            @scrolltolower="scrolltolower('zhuanti')"
            scroll-y
          >
            <view class="scroll-box" v-if="zhuantiData.list.length">
              <TopicList :list="zhuantiData.list"></TopicList>
              <u-loadmore :status="zhuantiData.status"></u-loadmore>
            </view>
            <view class="scroll-box" v-else>
              <u-empty
                mode="data"
                :icon="wxapp_img.empty_data"
              >
              </u-empty>
            </view>
          </scroll-view>
        </swiper-item>
        <swiper-item>
          <scroll-view
            style="height: 100%"
            @scrolltolower="scrolltolower('shop')"
            scroll-y
          >
            <view class="scroll-box" v-if="shopData.list.length">
              <ShopList :list="shopData.list"></ShopList>
              <u-loadmore :status="shopData.status"></u-loadmore>
            </view>
            <view class="scroll-box" v-else>
              <u-empty
                mode="data"
                :icon="wxapp_img.empty_data"
              >
              </u-empty>
            </view>
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </view>
</template>
<script>
import GoodsList from './components/GoodsList.vue';
import TopicList from './components/TopicList';
import ShopList from './components/ShopList';
export default {
  components: {
    GoodsList,
    TopicList,
    ShopList
  },
  data() {
    return {
      list1: [
        {
          name: '商品',
        },
        {
          name: '专题',
        },
        {
          name: '店铺',
        },
      ],
      pageData: '',
      status: 0,
      list: [],
      page: 1,
      more: 'loadmore',
      shoucangData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      zhuantiData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      shopData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
    };
  },
  onLoad(params) {
    this.getShoucangList();
    this.getZhuantiList();
    this.getShopList();
  },
  methods: {
    async getShoucangList() {
      if (this.shoucangData.status == 'nomore') return;
      const res1 = await this.$requestAll.user.favoriteList({
        type: 1,
        page: this.shoucangData.page,
      });
      this.shoucangData.list.push(...res1.data.list);
      this.shoucangData.status =
        res1.data.row_count >= this.shoucangData.list.length
          ? 'nomore'
          : 'loadmore';
      this.shoucangData.page++;
    },
    async getZhuantiList() {
      if (this.zhuantiData.status == 'nomore') return;
      const res1 = await this.$requestAll.user.topicFavoriteList({
        type: 1,
        page: this.zhuantiData.page,
      });
      this.zhuantiData.list.push(...res1.data.list);
      this.zhuantiData.status =
        res1.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.zhuantiData.page++;
    },
    async getShopList() {
      if (this.shopData.status == 'nomore') return;
      const res1 = await this.$requestAll.user.favoriteList({
        type: 2,
        page: this.shopData.page,
      });
      this.shopData.list.push(...res1.data.list);
      this.shopData.status =
        res1.data.row_count >= this.shopData.list.length
          ? 'nomore'
          : 'loadmore';
      this.shopData.page++;
    },
    clickTab({ index }) {
      this.status = index;
    },
    scrolltolower(type) {
      if (type == 'goods') {
        this.getShoucangList();
      } else if (type == 'zhuanti') {
        this.getZhuantiList();
      } else {
        this.getShopList();
      }
    },
    swiperChange({ detail: { current } }) {
      this.status = current;
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
.tixian-item {
  margin-bottom: 20rpx;
  padding: 30rpx;
  background: #fff;
}
</style>
