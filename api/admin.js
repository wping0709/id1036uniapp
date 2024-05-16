import request from '@/utils/request'
export default {
	getGoodsCat(data, loading) {
		return request.GET('/admin/goods/get-cat', data, loading)
	},
	sellerComments(data, loading) {
		return request.GET('/admin/order/seller-comments', data, loading)
	},
	getMchCat(data, loading) {
		return request.GET('/admin/goods/get-mch-cat', data, loading)
	},
	postAge(data, loading) {
		return request.GET('/admin/goods/postage', data, loading)
	},
	goodsEdit(data, loading) {
		return request.POST('/admin/goods/edit', data, loading)
	},
	getGoods(data, loading) {
		return request.GET('/admin/goods/edit', data, loading)
	},
	index(data, loading) {
		return request.POST('/admin/index/index', data, loading)
	},
	userInfo(data, loading) {
		return request.POST('/admin/index/user-info', data, loading)
	},
	indexTable(data, loading) {
		return request.POST('/admin/index/table', data, loading)
	},
	orderGetList(data, loading) {
		return request.POST('/admin/order/get-list', data, loading)
	},
	orderGetRefund(data, loading) {
		return request.POST('/admin/order/get-refund', data, loading)
	},
	goodsList(data, loading) {
		return request.GET('/admin/goods/list', data, loading)
	},
	goodsSwitch(data, loading) {
		return request.POST('/admin/goods/goods-switch', data, loading)
	},
	goodsDel(data, loading) {
		return request.POST('/admin/goods/goods-del', data, loading)
	},

	settingIndex(data, loading) {
		return request.GET('/admin/setting/index', data, loading)
	},

	setting(data, loading) {
		return request.POST('/admin/setting/setting', data, loading)
	},
	address(data, loading) {
		return request.POST('/admin/setting/address', data, loading)
	},
	mchReview(data, loading) {
		return request.GET('/admin/mch/review', data, loading)
	},
	reviewDetail(data, loading) {
		return request.GET('/admin/mch/review-detail', data, loading)
	},
	reviewSwitch(data, loading) {
		return request.POST('/admin/mch/review-switch', data, loading)
	},
	cashList(data, loading) {
		return request.GET('/admin/cash/list', data, loading)
	},
	cashSubmit(data, loading) {
		return request.GET('/admin/cash/submit', data, loading)
	},
	commentList(data, loading) {
		return request.GET('/admin/comment/list', data, loading)
	},
	commentHide(data, loading) {
		return request.POST('/admin/comment/hide', data, loading)
	},
	commentDetail(data, loading) {
		return request.GET('/admin/comment/detail', data, loading)
	},
	commentReply(data, loading) {
		return request.POST('/admin/comment/reply', data, loading)
	},
	shareList(data, loading) {
		return request.GET('/admin/share/list', data, loading)
	},
	shareStatus(data, loading) {
		return request.POST('/admin/share/status', data, loading)
	},
	userUser(data, loading) {
		return request.GET('/admin/user/user', data, loading)
	},
	userClerk(data, loading) {
		return request.GET('/admin/user/clerk', data, loading)
	},
	userIntegral(data, loading) {
		return request.POST('/admin/user/integral', data, loading)
	},
	userBalance(data, loading) {
		return request.POST('/admin/user/balance', data, loading)
	},
	clerkEdit(data, loading) {
		return request.POST('/admin/user/clerk-edit', data, loading)
	},
	catCat(data, loading) {
		return request.GET('/admin/cat/cat-new', data, loading)
	},
	catDelete(data, loading) {
		return request.POST('/admin/cat/delete', data, loading)
	},
	catStatus(data, loading) {
		return request.POST('/admin/cat/status', data, loading)
	},
	catEdit(data, loading) {
		return request.GET('/admin/cat/edit', data, loading)
	},
	getCat(data, loading) {
		return request.GET('/admin/cat/get-cat', data, loading)
	},
	pickLink(data, loading) {
		return request.GET('/admin/cat/pick-link', data, loading)
	},
	catEditPost(data, loading) {
		return request.POST('/admin/cat/edit', data, loading)
	},
	orderDetail(data, loading) {
		return request.GET('/admin/order/detail', data, loading)
	},
	orderSend(data, loading) {
		return request.POST('/admin/order/send', data, loading)
	},
	orderCancel(data, loading) {
		return request.POST('/admin/order/cancel', data, loading)
	},
	updatePrice(data, loading) {
		return request.POST('/admin/order/update-price', data, loading)
	},
	refundHandle(data, loading) {
		return request.POST('/admin/order/refund-handle', data, loading)
	},
	orderExpress(data, loading) {
		return request.GET('/admin/order/express', data, loading)
	},
	exDetail(data, loading) {
		return request.POST('/admin/order/ex-detail', data, loading)
	},
	orderSend(data, loading) {
		return request.POST('/admin/order/send', data, loading)
	},
	refundHandle(data, loading) {
		return request.POST('/admin/order/refund-handle', data, loading)
	},



}
