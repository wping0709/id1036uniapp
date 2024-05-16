<template>
  <view v-if="pageData" class="body">
    <view class="form-box">
      <u--form
        labelPosition="left"
        labelWidth="initial"
        errorType="toast"
        :model="formData"
        :rules="rules"
        ref="uForm"
      >
        <template v-if="pageData.option.is_up_idcard_img == 1">
          <u-form-item >
            <view class="flex-x-center">
              <Upload
                type="image"
                width="680rpx"
                height="320rpx"
                uploadText="身份证正面"
                @change="change"
                :fileList.sync="formData.real_just_pic"
              >
              </Upload>
            </view>
          </u-form-item>
          <u-form-item >
            <view class="flex-x-center">
              <Upload
                type="image"
                width="680rpx"
                height="320rpx"
                uploadText="身份证背面"
                :fileList.sync="formData.real_back_pic"
              ></Upload>
            </view>
          </u-form-item>
        </template>

        <template v-if="pageData.option.is_write_idcard_info == 1">
          <u-form-item label="真实姓名:" prop="real_name">
            <u--input
              v-model="formData.real_name"
              placeholder="请输入真实姓名"
              border="none"
            ></u--input>
          </u-form-item>
          <u-form-item label="身份证号:" prop="real_code">
            <u--input
              v-model="formData.real_code"
              placeholder="请输入身份证号"
              border="none"
            ></u--input>
          </u-form-item>
        </template>

        <template v-if="pageData.form.is_form == 1">
          <u-form-item
            v-for="(item, i) in pageData.form.list"
            :key="i"
            :label="item.name"
            :required="item.required == 1"
          >
            <DiyForm
              :defaultValue="item.default"
              :type="item.type"
              :item="item"
              @itemChange="formItemChange($event, i)"
              :valueChange.sync="item.default"
            ></DiyForm>
          </u-form-item>
        </template>
      </u--form>

      <view v-if="pageData.user_info.is_real == 1" class="bt">审核中</view>
      <view v-else-if="pageData.user_info.is_real == 2" class="bt"
        >审核通过</view
      >
      <view
        v-else-if="pageData.user_info.is_real == 3"
        class="bt"
        @click="submit"
        >未通过，重新提交</view
      >
      <view v-else class="bt" @click="submit">提交</view>
    </view>
  </view>
</template>
<script>
import Upload from '@/components/Upload';
import DiyForm from './components/DiyForm/index';
export default {
  components: {
    Upload,
    DiyForm,
  },
  data() {
    return {
      pageData: '',

      formData: {
        real_name: '',
        real_code: '',
        real_back_pic: [], //后
        real_just_pic: [],
      },
      rules: {
        real_name: {
          type: 'string',
          required: true,
          message: '请填写姓名',
          trigger: ['blur', 'change'],
        },
        real_code: {
          validator: (rule, value, callback) => {
            return uni.$u.test.idCard(value);
          },
          message: '身份证号错误',
          trigger: ['blur', 'change'],
        },
       
      },
      radio: '',
      switchVal: false,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.lives.getConfig({}, true);
      this.formData = {
        ...this.formData,
        real_name: res.data.user_info.real_name,
        real_code: res.data.user_info.real_code,
      };
      if (res.data.user_info.real_back_pic) {
        this.formData.real_back_pic = [
          {
            url: res.data.user_info.real_back_pic,
            type: 'image',
          },
        ];
      }
      if (res.data.user_info.real_just_pic) {
        this.formData.real_just_pic = [
          {
            url: res.data.user_info.real_just_pic,
            type: 'image',
          },
        ];
      }
      this.pageData = res.data;
    },
    formItemChange(item, i) {
      this.$set(this.pageData.form.list, i, item);
    },
    submit() {
      this.$refs.uForm.validate().then(async res => {
        try {
          if (this.pageData.form.is_form == 1) {
            this.pageData.form.list.forEach(item => {
              if (item.required == 1 && !item.default) throw { msg: item.name };
            });
          }

          var formData = JSON.parse(JSON.stringify(this.formData));

          if (this.pageData.option.is_up_idcard_img == 1) {
            if(!formData.real_just_pic.length || !formData.real_just_pic[0].url) throw {msg:'身份证正面图片'}
            if(!formData.real_back_pic.length || !formData.real_back_pic[0].url) throw {msg:'身份证反面图片'}
            formData.real_just_pic = formData.real_just_pic[0].url;
            formData.real_back_pic = formData.real_back_pic[0].url;
          }
          if (this.pageData.form.is_form == 1) {
            formData.form = JSON.stringify(this.pageData.form);
          }
          const res = await this.$requestAll.accountSettings.realNameSubmitReal(
            formData,
            true
          );
          uni.$u.toast(res.data);
          setTimeout(() => {
            this.loadData();
          }, 2000);
        } catch (error) {
          console.log(error);
          error.msg && uni.$u.toast('请填写' + error.msg);
        }
      });
    },
    async change(e) {
      if (e.length) {
        const res = await this.$requestAll.accountSettings.realNameIdCardApi({
          imgUrl: e[0].url,
        });
        if (res.data) {
          this.formData.real_name = res.data.realname;
          this.formData.real_code = res.data.idcard;
        }
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
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
}
.form-box {
  padding: 0 30rpx;
  background: #fff;
  .form-item {
    width: 100%;
    height: 100rpx;
    display: flex;
    align-items: center;
  }
  .bt {
    margin: 80rpx 32rpx 0;
    margin: 80rpx 32rpx calc(20rpx + env(safe-area-inset-bottom));
    background-color: #fb2020;
    border-radius: 44rpx;
    color: #fff;
    line-height: 76rpx;
    text-align: center;
  }
}
</style>
