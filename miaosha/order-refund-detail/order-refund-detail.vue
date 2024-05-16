<template>
  <view v-if="pageData" class="body">
    <div class="status-bar">
      <image
        :src="wxapp_img.order_refund_status_bg"
        mode="aspectFill"
      />
      <div class="status-text">
        <!-- 退货 -->
        <template v-if="pageData.refund_type == 1">
          <template v-if="pageData.refund_status == 0">
            <template v-if="pageData.is_agree == 0">等待审核中</template>
            <template v-else>
              <template v-if="pageData.is_user_send == 0"
                >已同意退货，请及时发货</template
              >
              <template v-else>已发货，待平台确认</template>
            </template>
          </template>
          <template v-if="pageData.refund_status == 1"
            >已同意退货并已退款</template
          >
          <template v-if="pageData.refund_status == 3">已拒绝退货</template>
        </template>
        <!-- 换货 -->
        <template v-else>
          <template v-if="pageData.refund_status == 0">等待审核中</template>
          <template v-if="pageData.refund_status == 2">已同意换货</template>
          <template v-if="pageData.refund_status == 3">已拒绝换货</template>
        </template>
      </div>
    </div>

    <!-- 卖家同意退货，需邮寄信息 -->
    <div
      v-if="
        (pageData.refund_type == 1 &&
          pageData.refund_status == 0 &&
          pageData.is_agree != 0) ||
        pageData.refund_status == 2
      "
      class="recipient-info m-t-20"
    >
      <div class="color-999">收件人信息</div>
      <div class="flex-x-sb flex-y-center">
        <div class="left flex-w-1">
          <div class="flex-x-sb">
            <text>{{ pageData.re_name }}</text>
            <text>{{ pageData.re_mobile }}</text>
          </div>
          <div class="u-line-1">{{ pageData.re_address }}</div>
        </div>
        <div
          @click="
            $utils.copy(
              pageData.re_name +
                '\n' +
                pageData.re_mobile +
                '\n' +
                pageData.re_address
            )
          "
          class="right"
        >
          <div>一件</div>
          <div>复制</div>
        </div>
      </div>

      <view class="m-y-10">
        <u-line color="#999"></u-line>
      </view>

      <view class="tip font-24 color-999">
        <view>▪ 未与卖家协商一致情况下，请勿邮寄到付或平邮</view>
        <view>▪ 请填写真实有效物流信息</view>
      </view>
    </div>

    <!-- 选择快递公司 start -->
    <template v-if="pageData.is_agree == 1">
      <div class="express-block m-t-20" v-if="pageData.is_user_send == 0">
        <div class="express-con con1">
          <div class="tit">快递公司：</div>
          <div
            id="trigger1"
            class="flex-x-sb flex-y-center"
            @click="show_picker = true"
          >
            <text>
              <template v-if="express_index != -1">{{
                pageData.express_list[express_index].name
              }}</template>
              <template v-else>请选择快递公司</template>
            </text>
            <text class="iconfont icon-arrow-right"></text>
          </div>
        </div>
        <div class="express-con con2">
          <div class="tit">快递单号：</div>
          <input placeholder="请填写快递单号" v-model.trim="express_no" />
        </div>
      </div>
      <div class="express-block" v-else>
        <div class="express-con con1">
          <div class="tit">快递公司：</div>
          <span>{{ pageData.user_send_express }}</span>
        </div>
        <div class="express-con con2">
          <div class="tit">快递单号：</div>
          <span>{{ pageData.user_send_express_no }}</span>
        </div>
      </div>
    </template>

    <view class="p-20 bg-fff m-t-20">
      <GoodsList :goodsList="goodsList"></GoodsList>
    </view>

    <view class="schedule-box m-t-20">
      <div class="item">
        <text>售后类型：</text>
        <text>{{ pageData.refund_type == 1 ? '退货退款' : '换货' }}</text>
      </div>
      <div class="item">
        <text>退款金额：</text>
        <text class="price-color">￥{{ pageData.refund_price }}</text>
      </div>
      <div class="item">
        <text>申请原因：</text>
        <text>{{ pageData.refund_desc }}</text>
      </div>
      <div v-if="pageData.refuse_desc" class="item">
        <text>拒绝原因：</text>
        <text class="price-color">{{ pageData.refuse_desc }}</text>
      </div>
      <div v-if="pageData.refund_pic_list.length">
        <u-album
          :urls="pageData.refund_pic_list"
          multipleSize="200rpx"
          singleSize="200rpx"
          space="20rpx"
        ></u-album>
      </div>
    </view>

    <div
      class="goods_send"
      v-if="pageData.is_agree == 1 && pageData.is_user_send == 0"
    >
      <button @click="sendFormSubmit">确认发货</button>
    </div>

    <u-picker
      :show="show_picker"
      :columns="[pageData.express_list]"
      @cancel="show_picker = false"
      @confirm="pickerConfirm"
      keyName="name"
    ></u-picker>
  </view>
