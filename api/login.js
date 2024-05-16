import request from '@/utils/request.js'
export default {
	wxLogin(data, loading) {
		return request.POST('/passport/login', data, loading)
	},
	loginPhone(data, loading) {
		return request.POST('/passport/login-phone', data, loading)
	},
	// code换取用户头像昵称
	passportCode(data, loading) {
		return request.POST('/passport/code', data, loading)
	},
	// 获取用户信息
	checkCityLogin(data, loading) {
		return request.POST('/passport/check-city-login', data, loading)
	},

}
