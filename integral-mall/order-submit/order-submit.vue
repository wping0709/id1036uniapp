<template>
  <view v-if="pageData" class="body">
    <view class="bg-fff tabs-box" style="">
			<u-tabs
			  :list="list1"
			  :activeStyle="{
			    color: 'red',
			  }"
			  lineColor="red"
			  :scrollable="false"
			  @click="clickTab"
			></u-tabs>
    </view>
    <Address
      :address="address"
      @formDataChange="val => (this.addForm = val)"
      :type="current ? 'shop' : 'express'"
    ></Address>

    <!-- 门店选择 -->
    <view
      @click="showStore = true"
      v-if="current"
      class="store m-y-20 bg-fff p-20 flex-y-center flex-x-sb"
    >
      <view class="store-content">
        <view class="u-line-1"> 门店名称：{{ selectStore.name }} </view>
        <view class="u-line-1"> 门店电话： {{ selectStore.mobile }}</view>
        <view class="u-line-2"> 自提门店： {{ selectStore.address }}</view>
      </view>
      <view class="iconfont icon-arrow-right color-999"></view>
    </view>

    <!-- 商品 -->
    <view
      @click="$utils.toUrl(`/integral-mall/goods-info/index?id=${pageData.goods.id}&integral=${pageData.goods.attr_integral}`)"
      class="flex-x-sb goods-item p-x-20"
    >
      <image style="width:156rpx;height:156rpx;border-radius:5rpx;" mode="aspectFill" :src="pageData.goods.cover_pic"></image>
      <view class="item-right">
        <view class="goods-title u-line-2">{{ pageData.goods.name }}</view>
        <view class="attr-price flex-x-sb">
          <view style="flex: 1" class="font-24 attr u-line-2">
            <span v-for="(attr, index) in pageData.goods.attr" :key="index">
              {{ attr.attr_group_name }}：{{ attr.attr_name }}
            </span>
          </view>
          <view>
            <view class="font-24">x{{ pageData.goods.num }}</view>
            <view class="price"
              >{{ pageData.goods.attr_integral }}积分 + ￥{{
                pageData.goods.attr_price
              }}</view
            >
          </view>
        </view>
      </view>
    </view>

    <!-- 配送方式 -->
    <view  class="p-x-20 bg-fff price-exprees-box">
      <view v-if="current != 1" class="flex-x-sb flex-y-center freight">
        <view>运费</view>
        <view class="price-color">￥{{ pageData.express_price }}</view>
      </view>
      <view class="flex-x-sb leave">
        <view>买家留言</view>
        <view class="flex-w-1 m-l-20">
            <u-textarea
              v-model="pageData.content"
              class="textarea"
              placeholder="你有什么想对商家说的都可以填写在这哦~"
              autoHeight
              border="none"
            ></u-textarea>
        </view>
      </view>
    </view>

    <view class="bottom-bts">
      <view class="flex-y-center">
        <view class="flex-w-1 price-color">
          {{ pageData.goods.attr_integral }}积分 + ￥{{
            totalPrice
          }}
        </view>
        <view class="" @click="submit">提交</view>
      </view>
    </view>

    <u-popup
      @close="showStore = false"
      :show="showStore"
      round="10"
      safeAreaInsetBottom
    >
      <view class="popup-box">
        <view class="positon-box p-x-30 flex-x-end flex-y-center link-color">
          <text class="iconfont icon-dangqianweizhi"></text>
          手动定位
        </view>
        <view class="store-title p-x-20">
          门店列表（仅展示离您最近的30家门店）
        </view>
        <scroll-view scroll-y class="scroll-view">
          <view
            @click="onSelectStore(item)"
            v-for="(item, index) in pageData.shop_list"
            :key="index"
            class="store store-item m-y-20 bg-fff p-20 flex-y-center flex-x-sb"
          >
            <view class="m-r-10">
              <text
                v-if="item.id == selectStore.id"
                class="font-50 iconfont icon-success price-color"
              ></text>
              <text
                v-else
                class="font-50 iconfont icon-xuanzekuangmoren"
                style="color: #c5c5c5"
              ></text>
            </view>
            <view class="store-content flex-w-1">
              <view class="u-line-1 font-w-600 color-333"
                >{{ item.name }}
              </view>
              <view class="u-line-1"> 门店电话： {{ item.mobile }}</view>
              <view class="u-line-2"> 自提门店： {{ item.address }}</view>
            </view>
          </view>
        </scroll-view>
      </view>
    </u-popup>
  </view>
