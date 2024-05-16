<template>
  <u-popup :show="show" mode="center" bgColor="transparent" :safeAreaInsetBottom="false">
			<view class="popup-box">
					<swiper circular indicator-dots style="height:100%;">
						<swiper-item v-for="(value, index) of swiperList" :key="index">
								<image @click="navTo(value)" style="width:100%;height:100%;" mode="aspectFill" :src="value.pic_url" alt="">
						</swiper-item>
					</swiper>
					<text class="iconfont icon-reeor" @click="show = false"></text>
			</view>
		</u-popup>
</template>

<script>

export default {
  name: 'DiyModal',
  components: {
  },
  data() {
    return {
      show:false
    }
  },
  props: {
    item: Object
  },
  computed: {
    swiperList() {
      
     return this.item.param.list && this.item.param.list.filter(item => {
        if(item.pic_url) {
          return item
        }
      })
    }
  },
  created() {
    if(this.item.param.show == 1 ) {
      // 每次都显示
      if(this.item.param.status == 1) {
        this.show = true
      } else {
        // 判断是否显示过
        const eachShowAd = uni.getStorageSync('eachShowAd')
        if(!eachShowAd) {
          this.show = true
          uni.setStorageSync('eachShowAd', true)
        }
      }
    } 
  },
  methods: {
    navTo(item) {
      // 跳转分销中心
      if(item.url == '/pages/share/index') {
        this.$store.dispatch('user/getUserInfo', {
            success: () => {
              let share_setting =
                this.$store.getters['SHOP_CONFIG'].share_setting;
              let userInfo = this.$store.getters['user/userInfo'];
              if (!userInfo) return uni.$utils.toUrl('/login/login/login_page');
              console.log(userInfo);
              if (userInfo.is_distributor == 0) {
                switch (share_setting.share_condition) {
                  case '1':
                    this.$utils.toUrl('/pages/add-share/index');
                    break;
                  case '0':
                    uni.showModal({
                      title: '申请成为分销商',
                      content: '是否申请?',
                      success: async res => {
                        if (res.confirm) {
                          await this.$requestAll.share.join({}, true);
                          this.$utils.toUrl('/pages/add-share/index');
                        }
                      },
                    });
                    break;

                  default:
                    uni.showModal({
                      title: '申请成为分销商',
                      content: '是否申请?',
                      success: async res => {
                        if (res.confirm) {
                          await this.$requestAll.share.join({}, true);
                          this.$utils.toUrl(item.url, item.open_type);
                        }
                      },
                    });
                    break;
                }
              } else if (userInfo.is_distributor == 2) {
                this.$utils.toUrl('/pages/add-share/index');
              } else {
                this.$utils.toUrl(item.url, item.open_type);
              }
            },
          });
      } else {
        
        this.$utils.toUrl(item.url,item.open_type)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.popup-box {
width:650rpx; height:750rpx; background: rgba(0,0,0,0);
position: relative;
}
.icon-reeor {
  position: absolute;
  left: 50%;
  bottom: -50rpx;
  transform: translate(-50%,50%);
  color: #fff;
  font-size: 60rpx;
}
</style>


