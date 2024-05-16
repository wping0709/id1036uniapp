import siteinfo from '@/siteinfo.js'
import wxConfig from '@/utils/wxConfig'
export default {
  data () {
    return {
      _platform: '',//平台类型
      parent_id: '', //父级id
    }
  },
  onLoad (params) {
    // 微信扫码参数处理
    /* #ifdef MP-WEIXIN */
    if (params.scene) {
      let str = decodeURIComponent(params.scene)
      str.split(',')
        .map(item => {
          return item.split(':')
        })
        .forEach(item => {

          switch (item[0]) {
            case 'uid':
              (params.user_id = item[1])
              break;
            case 'store':
              (params.store_id = item[1])
              break;

            default:
              if (uni.$u.page() == '/pages/goods/goods' && item[0] == 'gid') {
                params.id = item[1]
              } else {
                params[item[0]] = item[1]
              }
              break;
          }
        })
    }
    /* #endif */

    if (siteinfo.api_data._platform == 'h5') {
      params.user_id = params.share_user_id || params.user_id || ''
      delete params.share_user_id
    }

    // 设置store_id
    if (params.store_id && params.store_id > 0) {
      let store_id = this.$store.getters['currentStore'].id


      // 如果切换了城市，更新store_id
      if (store_id != params.store_id) {
        this.$store.commit('setCurrentStore', {
          id: params.store_id || params.store,
        });


        // 如果用户已登陆，更新用户信息及token
        let userInfo = this.$store.getters['user/userInfo']
        if (userInfo.id) {
          this.$requestAll.login.checkCityLogin(
            {
              user_id: userInfo.id,
            },
            true
          ).then((res) => {
            uni.setStorageSync('token', res.data.access_token);
            this.$store.commit('user/setUserInfo', res.data);
          })
        }
      }


    }
    // 绑定上下级
    if (params.user_id) {
      this.parent_id = params.user_id;

      let userInfo = this.$store.getters['user/userInfo']
      if (userInfo && userInfo.parent_id <= 0) {
        this.$requestAll.share.bindParent({
          parent_id: params.user_id,
        }).catch(error => error)
      } else {
        this.$store.commit('setParentId', params.user_id)
      }
    }
    // 设置终端类型
    if (params._platform) {
      this._platform = params._platform;
    }


  },
  methods: {
    async webPageShare () {
      if (!this.$utils.is_webpage()) return
      var that = this
      uni.$u.throttle(() => {
        wxConfig.init(['onMenuShareAppMessage', 'onMenuShareTimeline']).then((jWeixin) => {
          var shareData = {
            title: that.shareData.title ? that.shareData.title : that.store.name,
            desc: that.shareData.desc || '', // 分享描述
            link: siteinfo.siteroot + that.shareData.path || '', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: that.shareData.imageUrl || that.store.store_share_logo || that.store.logo, // 分享图标
          }

          jWeixin.onMenuShareAppMessage({
            ...shareData,
            success: () => {
              console.log(shareData, 'shareData', that.shareData, 'this.shareData');
            },
            fail: (err) => {
              uni.$u.toast(err)
            }
          })

          jWeixin.onMenuShareTimeline({
            ...shareData,
            success: () => {
              console.log(shareData, 'shareData', that.shareData, 'this.shareData');
            },
            fail: (err) => {
              uni.$u.toast(err)
            }
          })
        })
      }, 500, false)
    }
  },
  watch: {
    // 监听分享数据，生成公众号分享设置
    // #ifdef H5
    shareData: {
      handler (val) {
        if (!val) return
        this.webPageShare()
      },
      immediate: true
    }
    // #endif
  },
  onShow () {
    this.webPageShare()
  },
  onShareAppMessage () {
    // 默认当前路基及分享参数配置
    let path = uni.$u.page()
    path = path + this.$u.queryParams({
      user_id: this.$store.getters['user/userInfo'].id || '',
      store_id: this.$store.getters['currentStore'].id || '',
      // #ifdef APP-PLUS
      _platform: 'app',
      // #endif
    })

    let title = ''
    let SHOP_CONFIG = this.$store.getters['SHOP_CONFIG']
    // 动态设置导航栏标题
    if (SHOP_CONFIG.wx_bar_title?.length) {
      let page = uni.$u.page()
      page = page.slice(1, page.length)
      let wx_bar_title = SHOP_CONFIG.wx_bar_title
      let item = wx_bar_title.find(item => item.url == page)
      item && (title = item.title)
    }

    let source = 1
    // #ifdef H5
    if (this.$utils.is_webPage()) source = 2
    // #endif
    // #ifdef APP-PLUS
    source = 3
    // #endif

    this.$requestAll.default.shareLog({
      source
    })
    return {
      path: path,
      title: title || this.store.name,
      ...this.shareData,
    }
  },

  // #ifdef MP-WEIXIN
  onShareTimeline () {
    // 默认当前路基及分享参数配置
    let path = uni.$u.page()
    path = path + this.$u.queryParams({
      user_id: this.$store.getters['user/userInfo'].id || '',
      store_id: this.$store.getters['currentStore'].id || '',
      // #ifdef APP-PLUS
      _platform: 'app',
      // #endif
    })

    // 默认title
    let title = ''
    let SHOP_CONFIG = this.$store.getters['SHOP_CONFIG']
    // 动态设置导航栏标题
    if (SHOP_CONFIG.wx_bar_title?.length) {
      let page = uni.$u.page()
      page = page.slice(1, page.length)
      let wx_bar_title = SHOP_CONFIG.wx_bar_title
      let item = wx_bar_title.find(item => item.url == page)
      item && (title = item.title)
    }

    let source = 1
    // #ifdef H5
    if (this.$utils.is_webPage()) source = 2
    // #endif
    // #ifdef APP-PLUS
    source = 3
    // #endif

    this.$requestAll.default.shareLog({
      source
    })

    return {
      path: path,
      title: title || this.store.name,
      ...this.shareData,
    }
  }
  // #endif
}
