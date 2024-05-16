<template>
  <view class="body flex-col">
    <view class="bg-fff">
      <view>
        <u-tabs
          :current="status"
          :list="list1"
          :activeStyle="{
            color: 'red',
          }"
          :scrollable="false"
          lineColor="red"
          @change="clickTab"
        ></u-tabs>
      </view>
      <view class="btns">
        <div @click="clickOther(0)" class="btn active">一件接龙</div>
        <div
          v-if="status == 2"
          @click="clickOther(1)"
          class="btn"
          :class="active == 1 && 'active'"
        >
          {{ is_hexiao ? '确定核销' : '批量核销' }}
        </div>
        <div
          v-if="status == 2"
          @click="clickOther(3)"
          class="btn"
          :class="active == 1 && 'active'"
        >
          取货通知
        </div>
        <div @click="clickOther(2)" class="btn">搜索</div>
      </view>
    </view>

    <scroll-view
      @scrolltolower="scrolltolower"
      scroll-y
      class="content flex-h-1"
    >
      <view class="scroll-box" v-if="list.length">
        <div class="conent-box">
          <div v-for="(order, i) in list" :key="i" class="order-item">
            <view class="flex-x-sb flex-y-center m-b-10">
              <view class="font-32">{{ order.mch.name }}</view>
              <view class="price-color">
                {{
                  order.pay_type == 1
                    ? '线上支付'
                    : order.pay_type == 2
                    ? '货到付款'
                    : '余额支付'
                }}
              </view>
            </view>

            <view class="flex-x-sb border-b color-999 font-26">
              <text class="flex-w-1 u-line-1 price-color"
                >订单号：{{ order.order_no }}</text
              >
              <text>{{ order.addtime }}</text>
            </view>

            <view class="border-b p-b-20">
              <GoodsList
                :goodsList="order.goods_list ? order.goods_list : [order]"
              ></GoodsList>
            </view>

            <view class="total-box">
              <view class="flex-x-sb flex-y-center">
                <view
                  >合计佣金：<text class="price-color"
                    >￥{{ order.tuan_price }}</text
                  ></view
                >
                <view class="m-l-10">
                  共计商品{{ order.goods_list.length }}件 合计：￥{{
                    order.total_price
                  }}
                </view>
              </view>
              <view class="m-t-20">
                配送方式：{{
                  order.is_dada > 0
                    ? '同城配送'
                    : order.is_offline == 1
                    ? '到店自提'
                    : '快递配送'
                }}
              </view>
              <view class="m-t-20">
                <text>{{ order.name }}</text>
                <text class="m-l-10 color-999" @click.stop="onPhoneCall(order.mobile)">{{ order.mobile }}</text>
              </view>
              <!-- <view @click.stop class="m-t-10 flex-x-sb">
                <text>合计：￥{{ order.total_price }}</text>
                <view
                  v-if="order.is_pay == 1 && order.is_send == 0"
                  class="order-option-btn"
                  @click="showSendModal(order)"
                >
                  发货
                </view>
              </view> -->
              <view v-if="order.content" @click.stop class="m-t-10 u-line-2">
                <text>备注：{{ order.content }}</text>
              </view>

              <view
                v-if="is_hexiao && status == 2"
                @click.stop="onCheck(order, i)"
                class="m-t-10 flex-y-center flex-x-sb"
              >
                <text
                  >核销码：<text style="color: red">{{
                    order.take_code || '暂无'
                  }}</text></text
                >
                <text>
                  <text
                    v-if="!order.check"
                    class="font-50 iconfont icon-xuanzekuangmoren"
                  ></text>
                  <text
                    v-else
                    class="font-50 iconfont icon-success-fill"
                    style="color: #40bb0a"
                  ></text>
                </text>
              </view>
            </view>
          </div>
          <u-loadmore :status="more"></u-loadmore>
        </div>
      </view>
      <view class="scroll-box" v-else>
        <u-empty mode="data" :icon="wxapp_img.empty_data"> </u-empty>
      </view>
      <u-popup
        :show="showSearch"
        @close="showSearch = false"
        mode="center"
        round="10px"
        :safeAreaInsetBottom="false"
      >
        <div class="popup-box">
          <view class="p-30">
            <u-input
              @confirm="searchConfirm"
              v-model="key"
              placeholder="请输入收货人手机号"
            ></u-input>
          </view>
          <view class="popup-btn flex-y-center">
            <view class="flex-w-1" @click="showSearch = false">取消</view>
            <view class="flex-w-1" @click="searchConfirm">确定</view>
          </view>
        </div>
      </u-popup>
    </scroll-view>
  </view>
