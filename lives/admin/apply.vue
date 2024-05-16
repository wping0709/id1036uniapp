<template>
  <view v-if="pageData" class="body">
    <template v-if="!isShenhe">
      <u-form
        labelPosition="left"
        labelWidth="160rpx"
        :model="form"
        :rules="rules"
        ref="form1"
        errorType="none"
      >
        <view
          class="from-title font-center price-color"
          style="background: #f7f4f8; font-size: 24rpx"
          >请您如实填写本人信息，否则将认证失败</view
        >
        <u-form-item required prop="nickname" label="真实姓名" borderBottom>
          <u-input
            v-model="form.nickname"
            border="none"
            placeholder="请填写您的真实姓名"
          ></u-input>
        </u-form-item>

        <u-form-item required prop="mobile" label="联系电话" borderBottom>
          <u-input
            v-model="form.mobile"
            border="none"
            placeholder="请填写您的联系电话"
          ></u-input>
        </u-form-item>

        <u-form-item required prop="name" label="直播名称" borderBottom>
          <u-input
            v-model="form.name"
            border="none"
            placeholder="请输入您的直播名称"
          ></u-input>
        </u-form-item>

        <u-form-item required prop="desc" label="主播简介" borderBottom>
          <u-input
            v-model="form.desc"
            border="none"
            placeholder="请填写您的主播简介"
          ></u-input>
        </u-form-item>

        <u-form-item required prop="car_id" label="直播类型">
          <view
            class="flex-y-center flex-x-sb p-x-20"
            @click="showCat = true"
          >
            <text>{{
              pageData.live_cat &&
              selectIndex.length &&
              pageData.live_cat[selectIndex[0]].name
            }}</text>
            <text class="iconfont icon-arrow-right color-666"></text>
          </view>
        </u-form-item>
      </u-form>

      <u-picker
        @cancel="showCat = false"
        @confirm="prickerConfirm"
        :show="showCat"
        :columns="[pageData.live_cat]"
        keyName="name"
      ></u-picker>

      <!-- 未通过备注 -->
      <view
        v-if="pageData.live_info && pageData.live_info.status == 2"
        class="p-30 color-999"
        >{{ pageData.live_info.status_desc || '未通过备注' }}</view
      >

      <!-- 提交按钮 -->
      <view
        class="submit-bt"
        v-if="config.is_real == 1 && user_info.is_real != 1"
      >
        请先实名认证
      </view>
      <view
        class="submit-bt"
        v-else-if="pageData.live_info && pageData.live_info.status == 0"
        >审核中</view
      >
      <view
        class="submit-bt"
        v-else-if="pageData.live_info && pageData.live_info.status == 1"
        >审核通过</view
      >
      <view
        class="submit-bt"
        v-else-if="pageData.live_info && pageData.live_info.status == 2"
        @click="submit"
        >审核不通过，重新提交</view
      >
      <view class="submit-bt" v-else @click="submit">提交审核</view>
    </template>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      form: {
        nickname: '',
        name: '',
        mobile: '',
        desc: '',
        cat_id: '',
      },
      rules: {
        nickname: [
          {
            required: true,
            message: '请填写您的真实姓名',
            trigger: ['blur', 'change'],
          },
        ],
        name: [
          {
            required: true,
            message: '请输入您的直播名称',
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          {
            required: true,
            message: '请填写您的联系电话',
            trigger: ['blur', 'change'],
          },
        ],

        desc: [
          {
            required: true,
            message: '请填写您的主播简介',
            trigger: ['blur', 'change'],
          },
        ],
        cat_id: [
          {
            required: true,
            message: '请选择直播类型',
            trigger: ['blur', 'change'],
          },
        ],
      },
      pageData: '',
      config: '',
      user_info: '',
      selectIndex: [0],
      showCat: false,
      isShenhe: false,
    };
  },
  onLoad() {
    this.loadData();
    this.getConfig();
  },
  onReady() {
    this.$refs['form1'] && this.$refs['form1'].setRules(this.rules);
  },
  methods: {
    // 获取审核数据
    async loadData(msg) {
      const res = await this.$requestAll.lives.liveGetInfo({}, true);
      if (res.data.live_info)
        this.form = {
          name: res.data.live_info.name,
          mobile: res.data.live_info.mobile,
          nickname: res.data.live_info.nickname,
          cat_id: res.data.live_info.cat_id,
          desc: res.data.live_info.desc,
        };
      let selectIndex = res.data.live_cat.findIndex(
        item => item.id == this.form.cat_id
      );
      this.selectIndex = [selectIndex >= 0 ? selectIndex : 0];

      this.pageData = res.data;
    },
    // 获取直播配置
    async getConfig() {
      const res = await this.$requestAll.lives.getConfig({});
      this.config = res.data.config;
      this.user_info = res.data.user_info;
    },

    async submit() {
      this.$refs.form1
        .validate()
        .then(async value => {
          if (value) {
            const res = await this.$requestAll.lives.submitApply(
              this.form,
              true
            );
            this.loadData();
            this.getConfig();
            uni.showModal({
              title: '提示',
              content: '提交成功',
            });
          }
        })
        .catch(error => {
          console.log(error);
          this.$utils.toast(error[0].message);
        });
    },

    prickerConfirm(value) {
      console.log(value);
      this.selectIndex = value.indexs;
      this.form.cat_id = value.value[0].id;
      this.showCat = false;
    },

    switchForm() {
      this.isShenhe = !this.isShenhe;
    },
  },
  watch: {},
  computed: {},
};
</script>

<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: env(safe-area-inset-bottom);
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
</style>
