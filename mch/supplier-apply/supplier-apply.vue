<template>
  <view v-if="!store.is_shenhe" class="body">
    <template v-if="!isShenhe">
      <u-form
        labelPosition="left"
        labelWidth="160rpx"
        :model="form"
        :rules="rules"
        ref="form1"
        errorType="none"
      >
        <view class="from-title">基本信息</view>
        <u-form-item
          required
          prop="supplier_name"
          label="供货商名称"
          borderBottom
        >
          <u-input
            v-model="form.supplier_name"
            border="none"
            placeholder="请填写供货商名称"
          ></u-input>
        </u-form-item>

        <u-form-item required prop="name" label="联系人" borderBottom>
          <u-input
            v-model="form.name"
            border="none"
            placeholder="请输入联系人"
          ></u-input>
        </u-form-item>

        <u-form-item required prop="mobile" label="联系电话" borderBottom>
          <u-input
            v-model="form.mobile"
            border="none"
            placeholder="请填写联系电话"
          ></u-input>
        </u-form-item>
        <u-form-item required prop="address" label="地址" borderBottom>
          <u-input
            v-model="form.address"
            border="none"
            placeholder="请填写您的地址"
          ></u-input>
        </u-form-item>
        <u-form-item required prop="remarks" label="备注" borderBottom>
          <u-input
            v-model="form.remarks"
            border="none"
            placeholder="备注~"
          ></u-input>
        </u-form-item>
        <u-form-item label="营业执照" borderBottom @click="tishi">
          <Upload
            type="image"
            :fileList.sync="business_list"
            width="300rpx"
            height="200rpx"
          ></Upload>
        </u-form-item>
        <u-form-item label="相关行业许可证" @click="tishi">
          <Upload
            type="image"
            :fileList.sync="food_license_list"
            width="300rpx"
            height="200rpx"
          ></Upload>
        </u-form-item>
      </u-form>

      <view class="font-center m-t-30 color flex-y-center flex-x-center">
        <div
          @click="check = !check"
          v-if="!check"
          class="iconfont icon-xuanzekuangmoren font-40 color-666"
        ></div>
        <div
          @click="check = !check"
          v-else
          class="iconfont icon-success-fill price-color font-40"
        ></div>
        <div @click="check = !check">入驻协议</div>
        <div @click="xieyiPopup = !xieyiPopup" class="price-color"
          >《查看协议》</div
        >
      </view>

      <view v-if="!pageData.apply" class="submit-bt" @click="submit">
        提交
      </view>

      <view
        v-else-if="pageData.apply.type == 2"
        class="submit-bt"
        @click="submit"
      >
        重新提交
      </view>
      <view
        v-if="pageData.apply"
        @click="switchForm"
        style="color: #387ee8"
        class="font-center m-y-30 font-32"
      >
        查看审核结果
      </view>

      <view
        class="font-center m-t-30 color-999"
        @click="$utils.toUrl('/pages/index/index')"
      >
        返回首页
      </view>
    </template>
    <template v-else>
      <view
        v-if="pageData.apply.type == 0"
        class="shenhe-box font-center font-30"
      >
        <view class="flex-y-center flex-x-center">
          <image
            :src="wxapp_img.supplier_shenhe"
            style="width: 390rpx; height: 270rpx"
            mode="aspcetFit"
          />
        </view>
        <view class="m-y-30 color-666">您的信息已提交，请耐心等待审核。</view>
        <view
          @click="switchForm"
          style="color: #387ee8"
          class="font-center p-y-30 font-32"
        >
          查看提交信息
        </view>
      </view>
      <view
        v-if="pageData.apply.type == 2"
        class="shenhe-box font-center font-30"
      >
        <view class="flex-y-center flex-x-center p-t-20">
          <image
            :src="wxapp_img.supplier_cancel"
            style="width: 390rpx; height: 270rpx"
            mode="aspcetFit"
          />
        </view>
        <view class="m-y-30 price-color">
          <view>审核不通过，请重新提交。</view>
          <view v-if="pageData.apply.err_data"
            >备注：{{ pageData.apply.err_data }}</view
          >
        </view>
        <view
          @click="switchForm"
          style="color: #387ee8"
          class="font-center p-y-30 font-32"
        >
          查看提交信息
        </view>
      </view>
      <view
        v-else-if="pageData.apply.type == 1"
        class="shenhe-box font-center font-30"
      >
        <view>
          <image
            :src="wxapp_img.supplier_shenhe_1"
            style="width: 390rpx; height: 270rpx"
            mode="aspcetFit"
          />
        </view>
        <view style="margin: 50rpx 0; color: #1aa349">
          <view>PC端登录供货商后台的网址为：{{ pageData.apply.url }}</view>
          <view class="m-t-20" style="display: inline-block">
            <u-button
              text="复制"
              size="small"
              @click="$utils.copy(pageData.apply.url)"
            ></u-button>
          </view>
          <view
            @click="switchForm"
            style="color: #387ee8"
            class="font-center p-y-30 font-32"
          >
            查看提交信息
          </view>
        </view>
      </view>
    </template>
    <u-popup
      :show="xieyiPopup"
      mode="center"
      :safe-area-inset-bottom="false"
      round="20rpx"
    >
      <div class="p-x-30" style="width:600rpx;">
        <div class="font-center font-w-30 p-y-20">入住驻协议</div>
        <scroll-view scroll-y style="max-height: 50vh; min-height: 30vh">
          {{ pageData.entry_rules }}
        </scroll-view>

        <div class="flex-y-center popup-btns">
          <div @click="xieyiPopup = false" class="bt">不同意</div>
          <div @click="xieyiConfirm" class="bt">我同意</div>
        </div>
      </div>
    </u-popup>
  </view>

  <q-shenhe v-else></q-shenhe>
