import request from '@/utils/request.js'
export default {
	verifyOrder(data, loading) {
		return request.GET('/verify/verify-order', data, loading)
	},
	verifyIndex(data, loading) {
		return request.GET('/verify/index', data, loading)
	},
	verifyDetail(data, loading) {
		return request.GET('/verify/verify-detail', data, loading)
	},
	verifyLog(data, loading) {
		return request.GET('/verify/verify-log', data, loading)
	},
	
}
