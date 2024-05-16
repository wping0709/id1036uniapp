<template>
  <view class="foot-nav">
    <view class="flex-x-sb">
      <view class="icon-box flex-x-sa flex-y-center">
        <view
          @click="$utils.toUrl('/pages/index/index')"
          class="item flex-y-center flex-col flex-x-center"
        >
          <text class="iconfont icon-store"></text>
          <view>首页</view>
        </view>

        <!-- <view
          @click="onShoucang"
          v-if=""
          class="item flex-y-center flex-col flex-x-center"
        >
          <text
            :class="goods.is_favorite && 'price-color'"
            class="iconfont icon-collection"
          ></text>
          <view>收藏</view>
        </view> -->
        <template
          v-if="
            type != 'bargain' &&
            type != 'yuyue' &&
            SHOP_CONFIG.store.wx_is_open_kefu > -1
          "
        >
          <!-- #ifndef MP-WEIXIN -->
          <view
            v-if="SHOP_CONFIG.store.wx_is_open_kefu > -1"
            class="item flex-y-center flex-col flex-x-center"
            @click="toKefu"
          >
            <text class="iconfont icon-service"></text>
            <view>客服</view>
          </view>
          <!-- #endif -->

          <!-- #ifdef MP-WEIXIN -->
          <view
            v-if="SHOP_CONFIG.store.wx_is_open_kefu == 1"
            class="item flex-y-center flex-col flex-x-center"
            @click="toKefu"
          >
            <text class="iconfont icon-service"></text>
            <view>客服</view>
          </view>
          <button
            v-if="SHOP_CONFIG.store.wx_is_open_kefu == 0"
            class="button-initial item flex-y-center flex-col flex-x-center"
            open-type="contact"
          >
            <text class="iconfont icon-service"></text>
            <view>客服</view>
          </button>
          <!-- #endif -->
        </template>

        <view
          v-if="type != 'yuyue'"
          @click="$utils.toUrl('/pages/cart/cart')"
          class="item flex-y-center flex-col flex-x-center"
        >
          <text class="iconfont icon-cart-full"></text>
          <view>购物车</view>

          <div v-if="tabBarData && tabBarData.cart_count > 0" class="cart-num">
            {{ tabBarData && tabBarData.cart_count }}
          </div>
        </view>
      </view>

      <view
        :class="[goods.num <= 0 && 'nv-right_1']"
        class="nav-right flex-y-center flex-x-center flex-w-1 p-r-20"
      >
        <!-- 如果商品价格面议 -->
        <view v-if="type == 'goods-mianyi'" @click="clickMobile" class="bt"
          >拨打电话</view
        >

        <template v-else-if="type == 'yuyue'">
          <view @click="$emit('ok', 'buy')" class="buy-bt bt"> 立即预约 </view>
        </template>

        <template v-else-if="type == 'pintuan'">
          <view
            v-if="goods.is_only == 1"
            @click="$emit('ok', 'dandugoumai')"
            style="background: #333; line-height: 1.5"
            class="bt"
          >
            <view style="font-weight: 600; line-height: 40rpx"
              >￥{{ goods.single_price }}</view
            >
            <view class="font-20">单独购买</view>
          </view>

          <view
            @click="$emit('ok', 'buy')"
            class="buy-bt bt"
            style="line-height: 1.5"
          >
            <view style="font-weight: 600; line-height: 40rpx"
              >￥{{ goods.group_price }}</view
            >
            <view class="font-20">发起拼团</view>
          </view>
        </template>

        <!-- 砍价 -->
        <template v-else-if="type == 'bargain'">
          <template v-if="!goods.bargain_info">
            <div
              @click="
                $utils.toUrl(
                  '/bargain/activity/activity?goods_id=' + goods.goods.id
                )
              "
              class="bt"
              style="background: #ffc210"
            >
              立即砍价
            </div>
          </template>
          <template v-else>
            <view @click="$emit('ok', 'buy')" class="buy-bt bt">立即购买</view>
            <view
              @click="
                $utils.toUrl(
                  '/bargain/activity/activity?order_id=' +
                    goods.bargain_info.order_id
                )
              "
              class="bt"
              style="background: #ffc210"
            >
              找人帮砍
            </view>
          </template>
        </template>

        <template v-else>
          <view
            v-if="type == 'goods'"
            @click="$emit('ok', 'addCart')"
            class="cart-bt bt"
          >
            加入购物车
          </view>
          <view @click="$emit('ok', 'buy')" class="buy-bt bt"> 立即购买 </view>
        </template>
      </view>
    </view>
  </view>