</template>
<script>
import GoodsList from '@/pages/order/components/GoodsList';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      list1: [
        {
          name: '全部',
        },
        {
          name: '待发货',
        },
        {
          name: '待自提',
        },
        {
          name: '已完成',
        },
      ],
      active: 0,
      pageData: '',
      showSearch: false,
      key: '',
      status: 0,
      list: [],
      page: 1,
      more: 'loadmore',
      is_hexiao: false,
    };
  },
  onLoad(params) {
    console.log(params);
    this.status = parseInt(
      params.status > 1 ? params.status - 1 : params.status
    );
    this.loadData();
  },
  methods: {
    async loadData() {
      if (this.more == 'nomore') return;
      const res = await this.$requestAll.commander.getOrderTeam(
        {
          status: this.status > 1 ? this.status + 1 : this.status,
          page: this.page,
          key: this.key,
        },
        true
      );
      // !this.payTypeList.length && (this.payTypeList = res.data.pay_type_list);
      this.list.push(...res.data.list);
      this.more =
        this.list.length >= res.data.row_count ? 'nomore' : 'loadmore';
      this.page++;
    },
    clickTab({ index }) {
      this.key = '';
      this.status = index;

      this.resetPageData();
      this.loadData();
    },
    scrolltolower() {
      this.page++;
      this.loadData();
    },
    resetPageData() {
      this.list = this.$options.data().list;
      this.page = this.$options.data().page;
      this.more = this.$options.data().more;
    },
    async clickOther(type) {
      if (!this.list.length) return uni.$u.toast('订单为空');

      switch (type) {
        case 0:
          console.log('接龙');
          var obf_data = {
            i_1: '1️⃣',
            i_2: '2️⃣',
            i_3: '3️⃣',
            i_4: '4️⃣',
            i_5: '5️⃣',
            i_6: '6️⃣',
            i_7: '7️⃣',
            i_8: '8️⃣',
            i_9: '9️⃣',
            i_0: '0️⃣',
          };

          var text = '🌹 今日团品订单 🌹\n';
          this.list.forEach((item, i) => {
            var iText = '';
            if (i > 9) {
              String(i)
                .split()
                .forEach(item => {
                  iText += obf_data['i_' + item];
                });
            } else {
              iText = obf_data['i_' + i];
            }
            text += iText + item.user_name + '\n';
            item.goods_list.forEach(goods => {
              text += goods.goods_name + ' * ' + goods.num + '\n';
            });
          });
          this.$utils.copy(text, '复制成功');
          break;
        case 1:
          console.log('批量核销');
          if (this.is_hexiao) {
            let checkList = this.list.filter(item => item.check);
            if (!checkList.length) return (this.is_hexiao = false);
            let idList = checkList.map(item => item.order_id);
            let idArr = {};
            for (let key in idList) {
              idArr[key] = idList[key];
            }
            await this.$requestAll.order.orderClerk({
              order_id_arr: idArr,
            });
            uni.showModal({
              title: '提示',
              content: '核销成功',
              showCancel: true,
              success: ({ confirm, cancel }) => {
                this.is_hexiao = false;
                this.clickTab({ index: 2 });
              },
            });
          } else {
            this.is_hexiao = true;
          }
          break;
        case 2:
          console.log('搜索');
          this.showSearch = !this.showSearch;
          break;
        case 3:
          console.log('取货通知');
          await this.$requestAll.commander.shopOrderTpl({
            order: JSON.stringify(this.list.map(item => item.order_id)),
          });
          this.$utils.showModalAsync({
            content: '发送成功',
            showCancel: false,
          });
          break;
      }
    },
    searchConfirm() {
      this.resetPageData();
      this.loadData();
      this.showSearch = !this.showSearch;
    },
    onCheck(item, i) {
      console.log(item);
      item.check = !item.check;
      this.$set(this.list, i, item);
    },
    onPhoneCall(mobile) {
      uni.makePhoneCall({
        phoneNumber: mobile,
      });
    },
  },
  onShow() {},
  computed: {},
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  height: 100vh;
  /* #ifdef H5 */
  height: calc(100vh - 44px);
  /* #endif */
}
.btns {
  display: flex;
  padding: 10rpx 24rpx;
  .btn {
    border: none;
    background: #f5f6f7;
    border-radius: 6rpx;
    height: 56rpx;
    line-height: 56rpx;
    padding: 0 25rpx;
    color: #666;
    font-size: 24rpx;
    margin-right: 12rpx;
    &:nth-last-child(1) {
      margin-right: 0;
    }
  }
  .active {
    background-color: #ffe3e1;
    color: #ff4a40;
  }
}

.conent-box {
  padding-bottom: env(safe-area-inset-bottom);
  .order-item {
    margin: 20rpx 20rpx 0;
    padding: 20rpx;
    background: #fff;
    border-radius: 20rpx;
    .order-option-btn {
      line-height: 1.8;
      width: 100rpx;
      text-align: center;
      border-radius: 10rpx;
      border: 1px solid #999;
      margin-left: 20rpx;
    }
  }
}

.popup-box {
  width: 80vw;
  .popup-btn {
    text-align: center;
    padding: 20rpx 0;
    border-top: 1px solid #eee;
    font-size: 32rpx;
    > view:nth-child(2) {
      color: seagreen;
      line-height: 50rpx;
      border-left: 1px solid #eee;
    }
  }
}
</style>
