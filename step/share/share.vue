<template>
  <view v-if="pageData" class="body">
    <image
    @click="previewImg"
      :src="qrcodeUrl"
      class="cur_img"
      mode="aspectFill"
    />

    <view class="font-center m-y-20 font-30">选择模板</view>

    <scroll-view scroll-x="true" style="width: 80vw; margin: 30rpx auto">
      <view class="scroll-box">
        <image
          @click="clickPic(i)"
          :class="curIndex == i && 'check'"
          v-for="(item, i) in pageData.pic_list"
          :key="i"
          :src="item.pic_url"
          mode="aspectFill"
        />
      </view>
    </scroll-view>

    <div @click="onDownLoad" class="keep-bt">保存图片</div>
    <div class="m-y-20 font-24 color-666 font-center">保存至相册</div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: '',
      qrcodeUrl: '',
      curIndex: 0,
      num: 0
    };
  },
  onLoad(params) {
    this.num = params.todayStep || 0
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.step.picList(
        {
          page: 1,
        },
        true
      );
      this.pageData = res.data;

      this.getQrcode()
    },
    async getQrcode() {
      const res = await this.$requestAll.step.qrcode({
        num: this.num,
        goods_id: this.pageData.pic_list[this.curIndex].id
      },true)

      this.qrcodeUrl = res.data.pic_url

    },
    clickPic(i) {
      this.curIndex = i;
      this.getQrcode()
    },
    // 预览图片
    previewImg() {
      uni.previewImage({
        current: this.qrcodeUrl,
        urls:[this.qrcodeUrl]
      })
    },
    // 下载图片
    onDownLoad() {
      console.log(123);
      this.$utils.addImg(this.qrcodeUrl)
    }
  },
  computed: {},
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  padding: 1px;
  background: #f5f5f5;
  min-height: 100vh;

  .cur_img {
    display: block;
    margin: 40rpx auto;
    width: 456rpx;
    height: 708rpx;
    background: #fff;
  }

  .scroll-box {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    > image {
      width: 120rpx;
      min-width: 120rpx;
      height: 144rpx;
      margin: 0 20rpx;
    }
    .check {
      border: 1px solid #ff4544;
    }
  }

  .keep-bt {
    margin: 0 auto;
    width: 456rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    background: #ff4544;
  }
}
</style>
