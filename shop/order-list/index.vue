<template>
  <view class="page-body flex-col">
    <div class="bg-fff">
      <u-tabs
        lineColor="#FF1B22"
        @change="tabsChange"
        :current="current"
        :list="tabsList"
        :scrollable="false"
      ></u-tabs>
    </div>
    <scroll-view scroll-y class="flex-h-1" @scrolltolower="scrolltolower">
      <div v-if="pageData.list.length" class="list">
        <div v-for="(item, index) in pageData.list" :key="index" class="item">
          <div class="flex-y-center">
            <div class="flex-w-1 m-r-10 font-w-600">
              订单编号：{{ item.order_no }}
            </div>
            <div style="color: #ff1b22; font-size: 24rpx">
              {{ item.status_text }}
            </div>
          </div>

          <div :class="['goods-list', item.is_open && 'goods_open']">
            <div
              class="goods flex"
              v-for="goods in item.goods_list"
              :key="goods.goods_id"
            >
              <image :src="goods.goods_pic" mode="aspectFill"></image>
              <div class="flex-w-1 m-l-20">
                <div class="u-line-2" style="height: 84rpx">
                  {{ goods.goods_name }}
                </div>
                <div class="color-999 font-24 flex-y-center m-t-8">
                  <div class="u-line-1 flex-w-1">
                    <text v-for="(attr, index) in goods.attr_list" :key="index">
                      {{ attr.attr_name }}：{{ attr.attr_group_name
                      }}{{ goods.attr_list.length > index + 1 ? "，" : "" }}
                    </text>
                  </div>
                  <div class="m-l-20">x{{ goods.num }}</div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="item.goods_list.length > 1"
            @click="switchItemH(index)"
            class="font-24 color-999 m-t-24 flex-y-center flex-x-center"
          >
            <text class="m-r-10">{{
              item.is_open ? "点击收起" : "显示更多详情"
            }}</text>
            <text
              v-if="!item.is_open"
              class="iconfont icon-arrow-bottom"
            ></text>
            <text v-else class="iconfont icon-arrow-top"></text>
          </div>
          <div class="border-b m-y-24"></div>
          <div class="flex-y-center">
            <div class="flex-w-1 font-24 flex-y-center">
              <image
                class="avatar_url"
                :src="item.avatar_url"
                mode="aspectFill"
              ></image>
              <div class="m-l-20">{{ item.nickname }}</div>
            </div>
            <div class="font-26">
              自动返现 · 预佣金：<text class="font-w-600 price-color"
                >¥{{ item.price }}</text
              >
            </div>
          </div>
        </div>
        <u-loadmore :status="pageData.loadmoreStatus"></u-loadmore>
      </div>
      <u-empty v-else mode="data"></u-empty>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      tabsList: [
        {
          name: "全部",
        },
        {
          name: "待付款",
        },
        {
          name: "已付款",
        },
        {
          name: "已完成",
        },
      ],
      pageData: {
        page: 1,
        pageSize: 10,
        list: [],
        loadmoreStatus: "loadmore",
      },
      current: 0,
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(reset, fn) {
      if (reset) {
        let { pageData } = this.$options.data();
        this.pageData = pageData;
      }
      if (this.pageData.loadmoreStatus == "nomore") return;
      const res = await this.$requestAll.recommend.orderList(
        {
          page: this.pageData.page,
          pageSize: this.pageData.pageSize,
          status: this.current,
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.pageData.loadmoreStatus =
        res.data.list.length < this.pageData.pageSize ? "nomore" : "loadmore";
      this.pageData.page++;
      fn && fn();
    },
    tabsChange(e) {
      this.current = e.index;
      this.loadData(true);
    },
    switchItemH(index) {
      let item = this.pageData.list[index];
      item.is_open = !item.is_open;
      this.$set(this.pageData.list, index, item);
    },
	scrolltolower(){
		this.loadData(false, () => uni.stopPullDownRefresh());
	}
  },
  computed: {},
  watch: {},
  onReachBottom() {
  },
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
/deep/.u-tabs {
  .u-tabs__wrapper__nav__line {
    bottom: 14rpx !important;
  }
}
.page-body {
  height: 100vh;
  background: #f2f2f2;
  .list {
    padding-top: 24rpx;
    padding-bottom: env(safe-area-inset-bottom);
    .item {
      margin-bottom: 24rpx;
      background: #fff;
      padding: 24rpx 30rpx;
      .goods-list {
        height: 170rpx;
        overflow: hidden;
        .goods {
          height: 170rpx;
          padding-top: 30rpx;
          > image {
            width: 140rpx;
            height: 140rpx;
            background: #f2f2f2;
            border-radius: 10rpx 10rpx 10rpx 10rpx;
          }
        }
      }
      .goods_open {
        height: auto;
      }
      .avatar_url {
        width: 48rpx;
        height: 48rpx;
        border-radius: 50%;
      }
    }
  }
}
</style>
