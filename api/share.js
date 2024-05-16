import request from '@/utils/request.js'
export default {
	index(data, loading) {
		return request.GET('/share/index', data, loading)
	},
	check(data, loading) {
		return request.GET('/share/check', data, loading)
	},
	bindParent(data, loading) {
		return request.GET('/share/bind-parent', data, loading)
	},
	getInfo(data, loading) {
		return request.GET('/share/get-info', data, loading)
	},
	getPrice(data, loading) {
		return request.GET('/share/get-price', data, loading)
	},
	cashDetail(data, loading) {
		return request.GET('/share/cash-detail', data, loading)
	},
	getQrcode(data, loading) {
		return request.GET('/share/get-qrcode', data, loading)
	},
	apply(data, loading) {
		return request.POST('/share/apply', data, loading)
	},
	getTeam(data, loading) {
		return request.GET('/share/get-team', data, loading)
	},
	getOrder(data, loading) {
		return request.GET('/share/get-order', data, loading)
	},
	join(data, loading) {
		return request.GET('/share/join', data, loading)
	},
	postJoin(data, loading) {
		return request.POST('/share/join', data, loading)
	},
}
