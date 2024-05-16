<template>
  <view class="body flex-col">
    <div class="search">
      <view class="tabs">
        <div
          @click="switchTab(1, 'status')"
          :class="status == 1 && 'check'"
          class="tab"
        >
          全部用户
        </div>
        <div
          @click="switchTab(2, 'status')"
          :class="status == 2 && 'check'"
          class="tab"
        >
          核销员
        </div>
      </view>
      <view class="p-20">
        <u-input
          class="u-input"
          v-model="keyword"
          placeholder="请输入昵称搜索"
          border="none"
          shape="circle"
          @confirm="loadData(true)"
        ></u-input>
      </view>
    </div>
    <scroll-view @scrolltolower="loadData(false)" scroll-y class="flex-h-1">
      <div v-if="pageData.list.length" class="list">
        <div class="item" v-for="(item, i) in pageData.list" :key="i">
          <template v-if="status == 1">
            <view class="user flex-y-center">
              <image :src="item.avatar_url" mode="aspectFill"></image>
              <view class="font-32 flex-w-1 u-line-1">{{
                item.nickname
              }}</view>
            </view>

            <view class="message">
              <div class="row">
                <view class="rol flex">
                  <div class="label">优惠券</div>
                  <div class="flex-w-1">{{ item.coupon_count }}</div>
                </view>
                <view class="rol m-l-10 flex">
                  <div class="label">积分</div>
                  <div class="flex-w-1">{{ item.integral }}</div>
                </view>
              </div>
              <div class="row">
                <view class="rol flex">
                  <div class="label">订单数</div>
                  <div class="flex-w-1">
                    {{ item.order_count }}
                  </div>
                </view>
                <view class="rol m-l-10 flex">
                  <div class="label">余额</div>
                  <div class="flex-w-1">{{ item.money }}</div>
                </view>
              </div>
            </view>

            <div class="btns">
              <view @click="onReview(true, item, i)">充值</view>
              <view @click="onReview(false, item, i)">扣除</view>
            </div>
          </template>
          <template v-else>
            <view class="user flex-y-center">
              <image :src="item.avatar_url" mode="aspectFill"></image>
              <view class="flex-w-1">
                <view class="font-32 u-line-1">
                  {{ item.nickname }}
                </view>
                <view class="u-line-1 color-999 font-26">
                  <text class="iconfont icon-store"></text>
                  <text>{{ item.shop_name }}</text>
                </view>
              </view>
            </view>

            <view class="flex-x-sa flex-y-center font-center m-t-20">
              <view>
                <view class="label">订单数</view>
                <view>{{ item.order_count }}</view>
              </view>
              <view>
                <view class="label">金额</view>
                <view>{{ item.total_price }}</view>
              </view>
              <view>
                <view class="label">卡劵数</view>
                <view>{{ item.card_count }}</view>
              </view>
            </view>

            <div class="btns">
              <view @click="onModifyShop(item, i)">修改门店</view>
              <view @click="onLift(item, i)">解除核销员</view>
            </div>
          </template>
        </div>
        <u-loadmore :status="pageData.status"></u-loadmore>
      </div>
      <u-empty
        v-else
        mode="data"
        :icon="wxapp_img.empty_data"
      ></u-empty>

      <u-picker
        @cancel="pickerCancel"
        :columns="[store_list]"
        @confirm="pickerConfirm"
        keyName="name"
        :show="showPicker"
      ></u-picker>

      <u-popup
        :show="showPay"
        :safeAreaInsetBottom="false"
        mode="center"
        bgColor="transparent"
        @cancel="showPay = false"
      >
        <div class="popup-pay">
          <view class="tabs">
            <div
              @click="popupStatus = 'integral'"
              :class="popupStatus == 'integral' && 'check'"
              class="tab"
            >
              {{ isPay ? '充' : '扣' }}积分
            </div>
            <div
              @click="popupStatus = 'balance'"
              :class="popupStatus == 'balance' && 'check'"
              class="tab"
            >
              {{ isPay ? '充' : '扣' }}余额
            </div>
          </view>

          <div class="popup-content m-y-20">
            <u-input
              v-model="value"
              type="digit"
              :placeholder="
                popupStatus == 'integral' ? '请填写充值积分' : '请填写充值余额'
              "
            ></u-input>
          </div>

          <div class="popup-btns flex-y-center">
            <div @click="showPay = false" class="cancel">取消</div>
            <div @click="popupConfirm" class="confirm">确定</div>
          </div>
        </div>
      </u-popup>
    </scroll-view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      pageData: {
        list: [],
        page: 1,
        status: 'loadmore',
      },
      store_list: [],
      keyword: '',
      status: 1,
      showPay: false, //充值扣除弹框开关
      popupStatus: 'integral', //'popupTab状态'
      isPay: false, //是否为充值
      checkItem: '', //选中数据
      value: '',
      showPicker: false,
    };
  },
  computed: {},
  watch: {},
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData(reset) {
      reset && (this.pageData = this.$options.data().pageData);
      if (this.pageData.status == 'nomore') return;
      if (this.status == 1) {
        var res = await this.$requestAll.admin.userUser(
          {
            page: this.pageData.page,
            keyword: this.keyword,
          },
          true
        );
      } else {
        var res = await this.$requestAll.admin.userClerk(
          {
            page: this.pageData.page,
            keyword: this.keyword,
            status: '',
          },
          true
        );
        this.store_list = res.data.store_list;
      }
      this.pageData.list.push(...res.data.list);
      this.pageData.page++;
      this.pageData.status = res.data.list.length < 20 ? 'nomore' : 'loadmore';
    },
    switchTab(type, key) {
      this[key] = type;
      this.keyword = '';
      this.loadData(true);
    },
    onReview(isSuccess, item, i) {
      this.checkItem = item;
      this.isPay = isSuccess;
      this.value = '';
      this.showPay = true;
    },
    // popup提交
    async popupConfirm() {
      if (this.popupStatus == 'integral') {
        var res = await this.$requestAll.admin.userIntegral(
          {
            user_id: this.checkItem.id,
            num: this.value,
            type: this.isPay ? 1 : 0,
          },
          true
        );
      } else {
        var res = await this.$requestAll.admin.userBalance(
          {
            user_id: this.checkItem.id,
            price: this.value,
            type: this.isPay ? 1 : 0,
          },
          true
        );
      }
      uni.$u.toast(res.msg);
      this.showPay = false;

      this.pageData.list = this.pageData.list.map(item => {
        if (item.id == this.checkItem.id) {
          // 充值
          if (this.isPay) {
            // 积分
            if (this.popupStatus == 'integral') {
              item.integral = Number(item.integral) + Number(this.value);
            } else {
              item.money = Number(item.money) + Number(this.value);
            }
          } else {
            if (this.popupStatus == 'integral') {
              item.integral = Number(item.integral) - Number(this.value);
            } else {
              item.money = Number(item.money) - Number(this.value);
            }
          }
        }
        return item;
      });
    },
    // 解除核销员
    async onLift(item, i) {
      uni.showModal({
        title: '提示',
        content: '确定解除该核销员',
        showCancel: true,
        success: async ({ confirm, cancel }) => {
          if (confirm) {
            var res = await this.$requestAll.admin.clerkEdit(
              {
                id: item.id,
              },
              true
            );
            this.pageData.list.splice(i, 1);
          }
        },
      });
    },
    onModifyShop(item) {
      this.checkItem = item;
      this.showPicker = true;
    },
    pickerCancel() {
      this.showPicker = false;
    },
    async pickerConfirm(e) {
      console.log(e);
      var { value } = e;
      await this.$requestAll.admin.clerkEdit(
        {
          id: this.checkItem.id,
          shop_id: value[0].id,
        },
        true
      );
      const i = this.pageData.list.findIndex(
        item => item.id == this.checkItem.id
      );
      this.pageData.list[i] = Object.assign(this.pageData.list[i], {
        shop_id: value[0].id,
        shop_name: value[0].name,
      });
      this.showPicker = false;
    },
  },
  onReachBottom() {},
  onPullDownRefresh() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
  /deep/.u-input {
    background: #fff;
    padding: 8rpx 20rpx!important;
  }
  .list {
    padding: 0 20rpx;
    padding: 0 20rpx env(safe-area-inset-bottom);
    .item {
      padding: 20rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      background: #fff;
      .user {
        > image {
          margin-right: 20rpx;
          width: 80rpx;
          height: 80rpx;
        }
      }
      .message {
        .row {
          display: flex;
          margin-top: 10rpx;
          .rol {
            flex: 1;
            width: 0;
            align-items: center;
            .label {
              padding: 4rpx 10rpx;
              background: #f5f5f5;
            }
            > .flex-w-1 {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              width: 0;
            }
          }
        }
      }
      .btns {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        margin-top: 20rpx;
        > view {
          margin-left: 20rpx;
          padding: 0 30rpx;
          line-height: 60rpx;
          border-radius: 30rpx;
          border: 1px solid #999;
          &:nth-child(1) {
            color: #446dfd;
            border-color: #446dfd;
          }
        }
      }
    }
  }
  .tabs {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 30rpx;
    background: #fff;

    .tab {
      line-height: 90rpx;
    }

    .check {
      position: relative;
      color: red;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 10rpx;
        transform: translateX(-50%);
        width: 30rpx;
        height: 4rpx;
        background: red;
      }
    }
  }

  .popup-pay {
    width: 80vw;
    padding: 0 20rpx;
    border-radius: 10rpx;
    background: #fff;
    .popup-btns {
      border-top: 1px solid #e5e5e5;

      padding: 10rpx 0;
      > div {
        font-size: 30rpx;
        text-align: center;
        flex-grow: 1;
        line-height: 70rpx;
      }
      .confirm {
        color: #446dfd;
        border-left: 1px solid #e5e5e5;
      }
    }
  }
}
</style>
