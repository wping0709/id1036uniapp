<template>
  <view class="body">
    <div class="head">
      <image class="head-bg" :src="wxapp_img.admin.bg" mode="aspectFill" />

      <div class="head-content">
        <div class="content-top flex-y-center flex-x-sb">
          <view class="flex-y-center">
            <image
              :src="userInfo.avatar_url"
              class="user-img"
              mode="aspectFill"
            />
            <text>{{ userInfo.nick_name }}</text>
          </view>
          <view class="flex-y-center">
            <!-- <view
              @click="
                $utils.toUrl(
                  '/kefu/kefu?mch_id=0&mobile=' +
                    SHOP_CONFIG.store.kefu_setting.mobile
                )
              "
              class="flex-col flex-x-center flex-y-center"
            >
              <text class="iconfont icon-service font-60"></text>
              <text>客服</text>
            </view> -->
            <view
              @click="$utils.toUrl('/pages/income-code/income-code')"
              class="m-l-20 flex-col flex-x-center flex-y-center"
            >
              <text class="iconfont icon-QRcode font-60"></text>
              <text>收款码</text>
            </view>
          </view>
        </div>

        <div class="head-menus">
          <view
            @click="
              $utils.toUrl(
                '/app_admin/review-message/review-message?mch=0&share=0'
              )
            "
          >
            <image :src="wxapp_img.admin.msg" mode="aspectFill" />
            <view class="text">审核内容</view>
            <div v-if="new_msg_num.review_num > 0" class="num">
              {{ $utils.numFilter(new_msg_num.review_num) }}
            </div>
          </view>
          <view @click="$utils.toUrl('/app_admin/cash/cash?mch=0&share=0')">
            <image :src="wxapp_img.admin.cash" mode="aspectFill" />
            <view class="text">提现申请</view>
            <div v-if="new_msg_num.cash_num > 0" class="num">
              {{ $utils.numFilter(new_msg_num.cash_num) }}
            </div>
          </view>
          <view @click="$utils.toUrl('/app_admin/comment/comment')">
            <image :src="wxapp_img.admin.comment" mode="aspectFill" />
            <view class="text">评论管理</view>
          </view>
          <view @click="$utils.toUrl('/app_admin/user/user?share=0')">
            <image :src="wxapp_img.admin.user" mode="aspectFill" />
            <view class="text">用户管理</view>
          </view>
          <view @click="$utils.toUrl('/app_admin/goods-cat/goods-cat')">
            <image :src="wxapp_img.admin.cat" mode="aspectFill" />
            <view class="text">商品分类</view>
          </view>
          <view @click="$utils.toUrl('/app_admin/review-share/review-share')">
            <image :src="wxapp_img.admin.msg" mode="aspectFill" />
            <view class="text">审核分销商</view>
            <div v-if="new_msg_num.share_num > 0" class="num">
              {{ $utils.numFilter(new_msg_num.share_num) }}
            </div>
          </view>
        </div>
      </div>
    </div>

    <div class="tongji">
      <div @click="showPicker = true" class="flex-y-center font-30 m-b-20">
        <text>{{ choose_list[payCheckIndexs].name }}</text>
        <text class="iconfont icon-arrow-bottom"></text>
      </div>

      <u-picker
        :show="showPicker"
        @cancel="showPicker = false"
        @confirm="pickerConfirm"
        :columns="[choose_list]"
        keyName="name"
      ></u-picker>

      <div class="choose flex-y-center m-b-20">
        <div
          v-for="(item, index) in dateEnum"
          :key="item.id"
          @click="switchTab('echartsIndex', item.id)"
          :class="echartsIndex == item.id && 'check'"
          class="tab"
        >
          {{ item.name }}
        </div>
      </div>

      <div style="height: 400rpx">
        <qiun-data-charts
          ref="charts"
          type="line"
          :opts="opts"
          :chartData="chartData"
        />
      </div>
    </div>

    <div class="tongji">
      <div class="title font-30 m-b-20">销售统计</div>

      <div class="choose flex-y-center m-b-20">
        <div
          @click="switchTab('xiaoshouIndex', 0)"
          :class="xiaoshouIndex == 0 && 'check'"
          class="tab"
        >
          汇总
        </div>
        <div
          @click="switchTab('xiaoshouIndex', 1)"
          :class="xiaoshouIndex == 1 && 'check'"
          class="tab"
        >
          今日
        </div>
        <div
          @click="switchTab('xiaoshouIndex', 2)"
          :class="xiaoshouIndex == 2 && 'check'"
          class="tab"
        >
          昨日
        </div>
        <div
          @click="switchTab('xiaoshouIndex', 3)"
          :class="xiaoshouIndex == 3 && 'check'"
          class="tab"
        >
          7日
        </div>
        <div
          @click="switchTab('xiaoshouIndex', 4)"
          :class="xiaoshouIndex == 4 && 'check'"
          class="tab"
        >
          30日
        </div>
      </div>

      <div class="flex-x-sa flex-y-center font-center m-b-20">
        <div class="order-num">
          <view class="font-600-32">{{ all_data.pay_num }}</view>
          <view class="color-666">支付订单数</view>
        </div>

        <div>
          <view class="font-600-32">{{ all_data.pay_price }}</view>
          <view class="color-666">支付金额</view>
        </div>
      </div>

      <div class="flex-x-sa flex-y-center font-center font-26">
        <view
          @click="$utils.toUrl('/app_admin/order/order?status=0')"
          class="m-x-20 order-tab"
        >
          <view style="color: #ff9000; font-size: 32rpx">{{
            all_data.wait_pay_num
          }}</view>
          <view class="flex-y-center flex-x-center">
            <text>待付款</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>
        <view
          @click="$utils.toUrl('/app_admin/order/order?status=1')"
          class="m-x-20 order-tab"
        >
          <view style="color: #ff9000; font-size: 32rpx">{{
            all_data.wait_send_num
          }}</view>
          <view class="flex-y-center flex-x-center">
            <text>待发货</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>
        <view
          @click="$utils.toUrl('/app_admin/order/order?refund=1')"
          class="m-x-20 order-tab"
        >
          <view style="color: #ff9000; font-size: 32rpx">{{
            all_data.pro_order
          }}</view>
          <view class="flex-y-center flex-x-center">
            <text>维权订单</text>
            <text class="iconfont icon-arrow-right"></text>
          </view>
        </view>
      </div>
    </div>

    <TabBar></TabBar>
  </view>
