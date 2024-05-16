<template>
  <view class="body">
    <view class="bg-fff p-x-20">
      <u-form
        labelWidth="150rpx"
        errorType="toast"
        :rules="rules"
        :model="form"
        ref="form"
      >
        <u-form-item borderBottom label="收货人" prop="name">
          <u--input
            v-model="form.name"
            border="none"
            placeholder="请填写收货人姓名"
          ></u--input>
        </u-form-item>
        <u-form-item borderBottom label="联系电话" prop="mobile">
          <u--input
            v-model="form.mobile"
            border="none"
            placeholder="请填写收货人联系电话"
          ></u--input>
        </u-form-item>
        <u-form-item borderBottom label="所在地区">
          <div class="address">
            <view class="pickeraddress" @click="showAddressPicker = true">
              <PickerAddress
                :show.sync="showAddressPicker"
                :province_id.sync="form.province_id"
                :district_id.sync="form.district_id"
                :city_id.sync="form.city_id"
              >
              </PickerAddress>
            </view>
            <view @click="onDingwei" class="">
              <text class="iconfont icon-dingwei"></text>
              <text>定位</text>
            </view>
          </div>
        </u-form-item>

        <u-form-item borderBottom label="详细地址" prop="detail">
          <view class="detail_address">
            <u-textarea
              v-model="form.detail"
              placeholder="请填写详细地址"
              disableDefaultPadding
              border="none"
            >
            </u-textarea>
          </view>
        </u-form-item>

        <view class="copy-content">
          <view class="copy-con" v-if="showCopy">
            <textarea
              v-model="str"
              placeholder="试试粘贴收件人姓名、手机号、收货地址，可快速识别您的收货信息"
            />

            <view :class="['copy-btn', str.length ? 'focus' : '']">
              <view class="clear" @click="str = ''">清除</view>
              <view class="sub" @click="resolutionAddress">提交</view>
            </view>
          </view>
          <view
            :class="['copy-tit', showCopy ? 'on' : '']"
            @click="showCopy = !showCopy"
            >地址粘贴板 <i class="iconfont icon-arrow-right"></i
          ></view>
        </view>

        <div
          class="flex-y-center flex-x-sb p-y-20"
          style="border-top: 20rpx solid #f5f5f5"
        >
          <div>
            <view>设置默认地址</view>
            <view class="font-26 color-999"
              >提醒：每次下单会默认推荐使用该地址</view
            >
          </div>
          <div>
            <u-switch v-model="form.is_default"></u-switch>
          </div>
        </div>
      </u-form>
    </view>

    <div @click="submit" class="submit">保存</div>
  </view>
