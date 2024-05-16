<template>
  <div class="order-address">
    <!-- 普通收货信息 -->
    <div class="block" v-if="order.is_order_food ==0">
      <div class="block-row font-28 font-w-700 flex-y-center">
        <text class="iconfont icon-seat font-w-400 font-40"></text>
        <text class="m-x-10">{{ order.name }}</text>
        <text>{{ order.mobile }}</text>
      </div>

      <!-- 普通地址信息 -->
      <div v-if="order.address" class="color-999 font-24 m-t-16">
        地址：{{ order.address }}
      </div>

      <div class="m-t-16 flex-y-center" v-if="order.is_offline == 1 && order.shop">
        <div class="left flex-w-1">
          <div class="color-999 u-line-2">{{ order.shop.address }}</div>
        </div>
        <div class="right flex-y-center">
          <view
            @click="
              $utils.openLocation({
                latitude: order.shop.latitude - 0,
                longitude: order.shop.longitude - 0,
                name: order.shop.name,
              })
            "
            style="
              color: red;
              width: 48rpx;
              height: 48rpx;
              line-height: 48rpx;
              background: #fbeceb;
              border-radius: 50%;
            "
            class="iconfont font-center icon-dingwei font-40 m-l-20"
          ></view>
          <view
            @click="$utils.makePhoneCall({ phoneNumber: order.shop.mobile })"
            style="
              color: red;
              width: 48rpx;
              height: 48rpx;
              line-height: 48rpx;
              background: #fbeceb;
              border-radius: 50%;
            "
            class="iconfont font-center icon-phone font-40 m-l-20"
          ></view>
        </div>
      </div>
    </div>
	
	<!-- 扫码点餐 -->
	<div class="block" v-if="order.is_order_food ==1">
	  <div class="block-row font-28 font-w-700 flex-y-center">
	    <text class="iconfont icon-seat font-w-400 font-40"></text>
	    <text class="m-x-10">点餐类型</text>
	    <text>{{ order.order_food_type?'打包带走':'店内堂食' }}</text>
	  </div>
	  
	  
	  <div  class="color-999 font-24 m-t-16">
	    桌号：{{ order.table_number}}
	  </div>
	  
	  <div  class="color-999 font-24 m-t-16">
	    就餐人数：{{ order.diners_number}}
	  </div>
	  
	  <div  class="color-999 font-24 m-t-16">
	    流水号：A{{ order.running_number}}
	  </div>
	  
	
	</div>

    <!-- 门店自提点信息 -->
    <!-- <div class="block">
      <div class="flex-grow-1">
        <div class="flex-grow-1">门店名称：{{ order.shop.name }}</div>
        <div class="flex-grow-1">联系电话：{{ order.shop.mobile }}</div>
        <div class="flex-grow-1">门店地址：{{ order.shop.address }}</div>
      </div>
    </div> -->

    <!-- 达达配送 -->
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
      <div class="m-t-16">
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
    </div>

    <!-- UU配送： -->
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
            border-radius: 0.25rem;
          "
        >
          {{ order.uu.stateMsg }}
        </div>
      </div>
      <div class="m-t-16">
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
    </div>

    <!-- 配送状态 -->
    <div
      class="block"
      v-if="order.is_dada > 0 && order.peisong && order.peisong.peisong_text"
    >
      <div class="block-row clearfix">
        状态：
        <span style="color: #ff4544">
          {{ order.peisong.peisong_text }}
        </span>
      </div>
      <div class="m-t-16">
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
  </div>
</template>

<script>
export default {
  name: 'OrderAddress',
  props: {
    order: Object,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
.order-address {
  margin: 0 24rpx 20rpx;
}
.block {
  background: #fff;
  padding: 24rpx;
  margin-bottom: 20rpx;
  line-height: 36rpx;
  border-radius: 20rpx;
}
.m-t-16 {
  margin-top: 16rpx;
}
/* .block-row {
  margin-bottom: 16rpx;
} */
</style>
