<template>
  <view class="body">
    <u-form
      labelPosition="left"
      labelWidth="160rpx"
      :model="form"
      :rules="rules"
      ref="form1"
      errorType="none"
    >
      <u-form-item required prop="address" label="定位" borderBottom>
        <view @click="addressFocus" class="color-999 flex-y-center flex-x-sb flex-w-1">
          <view class="u-line-2">{{
            form.address || '请选择定位信息'
          }}</view>
          <view class="iconfont icon-arrow-right color-999"></view>
        </view>
      </u-form-item>
      <u-form-item
        v-if="!pageData.info"
        required
        prop="address1"
        label="详细地址"
        borderBottom
      >
        <u-input
          v-model="form.address1"
          border="none"
          placeholder="请填写详细地址"
        ></u-input>
      </u-form-item>
      <u-form-item required prop="name" label="自提点名称" borderBottom>
        <u-input
          v-model="form.name"
          border="none"
          placeholder="请输入自提点名称"
        ></u-input>
      </u-form-item>
      <u-form-item required prop="mobile" label="联系方式" borderBottom>
        <u-input
          v-model="form.mobile"
          border="none"
          placeholder="请填写您的联系方式"
        ></u-input>
      </u-form-item>

      <u-form-item required label="所在地区" borderBottom>
        <PickerAddress @onChange="handleGetRegion">
          <text class="color-999">{{
            regionName ? regionName : '点击选择省市区'
          }}</text>
        </PickerAddress>
      </u-form-item>
      <u-form-item
        @click="upData('pic_url')"
        required
        prop="pic_url"
        label="社区头像"
        :borderBottom="pageData.status == 2"
      >
        <view v-if="form.pic_url" style="height: 200rpx; width: 200rpx">
          <image
            style="width: 100%; height: 100%"
            :src="form.pic_url"
            mode="aspectFit"
          />
        </view>
        <view v-else class="color-999">点击上传社区头像</view>
      </u-form-item>

      <u-form-item v-if="pageData.status == 2" label="备注">
        <view>{{ pageData.data.remarks || '其他' }}</view>
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
        <view @click="showRule" style="color: red">《申请规则》</view>
      </view>
    </u-form>

    <view class="submit-bt" @click="submit">{{ pageData.info || '提交' }}</view>

    <u-popup
      :show="showPopup"
      mode="center"
      round="20rpx"
      :safeAreaInsetBottom="false"
    >
      <div class="popup-box p-20">
        <div class="title p-b-20 font-w-700 font-center">成为团长协议</div>
        <scroll-view scroll-y class="content font-24">
          {{ pageData.shop_set && pageData.shop_set.agree }}
        </scroll-view>

        <div @click="showRule" class="popup-bt">我已同意</div>
      </div>
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
</template>

