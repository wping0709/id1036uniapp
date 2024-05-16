<template>
  <view v-if="pageData" class="body flex-col">
    <view v-if="share_setting.level > 1" class="tabs bg-fff">
      <u-tabs
        :current="status"
        :list="tabsList"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view
      @scrolltolower="$u.throttle(loadData)"
      scroll-y
      class="content flex-h-1"
    >
      <view class="scroll-box" v-if="list.length">
        <view class="item" v-for="(item, index) in list" :key="index">
          <view class="flex-x-sb flex-y-center">
            <image :src="item.avatar_url" mode="" />
            <view class="m-l-20 flex-w-1">
              <view class="flex-x-sb m-b-10">
                <text>{{ item.nickname }}</text>
                <text class="font-24">推广{{ item.child_count }}人</text>
              </view>
              <view class="color-666 font-26">注册时间{{ item.time }}</view>
            </view>
          </view>
          <view class="flex-x-sb flex-y-center">
            <text>消费{{ item.price }}元</text>
            <text>{{ item.count }}个订单</text>
          </view>
        </view>

        <!-- <u-loadmore :status="more"></u-loadmore> -->
      </view>
      <view class="scroll-box" v-else>
        <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      status: 0,
      list: [],
      tabsList: [],
      page: 1,
      more: 'loadmore',
      custom: {},
    };
  },
  onLoad(params) {
    this.getShareData();
    this.loadData();
  },
  onShow() {},
  methods: {
    async getShareData() {
      const res1 = await this.$requestAll.share.getInfo({}, true);
      this.custom = res1.data.custom;
      if (this.custom.menus.order) {
        uni.setNavigationBarTitle({
          title: this.custom.menus.team.name,
        });
      }
    },
    async loadData() {
      if (this.more == 'nomore') return;

      const res = await this.$requestAll.share.getTeam(
        {
          status: this.status + 1,
          page: this.page,
        },
        true
      );
      this.pageData = res.data;
      if (this.share_setting.level == 3) {
        this.tabsList = [
          { name: '一级(' + this.pageData.first + ')' },
          { name: '二级(' + this.pageData.second + ')' },
          { name: '三级(' + this.pageData.third + ')' },
        ];
      } else if (this.share_setting.level == 2) {
        this.tabsList = [
          { name: '一级(' + this.pageData.first + ')' },
          { name: '二级(' + this.pageData.second + ')' },
        ];
      }

      this.list.push(...res.data.list);
      this.more =
        this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
      this.page++;
    },
    clickTab({ index }) {
      this.status = index;
      this.resetPageData();
      this.loadData();
    },
    scrolltolower() {
      this.page++;
      this.loadData();
    },
    resetPageData() {
      this.list = this.$options.data().list;
      this.page = this.$options.data().page;
      this.more = this.$options.data().more;
    },
  },
  computed: {
    share_setting() {
      return this.$store.getters['SHOP_CONFIG'].share_setting || '';
    },
  },
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
  .tabs {
    border-bottom: 1px solid #eee;
  }
}
.item {
  margin-bottom: 20rpx;
  background: #fff;
  > view:nth-child(1) {
    padding: 30rpx;
    border-bottom: 2rpx solid #eee;
    image {
      width: 100rpx;
      height: 100rpx;
    }
  }
  > view:nth-child(2) {
    padding: 30rpx;
  }
}
</style>
