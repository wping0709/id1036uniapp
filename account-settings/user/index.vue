<template>
  <view v-if="pageData" class="body">
    <div @click="confirmAvatar" class="item">
      <view>头像</view>
      <view class="flex-y-center">
        <image
          :src="pageData.avatar_url"
          mode="aspectFill"
          style="width: 100rpx; height: 100rpx; border-radius: 50%"
        />
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <div @click="nameShow = true" class="item">
      <view>昵称</view>
      <view class="flex-y-center">
        <text class="color-999">{{ pageData.nickname }}</text>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <u-popup
      :show="nameShow"
      round="20rpx"
      @close="nameShow = false"
      mode="center"
    >
      <view class="popup-box">
        <view class="font-center font-w-600 font-34 m-b-30"> 修改昵称 </view>

        <view>
          <u-input v-model="nameValue" @blur="nickNameChange" type="nickname" placeholder="请输入昵称"></u-input>
        </view>

        <view class="bt" @click="nameConfirm">提交修改</view>
      </view>
    </u-popup>

    <div @click="sexShow = true" class="item">
      <view>性别</view>
      <view class="flex-y-center">
        <text v-if="pageData.sex == 0" class="color-999">{{
          pageData.sex == 0 && '保密'
        }}</text>
        <text v-else-if="pageData.sex == 1" class="color-999">{{
          pageData.sex == 1 && '男'
        }}</text>
        <text v-else class="color-999">{{ pageData.sex == 2 && '女' }}</text>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <u-picker
      :defaultIndex="[defaultIndex]"
      :show="sexShow"
      @cancel="sexShow = false"
      @confirm="sexConfirm"
      :columns="[['保密', '男', '女']]"
    ></u-picker>

    <div @click="dateShow = true" class="item">
      <view>出生日期</view>
      <view class="flex-y-center">
        <text class="color-999">{{ pageData.birth_date }}</text>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <u-datetime-picker
      :show="dateShow"
      v-model="dateValue"
      @cancel="dateShow = false"
      @confirm="dateConfirm"
      mode="date"
      :minDate="minDate"
      :maxDate="maxDate"
      :formatter="formatter"
    ></u-datetime-picker>

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
import request from '@/utils/request.js';
export default {
  data() {
    return {
      pageData: '',
      sexShow: false,
      dateShow: false,
      nameShow: false,
      dateValue: '',
      nameValue: '',
      defaultIndex: 0,
	  cancelMessage:'用户取消操作'
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.accountSettings.userIndex({});
      this.pageData = res.data;
    },
    nickNameChange(e) {
      this.nameValue = e
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      }
      if (type === 'month') {
        return `${value}月`;
      }
      if (type === 'day') {
        return `${value}日`;
      }
      return value;
    },
    sexConfirm(v) {
      console.log(v);
      this.sexShow = false;
      this.pageData.sex = v.indexs[0];
      this.modifyUser();
    },
    dateConfirm({ value }) {
      this.dateShow = false;
      this.pageData.birth_date = this.$utils.currentDate(
        'yyyy-mm-dd',
        '/',
        value
      );
      this.modifyUser();
    },
    nameConfirm() {
      console.log(this.nameValue);
      this.nameShow = false;
      this.pageData.nickname = this.nameValue;
      this.modifyUser();
    },
    confirmAvatar() {
		// #ifdef APP-PLUS
		if(this.systemInfo.osName !== 'ios'){
			uni.showModal({
			  title: '提示',
			  content: '是否允许系统打开您的摄像头/相册/相机/存储?用于上传图片或者更换头像',
			  showCancel: true,
			  success: async ({ confirm, cancel }) => {
			    if (confirm) {
					uni.chooseImage({
					  count: 1,
					  success: async chooseImageRes => {
					    const tempFilePaths = chooseImageRes.tempFilePaths[0];
					    console.log(tempFilePaths);
					    const res = await request.UPLOAD_IMAGE(
					      tempFilePaths,
					      '/default/upload-image',
					      'image'
					    );
					    this.pageData.avatar_url = res.data.url;
					    this.modifyUser();
					  },
					  fail:(fail)=>{
					    console.log(fail);
					    uni.$u.toast(this.cancelMessage)
					  },
					});
			    }
				if(cancel) {
					console.log('cancel',cancel)
				}
			  },
			});
		}else{
			uni.chooseImage({
			  count: 1,
			  success: async chooseImageRes => {
			    const tempFilePaths = chooseImageRes.tempFilePaths[0];
			    console.log(tempFilePaths);
			    const res = await request.UPLOAD_IMAGE(
			      tempFilePaths,
			      '/default/upload-image',
			      'image'
			    );
			    this.pageData.avatar_url = res.data.url;
			    this.modifyUser();
			  },
			  fail:(fail)=>{
			    console.log(fail);
			    uni.$u.toast(this.cancelMessage)
			  },
			});
		}
		// #endif
		// #ifdef H5 || MP-WEIXIN
		uni.chooseImage({
		  count: 1,
		  success: async chooseImageRes => {
		    const tempFilePaths = chooseImageRes.tempFilePaths[0];
		    console.log(tempFilePaths);
		    const res = await request.UPLOAD_IMAGE(
		      tempFilePaths,
		      '/default/upload-image',
		      'image'
		    );
		    this.pageData.avatar_url = res.data.url;
		    this.modifyUser();
		  },
		  fail:(fail)=>{
		    console.log(fail);
		    uni.$u.toast(this.cancelMessage)
		  },
		});
		// #endif
    },
    async modifyUser() {
      try {
        const formData = {
          username: this.pageData.username,
          nickname: this.pageData.nickname,
          sex: this.pageData.sex,
          avatar_url: this.pageData.avatar_url,
          birth_date: this.pageData.birth_date,
        };
        const res = await this.$requestAll.accountSettings.modifyUser(formData);
        this.$utils.toast('修改成功');
      } catch (error) {
        this.loadData();
      }
    },
  },
  computed: {
    minDate() {
      const time = +new Date() - 100*365*24*3600*1000
      return time;
    },
    maxDate() {
      const time = new Date().getTime();
      return time;
    },
  },
  watch: {
    pageData: {
      handler(v) {
        this.dateValue = new Date(this.pageData.birth_date).getTime();
        this.defaultIndex = this.pageData.sex;
        this.nameValue = this.pageData.nickname;
      },
      deep: true,
    },
  },
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  font-size: 28rpx;
  background: #f5f5f5;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  .item {
    &:nth-child(1) {
      line-height: 140rpx;
    }
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 100rpx;
    border-bottom: 2rpx solid #eee;
    padding: 0 30rpx;
    &:nth-last-child(1) {
      border-radius: 0 0 30rpx 30rpx;
    }
  }
  .border-0 {
    border: 0;
  }

  .popup-box {
    width: 600rpx;
    padding: 30rpx;
    .bt {
      border-radius: 40rpx;
      line-height: 70rpx;
      background: #f4160d;
      font-weight: 600;
      color: #fff;
      text-align: center;
      left: 80rpx;
      margin-top: 30rpx;
    }
  }
}
</style>