<script>
import PickerAddress from '@/components/picker-address/picker-address'
import request from '@/utils/request';
var addressList = []
export default {
  components: {
    PickerAddress
  },
  data() {
    return {
      region: [],
      form: {
        address: '',
        latitude: '',
        longitude: '',
        mobile: '',
        name: '',
        pic_url: '',
        cover_url: '',
        province: '',
        city: '',
        district: '',
      },
      rules: {
        address: [
          {
            required: true,
            message: '请选择定位',
            trigger: ['blur', 'change'],
          },
        ],
        address1: [
          {
            required: true,
            message: '请填写详细地址',
            trigger: ['blur', 'change'],
          },
        ],
        name: [
          {
            required: true,
            message: '请填写自提点名称',
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          {
            required: true,
            message: '请填写联系方式',
            trigger: ['blur', 'change'],
          },
        ],

        pic_url: [
          {
            required: true,
            message: '请上传社区头像',
            trigger: ['blur', 'change'],
          },
        ],
      },
      xieyi: ['xieyi'],
      pageData: '',
      showPopup: false,
    };
  },
  onLoad() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.commander.tuanzhangType({}, true);
      //   判断申请通过跳转商铺首页
      //   if (res.data.apply?.review_status == 1)
      //     this.$utils.toUrl("/mch/m/myshop/myshop", "redirectTo");

      this.pageData = res;
      console.log(res);
      res.data && (this.form = res.data.data);
      // 获取省市区列表
      const res1 = await this.$requestAll.default.district({});
      addressList = res1.data;

      // 获取默认地址信息
      this.region = [];
      res1.data.forEach(item => {
        if (item.id == this.form.province) {
          this.region.push(item);
          item.list.forEach(item1 => {
            if (item1.id == this.form.city) {
              this.region.push(item1);
              item1.list.forEach(item2 => {
                if (item2.id == this.form.district) {
                  this.region.push(item2);
                }
              });
            }
          });
        }
      });
    },

    async submit() {
      if (!this.xieyi.length) return this.$utils.toast('请先勾选入驻协议');
      if (!this.region.length) return this.$utils.toast('请选择所在地区');
      if (this.pageData.status == 1)
        return this.$utils.toUrl(this.pageData.url);
      if (this.pageData.status == 2) return this.resetSubmit();
      this.$refs.form1
        .validate()
        .then(async value => {
          if (value) {
            this.form.address = this.form.address + this.form.address1;
            delete this.form.address1;
            await this.$requestAll.commander.tuanzhangSave(this.form);
            this.loadData();
          }
        })
        .catch(error => {
          console.log(error);
          this.$utils.toast(error[0].message);
        });
    },
    // 获取选择的地区
    handleGetRegion(region) {
      console.log(region);
      this.region = region;
      // 省id
      this.form.province = region[0].id;
      // 市id
      this.form.city = region[1].id;
      // 区id
      this.form.district = region[2].id;
    },
    // 协议change
    xieyiChange(value) {
      this.xieyi = value;
    },
    // 上传图片
    upData(v) {
	  // #ifdef APP-PLUS
		if(this.systemInfo.osName !== 'ios'){
			uni.showModal({
				title:'提示',
					content:'是否允许获取设备相册信息？用于上传图片',
					success: ({confirm,cancel}) => {
						if(confirm) {
							uni.chooseImage({
							  count: 1,
							  success: async chooseImageRes => {
							    const tempFilePaths = chooseImageRes.tempFilePaths[0];
							    const res = await request.UPLOAD_IMAGE(
							      tempFilePaths,
							      '/default/upload-image'
							    );
							    console.log(res, '上传成功');
							    this.$set(this.form, v, res.data.url);
							    this.$set(this.form, 'cover_url', res.data.url);
							  },
							});
						}
					}
			})
		}else {
			uni.chooseImage({
			  count: 1,
			  success: async chooseImageRes => {
			    const tempFilePaths = chooseImageRes.tempFilePaths[0];
			    const res = await request.UPLOAD_IMAGE(
			      tempFilePaths,
			      '/default/upload-image'
			    );
			    console.log(res, '上传成功');
			    this.$set(this.form, v, res.data.url);
			    this.$set(this.form, 'cover_url', res.data.url);
			  },
			});
		}
	  // #endif
	  // #ifdef MP-WEIXIN || H5
	  uni.chooseImage({
	    count: 1,
	    success: async chooseImageRes => {
	      const tempFilePaths = chooseImageRes.tempFilePaths[0];
	      const res = await request.UPLOAD_IMAGE(
	        tempFilePaths,
	        '/default/upload-image'
	      );
	      console.log(res, '上传成功');
	      this.$set(this.form, v, res.data.url);
	      this.$set(this.form, 'cover_url', res.data.url);
	    },
	  });
	  // #endif	
 
    },
    //   获取地区
    addressFocus() {
		//#ifdef APP-PLUS
		if(this.systemInfo.osName !== 'ios'){
			uni.showModal({
				title:'提示',
				content:'是否允许系统获取您的位置信息?用于自提点申请',
				success: ({confirm,cancel}) => {
					if(confirm) {
						uni.chooseLocation({
						  success: res => {
						    console.log(res, '当前选中地址信息');
						    this.form.address = res.address;
						    this.form.latitude = res.latitude;
						    this.form.longitude = res.longitude;
						  },
						});
					}
				}
			})
		}else {
			uni.chooseLocation({
			  success: res => {
			    console.log(res, '当前选中地址信息');
			    this.form.address = res.address;
			    this.form.latitude = res.latitude;
			    this.form.longitude = res.longitude;
			  },
			});
		}
		//#endif
		//#ifdef MP-WEIXIN || H5
      uni.chooseLocation({
        success: res => {
          console.log(res, '当前选中地址信息');
          this.form.address = res.address;
          this.form.latitude = res.latitude;
          this.form.longitude = res.longitude;
        },
      });
	//#endif
    },
    // 重新提交
    resetSubmit() {
      const { form, region, pageData } = this.$options.data();
      this.form = form;
      this.region = region;
      this.pageData = pageData;
    },
    showRule() {
      this.showPopup = !this.showPopup;
    },
  },
  watch: {},
  computed: {
    regionName() {
      // 转为字符串
      return this.region.map(item => item.name).join(' ');
    },
    calssName() {
      if (this.form.mch_common_cat_id) {
        var selectData = this.pageData.mch_common_cat_list.filter(item => {
          if (item.id == this.form.mch_common_cat_id) return item;
        });
        console.log(selectData);
        return selectData[0].name;
      } else {
        return '请选择所售类目';
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

  /deep/.u-form-item__body__right__content__slot {
    flex-direction: row;
  }
}

.popup-box {
  width: 80vw;
  .content {
    max-height: 60vh;
    color: #666;
    line-height: 2;
    white-space: pre-wrap;
  }
  .popup-bt {
    width: 200rpx;
    line-height: 60rpx;
    border-radius: 20rpx;
    background: #f00;
    margin: 20rpx auto 0;

    text-align: center;
    color: #fff;
    font-size: 30rpx;
  }
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
</style>
