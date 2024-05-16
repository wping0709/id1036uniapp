import request from '@/utils/request'

export default {
	index (data, loading) {
		return request.GET('/lottery/default/index', data, loading)
	},
	prize (data, loading) {
		return request.GET('/lottery/default/prize', data, loading)
	},
	goods (data, loading) {
		return request.GET('/lottery/default/goods', data, loading)
	},
	detail (data, loading) {
		return request.GET('/lottery/default/detail', data, loading)
	},
	clerk (data, loading) {
		return request.GET('/lottery/default/clerk', data, loading)
	},
	luckyCode (data, loading) {
		return request.GET('/lottery/default/lucky-code', data, loading)
	},
	submit (data, loading) {
		return request.POST('/lottery/default/submit', data, loading)
	},
	qrcode (data, loading) {
		return request.GET('/lottery/default/qrcode', data, loading)
	},
}