</template>
<script>
import Address from '@/pages/order-submit/components/Address';
import OrderPay from '@/mixins/OrderPay';
export default {
  mixins: [OrderPay],
  components: {
    Address,
  },
  data() {
    return {
      pageData: '',
      address: '',
      params: '',
      current: 0,
      list1: [
        {
          name: '快递配送',
        },
        {
          name: '到店自提',
        },
      ],
      addForm: {
        name: '',
        mobile: '',
      },
      selectStore: {
        name: '',
        mobile: '',
        address: '',
      },
      showStore: false,
    };
  },
  onLoad(params) {
    this.params = params;
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await this.$requestAll.integralmall.submitPriview(
        this.params
      );
      this.pageData = res.data;
      this.address = this.pageData.address;
      this.selectStore = res.data.shop_list[0];
	  let index = this.pageData.send_type.indexOf("express")
	  let index2 = this.pageData.send_type.indexOf("shop")
	  if(index == -1){
		  let tabList1 = this.list1.filter((item1)=>{
			  return item1.name !== '快递配送'
		  })
		 this.list1 = tabList1
	  }else if(index2 == -1){
		  let tablist2 = this.list1.filter((item2)=>{
			  return item2.name !== '到店自提'
		  })
		  this.list1 = tablist2
	  }
    },
    clickTab({ index }) {
      if (index == 1) {
        this.addForm = {
          name: this.address.name,
          mobile: this.address.mobile,
        };
        this.current = index;
      } else {
        this.current = index;
      }
    },
    submit() {
      try {
        uni.showLoading({
          title: '加载中',
        });

        var pageData = JSON.parse(JSON.stringify(this.pageData));
        var formData = {};
        if (this.current == 0) {
          if (!this.address) throw '请选择收货地址';
          formData = {
            address_id: this.address.id,
            express_price: pageData.express_price,
            attr: JSON.stringify(pageData.goods.attr),
            goods_info: JSON.stringify({
              goods_id: JSON.parse(this.params.goods_info).goods_id,
              attr: pageData.goods.attr.map(item => {
                delete item.attr_group_id;
                delete item.attr_group_name;
                return item;
              }),
            }),
            type: pageData.goods.attr_price > 0 ? 2 : 1,
            offline: this.current + 1,
          };
        } else {
          if (!this.selectStore.id) throw '请选择门店';
          if (!this.addForm.name || !this.addForm.mobile)
            throw '请输入联系人信息';
          formData = {
            address_name: this.addForm.name,
            address_mobile: this.addForm.mobile,
            offline: this.current + 1,
            shop_id: this.selectStore.id,
            express_price: pageData.express_price,
            attr: JSON.stringify(pageData.goods.attr),
            goods_info: JSON.stringify({
              goods_id: JSON.parse(this.params.goods_info).goods_id,
              attr: pageData.goods.attr.map(item => {
                delete item.attr_group_id;
                delete item.attr_group_name;
                return item;
              }),
            }),
          };
        }
        formData.content = this.pageData.content
        // console.log(this.addForm);
        // throw "1";
        this.orderSubmit(formData, 'jf');
      } catch (error) {
        uni.hideLoading();
        this.$utils.toast(error);
      }
    },
    onSelectStore(item) {
      this.selectStore = item;
      this.showStore = false;
    },
  },
  onShow() {
    const address = uni.getStorageSync('address');
    console.log(address);
    if (address) this.address = address;
    uni.removeStorageSync('address');
  },
  computed: {
    totalPrice() {
      if(!this.pageData) return '0.00'
      if(this.current == 0) {
        let total = Number(this.pageData.goods.attr_price) + Number(this.pageData.express_price)
        return total.toFixed(2)
      } else {
        return this.pageData.goods.attr_price
      }
    }
  },
  watch: {},
  onReachBottom() {},
};
</script>
<style lang="scss" scoped>
.body {
  background: #f5f5f5;
  min-height: 100vh;
  font-size: 28rpx;
  .tabs-box {
    border-bottom: 2rpx solid #eee;
  }
  .store {
    .store-content {
      > view {
        line-height: 50rpx;
      }
    }
  }
  .goods-item {
    padding: 10rpx 20rpx;
    margin: 20rpx 0;
    background: #fff;
    margin-bottom: 20rpx;
    .item-right {
      flex: 1;
      margin-left: 20rpx;
      .goods-title {
        height: 76rpx;
      }
      .attr-price {
        .attr {
          > span {
            color: #666;
            margin-right: 10rpx;
          }
        }
        > view:nth-child(2) {
          text-align: right;
          color: #666;
          .price {
            color: red;
          }
        }
      }
    }
  }
  .price-exprees-box {
    > .express {
      min-height: 100rpx;
      border-bottom: 1px solid #eee;
      > view:nth-child(2) {
        display: flex;
        flex-wrap: wrap;
        > view {
          margin: 0 20rpx 0;
        }
        text {
          margin-left: 10rpx;
        }
      }
    }
    > .freight {
      height: 100rpx;
      border-bottom: 1px solid #eee;
    }
    > .leave {
      box-sizing: content-box;
      min-height: 100rpx;
      line-height: 100rpx;
      /deep/.u-textarea {
        margin-top: 35rpx;
        font-size: 26rpx;
        line-height: 36rpx;
        padding: 0;
      }
    }
  }
}

.bottom-bts {
  height: 100rpx;
  height: calc(100rpx + env(safe-area-inset-bottom));
  > view {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    height: calc(100rpx + env(safe-area-inset-bottom));
    padding-left: 30rpx;
    padding-bottom: env(safe-area-inset-bottom);
    text-align: center;
    background: #fff;
    > view:nth-child(1) {
      text-align: left;
      font-size: 32rpx;
    }
    > view:nth-child(2) {
      width: 240rpx;
      background: #ff4544;
      line-height: 100rpx;
      color: #fff;
      font-size: 32rpx;
    }
  }
}

.popup-box {
  .positon-box {
    line-height: 80rpx;
    text-align: right;
  }
  .store-title {
    line-height: 80rpx;
    background: #f5f5f5;
  }
  .scroll-view {
    max-height: 70vh;
    .store-item {
      border-bottom: 2rpx solid #eee;
    }
  }
}
</style>
