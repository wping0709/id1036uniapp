<template>
  <view class="body flex-col">
    <div class="search-box flex-y-center p-l-20">
      <view class="flex-w-1">
        <u-input
          v-model="searchValue"
          @confirm="searchConfirm"
          @focus="searchFocus"
          shape="circle"
          placeholder="请输入商品关键字"
        ></u-input>
      </view>
      <view class="p-x-20 font-32" @click="$utils.backTo()">取消</view>
    </div>
    <scroll-view scroll-y class="flex-h-1">
      <view v-if="isShowHistory" class="search-history">
        <div class="title flex-x-sb flex-y-center font-32">
          <text>搜索历史</text>
          <text
            @click="resetHistory"
            class="iconfont icon-ashbin1 font-40"
          ></text>
        </div>
        <div class="history-content">
          <div
            @click="searchConfirm(item)"
            class="history-item"
            v-for="(item, i) in historyList"
            :key="i"
          >
            {{ item }}
          </div>
        </div>
      </view>

      <view v-else class="goods-list">
        <template v-if="pageData.list.length">
          <div
            @click="$utils.toUrl('/pt/details/details?gid=' + goods.id)"
            v-for="(goods, i) in pageData.list"
            :key="i"
            class="goods-item"
          >
            <image :src="goods.cover_pic" mode="aspectFill" />
            <div class="right flex-w-1">
              <view class="goods-name u-line-3">{{ goods.name }}</view>

              <view class="price-color">已开团{{ goods.virtual_sales }}</view>

              <view class="price-bt flex-y-center flex-x-sb">
                <view class="u-line-1">
                  <text class="price-color font-32">￥{{ goods.price }}</text>
                  <text class="font-del color-999 m-l-20"
                    >￥{{ goods.original_price }}</text
                  >
                </view>
                <view class="bt">去开团</view>
              </view>
            </div>
          </div>

          <u-loadmore status="nomore"></u-loadmore>
        </template>

        <u-empty
          v-else
          mode="data"
          :icon="wxapp_img.empty_data"
        >
        </u-empty>
      </view>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      searchValue: '',
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      isShowHistory: true,
    };
  },
  onLoad() {},
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.group.indexSearch({
        page: this.pageData.page,
        keyword: this.searchValue,
      });
      this.pageData.list.push(...res.data.list);
      this.pageData.status =
        this.pageData.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
    searchConfirm(value) {
      this.searchValue = value;
      this.$store.commit('search/setSearchList', value);
      this.pageData = this.$options.data().pageData;
      this.loadData();
      this.isShowHistory = false;
    },
    searchFocus() {
      this.isShowHistory = true;
    },
    // 清空搜索记录
    resetHistory() {
      uni.showModal({
        title: '提示',
        content: '您确定清空搜索记录吗?',
        success: ({ confirm }) => {
          confirm && this.$store.commit('search/resetHistory');
        },
      });
    },
  },
  onShow() {},
  computed: {
    historyList() {
      console.log(this.$store.getters['search/searchList']);
      return this.$store.getters['search/searchList'];
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .search-box {
    background: #fff;
    height: 90rpx;
    /deep/.u-input {
      padding: 6rpx 20rpx !important;
    }
  }

  .search-history {
    height: 100%;
    background: #fff;
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

  .goods-list {
    .goods-item {
      background: #fff;
      padding: 20rpx;
      border-bottom: 2rpx solid #eee;
      display: flex;
      justify-content: space-between;
      > image {
        margin-right: 20rpx;
        width: 220rpx;
        height: 220rpx;
      }

      .goods-name {
        line-height: 40rpx;
        height: 120rpx;
        font-size: 30rpx;
      }
      .price-bt {
        > view:nth-child(1) {
          width: 280rpx;
        }
        .bt {
          height: 66rpx;
          line-height: 65rpx;
          text-align: center;
          width: 180rpx;
          color: #ffffff;
          font-size: 30rpx;
          border-radius: 10rpx;
          background-image: linear-gradient(to right, #ffa360, #ff5c5c);
        }
      }
    }
  }
}
</style>
