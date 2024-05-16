<template>
  <view v-if="pageData" class="body">
    <view class="text">
      <u-textarea
        v-model="questions"
        placeholder="请输入功能反馈内容，我们尽快给您解决。"
      ></u-textarea>
    </view>

    <view>
      <SubmitForm
        v-if="form.list && form.list.length"
        :form.sync="form"
      ></SubmitForm>
      <view class="bt" @click="submit"> 提交 </view>
    </view>
  </view>
</template>
<script>
import SubmitForm from '@/pages/order-submit/components/SubmitForm';
export default {
  components: {
    SubmitForm,
  },
  data() {
    return {
      pageData: '',
      form: {},
      questions: '',
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.accountSettings.feedbackForm({}, true);
      this.pageData = res.data;
      this.form = { name: '', list: res.data };
    },
    switchTabs(value, list) {
      list.forEach(item => {
        item.is_selected = 0;
      });
      value.is_selected = value.is_selected < 1 ? 1 : 0;
      this.$forceUpdate();
    },
    async submit() {
      try {
        // 表单验证
        if (this.form.list && this.form.list.length) {
          this.form.list.forEach((item, i) => {
            if (item.required == 1) {
              if (!item.default.length)
                throw { msg: item.tip || `必填项“${item.name}”不能为空` };

              if (
                item.type === 'checkbox' &&
                !item.default_list.some(it => it.is_selected)
              )
                throw { msg: item.tip || `必填项“${item.name}”不能为空` };
            }
          });
        }

        const formData = {
          type: 1,
          form: JSON.stringify(this.form.list),
          questions: this.questions,
        };
        const res = await this.$requestAll.accountSettings.feedbackSubmit(
          formData,
          true
        );
        uni.showModal({
          title: '提示',
          content: '提交成功',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              this.$utils.backTo();
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          },
        });
      } catch (err) {
        if (err.msg) uni.$u.toast(err.msg);
        console.log(err);
      }
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
  padding-bottom: env(safe-area-inset-bottom);
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  /deep/.u-textarea {
    border: 0;
  }
  .item {
    margin: 4rpx 0;
    background: #fff;
    min-height: 100rpx;
    .key {
      min-width: 180rpx;
      padding-right: 20rpx;
      text-align: right;
      font-size: 28rpx;
    }
    .content {
      flex: 1;
      width: 0;
      flex-wrap: wrap;
      .content-item {
        margin: 20rpx;
        margin-left: 0;
        line-height: 60rpx;
        padding: 0 30rpx;
        border-radius: 30rpx;
        border: 2rpx solid #eee;
      }
      .check {
        border-color: red;
        color: red;
      }
    }
  }
  .bt {
    margin: 30rpx auto 0;
    border-radius: 50rpx;
    width: 700rpx;
    color: #fff;
    text-align: center;
    line-height: 80rpx;
    font-size: 32rpx;
    font-weight: 600;
    background-color: #f1400c;
  }
}
</style>
