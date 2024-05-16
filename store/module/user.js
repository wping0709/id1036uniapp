import $requestAll from '@/api/index.js'

export default {
	namespaced: true,

	state: {
		vgoods_good: [],
		userInfo: ''
	},
	getters: {
		userInfo (state) {
			let userInfo = uni.getStorageSync('userInfo')
			return state.userInfo ? state.userInfo : userInfo
			// return typeof userInfo == 'string' ? JSON.parse(userInfo) : userInfo
		},
		vgoods_good (state) {
			if (state.vgoods_good.length) {
				return state.vgoods_good
			}
			return uni.getStorageSync('vgoods_good') || []
		}
	},
	mutations: {
		switchGood (state, data) {
			let vgoods_good = uni.getStorageSync('vgoods_good') || []
			let i = vgoods_good.indexOf(data)
			if (i != -1) {
				vgoods_good.splice(i, 1)
			} else {
				vgoods_good.push(data)
			}
			state.vgoods_good = vgoods_good
			uni.setStorageSync('vgoods_good', vgoods_good)
		},
		setUserInfo (state, data) {
			uni.setStorageSync('userInfo', data)
			state.userInfo = data
		}
	},
	actions: {
		// 获取用户信息这里对接用户信息接口,传递参数可传递回调方法
		async getUserInfo (context, data) {
			// 模拟请求数据
			const res = await $requestAll.user.getList({});
			if (res.data.user_info.id) {
				context.commit('setUserInfo', res.data.user_info)
				data && data.success && data.success()
			}
		}
	}
}
