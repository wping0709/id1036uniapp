<template>
  <view class="flex-col body">
    <view class="search flex-y-center flex-x-center">
      <view class="search-box flex-y-center p-x-20">
        <view v-if="defaultCat" class="search-select m-r-20">
          <view @click="clickCat" class="flex-y-center color-999">
            <text class="">
              {{ defaultCat.name }}
            </text>
            <text v-if="!isShowCat" class="iconfont icon-arrow-bottom"></text>
            <text v-else class="iconfont icon-arrow-top"></text>
          </view>
          <view v-show="isShowCat" class="tabs-fiex">
            <view
              @click="selectCat(item)"
              v-for="(item, index) in catList"
              :key="index"
              class=""
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <view class="search-input">
          <u--input
            v-model="inputValue"
            @confirm="searchConfirm"
            @focus="searchFocus"
            confirmType="search"
            placeholder="请输入关键词搜索"
            border="none"
          ></u--input>
        </view>
      </view>
    </view>

    <view class="search-content flex-h-1 flex-col">
      <!-- 搜索历史 -->
      <view v-if="showHistory" class="search-history flex-col flex-h-1">
        <view class="history-title flex-y-center flex-x-sb">
          <view class=""> 搜索历史 </view>
          <text
            @click="resetHistory"
            class="iconfont icon-ashbin1 font-38"
          ></text>
        </view>

        <scroll-view scroll-y class="flex-h-1">
          <view class="history-content">
            <view
              @click="searchConfirm(item)"
              v-for="(item, index) in historyList"
              :key="index"
              class="history-item"
              >{{ item }}</view
            >
          </view>
        </scroll-view>
      </view>

      <!-- 商品列表 -->
      <view
        v-else-if="defaultCat.name == '商品' || !defaultCat"
        class="content-item flex-col"
      >
        <!-- tabs -->
        <view class="flex-y-center tabs-box font-28 bg-fff">
          <view @click="clickTab(0)" :class="sort == 0 && 'active-tab'"
            >综合</view
          >
          <view @click="clickTab(1)" :class="sort == 1 && 'active-tab'"
            >最新</view
          >
          <view @click="clickTab(2)" class="flex-x-center flex-y-center">
            <view :class="sort == 2 && 'active-tab'" class="m-r-10">价格</view>
            <view class="flex-col flex-y-center flex-x-center">
              <u-icon
                :color="sort_type == 0 && sort == 2 ? 'red' : '#666'"
                size="14rpx"
                name="arrow-up-fill"
              ></u-icon>
              <u-icon
                class="m-t-10"
                :color="sort_type == 1 && sort == 2 ? 'red' : ''"
                size="14rpx"
                name="arrow-down-fill"
              ></u-icon>
            </view>
          </view>
          <view @click="clickTab(3)" :class="sort == 3 && 'active-tab'"
            >销量</view
          >
        </view>

        <scroll-view scroll-y @scrolltolower="scrollBottom" class="flex-h-1">
          <GoodsList :goodsList="searchData"></GoodsList>
          <u-loadmore :status="isBottom ? 'nomore' : 'loadmore'" />
        </scroll-view>
      </view>

      <view v-else-if="defaultCat.name == '店铺'" class="content-item flex-col">
        <scroll-view scroll-y @scrolltolower="scrollBottom" class="flex-h-1">
          <ShopList :shopList="searchData"></ShopList>
          <u-loadmore :status="isBottom ? 'nomore' : 'loadmore'" />
        </scroll-view>
      </view>

      <view v-else-if="defaultCat.name == '秒杀'" class="content-item flex-col">
        <!-- tabs -->
        <view class="flex-y-center tabs-box font-28 bg-fff">
          <view @click="clickTab(0)" :class="sort == 0 && 'active-tab'"
            >综合</view
          >
          <view @click="clickTab(1)" :class="sort == 1 && 'active-tab'"
            >最新</view
          >
          <view @click="clickTab(2)" class="flex-x-center flex-y-center">
            <view :class="sort == 2 && 'active-tab'" class="m-r-10">价格</view>
            <view class="flex-col flex-y-center flex-x-center">
              <u-icon
                :color="sort_type == 0 && sort == 2 ? 'red' : '#666'"
                size="14rpx"
                name="arrow-up-fill"
              ></u-icon>
              <u-icon
                class="m-t-10"
                :color="sort_type == 1 && sort == 2 ? 'red' : ''"
                size="14rpx"
                name="arrow-down-fill"
              ></u-icon>
            </view>
          </view>
          <view @click="clickTab(3)" :class="sort == 3 && 'active-tab'"
            >销量</view
          >
        </view>
        <scroll-view scroll-y @scrolltolower="scrollBottom" class="flex-h-1">
          <GoodsList :goodsList="searchData"></GoodsList>
          <u-loadmore :status="isBottom ? 'nomore' : 'loadmore'" />
        </scroll-view>
      </view>
      <view v-else-if="defaultCat.name == '拼团'" class="content-item flex-col">
        <!-- tabs -->
        <view class="flex-y-center tabs-box font-28 bg-fff">
          <view @click="clickTab(0)" :class="sort == 0 && 'active-tab'"
            >综合</view
          >
          <view @click="clickTab(1)" :class="sort == 1 && 'active-tab'"
            >最新</view
          >
          <view @click="clickTab(2)" class="flex-x-center flex-y-center">
            <view :class="sort == 2 && 'active-tab'" class="m-r-10">价格</view>
            <view class="flex-col flex-y-center flex-x-center">
              <u-icon
                :color="sort_type == 0 && sort == 2 ? 'red' : '#666'"
                size="14rpx"
                name="arrow-up-fill"
              ></u-icon>
              <u-icon
                class="m-t-10"
                :color="sort_type == 1 && sort == 2 ? 'red' : ''"
                size="14rpx"
                name="arrow-down-fill"
              ></u-icon>
            </view>
          </view>
          <view @click="clickTab(3)" :class="sort == 3 && 'active-tab'"
            >销量</view
          >
        </view>
        <scroll-view scroll-y @scrolltolower="scrollBottom" class="flex-h-1">
          <GoodsList :goodsList="searchData"></GoodsList>
          <u-loadmore :status="isBottom ? 'nomore' : 'loadmore'" />
        </scroll-view>
      </view>
      <view v-else-if="defaultCat.name == '预约'" class="content-item flex-col">
        <!-- tabs -->
        <view class="flex-y-center tabs-box font-28 bg-fff">
          <view @click="clickTab(0)" :class="sort == 0 && 'active-tab'"
            >综合</view
          >
          <view @click="clickTab(1)" :class="sort == 1 && 'active-tab'"
            >最新</view
          >
          <view @click="clickTab(2)" class="flex-x-center flex-y-center">
            <view :class="sort == 2 && 'active-tab'" class="m-r-10">价格</view>
            <view class="flex-col flex-y-center flex-x-center">
              <u-icon
                :color="sort_type == 0 && sort == 2 ? 'red' : '#666'"
                size="14rpx"
                name="arrow-up-fill"
              ></u-icon>
              <u-icon
                class="m-t-10"
                :color="sort_type == 1 && sort == 2 ? 'red' : ''"
                size="14rpx"
                name="arrow-down-fill"
              ></u-icon>
            </view>
          </view>
          <view @click="clickTab(3)" :class="sort == 3 && 'active-tab'"
            >销量</view
          >
        </view>
        <scroll-view scroll-y @scrolltolower="scrollBottom" class="flex-h-1">
          <GoodsList :goodsList="searchData"></GoodsList>
          <u-loadmore :status="isBottom ? 'nomore' : 'loadmore'" />
        </scroll-view>
      </view>

      <div v-else-if="defaultCat.name == '专题'" class="content-item flex-col">
        <scroll-view @scrolltolower="scrollBottom" scroll-y class="flex-h-1">
          <div class="scroll-box" v-if="searchData.length">
            <view
              class="item m-b-20 bg-fff"
              v-for="(item, index) in searchData"
              :key="index"
            >
              <BeiouItem :item="item" v-if="item.layout == 0"></BeiouItem>
              <ZhongshiItem :item="item" v-else></ZhongshiItem>
            </view>
            <u-loadmore :status="isBottom ? nomore : 'loadmore'"></u-loadmore>
          </div>
          <div v-else class="scroll-box">
            <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
          </div>
        </scroll-view>
      </div>
    </view>
  </view>
