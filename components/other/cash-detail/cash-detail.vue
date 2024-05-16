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
        :scrollable="false"
      ></u-tabs>
    </view>

    <scroll-view
      @scrolltolower="scrolltolower"
      scroll-y
      class="content flex-h-1"
    >
      <view class="scroll-box" v-if="list.length">
        <view
          class="tixian-item flex-y-center flex-x-sb"
          v-for="(item, index) in list"
          :key="index"
        >
          <view>
            <view class="font-30 m-b-10">提现 {{ item.price }}</view>
            <view class="font-24">{{ item.addtime }}</view>
          </view>
          <view class="price-color">{{ item.status }}</view>
        </view>
        <u-loadmore :status="more"></u-loadmore>
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
      pageType: '',
      is_shop: 0,
      list1: [
        {
          name: '全部',
        },
        {
          name: '待审核',
        },
        {
          name: '待打款',
        },
        {
          name: '已打款',
        },
        {
          name: '无效',
        },
      ],
      pageData: '',
      status: 0,
      list: [],
      page: 1,
      more: 'loadmore',
    };
  },
  onLoad(params) {
    console.log(params);
    if (params.type) this.pageType = params.type;
    uni.setNavigationBarTitle({
      title: params.title || '提现明细',
    });
    this.status = parseInt(params.status || 0);
    this.is_shop = params.is_shop || 0;
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.more == 'nomore') return;
      // 分销
      if (!this.pageType) {
        const res = await this.$requestAll.share.cashDetail(
          {
            status: this.status - 1,
            page: this.page,
            is_shop: this.is_shop,
          },
          true
        );
        this.list.push(...res.data.list);
        this.more =
          this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
        this.page++;
      }
      // 店铺
      else if(this.pageType == 'shop') {
        const res = await this.$requestAll.recommend.cashDetail(
          {
            status: this.status - 1,
            page: this.page,
          },
          true
        );
        this.list.push(...res.data.list);
        this.more =
          this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
        this.page++;
      }
      // 配送中心
      else if (this.pageType == 'peisong') {
        const res = await this.$requestAll.waimai.cashDetail(
          {
            status: this.status - 1,
            page: this.page,
            is_shop: this.is_shop,
          },
          true
        );
        this.list.push(...res.data.list);
        this.more =
          this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
        this.page++;
      }
      // 区域代理
      else if (this.pageType == 'region') {
        const res = await this.$requestAll.agentApproval.cashDetail(
          {
            status: this.status - 1,
            page: this.page,
            is_shop: this.is_shop,
          },
          true
        );
        this.list.push(...res.data.list);
        this.more =
          this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
        this.page++;
      }
      // 主播提现列表
      else if (this.pageType == 'live') {
        const res = await this.$requestAll.lives.cashDetail(
          {
            status: this.status - 1,
            page: this.page,
          },
          true
        );
        this.list.push(...res.data.list);
        this.more =
          this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
        this.page++;
      }
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
  onShow() { },
  computed: {},
  watch: {},
  onReachBottom() { },
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
  margin-top: 20rpx;
  padding: 30rpx;
  background: #fff;
}
</style>
