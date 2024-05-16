import request from '@/utils/request.js'

export default {
	index(data, loading) {
		return request.GET('/bargain/default/index', data, loading)
	},
	orderList(data, loading) {
		return request.GET('/bargain/order/order-list', data, loading)
	},
	goods(data, loading) {
		return request.GET('/bargain/default/goods', data, loading)
	},
	qrcode(data, loading) {
		return request.GET('/bargain/default/qrcode', data, loading)
	},
	// 砍价订单提交
	bargainSubmit(data, loading) {
		return request.POST('/bargain/order/bargain-submit', data, loading)
	},
	// 砍价
	orderBargain(data, loading) {
		return request.GET('/bargain/order/bargain', data, loading)
	},
	// 砍价订单信息
	orderActivity(data, loading) {
		return request.GET('/bargain/order/activity', data, loading)
	},
	// 砍价规则
	defaultSetting(data, loading) {
		return request.GET('/bargain/default/setting', data, loading)
	},

}
