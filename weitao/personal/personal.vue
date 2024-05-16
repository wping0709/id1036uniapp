<template>
  <view v-if="user" class="body">
    <div @click="confirmAvatar" class="item">
      <view>头像</view>
      <view class="flex-y-center">
        <image
          :src="user.head"
          mode="aspectFill"
          style="width: 100rpx; height: 100rpx; border-radius: 50%"
        />
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <div @click="onShowPopup('nickname')" class="item">
      <view>昵称</view>
      <view class="flex-y-center">
        <text class="color-999">{{ user.nickname }}</text>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <div  class="item">
      <view>地区</view>
      <view class="flex-y-center flex-w-1">
        <view class="color-999 flex-x-end flex-w-1">
          <PickerAddress
            :num="3"
            @onChange="addressChange"
          >
            <view class="u-line-1">
              {{ cpAddress }}
            </view>
          </PickerAddress>
        </view>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>

    <div @click="onShowPopup('desc')" class="item">
      <view>个性签名</view>
      <view class="flex-y-center">
        <text class="color-999">{{ user.desc }}</text>
        <text class="iconfont icon-arrow-right color-999"></text>
      </view>
    </div>
    <u-popup
      :show="showPopup"
      round="20rpx"
      @close="showPopup = false"
      :safeAreaInsetBottom="false"
      mode="center"
    >
      <view class="popup-box">
        <view class="font-center font-w-600 font-34 m-b-30">
          {{ popupTitle }}
        </view>

        <view>
          <u-textarea
            autoHeight
            v-model="popupInput"
            placeholder="请输入..."
          ></u-textarea>
        </view>

        <view class="bt" @click="popupSubmit">提交修改</view>
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
</template>
<script>
import request from '@/utils/request.js';
import PickerAddress from '@/components/picker-address/picker-address';

export default {
  components: {
    PickerAddress,
  },
  data() {
    return {
      user: '',
      popupType: '',
      popupTitle: '修改昵称',
      popupInput: '',
      showPopup: false,
      checkAddress: [],

      sexShow: false,
      dateShow: false,
      nameShow: false,
      dateValue: '',
      nameValue: '',
      defaultIndex: 0,
    };
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.weitao.userCenter({});
      this.user = res.data.user;
      if (res.data.user.city_name) {
        this.checkAddress = [
          { name: res.data.user.city_name },
          { name: res.data.user.province_name },
          { name: res.data.user.district_name },
        ];
      }
    },
    // 弹框显示
    onShowPopup(type) {
      this.popupType = type;
      if (type == 'desc') {
        this.popupInput = this.user.desc;
        this.popupTitle = '个性签名';
      } else if (type == 'nickname') {
        this.popupTitle = '昵称';
        this.popupInput = this.user.nickname;
      }
      this.showPopup = true;
    },
    popupSubmit() {
      var user;
      if (this.popupType == 'desc') {
        user = Object.assign(this.user, { desc: this.popupInput });
      } else if (this.popupType == 'nickname') {
        user = Object.assign(this.user, { nickname: this.popupInput });
      }
      this.showPopup = false;

      this.modifySubmit(user);
    },
    confirmAvatar() {
      uni.chooseImage({
        count: 1,
        success: async chooseImageRes => {
          console.log(chooseImageRes.tempFilePaths[0]);
          // return
          const res = await request.UPLOAD_IMAGE(
            chooseImageRes.tempFilePaths[0],
            '/default/upload-image'
          );
          this.modifySubmit(Object.assign(this.user, { head: res.data.url }));
        },
      });
    },
    addressChange(v) {
      this.checkAddress = v
      this.modifySubmit(
        Object.assign(this.user, {
          city_name: v[0].name,
          province_name: v[1].name,
          district_name: v[2].name,
        })
      );
    },

    async modifySubmit(user) {
      const res = await this.$requestAll.weitao.editUserCenter(user, true);
      uni.$u.toast(res.msg);
      this.user = user;
    },
  },
  computed: {
    minDate() {
      const time = new Date('1970-01-01').getTime();
      console.log(time);
      return time;
    },
    maxDate() {
      const time = new Date(
        this.$utils.currentDate('yyyy-mm-dd', '-')
      ).getTime();
      console.log(time);
      return time;
    },
    cpAddress() {
      if (this.checkAddress.length) {
        return `${this.checkAddress[0].name} ${this.checkAddress[1].name} ${this.checkAddress[2].name}`;
      } else {
        return '无';
      }
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  font-size: 28rpx;
  background: #f5f5f5;
  min-height: 100vh;
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
