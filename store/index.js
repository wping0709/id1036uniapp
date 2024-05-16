import Vue from "vue";
import Vuex from "vuex";
import user from "./module/user";
import login from "./module/login";
import search from "./module/search";
import requestAll from '@/api/index.js'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		SHOP_CONFIG: '', //商城配置资源
		wxapp_img: '', //服务器图片资源
		locationData: '', // 经纬度信息
		address: "",
		ADDRESS_INFO: '', //门店信息
		currentStore: '', //当前选中城市信息
		storeHistory: '', //城市选择历史
		tabBarData: '',  //tabBar数据
		cacheData: '',  //缓存数据
		parent_id: '', //上级邀请人id， 用于登录时判断是否有上级做绑定
	},
	getters: {
		parent_id (state) {
			return state.parent_id || uni.getStorageSync('parent_id')
		},
		cacheData (state) {
			return state.cacheData || uni.getStorageSync('cacheData')
		},
		tabBarData (state) {
			return state.tabBarData || uni.getStorageSync('tabBarData')
		},
		SHOP_CONFIG (state) {
			if (!state.SHOP_CONFIG) {
				return uni.getStorageSync('SHOP_CONFIG')
			} else {
				return state.SHOP_CONFIG
			}
		},
		locationData (state) {

			return state.locationData || uni.getStorageSync('locationData')

		},
		ADDRESS_INFO (state) {
			if (state.ADDRESS_INFO) {
				return state.ADDRESS_INFO
			} else {
				return uni.getStorageSync('ADDRESS_INFO')
			}
		},
		currentStore (state) {
			const siteinfo = require('@/siteinfo.js')
			return state.currentStore || uni.getStorageSync('currentStore') || {id: siteinfo.api_data.store_id}
		},
		storeHistory (state) {
			return state.storeHistory || uni.getStorageSync('storeHistory')
		},
		wxapp_img (state) {
			return state.wxapp_img || uni.getStorageSync('wxapp_img')
		},
		systemInfo (state) {
			return state.systemInfo || uni.getStorageSync('systemInfo')
		},
		mchCartDataList (state) {
			return uni.getStorageSync('mchCartDataList') || [];
		},
		mchFoodDataList (state) {
			return uni.getStorageSync('mchFoodDataList') || [];
		}
	},
	mutations: {
		reset(state,data) {
			state = data
		},
		// 设置设备信息
		setSystemInfo (state, data) {
			console.log(data, '设置设备信息');
			uni.setStorageSync('systemInfo', data)
			state.systemInfo = data
		},
		// 设置页面缓存信息
		setCacheData (state, data) {
			uni.setStorageSync('cacheData', data)
			state.cacheData = data
		},
		// 设置商城配置
		setShopConfig (state, data) {
			uni.setStorageSync('SHOP_CONFIG', data)
			state.SHOP_CONFIG = data
		},
		setImages (state, data) {
			uni.setStorageSync('wxapp_img', data)
			state.wxapp_img = data
		},
		// 设置经纬度
		setLoaction (state, data) {
			console.log(data);
			state.locationData = data
			uni.setStorageSync('locationData', data)
		},

		// 设置地址信息
		setAddress: (state, data) => {
			state.address = data
			uni.setStorageSync('address', data)
		},

		setShop (state, data) {
			uni.setStorageSync('ADDRESS_INFO', data)
			state.ADDRESS_INFO = data
		},
		setCurrentStore (state, data) {
			uni.setStorageSync('currentStore', data)
			state.currentStore = data
			
			var storeHistory = state.storeHistory || uni.getStorageSync('storeHistory') || []
			if (!storeHistory.some(item => item.id == data.id)) {
				storeHistory.push(data)
				state.storeHistory = storeHistory
			}
		},
		setTabBarData (state, data) {
			uni.setStorageSync('tabBarData', data)
			state.tabBarData = data
		},
		// 设置上级邀请人id
		setParentId (state, id) {
			uni.setStorageSync('parent_id', id)
			state.parent_id = id
		},

		// 缓存商家购物车数据
		setMchShopCartData (state, mchData) {

			let mchCartDataList = uni.getStorageSync('mchCartDataList') || [];
			let index = mchCartDataList.findIndex(mch => mch.id == mchData.id)
			if (index != -1) {
				mchCartDataList.splice(index, 1, mchData)
			} else {
				mchCartDataList.push(mchData)
			}

			uni.setStorageSync('mchCartDataList', mchCartDataList);

		},

		// 增加扫码点餐已添加商品缓存
		setMchFoodCartData(state,cartData){
			let mchFoodDataList = uni.getStorageSync('mchFoodDataList') || [];
			let index = mchFoodDataList.findIndex(mch => mch.id == cartData.id)
			if(index != -1){
				mchFoodDataList.splice(index,1,cartData)
			}else{
				mchFoodDataList.push(cartData);
			}
			uni.setStorageSync('mchFoodDataList', mchFoodDataList);
		}
	},
	actions: {
		// 获取tabBarData
		async getTabBarData ({
			commit
		}) {
			const res = await requestAll.config.getTabBar();
			commit('setTabBarData', res.data)
		},

		// 获取商城配置
		async getShopConfig ({ commit }) {
			// 获取商城配置
			var res = await requestAll.config.getShopConfig({});
			delete res.data.wxapp_img
			commit("setShopConfig", res.data);
		},

		// 获取服务器图片资源
		async getImage ({ commit }) {
			console.log(1);
			var res = await requestAll.config.getImage({})
			commit("setImages", res.data)
			console.log(2);
		},
		// 绑定上级
		async bindParent (t) {
			let parent_id = t.getters['parent_id']
			requestAll.share.bindParent({
				parent_id: parent_id,
			})
			t.commit('setParentId', '')
		},
		// 商品浏览统计
		goodsBrowseLog (t, goods_id) {
			let params = {
				goods_id: goods_id
			}
			// #ifdef APP-PLUS
			params.source = 3
			// #endif
			// #ifdef H5
			params.source = 2
			// #endif
			// #ifdef MP-WEIXIN
			params.source = 1
			// #endif
			requestAll.default.goodsBrowseLog(params)
		},
		// 小程序浏览量
		visitLog (t) {
			let params = {
			}
			// #ifdef APP-PLUS
			params.source = 3
			// #endif
			// #ifdef H5
			params.source = 2
			// #endif
			// #ifdef MP-WEIXIN
			params.source = 1
			// #endif

			requestAll.default.visitLog(params)

		},
		// 获取经纬度
		GETLOCATION (t) {
			// 获取定位逻辑如下：
			// 1.判断是否拒绝过定位。不再弹起授权框，改为指导用户授权（app要求）
			// 1.1 查询是否已打开授权，没有提示用户打开授权，如果用户已打开正常获取定位信息，需清除拒绝定位操作。用于下次调用定位获取最新位置。
			// 2.未定位过 || 定位超时  重新更新当前位置
			// 3.默认返回定位为空，防止报错
			return new Promise((resolve, reject) => {

				let locationData = t.getters['locationData']
				let time = new Date().getTime()
				let noLocation = uni.getStorageSync('noLocation');
				console.log(locationData);
				// 用户拒绝过授权定位
				if (noLocation) {
					console.log('用户拒绝过授权定位');
					// 判断用户是否已打开定位权限  未打开引导用户去打开
					uni.getSetting({
						success: ({ authSetting }) => {
							console.log(authSetting);
							if (authSetting['scope.userLocation']) {
								uni.getLocation({
									type: 'gcj02',
									success: (res) => {
										console.log('当前位置的经度：' + res.longitude);
										console.log('当前位置的纬度：' + res.latitude);

										t.commit('setLoaction', {
											...res,
											currentDate: time
										})
										resolve({
											...res,
											currentDate: time
										})
									},
									fail: (err) => {
										console.log(err);
										if (err.errMsg === 'getLocation:fail auth deny') {
											uni.setStorageSync('noLocation', true);
										}
										console.log(err, '定位失败');
										t.commit('setLoaction', {
											longitude: '',
											latitude: '',
											currentDate: time
										})
										uni.showModal({
											title: '未开启手机GPS',
											content: `请确认手机已打开GPS授权定位！错误代码：${err.errMsg}`,
											showCancel: false,
											success: ({ confirm }) => {
												confirm && resolve({
													longitude: '',
													latitude: '',
													currentDate: time
												})
											},
											fail: () => { },
											complete: () => { }
										});

									}
								})
								uni.removeStorageSync('noLocation');
							} else {
								uni.showModal({
									title: '授权提示',
									content: '您未开启定位权限，请前往设置打开定位权限。',
									showCancel: true,
									cancelText: '关闭',
									confirmText: '去打开',
									success: (result) => {
										if (result.confirm) {
											uni.openSetting()
										}
										resolve({
											longitude: '',
											latitude: '',
											currentDate: time
										})
									},
									fail: () => { },
									complete: () => { }
								});
							}
						}
					})

				}
				// 未定位过 || 定位已超过1分钟
				else if (!locationData || (locationData.currentDate < time - 1 * 60 * 1000 && !locationData.isSwitch)) {
					console.log('未定位过 || 定位已超过1分钟');
					uni.getLocation({
						type: 'gcj02',
						success: (res) => {
							console.log('当前位置的经度：' + res.longitude);
							console.log('当前位置的纬度：' + res.latitude);

							t.commit('setLoaction', {
								...res,
								currentDate: time
							})
							resolve({
								...res,
								currentDate: time
							})
						},
						fail: (err) => {
							if (err.errMsg === 'getLocation:fail auth deny') {
								uni.setStorageSync('noLocation', true);
							}
							console.log(err, '定位失败');
							t.commit('setLoaction', {
								longitude: '',
								latitude: '',
								currentDate: time
							})
							uni.showModal({
								title: '未开启手机GPS',
								content: `请确认手机已打开GPS授权定位！错误代码：${err.errMsg}`,
								showCancel: false,
								success: ({ confirm }) => {
									confirm && resolve({
										longitude: '',
										latitude: '',
										currentDate: time
									})
								},
								fail: () => { },
								complete: () => { }
							});
						}
					})
				} else {
					console.log('其他else');
					resolve(locationData)
				}

			})

		}

	},

	modules: {
		user,
		login,
		search
	},
});

// 定义初始化数据，主要用作恢复初始化数据
Vuex.Store.prototype.$initialData = JSON.parse(JSON.stringify(store.state))

export default store;
