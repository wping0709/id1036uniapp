<template>
  <view class="body">
    <u-form :model="form" labelWidth="200rpx" labelAlign="right">
      <u-form-item @click="showPicker = true" label="快递公司">
        <u-picker
          @cancel="showPicker = false"
          @confirm="pickerConfirm"
          :show="showPicker"
          :columns="[order.express_list]"
          keyName="express"
        ></u-picker>
        <view
          style="padding: 6px 9px"
          class="flex-y-center flex-x-sb font-right"
        >
          <view>
            <text v-if="form.express">{{ form.express }}</text>
            <text v-else class="color-999">请选择快递公司</text>
          </view>
          <view class="iconfont icon-arrow-right"></view>
        </view>
      </u-form-item>
      <u-form-item label="快递单号" required>
        <u-input
          v-model="form.express_no"
          placeholder="请输入快递单号"
          border="none"
        ></u-input>
      </u-form-item>
      <u-form-item label="商家留言">
        <u-input
          v-model="form.words"
          placeholder="选填"
          border="none"
        ></u-input>
      </u-form-item>
    </u-form>

    <div class="submit" @click="submit">提交</div>
  </view>
</template>
<script>
export default {
  data() {
    return {
      id: '',
      pageType: '',
      order: '',
      showPicker: false,
      form: {
        express: '',
        words: '',
        express_no: '', //快递单号
      },
    };
  },
  onLoad(params) {
    this.id = params.id;
    if (this.id) uni.setNavigationBarTitle({ title: '修改物流' });
    this.pageType = params.pageType;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      if (this.pageType == 'mh') {
        var res = await this.$requestAll.mch.mhDetail({ id: this.id });
      } else if (this.pageType == 'ms') {
        var res = await this.$requestAll.mch.msDetail({ id: this.id });
      } else if (this.pageType == 'pt') {
        var res = await this.$requestAll.mch.ptDetail({ id: this.id });
      } else if (this.pageType == 'yy') {
        var res = await this.$requestAll.mch.yyDetail({ id: this.id });
      } else if (this.pageType == 'admin') {
        var res = await this.$requestAll.admin.exDetail({ order_id: this.id });
      } else {
        var res = await this.$requestAll.mch.orderDetail({ id: this.id });
      }

      this.form = {
        express_no: res.data.order.express_no,
        express:
          res.data.order.express ||
          res.data.order.express_list[0].express ||
          '',
        words: res.data.order.words,
      };
      this.order = res.data.order;
    },
    pickerConfirm(e) {
      let { value } = e;
      console.log(value);
      this.form.express = value[0].express;
      this.showPicker = false;
    },
    async submit() {
      if (!this.form.express) return uni.$u.toast('请选择快递类型');
      if (!this.form.express_no) return uni.$u.toast('请填写快递单号');
      var formData = {
        order_id: this.id,
        send_type: 'express',
        ...this.form,
      };
      if (this.pageType == 'mh') {
        var res = await this.$requestAll.mch.mhSend(formData, true);
      } else if (this.pageType == 'ms') {
        var res = await this.$requestAll.mch.msSend(formData, true);
      } else if (this.pageType == 'pt') {
        var res = await this.$requestAll.mch.ptSend(formData, true);
      } else if (this.pageType == 'yy') {
        var res = await this.$requestAll.mch.yySend(formData, true);
      } else if (this.pageType == 'admin') {
        var res = await this.$requestAll.admin.orderSend(formData, true);
      } else {
        var res = await this.$requestAll.mch.orderSend(formData, true);
      }
      uni.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: res => {
          if (res.confirm) {
            this.$utils.backTo();
          }
        },
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
  /deep/.u-form {
    background: #fff;
    text,
    view {
      font-size: 30rpx;
    }
  }
  .submit {
    font-size: 32rpx;
    margin: 50rpx;
    text-align: center;
    line-height: 80rpx;
    color: #fff;
    background: red;
    border-radius: 20rpx;
  }
}
</style>