</template>
<script>
import GoodsList from '@/pages/order/components/GoodsList.vue';
export default {
  components: {
    GoodsList,
  },
  data() {
    return {
      pageData: '',
      order_refund_id: '',
      show_picker: false,
      express_index: -1,
      express_no: '',
    };
  },
  onLoad(params) {
    this.order_refund_id = params.id;
    this.loadData();
  },
  onShow() {},
  methods: {
    async loadData() {
      const res = await this.$requestAll.miaosha.refundDetail(
        { order_refund_id: this.order_refund_id },
        true
      );
      this.pageData = res.data;
    },
    pickerConfirm(e) {
      console.log(e);
      this.express_index = e.indexs[0];
      this.show_picker = false;
      // console.log(this.pageData.express_list[this.express_index].name);
    },
    async sendFormSubmit() {
      console.log('tijiao');
      if (this.express_index == -1) return uni.$u.toast('请选择快递公司');
      if (!this.express_no) return uni.$u.toast('快递单号不能为空');

      const formData = {
        order_refund_id: this.order_refund_id,
        express: this.pageData.express_list[this.express_index].name,
        express_no: this.express_no,
        orderType: 'STORE',
      };
      await this.$requestAll.order.refundSend(formData, true);
      uni.showModal({
        title: '提示',
        content: '发货成功',
        showCancel: false,
        success: res => {
          if (res.confirm) {
            this.loadData();
          }
        },
      });
    },
  },
  computed: {
    goodsList() {
      const goods = this.pageData;
      return [
        {
          goods_pic: goods.goods_pic,
          goods_name: goods.name,
          attr_list: goods.attr,
          num: goods.num,
          price: false,
        },
      ];
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
  .status-bar {
    position: relative;
    > image {
      display: block;
      width: 100%;
      height: 140rpx;
    }
    .status-text {
      position: absolute;
      left: 0;
      top: 0;
      line-height: 140rpx;
      color: #fff;
      font-size: 30rpx;
      padding-left: 30rpx;
    }
  }
}

.recipient-info {
  padding: 20rpx;
  background: #fff;
  .left {
    line-height: 1.7;
  }
  .right {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    border: 1px solid #999;

    text-align: center;
    line-height: 1.2;
    font-size: 26rpx;
    color: #666;
    margin-left: 20rpx;
  }
}

.schedule-box {
  padding: 20rpx;
  background: #fff;
  .item {
    min-height: 60rpx;
    display: flex;
    align-items: center;
    > text:nth-child(2) {
      flex: 1;
      width: 0;
    }
  }
}

.express-block {
  background-color: #fff;
  padding: 0 10 * 2rpx;
  margin-bottom: 10 * 2rpx;
  border-bottom: 1 * 2rpx solid #eee;
  .express-con {
    padding: 12 * 2rpx 0;
    height: 20 * 2rpx;
    line-height: 20 * 2rpx;
    box-sizing: content-box;
    position: relative;
  }
  .express-con.con1 {
    border-bottom: 1 * 2rpx solid #eee;
    padding: 12 * 2rpx 12 * 2rpx 12 * 2rpx 80 * 2rpx;
  }
  .express-con.con2 {
    padding: 12 * 2rpx 0 12 * 2rpx 80 * 2rpx;
  }
  .express-con .tit {
    position: absolute;
    top: 12 * 2rpx;
    left: 0;
    line-height: 20 * 2rpx;
    height: 20 * 2rpx;
  }
  .express-con.con1 img {
    width: 5 * 2rpx;
    height: 9 * 2rpx;
    position: absolute;
    right: 0;
    top: 18 * 2rpx;
  }
  .express-con.con2 input {
    width: 100%;
    line-height: 20 * 2rpx;
    height: 20 * 2rpx;
  }
}

.goods_send {
  padding: 16 * 2rpx 12 * 2rpx;
  button {
    height: 40 * 2rpx;
    line-height: 40 * 2rpx;
    width: 100%;
    border: none;
    outline: none;
    background-color: #ff4544;
    color: #fff;
    border-radius: 5 * 2rpx;
  }
}
</style>
