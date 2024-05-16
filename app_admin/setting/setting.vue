<template>
  <view v-if="detail" class="body">
    <div class="heade m-b-20">
      <image :src="SHOP_CONFIG.store.store_share_logo" mode="aspectFill" />
      <view @click="onShowPopup('name')" class="flex-y-center flex-x-center">
        <text>{{ detail.setting.name }}</text>
        <text class="iconfont icon-bianji font-40 m-l-10"></text>
      </view>
    </div>
    <div @click="onShowPopup('delivery_area')" class="menu-item">
      <image :src="wxapp_img.admin.delete_time" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>删除未支付订单时间限时</view>
        <view class="color-999 flex-y-center">
          <text>{{ detail.setting.delivery_area }}分</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>

    <div @click="onShowPopup('delivery_time')" class="menu-item">
      <image :src="wxapp_img.admin.auto" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>自动确认收货时间</view>
        <view class="color-999 flex-y-center">
          <text>{{ detail.setting.delivery_time }}天</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>

    <div @click="onShowPopup('after_sale_time')" class="menu-item">
      <image :src="wxapp_img.admin.refund" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>可申请售后时间</view>
        <view class="color-999 flex-y-center">
          <text>{{ detail.setting.after_sale_time }}天</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>

    <div @click="onShowPopup('payment_type')" class="menu-item">
      <image :src="wxapp_img.admin.pay" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>
          <view>支付方式</view>
          <view class="color-999 font-26">
            {{ payText }}
          </view>
        </view>
        <view class="color-999 flex-y-center">
          <text></text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>

    <div @click="onShowPopup('send_type')" class="menu-item">
      <image :src="wxapp_img.admin.send" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>发货方式</view>
        <view class="color-999 flex-y-center">
          <text>{{
            send_list[detail.setting.send_type] &&
            send_list[detail.setting.send_type].name
          }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>
    <div @click="onShowPopup('address')" class="menu-item">
      <image :src="wxapp_img.admin.address" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>退货地址</view>
        <view class="color-999 flex-y-center">
          <text>{{ detail.address ? '查看' : '未填写' }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>
    <div @click="onShowPopup('integral')" class="menu-item">
      <image :src="wxapp_img.admin.intergral" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>积分抵扣</view>
        <view class="color-999 flex-y-center">
          <text>{{ detail.setting.integral }}积分抵扣1元</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>
    <div @click="onShowPopup('integration')" class="menu-item">
      <image :src="wxapp_img.admin.rule" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>积分使用规则</view>
        <view class="color-999 flex-y-center">
          <text>{{ detail.setting.integration ? '已填写' : '未填写' }}</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>
    <div
      @click="$utils.toUrl('/mch/m/freight-list/freight-list?mch_id=0')"
      class="menu-item"
    >
      <image :src="wxapp_img.admin.rule" mode="aspectFill" />
      <view class="m-l-20 flex-w-1 flex-y-center flex-x-sb">
        <view>运费规则设置</view>
        <view class="color-999 flex-y-center">
          <text></text>
          <text class="iconfont icon-arrow-right"></text>
        </view>
      </view>
    </div>

    <u-popup
      :show="popupData.show"
      mode="center"
      :safeAreaInsetBottom="false"
      @close="popupData.show = false"
      bgColor="transparent"
    >
      <div class="popup-box">
        <div class="font-center font-600-30">{{ popupData.title }}</div>

        <view v-if="popupData.type == 'integration'" class="m-y-30">
          <u-textarea
            v-model="value"
            placeholder="请填写积分使用规则"
          ></u-textarea>
        </view>

        <view v-else-if="popupData.type == 'send_type'" class="m-y-30">
          <u-radio-group
            v-model="value"
            placement="column"
            iconPlacement="right"
          >
            <u-radio
              :customStyle="{ padding: '8px 0', width: '70vw', margin: 'auto' }"
              v-for="(item, index) in send_list"
              :key="index"
              :label="item.name"
              :name="index"
            >
            </u-radio>
          </u-radio-group>
        </view>

        <view v-else-if="popupData.type == 'payment_type'" class="m-y-30">
          <view
            v-for="(v, key) in value"
            :key="key"
            class="payment-item p-y-10 flex-y-center flex-x-sb"
            @click="value[key] = !v"
          >
            <view class="flex-y-center">
              <image
                :src="detail.payment_img[key]"
                style="width: 60rpx; height: 60rpx"
                mode="aspectFill"
                class="m-r-20"
              />
              <text>{{ detail.payment_text[key] }}</text>
            </view>
            <view>
              <text
                v-if="!v"
                class="iconfont icon-xuanzekuangmoren font-50"
              ></text>
              <text
                v-else
                class="iconfont icon-success-fill price-color font-50"
              ></text>
            </view>
          </view>
        </view>

        <view v-else-if="popupData.type == 'address'">
          <u-form v-model="detail" labelWidth="140rpx">
            <u-form-item label="收货人">
              <u-input
                v-model="detail.address.name"
                placeholder="请输入收货人"
              ></u-input>
            </u-form-item>
            <u-form-item label="联系电话">
              <u-input
                v-model="detail.address.mobile"
                placeholder="请输入联系电话"
              ></u-input>
            </u-form-item>
            <u-form-item label="收货地址">
              <u-textarea
                v-model="detail.address.address"
                autoHeight
                placeholder="请输入收货地址"
              ></u-textarea>
            </u-form-item>
          </u-form>
        </view>

        <view v-else class="popup-content m-y-30">
          <u-input border="none" v-model="value" placeholder="请输入商城名称">
            <view slot="suffix">
              <text v-if="popupData.type == 'delivery_area'">分钟</text>
              <text
                v-else-if="
                  popupData.type == 'delivery_time' ||
                  popupData.type == 'after_sale_time'
                "
                >天</text
              >
              <text v-else-if="popupData.type == 'integral'">积分抵扣1元</text>
            </view>
          </u-input>
        </view>

        <div class="popup-btns flex-y-center">
          <div @click="popupData.show = false" class="cancel">取消</div>
          <div @click="popupConfirm" class="confirm">确定</div>
        </div>
      </div>
    </u-popup>

    <TabBar></TabBar>
  </view>
</template>
<script>
import TabBar from '../index/components/TabBar.vue';

const send_list = [
  {
    name: '快递或自提',
  },
  {
    name: '仅快递',
  },
  {
    name: '仅自提',
  },
];

export default {
  components: {
    TabBar,
  },
  data() {
    return {
      send_list,
      detail: '',
      popupData: {
        title: '',
        type: '',
        show: false,
      },
      value: '',
      addressForm: {
        name: '',
        address: '',
        mobile: '',
      },
    };
  },
  onLoad(params) {
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.admin.settingIndex({}, true);
      this.detail = res.data.detail;
    },
    // 显示弹框
    onShowPopup(type) {
      if (type == 'name') {
        this.value = this.detail.setting.name;
        this.popupData = {
          title: '修改商城名称',
          type,
          show: true,
        };
      }
      // 删除未支付订单时间
      else if (type == 'delivery_area') {
        this.value = this.detail.setting.delivery_area;
        this.popupData = {
          title: '删除未支付订单限时',
          type,
          show: true,
        };
      }
      // 自动确认收货天数
      else if (type == 'delivery_time') {
        this.value = this.detail.setting.delivery_time;
        this.popupData = {
          title: '自动确认收货时间',
          type,
          show: true,
        };
      }
      // 可申请售后时间
      else if (type == 'after_sale_time') {
        this.value = this.detail.setting.after_sale_time;
        this.popupData = {
          title: '可申请售后时间',
          type,
          show: true,
        };
      } else if (type == 'integral') {
        this.value = this.detail.setting.integral;
        this.popupData = {
          title: '积分抵扣',
          type,
          show: true,
        };
      } else if (type == 'integration') {
        this.value = this.detail.setting.integration;
        this.popupData = {
          title: '积分使用规则',
          type,
          show: true,
        };
      } else if (type == 'address') {
        this.popupData = {
          title: '修改收货地址',
          type: 'address',
          show: true,
        };
      } else if (type == 'send_type') {
        this.value = Number(this.detail.setting.send_type);
        this.popupData = {
          title: '发货方式',
          type,
          show: true,
        };
      } else if (type == 'payment_type') {
        this.value = JSON.parse(JSON.stringify(this.detail.payment_type));
        this.popupData = {
          title: '支付方式',
          type,
          show: true,
        };
      }
    },
    // 弹框提交
    async popupConfirm() {
      if (this.popupData.type == 'address') {
        let address = JSON.parse(JSON.stringify(this.detail.address));
        var res = await this.$requestAll.admin.address(address, true);
      } else {
        let setting = JSON.parse(JSON.stringify(this.detail.setting));

        if (this.popupData.type == 'name') {
          setting.name = this.value;
        } else if (this.popupData.type == 'delivery_area') {
          setting.delivery_area = this.value;
        } else if (this.popupData.type == 'delivery_time') {
          setting.delivery_time = this.value;
        } else if (this.popupData.type == 'after_sale_time') {
          setting.after_sale_time = this.value;
        } else if (this.popupData.type == 'integral') {
          setting.integral = this.value;
        } else if (this.popupData.type == 'integration') {
          setting.integration = this.value;
        } else if (this.popupData.type == 'send_type') {
          setting.send_type = String(this.value);
        } else if (this.popupData.type == 'payment_type') {
          setting.payment_type = this.value;
        }
        console.log(setting.send_type);
        var res = await this.$requestAll.admin.setting(
          { setting: JSON.stringify(setting) },
          true
        );
        this.detail.setting = setting;
        this.popupData.type == 'payment_type' &&
          (this.detail.payment_type = this.value);
      }
      uni.$u.toast(res.msg);
      this.popupData.show = false;
    },
  },
  computed: {
    payText() {
      if (this.detail) {
        let payment_type = this.detail.payment_type;
        let text = '';
        let i = 0;
        for (let key in payment_type) {
          if (payment_type[key]) {
            i++;
          }
        }
        for (let key in payment_type) {
          if (payment_type[key]) {
            if (key == 'alipay') {
              text = text + '支付宝支付';
            } else if (key == 'balance') {
              text = text + '余额支付';
            } else if (key == 'huodao') {
              text = text + '货到付款';
            } else if (key == 'wechat') {
              text = text + '在线支付';
            }
            i--;
            text += i > 0 ? '/' : '';
          }
        }
        return text;
      }
    },
    SHOP_CONFIG() {
      return this.$store.getters['SHOP_CONFIG'];
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
  /* #ifdef H5 */
  min-height: calc(100vh - 44px);
  /* #endif */
  padding: 100rpx 20rpx 0;
}

.border-b {
  border-bottom: 1px solid #e5e5e5;
}
.heade {
  background: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  font-size: 36rpx;

  > image {
    position: relative;
    transform: translate(-50%, 0);
    left: 50%;
    margin: -90rpx auto 20rpx;

    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
  }
}

.menu-item {
  background: #fff;
  padding: 0 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;

  display: flex;
  align-items: center;
  > image {
    width: 50rpx;
    height: 50rpx;
  }
  > view {
    min-height: 100rpx;
  }
}

.popup-box {
  background: #fff;
  border-radius: 20rpx;
  width: 80vw;
  padding: 20rpx 20rpx 0;

  .popup-content {
    /deep/.u-input {
      background: #f5f5f5;
    }
  }

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
</style>