</template>
<script>
import TabBar from './components/TabBar.vue';
import QiunDataCharts from './components/qiun-data-charts/index'
const dateEnum = [
  {
    id: 1,
    name: '今日',
  },
  {
    id: 2,
    name: '昨日',
  },
  {
    id: 3,
    name: '7日',
  },
  {
    id: 4,
    name: '30日',
  },
];
export default {
  components: {
    TabBar,
    QiunDataCharts
  },
  data() {
    return {
      dateEnum,
      all_data: '',
      new_msg_num: '',
      userInfo: '',
      xiaoshouIndex: 0,
      echartsIndex: 1,
      date_start: '',
      date_end: '',

      chartData: {},
      opts: {
        padding: [15, 15, 15, 15],
        dataLabel: false,
        legend: {
          show: false,
        },
        xAxis: {
          disabled: true,
        },
        yAxis: {
          gridType: 'dash',
          dashLength: 2,
        },
        extra: {
          line: {
            type: 'curve',
            width: 2,
          },
        },
      },
      showCharts: false,
      showPicker: false,
      choose_list: [
        {
          name: '支付金额',
          sign: 'total_pay_price',
        },
        {
          name: '支付订单数',
          sign: 'order_num',
        },
        {
          name: '支付人数',
          sign: 'user_num',
        },
        {
          name: '支付件数',
          sign: 'goods_num',
        },
      ],
      payCheckIndexs: 0,
    };
  },
  onReady() {},
  onLoad(params) {
    this.loadData();
    this.getUserInfo();
    this.getIndexTable();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.admin.index(
        {
          date_start: this.date_start,
          date_end: this.date_end,
          sign: '',
        },
        true
      );
      this.all_data = res.data.all_data;
      this.new_msg_num = res.data.new_msg_num;
    },
    async getUserInfo() {
      const res = await this.$requestAll.admin.userInfo({}, true);
      this.userInfo = res.data.user_info;
    },
    async getIndexTable() {
      const res = await this.$requestAll.admin.indexTable(
        {
          sign: this.choose_list[this.payCheckIndexs].sign,
          date_start: this.date_start,
          date_end: this.date_end,
        },
        true
      );

      this.chartData = {
        series: [
          {
            name: this.dateEnum.find(item => item.id == this.echartsIndex).name,
            data: res.data.list.map(item => {
              if (this.payCheckIndexs == 0) {
                return `${item.total_pay_price}`;
              } else if (this.payCheckIndexs == 1) {
                return `${item.order_num}`;
              } else if (this.payCheckIndexs == 2) {
                return `${item.user_num}`;
              } else if (this.payCheckIndexs == 3) {
                return `${item.goods_num}`;
              }
            }),
          },
        ],

        categories: res.data.list.map((item, i) => {
          return item.created_at;
          // if (this.echartsIndex == 1) {
          //   let dateText = this.$u.timeFormat(Number(new Date()), 'yyyy-mm-dd');
          //   return `${dateText} ${item.created_at}时`;
          // } else if (this.echartsIndex == 2) {
          //   let dateText = this.$u.timeFormat(
          //     Number(new Date()) - 24 * 60 * 60 * 1000,
          //     'yyyy-mm-dd'
          //   );
          //   return `${dateText} ${item.created_at}时`;
          // } else {
          //   return item.created_at;
          // }
        }),
      };
    },
    pickerConfirm(e) {
      let { indexs } = e;
      this.payCheckIndexs = indexs[0];
      this.showPicker = false;
      this.getIndexTable();
    },
    switchTab(type, i) {
      switch (i) {
        case 0:
          this.date_start = '';
          break;
        case 1:
          this.date_start = uni.$u.timeFormat(new Date(), 'yyyy-mm-dd');
          break;
        case 2:
          var cTime = Number(new Date());
          this.date_start = uni.$u.timeFormat(
            cTime - 24 * 60 * 60 * 1000,
            'yyyy-mm-dd'
          );
          this.date_end = uni.$u.timeFormat(
            cTime - 24 * 60 * 60 * 1000,
            'yyyy-mm-dd'
          );
          break;
        case 3:
          var cTime = new Date().getTime();
          this.date_start = uni.$u.timeFormat(
            cTime - 7 * 24 * 60 * 60 * 1000,
            'yyyy-mm-dd'
          );
          this.date_end = uni.$u.timeFormat(cTime, 'yyyy-mm-dd');
          break;
        case 4:
          var cTime = new Date().getTime();
          this.date_start = uni.$u.timeFormat(
            cTime - 30 * 24 * 60 * 60 * 1000,
            'yyyy-mm-dd'
          );
          this.date_end = uni.$u.timeFormat(cTime, 'yyyy-mm-dd');
          break;
        default:
          break;
      }
      this[type] = i;
      if (type == 'echartsIndex') {
        this.getIndexTable();
      } else {
        this.loadData();
      }
    },
  },
  computed: {
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
  .head {
    position: relative;
    width: 100%;
    height: 300rpx;

    .head-bg {
      width: 100%;
      height: 100%;
    }

    .head-content {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 9;

      padding: 30rpx;

      .content-top {
        color: #fff;
        font-size: 30rpx;

        .user-img {
          margin-right: 20rpx;
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }

        .font-60 {
          height: 60rpx;
          line-height: 60rpx;
          width: 60rpx;
          text-align: center;
        }
      }

      .head-menus {
        background: #fff;
        border-radius: 10rpx;
        margin-top: 15rpx;
        padding: 20rpx 0;
        display: flex;
        align-items: center;
        font-size: 26rpx;
        justify-content: space-around;

        > view {
          position: relative;
          text-align: center;

          > image {
            margin: 0 auto 4rpx;
            display: block;
            width: 80rpx;
            height: 80rpx;
          }

          .num {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(40%, -50%);
            color: #fff;
            background: #ff4544;
            font-size: 20rpx;
            padding: 0 10rpx;
            line-height: 30rpx;
            border-radius: 30rpx;
          }
        }
      }
    }
  }

  .tongji {
    margin: 30rpx;
    padding: 20rpx;
    background: #fff;
    border-radius: 10rpx;

    .choose {
      overflow: hidden;
      border-radius: 30rpx;
      height: 60rpx;
      border: 1px solid #446dfd;

      .tab {
        line-height: 60rpx;
        flex: 1;
        width: 0;
        text-align: center;
      }

      .check {
        color: #fff;
        background: #446dfd;
      }
    }

    .order-tab {
      padding: 10rpx;
      flex: 1;
      width: 0;
      box-shadow: 0 0 16rpx rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
