import request from '@/utils/request'
export default {
	// 获取流水
	record(data, loading) {
		return request.GET('/recharge/record', data, loading)
	},
	// 获取流水及余额
	index(data, loading) {
		return request.GET('/recharge/index', data, loading)
	},
	// 充值列表
	list(data, loading) {
		return request.GET('/recharge/list', data, loading)
	},
	daifang(data, loading) {
		return request.GET('/recharge/daifang', data, loading)
	},
	yifang(data, loading) {
		return request.GET('/recharge/yifang', data, loading)
	},

}
