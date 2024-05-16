<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <view v-if="!isAudit">
      <u-form
        labelPosition="left"
        labelWidth="160rpx"
        :model="form"
        :rules="rules"
        ref="form1"
        errorType="none"
      >
        <view class="from-title"> 基本信息 </view>
        <u-form-item required prop="realname" label="联系人" borderBottom>
          <u-input
            v-model="form.realname"
            border="none"
            placeholder="请填写联系人"
          ></u-input>
        </u-form-item>
        <u-form-item required prop="tel" label="联系电话" borderBottom>
          <u-input
            v-model="form.tel"
            border="none"
            placeholder="请填写联系人电话"
          ></u-input>
        </u-form-item>
        <u-form-item label="微信号">
          <u-input
            v-model="form.wechat_name"
            border="none"
            placeholder="请填写微信号"
          ></u-input>
        </u-form-item>

        <view class="from-title"> 店铺信息 </view>
        <u-form-item required prop="name" label="店铺名称" borderBottom>
          <u-input
            v-model="form.name"
            border="none"
            placeholder="请填写店铺名称"
          ></u-input>
        </u-form-item>
        <u-form-item required label="所在地区" borderBottom>
          <PickerAddress :num="3" @onChange="handleGetRegion">
            <text class="color-999">{{
              regionName ? regionName : "点击选择省市区"
            }}</text>
			<text class="text_address">{{textAddress}}</text>
          </PickerAddress>
        </u-form-item>
        <u-form-item required prop="address" label="详细地址" borderBottom>
          <u-input
            v-model="form.address"
            border="none"
            placeholder="请填写详细地址"
          ></u-input>
        </u-form-item>
        <u-form-item
          required
          prop="mch_common_cat_id"
          @click="onSwitchShow('classShow', true)"
          label="所售类目"
          borderBottom
        >
          <view class="color-999">{{ calssName }}</view>
          <u-picker
            :show="classShow"
            :columns="[pageData.mch_common_cat_list]"
            @cancel="onSwitchShow('classShow', false)"
            keyName="name"
            @confirm="classConfirm"
          ></u-picker>
        </u-form-item>
        <u-form-item required prop="service_tel" label="客服电话">
          <u-input
            v-model="form.service_tel"
            border="none"
            placeholder="请填写客服电话"
          ></u-input>
        </u-form-item>

        <view class="from-title"> 企业信息 </view>
        <u-form-item
          @click="upData('business')"
          required
          prop="business"
          label="营业执照"
          borderBottom
        >
          <view v-if="form.business" style="height: 200rpx; width: 200rpx">
            <image
              style="width: 100%; height: 100%"
              :src="form.business"
              mode="aspectFit"
            />
          </view>
          <view v-else class="color-999">上传营业执照</view>
        </u-form-item>

        <u-form-item
          @click="upData('food_license')"
          label="相关行业许可证"
          borderBottom
          label-width="auto"
        >
          <view v-if="form.food_license" style="height: 200rpx; width: 200rpx">
            <image
              style="width: 100%; height: 100%"
              :src="form.food_license"
              mode="aspectFit"
            />
          </view>
          <view v-else class="color-999">上传相关行业许可证</view>
        </u-form-item>
        <u-form-item
          @click="upData('card_front')"
          required
          prop="card_front"
          label="身份证正面"
          borderBottom
        >
          <view style="height: 200rpx; width: 200rpx" v-if="form.card_front">
            <image
              style="width: 100%; height: 100%"
              :src="form.card_front"
              mode="aspectFit"
            />
          </view>
          <view v-else class="color-999">上传身份证正面</view>
        </u-form-item>
        <u-form-item
          @click="upData('card_obverse')"
          required
          prop="card_obverse"
          label="身份证反面"
        >
          <view style="height: 200rpx; width: 200rpx" v-if="form.card_obverse">
            <image
              style="width: 100%; height: 100%"
              :src="form.card_obverse"
              mode="aspectFit"
            />
          </view>
          <view v-else class="color-999">上传身份证反面</view>
        </u-form-item>

        <view class="from-title flex-y-center">
          <u-checkbox-group v-model="xieyi" @change="xieyiChange">
            <u-checkbox
              name="xieyi"
              active-color="#f00"
              label="我已阅读并同意"
              shape="circle"
            ></u-checkbox>
          </u-checkbox-group>
          <view @click="onSwitchShow('showXieyi')" style="color: blue"
            >《入驻协议》</view
          >
        </view>
      </u-form>

      <view v-if="!pageData.apply" class="submit-bt" @click="submit">提交</view>
      <view v-else @click="onSwitchShow('isAudit', true)" class="submit-bt-2"
        >查看审核结果</view
      >
    </view>
    <view class="audit-box" v-else>
      <image
        :src="store.logo"
        v-if="pageData.apply.review_status == 0"
        mode="aspectFit"
      />
      <image
        :src="store.logo"
        v-if="pageData.apply.review_status == 2"
        mode="aspectFit"
      />
      <image
        :src="store.logo"
        v-if="pageData.apply.review_status == 1"
        mode="aspectFit"
      />
      <view>{{ pageData.apply.review_status_text }}</view>
      <view v-if="pageData.apply.review_status == 0" class="m-t-10"
        >您的信息已提交，请耐心等待审核。</view
      >
      <view v-else class="m-t-10">{{ pageData.apply.review_result }}</view>

      <template
        v-if="
          pageData.apply.review_status == 0 || pageData.apply.review_status == 1
        "
      >
        <template v-if="pageData.apply.review_status == 0">
          <view
            v-if="pageData.bzj_price > 0 && !pageData.bzj_is_pay"
            @click="payDeposit"
            style="color: #fff; width: 70%"
            class="m-t-30 submit-bt"
          >
            支付保证金
          </view>
          <view
            v-if="pageData.bzj_is_pay"
            @click="onSwitchShow('isAudit', false)"
            style="color: red"
            class="m-t-30"
          >
            已支付保证金
          </view>
        </template>

        <view
          @click="onSwitchShow('isAudit', false)"
          style="color: blue"
          class="m-t-30"
          >查看提交内容</view
        >
      </template>

      <view
        v-if="pageData.apply.review_status == 2"
        @click="resetSubmit"
        style="color: blue"
        class="m-t-30"
        >重新提交</view
      >
    </view>

    <u-popup
      :show="showXieyi"
      :safeAreaInsetBottom="false"
      mode="center"
      round="20rpx"
    >
      <view style="width: 80vw">
        <view class="xieyi-title font-center p-y-20">入驻协议</view>
        <scroll-view
          scroll-y
          style="max-height: 70vh; min-height: 30vh"
          class="xieyi-content"
        >
          <view class="p-x-20">
            <u-parse
              :set-title="false"
              :content="pageData.entry_rules"
            ></u-parse>
          </view>
        </scroll-view>
        <view
          class="flex-y-center border-top font-center m-t-20"
          style="line-height: 80rpx"
        >
          <view @click="onSwitchShow('showXieyi')" class="flex-w-1">取消</view>
          <view
            @click="onSwitchShow('showXieyi')"
            class="flex-w-1 price-color border-left"
            >确定</view
          >
        </view>
      </view>
    </u-popup>

    <canvas
      :style="{
        width: `${systemInfo.windowWidth}px`,
        height: `${systemInfo.windowWidth}px`,
        position: 'absolute',
        zIndex: '-1',
        left: '-10000rpx',
        top: '-10000rpx',
      }"
      canvas-id="zipCanvas"
    ></canvas>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>

