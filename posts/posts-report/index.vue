<template>
  <view v-if="!store.is_shenhe" class="body">
    <view class="item-title p-24 font-26 color-666">已选投诉原因</view>
    <div class="flex-x-sb flex-y-center bg-fff p-24">
      <view class="font-w-600 font-30">涉及色情暴力</view>
      <view class="iconfont icon-duihao" style="color: #09bb07"></view>
    </div>

    <view class="item-title p-24 font-26 color-666">投诉描述</view>
    <view class="bg-fff p-24">
      <view class="font-w-600 font-30 p-b-24">投诉内容</view>
      <u-textarea
        v-model="form.decs"
        placeholder="详细的描述有助于我们快速定位问题"
        border="none"
        count
        maxlength="100"
      ></u-textarea>
      <view class="p-y-24 flex-x-sb">
        <view class="font-w-600 font-30">证据截图（选填） </view>
        <view class="font-24 color-999">{{ fileList.length }}/4</view>
      </view>
      <view>
        <Upload
          :maxCount="4"
          type="image"
          :fileList.sync="fileList"
          width="154rpx"
          height="154rpx"
        ></Upload>
      </view>
    </view>

    <view class="item-title p-24 font-26 color-666">联系方式（选填）</view>
    <view class="bg-fff p-24">
      <u-input
        v-model="form.mobile"
        placeholder="请填写你的手机号码"
        border="none"
      ></u-input>
    </view>
    <view class="submit-bt" @click="submit">提交</view>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import Upload from '@/components/Upload';
export default {
  components: {
    Upload,
  },
  data() {
    return {
      form: {
        type: 1,
        decs: '',
        mobile: '',
        posts_id: '',
      },
      fileList: [],
    };
  },
  onLoad(params) {
    this.form.posts_id = params.posts_id;
  },
  onShow() {},
  methods: {
    async submit() {
      let formData = JSON.parse(JSON.stringify(this.form));
      formData.pic_url = this.fileList.map(item => item.url).join(',');
      console.log(formData);
      const res = await this.$requestAll.posts.postsReport(formData, true);
      uni.showModal({
        content: res.msg,
        showCancel: false,
        success: ({ confirm }) => {
          confirm && this.$utils.backTo();
        },
        fail: () => {},
        complete: () => {},
      });
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

  /deep/.u-textarea {
    padding: 0;
  }
  /deep/.u-input {
    padding: 0 !important;
  }
  .submit-bt {
    margin: 0 auto;
    margin-top: 30rpx;
    width: 700rpx;
    line-height: 80rpx;
    border-radius: 10rpx;
    background: #09bb07;
    color: #fff;
    text-align: center;
  }
}
</style>
