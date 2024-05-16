<template>
  <view v-if="pageData && !store.is_shenhe" class="body">
    <view class="bg-fff p-20 m-b-20 round">
      <view style="line-height: 70rpx; color: #666">
        当前可提现金额为：{{ price || 0 }}元
      </view>
      <view
        @click="orderShow = !orderShow"
        v-if="pageType == 'mch' && pageData.is_select_order == 1"
      >
        <view class="flex-y-center p-b-20 color-666">
          <text class="flex-w-1">选择提现订单</text>
          <text class="iconfont icon-arrow-right"></text>
        </view>

        <template v-for="(order, i) in pageData.share_log">
          <view class="p-b-20 flex-y-center" v-if="order.check" :key="i">
            <text class="flex-w-1 u-line-1 m-r-20"> {{ order.desc }}</text>
            <text class="price-color">￥{{ order.price }}</text>
          </view>
        </template>

        <view>
          提现金额
          <text class="price-color m-x-10">{{ cashPrice }}</text>
          元
        </view>
      </view>

      <view v-else class="flex-y-center">
        <text class="font-w-600 font-50">￥</text>
        <view class="flex-w-1">
          <u-input
            v-model="priceValue"
            border="none"
            placeholder="请输入提现金额"
            placeholderStyle="font-size:30rpx;font-weight:400;"
            fontSize="50rpx"
          ></u-input>
        </view>

        <text
          @click="priceValue = price"
          style="font-size: 26rpx; padding: 0 20rpx; color: #ff4a40"
          >全部提现</text
        >
      </view>
    </view>

    <view class="bg-fff m-b-20 round">
      <template v-for="(item, index) in payList">
        <view
          @click="clickPay(index)"
          :key="index"
          v-if="item.is_show"
          class="pay-item flex-y-center flex-x-sb p-20 p-y-20"
        >
          <view class="flex-y-center">
            <image
              :src="item.icon"
              style="width: 50rpx; height: 50rpx"
              class="m-r-10"
              mode=""
            />
            <view>{{ item.name }}</view>
          </view>
          <view>
            <text
              v-if="selectPay == index"
              class="iconfont icon-success price-color"
            ></text>
          </view>
        </view>
      </template>
    </view>

    <view v-if="payList[selectPay]" class="bg-fff m-b-20">
      <view v-if="payList[selectPay].key == 'wechat'">
        <u-form
          ref="uForm"
          :model="form"
          :rules="rules"
          labelWidth="initial"
          errorType="toast"
        >
          <view class="form-item-box">
            <u-form-item prop="name" required label="姓名">
              <u-input
                v-model="form.name"
                border="none"
                placeholder="请输入正确的微信姓名"
              ></u-input>
            </u-form-item>
          </view>
          <view class="form-item-box">
            <u-form-item prop="mobile" required label="账号">
              <u-input
                v-model="form.mobile"
                border="none"
                placeholder="请输入正确的微信账号"
              ></u-input>
            </u-form-item>
          </view>
        </u-form>
      </view>

      <view v-else-if="payList[selectPay].key == 'alipay'">
        <u-form
          ref="uForm"
          :model="form"
          :rules="rules"
          labelWidth="initial"
          errorType="toast"
        >
          <view class="form-item-box">
            <u-form-item prop="name" required label="姓名">
              <u-input
                v-model="form.name"
                border="none"
                placeholder="请输入正确的支付宝姓名"
              ></u-input>
            </u-form-item>
          </view>
          <view class="form-item-box">
            <u-form-item prop="mobile" required label="账号">
              <u-input
                v-model="form.mobile"
                border="none"
                placeholder="请输入正确的支付宝账号"
              ></u-input>
            </u-form-item>
          </view>
        </u-form>
      </view>

      <view v-else-if="payList[selectPay].key == 'bank'">
        <u-form
          ref="uForm"
          :model="form"
          :rules="rules"
          labelWidth="initial"
          errorType="toast"
        >
          <view class="form-item-box">
            <u-form-item prop="name" required label="开户人">
              <u-input
                v-model="form.name"
                border="none"
                placeholder="请输入正确的姓名"
              ></u-input>
            </u-form-item>
          </view>
          <view class="form-item-box">
            <u-form-item prop="bank_name" required label="开户行">
              <u-input
                v-model="form.bank_name"
                border="none"
                placeholder="请输入正确的银行名称"
              ></u-input>
            </u-form-item>
          </view>
          <view class="form-item-box">
            <u-form-item prop="mobile" required label="开户账号">
              <u-input
                v-model="form.mobile"
                border="none"
                placeholder="请输入正确的银行卡账号"
              ></u-input>
            </u-form-item>
          </view>
        </u-form>
      </view>
    </view>

    <view v-if="pageData.cash_max_day" class="msg-box">
      <view>
        今日剩余提现金额
        <text class="price-color">￥{{ pageData.cash_max_day }}</text>
        ，不能小于{{ pageData.min_money || "1" }}元
      </view>
      <view
        v-if="(!pageType || pageType == 'shop') && pageData.service_content"
      >
        {{ pageData.service_content }}
      </view>
      <view> 今日剩余提现金额=平台每日可提现金额-今日所有用户提现金额 </view>
    </view>

    <view class="bt" @click="submit"> 提交申请 </view>

    <u-popup :show="orderShow" round="30rpx" @close="orderShow = false">
      <div class="popup-box">
        <div class="font-center font-600-40 p-20">请选择订单</div>
        <scroll-view scroll-y style="height: 40vh" class="order-list">
          <div
            class="order-item flex-y-center"
            @click="switchOrder(order, i)"
            v-for="(order, i) in pageData.share_log"
            :key="i"
          >
            <div class="flex-y-center">
              <text
                v-if="order.check"
                class="iconfont icon-success-fill price-color font-40"
              ></text>
              <text
                v-else
                class="iconfont icon-xuanzekuangmoren font-40"
              ></text>
            </div>
            <div class="flex-w-1 u-line-2 m-x-20">
              {{ order.desc }}
            </div>
            <div>
              金额：<text class="price-color">{{ order.price }}</text>
            </div>
          </div>
        </scroll-view>
      </div>
    </u-popup>

    <WxOpenSubscribe :template="templateIds"></WxOpenSubscribe>
  </view>
  <q-shenhe v-else></q-shenhe>
