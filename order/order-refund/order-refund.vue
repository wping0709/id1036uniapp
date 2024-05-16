<template>
  <view v-if="pageData" class="body">
    <view
      class="goods-item-style6 p-20 bg-fff"
      @click="$utils.toUrl('/pages/goods/goods?id=' + goods.goods_id)"
    >
      <image
        :src="pageData.goods_pic"
        mode="aspectFill"
        style="width: 200rpx; height: 200rpx"
      />
      <view class="goods-content-style6 flex-w-1 flex-col flex-x-sb">
        <view>
          <view class="goods-title u-line-2">{{ pageData.name }}</view>
        </view>
        <view class="flex-x-sb">
          <text class="u-line-1">
            <text class="m-r-10" v-for="(attr, i) in pageData.attr" :key="i">
              {{ attr.attr_group_name }}: {{ attr.attr_name }}
            </text>
          </text>
          <text>X{{ pageData.num }}</text>
        </view>
      </view>
    </view>

    <view class="bg-fff m-y-20">
      <u-tabs
        :current="tabsIndex"
        :list="[{ name: '退货退款' }, { name: '换货' }]"
        :activeStyle="{
          color: 'red',
        }"
        lineColor="red"
        :scrollable="false"
        @change="clickTab"
      ></u-tabs>
    </view>

    <div class="bg-fff form-label textarea-box">
      <text>售后原因</text>
      <view class="flex-w-1">
        <u--textarea
          v-model="textarea"
          placeholder="请简单描述售后原因"
          border="none"
        ></u--textarea>
      </view>
    </div>

    <template v-if="tabsIndex == 0">
      <div class="bg-fff form-label">
        <text>实退金额</text>
        <text class="flex-w-1 price-color"
          >￥{{ pageData.max_refund_price }}</text
        >
      </div>

      <div class="bg-fff form-label">
        <text>商品金额</text>
        <text class="flex-w-1 price-color">￥{{ pageData.total_price }}</text>
      </div>
    </template>

    <div class="bg-fff form-label textarea-box">
      <text>上传凭证</text>
      <view class="flex-w-1">
        <Upload
          :fileList.sync="fileArr"
          type="image"
          maxCount="6"
          uploadText="上传凭证\n(最多九张)"
        ></Upload>
      </view>
    </div>

    <div class="bottom-btn">
      <div class="fixed">
        <view @click="submit">提交</view>
      </div>
    </div>
  </view>
</template>
<script>
import Upload from '@/components/Upload';
export default {
  components: {
    Upload,
  },
  data() {
    return {
      fileArr: '',
      pageData: '',
      page: 1,
      status: 'loadmore',
      order_id: '',
      tabsIndex: 0,
      textarea: '',
    };
  },
  onLoad(params) {
    this.order_id = params.id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.status == 'nomore') return;
      const res = await this.$requestAll.order.refundPreview(
        {
          order_detail_id: this.order_id,
        },
        true
      );
      this.pageData = res.data;
      this.page++;
    },
    clickTab({ index }) {
      this.tabsIndex = index;
      this.resetPageData();
    },
    async submit() {
      try {
        uni.showLoading({
          title: '加载中',
        });
        if (!this.textarea.trim().length) {
          throw {
            msg: this.tabsIndex == 0 ? '请填写退款原因' : '请填写换货说明',
          };
        }
        var formData = {
          type: this.tabsIndex + 1,
          order_detail_id: this.order_id,
          desc: this.textarea,
          pic_list: '[]',
          orderType: 'STORE',
        };
        if (this.fileArr.length) {
          formData.pic_list = JSON.stringify(
            this.fileArr.map(item => item.url)
          );
        }
        const res = await this.$requestAll.order.orderRefund(formData);
        uni.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false,
          success: () => {
            uni.hideLoading();
            this.$utils.backTo();
          },
        });
      } catch (error) {
        uni.hideLoading();
        uni.$u.toast(error.msg || '程序错误' + error);
        console.log(error);
      }
    },
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  .goods-item-style6 {
    margin-bottom: 20rpx;
    display: flex;
    justify-content: space-between;
    .goods-content-style6 {
      margin-left: 10rpx;
    }
  }

  .form-label {
    display: flex;
    align-items: center;
    padding: 24rpx 20rpx;
    line-height: 40rpx;

    margin: 20rpx 0;
    min-height: 88rpx;
    > text:nth-child(1) {
      margin-right: 20rpx;
    }
  }
  .textarea-box {
    align-items: start;
    /deep/.u-textarea {
      padding: 0;
      line-height: 40rpx;
    }
  }
}

.bottom-btn {
  height: 92rpx;
  height: calc(92rpx + env(safe-area-inset-bottom));
  .fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 92rpx;
    height: calc(92rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    > view {
      cursor: pointer;
      text-align: center;
      line-height: 92rpx;
      background-color: #ff4544;
      color: #fff;
    }
  }
}
</style>
