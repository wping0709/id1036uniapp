export default {
	data () {
		return {}
	},
	computed: {
		getAppInfo(){
			return uni.getStorageSync("APP_INFO") || {}
		},

		// 设备信息
		systemInfo () {
			const systemInfo = uni.getStorageSync('systemInfo')
			if (!systemInfo) {
				return uni.getSystemInfoSync()
			} else {
				return systemInfo
			}
		},
		wxapp_img () {
			return this.$store.getters['wxapp_img']
		},
		store () {
			return this.$store.getters['SHOP_CONFIG'].store
		}
	},
	onLoad () {
		uni.hideTabBar()
		// 设置头部标题
		this.SETTITLE()
		// 获取地理位置
		// this.GETLOCATION()
	},
	methods: {
		// 动态设置页面title
		SETTITLE () {

			let SHOP_CONFIG = this.$store.getters['SHOP_CONFIG']

			// 动态设置导航栏标题
			if (SHOP_CONFIG.wx_bar_title?.length) {
				let page = uni.$u.page()
				page = page.slice(1, page.length)
				let wx_bar_title = SHOP_CONFIG.wx_bar_title
				let item = wx_bar_title.find(item => item.url == page)
				item && uni.setNavigationBarTitle({ title: item.title })
			}
			// #ifdef H5
			let page = uni.$u.page()
			if(page == '/pages/index/index'){
				uni.setNavigationBarTitle({ title: SHOP_CONFIG.store_name })
			}
			// #endif


			// 动态设置导航栏样式
			SHOP_CONFIG.navigation_bar_color && uni.setNavigationBarColor({
				frontColor: SHOP_CONFIG.navigation_bar_color.frontColor || '',
				backgroundColor: SHOP_CONFIG.navigation_bar_color.backgroundColor,
			})
		},

		// 获取定位
		// GETLOCATION () {
		// 	let locationData = this.$store.getters.locationData
		// 	let time = new Date().getTime()
		// 	//当前定位不为真,  且定位已超过10分钟
		// 	if (!locationData || (locationData.current < time - 10 * 60 * 1000 && !locationData.isSwitch)) {
		// 		uni.getLocation({
		// 			type: 'wgs84',
		// 			success: (res) => {
		// 				console.log('当前位置的经度：' + res.longitude);
		// 				console.log('当前位置的纬度：' + res.latitude);

		// 				this.$store.commit('setLoaction', {
		// 					...res,
		// 					currentDate: new Date().getTime()
		// 				})
		// 			},
		// 			fail: (err) => {
		// 				this.$store.commit('setLoaction', {
		// 					longitude: '',
		// 					latitude:'',
		// 					currentDate: new Date().getTime()
		// 				})
		// 			}
		// 		});
		// 	}

		// }
	}
}
