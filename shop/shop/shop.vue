<template>
  <view class="body flex-col">
    <view class="search-box flex-y-center p-y-10 p-x-20">
      <u-input
        v-model="value"
        clearable
        placeholder="请输入关键字"
        fontSize="26rpx"
        @confirm="searchSubmit"
      >
        <view
          @click="searchSubmit"
          slot="suffix"
          class="search-bt-box flex-x-center"
        >
          <text class="iconfont icon-sousuo color-999"></text>
          <text class="m-r-1-">搜索</text>
        </view>
      </u-input>
    </view>
    <scroll-view
      @scrolltolower="scrolltolower"
      scroll-y
      style=""
      class="flex-h-1"
    >
      <view v-if="shopList.length">
        <view v-for="(value, key) in shopList" :key="key" class="shop-one">
          <view
            @click="
              $utils.toUrl('/shop/shop-detail/shop-detail?shop_id=' + value.id)
            "
            class="flex"
          >
            <view class="flex-y-center">
              <image class="shop-img" :src="value.pic_url" mode="aspectFill" />
            </view>

            <view @click="$utils.toUrl('')" class="flex-w-1 font-24 m-x-20">
              <view class="u-line-1 font-w-700 font-30">
                {{ value.name }}
              </view>

              <!-- 评分 -->
              <view class="flex-y-center m-t-10">
                <view class="score">
                  <u-rate
                    :count="5"
                    :value="value.score"
                    :size="14"
                    :gutter="1"
                    disabled
                  ></u-rate>
                </view>
              </view>

              <view class="m-t-10 font-24 color-999">
                营业时间：{{ value.shop_time || '无' }}
              </view>
            </view>

            <view class="flex-y-center flex-x-center color-999 font-24">
              <text>{{ value.juli }}km</text>
            </view>
          </view>

          <div class="shop-btns">
            <view
              @click.stop="onOpenLocation(value)"
              class="flex-x-center flex-y-center"
            >
              <text class="iconfont icon-daohang m-r-10"></text>
              <text>导航到店</text>
            </view>

            <view
              @click.stop="onOpenMobile(value)"
              class="flex-x-center flex-y-center"
            >
              <text class="iconfont icon-dianhua m-r-10"></text>
              <text>致电咨询</text>
            </view>
          </div>
        </view>
        <u-loadmore :status="status"></u-loadmore>
      </view>
      <view v-else>
        <u-empty
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
      shopList: [],
      value: '',
      status: 'loadmore',
      page: 1,
      book_id:'',
    };
  },
  onLoad(params) {
    this.book_id = params.book_id || ''
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.status == 'nomore') return;
      const location = await this.$store.dispatch('GETLOCATION')
      
      const res = await this.$requestAll.default.shopList(
        {
          longitude: location.longitude,
          latitude: location.latitude,
          keyword: this.value,
          page: this.page,
          book_id: this.book_id
        },
        true
      );
      this.shopList.push(...res.data.list);
      this.status =
        this.shopList.length >= res.data.row_count ? 'nomore' : 'loadmore';
    },
    scrolltolower() {
      this.page++;
      this.loadData();
    },
    searchSubmit() {
      this.page = this.$options.data().page;
      this.status = this.$options.data().status;
      this.shopList = this.$options.data().shopList;
      this.loadData();
    },
    onOpenLocation(value) {
      uni.openLocation({
        latitude: value.latitude - 0, //要去的纬度-地址
        longitude: value.longitude - 0, //要去的经度-地址
        name: value.name, //地址名称
        address: value.address, //详细地址名称
        success: function () {
          console.log('导航成功');
        },
        fail: function (error) {
          console.log(error);
        },
      });
    },
    onOpenMobile(value) {
      uni.makePhoneCall({
        phoneNumber: value.mobile,
        success: result => {},
        fail: error => {},
      });
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
  /deep/.u-input {
    border: 0;
    background: #fff;
    padding: 0 0 0 20rpx !important;
    border-radius: 10rpx 0 0 10rpx;
  }
  /deep/ .u-icon__icon {
    color: red !important;
  }
  .search-bt-box {
    border-radius: 0 10rpx 10rpx 0;
    text-align: center;
    height: 60rpx;
    left: 60rpx;
    padding: 0 10rpx;

    display: flex;
    align-items: center;
    background: #dddddd;
  }
}
.shop-one {
  margin: 20rpx;
  background-color: #fff;
  padding: 24rpx;
  border-radius: 20rpx;
  .shop-img {
    width: 128rpx;
    height: 128rpx;
    border-radius: 16rpx;
  }
  .score image {
    display: inline-block;
  }
  .diy-shop .col {
    padding-left: 30rpx;
  }

  .shop-btns {
    border-top: 1px solid #f5f5f5;
    margin-top: 24rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24rpx;
    font-weight: 700;

    > view {
      flex: 1;
      &:nth-child(2) {
        border-left: 1px solid #f5f5f5;
      }
    }
  }
}

.swiper {
  height: 360rpx;
}
</style>
