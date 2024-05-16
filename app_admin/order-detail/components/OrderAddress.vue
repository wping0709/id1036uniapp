<template>
  <div>
    <div class="block" @click="onCopyReceiptInfo(order)">
      <div class="block-row flex-x-sb">
        <div class="row-fl">
          {{ order.is_offline == 0 ? "联系人：" : "收货人：" }}{{ order.name }}
        </div>
        <div style="color: #446dfd" @click.stop="onPhoneCall" class="row-fr">
          {{ order.mobile }}
        </div>
      </div>
      <div v-if="order.address">收货地址：{{ order.address }}</div>
    </div>

    <div class="block" v-if="order.is_offline == 1 && order.shop">
      <div class="flex-grow-1">
        <div class="flex-grow-1">门店名称：{{ order.shop.name }}</div>
        <div class="flex-grow-1">联系电话：{{ order.shop.mobile }}</div>
        <div class="flex-grow-1">门店地址：{{ order.shop.address }}</div>
      </div>
    </div>
    <div
      class="block"
      v-if="order.is_dada > 0 && order.dada && order.dada.statusMsg"
    >
      <div class="block-row flex-x-sb">
        <div class="row-fl">达达配送：</div>
        <div
          class="row-fr"
          style="
            padding: 6rpx 10rpx;
            background-color: #d9534f;
            color: #fff;
            border-radius: 8rpx;
          "
        >
          {{ order.dada.statusMsg }}
        </div>
      </div>
      <div v-if="order.dada.transporterName">
        骑手姓名：{{ order.dada.transporterName }}
      </div>
      <div v-if="order.dada.transporterPhone">
        骑手电话：{{ order.dada.transporterPhone }}
      </div>
      <div v-if="order.dada.distance">
        配送距离：{{ order.dada.distance }}米
      </div>
      <div v-if="order.dada.acceptTime">
        接单时间：{{ order.dada.acceptTime }}
      </div>
      <div v-if="order.dada.fetchTime">
        取货时间：{{ order.dada.fetchTime }}
      </div>
      <div v-if="order.dada.finishTime">
        送达时间：{{ order.dada.finishTime }}
      </div>
    </div>
    <div
      class="block"
      v-if="order.is_dada > 0 && order.uu && order.uu.stateMsg"
    >
      <div class="block-row clearfix">
        <div class="row-fl">UU配送：</div>
        <div
          class="row-fr"
          style="
            padding: 3px 5px;
            background-color: #d9534f;
            color: #fff;
            border-radius: 8rpx;
          "
        >
          {{ order.uu.stateMsg }}
        </div>
      </div>
      <div v-if="order.uu.driver_name">
        骑手姓名：{{ order.uu.driver_name }}
      </div>
      <div v-if="order.uu.driver_photo">
        骑手电话：{{ order.uu.driver_photo }}
      </div>
      <div v-if="order.uu.distance">配送距离：{{ order.uu.distance }}米</div>
      <div v-if="order.uu.add_time">发单时间：{{ order.uu.add_time }}</div>
      <div v-if="order.uu.finish_time">
        收货时间：{{ order.uu.finish_time }}
      </div>
    </div>
    <div
      class="block"
      v-if="order.is_dada > 0 && order.peisong && order.peisong.peisong_text"
    >
      <div class="block-row clearfix">
        状态：<span style="color: #ff4544">{{
          order.peisong.peisong_text
        }}</span>
      </div>
      <div v-if="order.peisong.peisong_user">
        骑手姓名：{{ order.peisong.peisong_user.nickname }}
      </div>
      <div v-if="order.peisong.peisong_user">
        骑手电话：{{ order.peisong.peisong_user.contact_way }}
      </div>
      <div v-if="order.peisong.jiedan_time">
        接单时间：{{ order.peisong.jiedan_time }}
      </div>
      <div v-if="order.peisong.peisong_time">
        开始配送时间：{{ order.peisong.peisong_time }}
      </div>
      <div v-if="order.peisong.shouhuo_time">
        收货时间：{{ order.peisong.shouhuo_time }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderAddress",
  props: {
    order: Object,
  },
  data() {
    return {};
  },
  methods: {
    onPhoneCall() {
      uni.makePhoneCall({
        phoneNumber: this.order.mobile,
      });
    },
    onCopyReceiptInfo(order) {
      let copyText = `联系人：${order.name}\n联系电话：${order.mobile}\n${order.address ? `收货地址：${order.address}` : ""}`;
      this.$utils.copy(copyText, "收货信息复制成功");
    },
  },
};
</script>

<style scoped>
.block {
  background: #fff;
  padding: 32rpx 24rpx;
  margin-bottom: 20rpx;
  line-height: 36rpx;
}
.block-row {
  margin-bottom: 12rpx;
}
</style>
