<template>
  <view v-if="pageData" class="body flex-col">
    <view v-if="pageData.cat && !mch_id" class="bg-fff">
      <u-tabs
        :current="tabIndex"
        :list="pageData.cat"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        scrollable
        @change="clickTab"
      ></u-tabs>
    </view>

    <scroll-view @scrolltolower="getGoodsList" scroll-y class="flex-h-1">
      <view class="scroll-box">
        <view class="list flex-x-sb">
          <view
            @click="$utils.toUrl('/book/details/details?id=' + item.id)"
            class="item"
            v-for="(item, index) in goodsList"
            :key="index"
          >
            <image :src="item.cover_pic" mode="aspectFill" />
            <view class="item-content">
              <view class="name u-line-2">
                {{ item.name }}
              </view>
              <view class="flex-y-center flex-x-sb price-color">
                <view>{{
                  item.price > 0 ? "￥" + item.price : "免费预约"
                }}</view>
                <view class="bt">预约</view>
              </view>
            </view>
          </view>
        </view>
        <u-loadmore :status="status"></u-loadmore>
      </view>
    </scroll-view>
    <TabBar v-if="isShowTabBar"></TabBar>
  </view>
</template>
<script>
import TabBar from "@/components/TabBar";
import share from '../../mixins/share'
export default {
  mixins: [share],
  components: {
    TabBar,
  },
  data() {
    return {
      pageData: "",
      goodsList: [],
      tabIndex: 0,
      page: 1,
      status: "loadmore",
      cid: "",
      mch_id: "",
    };
  },
  onLoad(params) {
    this.cid = params.cid || "";
    this.mch_id = params.mch_id || "";
    this.$store.dispatch("getTabBarData");
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.book.index(
        {
          cid: this.cid,
          mch_id: this.mch_id,
        },
        true
      );
      this.pageData = res.data;
      this.pageData.cat.unshift({ name: "全部", id: 0 });
      this.goodsList = res.data.goods.list;
      this.status =
        res.data.goods.page_count <= this.page ? "nomore" : "loadmore";
      this.page++;
    },
    async getGoodsList() {
      if (this.status == "nomore") return;
      const res = await this.$requestAll.book.goodsList(
        {
          page: this.page,
          cid: this.cid,
        },
        true
      );
      this.goodsList.push(...res.data.list);
      this.status = res.data.page_count <= this.page ? "nomore" : "loadmore";
      this.page++;
    },
    clickTab({ index }) {
      this.tabIndex = index;
      this.cid = this.pageData.cat[index].id;
      this.resetPageData();
      this.getGoodsList();
    },
    resetPageData() {
      this.goodsList = this.$options.data().goodsList;
      this.page = this.$options.data().page;
      this.status = this.$options.data().status;
    },
  },
  onShow() {},
  computed: {
    isShowTabBar() {
      let tabBarData = this.$store.getters["tabBarData"];
      if (
        tabBarData &&
        tabBarData.navs.some(
          (item) =>
            item.url.indexOf("/pages/book/index/index") != -1 ||
            item.new_url.indexOf("/pages/book/index/index") != -1
        )
      )
        return true;
      return false;
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
  .list {
    padding: 20rpx 20rpx;

    flex-wrap: wrap;
    .item {
      background: #fff;
      margin-bottom: 20rpx;
      width: 345rpx;
      > image {
        width: 345rpx;
        height: 345rpx;
      }
      .item-content {
        padding: 10rpx;
        .name {
          font-size: 32rpx;
          line-height: 40rpx;
          height: 80rpx;
        }
        .bt {
          text-align: center;
          width: 110rpx;
          line-height: 44rpx;
          border: 2rpx solid red;
          border-radius: 22rpx;
        }
      }
    }
  }
}
</style>
