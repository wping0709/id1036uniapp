<template>
  <view class="module-item" :class="[isLine ? 'm-y-20' : 'm-20']">
    <template v-if="!isLine">
      <view class="title">{{ pageData.title }}</view>
      <view class="moudule-content">
        <template v-for="(item, index) in pageData.list">
          <template v-if="item.id == 'live'">
            <view
              @click="
                $utils.toUrl(
                  data.user_info.is_live == 1 ? item.url : '/lives/admin/apply',
                  item.open_type
                )
              "
              class="flex-col flex-y-center"
              :key="index"
            >
              <image :src="item.icon" mode="aspectFit" />
              <view class="font-24 u-line-2 font-center">
                {{ data.user_info.is_live == 1 ? item.name : item.name_1 }}
              </view>
            </view>
          </template>

          <template v-else-if="item.id == 'kefu'">
            <button
              :open-type="item.open_type"
              class="button-initial flex-col flex-y-center"
              :key="index"
            >
              <image :src="item.icon" mode="aspectFit" />
              <view class="font-24 u-line-2 font-center">
                {{ item.name }}
              </view>
            </button>
          </template>

          <template v-else>
            <view
              v-if="isAuthority(item)"
              @click="navTo(item)"
              class="flex-col flex-y-center"
              :key="index"
            >
              <image :src="item.icon" mode="aspectFit"></image>
              <view class="font-24 u-line-2 font-center">
                {{ item.name }}
              </view>
            </view>
          </template>
        </template>
      </view>
    </template>

    <template v-else>
      <div class="moudule-content flex-col">
        <template v-for="(item, index) in pageData.list">
          <template v-if="item.id == 'live'">
            <view
              @click="
                $utils.toUrl(
                  data.user_info.is_live == 1 ? item.url : '/lives/admin/apply',
                  item.open_type
                )
              "
              class="flex-y-center is-line"
              :key="index"
            >
              <image :src="item.icon" mode="aspectFit" />
              <view class="font-24 u-line-2 font-center">
                {{ data.user_info.is_live == 1 ? item.name : item.name_1 }}
              </view>
            </view>
          </template>

          <template v-else-if="item.id == 'kefu'">
            <button
              :open-type="item.open_type"
              class="button-initial flex-y-center is-line"
              :key="index"
            >
              <image :src="item.icon" mode="aspectFit" />
              <view class="font-24 u-line-2 font-center">
                {{ item.name }}
              </view>
            </button>
          </template>

          <template v-else>
            <view
              v-if="isAuthority(item)"
              @click="navTo(item)"
              class="flex-y-center is-line"
              :key="index"
            >
              <image :src="item.icon" mode="aspectFit"></image>
              <view class="font-24 u-line-2 font-center">
                {{ item.name }}
              </view>
            </view>
          </template>
        </template>
      </div>
    </template>

    <!-- 输入条形码 -->
    <u-popup
      :show="showCode"
      @close="switchShow('showCode')"
      mode="center"
      :safeAreaInsetBottom="false"
      round="10px"
    >
      <view style="width: 80vw" class="slot-content">
        <view class="p-20">
          <u-input v-model="codeValue" placeholder="请输入条形码"></u-input>
        </view>
        <view
          class="flex-y-center font-32 font-center"
          style="line-height: 100rpx"
        >
          <text class="flex-w-1" @click="switchShow('showCode')">取消</text>
          <text
            class="flex-w-1"
            style="color: #007aff"
            @click="$utils.toUrl('/pages/clerk/clerk?order_no=' + codeValue)"
            >确定</text
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import siteinfo from '@/siteinfo.js';
export default {
  props: {
    pageData: {
      type: Object,
    },
    data: {
      type: Object,
    },
    isLine: {
      type: [Boolean, String],
      default: false,
    },
  },
  data() {
    return {
      showCode: false,
      codeValue: '',
    };
  },
  methods: {
    async navTo(item) {
      // 当前menu为扫描添加购物车
      if (item.id == 'addcart') {
        let result = await this.$utils.scanCode();
        // 获取商品添加购物车需要的信息
        const res = await this.$requestAll.cart.cartGoods(
          {
            no: result.result,
          },
          true
        );
        console.log(res, '1111111111');

        // 添加购物车
        const res1 = await this.$requestAll.cart.cartOffline(
          {
            num: 1,
            attr: res.data.return_str,
            goods_id: res.data.id,
          },
          true
        );

        // 跳转线下购物车页面
        this.$utils.toUrl('/pages/cartoffline/cartoffline');

        // uni.scanCode({
        //   success: async result => {
        //     console.log(result);
        //     // 获取商品添加购物车需要的信息
        //     const res = await this.$requestAll.cart.cartGoods(
        //       {
        //         no: result.result,
        //       },
        //       true
        //     );
        //     console.log(res, '1111111111');

        //     // 添加购物车
        //     const res1 = await this.$requestAll.cart.cartOffline(
        //       {
        //         num: 1,
        //         attr: res.data.return_str,
        //         goods_id: res.data.id,
        //       },
        //       true
        //     );

        //     // 跳转线下购物车页面
        //     this.$utils.toUrl('/pages/cartoffline/cartoffline');
        //   },
        // });
      } else if (item.id == 'clerk') {
        console.log('hexiao');
        let res = await this.$utils.scanCode();
        console.log(res, '扫码成功');
        this.$utils.toUrl(res.path);

        // uni.showActionSheet({
        //   itemList: ['扫码核销', '输入核销码'],
        //   success: res => {
        //     console.log(res);

        //     if (res.tapIndex == 0) {
        // uni.scanCode({
        //   barCodeInput: true,
        //   success: res => {
        //     console.log(res, '扫码成功');
        //     this.$utils.toUrl('/' + res.path);
        //   },
        // });
        //     } else if (res.tapIndex == 1) {
        //       this.switchShow('showCode');
        //     }
        //   },
        // });
      } else if (item.id == 'appSaoMa') {
        let res = await this.$utils.scanCode();
        console.log(res, '扫码成功');
        this.$utils.toUrl(res.path);

        // uni.scanCode({
        //   success: res => {
        //     console.log(res, '扫码成功');
        //     this.$utils.toUrl('/' + res.path);
        //   },
        // });
      }
      //  else if (item.id == 'fenxiao') {
      //   if (this.data.user_info.is_distributor == 0) {
      //     switch (this.data.share_setting.share_condition) {
      //       case '1':
      //         this.$utils.toUrl('/pages/add-share/index');
      //         break;
      //       case '0':
      //         uni.showModal({
      //           title: '申请成为分销商',
      //           content: '是否申请?',
      //           success: async res => {
      //             if (res.confirm) {
      //               await this.$requestAll.share.join({}, true);
      //               this.$utils.toUrl('/pages/add-share/index');
      //             }
      //           },
      //         });
      //         break;

      //       default:
      //         uni.showModal({
      //           title: '申请成为分销商',
      //           content: '是否申请?',
      //           success: async res => {
      //             if (res.confirm) {
      //               await this.$requestAll.share.join({}, true);
      //               this.$utils.toUrl(item.url, item.open_type);
      //             }
      //           },
      //         });
      //         break;
      //     }
      //   } else if (this.data.user_info.is_distributor == 2) {
      //     this.$utils.toUrl('/pages/add-share/index');
      //   } else {
      //     this.$utils.toUrl(item.url, item.open_type);
      //   }
      // } 
      else if (item.id == 'dianhua') {
        uni.makePhoneCall({
          phoneNumber: item.tel,
          success:(success)=>{
            console.log('拨打电话成功',success);
          },
          fail:(err) => {
            console.log('拨打电话失败',err);
            uni.showModal({
              title: '拨打电话失败！',
              content: err,
              showCancel: true,
              success: ({ confirm, cancel }) => {}
            })
          }
        });
      } else if (item.id == 'is_kefu') {
        this.$utils.toUrl('/kefu/kefu?is_user_list=true');
      } else if (item.id == 'is_kefu_window') {
        let params = {
          to_user_id: this.store.kefu_setting.mobile,
          to_user_nickname: '平台客服',
          to_user_img: this.store.copyright_pic_url,
          to_mch_id: 0,
        };
        this.$utils.toUrl(item.url.split('?')[0] + '?data=' + encodeURIComponent(JSON.stringify(params)));
        
      } 
      else if(item.id == 'clear_cache') {
        uni.showModal({
          title: '提示',
          content: '是否清除缓存？',
          showCancel: false,
          success: (res) => {
            this.$store.dispatch('getShopConfig')
          }
        })
      }
	  else if(item.id == 'region_recommend'){
		  const userInfo = await uni.getStorage({ key: 'userInfo' });
		  const userId = userInfo[1].data.id;
		  const res = await this.$requestAll.agentApproval.index({ user_id: userId }, true);
		  if (res.data.list.status == 1) {
		  	this.$utils.toUrl(
		  	  '/agent/region-divvy/user', "redirectTo");
		  }else{
			   this.$utils.toUrl(item.url);
		  }
	  }
      else {
        this.$utils.toUrl(item.url, item.open_type);
      }
    },
    switchShow(key) {
      this[key] = !this[key];
    },
    // 返回客服ID
    getKefuId: function (mch_id, store_id) {
      let host = siteinfo.kefu_host.replace(/http(s)?:\/\//g, '');
      return host + '_' + mch_id + '_kefu_' + store_id;
    },
	
  },
  computed: {
    userInfo() {
      return this.$store.getters['user/userInfo'];
    },
    isAuthority() {
      return function (item) {
        if (item.id === 'app_admin') {
          return this.userInfo.is_admin;
        }
        // 核销yuan
        // else if (item.id == 'clerk') {
        //   return this.userInfo.is_clerk;
        // }
        return true;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.module-item {
  border-radius: 10rpx;
  background: #fff;

  .title {
    padding: 20rpx;
    font-size: 30rpx;
    color: #000;
    font-weight: bold;
  }

  .moudule-content {
    display: flex;
    flex-wrap: wrap;

    > view,
    button {
      margin: 24rpx 0;
      width: 25%;

      > image {
        margin-bottom: 12rpx;
        width: 50rpx;
        height: 50rpx;
      }
    }

    .is-line {
      width: initial;
      margin: 0;
      padding: 24rpx;
      border-bottom: 1px solid #eee;
      &:nth-last-child(1) {
        border-bottom: 0 solid #000;
      }

      > image {
        margin-bottom: 0;
      }
      > view {
        margin-left: 20rpx;
      }
    }
  }
}
</style>
