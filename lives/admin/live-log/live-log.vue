<template>
  <view class="body">
    <div class="log-list" v-if="pageData.list.length">
      <div
        @click="$utils.toUrl('/lives/live/live?room_id=' + item.id)"
        class="log-item flex"
        v-for="(item, index) in pageData.list"
        :key="index"
      >
        <view class="img-box">
          <image :src="item.pic_url" mode="" />
          <view class="status" v-if="item.end_time"> 回放 </view>
          <view class="status" style="background: #7a94fe" v-else-if="item.pre_play_time">
            预约
          </view>
          <view class="status" style="background: #ff5174" v-else>直播中</view>
        </view>
        <div class="log-right flex-w-1">
          <view>{{ item.desc }}</view>
          <view>直播时长: {{ item.start_time }}~{{ item.end_time }}</view>
          <view>
            <text>点赞数 {{ item.good_num }}</text>
            <text class="m-l-20">观看数 {{ item.look_num }}</text>
          </view>
          <view>
            <text>
              销售额
              <text class="price-color">￥{{ item.order_price }}</text>
            </text>
            <text class="m-l-20">
              订单数
              <text class="price-color">{{ item.order_num }}</text>
            </text>
          </view>
        </div>
      </div>
      <u-loadmore :status="pageData.status"></u-loadmore>
    </div>

    <div v-else>
      <u-empty mode="data" :icon="wxapp_img.empty_data">
      </u-empty>
    </div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      anchor_id: '',
    };
  },
  onLoad(params) {
    this.anchor_id = params.anchor_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.pageData.status == 'nomore') return;
      const res = await this.$requestAll.lives.getLiveLog(
        {
          anchor_id: this.anchor_id,
          page: this.pageData.page,
        },
        true
      );
      this.pageData.list.push(...res.data.list);
      this.pageData.status = res.data.list.length < 10 ? 'nomore' : 'loadmore';
      this.pageData.page++;
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {
    this.loadData();
  },
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
}

.log-list {
  .log-item {
    border-bottom: 2rpx solid #eee;
    margin-bottom: 20rpx;
    background: #fff;
    padding: 20rpx;
    font-size: 24rpx;
    color: #666;
    .img-box {
      position: relative;
      > image {
        width: 190rpx;
        height: 190rpx;
        border-radius: 10rpx;
      }
      .status {
        position: absolute;
        bottom: 0;
        left: 0;
        line-height: 1.5;
        padding: 0 10rpx;
        font-size: 22rpx;
        color: #fff;
        border-radius: 10rpx;
        background: #5fd6e6;
      }
    }

    .log-right {
      margin-left: 10rpx;
      > view {
        margin-bottom: 10rpx;
        &:nth-last-child(1) {
          margin-bottom: 0;
        }
      }
      > view:nth-child(1) {
        color: #333;
        font-size: 30rpx;
      }

      .price-color {
        padding-left: 6rpx;
      }
    }
  }
}
</style>
