<template>
  <view>
    <view v-if="shopData">
      <Waimai
        class="waimai"
        v-if="shopData.is_waimai"
        :pageData="shopData"
      ></Waimai>

      <!-- diy首页样式 -->
      <DiyHome
        class="diy-home"
        v-else-if="shopData.is_waimai == 0 && shopData.template"
        :pageData="shopData"
      ></DiyHome>

      <view v-else class="diy-body flex-col">
        <DiyHead :shopData="shopData"></DiyHead>

        <view class="list flex-h-1 flex-col">
          <view class="m-y-20 p-x-20 font-36 font-w-600 color-666">
            热销推荐
          </view>

          <scroll-view
            v-if="goodsList.length"
            class="flex-h-1"
            scroll-y
            @scrolltolower="getShopData()"
          >
            <view class="p-x-20">
              <GoodsList :list="goodsList"></GoodsList>
              <u-loadmore :status="status"></u-loadmore>
            </view>
          </scroll-view>

          <u-empty v-else mode="data"></u-empty>
        </view>

        <ToHomeButton></ToHomeButton>
      </view>
    </view>
    <TabBar
      v-if="shopData && !shopData.is_waimai"
      :params="{ tab: 1, mch_id }"
      type="shopTabBar"
    ></TabBar>


    <QOfficialAccount></QOfficialAccount>

  </view>
</template>
<script>
import GoodsList from './components/GoodsList';
import Waimai from './components/Waimai';
import DiyHome from './components/DiyHome.vue';
import TabBar from '@/components/TabBar';
import ToHomeButton from '@/components/ToHomeButton';
import DiyHead from './components/DiyHead.vue';

import share from '@/mixins/share.js';
export default {
  components: {
    GoodsList,
    Waimai,
    DiyHome,
    ToHomeButton,
    TabBar,
    DiyHead,
  },
  mixins: [share],
  data() {
    return {
      goodsList: [],
      mch_id: '',
      shopData: '',
      page_id: '',
      page: 1,
      status: 'loadmore',
    };
  },
  onLoad(params) {
    if (params.scene) {
      params = this.$utils.wxParams(params);
    }
    this.mch_id = params.mch_id;
    this.cat_id = params.cat_id || '';
    this.page_id = params.page_id || '';

    this.tab = params.tab || 1;
    this.cat_id = params.cat_id || '';
    this.getShopData();
  },
  methods: {
    async getShopData() {
      if (this.status == 'nomore') return;
      const formData = {
        mch_id: this.mch_id,
        tab: 1,
        page: this.page,
        page_id: this.page_id,
      };
      var res = await this.$requestAll.mch.indexShop(formData, true);
      
      uni.setNavigationBarTitle({
        title: res.data.shop.name,
      });

      if(!res.data.shop.mch_business) {
        const res = await this.$utils.showModalAsync({content: '店铺已打烊',showCancel: false})
        if(res.confirm) return this.$utils.backTo()
      }

      // 查找是否有优惠卷组件
      if (res.data.template && res.data.template.length) {
        let index = res.data.template.findIndex(item => item.type == 'coupon');
        if (index != -1) {
          res.data.template[index].param.coupon_list = res.data.coupon_list;
        }
      }

      // 默认样式商品列表
      if (this.goodsList.length) {
        this.goodsList.push(...res.data.goods_list);
      } else {
        this.goodsList = res.data.goods_list;
      }
      !this.shopData && (this.shopData = res.data);

      this.status =
        res.data.goods_list && res.data.goods_list.length >= 20
          ? 'loadmore'
          : 'nomore';
      this.page++;
    },
  },
  onShow() {},
  computed: {
    shareData() {
      let shop = this.shopData && this.shopData.shop;
      return {
        title: shop && shop.name,
        imageUrl: shop && shop.share_image,
        path:
          '/mch/shop/shop' +
          uni.$u.queryParams({
            mch_id: this.mch_id,
            user_id: this.$store.getters['user/userInfo'].id || '',
            store_id: this.$store.getters['currentStore'].id || '',
            // #ifdef APP-PLUS
            _platform: 'app',
            // #endif
          }),
      };
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.diy-home {
  /deep/.u-icon__img {
    width: 54rpx !important;
    height: 28rpx !important;
  }
}
.diy-body {
  background: #f5f5f5;
  height: calc(100vh - 115rpx);
  /* #ifdef H5 */
  height: calc(100vh - 44px - 115rpx);
  /* #endif */

  .list {
    .tbs {
      height: 100rpx;
      background: #fff;
      color: #666;
      > .tab {
        padding: 20rpx;
      }
      .select-tab {
        position: relative;
        color: red;
        &::before {
          content: '';
          position: absolute;
          left: 50%;
          bottom: 0;
          transform: translateX(-50%);
          width: 40rpx;
          height: 4rpx;
          background: red;
        }
      }
    }
  }
}
.waimai {
  // 评分五角星更改样式-----------------------------
  /deep/.uicon-star-fill {
    color: #ffd261 !important;
  }
  // 评分五角星更改样式-----------------------------
}
</style>
