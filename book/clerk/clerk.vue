<template>
  <div class="clerk" v-if="pageData">
    <div
      @click="$utils.toUrl('/book/details/details?id=' + pageData.goods_id)"
      class="goods-box flex-y-center bg-fff"
    >
      <div class="goods flex-w-1 flex">
        <image :src="pageData.cover_pic" mode="aspectFill"></image>
        <div class="goods-content">
          <div class="goods-name u-line-2">
            {{ pageData.name }}
          </div>
          <div class="attr-list u-line-1 color-999">
            <text class="attr" v-for="(attr, i) in pageData.attr" :key="i">
              {{ attr.attr_group_name }}:{{ attr.attr_name
              }}<template v-if="i < pageData.attr.length - 1">，</template>
            </text>
          </div>

          <div class="m-t-10">
            <text class="color-999 font-del"
              >￥{{ pageData.original_price }}</text
            >
            <text class="price-color font-36 m-l-10"
              >￥{{ pageData.pay_price }}</text
            >
          </div>
        </div>
      </div>
      <div class="iconfont icon-arrow-right font-40 color-666"></div>
    </div>

    <div class="order-info p-20 bg-fff m-t-20">
      <div class="color-666 p-b-20 border-b">订单信息</div>
      <div class="m-t-20">订单号：{{ pageData.order_no }}</div>
      <div class="m-t-20">下单时间：{{ pageData.addtime }}</div>
      <div class="m-t-20" v-for="(item, i) in pageData.orderForm" :key="i">
        {{ item.key }}：{{ item.value }}
      </div>
    </div>

    <div class="bottom">
      <div class="fixed">
        <div class="bt" @click="submit">确认核销</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'clerk',
  components: {},
  props: {},
  data() {
    return {
      id: '',
      pageData: '',
    };
  },
  computed: {},
  methods: {
    async getOrderDetail() {
      const res = await this.$requestAll.book.orderClerkOrderDetails({
        id: this.id,
      });
      this.pageData = res.data;
    },
    submit() {
      uni.showModal({
        title: '提示',
        content: '是否确定核销',
        cancelText: '取消',
        success: async ({ confirm }) => {
          if (confirm) {
            const res = await this.$requestAll.book.clerk(
              { order_id: this.id },
              true
            );
            uni.showModal({
              title: '提示',
              content: '核销成功！',
              showCancel: false,
              success: ({ confirm }) => {
                if (confirm) this.$utils.backTo();
              },
            });
          }
        },
        fail: () => {},
        complete: () => {},
      });
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(params) {
    if (params.scene) {
      this.id = params.scene;
    }
    this.getOrderDetail();
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {},
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
};
</script>

<style lang="scss" scoped>
.clerk {
  min-height: 100vh;
  // #ifndef H5
  min-height: calc(100vh - 44px);
  // #endif
  background: #f5f5f5;
}
.goods-box {
  padding: 20rpx;
  .goods {
    > image {
      width: 208rpx;
      height: 208rpx;
    }
    .goods-content {
      margin-right: 20rpx;
      margin-left: 10rpx;
      .goods-name {
        font-size: 32rpx;
        line-height: 50rpx;
        height: 100rpx;
      }
    }
  }
}

.bottom {
  box-sizing: content-box;

  height: 100rpx;
  padding-bottom: env(safe-area-inset-bottom);

  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: calc(100rpx + env(safe-area-inset-bottom));

    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 30rpx env(safe-area-inset-bottom);
    background: #fff;
    .bt {
      padding: 0 30rpx;
      height: 60rpx;
      line-height: 60rpx;
      text-align: center;
      border: 1px solid #ff4544;
      border-radius: 30rpx;
      color: #ff4544;
    }
  }
}
</style>
