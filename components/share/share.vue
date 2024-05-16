<template>
  <view>
    <!-- 分享平台弹框 -->
    <u-popup
      :show="showPopup"
      bgColor="#fff"
      @close="$emit('update:showPopup', false)"
      round="30rpx"
      mode="bottom"
    >
      <div class="popup-box" style="width: 100vw">
        <view class="flex-y-center p-x-30">
          <text class="flex-w-1 font-center font-w-700 font-32 p-y-30"
            >推荐给朋友</text
          >
          <text
            @click="$emit('update:showPopup', false)"
            class="iconfont icon-close"
          ></text>
        </view>

        <view class="list flex-x-sa flex-y-center">
          <!-- 是h5 && 是公众号 -->
          <!-- #ifdef H5 -->
          <button
            v-if="$utils.is_webpage()"
            open-type="share"
            @click="onShare"
            class="button-initial flex-col flex-x-center flex-y-center"
          >
            <text
              style="background: #07c160"
              class="iconfont icon-wechat"
            ></text>
            <text class="m-t-10 font-22">分享给朋友</text>
          </button>
          <!-- #endif -->

          <!-- #ifndef H5 -->
          <button
            v-if="isShowWx"
            open-type="share"
            @click="onShare"
            class="button-initial flex-col flex-x-center flex-y-center"
          >
            <text
              style="background: #07c160"
              class="iconfont icon-wechat"
            ></text>
            <text class="m-t-10 font-22">分享给朋友</text>
          </button>
          <!-- #endif -->

          <!-- 海报 -->
          <button
            v-if="isShowHB && number != 1"
            @click="onShowHaibao"
            class="button-initial flex-col flex-x-center flex-y-center"
          >
            <text
              class="iconfont icon-QRcode"
              style="background: #ffb11c"
            ></text>
            <text class="m-t-10 font-22">生成海报</text>
          </button>
        </view>
        <!-- <view
          class="font-center font-32 color-666 p-y-30"
          @click="$emit('update:showPopup', false)"
          >关闭</view
        > -->
      </div>
    </u-popup>

    <!-- 海报弹框 -->
    <u-popup
      :safeAreaInsetBottom="false"
      :show="showHaibao"
      @close="showHaibao = false"
      round="20rpx"
      mode="center"
      closeable
    >
      <div class="haibao-popup flex-col flex-y-center">
        <!-- #ifdef H5 -->
        <img :src="urlValue" alt="" />
        <!-- #endif -->

        <!-- #ifndef H5 -->
        <image :src="urlValue" mode="widthFix" />
        <view class="bt-download m-t-20" @click="onDownload">保存图片</view>
        <!-- #endif -->

        <view class="p-y-20 font-22 color-999">
          长按保存至相册可以分享给朋友
        </view>
      </div>
    </u-popup>

    <!-- 优惠卷弹框，微信分享成功展示 -->
    <u-popup
      :show="showCoupon"
      overlayStyle="{background: 'rgba(0, 0, 0, 1)'}"
      bgColor="transparent"
      :safeAreaInsetBottom="false"
      mode="center"
    >
      <view class="popup-box">
        <image
          class="popup-bg-img"
          :src="wxapp_img.img_get_coupon_bg"
          mode="widthFix"
        />
        <image
          class="img-title"
          :src="wxapp_img.coupon_success_title"
          mode="heightFix"
        />
        <image
          class="img-content-bg"
          :src="wxapp_img.img_get_coupon_item_bg"
          mode="heightFix"
        />

        <view class="popup-content">
          <view class="price-box flex-y-center flex-x-sb">
            <view class="price">￥{{ couponData.sub_price }}</view>
            <view class="min-price">满{{ couponData.min_price }}元可用</view>
          </view>
          <view class="bt" @click="$utils.toUrl('/pages/list/list')">
            立即使用
          </view>
          <view class="color-fff font-22 m-t-10 u-line-1">{{
            couponData.desc
          }}</view>
        </view>
        <view @click="showCoupon = false" class="iconfont icon-reeor"></view>
      </view>
    </u-popup>

    <view v-if="!isMovable" class="right-hovering">
      <view
        v-if="showFixedShare"
        @click="$emit('update:showPopup', true)"
        class="flex-y-center flex-x-center"
      >
        <text class="iconfont icon-share font-40"></text>
      </view>
      <view
        v-if="isScrollTop"
        @click="clickScrollTop"
        class="flex-y-center flex-x-center"
      >
        <text class="iconfont icon-zhiding font-40"></text>
      </view>
    </view>

    <movable-area v-else>
      <movable-view direction="all">
        <view
          v-if="showFixedShare"
          @click="$emit('update:showPopup', true)"
          class="flex-y-center flex-x-center movable-item"
        >
          <text class="iconfont icon-share font-40"></text>
        </view>
      </movable-view>
    </movable-area>

    <!-- 提示浏览器分享蒙层图片 -->
    <view
      @scroll.stop
      @click="switchWebpageImg"
      v-if="webpageImg"
      class="web-share-popup"
    >
      <image
        style="width: 100%"
        :src="wxapp_img.share.share2"
        mode="widthFix"
      />
    </view>

    <!-- 打开app 需父组件有——paltform参数app -->
    <view
      v-if="_platform == 'app'"
      @click="$utils.toUrl('/spread/reg?user_id=' + parent_id)"
      class="share-bottom"
    >
      打开APP
    </view>
  </view>
