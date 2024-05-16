<template>
  <view v-if="pageData" class="body">
    <div class="goods-info">
      <image :src="pageData.goods_pic" mode="" />
      <div class="right flex-w-1">
        <view class="">
          <text>物流状态：</text>
          <text style="color: #25ae5f">{{ pageData.status_text }}</text>
        </view>

        <view>
          <text>快递公司：</text>
          <text>{{ pageData.express }}</text>
        </view>

        <view class="flex-y-center flex-x-sb">
          <view class="u-line-1">
            <text>快递单号：</text>
            <text>{{ pageData.express_no }}</text>
          </view>

          <view
            class="copy-bt"
            @click="$utils.copy(pageData.express_no, '复制单号成功')"
            >复制</view
          >
        </view>
      </div>
    </div>

    <!-- 物流信息 -->
    <view>
      <view
        v-if="pageData && pageData.list && pageData.list.length"
        class="bg-fff p-20"
      >
        <view
          v-for="(item, i) in pageData.list"
          :key="i"
          style="bottom-b m-b-20 p-b-20"
        >
          <view>{{ item.detail }}</view>
          <view>{{ item.datetime }}</view>
        </view>
      </view>
      <view v-else class="font-center font-32 color-999 p-y-10">未查询到物流信息</view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      order_id: '',
      pageType: '',
    };
  },
  onLoad(params) {
    this.order_id = params.id;
    this.pageType = params.pageType || '';
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageType == 'miaosha') {
        var res = await this.$requestAll.miaosha.expressDetail(
          {
            order_id: this.order_id,
          },
          true
        );
      } else if (this.pageType == 'integral') {
        var res = await this.$requestAll.order.expressDetail(
          {
            order_id: this.order_id,
            type: 'IN',
          },
          true
        );
      } else {
        var res = await this.$requestAll.order.expressDetail(
          {
            order_id: this.order_id,
            type: 'mall',
          },
          true
        );
      }
      this.pageData = res.data;
     
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
  min-height: 100vh;
  .goods-info {
    background: #fff;
    padding: 20rpx;
    display: flex;
    > image {
      width: 140rpx;
      height: 140rpx;
      margin-right: 20rpx;
    }
    .right {
      color: #999;
      > view {
        &:nth-child(1) {
          color: #333;
        }
        line-height: 50rpx;
      }

      .copy-bt {
        text-align: center;
        line-height: 50rpx;
        width: 100rpx;
        border-radius: 10rpx;
        border: 2rpx solid #eee;
      }
    }
  }
}
</style>
