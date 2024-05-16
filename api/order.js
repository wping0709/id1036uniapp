import request from '@/utils/request.js'
export default {
	//打印小票
	printOrder(data, loading) {
		return request.GET('/order/print-order', data, loading)
	},
	//核销订单
	clerkVerify(data, loading) {
		return request.GET('/order/clerk-verify', data, loading)
	},
	//核销订单
	orderClerk(data, loading) {
		return request.GET('/order/clerk', data, loading)
	},

	// 获取核销订单详情
	clerkDetail(data, loading) {
		return request.GET('/order/clerk-detail', data, loading)
	},
	// 获取订单列表
	getOrderList(data, loading) {
		return request.GET('/order/list', data, loading)
	},
	// 获取订单详情
	getOrderDetail(data, loading) {
		return request.GET('/order/detail', data, loading)
	},
	// 获取线下购物车预订单
	orderNewSubmitPreview(data, loading) {
		return request.POST('/order/new-submit-preview', data, loading)
	},
	// 获取预订单信息
	orderSubmitPreview(data, loading) {
		return request.GET('/order/submit-preview', data, loading)
	},
	// 获取预订单信息
	getOrderSubmit(data, loading) {
		return request.POST('/order/new-submit-preview', data, loading)
	},
	// 生成支付订单
	addPayOrder(data, loading) {
		return request.POST('/order/new-submit', data, loading)
	},
	// 取消订单
	orderRevoke(data, loading) {
		return request.GET('/order/revoke', data, loading)
	},
	// 获取二维码
	getQrcode(data, loading) {
		return request.GET('/order/get-qrcode', data, loading)
	},
	quanfan(data, loading) {
		return request.GET('/order/quanfan', data, loading)
	},
	// 物流信息
	expressDetail(data, loading) {
		return request.GET('/order/express-detail', data, loading)
	},
	// 确认收货
	orderConfirm(data, loading) {
		return request.GET('/order/confirm', data, loading)
	},
	// 确认收货
	orderCommentPreview(data, loading) {
		return request.GET('/order/comment-preview', data, loading)
	},
	// 确认收货
	orderComment(data, loading) {
		return request.POST('/order/comment', data, loading)
	},
	// 申请售后
	refundPreview(data, loading) {
		return request.GET('/order/refund-preview', data, loading)
	},
	// 售后提交
	orderRefund(data, loading) {
		return request.POST('/order/refund', data, loading)
	},
	// 售后单详情
	refundDetail(data, loading) {
		return request.GET('/order/refund-detail', data, loading)
	},
	// 售后退货提交
	refundSend(data, loading) {
		return request.POST('/order/refund-send', data, loading)
	},
	// 配送
	peisong(data, loading) {
		return request.GET('/order/peisong', data, loading)
	},

	// 配送
	deliveryOrderConfirm(data, loading) {
		return request.GET('/order/delivery-order-confirm', data, loading)
	},
	// 配送
	deDetail(data, loading) {
		return request.GET('/order/de-detail', data, loading)
	},



}