</template>

<script>
import GoodsList from "@/components/goods/GoodsList";
import ShopList from "./components/ShopList";
import BeiouItem from "@/components/BeiouItem/BeiouItem.vue";
import ZhongshiItem from "@/components/ZhongshiItem/ZhongshiItem.vue";

export default {
  components: {
    GoodsList,
    ShopList,
    BeiouItem,
    ZhongshiItem,
  },
  data() {
    return {
      mch_id: "",
      isShowCat: false, //显示cat列表开关
      inputValue: "",
      catList: [], //cat列表数据
      defaultCat: "", //选中的cat数据
      showHistory: true, //搜索历史显示开关
      page: 1,
      isBottom: false, //加载是否到底
      searchData: [], //列表数据
      sort: 0,
      sort_type: -1, //价格排序
    };
  },
  onLoad(params) {
    this.mch_id = params.mch_id || "";
    if (this.mch_id) {
      this.resetData();
    } else {
      this.loadData();
    }
  },
  onShow() {},
  methods: {
    searchFocus() {
      console.log("获取焦点");
      this.showHistory = true;
    },
    // searchBlur() {
    //   this.showHistory = false
    // },
    clickTab(index) {
      if (index == 2) {
        if (this.sort_type <= 0) {
          this.sort_type++;
        } else if (this.sort_type > 0) {
          this.sort_type--;
        }
      }
      this.sort = index;
      this.page = this.$options.data().page;
      this.searchData = this.$options.data().searchData;
      this.isBottom = this.$options.data().isBottom;
      this.getList();
    },
    // 初始化数据
    async loadData() {
      const res = await this.$requestAll.default.getCats({});
      this.catList = res.data.list;
      this.defaultCat = res.data.default_cat;
    },
    // 搜索提交
    async searchConfirm(value) {
      //   初始化数据
      this.page = this.$options.data().page;
      this.isBottom = this.$options.data().isBottom;
      this.searchData = this.$options.data().searchData;

      this.inputValue = value;

      //   隐藏搜索记录
      this.showHistory = false;
      //   储存设置搜索记录
      this.$store.commit("search/setSearchList", value);
      // 获取数据
      this.getList();
    },

    // 获取列表数据
    async getList() {
      //   已经到底了
      if (this.isBottom) return;

      // 获取定位信息
      const location = await this.$store.dispatch("GETLOCATION");

      const formData = {
        longitude: location.longitude,
        latitude: location.latitude,
        page: this.page,
        defaultCat: this.defaultCat ? JSON.stringify(this.defaultCat) : "",
        keyword: this.inputValue,
        sort: this.sort,
        sort_type: this.sort_type,
        mch_id: this.mch_id,
      };
      const res = await this.$requestAll.default.defaultSearch(formData, true);
      let list = res.data.list;
      if (this.mch_id && list.length) {
        list = list.map((item) => {
          delete item.url;
          return item;
        });
      }
      this.searchData.push(...list);
      this.isBottom = this.searchData.length >= res.data.row_count;
    },
    // 清空搜索记录
    resetHistory() {
      uni.showModal({
        title: "提示",
        content: "您确定清空搜索记录吗?",
        success: ({ confirm }) => {
          confirm && this.$store.commit("search/resetHistory");
        },
      });
    },

    clickCat() {
      this.isShowCat = !this.isShowCat;
    },
    selectCat(item) {
      this.isShowCat = !this.isShowCat;
      this.defaultCat = item;

      //   初始化数据
      this.page = this.$options.data().page;
      this.isBottom = this.$options.data().isBottom;
      this.searchData = this.$options.data().searchData;
      this.getList();
    },

    // 滚动触底
    scrollBottom() {
      this.page++;
      this.getList();
    },
    resetData() {
      let { showHistory, defaultCat, page, isBottom, searchData } =
        this.$options.data();
      this.showHistory = showHistory;
      this.defaultCat = defaultCat;
      this.page = page;
      this.isBottom = isBottom;
      this.searchData = searchData;
    },
  },

  computed: {
    historyList() {
      console.log(this.$store.getters["search/searchList"]);
      return this.$store.getters["search/searchList"];
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  height: 100vh;
  /* #ifdef H5 */

  height: calc(100vh - 44px);
  /* #endif */
  background: #fff;
}

.search {
  background: #fff;
  height: 80rpx;

  .search-box {
    width: 700rpx;
    background-color: #f5f5f5;
    height: 64rpx;
    line-height: 64rpx;
    border-radius: 35rpx;

    .search-input {
      width: 0;
      flex: 1;
      line-height: 100%;
    }

    .search-select {
      position: relative;

      .tabs-fiex {
        border-radius: 4rpx;
        box-sizing: content-box;
        position: absolute;
        left: 50%;
        top: calc(100% + 14rpx);
        z-index: 99;
        transform: translate(-50%, 0);
        min-width: 100%;
        padding: 0 20rpx;
        text-align: center;
        background: #fff;
        box-shadow: 0 0 6rpx #999;

        &::before {
          content: "";
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translate(-50%, 0);
          border: 14rpx solid transparent;
          border-bottom-color: #fff;
        }
      }
    }
  }
}

.search-content {
  > .content-item {
    flex: 1;
    height: 0;
  }
}

.search-history {
  padding: 20rpx;
  .history-content {
    margin-top: 30rpx;
    display: flex;
    flex-wrap: wrap;

    .history-item {
      padding: 0 26rpx;
      line-height: 50rpx;
      height: 50rpx;
      background-color: #f5f5f5;
      margin-right: 15rpx;
      margin-bottom: 15rpx;
      border-radius: 24rpx;
      font-size: 24rpx;
    }
  }
}

.tabs-box {
  line-height: 80rpx;
  > view {
    width: 25%;
    text-align: center;
  }
  .active-tab {
    color: #f00;
  }
}
</style>