</template>

<script>
import Upload from '@/components/Upload';
export default {
  components: { Upload },
  data() {
    return {
      form: {
        supplier_name: '',
        name: '',
        mobile: '',
        address: '',
        remarks: '',
        business: '',
        food_license: '',
      },
      rules: {
        supplier_name: [
          {
            required: true,
            message: '请填写供货商名称',
            trigger: ['blur', 'change'],
          },
        ],
        name: [
          {
            required: true,
            message: '请填写联系人',
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: ['blur', 'change'],
          },
        ],

        address: [
          {
            required: true,
            message: '请填写您的地址',
            trigger: ['blur', 'change'],
          },
        ],
        remarks: [
          {
            required: true,
            message: '请填写备注信息',
            trigger: ['blur', 'change'],
          },
        ],
      },
      business_list: [],
      food_license_list: [],
      pageData: '',
      isShenhe: false,
      check: false,
      xieyiPopup: false,
    };
  },
  watch: {
    business_list(val) {
      console.log(val, '图片change');
      if (val.length) {
        this.form.business = val[0].url;
      } else {
        this.form.business = '';
      }
    },
    food_license_list(val) {
      console.log(val, '图片change');
      if (val.length) {
        this.form.food_license = val[0].url;
      } else {
        this.form.food_license = '';
      }
    },
  },

  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData(msg) {
      const res = await this.$requestAll.supplier.apply({}, true);
      if (msg) uni.$u.toast(msg);
      this.pageData = res.data;
      if (res.data.apply) this.form = res.data.apply;
      res.data.apply.business &&
        (this.business_list = [
          { type: 'image', url: res.data.apply.business },
        ]);

      res.data.apply.food_license &&
        (this.food_license_list = [
          { type: 'image', url: res.data.apply.food_license },
        ]);

      this.isShenhe = res.data.apply ? true : false;
    },

    async submit() {
      if (!this.check) return (this.xieyiPopup = true);
      if (this.pageData.status == 1)
        return this.$utils.toUrl(this.pageData.url);
      if (this.pageData.status == 2) return this.resetSubmit();
      this.$refs.form1
        .validate()
        .then(async value => {
          if (value) {
            const res = await this.$requestAll.supplier.applySubmit(
              this.form,
              true
            );
            this.loadData(res.msg);
          }
        })
        .catch(error => {
          console.log(error);
          this.$utils.toast(error[0].message);
        });
    },

    switchForm() {
      this.isShenhe = !this.isShenhe;
    },
    xieyiConfirm() {
      this.check = true
      this.xieyiPopup = false
    },
	tishi(){
		//#ifdef APP-PLUS
		if(this.systemInfo.osName !== 'ios'){
			uni.showModal({
				title:'提示',
				content:'是否允许系统调取设备的相机系统,用于上传资料',
				success: ({confirm}) => {
					if(confirm) {
						console.log(11111111111)
					}
				}
			})
		}
	
		//#endif
	}
  },
  computed: {},
};
</script>

<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
}

/deep/.u-form {
  background: #fff;

  text,
  view {
    font-size: 30rpx;
  }

  .u-form-item {
    padding: 10rpx 40rpx;
  }

  .u-line {
    border-color: #ccc;
    margin-top: 0 !important;
  }

  .from-title {
    padding: 0 40rpx;
    line-height: 80rpx;
    background: #f5f5f5;
  }
}

.submit-bt {
  margin: 30rpx auto;

  background-color: #fe4543;
  color: #fff;
  width: 700rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 10rpx;
}
.submit-bt-2 {
  margin: 0 auto;
  padding: 30rpx 0;
  color: blue;
  text-align: center;
  font-size: 30rpx;
}

.audit-box {
  padding-top: 100rpx;
  text-align: center;
  font-size: 30rpx;
  > image {
    display: block;
    margin: 0 auto 20rpx;
    width: 300rpx;
    height: 300rpx;
  }
}

.popup-btns {
  margin-top: 10rpx;
  border-top: 1px solid #eee;
  .bt {
    color: #1d27e6;
    line-height: 80rpx;
    width: 50%;
    text-align: center;
    font-size: 30rpx;
    &:nth-child(1) {
      color: #999;
      border-right: 1px solid #eee;
    }
  }
}
</style>
