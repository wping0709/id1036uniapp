<template>
  <view class="body flex-col">
    <view class="head flex-y-center flex-x-sb">
      <view class="tabs flex-y-center">
        <view @click="tabsIndex = 0" :class="tabsIndex == 0 && 'activeTabs'"
          >商品</view
        >
        <view @click="tabsIndex = 1" :class="tabsIndex == 1 && 'activeTabs'"
          >店铺</view
        >
      </view>
      <view @click="isModify = !isModify">编辑足迹</view>
    </view>
    <scroll-view scroll-y class="scroll flex-h-1">
      <WCalendar @switchDate="switchDate"></WCalendar>

      <view class="content">
        <view class="title-date font-600-32 color-666 m-b-20">{{
          selctDate.date
        }}</view>
        <template v-if="tabsIndex == 0">
          <GoodsList
            ref="goodsList"
            v-if="pageData.re_arr && pageData.re_arr.length"
            :list="pageData.re_arr"
            @onDel="onDel"
            @allChange="check => (this.allCheck = check)"
            @allCheckChange="v => (allCheck = v)"
            :isModify="isModify"
          ></GoodsList>
          <u-empty
            v-else
            mode="data"
            :icon="wxapp_img.empty_data"
          >
          </u-empty>
        </template>
        <template v-else>
          <ShopList
            v-if="pageData.re_shop_arr.length"
            :list="pageData.re_shop_arr"
            @onDel="onDel"
            :isModify="isModify"
          ></ShopList>
          <u-empty
            v-else
            mode="data"
            :icon="wxapp_img.empty_data"
          >
          </u-empty>
        </template>
      </view>

      <div v-if="isModify" class="fixed">
        <view class="check-box flex-x-sb flex-y-center">
          <view
            @click="$refs['goodsList'].switchAllCheck(!this.allCheck)"
            class="flex-y-center"
          >
            <text
              v-if="!allCheck"
              class="iconfont icon-xuanzekuangmoren color-666 font-50"
            ></text>
            <text
              v-else
              class="iconfont icon-success price-color font-50"
            ></text>
            <text>全选</text>
          </view>
          <view class="bt" @click="delAllCheck"> 删除 </view>
        </view>
      </div>
    </scroll-view>
  </view>
</template>

<script>
import Calendar from './components/Calendar';
import GoodsList from './components/GoodsList';
import ShopList from './components/ShopList';
export default {
  components: {
    WCalendar: Calendar,
    ShopList,
    GoodsList,
  },
  data() {
    return {
      pageData: '',
      tabsIndex: 0,
      selctDate: '',
      isModify: false,
      allCheck: false,
    };
  },
  onLoad() {
    this.loadData()
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.default.browseList(
        {
          day: this.selctDate.date,
        },
        true
      );
      this.pageData = res.data;
    },
    // 切换日期
    switchDate(item) {
      this.selctDate = item;
      this.loadData();
    },

    // 删除浏览记录
    async onDel(item) {
      console.log(item);
      if (this.tabsIndex == 0) {
        await this.$requestAll.default.dleGoodsLog({ id: item.log_id }, true);
      } else {
        await this.$requestAll.default.dleShopLog({ id: item.log_id }, true);
      }
      this.loadData();
    },
    async delAllCheck() {
      const goodsList = this.$refs['goodsList'].goodsList;
      let idtext = '';
      goodsList.forEach(e => {
        if (e.check) {
          idtext += `${idtext.length ? ',' : ''}${e.log_id}`;
        }
      });
      if (!idtext.length) return;
      await this.$requestAll.default.dleGoodsLog({ list: idtext }, true);
      this.loadData();
      this.allCheck = this.$options.data().allCheck
      this.isModify = this.$options.data().isModify
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
}
.head {
  background: #fff;

  padding: 10rpx 25rpx;
  font-size: 30rpx;
  .tabs {
    text-align: center;
    line-height: 70rpx;
    > view {
      padding: 0 20rpx;
    }
  }
  .activeTabs {
    position: relative;
    color: red;
    &::before {
      content: '';
      position: absolute;
      left: 50%;
      bottom: 0;
      transform: translateX(-50%);
      width: 56rpx;
      height: 4rpx;
      background: red;
    }
  }
}
.scroll {
  position: relative;
  padding-bottom: env(safe-area-inset-bottom);

  .content {
    padding: 25rpx 0;
    .title-date {
      padding: 0 25rpx 25rpx;
    }
  }

  .fixed {
    height: 100rpx;
    .check-box {
      background: #fff;
      position: fixed;
      bottom: env(safe-area-inset-bottom);
      width: 100%;
      height: 100rpx;
      > view:nth-child(1) {
        padding-left: 25rpx;
      }
      .bt {
        width: 140rpx;
        line-height: 100rpx;
        background: #ff0000;
        color: #fff;
        font-size: 30rpx;
        text-align: center;
      }
    }
  }
}
</style>