</template>

<script>
import siteinfo from '@/siteinfo.js'
export default {
  props: {
    // miaosha秒杀  goods商品  goods-mianyi商品价格面谈
    type: {
      type: String,
      default: 'goods',
    },
    goods: {
      type: Object,
      default() {
        return {};
      },
    },
    // 客服类型
    goodsType: {
      type: String,
      default: 'STORE',
    },
  },
  data() {
    return {
      tabBarData: '',
    };
  },
  methods: {
    toKefu() {
	//#ifdef APP-PLUS
	if(this.systemInfo.osName !== 'ios') {
		uni.showModal({
			title:'提示',
			content:'是否允许申请存储/相机权限',
			success: ({confirm,cancel}) => {
				if(confirm){
					const goods = this.goods;
					let mch = this.goods.mch;
					const userInfo = this.$store.getters['user/userInfo'];
					let mch_id = mch ? mch.id : 0;
					var param = {
					  to_user_id:
					    mch_id > 0 ? mch.service_tel : this.store.kefu_setting.mobile,
					  to_user_nickname: mch ? mch.name : '平台自营',
					  to_user_img: mch ? mch.logo : this.store.copyright_pic_url,
					  to_mch_id: mch_id,
					  goods_name: goods.name,
					  goods_img: goods.cover_pic,
					  goods_price: goods.min_price,
					  goods_id: goods.id,
					  goods_type: this.goodsType,
            open_url: siteinfo.siteroot + '/pages/goods/goods?id=' + goods.id
					};
					
					// 未登录去登录
					if (!userInfo) {
					  this.$utils.toUrl('/login/login/login_page');
					  return;
					}
					this.$utils.toUrl(
					  '/kefu/kefu?data=' + encodeURIComponent(JSON.stringify(param))
					);
				}
			}
		})
	}else {
		const goods = this.goods;
		let mch = this.goods.mch;
		const userInfo = this.$store.getters['user/userInfo'];
		
		let mch_id = mch ? mch.id : 0;
		var param = {
		  to_user_id:
		    mch_id > 0 ? mch.service_tel : this.store.kefu_setting.mobile,
		  to_user_nickname: mch ? mch.name : '平台自营',
		  to_user_img: mch ? mch.logo : this.store.copyright_pic_url,
		  to_mch_id: mch_id,
		  goods_name: goods.name,
		  goods_img: goods.cover_pic,
		  goods_price: goods.min_price,
		  goods_id: goods.id,
		  goods_type: this.goodsType,
      open_url: siteinfo.siteroot + '/pages/goods/goods?id=' + goods.id
		};
		
		// 未登录去登录
		if (!userInfo) {
		  this.$utils.toUrl('/login/login/login_page');
		  return;
		}
		this.$utils.toUrl(
		  '/kefu/kefu?data=' + encodeURIComponent(JSON.stringify(param))
		);
	}

    //#endif
	//#ifdef MP-WEIXIN || H5
	const goods = this.goods;
	let mch = this.goods.mch;
	const userInfo = this.$store.getters['user/userInfo'];
	
	let mch_id = mch ? mch.id : 0;
	var param = {
	  to_user_id:
	    mch_id > 0 ? mch.service_tel : this.store.kefu_setting.mobile,
	  to_user_nickname: mch ? mch.name : '平台自营',
	  to_user_img: mch ? mch.logo : this.store.copyright_pic_url,
	  to_mch_id: mch_id,
	  goods_name: goods.name,
	  goods_img: goods.cover_pic,
	  goods_price: goods.min_price,
	  goods_id: goods.id,
	  goods_type: this.goodsType,
    open_url: siteinfo.siteroot + '/pages/goods/goods?id=' + goods.id
	};
	
	// 未登录去登录
	if (!userInfo) {
	  this.$utils.toUrl('/login/login/login_page');
	  return;
	}
	this.$utils.toUrl(
	  '/kefu/kefu?data=' + encodeURIComponent(JSON.stringify(param))
	);
		//#endif
    },
    async onShoucang() {
      var goods = JSON.parse(JSON.stringify(this.goods));
      if (goods.is_favorite) {
        await this.$requestAll.user.favoriteRemove(
          {
            goods_id: goods.id,
          },
          true
        );
        var msg = '取消成功';
        goods.is_favorite = 0;
      } else {
        await this.$requestAll.user.favoriteAdd(
          {
            goods_id: goods.id,
          },
          true
        );
        var msg = '收藏成功';
        goods.is_favorite = 1;
      }
      console.log(goods);
      uni.$u.toast(msg);
      this.$emit('update:goods', goods);
    },
    // 拨打电话
    clickMobile() {
      let tel = this.goods.mch
        ? this.goods.mch.service_tel
        : this.SHOP_CONFIG.store.contact_tel;
      uni.makePhoneCall({
        phoneNumber: tel,
        success: result => {},
        fail: error => {},
      });
    },
  },
  watch: {
    '$store.getters.tabBarData': {
      handler(data) {
        console.log(data, '123');
        this.tabBarData = data;
      },
      immediate: true,
    },
  },
  computed: {
    isStart() {
      const time = new Date().getTime();
    },
    goodsString() {
      return JSON.stringify(this.goods);
    },
    SHOP_CONFIG() {
      return this.$store.getters['SHOP_CONFIG'];
    },
  },
};
</script>

