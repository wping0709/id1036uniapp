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
        :scrollable="false"
        @change="clickTab"
      ></u-tabs>
    </view>
	
	<div class="list">
	  <div
	    class="item bg-fff m-b-20 m-x-20 p-x-20"
	    
	  >
	    <view class="flex-x-sb flex-y-center">
	      <text>订单总额：{{total_price}}元</text>
		  <text>总计佣金：{{total_parent_price}}元</text>
	   
	    
	    </view>
		<view class="flex-x-sb flex-y-center border-b">
		  <text>已结佣金：{{settled_price}}元</text>
		  <text>未结佣金：{{unsettled_price}}元</text>
			   
		
		</view>
  
	  </div>
	</div>

    <scroll-view @scrolltolower="loadData" scroll-y class="content flex-h-1">
      <view class="scroll-box" v-if="list.length">
        <div class="list">
          <div
            class="item bg-fff m-b-20 m-x-20 p-x-20"
            v-for="(item, i) in list"
            :key="i"
          >
            <view class="flex-x-sb flex-y-center border-b">
              <text>订单号：{{ item.order_no }}</text>

              <text class="price-color">
                {{ item.status }}
              </text>
            </view>
            <view @click="onClickItem(item)" class="flex-y-center flex-x-sb">
              <view class="">
                <image :src="item.avatar_url" mode="aspectFill" />
                <text>{{ item.nickname }}</text>
              </view>

              <view>{{ item.share_status }}</view>

              <view class="flex-y-center">
                <text>
                  预计佣金
                  <text class="price-color">{{ item.share_money }}</text>
                  元
                </text>
                <text class="iconfont icon-arrow-right"></text>
              </view>
            </view>
            <template v-if="item.showGoods">
              <view
                class="goods flex-y-center"
                v-for="(goods, i1) in item.orderDetail"
                :key="i1"
              >
                <image :src="goods.goods_pic" mode="aspectFill" />
                <view class="m-l-20 flex-w-1 font-26">
                  <view class="goods-name u-line-2">{{ goods.name }}</view>
                  <view>x{{ goods.num }}</view>
                </view>
              </view>
            </template>
          </div>
        </div>
        <u-loadmore :status="more"></u-loadmore>
      </view>
      <view class="scroll-box" v-else>
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
      list1: [
        {
          name: '全部',
        },
        {
          name: '待付款',
        },
        {
          name: '已付款',
        },
        {
          name: '已完成',
        },
      ],
      pageData: '',
      status: 0,
      list: [],
      page: 1,
      more: 'loadmore',
	  settled_price:0,
	  total_parent_price:0,
	  total_price:0,
	  unsettled_price:0,
      custom: {}
    };
  },
  onLoad() {
    this.getShareData()
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.more == 'nomore') return;
      const res = await this.$requestAll.share.getOrder(
        {
          status: this.status - 1,
          page: this.page,
        },
        true
      );
      console.log(res.data);
	  this.settled_price = res.info.settled_price;
	  this.total_parent_price = res.info.total_parent_price;
	  this.total_price = res.info.total_price;
	  this.unsettled_price = res.info.unsettled_price;
      this.list.push(...res.data);
      this.more = res.data.length < 10 ? 'nomore' : 'loadmore';
      this.page++;
    },
     async getShareData() {
      const res1 = await this.$requestAll.share.getInfo({}, true);
      this.custom = res1.data.custom;
      if(this.custom.menus.order) {
        uni.setNavigationBarTitle({
          title: this.custom.menus.order.name ,
        });
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
    onClickItem(item) {
      item.showGoods = !item.showGoods;
      this.$forceUpdate();
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
}

.list {
  padding-top: 20rpx;
  .item {
    border-radius: 20rpx;
    > view {
      min-height: 100rpx;
      image {
        width: 70rpx;
        height: 70rpx;
        margin-right: 10rpx;
      }
    }
    .goods {
      padding-bottom: 20rpx;
      > image {
        width: 100rpx;
        height: 100rpx;
      }
      .goods-name {
        line-height: 32rpx;
        height: 64rpx;
      }
    }
  }
}
</style>
