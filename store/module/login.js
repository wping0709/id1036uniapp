import $requestAll from '@/api/index'
import store from '@/store/index'
export default {
	namespaced: true,
	state: {
		user: {
			name: '123'
		}
	},
	mutations: {
		// 设置缓存
		login (state, data) {
			uni.setStorageSync('token', data.access_token)
			console.log(store,'store');
			store.commit('user/setUserInfo',data)
			uni.setStorageSync('userInfo', data)
		}
	},
	actions: {
		async logout (t, data) {
			try {
				const res = await $requestAll.user.userLogout({}, true);
				let store_id = JSON.parse(JSON.stringify(store.getters['currentStore'].id))
				store.commit('reset',store.$initialData)
				uni.clearStorageSync()
				store.commit("setCurrentStore", { id: store_id });
				data.success && data.success()
			} catch (error) {
				console.log(error, 'logout');
			}

		}
	}
}