<style lang="scss" scoped>
.foot-nav {
  height: 110rpx;
  height: calc(110rpx + env(safe-area-inset-bottom));

  > view {
    border-top: 1px solid #f5f5f5;

    position: fixed;
    z-index: 99;
    // #ifdef MP-WEIXIN
    z-index: 101;
    // #endif
    left: 0;
    bottom: 0;
    width: 100%;
    height: 110rpx;
    height: calc(110rpx + env(safe-area-inset-bottom));
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;

    display: flex;
    align-items: center;
    // justify-content: space-around;
    color: #333;
    text-align: center;

    .iconfont {
      width: 68rpx;
      height: 68rpx;
      line-height: 68rpx;
      font-size: 50rpx;
    }

    .icon-box {
      .item {
        position: relative;
        min-width: 100rpx;
        font-size: 24rpx;
        .cart-num {
          position: absolute;
          right: 0;
          top: 0;
          background: red;
          border-radius: 15rpx;
          min-width: 30rpx;
          line-height: 30rpx;
          height: 30rpx;

          color: #fff;
          font-size: 20rpx;
          text-align: center;
        }
      }
    }

    .nav-right {
      > view:nth-child(n + 2) {
        margin-left: 20rpx;
      }
      .bt {
        flex: 1;
        width: 0;
        color: #fff;
        font-size: 26rpx;
        font-weight: 700;
        // width: 200rpx;
        text-align: center;
        line-height: 70rpx;
        border-radius: 35rpx;
        background: #118eea;
      }

      .cart-bt {
        background: #ffa200;
      }

      .buy-bt {
        background: #ff0000;
      }

      .miaosha-buy-bt {
        width: 500rpx;
        border-radius: 0;
      }
    }

    .nv-right_1 {
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba($color: #fff, $alpha: 0.4);
      }
    }
  }
}
</style>
