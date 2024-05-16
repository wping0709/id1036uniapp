<template>
  <view class="body">
    <view style="height: 100%" class="flex-col">
      <view class="tabs-box">
        <u-tabs
          @change="tabsChange"
          :list="tabsList"
          lineColor="#ff4544"
        ></u-tabs>
      </view>
      <scroll-view scroll-y class="flex-h-1">
        <view class="scroll-view" v-if="list.length">
          <view
            class="coupon-item"
            @click="
              $utils.toUrl(
                item.mch_id > 0
                  ? '/mch/shop/shop?mch_id=' + item.mch_id
                  : '/pages/coupon-detail/coupon-detail?user_coupon_id=' +
                      item.user_coupon_id
              )
            "
            v-for="(item, index) in list"
            :key="index"
          >
            <image
              v-if="status == 0"
              :src="wxapp_img.img_coupon_bg_0"
              class="bg-img"
              mode=""
            />
            <image
              v-else
              :src="wxapp_img.img_coupon_bg_1"
              class="bg-img"
              mode=""
            />

            <image
              v-if="status == 1"
              class="bg-icon"
              :src="wxapp_img.img_coupon_status_icon_1"
            />
            <image
              class="bg-icon"
              v-else-if="status == 2"
              :src="wxapp_img.img_coupon_status_icon_2"
            />
            <view class="coupon-item-content">
              <view class="left flex-col flex-y-center flex-x-center">
                <view class="u-line-1 font-center"
                  >￥{{ item.sub_price }}</view
                >
                <view class="u-line-1 font-center"
                  >￥{{ item.min_price }}</view
                >
              </view>
              <view class="right flex-col flex-x-center">
                <view>{{ item.event_desc }}</view>
                <view class="font-22 m-y-10"
                  >{{ item.begin_time }}-{{ item.end_time }}</view
                >
                <view>
                  <template v-if="item.appoint_type == null">全场通用</template>
                  <template v-else-if="item.appoint_type == 1">
                    <view v-if="!item.cat.length">全场通用</view>
                    <view v-else class="u-line-1">
                      仅限
                      <text v-for="(cat, index) in item.cat" :key="index"
                        >{{ cat.name }}、</text
                      >
                      产品使用
                    </view>
                  </template>
                  <template
                    v-else-if="
                      coupon.appoint_type == 2 && coupon.goods.length == 0
                    "
                    >全场通用</template
                  >
                </view>
              </view>
            </view>
          </view>
          <u-loadmore :status="more"></u-loadmore>
        </view>
        <view v-else class="scroll-view">
          <u-empty
            mode="data"
            :icon="wxapp_img.empty_data"
          ></u-empty>
        </view>
      </scroll-view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      tabsList: [
        {
          name: "未使用",
        },
        {
          name: "已失效",
        },
      ],
      list: [],
      status: 0,
      more: "loadmore",
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.user.card(
        { page: this.page, status: this.status + 1 },
        true
      );
      this.page++
      this.list.push(...res.data.list);
      if(this.list.length >= res.data.row_count) this.more = 'nomore'
    },
    tabsChange(v) {
      this.status = v.index;
      this.resetPageData()
      this.loadData();
    },
    resetPageData() {
      this.page = this.$options.data().page
      this.more = this.$options.data().more
      this.list = this.$options.data().list
    }
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {
    this.page++
    this.loadData()
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
  .tabs-box {
    background: #fff;
  }
  .scroll-view {
    padding: 40rpx 0;
    padding-bottom: 40rpx;
    padding-bottom: cacl(env(safe-area-inset-bottom) + 40rpx);
    .coupon-item {
      position: relative;
      margin: 0 auto 20rpx;
      width: 682rpx;
      height: 152rpx;
      .bg-img {
        width: 100%;
        height: 100%;
      }
      .bg-icon {
        position: absolute;
        right: 0;
        top: 0;
        width: 140rpx;
        height: 100rpx;
      }
      .coupon-item-content {
        position: absolute;
        left: 0;
        top: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        .left {
          color: #fff;
          width: 200rpx;
          height: 100%;
        }
        .right {
          padding-left: 20rpx;
          width: 0;
          flex: 1;
          height: 100%;
          color: #666;
        }
      }
    }
  }
}
</style>
