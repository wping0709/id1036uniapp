<template>
  <view class="body flex-col">
	  <!-- #ifdef H5 -->
	  <!-- <view class="diy_header">
	  	<u-icon name="arrow-left" size="20" @click="backPrevious()"></u-icon>
	  </view> -->
	  <!-- #endif -->
    <view class="flex-y-center tabs-box font-28 bg-fff">
      <view @click="clickTab(0)" :class="sort == 0 && 'active-tab'">综合</view>
      <view @click="clickTab(1)" :class="sort == 1 && 'active-tab'">最新</view>
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
      <view @click="clickTab(3)" :class="sort == 3 && 'active-tab'">销量</view>
      <view @click="showPinpai">{{
        selectPinpai ? selectPinpai.brand_name : '品牌'
      }}</view>
    </view>
    <scroll-view
      @scrolltolower="scrollBottom"
      style="flex: 1; height: 0"
      scroll-y
    >
      <GoodsList
        :goodsList="goods_list"
        :is_sales="store.is_sales"
        pageUrl="/pages/goods/goods"
      ></GoodsList>
      <u-loadmore :status="loadBottom ? 'nomore' : 'loadmore'" />

      <TabBar></TabBar>

      <!-- 品牌弹框 -->
      <u-popup :show="isShowPinPai" @close="showPinpai" mode="top">
        <view class="popup-box">
          <view v-if="pinPaiList.length" class="pinpai flex flex-wrap bg-fff">
            <view
              @click="switchIndex(index)"
              :class="activePinPaiIndex == index && 'active-pinpai'"
              class="active u-line-1"
              v-for="(item, index) in pinPaiList"
              :key="index"
            >
              {{ item.brand_name }}
            </view>
          </view>
          <view v-else class="bg-fff">
            <u-empty mode="data"></u-empty>
          </view>
          <view class="popup-bt-box flex-y-center">
            <view @click="resetPinpai" style="background: #fff">重置</view>
            <view @click="confirm" style="background: #f00; color: #fff"
              >确定</view
            >
          </view>
        </view>
      </u-popup>
    </scroll-view>

    <QOfficialAccount></QOfficialAccount>

  </view>
</template>

<script>
import TabBar from '@/components/TabBar';
import GoodsList from '@/components/goods/GoodsList';
import share from '@/mixins/share.js';
export default {
  name: 'Lists',
  mixins: [share],

  data() {
    return {
      params: {},
      page: 1,
      sort: 0,
      sort_type: 1,
      goods_list: [],
      loadBottom: false,
      pinPaiList: [],
      isShowPinPai: false,
      activePinPaiIndex: -1,
      selectPinpai: '',
    };
  },
  components: {
    TabBar,
    GoodsList,
  },
  onLoad(params) {
    this.params = params;
    this.loadData();
    this.getPinpai();
  },

  methods: {
    switchIndex(i) {
      this.activePinPaiIndex = i;
    },
    async loadData() {
      if (this.loadBottom) return;
      const formData = {
        ...this.params,
        page: this.page,
        sort: this.sort,
        sort_type: this.sort_type,
        brand_id: this.selectPinpai.id,
      };
      const res = await this.$requestAll.default.goodsList(formData, true);
      this.goods_list.push(...res.data.list);
      // 是否加载完
      this.loadBottom = this.goods_list.length == res.data.row_count;
    },
    // 获取品牌列表
    async getPinpai() {
      const res = await this.$requestAll.default.getPinPaiList({
        cat_id: this.params.cat_id,
      });
      this.pinPaiList = res.data.list;
    },
    clickTab(index) {
      if (index == 2) {
        if (this.sort_type == 0) {
          this.sort_type++;
        } else {
          this.sort_type--;
        }
      }
      this.sort = index;
      this.page = 1;
      this.goods_list = [];
      this.loadBottom = false;
      this.loadData();
    },
    showPinpai() {
      this.isShowPinPai = !this.isShowPinPai;
    },
    // 触底
    scrollBottom() {
      this.page++;
      this.loadData();
    },
    confirm() {
      // if (this.activePinPaiIndex == "") return;
      this.selectPinpai = this.pinPaiList[this.activePinPaiIndex];
      this.isShowPinPai = false;
      this.page = 1;
      this.goods_list = [];
      this.loadBottom = false;
      this.loadData();
    },
    resetPinpai() {
      this.selectPinpai = '';
      this.activePinPaiIndex = -1;
      this.isShowPinPai = false;

      this.page = 1;
      this.goods_list = [];
      this.loadBottom = false;
      this.loadData();
    },
	backPrevious() {
		uni.navigateBack({
				delta:1,
			})
	}
  },
  computed: {
    shareData() {
      return {
        path: `/other/list/list${uni.$u.queryParams({
          ...this.params,
          user_id: this.$store.getters['user/userInfo'].id || '',
          store_id:
            this.$store.getters['currentStore'].id || '',
          // #ifdef APP-PLUS
          _platform: 'app',
          // #endif
        })}`,
      };
    },
    store() {
      return this.$store.getters['SHOP_CONFIG'].store;
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  /deep/.u-popup__content {
    background: rgba(0, 0, 0, 0);
  }
  .diy_header{
  	padding: 25rpx;
  	background-color: #ffffff;
  }
}
.tabs-box {
  line-height: 80rpx;
  > view {
    width: 20%;
    text-align: center;
  }
  .active-tab {
    color: #f00;
  }
}
.scroll-box {
  display: flex;
  flex-wrap: wrap;
  padding-top: 10rpx;
  .goods-item {
    background: #fff;
    width: 360rpx;
    border-radius: 10rpx;
    overflow: hidden;
    margin: 10rpx;
    margin-top: 0;
    &:nth-child(2n) {
      margin-left: 0;
    }
    .goods-pic > image {
      width: 360rpx;
      height: 360rpx;
    }
    .goods-txt {
      padding: 10rpx;
      .goods-des {
        line-height: 36rp;
        height: 72rpx;
      }
    }
  }
}

.popup-box {
  .pinpai {
    > view {
      background: #f5f5f5;
      width: 50%;
      padding: 20rpx;
      text-align: center;
    }
    .active-pinpai {
      color: #f00;
    }
  }

  .popup-bt-box {
    border-radius: 0 0 30rpx 30rpx;
    overflow: hidden;
    > view {
      line-height: 80rpx;
      font-size: 30rpx;
      text-align: center;
      width: 50%;
    }
  }
}
</style>
