<template>
  <view>
    <u-swiper :list="bannerList" :height="180"></u-swiper>
    <u-form labelPosition="left" labelWidth="160rpx" :model="form" ref="form1" errorType="none">
      <u-form-item required label="代理级别" borderBottom>
        <u-radio-group v-model="radioValue">
          <u-radio @change="radioChange(item.id)" v-for="(   item, index   ) in    radioList   " :key="index"
            :name="item.name" :disabled="item.disabled">
            {{ item.name }}
          </u-radio>
        </u-radio-group>
      </u-form-item>

      <u-form-item required label="所在地区" borderBottom>
        <PickerAddress :addressList="region" @onChange="handleGetRegion" @pickerShown="handlePickerShown">
          <text class="color-999">{{ regionName ? regionName : '点击选择省市区' }}</text>
        </PickerAddress>
      </u-form-item>
    </u-form>
    <view v-if="!pageData.apply" class="submit-bt" @click="submit">提交</view>
    <view v-else @click="onSwitchShow('isAudit', true)" class="submit-bt-2">查看审核结果</view>
  </view>
</template>

<script>
import PickerAddress from '@/components/picker-address/picker-address-ganged.vue';

export default {
  components: {
    PickerAddress,
  },
  data() {
    return {
      bannerList: [],
      radioList: [
        { name: '省', id: 0, disabled: false },
        { name: '市', id: 1, disabled: false },
        { name: '区', id: 2, disabled: false },
      ],
      radioValue: '',
      region: [],
      form: {},
      pageData: '',
      data: [],
      classShow: false,
      isAudit: false,
      recommend_user_id: 0,
      userId: 0,
      status: '',

    };
  },
  onLoad() {
    this.loadData();

  },
  mounted() {
    this.loadData();
  },
  onShow() { },
  methods: {
    handlePickerShown(isShown) {
      this.classShow = !isShown;
    },
    async loadData() {
      const userInfo = await uni.getStorage({ key: 'userInfo' });
      const userId = userInfo[1].data.id;
      const res = await this.$requestAll.agentApproval.index({ user_id: userId }, true);
      this.bannerList = res.data.list.banner_image;
      this.data = res.data.list;
      this.status = res.data.list.status;
      // this.radioValue = res.data.list.status == 0 ? 0 : 1;
      console.log('es.data.listes.data.list', res.data);
      // console.log(this.data.status);
      if (this.data.status == 1) {
        this.$utils.toUrl(
          '/agent/region-divvy/user', "redirectTo");
      }

    },
    async submit() {
      if (!this.radioValue) {
        return this.$utils.toast('请选择类型');
      }
      if (!this.region || this.region.length !== 3) {
        return this.$utils.toast('请选择完整的所在地区');
      }
      const res = await uni.getStorage({ key: 'userInfo' });
      this.form = {
        province_id: this.region[0].id,
        city_id: this.region[1].id,
        district_id: this.region[2].id,
        province_name: this.region[0].name,
        city_name: this.region[1].name,
        district_name: this.region[2].name,
        type_id: this.form.type_id,
      };
      try {
        await this.$requestAll.agentApproval.submit(
          { ...this.form, user_id: res[1].data.id },
          true
        );
        uni.showToast({
          title: '提交成功',
          icon: 'success',
          showCancel: false,
          success: ({ confirm, cancel }) => {
            confirm && this.loadData();
          },
        });
      } catch (error) {
        // Handle error
      }
    },
    radioChange(id) {
      id == 0
        ? (this.form.type_id = id)
        : id == 1
          ? (this.form.type_id = id)
          : id == 2
            ? (this.form.type_id = id)
            : null;
      // console.log(id);
    },
    handleGetRegion(region) {
      this.region = region;
      this.form.province_id = region[0].id;
      this.form.city_id = region[1].id;
      this.form.district_id = region[2].id;
    },
  },
  watch: {},
  computed: {
    regionName() {
      return this.region.map(item => item.name).join(' ');
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

  >image {
    display: block;
    margin: 0 auto 20rpx;
    width: 300rpx;
    height: 300rpx;
  }
}
</style>
