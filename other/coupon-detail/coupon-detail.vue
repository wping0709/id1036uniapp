<template>
  <view v-if="pageData" class="body">
    <view class="content">
      <view class="top">
        <view>￥{{ pageData.sub_price }}</view>
        <view>{{ pageData.min_price_desc }}</view>
        <view>
          <text v-if="pageData.status == 0">未使用</text>
          <text v-if="pageData.status == 1">已使用</text>
          <text v-if="pageData.status == 2">已过期</text>
        </view>
      </view>
      <view class="bottom">
        <view>
          <view class="color-999 title">有效期</view>
          <view class="font-26"
            >{{ pageData.begin_time }}~{{ pageData.end_time }}</view
          >
        </view>
        <view>
          <view class="color-999 title">使用规则</view>
          <view class="font-26">
            <template v-if="pageData.appoint_type == null">全场通用</template>
            <!-- 指定分类 -->
            <template v-else-if="pageData.appoint_type == 1">
              <view v-if="!pageData.cat.length">全场通用</view>
              <view v-else class="u-line-1">
                仅限
                <text v-for="(cat, index) in pageData.cat" :key="index"
                  >{{ cat.name }}、</text
                >
                产品使用
              </view>
            </template>
            <!-- 指定商品 -->
            <template v-else-if="pageData.appoint_type == 2">
              <view v-if="!pageData.goods || !pageData.goods.length" class="">
                全场通用
              </view>
              <view
                v-else
                @click="
                  $utils.toUrl('/other/list/list?goods_id=' + pageData.goods)
                "
                class=""
              >
                指定商品（点击查看）</view
              >
            </template>
            <template v-else-if="pageData.appoint_type == 3">当面付</template>
          </view>
        </view>
        <view>
          <view class="color-999 title">使用说明</view>
          <view class="font-26">
            {{ pageData.rule }}
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      user_coupon_id: '',
      coupon_id: '',
    };
  },
  onLoad(params) {
    console.log(params);
    this.user_coupon_id = params.user_coupon_id;
    this.coupon_id = params.coupon_id;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.coupon.detail(
        {
          user_conpon_id: this.user_coupon_id || 0,
          coupon_id: this.coupon_id,
        },
        true
      );
      this.pageData = res.data.list;
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
  padding-top: 30rpx;
  padding-bottom: 30rpx;
  background: #ff7b33;
  min-height: 100vh;

  .content {
    background: #fff;
    margin: 0 30rpx 0;
    border-radius: 20rpx;

    .top {
      position: relative;

      padding: 90rpx 0 70rpx;
      text-align: center;
      border-bottom: 2rpx dashed #eee;

      > view:nth-child(1) {
        font-size: 60rpx;
        font-weight: 600;
      }

      > view:nth-child(2) {
        margin: 20rpx 0;
        font-size: 26rpx;
      }

      > view:nth-child(3) {
        margin: 0 auto;
        width: 180rpx;
        line-height: 60rpx;
        border-radius: 30rpx;
        color: #999;
        background: #f5f5f5;
      }

      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 100%;
        transform: translate(-50%, -50%);
        background: #ff7b33;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
      }

      &::before {
        content: '';

        position: absolute;
        right: 0;
        top: 100%;
        transform: translate(50%, -50%);
        background: #ff7b33;
        width: 40rpx;
        height: 40rpx;
        border-radius: 50%;
      }
    }

    .bottom {
      padding: 50rpx 30rpx;

      > view {
        margin-bottom: 40rpx;

        &:nth-last-child(1) {
          margin-bottom: 0;
        }
      }

      .title {
        margin-bottom: 20rpx;
      }
    }
  }
}
</style>