</template>
<script>
import WxOpenSubscribe from "@/components/wx-open-subscribe";
export default {
  components: {
    WxOpenSubscribe,
  },
  data() {
    return {
      pageType: "", //默认分销中心提现，mch入驻商提现，live主播提现  tuanzhang团长提现
      price: "", //可提现金额
      orderShow: false, //订单列表开关
      pageData: "",
      priceValue: "", //用户输入提现信息
      selectPay: -1, //当前选择提现索引
      form: {
        name: "", //姓名
        mobile: "", //卡号
        bank_name: "", // 开户行
      },
      rules: {
        name: [
          {
            required: true,
            message: "请正确输入姓名",
            trigger: ["blur", "change"],
          },
        ],
        mobile: [
          {
            required: true,
            message: "请正确输入账号",
            trigger: ["blur", "change"],
          },
        ],
        bank_name: [
          {
            required: true,
            message: "请正确输入开户行",
            trigger: ["blur", "change"],
          },
        ],
      },
      payList: [],
      share_setting: {},
    };
  },
  onLoad(param) {
    if (param.type) {
      this.pageType = param.type;
      this.anchor_id = param.anchor_id;
    }
  },
  methods: {
    async loadData() {
      if (this.pageType == "region") {
        const res = await this.$requestAll.agentApproval.getPrice({}, true);
        this.price = res.data.price.price;
        this.pageData = res.data;
        this.setPayList = res.data.pay_type_list;
        console.log('region', res.data.pay_type_list);

        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
        return;
      }

      if (this.pageType == "live") {
        const res = await this.$requestAll.lives.getCashInfo({}, true);
        this.price = res.data.live_price;
        this.pageData = res.data;
        this.setPayList = res.data.cash_method.map((item) => {
          item.is_show = true;
          return item;
        });
      }
      // 入驻商提现数据
      else if (this.pageType == "mch") {
        const res = await this.$requestAll.mch.cashPreview({}, true);
        this.price = res.data.money;
        this.pageData = res.data;
        this.setPayList = res.data.type_list.map((item) => {
          item.is_show = true;
          return item;
        });
      }
      // 红包不贴// 额外收入
      else if (this.pageType == "subsidy") {
        console.log("红包不贴// 额外收入");
        const res = await this.$requestAll.subsidy.getPrice(
          {
            cash_out_type: 0,
          },
          true
        );
        this.price = res.data.price;
        this.pageData = res.data;
        this.setPayList = res.data.pay_type_list;
        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
      }

      // 股东分红
      else if (this.pageType == "shareholder") {
        console.log("红包不贴// 额外收入");
        const res = await this.$requestAll.subsidy.getPrice(
          {
            cash_out_type: 6,
          },
          true
        );
        this.price = res.data.price;
        this.pageData = res.data;
        this.setPayList = res.data.pay_type_list;
        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
      }
      // 配送提现
      else if (this.pageType == "peisong") {
        const res = await this.$requestAll.waimai.getPrice(
          {
            cash_out_type: 0,
          },
          true
        );
        this.price = res.data.price;
        this.pageData = res.data;
        this.setPayList = res.data.pay_type_list;
        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
      }
      // 团长提现
      else if (this.pageType == "tuanzhang") {
        console.log("tuanzhang");
        const res = await this.$requestAll.commander.getPrice({}, true);
        this.price = res.data.price;
        this.pageData = res.data;
        this.setPayList = res.data.pay_type_list;
        // 设置表单默认信息
        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
      } else if (this.pageType == "shop") {
        const res = await this.$requestAll.recommend.getPrice({}, true);
        this.price = res.data.price.price;
        this.pageData = res.data;
        this.setPayList = res.data.pay_type_list;
        // 设置表单默认信息
        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
      } else {
        const res = await this.$requestAll.share.getPrice({}, true);
        let share_setting = this.$store.getters["SHOP_CONFIG"].share_setting;
        this.share_setting = share_setting;
        this.price = res.data.price.price;
        this.pageData = res.data;

        this.pageData.min_money = share_setting.min_money;
        this.setPayList = res.data.pay_type_list;
        // 设置表单默认信息
        if (res.data.cash_last) {
          this.form.name = res.data.cash_last.name;
          this.form.mobile = res.data.cash_last.mobile;
          this.form.bank_name = res.data.cash_last.bank_name;
          this.selectPay = this.payList[res.data.cash_last.type].is_show
            ? res.data.cash_last.type
            : -1;
        }
      }
    },
    clickPay(index) {
      this.form = this.$options.data().form;
      this.selectPay = index;
    },
    // 切换选中订单
    switchOrder(order, i) {
      console.log(order, i);
      order.check = !order.check;

      this.$set(this.pageData.share_log, i, order);
    },
    async submit() {
      // 是否选择提现方式
      if (this.selectPay === -1) return uni.$u.toast("请选择提现方式！");
      var pageData = this.pageData,
        priceValue = this.priceValue;

      if (this.pageData.is_select_order != 1) {
        if (!uni.$u.test.amount(priceValue))
          return uni.$u.toast("请正确输入提现金额");

        if (priceValue > this.price - 0)
          return uni.$u.toast("当前可用提现金额不足");

        if (pageData.min_money && priceValue < pageData.min_money - 0)
          return uni.$u.toast(`提现金额不能小于${pageData.min_money || 1}元`);
      }
      // 入住商提现验证
      else {
        if (!this.pageData.share_log.filter((item) => item.check).length)
          return uni.$u.toast("请选择提现订单");
      }

      // 剩余金额判断
      if (
        typeof pageData.cash_max_day == "number" &&
        pageData.cash_max_day > -1 &&
        priceValue > pageData.cash_max_day
      )
        return uni.$u.toast(`今日剩余提现金额为${pageData.cash_max_day}元`);

      // 订阅消息
      if (this.templateIds.length)
        await this.$utils.bindMessage(this.templateIds);

      // 零钱支付不需要表单验证
      if (this.payList[this.selectPay].key == "remaining_sum") {
        var formData = {
          cash: priceValue, //提现金额
          pay_type: this.selectPay, //提现类型
          scene: "CASH",
        };
        // 分销提现
        if (!this.pageType) {
          await this.$requestAll.share.apply(formData, true);
        }
        // 店铺提现
        else if (this.pageType == "shop") {
          await this.$requestAll.recommend.apply(formData, true);
        }
        // 团长提现
        else if (this.pageType == "tuanzhang") {
          formData.is_shop = 1;
          await this.$requestAll.share.apply(formData, true);
        }

        // 配送中心提现
        else if (this.pageType == "peisong") {
          await this.$requestAll.waimai.apply(formData, true);
        }
        // 红包不贴// 额外收入提现
        else if (this.pageType == "subsidy") {
          await this.$requestAll.subsidy.apply(formData, true);
        }
        // 区域提现
        else if (this.pageType == "region") {
          await this.$requestAll.agentApproval.apply(formData, true);
        }
        // 股东分红
        else if (this.pageType == "shareholder") {
          formData.cash_out_type = 6;
          await this.$requestAll.subsidy.apply(formData, true);
        }
        // 直播提现
        else if (this.pageType == "live") {
          formData.pay_type = this.payList[this.selectPay].key;
          await this.$requestAll.lives.cashApply(formData, true);
        }

        // 入驻商提现
        else if (this.pageType == "mch") {
          formData = {
            type: this.payList[this.selectPay].id,
            scene: "CASH",
          };
          // 订单提现
          if (this.pageData.is_select_order == 1) {
            let ids = this.pageData.share_log
              .map((item) => {
                if (item.check) return item.id;
              })
              .join(",");
            ids = ids.slice(0, ids.length - 1);

            formData.cash_val = this.cashPrice;
            formData.share_id = ids;
          }
          // 金额提现
          else {
            formData.cash_val = this.priceValue;
          }
          await this.$requestAll.mch.userCash(formData, true);
        }

        this.submitSuccess();
      } else {
        this.$refs.uForm
          .validate()
          .then(async () => {
            var formData = {
              bank_name: this.form.bank_name, //开户行
              mobile: this.form.mobile, //账号
              name: this.form.name, //姓名
              cash: priceValue, //提现金额
              pay_type: this.selectPay, //提现类型
              scene: "CASH",
            };
            // 分销提现
            if (!this.pageType) {
              await this.$requestAll.share.apply(formData, true);
            }
            // 店铺提现
            else if (this.pageType == "shop") {
              await this.$requestAll.recommend.apply(formData, true);
            }
            // 团长提现
            else if (this.pageType == "tuanzhang") {
              formData.is_shop = 1;
              await this.$requestAll.share.apply(formData, true);
            }
            // 配送中心提现
            else if (this.pageType == "peisong") {
              await this.$requestAll.waimai.apply(formData, true);
            }
            // 红包不贴// 额外收入提现
            else if (this.pageType == "subsidy") {
              await this.$requestAll.subsidy.apply(formData, true);
            }
            // 区域提现
            else if (this.pageType == "region") {
              await this.$requestAll.agentApproval.apply(formData, true);
            }
            // 股东分红
            else if (this.pageType == "shareholder") {
              formData.cash_out_type = 6;
              await this.$requestAll.subsidy.apply(formData, true);
            }
            // 直播提现
            else if (this.pageType == "live") {
              formData.pay_type = this.payList[this.selectPay].key;
              await this.$requestAll.lives.cashApply(formData, true);
            }
            // 入驻商提现
            else if (this.pageType == "mch") {
              formData = {
                nickname: this.form.name,
                account: this.form.mobile,
                type: this.payList[this.selectPay].id,
                bank_name: this.form.bank_name,
                scene: "CASH",
              };
              // 订单提现
              if (this.pageData.is_select_order == 1) {
                let ids = this.pageData.share_log
                  .map((item) => {
                    if (item.check) return item.id;
                  })
                  .join(",");
                ids = ids.slice(0, ids.length - 1);

                formData.cash_val = this.cashPrice;
                formData.share_id = ids;
              }
              // 金额提现
              else {
                formData.cash_val = this.priceValue;
              }
              await this.$requestAll.mch.userCash(formData, true);
            }
            this.submitSuccess();
          })
          .catch((errors) => {
            errors[0].message && uni.$u.toast(errors[0].message);
          });
      }
    },

    submitSuccess() {
      uni.showModal({
        title: "提示",
        content: "提交成功，等待审核",
        showCancel: false,
        success: ({ confirm }) => {
          if (confirm) {
            if (!this.pageType) {
              this.$utils.toUrl("/other/cash-detail/cash-detail?is_shop=0");
            } else if (this.pageType == "mch") {
              this.$utils.toUrl("/mch/m/cash-log/cash-log");
            } else if (this.pageType == "tuanzhang") {
              this.$utils.toUrl("/other/cash-detail/cash-detail?is_shop=1");
            } else if (this.pageType == "live") {
              this.$utils.toUrl("/other/cash-detail/cash-detail?type=live");
            } else if( this.pageType == 'shop') {
              this.$utils.backTo(1)
            }
            
             this.loadData();
          }
        },
      });
    },
  },
  onShow() {
    this.loadData();
  },
  computed: {
    cashPrice() {
      if (!this.pageData.share_log || !this.pageData.share_log.length) return 0;
      let price = 0;
      this.pageData.share_log.forEach((order) => {
        if (order.check) {
          price += order.price - 0;
        }
      });
      return price.toFixed(2);
    },
    setPayList: {
      get() {
        if (this.wxapp_img) {
          this.payList = [
            {
              key: "wechat",
              name: "微信",
              icon: this.wxapp_img.icon_share_wechat,
            },
            {
              key: "alipay",
              name: "支付宝",
              icon: this.wxapp_img.icon_share_ant,
            },
            {
              key: "bank",
              name: "银行卡",
              icon: this.wxapp_img.icon_share_bank,
            },
            {
              key: "remaining_sum",
              name: "微信零钱",
              icon: this.wxapp_img.gold,
            },
          ];
        }
      },
      set(value) {
        this.payList = value;
      },
    },
    templateIds() {
      if (!this.pageData) return;
      let ids = [];
      this.pageData.cash_fail_tpl && ids.push(this.pageData.cash_fail_tpl);
      this.pageData.cash_success_tpl &&
        ids.push(this.pageData.cash_success_tpl);
      return ids;
    },
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;

  /deep/.u-form {
    background: #f5f5f5;

    .form-item-box {
      background: #fff;
      padding: 0 30rpx;
      border-radius: 20rpx;
      margin-bottom: 20rpx;
    }

    .u-form-item__body {
      padding: 10rpx 0;
    }
  }
}

.round {
  border-radius: 20rpx;
}

.pay-item {
  border-bottom: 2rpx solid #eee;
}

.msg-box {
  color: #999;
  font-size: 24rpx;

  > view {
    line-height: 40rpx;
  }
}

.bt {
  margin-top: 50rpx;
  background-color: #ff4a40;
  border-radius: 16rpx;
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  text-align: center;
  color: #fff;
  font-size: 32rpx;
  font-weight: bold;
}

.popup-box {
  .order-item {
    padding: 20rpx;
    border-bottom: 1px solid #ccc;
  }
}
</style>
