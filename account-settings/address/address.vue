<!-- 地址管理 -->
<template>
  <view class="address">
    <!-- 地址列表 -->
    <view class="address-all">
      <view class="address-list" v-for="(item, index) in list" :key="index">
        <view class="address-list-top" @click="selectAddress(item)">
          <view>
            <view>收货人：{{ item.name }}</view>
            <view>{{ item.mobile }}</view>
          </view>
          <view>{{ item.address }}</view>
        </view>
        <view
          class="address-list-bottom"
          :style="{ justifyContent: 'space-between' }"
        >
          <view
            class="list-bottom-left"
            @click="setDefaultAdd(item.id)"
            v-if="item.is_default == 1"
          >
            <text class="iconfont icon-success-fill price-color"></text>
            <view>默认地址</view>
          </view>
          <view class="list-bottom-left" @click="setDefaultAdd(item.id)" v-else>
            <text class="iconfont icon-xuanzekuangmoren"></text>

            <view style="color: #333333">设置默认地址</view>
          </view>
          <view class="list-bottom-right">
            <view
              @click="
                $utils.toUrl(
                  '/account-settings/address-edit/address-edit?id=' + item.id
                )
              "
            >
              <u-icon name="edit-pen"></u-icon>
              <view>编辑</view>
            </view>
            <view @click="delItem(item.id)">
              <u-icon name="trash"></u-icon>
              <view>删除</view>
            </view>
          </view>
        </view>
      </view>
      <view v-if="list.length == 0" style="padding-top: 30rpx">
        <u-empty mode="address"></u-empty>
      </view>
    </view>
    <!-- 地址列表 -->

    <!-- 底部新增收货地址内容 -->
    <view class="address-bottom">
      <view>
        <navigator class="add" @click="$utils.toUrl('/account-settings/address-edit/address-edit')">
          + 新建收货地址
        </navigator>
      </view>
    </view>
    <!-- 底部新增收货地址内容 -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      is_order: 0,
    };
  },
  onShow() {
    this.getAddressList();
  },
  onLoad(t) {
    if (t.is_order) {
      this.is_order = 1;
    }
  },
  methods: {
    // 设置默认地址
    async setDefaultAdd(id) {
      await this.$requestAll.user.addressSetDefault({
        address_id: id,
      });
      this.getAddressList();
    },
    // 删除地址
    async delItem(id) {
      uni.showModal({
        title: '提示',
        content: '您确定删除当前地址吗?',
        success: async res => {
          if (res.confirm) {
            await this.$requestAll.user.addressDelete({ address_id: id });
            this.getAddressList();
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        },
      });
    },
    async getAddressList() {
      const res = await this.$requestAll.user.addressList({}, true);
      this.list = res.data.list;
    },
    selectAddress(item) {
      if (this.is_order) {
        this.$store.commit('setAddress', item);
        this.$utils.backTo();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.address {
  padding-top: 20rpx;
  min-height: 100vh;
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  
  /* #endif */
  padding-bottom: 306rpx;
  background-color: #f2f2f2;
}
.address-list {
  margin-bottom: 20rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 0rpx 30rpx;
  .address-list-top {
    border-bottom: 1rpx solid #f0f0f0;
    padding: 34rpx 0rpx;
    > view:first-child {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      view:first-child {
        font-size: 32rpx;
        color: #262626;
        font-weight: bold;
      }
      view:last-child {
        font-size: 30rpx;
        color: #262626;
      }
    }
    > view:last-child {
      margin-top: 18rpx;
      font-size: 24rpx;
      color: #999999;
    }
  }
  .address-list-bottom {
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .list-bottom-left {
      display: flex;
      align-items: center;
      view {
        margin-left: 6rpx;
        font-size: 24rpx;
        color: #f2270c;
      }
    }
    .list-bottom-right {
      display: flex;
      align-items: center;
      > view {
        margin-left: 56rpx;
        display: flex;
        align-items: center;
        view {
          margin-left: 12rpx;
          font-size: 24rpx;
          color: #262626;
        }
        image {
          width: 24rpx;
          height: 24rpx;
          background-color: red;
        }
      }
    }
  }
}
.address-bottom {
  position: fixed;
  left: 0rpx;
  bottom: 0rpx;
  width: 100%;
  background-color: #f2f2f2;
  > view:first-child {
    padding: 0rpx 36rpx;
    height: 146rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    view:first-child {
      width: 322rpx;
      height: 94rpx;
      border: 1rpx solid #c7c7c7;
      text-align: center;
      line-height: 94rpx;
      font-size: 32rpx;
      color: #262626;
      font-weight: bold;
      border-radius: 48rpx;
    }
    view:last-child {
      border-radius: 48rpx;
      width: 324rpx;
      height: 96rpx;
      color: #ffffff;
      text-align: center;
      line-height: 96rpx;
      font-size: 32rpx;
      font-weight: bold;
      background: linear-gradient(90deg, #f3150c, #f14b0c);
    }
  }
  > view:last-child {
    padding: 0rpx 36rpx;
    height: 146rpx;
    background-color: #ffffff;
    margin-top: 14rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .add {
      width: 100%;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;
      font-size: 32rpx;
      color: #ffffff;
      font-weight: bold;
      background: linear-gradient(90deg, #f3150c, #f14b0c);
      border-radius: 48rpx;
    }
  }
}
</style>