</template>

<script>
import siteinfo from '@/siteinfo.js';
export default {
  props: {
    showPopup: {
      type: Boolean,
      default: false,
    },
    data: {
      type: [Object, String],
      default() {
        return {};
      },
    },
    type: {
      type: String,
      default: 'goods',
    },
    isShowHB: {
      type: Boolean,
      default: true,
    },
    isShowWx: {
      type: Boolean,
      default: true,
    },
    isScrollTop: {
      type: Boolean,
      default: false,
    },
    showFixedShare: {
      type: Boolean,
      default: false,
    },
    isMovable: {
      type: Boolean,
      default: false,
    },
    number: {
      type: Number,
      default: false,
    },
    routerPush: {
      type: String,
      default: false,
    },
  },
  data() {
    return {
      showHaibao: false,
      webpageImg: false,
      urlValue: '',
      couponData: '', //分享赠送优惠券信息
      showCoupon: false, //优惠券弹框开关
    };
  },
  onShareAppMessage() {
    return {
      title: this.data.content,
      path: this.routerPush,
    };
  },
  computed: {
    _platform() {
      return this.$root._platform;
    },
    parent_id() {
      return this.$root.parent_id;
    },
  },
  methods: {
    onShare() {
      console.log(this.routerPush, this.data);
      if (this.number == 1 && this.routerPush != '') {
        console.log('进来了');
        uni.share({
          provider: 'weixin',
          scene: 'WXSceneSession',
          title: this.data.content,
          imageUrl: this.data.avatar_url || '',
          type: 0,
          href: this.routerPush,
          success: res => {
            console.log('成功', res);
            this.$emit('fenxiang', false);
          },
          fail: error => {
            console.log('失败', error);
            console.log(error);
            this.$emit('fenxiang', false);
          },
          complete: res => {
            console.log('完成', res);
          },
        });
      } else {
        /* #ifdef MP-WEIXIN */
        this.onShareCounpon();
        /* #endif */

        // #ifdef H5
        let source = 1;
        if (this.$utils.is_webpage()) source = 2;
        this.$requestAll.default.shareLog({
          source,
        });
        // 链接分享
        this.switchWebpageImg();
        // #endif

        // #ifdef APP-PLUS
        this.$requestAll.default.shareLog({
          source: 3,
        });
        uni.share({
          provider: 'weixin',
          scene: 'WXSceneSession',
          title: this.$root.shareData.title,
          imageUrl: this.$root.shareData.imageUrl || '',
          type: 0,
          href: siteinfo.siteroot + this.$root.shareData.path,

          success: res => {
            console.log('成功', res);
            this.$emit('update:showPopup', false);
          },
          fail: error => {
            console.log('失败', error);
            console.log(error);
          },
          complete: res => {
            console.log('完成', res);
          },
        });
        // #endif
      }
    },
    // 海报分享
    async onShowHaibao() {
      setTimeout(() => {
        this.$emit('update:showPopup', false);
      }, 400);
      if (this.type == 'goods') {
        const res = await this.$requestAll.default.goodsQrcode(
          {
            goods_id: this.data.id,
          },
          true
        );
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'home') {
        const res = await this.$requestAll.index.qrcode({}, true);
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      }
      // 砍价
      else if (this.type == 'bargain') {
        const res = await this.$requestAll.bargain.qrcode(
          {
            goods_id: this.data.id,
          },
          true
        );
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'miaosha') {
        const res = await this.$requestAll.miaosha.qrcode(
          {
            goods_id: this.data.goods_id,
          },
          true
        );
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'yuyue') {
        const res = await this.$requestAll.book.goodsQrcode(
          {
            goods_id: this.data.id,
          },
          true
        );
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'choujiang') {
        const res = await this.$requestAll.scratch.qrcode({id: this.data.id}, true);
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'lives') {
        const res = await this.$requestAll.lives.qrcode(
          {
            room_id: this.data,
          },
          true
        );
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'crowdfund') {
        const res = await this.$requestAll.crowdfund.qrcode(
          {
            goods_id: this.data,
          },
          true
        );
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'pintuan') {
        if (this.data.order_id) {
          var res = await this.$requestAll.group.orderQrcode({
            order_id: this.data.order_id,
          });
        } else {
          var res = await this.$requestAll.group.goodsQrcode({
            goods_id: this.data.goods_id,
          });
        }
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'vgoods') {
        var res = await this.$requestAll.default.shareQrcode({
          id: this.data.id,
          type: 10,
        });
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if (this.type == 'topic') {
        var res = await this.$requestAll.default.topicQrcode({
          goods_id: this.data.id,
        });
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if(this.type == 'lottery') {
         var res = await this.$requestAll.lottery.qrcode({
          goods_id: this.data.id,
        });
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      } else if(this.type == 'pond') {
        var res = await this.$requestAll.pond.qrcode({
          goods_id: this.data.id,
        });
        this.urlValue = res.data.pic_url;
        this.showHaibao = true;
      }
    },
    // 获取优惠卷
    async onShareCounpon() {
      let res = await this.$requestAll.coupon.shareSend();
      if (res.data.list.length) {
        this.couponData = res.data.list[0];
        this.$emit('update:showPopup', false);
        this.showCoupon = true;
      }
    },
    onDownload() {
      // 如果是APP的话 弹出授权提示
      //#ifdef APP-PLUS
      if(this.systemInfo.osName !== 'ios') {
        uni.showModal({
          title:'提示',
          content:'是否允许申请相册存储权限',
          success: ({confirm,cancel}) => {
            if(confirm){
              this.$utils.addImg(this.urlValue);
            }
            
          }
        })
      }else {
        this.$utils.addImg(this.urlValue);
      }
      //#endif
      //#ifdef MP-WEIXIN || H5
      this.$utils.addImg(this.urlValue);
      //#endif
    },
    switchWebpageImg() {
      this.webpageImg = !this.webpageImg;
    },
    clickScrollTop() {
      uni.pageScrollTo({ scrollTop: 0 });
    },
  },
  watch: {
    showHaibao(val) {
      if (this.$parent.__route__ == 'scratch/index/index') {
        this.$parent.hideChoujiang = val;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.icon-close {
  background: #f2f1f2;
  font-size: 32rpx;
  line-height: 44rpx;
  width: 44rpx;
  text-align: center;
  border-radius: 50%;
  color: #8c8c8c;
}
.list {
  // border-bottom: 2rpx solid #eee;
  padding: 20rpx;
  height: 220rpx;
  // min-height: 300rpx;
  > button {
    width: 200rpx;
    padding: 20rpx;
    border-radius: 30rpx;

    > .iconfont {
      width: 96rpx;
      line-height: 96rpx;
      border-radius: 50%;
      text-align: center;
      color: #fff;
      font-size: 44rpx;
    }
  }
}
.popup-box {
  position: relative;
  width: 100vw;
  .popup-bg-img {
    display: block;
    margin: 0 auto;
    width: 100%;
    padding-bottom: 60rpx;
  }
  .img-title {
    position: absolute;
    top: 120rpx;
    left: 50%;
    height: 50rpx;
    transform: translate(-50%, 0);
  }
  .img-content-bg {
    position: absolute;
    top: 200rpx;
    left: 50%;
    height: 250rpx;
    transform: translate(-50%, 0);
  }
  .icon-reeor {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, 0);
    color: #f5f5f5;
    font-size: 100rpx;
  }
  .popup-content {
    position: absolute;
    top: 240rpx;
    left: 50%;
    transform: translate(-50%, 0);
    .price-box {
      color: #fff;
      opacity: 0.9;
      margin-bottom: 10rpx;
      .price {
        font-size: 40rpx;
      }
      .min-price {
        font-size: 24rpx;
      }
    }
    .bt {
      width: 420rpx;
      line-height: 60rpx;
      background: #fff;
      border-radius: 10rpx;
      color: red;
      text-align: center;
    }
  }
}
.haibao-popup {
  overflow: hidden;
  width: 70vw;
  border-radius: 20px;

  > image,
  > img {
    width: 100%;
    max-height: 800rpx;
  }

  .bt-download {
    width: 80%;
    border-radius: 10rpx;
    background: #ff4544;
    color: #fff;
    text-align: center;
    line-height: 80rpx;
  }
}

.right-hovering {
  position: fixed;
  right: 30rpx;
  bottom: 136rpx;
  bottom: calc(136rpx + env(safe-area-inset-bottom));
  z-index: 999;
  > view {
    width: 80rpx;
    height: 80rpx;
    background: #ffffff;
    border: 2rpx solid #e0e0e0;
    box-shadow: 0rpx 16rpx 32rpx rgba(0, 0, 0, 0.07);
    border-radius: 50%;
    margin-top: 30rpx;
  }
}

.web-share-popup {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 999999;
  background: rgba($color: #000000, $alpha: 0.5);

  > image {
    width: 100%;
  }
}

.share-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  background: red;
  color: #fff;
  height: 100rpx;
  line-height: 100rpx;
  box-sizing: content-box;
  padding-bottom: env(safe-area-inset-bottom);
  text-align: center;
  font-size: 32rpx;
}

movable-area {
  pointer-events: none;
  position: fixed;
  width: 100vw;
  height: 100vh;
  right: 0;
  top: 0;
  z-index: 9999;
  movable-view {
    pointer-events: auto;
    position: absolute;
    left: 10rpx;
    // right: 30rpx;
    top: calc(100vh - 500rpx);
    bottom: 20vh;
    z-index: 9999;
    width: 80rpx;
    height: 80rpx;
    .movable-item {
      width: 80rpx;
      height: 80rpx;
      background: #ffffff;
      border: 2rpx solid #e0e0e0;
      box-shadow: 0rpx 16rpx 32rpx rgba(0, 0, 0, 0.07);
      border-radius: 50%;
    }
  }
}
</style>