<script>
import PickerAddress from "@/components/picker-address/picker-address.vue";
import request from "@/utils/request";
export default {
  components: {
    PickerAddress,
  },
  data() {
    return {
      region: [],
      form: {
        mch_common_cat_id: "",
      },
      rules: {
        realname: [
          {
            required: true,
            message: "请填写联系人",
            trigger: ["blur", "change"],
          },
        ],
        tel: [
          {
            required: true,
            message: "请填写联系电话",
            trigger: ["blur", "change"],
          },
        ],
        name: [
          {
            required: true,
            message: "请填写店铺名称",
            trigger: ["blur", "change"],
          },
        ],
        address: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: ["blur", "change"],
          },
        ],
        mch_common_cat_id: [
          {
            required: true,
            message: "请选择所售类目",
            trigger: ["blur", "change"],
          },
        ],
        service_tel: [
          {
            required: true,
            message: "请填写客服电话",
            trigger: ["blur", "change"],
          },
        ],
        business: [
          {
            required: true,
            message: "请上传营业执照",
            trigger: ["blur", "change"],
          },
        ],
        card_front: [
          {
            required: true,
            message: "请上传身份证正面",
            trigger: ["blur", "change"],
          },
        ],
        card_obverse: [
          {
            required: true,
            message: "请上传身份证反面",
            trigger: ["blur", "change"],
          },
        ],
      },
      xieyi: [""],
      showXieyi: false,
      pageData: "",
      classShow: false,
      isAudit: false,
      recommend_user_id: 0,
      textAddress:''
    };
  },
  onLoad(params) {
    this.recommend_user_id = params.recommend_user_id || 0
    this.loadData();
  },
  onShow() {},
  methods: {
    // 生成保证金订单，跳转支付
    async payDeposit() {
      const res = await this.$requestAll.mch.payData(
        {
          order_id: this.pageData.apply.order_id,
        },
        true
      );
      this.$utils.toUrl(
        "/other/pay/pay" +
          uni.$u.queryParams({
            order_id: res.data.order_id,
            order_type: 16,
          })
      );
    },
    onSwitchShow(key, b) {
      console.log(typeof b);
      if (b === "boolean") {
        this[key] = b;
      } else {
        this[key] = !this[key];
      }
    },
    async loadData() {
      const res = await this.$requestAll.mch.indexApply({}, true);
      //   判断申请通过跳转商铺首页
      if (res.data.apply?.review_status == 1)
        this.$utils.toUrl("/mch/m/myshop/myshop", "redirectTo");
      if (res.data.apply) {
        this.form = res.data.apply;
        this.$set(this, "form", {
          ...res.data.apply,
          mch_common_cat_id: res.data.apply.mch_common_cat_id + "",
        });
        this.xieyi = ["xieyi"];
        let region = [];
        for (const key in res.data.edit_district) {
          region.push(res.data.edit_district[key]);
        }
        this.region = region;
        this.isAudit = true;
      }
      this.pageData = res.data;
    },
    // 确定选择类目
    classConfirm({ value }) {
      this.form.mch_common_cat_id = value[0].id;
      this.classShow = false;
    },
    // 获取选择的地区
    handleGetRegion(region) {
      console.log(region);
      this.region = region;
      // 省id
      this.form.province_id = region[0].id;
      // 市id
      this.form.city_id = region[1].id;
      // 区id
      this.form.district_id = region[2].id;
	  this.form.text_address = this.textAddress;
    },
    // 协议change
    xieyiChange(value) {
      this.xieyi = value;
    },
    async submit() {
      if (!this.xieyi.length) return this.$utils.toast("请先勾选入驻协议");
      if (!this.region) return this.$utils.toast("请选择所在地区");
	  
      console.log(this.form);
      this.$refs.form1
        .validate()
        .then(async (value) => {
          if (value) {
            await this.$requestAll.mch.indexApplySubmit({...this.form,recommend_user_id: this.recommend_user_id});
            this.loadData();
          }
        })
        .catch((error) => {
          console.log(error);
          this.$utils.toast(error[0].message);
        });
    },
    // 上传图片
    upData(v) {
      uni.chooseImage({
        count: 1,
        success: async (chooseImageRes) => {
          const tempFilePaths = chooseImageRes.tempFilePaths[0];
          const res = await request.UPLOAD_IMAGE(
            tempFilePaths,
            "/default/upload-image"
          );
          console.log(res, "上传成功");
          this.$set(this.form, v, res.data.url);
        },
      });
    },
    // 重新提交
    resetSubmit() {
      const { form, region } = this.$options.data();
      // this.form = form;
      // this.region = region;
      delete this.pageData.apply;

      this.isAudit = false;
    },
  },
  watch: {},
  computed: {
    regionName() {
      this.textAddress = this.region.map((item) => item.name).join("");
      // 转为字符串
      return this.region.map((item) => item.name).join(" ");
    },
	textAddress() {
	  // 转为字符串
	  return this.region.map((item) => item.name).join("");
	},
    calssName() {
      if (this.form.mch_common_cat_id) {
        var selectData = this.pageData.mch_common_cat_list.filter((item) => {
          if (item.id == this.form.mch_common_cat_id) return item;
        });
        console.log(selectData);
        return selectData[0].name;
      } else {
        return "请选择所售类目";
      }
    },
  },
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
    padding: 10rpx 50rpx;
  }

  .u-line {
    border-color: #ccc;
    margin-top: 0 !important;
  }

  .from-title {
    padding: 0 50rpx;
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
.text_address{
	display: none;
}
</style>
