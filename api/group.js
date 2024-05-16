import request from '@/utils/request.js'
export default {
	goodsAttrInfo(data, loading) {
		return request.GET('/group/index/goods-attr-info', data, loading)
	},
	orderQrcode(data, loading) {
		return request.GET('/group/order/goods-qrcode', data, loading)
	},
	goodsQrcode(data, loading) {
		return request.GET('/group/index/goods-qrcode', data, loading)
	},
	getComment(data, loading) {
		return request.GET('/group/index/goods-comment', data, loading)
	},
	orderList(data, loading) {
		return request.GET('/group/order/list', data, loading)
	},
	commentPreview(data, loading) {
		return request.GET('/group/order/comment-preview', data, loading)
	},
	comment(data, loading) {
		return request.POST('/group/order/comment', data, loading)
	},
	orderConfirm(data, loading) {
		return request.GET('/group/order/confirm', data, loading)
	},
	index(data, loading) {
		return request.GET('/group/index/index', data, loading)
	},
	indexSearch(data, loading) {
		return request.GET('/group/index/search', data, loading)
	},
	goodDetail(data, loading) {
		return request.GET('/group/index/good-details', data, loading)
	},
	submitPreview(data, loading) {
		return request.GET('/group/order/submit-preview', data, loading)
	},
	submit(data, loading) {
		return request.POST('/group/order/submit', data, loading)
	},
	orderDetail(data, loading) {
		return request.GET('/group/order/detail', data, loading)
	},
	orderGroup(data, loading) {
		return request.GET('/group/order/group', data, loading)
	},
}
