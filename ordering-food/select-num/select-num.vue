<template>
  <view class="select_num">
    <view class="background-img">
      <image :src="listdata.bg_url" mode=""></image>
    </view>
    <view class="content">
      <view class="title">
        <view
          style="margin-bottom: 30rpx; font-size: 38rpx; letter-spacing: 5rpx"
        >
          欢迎来到
        </view>
        <view style="font-weight: bold; font-size: 44rpx; letter-spacing: 8rpx">
          {{ listdata.mch_name }}
        </view>
      </view>
      <view class="select_box">
        <view class="top">
          <view class="" style="font-size: 36rpx; font-weight: bold">
            您好，请选择就餐人数
          </view>
          <view class="" style="color: #9f9f9f">
            桌号<text style="margin-left: 5rpx">{{
              listdata.table_number
            }}</text>
          </view>
        </view>
        <view class="num_list">
          <view
            class="item"
            v-for="(item, index) in numList"
            :key="index"
            @click="handle(item, index)"
            :class="[checkIndex == index && 'active']"
          >
            <text>{{ item.name }}</text>
          </view>
        </view>
        <view class="button1" @click="startFood()" v-if="num > 0">
          <text style="font-size: 32rpx">开始点餐</text>
        </view>
        <view class="button" v-else>
          <text style="font-size: 32rpx">开始点餐</text>
        </view>
      </view>
    </view>
    <u-popup
      :show="popupShow"
      @close="close"
      closeable
      mode="bottom"
      :round="10"
    >
      <view class="popup_box">
        <view class="popup_title"> 请输入就餐人数 </view>
        <view class="num">
          <text
            style="font-size: 50rpx; font-weight: bold; margin-right: 5rpx"
            >{{ num }}</text
          ><text style="color: #9f9f9f">位</text>
        </view>
        <u-keyboard
          ref="uKeyboard"
          mode="number"
          :show="show"
          :overlay="false"
          @change="keyboardChange()"
          @backspace="backspace"
          @confirm="keyboardConfirm()"
        ></u-keyboard>
      </view>
    </u-popup>
    <!-- 点击开始订餐弹出选择 -->
    <u-popup
      :show="startPopupShow"
      @close="close"
      :closeable="false"
      mode="center"
      :round="10"
    >
      <view class="start_popup">
        <view class="name"> 请选择点餐方式 </view>
        <view
          :class="[store == 1 ? 'type_one' : 'type_onetoblack']"
          @click="toShop('store')"
        >
          <view class="icon">
            <u-icon name="home-fill" color="#ffffff" size="30"></u-icon>
          </view>
          <view class="text">
            <view style="color: #fc1d22; font-size: 30rpx; font-weight: bold">
              店内堂食
            </view>
            <view style="color: #e61a21; font-size: 24rpx">
              店内就餐，请选择需要菜品
            </view>
          </view>
          <view class="right">
            <u-icon name="arrow-right" color="#e61a21" size="16"></u-icon>
          </view>
        </view>
        <!-- 打包带走 -->
        <view
          :class="[pack == 1 ? 'type_one' : 'pack_toblack']"
          @click="toShop('pack')"
        >
          <view class="icon">
            <u-icon name="bag-fill" color="#ffffff" size="30"></u-icon>
          </view>
          <view class="text">
            <view style="color: #fc1d22; font-size: 30rpx; font-weight: bold">
              打包带走
            </view>
            <view style="color: #e61a21; font-size: 24rpx">
              打包带走，请选择需要菜品
            </view>
          </view>
          <view class="right">
            <u-icon name="arrow-right" color="#e61a21" size="16"></u-icon>
          </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      startPopupShow: false,
      checkStartBtn: false,
      checkIndex: 0,
      table_id: 0,
      mch_id: 0,
      num: 1,
      pack: 1,
      store: 1,
      listdata: {},
      show: false,
      value: "",
      isActive: false,
      popupShow: false,
      numList: [
        {
          id: 0,
          name: 1,
        },
        {
          id: 1,
          name: 2,
        },
        {
          id: 2,
          name: 3,
        },
        {
          id: 3,
          name: 4,
        },
        {
          id: 4,
          name: 5,
        },
        {
          id: 5,
          name: 6,
        },
        {
          id: 6,
          name: 7,
        },
        {
          id: 7,
          name: 8,
        },
        {
          id: 8,
          name: 9,
        },
        {
          id: 9,
          name: "其他",
        },
      ],
    };
  },
  onLoad(option) {
    uni.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#ff1b22",
      animation: {
        duration: 400,
        timingFunc: "easeIn",
      },
    });
    if (option) {
      let params = {};
      // 兼容非小程序
      if (option.scene) {
        params = this.$utils.wxParams(option);
      } else {
        params = option;
      }
      this.table_id = params.table_id;
      this.mch_id = params.mch_id;
    }

    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.orderingfood.getQrorderInfo(
        {
          mch_id: this.mch_id ? this.mch_id : 1,
          table_id: this.table_id ? this.table_id : 1,
        },
        true
      );
      if (res.code == 0) {
        this.listdata = res.data;
        this.pack = res.data.food_type.pack;
        this.store = res.data.food_type.store;
        console.log(this.listdata, "this.listdata");
      }
    },
    handle(item, index) {
      this.checkIndex = index;
      this.num = item.name;
      this.checkStartBtn = true;
      if (item.name == "其他") {
        this.popupShow = true;
        this.show = true;
        this.num = "";
      }
    },
    close() {
      this.popupShow = false;
      this.startPopupShow = false;
    },
    change() {},
    keyboardChange(val) {
      // 输入两位数
      this.num += val;
    },
    // 数字键盘退格键 删除最后一个字符
    backspace() {
      if (this.num.length) this.num = this.num.substr(0, this.num.length - 1);
    },
    keyboardConfirm() {
      this.show = false;
      this.popupShow = false;
    },
    startFood() {
      this.startPopupShow = true;
    },
    toShop(type) {
      let query = {
        table_number: this.listdata.table_number,
        mch_name: this.listdata.mch_name,
        num: this.num,
        store: this.store,
        table_id:this.table_id,
        mch_id:this.mch_id
      };
      if (type == "store") {
        query.store = this.store;
        if (this.store == 1)
          this.$utils.toUrl(
            "/ordering-food/home/home?query=" + JSON.stringify(query)
          );
      } else if (type == "pack") {
        query.pack = this.pack;
        if (this.pack == 1)
          this.$utils.toUrl(
            "/ordering-food/home/home?query=" + JSON.stringify(query)
          );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.select_num {
  position: relative;
  height: 100vh;

  .background-img {
    width: 100%;
    height: 100%;

    > image {
      width: 100%;
      height: 100%;
    }
  }

  .content {
    padding: 0 25rpx;
    height: 730rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: absolute;
    top: 265rpx;

    .title {
      text-align: center;
      color: #ffffff;
    }

    .select_box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30rpx;
      width: 100%;
      height: 520rpx;
      background-color: #ffffff;
      border-radius: 20rpx;

      .top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .num_list {
        width: 100%;
        display: flex;
        flex-wrap: wrap;

        .item {
          margin-right: 15rpx;
          margin-bottom: 25rpx;
          text-align: center;
          width: 110rpx;
          height: 60rpx;
          line-height: 60rpx;
          border-radius: 40rpx;
          background-color: #eeeeee;
        }

        .active {
          background-color: #f80000;
          color: #ffffff;
        }
      }

      .button {
        height: 70rpx;
        background-color: #ff8c8f;
        text-align: center;
        line-height: 70rpx;
        color: #ffffff;
        border-radius: 40rpx;
      }

      .button1 {
        height: 70rpx;
        background-color: #ff1b22;
        text-align: center;
        line-height: 70rpx;
        color: #ffffff;
        border-radius: 40rpx;
      }
    }
  }

  .popup_box {
    height: 900rpx;
    padding-top: 30rpx;

    .popup_title {
      text-align: center;
      font-size: 40rpx;
      font-weight: bold;
    }

    .num {
      text-align: center;
      margin-top: 50rpx;
    }
  }

  .start_popup {
    padding: 30rpx 60rpx 50rpx 60rpx;

    .name {
      text-align: center;
      font-size: 30rpx;
      font-weight: bold;
      color: #444444;
    }

    .type_one {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40rpx;
      padding-right: 10rpx;
      width: 500rpx;
      height: 140rpx;
      background-color: #fcf1ef;
      border-radius: 80rpx;

      .icon {
        margin-left: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110rpx;
        height: 110rpx;
        background-color: #ff1b20;
        border-radius: 50%;
      }
    }

    .type_onetoblack {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40rpx;
      padding-right: 10rpx;
      width: 500rpx;
      height: 140rpx;
      background-color: #eaeaea;
      border-radius: 80rpx;

      .icon {
        margin-left: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110rpx;
        height: 110rpx;
        background-color: #b4b4b4;
        border-radius: 50%;
      }
    }

    .pack_toblack {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 40rpx;
      padding-right: 10rpx;
      width: 500rpx;
      height: 140rpx;
      background-color: #eaeaea;
      border-radius: 80rpx;

      .icon {
        margin-left: 10rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110rpx;
        height: 110rpx;
        background-color: #b4b4b4;
        border-radius: 50%;
      }
    }
  }
}
</style>
