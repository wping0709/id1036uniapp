<template>
  <view v-if="!store.is_shenhe" class="body">
    <template v-if="pageData">
      <u-form
        labelPosition="left"
        labelWidth="initial"
        :model="form"
        ref="form1"
        errorType="none"
      >
        <view class="from-title"> 基本信息 </view>
        <u-form-item label="联系人" borderBottom>
          <u-input
            v-model="form.realname"
            border="none"
            placeholder="请填写联系人"
          ></u-input>
        </u-form-item>
        <u-form-item label="联系电话" borderBottom>
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

        <view class="from-title"> 身份信息 </view>
        <u-form-item label="身份证正面" borderBottom>
          <Upload
            type="image"
            width="100rpx"
            height="100rpx"
            :fileList.sync="form.card_front"
          ></Upload>
        </u-form-item>
        <u-form-item label="身份证反面" borderBottom>
          <Upload
            type="image"
            width="100rpx"
            height="100rpx"
            :fileList.sync="form.card_obverse"
          ></Upload>
        </u-form-item>
        <u-form-item label="姓名" borderBottom>
          <u-input
            v-model="form.id_card_name"
            border="none"
            placeholder="请填写姓名"
          ></u-input>
        </u-form-item>
        <u-form-item label="身份证号" borderBottom>
          <u-input
            v-model="form.id_card_num"
            border="none"
            placeholder="请填写身份证号"
          ></u-input>
        </u-form-item>
        <u-form-item label="身份证有效期">
          <u-input
            v-model="form.id_card_valid_time"
            border="none"
            placeholder="如 2022-02-04"
          ></u-input>
        </u-form-item>

        <view class="from-title"> 店铺信息 </view>
        <u-form-item label="店铺名称" borderBottom>
          <u-input
            v-model="form.name"
            border="none"
            placeholder="请填写店铺名称"
          ></u-input>
        </u-form-item>
        <u-form-item label="所在地区" borderBottom>
          <div @click="onCheckAddress" class="flex-y-center flex-x-sb">
            <text>{{ addressName }}</text>
            <text class="flex-y-center m-l-20">
              <text class="iconfont icon-dingwei"></text>
              <text>定位</text>
            </text>
          </div>
        </u-form-item>
        <u-form-item label="详细地址" borderBottom>
          <u-input
            v-model="form.address"
            border="none"
            placeholder="请填写详细地址"
          ></u-input>
        </u-form-item>
        <u-form-item
          @click="onSwitchShow('classShow', true)"
          label="所售类目"
          borderBottom
        >
          <view class="flex-y-center flex-x-sb">
            <text v-if="form.mch_common_cat_id">{{ calssName }}</text>
            <text v-else class="color-999">请选择所售类目</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
          <u-picker
            :show="classShow"
            :columns="[pageData.mch_common_cat_list]"
            @cancel="classShow = false"
            keyName="name"
            @confirm="classConfirm"
          ></u-picker>
        </u-form-item>
        <u-form-item borderBottom label="客服电话">
          <u-input
            v-model="form.service_tel"
            border="none"
            placeholder="请填写客服电话"
          ></u-input>
        </u-form-item>
        <u-form-item label="店铺头像" borderBottom>
          <Upload
            type="image"
            width="100rpx"
            height="100rpx"
            :fileList.sync="form.logo"
          ></Upload>
        </u-form-item>
        <u-form-item label="店铺背景">
          <Upload
            type="image"
            width="100rpx"
            height="100rpx"
            :fileList.sync="form.header_bg"
          ></Upload>
        </u-form-item>
      </u-form>

      <view class="submit-bt" @click="submit">提交</view>
    </template>
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
      classShow: false,
      pageData: '',
      addressName: '请选择地址',
      form: {
        mch_common_cat_id: '',
      },
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {},
  methods: {
    onSwitchShow(key, b) {
      this[key] = b;
    },
    async loadData() {
      const res = await this.$requestAll.mch.userSetting({}, true);
      this.pageData = res.data;
      this.form = {
        realname: res.data.mch.realname,
        tel: res.data.mch.tel,
        wechat_name: res.data.mch.wechat_name,
        card_front: [
          {
            url: res.data.mch.card_front,
          },
        ],
        card_obverse: [
          {
            url: res.data.mch.card_obverse,
          },
        ],
        latitude: res.data.mch.latitude - 0,
        longitude: res.data.mch.longitude - 0,
        id_card_name: res.data.mch.id_card_name,
        id_card_num: res.data.mch.id_card_num,
        id_card_valid_time: res.data.mch.id_card_valid_time,
        name: res.data.mch.name,
        province_id: res.data.mch.province_id,
        city_id: res.data.mch.city_id,
        district_id: res.data.mch.district_id,
        address: res.data.mch.address,
        mch_common_cat_id: res.data.mch.mch_common_cat_id,
        service_tel: res.data.mch.service_tel,
        logo: [
          {
            url: res.data.mch.logo,
          },
        ],
        header_bg: [
          {
            url: res.data.mch.header_bg,
          },
        ],
      };
      this.exchangeAddress({
        address: res.data.mch.address,
        latitude: res.data.mch.latitude - 0,
        longitude: res.data.mch.longitude - 0,
      });
    },
    // 确定选择类目
    classConfirm({ value }) {
      this.form.mch_common_cat_id = value[0].id;
      this.classShow = false;
    },
    onCheckAddress() {
      uni.chooseLocation({
        latitude: this.form.latitude,
        longitude: this.form.longitude,
        success: async res => {
          console.log('位置名称：' + res.name);
          console.log('详细地址：' + res.address);
          console.log('纬度：' + res.latitude);
          console.log('经度：' + res.longitude);
          console.log(res);

          this.form.latitude = res.latitude;
          this.form.longitude = res.longitude;
          const formData = {
            latitude: res.latitude - 0,
            longitude: res.longitude - 0,
            address: res.address,
          };
          this.exchangeAddress(formData);
        },
      });
    },
    // 兑换地址信息
    async exchangeAddress(formData) {
      const res = await this.$requestAll.user.getAreaInfo(formData, true);
      this.form.address = res.data.detail;
      this.form.province_id = res.data.district.province.id;
      this.form.city_id = res.data.district.city.id;
      this.form.district_id = res.data.district.district.id;
      this.addressName = '';
      for (const key in res.data.district) {
        this.addressName += ' ' + res.data.district[key].name;
      }
    },
    async submit() {
      var formData = JSON.parse(JSON.stringify(this.form));
      formData.card_front = this.form.card_front[0].url;
      formData.card_obverse = this.form.card_obverse[0].url;
      formData.logo = this.form.logo[0].url;
      formData.header_bg = this.form.header_bg[0].url;

      const res = await this.$requestAll.mch.settingSubmit(formData, true);
      uni.showModal({
        title: '提示',
        content: '保存成功',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            this.$utils.backTo();
          }
        },
      });
    },
  },
  computed: {
    calssName() {
      if (!this.form.mch_common_cat_id) return '请选择类目';
      return this.pageData.mch_common_cat_list.filter(
        item => item.id == this.form.mch_common_cat_id
      )[0].name;
    },
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /deep/.u-form-item__body__left {
    margin-right: 20rpx;
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
}

.submit-bt {
  margin: 30rpx auto 0;
  margin: 30rpx auto env(safe-area-inset-bottom);

  background-color: #fe4543;
  color: #fff;
  width: 700rpx;
  line-height: 80rpx;
  text-align: center;
  font-size: 30rpx;
  border-radius: 10rpx;
}
</style>