</template>
<script>
import PickerAddress from "@/components/picker-address/new-picker-address";
export default {
  components: {
    PickerAddress
  },
  data() {
    return {
      userLocation: "",
      detail: "",
      id: "",
      form: {
        name: "",
        mobile: "",
        detail: "",
        house_number: "",
        is_default: false,
        province_id: "",
        latitude: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "请填写收货人姓名",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [
          {
            required: true,
            message: "请填写收货人联系电话",
            trigger: ["blur", "change"]
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // uni.$u.test.mobile()就是返回true或者false的
              return uni.$u.test.mobile(value);
            },
            message: "收货人联系电话不正确",
            trigger: ["blur", "change"]
          }
        ],
        province_id: [
          {
            required: true,
            message: "请填写所在地区",
            trigger: ["blur", "change"]
          }
        ],
        latitude: [
          {
            required: true,
            message: "请填写地标点",
            trigger: ["blur", "change"]
          }
        ],
        detail: [
          {
            required: true,
            message: "请填写详细地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      showAddressPicker: false,
      str: "",
      showCopy: false
    };
  },
  onLoad(params) {
    if (params.id) {
      uni.setNavigationBarTitle({
        title: "编辑地址"
      });
      this.id = params.id;
      this.getDetail();
    }
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  onShow() {},
  methods: {
    async resolutionAddress() {
      if (!this.str) return uni.$u.toast("粘贴板不能为空");

      const res = await this.$requestAll.user.resolutionAddress(
        {
          str: this.str
        },
        true
      );

      if (!res.code) {
        let {
          addr,
          city,
          city_id,
          mobile,
          name,
          province,
          province_id,
          region,
          region_id
        } = res.data;

        this.form.name = name;
        this.form.mobile = mobile;
        this.form.detail = addr;
        this.form.province_id = province_id;
        this.form.district_id = region_id;
        this.form.city_id = city_id;
      }
    },

    async getDetail() {
      const res = await this.$requestAll.user.addressDetail(
        {
          id: this.id
        },
        true
      );

      this.detail = res.data;
      this.form = {
        name: res.data.name,
        detail: res.data.detail,
        latitude: res.data.latitude,
        longitude: res.data.longitude,
        mobile: res.data.mobile,
        is_default: Boolean(res.data.is_default),
        province_id: res.data.district.province.id,
        city_id: res.data.district.city.id,
        district_id: res.data.district.district.id
      };
    },
    async onDingwei() {
      // uni.getSetting({
      //    success: async(res)=> {
      // 			this.userLocation = res.authSetting["scope.userLocation"]
      // 	  if(this.userLocation){
      // 	  	const location = await this.$store.dispatch("GETLOCATION");
      // 	  	let params = {};
      // 	  	if (location.latitude > 0) {
      // 	  	  params = {
      // 	  	    latitude: location.latitude,
      // 	  	    longitude: location.longitude,
      // 	  	  };
      // 	  	}
      // 	  	uni.chooseLocation({
      // 	  	  ...params,
      // 	  	  success: (res) => {
      // 	  	    if (res.errMsg == "chooseLocation:ok") {
      // 	  	      console.log('res',res);
      // 	  	      this.form = {
      // 	  	        ...this.form,
      // 	  	        latitude: res.latitude,
      // 	  	        longitude: res.longitude,
      // 	  	        detail: res.name,
      // 	  	      };
      // 	  	      this.getAddressId(res.address + res.name);
      // 	  	    }
      // 	  	  },
      // 	  	  fail: (erro) => {
      // 	  	    console.log(erro);
      // 	  	    uni.$u.toast(erro.errMsg || '打开定位失败');
      // 	  	  },
      // 	  	});
      // 	  }else{
      // 		  uni.showModal({
      // 		  	title:'提示',
      // 		  	content: '是否允许系统获取您的位置信息?',
      // 		  	success:async ({confirm,cancel}) => {
      // 		  		if(confirm) {
      // 		  			console.log(confirm)
      // 		  			const location = await this.$store.dispatch("GETLOCATION");
      // 		  			let params = {};
      // 		  			if (location.latitude > 0) {
      // 		  			  params = {
      // 		  			    latitude: location.latitude,
      // 		  			    longitude: location.longitude,
      // 		  			  };
      // 		  			}
      // 		  			uni.chooseLocation({
      // 		  			  ...params,
      // 		  			  success: (res) => {
      // 		  			    if (res.errMsg == "chooseLocation:ok") {
      // 		  			      console.log('res',res);
      // 		  			      this.form = {
      // 		  			        ...this.form,
      // 		  			        latitude: res.latitude,
      // 		  			        longitude: res.longitude,
      // 		  			        detail: res.name,
      // 		  			      };
      // 		  			      this.getAddressId(res.address + res.name);
      // 		  			    }
      // 		  			  },
      // 		  			  fail: (erro) => {
      // 		  			    console.log(erro);
      // 		  			    uni.$u.toast(erro.errMsg || '打开定位失败');
      // 		  			  },
      // 		  			});
      // 		  		}
      // 		  	}
      // 		  })
      // 	  }
      //    }
      // })
      //#ifdef APP-PLUS
      if (this.systemInfo.osName !== "ios") {
        uni.showModal({
          title: "提示",
          content: "是否允许系统获取您的位置信息?用于定位收货地址",
          success: async ({ confirm, cancel }) => {
            if (confirm) {
              const location = await this.$store.dispatch("GETLOCATION");
              let params = {};
              if (location.latitude > 0) {
                params = {
                  latitude: location.latitude,
                  longitude: location.longitude
                };
              }
              uni.chooseLocation({
                ...params,
                success: (res) => {
                  if (res.errMsg == "chooseLocation:ok") {
                    console.log("res", res);
                    this.form = {
                      ...this.form,
                      latitude: res.latitude,
                      longitude: res.longitude,
                      detail: res.name
                    };
                    this.getAddressId(res.address + res.name);
                  }
                },
                fail: (erro) => {
                  console.log(erro);
                  uni.$u.toast("打开定位失败");
                }
              });
            }
          }
        });
      } else {
        const location = await this.$store.dispatch("GETLOCATION");
        let params = {};
        if (location.latitude > 0) {
          params = {
            latitude: location.latitude,
            longitude: location.longitude
          };
        }
        uni.chooseLocation({
          ...params,
          success: (res) => {
            if (res.errMsg == "chooseLocation:ok") {
              console.log("res", res);
              this.form = {
                ...this.form,
                latitude: res.latitude,
                longitude: res.longitude,
                detail: res.name
              };
              this.getAddressId(res.address + res.name);
            }
          },
          fail: (erro) => {
            console.log(erro);
            uni.$u.toast("打开定位失败");
          }
        });
      }

      //#endif
      //#ifdef MP-WEIXIN || H5
      const location = await this.$store.dispatch("GETLOCATION");
      let params = {};
      if (location.latitude > 0) {
        params = {
          latitude: location.latitude,
          longitude: location.longitude
        };
      }
      uni.chooseLocation({
        ...params,
        success: (res) => {
          if (res.errMsg == "chooseLocation:ok") {
            console.log("res", res);
            this.form = {
              ...this.form,
              latitude: res.latitude,
              longitude: res.longitude,
              detail: res.name
            };
            this.getAddressId(res.address + res.name);
          }
        },
        fail: (erro) => {
          console.log(erro);
          uni.$u.toast("打开定位失败");
        }
      });
      //#endif
    },
    async submit() {
      uni.showLoading({
        title: "加载中"
      });
      this.$refs["form"].validate().then(async () => {
        try {
          if (
            !this.form.province_id ||
            !this.form.city_id ||
            !this.form.district_id
          )
            return uni.$u.toast("请选择所在地区");

          await this.$requestAll.user.addrsssSave({
            ...this.form,
            address_id: this.id || "",
            is_default: Number(this.form.is_default)
          });
          uni.hideLoading();
          this.$utils.backTo();
        } catch (error) {
          console.log(123);
          uni.hideLoading();
        }
      });
    },
    async getAddressId(name = "") {
      const res = await this.$requestAll.default.addressSmart({
        address: name
      });
      if(res.data.province_id && res.data.city_id && res.data.region_id){
        this.form.province_id = res.data.province_id;
        this.form.city_id = res.data.city_id;
        this.form.district_id = res.data.region_id;
      }else{
        uni.$u.toast("地址解析失败");
      }
      
    }
  },
  computed: {
    store() {
      return this.$store.getters["SHOP_CONFIG"].store;
    }
  },
  watch: {},
  onReachBottom() {},
  onPullDownRefresh() {}
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);

  /* #endif */
  /deep/.u-line {
    border-color: #e5e5e5;
  }
  .address {
    margin-left: 20rpx;
    // display: -webkit-box;
    // display: -webkit-flex;
    display: flex;
    // justify-content: space-between;
    // flex-direction: row;
    // -webkit-box-align: center;
    // -ms-flex-align: center;
    // -ms-grid-row-align: center;
    align-items: center;
    .pickeraddress {
      // flex: 1;
      width: 430rpx;
    }
  }
  .detail_address {
    display: flex;
    width: 450rpx;
  }
}

.submit {
  margin: auto;
  margin-top: 100rpx;
  width: 90%;
  line-height: 80rpx;
  text-align: center;
  color: #fff;
  border-radius: 50rpx;
  font-size: 32rpx;
  background: linear-gradient(to right, #f2140c, #f14c0c);
}

.copy-con {
  margin-top: 24rpx;
  padding: 24rpx;
  background: #f2f2f2;
  border-radius: 20rpx;

  textarea {
    height: 80rpx;
    font-size: 28rpx;
    width: 100%;
  }
}

.copy-btn {
  display: flex;
  justify-content: flex-end;
  padding-top: 40rpx;
  &.focus {
    .sub {
      opacity: 1;
    }
  }

  .sub {
    background: #ff1b22;
    color: #fff;
    opacity: 0.5;
  }

  .clear {
    color: #666;
  }

  view {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 20rpx;
    width: 108rpx;
    height: 50rpx;
    font-size: 24rpx;
    border-radius: 32px;
  }
}

.copy-tit {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30rpx 0;

  .icon-arrow-right {
    position: relative;
    transform: rotate(90deg);
  }

  &.on {
    .icon-arrow-right {
      transform: rotate(270deg);
    }
  }
}
</style>
